import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Coffee,
  UtensilsCrossed,
  Moon,
  ShoppingCart,
  ChefHat,
  BookOpen,
  Database,
  Plus,
  Sparkles,
  Clock,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { useKitchen } from '@/contexts/KitchenContext';
import { Link } from 'react-router-dom';
import SupabaseStatus from '../SupabaseStatus';
import TodayMenuIntegration from './TodayMenuIntegration';
import QuickMenuActions from './QuickMenuActions';
import QuickAccessButtons from '../QuickAccessButtons';
import { useTodayMenuSync } from '@/hooks/useTodayMenuSync';

const IntegratedKitchenDashboard = () => {
  const { activePlan, getDayNutrition } = useMealPlanning();
  const { isLoading: kitchenLoading } = useKitchen();

  // Sử dụng hook đồng bộ mới
  const {
    todayMeals,
    todayStats,
    menuSuggestions,
    isLoading: syncLoading,
    shouldSuggestDailyMenu,
    applyRandomDailyMenu,
    applyDailyMenuToToday
  } = useTodayMenuSync();

  const [showQuickActions, setShowQuickActions] = useState(false);

  // Lấy ngày hôm nay
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date().toLocaleDateString('vi-VN');

  const isLoading = kitchenLoading || syncLoading;

  // Auto-suggest daily menu nếu chưa có thực đơn
  useEffect(() => {
    if (shouldSuggestDailyMenu) {
      setShowQuickActions(true);
    }
  }, [shouldSuggestDailyMenu]);

  const handleApplyRandomMenu = async () => {
    try {
      await applyRandomDailyMenu();
      setShowQuickActions(false);
    } catch (error) {
      console.error('Error applying random menu:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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

        {/* Quick Access to New Features */}
        <QuickAccessButtons />

        {/* Quick Actions Modal */}
        {showQuickActions && (
          <QuickMenuActions
            onClose={() => setShowQuickActions(false)}
            onApplyRandomMenu={handleApplyRandomMenu}
            onApplyMenu={applyDailyMenuToToday}
          />
        )}

        {/* Today's Menu Integration */}
        <TodayMenuIntegration
          todayMealPlan={todayMeals}
          todayDate={todayDate}
          stats={todayStats}
          onShowQuickActions={() => setShowQuickActions(true)}
        />

        {/* Main Action Button */}
        <div className="mb-8">
          <Card className="border-2 border-red-200 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link to="/shopping-list">
                    <ShoppingCart className="h-6 w-6 mr-3" />
                    🛒 ĐI CHỢ NGAY BÂY GIỜ
                  </Link>
                </Button>
                <p className="text-gray-600 mt-3">
                  {todayStats.mealsCount > 0
                    ? `Bạn có ${todayStats.mealsCount} món cần mua nguyên liệu hôm nay`
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
                  <span className="text-gray-600">Món hôm nay:</span>
                  <Badge variant="secondary">{todayStats.mealsCount}/4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-semibold">{todayStats.totalCalories} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian nấu:</span>
                  <span className="font-semibold">{todayStats.totalPrepTime} phút</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nguồn dữ liệu:</span>
                  <Badge variant="outline">
                    {todayStats.source === 'activePlan' && 'Kế hoạch cá nhân'}
                    {todayStats.source === 'dailyMenu' && 'Thực đơn mẫu'}
                    {todayStats.source === 'todayMeals' && 'Hôm nay'}
                    {todayStats.source === 'empty' && 'Chưa có'}
                  </Badge>
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

export default IntegratedKitchenDashboard;
