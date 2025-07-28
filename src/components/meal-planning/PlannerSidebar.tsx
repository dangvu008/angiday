import React, { useState } from 'react';
import { 
  Calculator, 
  Flame, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Target,
  ShoppingCart,
  FileText,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { WeekPlan, CalculationResult } from '@/types/meal-planning';
import NutritionAnalytics from './NutritionAnalytics';

interface PlannerSidebarProps {
  weeklyStats: CalculationResult;
  currentPlan: WeekPlan | null;
  onPlanUpdate: (plan: WeekPlan) => void;
}

const PlannerSidebar: React.FC<PlannerSidebarProps> = ({
  weeklyStats,
  currentPlan,
  onPlanUpdate
}) => {
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const getDailyAverage = (total: number) => {
    return currentPlan ? total / 7 : 0;
  };

  const getNutritionPercentage = () => {
    const total = weeklyStats.nutrition.protein + weeklyStats.nutrition.carbs + weeklyStats.nutrition.fat;
    if (total === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: (weeklyStats.nutrition.protein / total) * 100,
      carbs: (weeklyStats.nutrition.carbs / total) * 100,
      fat: (weeklyStats.nutrition.fat / total) * 100
    };
  };

  const nutritionPercentages = getNutritionPercentage();

  const getCompletedDaysCount = () => {
    if (!currentPlan) return 0;
    return currentPlan.days.filter(day => 
      day.meals.breakfast.dishes.length > 0 || 
      day.meals.lunch.dishes.length > 0 || 
      day.meals.dinner.dishes.length > 0
    ).length;
  };

  const getProgressPercentage = () => {
    const completed = getCompletedDaysCount();
    return (completed / 7) * 100;
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tổng quan tuần
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ</span>
              <span className="text-sm text-gray-600">
                {getCompletedDaysCount()}/7 ngày
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          <Separator />

          {/* Weekly Stats */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Calories</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    {weeklyStats.calories.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    ~{getDailyAverage(weeklyStats.calories).toFixed(0)}/ngày
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Chi phí</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {(weeklyStats.cost / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-600">
                    ~{(getDailyAverage(weeklyStats.cost) / 1000).toFixed(0)}k/ngày
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Thời gian</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(weeklyStats.cookingTime / 60)}h {weeklyStats.cookingTime % 60}p
                  </div>
                  <div className="text-xs text-gray-600">
                    ~{getDailyAverage(weeklyStats.cookingTime).toFixed(0)}p/ngày
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Dinh dưỡng
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNutritionDetails(!showNutritionDetails)}
            >
              {showNutritionDetails ? 'Ẩn' : 'Chi tiết'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Macro Distribution */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Protein</span>
                <span className="text-sm font-medium">
                  {nutritionPercentages.protein.toFixed(1)}%
                </span>
              </div>
              <Progress value={nutritionPercentages.protein} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Carbs</span>
                <span className="text-sm font-medium">
                  {nutritionPercentages.carbs.toFixed(1)}%
                </span>
              </div>
              <Progress value={nutritionPercentages.carbs} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Fat</span>
                <span className="text-sm font-medium">
                  {nutritionPercentages.fat.toFixed(1)}%
                </span>
              </div>
              <Progress value={nutritionPercentages.fat} className="h-2" />
            </div>
          </div>

          {showNutritionDetails && (
            <>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span>{weeklyStats.nutrition.protein.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs:</span>
                  <span>{weeklyStats.nutrition.carbs.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat:</span>
                  <span>{weeklyStats.nutrition.fat.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fiber:</span>
                  <span>{weeklyStats.nutrition.fiber.toFixed(1)}g</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Tạo danh sách mua sắm
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Xuất thực đơn PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setShowAnalytics(true)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Phân tích dinh dưỡng
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt kế hoạch
          </Button>
        </CardContent>
      </Card>

      {/* Plan Info */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin kế hoạch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium">Tên:</span>
              <p className="text-sm text-gray-600">{currentPlan.name}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium">Thời gian:</span>
              <p className="text-sm text-gray-600">
                {new Date(currentPlan.startDate).toLocaleDateString('vi-VN')} - {' '}
                {new Date(currentPlan.endDate).toLocaleDateString('vi-VN')}
              </p>
            </div>

            {currentPlan.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentPlan.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-sm font-medium">Cập nhật:</span>
              <p className="text-sm text-gray-600">
                {new Date(currentPlan.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Analytics Modal */}
      {showAnalytics && (
        <NutritionAnalytics
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          currentResult={weeklyStats}
          weekPlan={currentPlan}
        />
      )}
    </div>
  );
};

export default PlannerSidebar;
