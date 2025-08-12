import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Clock,
  Flame,
  DollarSign
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

const MealPlanProgress = () => {
  const { currentPlan, userMealPlans } = useMealPlanning();
  
  if (!currentPlan) return null;
  
  // Tính toán tiến độ kế hoạch hiện tại
  const calculatePlanProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const planStart = new Date(currentPlan.startDate);
    const planEnd = new Date(currentPlan.endDate);
    const currentDate = new Date(today);
    
    // Tổng số ngày trong kế hoạch
    const totalDays = Math.ceil((planEnd.getTime() - planStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Số ngày đã trải qua
    const daysPassed = Math.max(0, Math.ceil((currentDate.getTime() - planStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Tổng số bữa ăn được lên kế hoạch
    const totalPlannedMeals = currentPlan.meals.length;
    
    // Số bữa ăn đã hoàn thành (có recipe và ngày đã qua)
    const completedMeals = currentPlan.meals.filter(meal => {
      return meal.recipe && meal.date < today;
    }).length;
    
    // Số bữa ăn hôm nay
    const todayMeals = currentPlan.meals.filter(meal => meal.date === today);
    const todayCompletedMeals = todayMeals.filter(meal => meal.recipe).length;
    
    // Tính tổng calories và chi phí ước tính
    let totalCalories = 0;
    let estimatedCost = 0;
    
    currentPlan.meals.forEach(meal => {
      if (meal.recipe) {
        totalCalories += meal.recipe.calories || 0;
        estimatedCost += (meal.recipe.ingredients?.length || 0) * 15000;
      }
    });
    
    return {
      totalDays,
      daysPassed,
      daysRemaining: Math.max(0, totalDays - daysPassed),
      totalPlannedMeals,
      completedMeals,
      todayMeals: todayMeals.length,
      todayCompletedMeals,
      progressPercentage: totalPlannedMeals > 0 ? Math.round((completedMeals / totalPlannedMeals) * 100) : 0,
      todayProgressPercentage: todayMeals.length > 0 ? Math.round((todayCompletedMeals / todayMeals.length) * 100) : 0,
      totalCalories,
      estimatedCost,
      averageCaloriesPerDay: totalDays > 0 ? Math.round(totalCalories / totalDays) : 0
    };
  };
  
  const progress = calculatePlanProgress();
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Tiến độ kế hoạch: {currentPlan.name}
          </div>
          <Badge variant="outline" className="text-green-700 border-green-300">
            {progress.progressPercentage}% hoàn thành
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tiến độ tổng thể */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ tổng thể
            </span>
            <span className="text-sm text-gray-600">
              {progress.completedMeals}/{progress.totalPlannedMeals} bữa ăn
            </span>
          </div>
          <Progress value={progress.progressPercentage} className="h-3" />
        </div>
        
        {/* Tiến độ hôm nay */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ hôm nay
            </span>
            <span className="text-sm text-gray-600">
              {progress.todayCompletedMeals}/{progress.todayMeals} bữa ăn
            </span>
          </div>
          <Progress value={progress.todayProgressPercentage} className="h-3" />
        </div>
        
        {/* Thống kê chi tiết */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
            <Calendar className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {progress.daysRemaining}
            </div>
            <div className="text-xs text-gray-600">Ngày còn lại</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {progress.completedMeals}
            </div>
            <div className="text-xs text-gray-600">Bữa ăn hoàn thành</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
            <Flame className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {progress.averageCaloriesPerDay}
            </div>
            <div className="text-xs text-gray-600">Cal/ngày TB</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
            <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {Math.round(progress.estimatedCost / 1000)}k
            </div>
            <div className="text-xs text-gray-600">Chi phí ước tính</div>
          </div>
        </div>
        
        {/* Thông tin kế hoạch */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-green-200">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Từ {new Date(currentPlan.startDate).toLocaleDateString('vi-VN')} 
            đến {new Date(currentPlan.endDate).toLocaleDateString('vi-VN')}
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            {progress.totalDays} ngày
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanProgress;
