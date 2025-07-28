import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Flame, 
  ChefHat, 
  Users, 
  ShoppingCart,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { Link } from 'react-router-dom';

const MealPlannerDashboard = () => {
  const { 
    userMealPlans, 
    currentPlan, 
    availableRecipes,
    getDayNutrition,
    generateShoppingList 
  } = useMealPlanning();

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = getThisWeekDates();
    
    let totalMeals = 0;
    let totalCalories = 0;
    let totalCost = 0;
    let completedMeals = 0;
    let plannedMeals = 0;

    userMealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        totalMeals++;
        if (meal.recipe) {
          totalCalories += meal.recipe.calories || 0;
          totalCost += 50000; // Estimate cost per meal
          
          // Check if meal is in the past (completed)
          if (meal.date < today) {
            completedMeals++;
          } else {
            plannedMeals++;
          }
        }
      });
    });

    return {
      totalPlans: userMealPlans.length,
      totalMeals,
      totalCalories,
      totalCost,
      completedMeals,
      plannedMeals,
      averageCaloriesPerMeal: totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0,
      averageCostPerMeal: totalMeals > 0 ? Math.round(totalCost / totalMeals) : 0
    };
  };

  const getThisWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getWeeklyMeals = () => {
    const thisWeek = getThisWeekDates();
    const weeklyMeals = [];

    thisWeek.forEach(date => {
      const dayMeals = [];
      userMealPlans.forEach(plan => {
        const mealsForDate = plan.meals.filter(meal => meal.date === date);
        dayMeals.push(...mealsForDate);
      });
      
      weeklyMeals.push({
        date,
        meals: dayMeals,
        dayName: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' })
      });
    });

    return weeklyMeals;
  };

  const getUpcomingMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingMeals = [];

    userMealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        if (meal.date >= today && meal.recipe) {
          upcomingMeals.push({
            ...meal,
            planName: plan.name
          });
        }
      });
    });

    return upcomingMeals.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  };

  const stats = getDashboardStats();
  const weeklyMeals = getWeeklyMeals();
  const upcomingMeals = getUpcomingMeals();
  const shoppingList = currentPlan ? generateShoppingList(currentPlan.id) : {};

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kế hoạch đang có</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPlans}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng bữa ăn</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalMeals}</p>
              </div>
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng calories</p>
                <p className="text-2xl font-bold text-orange-600">{(stats.totalCalories / 1000).toFixed(1)}k</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chi phí ước tính</p>
                <p className="text-2xl font-bold text-purple-600">{(stats.totalCost / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kế hoạch tuần này
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyMeals.map((day, index) => (
              <div key={day.date} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {day.dayName}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(day.date).getDate()}
                </div>
                <div className="space-y-1">
                  {day.meals.length > 0 ? (
                    day.meals.slice(0, 3).map((meal, mealIndex) => (
                      <div key={mealIndex} className="w-full h-2 bg-green-200 rounded"></div>
                    ))
                  ) : (
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                  )}
                  {day.meals.length > 3 && (
                    <div className="text-xs text-gray-500">+{day.meals.length - 3}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tiến độ thực hiện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Bữa ăn đã hoàn thành</span>
                <span>{stats.completedMeals}/{stats.totalMeals}</span>
              </div>
              <Progress 
                value={stats.totalMeals > 0 ? (stats.completedMeals / stats.totalMeals) * 100 : 0} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Kế hoạch đang thực hiện</span>
                <span>{stats.plannedMeals} bữa ăn</span>
              </div>
              <Progress 
                value={stats.totalMeals > 0 ? (stats.plannedMeals / stats.totalMeals) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Thống kê dinh dưỡng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Trung bình calories/bữa</span>
              <span className="font-semibold">{stats.averageCaloriesPerMeal} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Chi phí trung bình/bữa</span>
              <span className="font-semibold">{stats.averageCostPerMeal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Công thức có sẵn</span>
              <span className="font-semibold">{availableRecipes.length} món</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meals & Shopping List */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bữa ăn sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMeals.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{meal.recipe?.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{new Date(meal.date).toLocaleDateString('vi-VN')}</span>
                        <Badge variant="secondary" className="text-xs">
                          {meal.mealType === 'breakfast' ? 'Sáng' :
                           meal.mealType === 'lunch' ? 'Trưa' : 'Tối'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-600">
                        {meal.recipe?.calories || 0} kcal
                      </div>
                      <div className="text-xs text-gray-500">
                        {meal.recipe?.cookTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có bữa ăn nào được lên kế hoạch</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/meal-planner">Tạo kế hoạch mới</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Danh sách mua sắm
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(shoppingList).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(shoppingList).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-1">
                      {items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <div className="text-xs text-gray-500 ml-6">
                          +{items.length - 3} mục khác
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Xem danh sách đầy đủ
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có danh sách mua sắm</p>
                <p className="text-sm">Tạo kế hoạch bữa ăn để tự động tạo danh sách</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealPlannerDashboard;
