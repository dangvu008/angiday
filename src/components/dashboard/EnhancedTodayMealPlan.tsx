import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Coffee, 
  Utensils, 
  Moon, 
  CheckCircle, 
  ArrowRight,
  Clock,
  MoreHorizontal,
  Plus,
  ChefHat,
  Flame,
  Users,
  Eye,
  RefreshCw,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MealPlan {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: {
    id: string;
    title: string;
    image: string;
    cookTime: string;
    calories: number;
    ingredients: any[];
  };
}

interface EnhancedTodayMealPlanProps {
  todayMealPlan: {
    breakfast: MealPlan | null;
    lunch: MealPlan | null;
    dinner: MealPlan | null;
    snack: MealPlan | null;
  };
  currentPlan: any;
  todayDate: string;
  onMarkComplete?: (mealId: string) => void;
  onReplaceMeal?: (mealType: string) => void;
}

const EnhancedTodayMealPlan: React.FC<EnhancedTodayMealPlanProps> = ({
  todayMealPlan,
  currentPlan,
  todayDate,
  onMarkComplete,
  onReplaceMeal
}) => {
  // Xác định bữa ăn sắp tới
  const getCurrentMealType = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 10) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 19) return 'dinner';
    return 'snack';
  };

  const currentMealType = getCurrentMealType();

  const getMealEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '☕';
      case 'lunch': return '🍚';
      case 'dinner': return '🍽️';
      case 'snack': return '🍪';
      default: return '🍽️';
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa Sáng';
      case 'lunch': return 'Bữa Trưa';
      case 'dinner': return 'Bữa Tối';
      case 'snack': return 'Bữa Phụ';
      default: return 'Bữa ăn';
    }
  };

  const renderMealCard = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', meal: MealPlan | null) => {
    const isUpcoming = mealType === currentMealType;
    const isCompleted = meal?.recipe && new Date().getHours() > 
      (mealType === 'breakfast' ? 10 : mealType === 'lunch' ? 14 : mealType === 'dinner' ? 19 : 22);

    if (!meal || !meal.recipe) {
      return (
        <div 
          key={mealType}
          className={`p-4 rounded-xl border-2 border-dashed transition-all hover:shadow-sm ${
            isUpcoming 
              ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isUpcoming ? 'bg-orange-200' : 'bg-gray-200'
              }`}>
                <span className="text-2xl">{getMealEmoji(mealType)}</span>
              </div>
              <div>
                <h4 className={`font-semibold ${isUpcoming ? 'text-orange-800' : 'text-gray-600'}`}>
                  {getMealLabel(mealType)}
                </h4>
                {isUpcoming && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-200 text-xs mt-1">
                    Bữa tiếp theo
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-center py-2">
            <p className="text-sm text-gray-500 mb-3">Chưa có món ăn nào</p>
            <Button size="sm" variant="outline" className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Thêm món
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={mealType}
        className={`p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
          isUpcoming 
            ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {/* Header với emoji và menu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isUpcoming ? 'bg-orange-200' : 'bg-gray-100'
            }`}>
              <span className="text-2xl">{getMealEmoji(mealType)}</span>
            </div>
            <div>
              <h4 className={`font-semibold ${isUpcoming ? 'text-orange-800' : 'text-gray-700'}`}>
                {getMealLabel(mealType)}
              </h4>
              {isUpcoming && (
                <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-200 text-xs mt-1">
                  Bữa tiếp theo
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem công thức
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thay thế món
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa món
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Thông tin món ăn với hình ảnh lớn */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={meal.recipe.image || '/images/default-dish.jpg'}
              alt={meal.recipe.title}
              className="w-20 h-20 rounded-lg object-cover shadow-sm"
            />
            {isCompleted && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">{meal.recipe.title}</h5>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{meal.recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>{meal.recipe.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>4 người</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Xem công thức
          </Button>
          {!isCompleted && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
              onClick={() => onMarkComplete?.(meal.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Hoàn thành
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (!currentPlan) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-600" />
            Thực Đơn Hôm Nay - {todayDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có kế hoạch ăn uống
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo kế hoạch ăn uống để bắt đầu theo dõi thực đơn hàng ngày và nhận gợi ý món ăn phù hợp
          </p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link to="/meal-planner">
              <Plus className="h-4 w-4 mr-2" />
              Tạo kế hoạch đầu tiên
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-600" />
            Thực Đơn Hôm Nay - {todayDate}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-white">
              {currentPlan.name}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link to="/meal-planner">
                Xem chi tiết
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danh sách món ăn theo từng bữa */}
        <div className="space-y-4">
          {renderMealCard('breakfast', todayMealPlan.breakfast)}
          {renderMealCard('lunch', todayMealPlan.lunch)}
          {renderMealCard('dinner', todayMealPlan.dinner)}
          {todayMealPlan.snack && renderMealCard('snack', todayMealPlan.snack)}
        </div>

        {/* Quick stats */}
        <div className="mt-6 p-4 bg-white/50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {Object.values(todayMealPlan).filter(meal => meal?.recipe).length}/4
                </div>
                <div className="text-gray-600 text-xs">Món ăn</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">~1,850</div>
                <div className="text-gray-600 text-xs">Kcal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">~85k</div>
                <div className="text-gray-600 text-xs">Chi phí</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Gợi ý AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTodayMealPlan;
