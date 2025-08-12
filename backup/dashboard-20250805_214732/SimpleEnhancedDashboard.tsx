import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Newspaper,
  ArrowRight,
  Coffee,
  Heart,
  UtensilsCrossed,
  Moon,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  DollarSign,
  ChefHat,
  BookOpen,
  Database
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { Link } from 'react-router-dom';
import SupabaseStatus from '../SupabaseStatus';

const SimpleEnhancedDashboard = () => {
  const { activePlan, userMealPlans, getDayNutrition } = useMealPlanning();

  // Lấy ngày hôm nay
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date().toLocaleDateString('vi-VN');

  // Lấy thực đơn hôm nay từ kế hoạch đang áp dụng
  const getTodayMealPlan = () => {
    if (!activePlan) {
      return {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null
      };
    }

    const todayMeals = activePlan.meals.filter(meal => meal.date === today);

    return {
      breakfast: todayMeals.find(meal => meal.mealType === 'breakfast'),
      lunch: todayMeals.find(meal => meal.mealType === 'lunch'),
      dinner: todayMeals.find(meal => meal.mealType === 'dinner'),
      snack: todayMeals.find(meal => meal.mealType === 'snack')
    };
  };

  const todayMealPlan = getTodayMealPlan();
  const todayNutrition = getDayNutrition(today);

  // Tính toán thống kê tuần
  const getWeeklyStats = () => {
    if (!activePlan) {
      return {
        totalSpent: 0,
        budget: 700000,
        caloriesTarget: 2000,
        caloriesConsumed: todayNutrition.calories,
        mealsCompleted: 0,
        totalMeals: 21,
        weeklyProgress: 0,
        daysRemaining: 7
      };
    }

    const startOfWeek = new Date(activePlan.startDate);
    const endOfWeek = new Date(activePlan.endDate);
    const totalMeals = activePlan.meals.length;
    const completedMeals = activePlan.meals.filter(meal => meal.recipe).length;
    const totalCost = completedMeals * 50000; // Estimate cost per meal

    const daysRemaining = Math.max(0, Math.ceil((endOfWeek - new Date()) / (1000 * 60 * 60 * 24)));

    return {
      totalSpent: totalCost,
      budget: 700000,
      caloriesTarget: 2000,
      caloriesConsumed: todayNutrition.calories,
      mealsCompleted: completedMeals,
      totalMeals: Math.max(totalMeals, 21),
      weeklyProgress: totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0,
      daysRemaining
    };
  };

  const weeklyStats = getWeeklyStats();

  // Tính toán các metrics cho ActionButtons
  const todayMealsCount = Object.values(todayMealPlan).filter(meal => meal?.recipe).length;
  const weekMealsCount = activePlan ? activePlan.meals.filter(meal => meal.recipe).length : 0;
  const hasTodayMeals = todayMealsCount > 0;

  const handleMarkComplete = (mealType: string) => {
    console.log(`Marking ${mealType} as complete`);
  };

  const handleReplaceMeal = (mealType: string) => {
    console.log(`Replacing ${mealType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏠 Kitchen Command Center
          </h1>
          <p className="text-lg text-gray-600">
            Trung tâm điều khiển nhà bếp thông minh của bạn
          </p>
        </div>

        {/* Khu vực trung tâm - Thực đơn hôm nay */}
        <div className="mb-8">
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-orange-600" />
                Thực Đơn Hôm Nay - {todayDate}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bữa sáng */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800">Bữa sáng</h3>
                  </div>
                  {todayMealPlan.breakfast?.recipe ? (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <h4 className="font-medium text-gray-900">
                          {todayMealPlan.breakfast.recipe.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {todayMealPlan.breakfast.recipe.cookingTime} • {todayMealPlan.breakfast.recipe.difficulty}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">Chưa có món nào</p>
                      <Button size="sm" variant="outline" className="text-amber-600 border-amber-300">
                        + Thêm món
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bữa trưa */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Bữa trưa</h3>
                  </div>
                  {todayMealPlan.lunch?.recipe ? (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <h4 className="font-medium text-gray-900">
                          {todayMealPlan.lunch.recipe.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {todayMealPlan.lunch.recipe.cookingTime} • {todayMealPlan.lunch.recipe.difficulty}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">Chưa có món nào</p>
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                        + Thêm món
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bữa tối */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-800">Bữa tối</h3>
                  </div>
                  {todayMealPlan.dinner?.recipe ? (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <h4 className="font-medium text-gray-900">
                          {todayMealPlan.dinner.recipe.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {todayMealPlan.dinner.recipe.cookingTime} • {todayMealPlan.dinner.recipe.difficulty}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">Chưa có món nào</p>
                      <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-300">
                        + Thêm món
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Khu vực Hành Động Chính */}
        <div className="mb-8">
          <Card className="border-2 border-red-200 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  🛒 ĐI CHỢ NGAY BÂY GIỜ
                </Button>
                <p className="text-gray-600 mt-3">
                  {hasTodayMeals 
                    ? `Bạn có ${todayMealsCount} món cần mua nguyên liệu hôm nay`
                    : 'Hãy lên kế hoạch bữa ăn trước khi đi chợ'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái - Thống kê thông minh */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Thống Kê Thông Minh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chi phí tuần:</span>
                  <span className="font-semibold">{weeklyStats.totalSpent.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngân sách:</span>
                  <span className="font-semibold">{weeklyStats.budget.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiến độ tuần:</span>
                  <Badge variant="secondary">{weeklyStats.weeklyProgress}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải - Kitchen Command Center */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                  Kitchen Command Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link to="/kitchen" className="block">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-orange-200">
                      <div className="flex items-center gap-3 mb-2">
                        <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                        <h4 className="font-medium text-gray-900">Command Center</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Trung tâm điều khiển nhà bếp thông minh</p>
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                        Truy cập
                      </Button>
                    </div>
                  </Link>

                  <Link to="/recipes" className="block">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <ChefHat className="h-6 w-6 text-blue-600" />
                        <h4 className="font-medium text-gray-900">Thư viện công thức</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">20 món ăn truyền thống Việt Nam</p>
                      <Button size="sm" variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                        Khám phá
                      </Button>
                    </div>
                  </Link>

                  <Link to="/daily-menu" className="block">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-green-600" />
                        <h4 className="font-medium text-gray-900">Thực đơn hàng ngày</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">20 thực đơn được thiết kế sẵn</p>
                      <Button size="sm" variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                        Xem thực đơn
                      </Button>
                    </div>
                  </Link>

                  <Link to="/database-tester" className="block">
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-6 w-6 text-purple-600" />
                        <h4 className="font-medium text-gray-900">Database Tester</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Test Supabase, Firebase, PocketBase</p>
                      <Button size="sm" variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                        Test Database
                      </Button>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supabase Status Section */}
        <div className="mb-8">
          <div className="flex justify-center">
            <SupabaseStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEnhancedDashboard;
