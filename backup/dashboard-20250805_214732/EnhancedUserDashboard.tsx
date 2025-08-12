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
  Sparkles,
  Users,
  Clock,
  ChefHat
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import EnhancedTodayMealPlan from './EnhancedTodayMealPlan';
import EnhancedActionButtons from './EnhancedActionButtons';
import SmartWeeklyInsights from './SmartWeeklyInsights';
import EnhancedSmartRecommendations from './EnhancedSmartRecommendations';
import { activeMealPlan, getTodayMeals, getWeeklyStats } from '@/data/mockMealPlans';

const EnhancedUserDashboard = () => {
  // Sử dụng dữ liệu mẫu thay vì context
  const currentPlan = activeMealPlan;
  const todayDate = new Date().toLocaleDateString('vi-VN');
  const todayMealPlan = getTodayMeals();

  // Sử dụng dữ liệu thống kê mẫu
  const weeklyStats = getWeeklyStats();

  // Tính toán các metrics cho ActionButtons
  const todayMealsCount = Object.values(todayMealPlan).filter(meal => meal?.recipe).length;
  const weekMealsCount = currentPlan ? currentPlan.meals.filter(meal => meal.recipe).length : 0;
  const hasTodayMeals = todayMealsCount > 0;

  // Xử lý đánh dấu hoàn thành bữa ăn
  const handleMarkComplete = (mealId: string) => {
    console.log('Mark meal complete:', mealId);
  };

  const handleReplaceMeal = (mealType: string) => {
    console.log('Replace meal:', mealType);
  };

  // Tips và News data
  const tips = [
    {
      id: '1',
      category: 'Mẹo vặt',
      title: 'Bảo quản rau xanh tươi lâu',
      content: 'Rửa sạch rau, để ráo nước rồi bọc trong khăn giấy ẩm, cho vào túi nilon và bảo quản trong ngăn mát tủ lạnh.',
      readTime: '2 phút'
    },
    {
      id: '2',
      category: 'Mẹo vặt',
      title: 'Khử mùi tanh của cá',
      content: 'Chà muối và nước cốt chanh lên cá, để 10-15 phút rồi rửa sạch. Cá sẽ hết tanh và thơm ngon hơn.',
      readTime: '1 phút'
    }
  ];

  const news = [
    {
      id: '1',
      category: 'Dinh dưỡng',
      title: 'Lợi ích của việc ăn cá 2-3 lần/tuần',
      content: 'Cá cung cấp omega-3 tốt cho tim mạch và não bộ. Nên ăn cá 2-3 lần mỗi tuần để có sức khỏe tốt nhất.',
      readTime: '3 phút',
      publishedAt: '2 giờ trước'
    },
    {
      id: '2',
      category: 'Dinh dưỡng',
      title: 'Cách kết hợp thực phẩm để hấp thụ dinh dưỡng tốt nhất',
      content: 'Vitamin C giúp hấp thụ sắt tốt hơn. Ăn cam, chanh cùng với thịt đỏ sẽ tăng hiệu quả hấp thụ sắt.',
      readTime: '4 phút',
      publishedAt: '1 ngày trước'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header chào mừng */}
      <div className="text-center py-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại! 👋
        </h1>
        <p className="text-gray-600">
          Hôm nay bạn muốn nấu gì? Hãy để Angiday giúp bạn lên kế hoạch nhé!
        </p>
      </div>

      {/* Khu vực trung tâm - Thực đơn hôm nay */}
      <EnhancedTodayMealPlan
        todayMealPlan={todayMealPlan}
        currentPlan={currentPlan}
        todayDate={todayDate}
        onMarkComplete={handleMarkComplete}
        onReplaceMeal={handleReplaceMeal}
      />

      {/* Khu vực Hành Động Chính */}
      <EnhancedActionButtons
        hasCurrentPlan={!!currentPlan}
        hasTodayMeals={hasTodayMeals}
        activePlanName={currentPlan?.name}
        todayMealsCount={todayMealsCount}
        weekMealsCount={weekMealsCount}
      />

      {/* Layout 2 cột cho thống kê và gợi ý */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cột trái - Thống kê thông minh */}
        <div className="lg:col-span-1">
          <SmartWeeklyInsights stats={weeklyStats} currentPlan={currentPlan} />
        </div>

        {/* Cột phải - Gợi ý và khám phá */}
        <div className="lg:col-span-2">
          <EnhancedSmartRecommendations />
        </div>
      </div>

      {/* Tips và News */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cooking Tips */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Mẹo Vặt Hữu Ích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip) => (
              <div key={tip.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-sm transition-all">
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
              <Link to="/tips">
                Xem thêm mẹo vặt
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Nutrition News */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
              Tin Tức Dinh Dưỡng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{article.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {article.readTime}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{article.content}</p>
                <p className="text-xs text-gray-500">{article.publishedAt}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/nutrition-news">
                Đọc thêm tin tức
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer inspiration */}
      <div className="text-center py-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ChefHat className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Nấu ăn là yêu thương</h3>
          <Heart className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-gray-600 mb-4">
          Mỗi bữa ăn bạn chuẩn bị đều là món quà tình yêu dành cho gia đình
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Hơn 100,000 gia đình tin tưởng</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>10,000+ công thức ngon</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Tiết kiệm 2 giờ mỗi ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
