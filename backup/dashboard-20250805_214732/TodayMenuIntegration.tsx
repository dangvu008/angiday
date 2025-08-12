import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Coffee,
  UtensilsCrossed,
  Moon,
  Plus,
  Sparkles,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TodayMenuIntegrationProps {
  todayMealPlan: any;
  todayDate: string;
  stats: any;
  onShowQuickActions: () => void;
}

const TodayMenuIntegration: React.FC<TodayMenuIntegrationProps> = ({
  todayMealPlan,
  todayDate,
  stats,
  onShowQuickActions
}) => {
  const getMealDisplay = (meal: any, mealType: string) => {
    if (!meal) return null;

    // Handle different data structures from useTodayMenuSync
    const recipe = meal.recipe || meal.dish || meal;
    if (!recipe) return null;

    return {
      title: recipe.title || recipe.name || 'Món ăn',
      cookingTime: recipe.cookingTime || recipe.cookTime || recipe.prepTime || '30 phút',
      difficulty: recipe.difficulty || 'Trung bình',
      calories: recipe.calories || 0,
      servings: recipe.servings || 1
    };
  };

  const renderMealSlot = (mealType: string, meal: any, icon: any, bgColor: string, borderColor: string, textColor: string) => {
    const mealDisplay = getMealDisplay(meal, mealType);
    const Icon = icon;

    return (
      <div className={`${bgColor} rounded-xl p-4 border ${borderColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-5 w-5 ${textColor}`} />
          <h3 className={`font-semibold ${textColor}`}>
            {mealType === 'breakfast' && 'Bữa sáng'}
            {mealType === 'lunch' && 'Bữa trưa'}
            {mealType === 'dinner' && 'Bữa tối'}
            {mealType === 'snack' && 'Ăn vặt'}
          </h3>
        </div>
        
        {mealDisplay ? (
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-1">
                {mealDisplay.title}
              </h4>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {mealDisplay.cookingTime}
                </span>
                <span>{mealDisplay.difficulty}</span>
                {mealDisplay.calories > 0 && (
                  <span>{mealDisplay.calories} kcal</span>
                )}
              </div>
              {mealDisplay.servings > 1 && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {mealDisplay.servings} người
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">Chưa có món nào</p>
            <Button 
              size="sm" 
              variant="outline" 
              className={`${textColor.replace('text-', 'text-')} ${borderColor.replace('border-', 'border-')}`}
              onClick={onShowQuickActions}
            >
              <Plus className="h-3 w-3 mr-1" />
              Thêm món
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <Card className="border-2 border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              Thực Đơn Hôm Nay - {todayDate}
            </CardTitle>
            
            {/* Source indicator */}
            <div className="flex items-center gap-2">
              {stats.source === 'activePlan' && (
                <Badge className="bg-green-100 text-green-800">
                  <ChefHat className="h-3 w-3 mr-1" />
                  Kế hoạch cá nhân
                </Badge>
              )}
              {stats.source === 'dailyMenu' && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Thực đơn mẫu
                </Badge>
              )}
              {stats.source === 'todayMeals' && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Hôm nay
                </Badge>
              )}
              {stats.source === 'empty' && (
                <Badge variant="outline">
                  Chưa có thực đơn
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Empty state with suggestions */}
          {stats.source === 'empty' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có thực đơn cho hôm nay
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy chọn một thực đơn mẫu hoặc tự tạo thực đơn riêng cho bạn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onShowQuickActions}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Chọn thực đơn mẫu
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to="/recipes-library">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Tự tạo từ công thức
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to="/meal-planner">
                    <Calendar className="h-4 w-4 mr-2" />
                    Kế hoạch chi tiết
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Meal slots */}
          {stats.source !== 'empty' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bữa sáng */}
              {renderMealSlot(
                'breakfast',
                todayMealPlan.meals.breakfast,
                Coffee,
                'bg-amber-50',
                'border-amber-200',
                'text-amber-800'
              )}

              {/* Bữa trưa */}
              {renderMealSlot(
                'lunch',
                todayMealPlan.meals.lunch,
                UtensilsCrossed,
                'bg-orange-50',
                'border-orange-200',
                'text-orange-800'
              )}

              {/* Bữa tối */}
              {renderMealSlot(
                'dinner',
                todayMealPlan.meals.dinner,
                Moon,
                'bg-indigo-50',
                'border-indigo-200',
                'text-indigo-800'
              )}
            </div>
          )}

          {/* Quick actions for existing meals */}
          {stats.source !== 'empty' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onShowQuickActions}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm/Thay đổi món
                </Button>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to="/recipes-library">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Duyệt công thức
                  </Link>
                </Button>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to="/daily-menu">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Đổi thực đơn mẫu
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodayMenuIntegration;
