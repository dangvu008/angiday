import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  ShoppingCart, 
  Plus, 
  ArrowRight,
  ChefHat,
  BookOpen,
  Sparkles,
  Clock,
  Users,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnhancedActionButtonsProps {
  hasCurrentPlan: boolean;
  hasTodayMeals: boolean;
  activePlanName?: string;
  todayMealsCount?: number;
  weekMealsCount?: number;
}

const EnhancedActionButtons: React.FC<EnhancedActionButtonsProps> = ({ 
  hasCurrentPlan, 
  hasTodayMeals, 
  activePlanName,
  todayMealsCount = 0,
  weekMealsCount = 0
}) => {
  return (
    <div className="space-y-6">
      {/* Khu vực Hành Động Chính */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Hành Động Chính</h3>
            <p className="text-sm text-gray-600">Những việc quan trọng nhất bạn có thể làm ngay bây giờ</p>
          </div>

          {/* Nút Đi Chợ Chính - Siêu nổi bật */}
          {hasCurrentPlan && hasTodayMeals && (
            <div className="mb-6">
              <Button
                asChild
                size="lg"
                className="w-full h-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-2xl text-xl font-bold transform hover:scale-[1.02] transition-all duration-200"
              >
                <Link to="/shopping-list" className="flex items-center justify-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      🛒 Tạo Danh Sách Đi Chợ
                    </div>
                    <div className="text-sm opacity-90">
                      {activePlanName ? `Từ: ${activePlanName}` : 'Kế hoạch đang áp dụng'}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {todayMealsCount} món hôm nay • {weekMealsCount} món cả tuần
                    </div>
                  </div>
                  <ArrowRight className="h-8 w-8" />
                </Link>
              </Button>
            </div>
          )}

          {/* Nút Kế hoạch tuần - Quan trọng thứ 2 */}
          <div className="mb-4">
            <Button
              asChild
              size="lg"
              className="w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl transform hover:scale-[1.01] transition-all duration-200"
            >
              <Link to="/meal-planner" className="flex items-center justify-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    📅 {hasCurrentPlan ? 'Xem & Chỉnh Sửa Kế Hoạch' : 'Tạo Kế Hoạch Tuần'}
                  </div>
                  <div className="text-sm opacity-90">
                    {hasCurrentPlan ? 'Quản lý thực đơn tuần' : 'Bắt đầu lập kế hoạch ăn uống'}
                  </div>
                </div>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>

          {/* Các nút hành động phụ */}
          <div className="grid grid-cols-2 gap-3">
            {/* Nút Danh sách hôm nay */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-16 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              disabled={!hasTodayMeals}
            >
              <Link to="/shopping-list?today=true" className="flex flex-col items-center justify-center gap-1">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <div className="text-center">
                  <div className="font-semibold text-green-700 text-sm">
                    Chỉ Hôm Nay
                  </div>
                  <div className="text-xs text-green-600">
                    {todayMealsCount} món
                  </div>
                </div>
              </Link>
            </Button>

            {/* Nút Gợi ý AI */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-16 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            >
              <Link to="/ai-suggestions" className="flex flex-col items-center justify-center gap-1">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="text-center">
                  <div className="font-semibold text-purple-700 text-sm">
                    Gợi Ý AI
                  </div>
                  <div className="text-xs text-purple-600">
                    Thông minh
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Các công cụ hỗ trợ */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">🔧 Công Cụ Hỗ Trợ</h4>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" asChild className="h-14 flex flex-col gap-1">
              <Link to="/recipes" className="text-center">
                <ChefHat className="h-4 w-4" />
                <span className="text-xs">Công thức</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="h-14 flex flex-col gap-1">
              <Link to="/meal-planner/add-dish" className="text-center">
                <Plus className="h-4 w-4" />
                <span className="text-xs">Thêm món</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="h-14 flex flex-col gap-1">
              <Link to="/nutrition" className="text-center">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Dinh dưỡng</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="h-14 flex flex-col gap-1">
              <Link to="/meal-planner/templates" className="text-center">
                <Target className="h-4 w-4" />
                <span className="text-xs">Mẫu có sẵn</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thông báo và gợi ý */}
      {!hasCurrentPlan && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Bắt đầu hành trình nấu ăn</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              💡 Tạo kế hoạch ăn uống để bắt đầu quản lý bữa ăn hàng ngày một cách hiệu quả
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
              <Clock className="h-3 w-3" />
              <span>Chỉ mất 5 phút để thiết lập</span>
            </div>
          </CardContent>
        </Card>
      )}

      {hasCurrentPlan && !hasTodayMeals && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plus className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Thêm món cho hôm nay</h4>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              🍽️ Thêm món ăn cho hôm nay để có thể tạo danh sách đi chợ
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
              <Users className="h-3 w-3" />
              <span>Gợi ý: Bắt đầu với bữa {new Date().getHours() < 10 ? 'sáng' : new Date().getHours() < 14 ? 'trưa' : 'tối'}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {hasCurrentPlan && hasTodayMeals && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Sẵn sàng đi chợ!</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              ✅ Bạn đã có {todayMealsCount} món cho hôm nay. Tạo danh sách đi chợ ngay!
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-green-600">
              <Target className="h-3 w-3" />
              <span>Tiết kiệm thời gian và không bỏ sót gì</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedActionButtons;
