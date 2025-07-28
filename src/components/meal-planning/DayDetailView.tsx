import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Plus, Edit } from 'lucide-react';
import { SingleDayPlan } from '@/types/meal-planning';

interface DayDetailViewProps {
  plan: SingleDayPlan;
  onEditMeal?: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onAddDish?: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
}

const DayDetailView = ({ plan, onEditMeal, onAddDish }: DayDetailViewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      default: return 'Bữa ăn';
    }
  };

  const getMealColors = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return {
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        button: 'hover:bg-orange-50'
      };
      case 'lunch': return {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-800',
        button: 'hover:bg-green-50'
      };
      case 'dinner': return {
        bg: 'from-purple-50 to-pink-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'hover:bg-purple-50'
      };
      default: return {
        bg: 'from-gray-50 to-blue-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        button: 'hover:bg-gray-50'
      };
    }
  };

  const today = new Date();
  const planDate = new Date(plan.date);
  const isToday = planDate.toDateString() === today.toDateString();
  const isPast = planDate < today;
  const isFuture = planDate > today;

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className={`border-0 shadow-lg ${isToday ? 'bg-gradient-to-r from-blue-50 to-purple-50 ring-2 ring-blue-500' : 'bg-gradient-to-r from-gray-50 to-blue-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-3">{plan.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <Badge className={isToday ? 'bg-blue-500 text-white' : isPast ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'}>
                  📅 {new Date(plan.date).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
                {isToday && <Badge className="bg-blue-500 text-white">Hôm nay</Badge>}
                {isPast && <Badge variant="outline" className="text-gray-500">Đã qua</Badge>}
                {isFuture && <Badge variant="outline" className="text-blue-600 border-blue-200">Sắp tới</Badge>}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{plan.totalCalories}</div>
              <div className="text-sm text-gray-600">Tổng calories</div>
              <div className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(plan.totalCost)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
          const meal = plan.meals[mealType];
          const colors = getMealColors(mealType);
          
          return (
            <Card key={mealType} className={`border-0 shadow-lg bg-gradient-to-br ${colors.bg} ${colors.border}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${colors.text} flex items-center gap-2`}>
                    <span className="text-2xl">{getMealIcon(mealType)}</span>
                    {getMealLabel(mealType)}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMeal?.(mealType)}
                      className={colors.button}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddDish?.(mealType)}
                      className={colors.button}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Meal Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-gray-800">{meal.totalCalories}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(meal.totalCost)}
                      </div>
                      <div className="text-xs text-gray-600">Chi phí</div>
                    </div>
                  </div>

                  {/* Cooking Time */}
                  <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Thời gian nấu</span>
                    </div>
                    <span className="font-medium text-gray-800">{meal.totalCookingTime} phút</span>
                  </div>

                  {/* Dishes Placeholder */}
                  <div className="bg-white/70 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Món ăn:</h5>
                    {meal.dishes && meal.dishes.length > 0 ? (
                      <div className="space-y-2">
                        {meal.dishes.map((dish, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm font-medium">{dish.name || `Món ${index + 1}`}</span>
                            <span className="text-xs text-gray-600">{dish.calories || 0} kcal</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-2xl mb-2">🍽️</div>
                        <p className="text-sm">Chưa có món ăn nào</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddDish?.(mealType)}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Thêm món
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Meal Time Suggestion */}
                  <div className="text-center text-xs text-gray-600 bg-white/50 rounded-lg p-2">
                    {mealType === 'breakfast' && '⏰ Khuyến nghị: 7:00 - 9:00'}
                    {mealType === 'lunch' && '⏰ Khuyến nghị: 11:30 - 13:30'}
                    {mealType === 'dinner' && '⏰ Khuyến nghị: 18:00 - 20:00'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Day Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 <span>Tóm tắt ngày</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{plan.totalCalories}</div>
              <div className="text-sm text-gray-600">Tổng calories</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(plan.totalCost)}</div>
              <div className="text-sm text-gray-600">Tổng chi phí</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{plan.cookingTime}</div>
              <div className="text-sm text-gray-600">Phút nấu</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{plan.servings}</div>
              <div className="text-sm text-gray-600">Khẩu phần</div>
            </div>
          </div>

          {/* Nutrition Breakdown */}
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3">🥗 Phân tích dinh dưỡng</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{plan.nutrition.protein}g</div>
                <div className="text-xs text-gray-600">Protein</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{plan.nutrition.carbs}g</div>
                <div className="text-xs text-gray-600">Carbs</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{plan.nutrition.fat}g</div>
                <div className="text-xs text-gray-600">Fat</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{plan.nutrition.fiber}g</div>
                <div className="text-xs text-gray-600">Chất xơ</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayDetailView;
