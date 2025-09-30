// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Sparkles,
  ChefHat,
  Clock,
  Users,
  Flame,
  Calendar,
  BookOpen,
  Shuffle,
  ArrowRight
} from 'lucide-react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Link } from 'react-router-dom';

interface QuickMenuActionsProps {
  onClose: () => void;
  onApplyRandomMenu: () => void;
  onApplyMenu?: (menuId: string) => void;
}

const QuickMenuActions: React.FC<QuickMenuActionsProps> = ({
  onClose,
  onApplyRandomMenu,
  onApplyMenu
}) => {
  const { dailyMenus, applyDailyMenu, isLoading } = useKitchen();
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const handleApplyMenu = async (menuId: string) => {
    try {
      if (onApplyMenu) {
        await onApplyMenu(menuId);
      } else {
        await applyDailyMenu(menuId);
      }
      onClose();
    } catch (error) {
      console.error('Error applying menu:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'dễ':
        return 'bg-green-100 text-green-800';
      case 'trung bình':
        return 'bg-yellow-100 text-yellow-800';
      case 'khó':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-orange-600" />
              Chọn Thực Đơn Cho Hôm Nay
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Chọn một thực đơn mẫu hoặc tạo thực đơn tùy chỉnh cho riêng bạn
          </p>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành Động Nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={onApplyRandomMenu}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 h-auto"
                disabled={isLoading}
              >
                <div className="text-center">
                  <Shuffle className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">Ngẫu Nhiên</div>
                  <div className="text-sm opacity-90">Để AI chọn cho bạn</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 p-4 h-auto"
                asChild
              >
                <Link to="/recipes-library">
                  <div className="text-center">
                    <ChefHat className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Tự Tạo</div>
                    <div className="text-sm">Từ thư viện công thức</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-2 border-green-300 text-green-600 hover:bg-green-50 p-4 h-auto"
                asChild
              >
                <Link to="/meal-planner">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Kế Hoạch Chi Tiết</div>
                    <div className="text-sm">Lập kế hoạch tuần</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Daily Menu Templates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thực Đơn Mẫu ({dailyMenus.length} mẫu có sẵn)
            </h3>
            
            {dailyMenus.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có thực đơn mẫu nào</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/daily-menu">
                    Xem tất cả thực đơn
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyMenus.slice(0, 6).map((menu) => (
                  <Card 
                    key={menu.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMenuId === menu.id 
                        ? 'ring-2 ring-orange-500 bg-orange-50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedMenuId(menu.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {menu.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {menu.description}
                          </p>
                        </div>
                        <Badge className={getDifficultyColor(menu.difficulty)}>
                          {menu.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {menu.totalCalories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {menu.prepTime} phút
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {menu.servings} người
                        </span>
                      </div>

                      {/* Meal preview */}
                      <div className="space-y-1 mb-3">
                        {menu.meals.breakfast && (
                          <div className="text-xs text-gray-600">
                            🌅 {menu.meals.breakfast.name || menu.meals.breakfast.title}
                          </div>
                        )}
                        {menu.meals.lunch && (
                          <div className="text-xs text-gray-600">
                            🍽️ {menu.meals.lunch.name || menu.meals.lunch.title}
                          </div>
                        )}
                        {menu.meals.dinner && (
                          <div className="text-xs text-gray-600">
                            🌙 {menu.meals.dinner.name || menu.meals.dinner.title}
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyMenu(menu.id);
                        }}
                        disabled={isLoading}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Áp dụng thực đơn này
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {dailyMenus.length > 6 && (
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link to="/daily-menu">
                    Xem tất cả {dailyMenus.length} thực đơn
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickMenuActions;
