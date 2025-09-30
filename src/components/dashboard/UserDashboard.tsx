// @ts-nocheck
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
  Heart,
  ChefHat,
  TrendingUp,
  Lightbulb,
  Newspaper,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Coffee,
  Utensils,
  Moon,
  Plus,
  ShoppingCart,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import MealPlanProgress from './MealPlanProgress';
import SmartRecommendations from './SmartRecommendations';
import TodayMealPlan from './TodayMealPlan';
import WeeklyOverview from './WeeklyOverview';
import ActionButtons from './ActionButtons';

const UserDashboard = () => {
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
        budget: 700000, // Ngân sách tuần
        caloriesTarget: 2000,
        caloriesConsumed: todayNutrition.calories,
        mealsCompleted: 0,
        totalMeals: 21, // 3 bữa x 7 ngày
        weeklyProgress: 0,
        daysRemaining: 7
      };
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let totalMeals = 0;
    let completedMeals = 0;
    let totalCalories = 0;
    let totalCost = 0;

    activePlan.meals.forEach(meal => {
      const mealDate = new Date(meal.date);
      if (mealDate >= startOfWeek && mealDate <= endOfWeek) {
        totalMeals++;
        if (meal.recipe) {
          completedMeals++;
          totalCalories += meal.recipe.calories || 0;
          // Ước tính chi phí dựa trên số lượng nguyên liệu
          totalCost += (meal.recipe.ingredients?.length || 0) * 15000;
        }
      }
    });

    const daysRemaining = Math.max(0, Math.ceil((endOfWeek - new Date()) / (1000 * 60 * 60 * 24)));

    return {
      totalSpent: totalCost,
      budget: 700000, // Ngân sách tuần
      caloriesTarget: 2000,
      caloriesConsumed: todayNutrition.calories,
      mealsCompleted: completedMeals,
      totalMeals: Math.max(totalMeals, 21), // Tối thiểu 21 bữa ăn trong tuần
      weeklyProgress: totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0,
      daysRemaining
    };
  };

  const weeklyStats = getWeeklyStats();

  // Xử lý đánh dấu hoàn thành bữa ăn
  const handleMarkComplete = (mealId: string) => {
    // TODO: Implement mark meal as complete
    console.log('Mark meal complete:', mealId);
  };

  // Xử lý thay thế món ăn
  const handleReplaceMeal = (mealType: string) => {
    // TODO: Implement replace meal
    console.log('Replace meal:', mealType);
  };

  // Kiểm tra xem có bữa ăn hôm nay không
  const hasTodayMeals = Object.values(todayMealPlan).some(meal => meal?.recipe);

  const tips = [
    {
      id: 1,
      title: "Cách bảo quản rau xanh tươi lâu",
      content: "Gói rau trong khăn giấy ẩm và bỏ vào túi nilon có lỗ thông hơi",
      category: "Mẹo vặt",
      readTime: "2 phút"
    },
    {
      id: 2,
      title: "Lợi ích của việc ăn sáng đầy đủ",
      content: "Ăn sáng giúp tăng cường trao đổi chất và cung cấp năng lượng cho cả ngày",
      category: "Dinh dưỡng",
      readTime: "3 phút"
    }
  ];



  return (
    <div className="space-y-6">
      {/* Kế Hoạch Hôm Nay - Component mới */}
      <TodayMealPlan
        todayMealPlan={todayMealPlan}
        currentPlan={activePlan}
        todayDate={todayDate}
        onMarkComplete={handleMarkComplete}
        onReplaceMeal={handleReplaceMeal}
      />

      {/* Tổng Quan Tuần Này - Component mới */}
      <WeeklyOverview stats={weeklyStats} currentPlan={activePlan} />

      {/* Nút Hành Động Chính */}
      <ActionButtons
        hasCurrentPlan={!!activePlan}
        hasTodayMeals={hasTodayMeals}
        activePlanName={activePlan?.name}
      />

      {/* Gợi Ý & Khám Phá */}
      <SmartRecommendations />



      {/* Tips and News */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cooking Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Mẹo vặt hữu ích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.filter(tip => tip.category === 'Mẹo vặt').map((tip) => (
              <div key={tip.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {tip.readTime}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{tip.content}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/blog?category=tips">
                Xem thêm mẹo vặt
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Nutrition News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
              Tin tức dinh dưỡng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.filter(tip => tip.category === 'Dinh dưỡng').map((tip) => (
              <div key={tip.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {tip.readTime}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{tip.content}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/blog?category=nutrition">
                Xem thêm tin tức
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
