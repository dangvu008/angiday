import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { kitchenService, ShoppingCostStatistics } from '@/services/kitchenService';
import { formatVNDPrice, formatPeriodValue } from '@/utils/vndPriceUtils';
import { toast } from 'sonner';

interface ShoppingCostStatisticsProps {
  className?: string;
}

interface StatisticsSummary {
  totalCost: number;
  avgCostPerMeal: number;
  mealCount: number;
  categoryBreakdown: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const ShoppingCostStatistics: React.FC<ShoppingCostStatisticsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<ShoppingCostStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Load statistics
  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user, selectedPeriod]);

  const loadStatistics = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const stats = await kitchenService.getShoppingCostStatistics(user.id, selectedPeriod);
      setStatistics(stats.sort((a, b) => b.periodValue.localeCompare(a.periodValue)));
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast.error('Không thể tải thống kê chi phí');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary statistics
  const summary = useMemo((): StatisticsSummary => {
    if (statistics.length === 0) {
      return {
        totalCost: 0,
        avgCostPerMeal: 0,
        mealCount: 0,
        categoryBreakdown: {},
        trend: 'stable',
        trendPercentage: 0
      };
    }

    const latest = statistics[0];
    const previous = statistics[1];
    
    // Calculate trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;
    
    if (previous) {
      const change = latest.totalCost - previous.totalCost;
      trendPercentage = Math.abs((change / previous.totalCost) * 100);
      
      if (change > 0) trend = 'up';
      else if (change < 0) trend = 'down';
    }

    // Aggregate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    statistics.slice(0, 3).forEach(stat => {
      Object.entries(stat.categoryBreakdown).forEach(([category, cost]) => {
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + cost;
      });
    });

    return {
      totalCost: latest.totalCost,
      avgCostPerMeal: latest.avgCostPerMeal,
      mealCount: latest.mealCount,
      categoryBreakdown,
      trend,
      trendPercentage
    };
  }, [statistics]);

  // Get period display name
  const getPeriodDisplayName = (period: string) => {
    const names: Record<string, string> = {
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần',
      monthly: 'Hàng tháng',
      yearly: 'Hàng năm'
    };
    return names[period] || period;
  };

  // Format period value for display
  const formatPeriodForDisplay = (periodType: string, periodValue: string) => {
    switch (periodType) {
      case 'daily':
        return new Date(periodValue).toLocaleDateString('vi-VN');
      case 'weekly':
        return `Tuần ${periodValue.split('-W')[1]}, ${periodValue.split('-')[0]}`;
      case 'monthly': {
        const [year, month] = periodValue.split('-');
        return `Tháng ${month}/${year}`;
      }
      case 'yearly':
        return `Năm ${periodValue}`;
      default:
        return periodValue;
    }
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Thống kê chi phí mua sắm
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'daily' | 'weekly' | 'monthly' | 'yearly')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Ngày</TabsTrigger>
            <TabsTrigger value="weekly">Tuần</TabsTrigger>
            <TabsTrigger value="monthly">Tháng</TabsTrigger>
            <TabsTrigger value="yearly">Năm</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPeriod} className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatVNDPrice(summary.totalCost)}
                  </div>
                  <div className="text-sm text-gray-600">Tổng chi phí</div>
                  <div className="flex items-center justify-center mt-1">
                    {summary.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : summary.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : null}
                    <span className={`text-xs ${
                      summary.trend === 'up' ? 'text-red-500' : 
                      summary.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {summary.trendPercentage.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatVNDPrice(summary.avgCostPerMeal)}
                  </div>
                  <div className="text-sm text-gray-600">Chi phí/bữa</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {summary.mealCount}
                  </div>
                  <div className="text-sm text-gray-600">Số bữa ăn</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(summary.categoryBreakdown).length}
                  </div>
                  <div className="text-sm text-gray-600">Danh mục</div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Phân bổ theo danh mục
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(summary.categoryBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, cost]) => {
                      const percentage = (cost / summary.totalCost) * 100;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="font-medium">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatVNDPrice(cost)}</div>
                            <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Historical Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Lịch sử chi phí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statistics.slice(0, 10).map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {formatPeriodForDisplay(stat.periodType, stat.periodValue)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.mealCount} bữa ăn
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatVNDPrice(stat.totalCost)}</div>
                        <div className="text-sm text-gray-600">
                          {formatVNDPrice(stat.avgCostPerMeal)}/bữa
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShoppingCostStatistics;
