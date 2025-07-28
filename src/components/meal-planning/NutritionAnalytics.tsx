import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalculationResult, WeekPlan } from '@/types/meal-planning';
import { autoCalculatorService } from '@/services/auto-calculator.service';

interface NutritionAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: CalculationResult;
  weekPlan?: WeekPlan;
  historicalData?: Array<{ date: string; result: CalculationResult }>;
}

const NutritionAnalytics: React.FC<NutritionAnalyticsProps> = ({
  isOpen,
  onClose,
  currentResult,
  weekPlan,
  historicalData = []
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [targets, setTargets] = useState({
    maxCalories: 2000,
    maxCost: 200000,
    maxTime: 120,
    minProtein: 50,
    minFiber: 25
  });

  const nutritionPercentages = autoCalculatorService.calculateNutritionPercentage(currentResult.nutrition);
  const suggestions = autoCalculatorService.generateOptimizationSuggestions(currentResult, targets);
  const trends = historicalData.length >= 14 ? autoCalculatorService.calculateTrends(historicalData) : null;

  const getTargetProgress = (current: number, target: number, isMax: boolean = true) => {
    if (isMax) {
      return Math.min((current / target) * 100, 100);
    } else {
      return Math.min((current / target) * 100, 100);
    }
  };

  const getTargetStatus = (current: number, target: number, isMax: boolean = true) => {
    if (isMax) {
      return current <= target ? 'success' : 'warning';
    } else {
      return current >= target ? 'success' : 'warning';
    }
  };

  const formatTrend = (trend: number) => {
    const isPositive = trend > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{Math.abs(trend).toFixed(1)}%</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Phân tích dinh dưỡng
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
            <TabsTrigger value="trends">Xu hướng</TabsTrigger>
            <TabsTrigger value="suggestions">Đề xuất</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentResult.calories.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">
                    Mục tiêu: {targets.maxCalories.toLocaleString()}
                  </div>
                  <Progress 
                    value={getTargetProgress(currentResult.calories, targets.maxCalories)} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Chi phí</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(currentResult.cost / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-600">
                    Mục tiêu: {(targets.maxCost / 1000).toFixed(0)}k
                  </div>
                  <Progress 
                    value={getTargetProgress(currentResult.cost, targets.maxCost)} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Thời gian nấu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentResult.cookingTime}p</div>
                  <div className="text-xs text-gray-600">
                    Mục tiêu: {targets.maxTime}p
                  </div>
                  <Progress 
                    value={getTargetProgress(currentResult.cookingTime, targets.maxTime)} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Efficiency Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Hiệu quả
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {currentResult.cost > 0 ? (currentResult.calories / currentResult.cost * 1000).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Calories/1k VND</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {currentResult.calories > 0 ? 
                        ((currentResult.nutrition.protein + currentResult.nutrition.fiber) / currentResult.calories * 100).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Mật độ dinh dưỡng (%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {currentResult.cookingTime > 0 ? (currentResult.calories / currentResult.cookingTime).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Calories/phút</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            {/* Macro Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Phân bố Macro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm">{nutritionPercentages.protein.toFixed(1)}%</span>
                  </div>
                  <Progress value={nutritionPercentages.protein} className="h-3" />
                  <div className="text-xs text-gray-600 mt-1">
                    {currentResult.nutrition.protein.toFixed(1)}g
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm">{nutritionPercentages.carbs.toFixed(1)}%</span>
                  </div>
                  <Progress value={nutritionPercentages.carbs} className="h-3" />
                  <div className="text-xs text-gray-600 mt-1">
                    {currentResult.nutrition.carbs.toFixed(1)}g
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm">{nutritionPercentages.fat.toFixed(1)}%</span>
                  </div>
                  <Progress value={nutritionPercentages.fat} className="h-3" />
                  <div className="text-xs text-gray-600 mt-1">
                    {currentResult.nutrition.fat.toFixed(1)}g
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fiber</span>
                    <span className="text-sm">
                      {getTargetStatus(currentResult.nutrition.fiber, targets.minFiber, false) === 'success' ? '✓' : '⚠️'}
                    </span>
                  </div>
                  <Progress 
                    value={getTargetProgress(currentResult.nutrition.fiber, targets.minFiber, false)} 
                    className="h-3" 
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    {currentResult.nutrition.fiber.toFixed(1)}g / {targets.minFiber}g
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mục tiêu dinh dưỡng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Protein tối thiểu</span>
                    <Badge variant={getTargetStatus(currentResult.nutrition.protein, targets.minProtein, false) === 'success' ? 'default' : 'destructive'}>
                      {currentResult.nutrition.protein.toFixed(1)}g / {targets.minProtein}g
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chất xơ tối thiểu</span>
                    <Badge variant={getTargetStatus(currentResult.nutrition.fiber, targets.minFiber, false) === 'success' ? 'default' : 'destructive'}>
                      {currentResult.nutrition.fiber.toFixed(1)}g / {targets.minFiber}g
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {trends ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Xu hướng Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatTrend(trends.caloriesTrend)}
                    <div className="text-xs text-gray-600 mt-1">So với tuần trước</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Xu hướng Chi phí</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatTrend(trends.costTrend)}
                    <div className="text-xs text-gray-600 mt-1">So với tuần trước</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Xu hướng Dinh dưỡng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatTrend(trends.nutritionTrend)}
                    <div className="text-xs text-gray-600 mt-1">So với tuần trước</div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Cần ít nhất 2 tuần dữ liệu để hiển thị xu hướng
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Đề xuất tối ưu hóa
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto text-green-400 mb-4" />
                    <p className="text-green-600 font-medium">Tuyệt vời!</p>
                    <p className="text-gray-600">Kế hoạch của bạn đã đạt tất cả mục tiêu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionAnalytics;
