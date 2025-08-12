import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Coffee,
  Utensils,
  Moon,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Clock,
  MoreHorizontal,
  Plus,
  AlertCircle,
  ChefHat,
  Flame,
  Users,
  Eye,
  RefreshCw,
  Trash2,
  Edit
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

interface TodayMealPlanProps {
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

const TodayMealPlan: React.FC<TodayMealPlanProps> = ({
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

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-5 w-5" />;
      case 'lunch': return <Utensils className="h-5 w-5" />;
      case 'dinner': return <Utensils className="h-5 w-5" />;
      case 'snack': return <Moon className="h-5 w-5" />;
      default: return <Utensils className="h-5 w-5" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa Sáng ☕';
      case 'lunch': return 'Bữa Trưa 🍚';
      case 'dinner': return 'Bữa Tối 🍽️';
      case 'snack': return 'Bữa Phụ 🍎';
      default: return 'Bữa ăn';
    }
  };

  const renderMealCard = (mealType: string, meal: MealPlan | null) => {
    const isUpcoming = mealType === currentMealType;
    const isCompleted = meal?.recipe && new Date().getHours() > 
      (mealType === 'breakfast' ? 10 : mealType === 'lunch' ? 14 : mealType === 'dinner' ? 19 : 22);

    return (
      <div 
        key={mealType}
        className={`p-4 rounded-lg border transition-all ${
          isUpcoming 
            ? 'border-orange-300 bg-orange-50 shadow-md' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getMealIcon(mealType)}
            <h4 className={`font-semibold ${isUpcoming ? 'text-orange-800' : 'text-gray-700'}`}>
              {getMealLabel(mealType)}
            </h4>
            {isUpcoming && (
              <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-100">
                Bữa tiếp theo
              </Badge>
            )}
          </div>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>

        {meal?.recipe ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={meal.recipe.image}
                alt={meal.recipe.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{meal.recipe.title}</h5>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meal.recipe.cookTime}
                  </div>
                  <div>{meal.recipe.calories} cal</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/recipes/${meal.recipe.id}`}>
                  Xem công thức
                </Link>
              </Button>
              {!isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkComplete?.(meal.id)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReplaceMeal?.(mealType)}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">Chưa có món ăn</p>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Thêm món
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Kiểm tra xem có cần đi chợ không
  const needShopping = Object.values(todayMealPlan).some(meal => 
    meal?.recipe && meal.recipe.ingredients?.length > 0
  );

  if (!currentPlan) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-600" />
            Kế Hoạch Hôm Nay - {todayDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có kế hoạch ăn uống
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo kế hoạch ăn uống để bắt đầu theo dõi thực đơn hàng ngày và nhận gợi ý món ăn phù hợp
          </p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link to="/meal-planner">
              <Plus className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
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
            Kế Hoạch Hôm Nay - {todayDate}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => 
            renderMealCard(mealType, todayMealPlan[mealType as keyof typeof todayMealPlan])
          )}
        </div>

        {needShopping && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Cần chuẩn bị nguyên liệu</h4>
                  <p className="text-sm text-gray-600">Một số món ăn hôm nay cần nguyên liệu</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/shopping-list">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Đi chợ cho bữa {getMealLabel(currentMealType).toLowerCase()}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayMealPlan;
