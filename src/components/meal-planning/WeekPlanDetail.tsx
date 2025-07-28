import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Users, Plus, Edit, ChefHat } from 'lucide-react';
import { WeekPlan } from '@/types/meal-planning';

interface WeekPlanDetailProps {
  plan: WeekPlan;
  onBack: () => void;
  onEditDay?: (dayIndex: number) => void;
  onAddMeal?: (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
}

const WeekPlanDetail = ({ plan, onBack, onEditDay, onAddMeal }: WeekPlanDetailProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getWeekDays = (startDate: string) => {
    const days = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayName = (date: Date) => {
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return dayNames[date.getDay()];
  };

  const getShortDayName = (date: Date) => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return dayNames[date.getDay()];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const weekDays = getWeekDays(plan.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
      default: return 'Ăn';
    }
  };

  const getMealColors = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-orange-50 to-red-50 border-orange-200';
      case 'lunch': return 'from-green-50 to-emerald-50 border-green-200';
      case 'dinner': return 'from-purple-50 to-pink-50 border-purple-200';
      default: return 'from-gray-50 to-blue-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h1>
                <p className="text-gray-600 mb-3">{plan.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    📆 Kế hoạch tuần
                  </Badge>
                  <span className="text-gray-700 font-medium">
                    {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {new Date(plan.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{Math.round(plan.averageCaloriesPerDay)}</div>
              <div className="text-sm text-gray-600">kcal/ngày</div>
              <div className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(plan.totalCost)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Overview */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const dayData = plan.days[index];
          const isToday = day.getTime() === today.getTime();
          const isPast = day < today;
          const isFuture = day > today;
          const isSelected = selectedDay === index;

          return (
            <Card 
              key={index} 
              className={`
                transition-all duration-200 cursor-pointer hover:shadow-lg
                ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isPast ? 'opacity-75' : ''}
                ${isFuture ? 'border-dashed' : ''}
                ${isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : ''}
              `}
              onClick={() => setSelectedDay(isSelected ? null : index)}
            >
              <CardContent className="p-4">
                {/* Day Header */}
                <div className="text-center mb-3">
                  <div className={`font-medium text-sm ${isToday ? 'text-blue-600' : isSelected ? 'text-orange-600' : 'text-gray-800'}`}>
                    {getShortDayName(day)}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : isSelected ? 'text-orange-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tháng {day.getMonth() + 1}
                  </div>
                </div>

                {/* Meals Summary */}
                <div className="space-y-2">
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                    <div key={mealType} className={`bg-gradient-to-r ${getMealColors(mealType)} rounded-lg p-2 border`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{getMealIcon(mealType)}</span>
                          <span className="text-xs font-medium">{getMealLabel(mealType)}</span>
                        </div>
                        <div className="text-xs font-medium">
                          {dayData?.meals[mealType].totalCalories || 0} kcal
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Total */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="text-center text-xs">
                    <div className="font-bold text-gray-800">
                      {dayData?.totalCalories || 0} kcal
                    </div>
                    <div className="text-gray-600">
                      {formatCurrency(dayData?.totalCost || 0)}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-2 flex justify-center">
                  {isToday && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      Hôm nay
                    </Badge>
                  )}
                  {isPast && !isToday && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      Đã qua
                    </Badge>
                  )}
                  {isFuture && (
                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                      Sắp tới
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      {selectedDay !== null && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Chi tiết {getDayName(weekDays[selectedDay])} - {weekDays[selectedDay].getDate()}/{weekDays[selectedDay].getMonth() + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="hover:bg-white/50"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const meal = plan.days[selectedDay]?.meals[mealType];
                
                return (
                  <Card key={mealType} className={`bg-gradient-to-br ${getMealColors(mealType)} border-0`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{getMealIcon(mealType)}</span>
                          {getMealLabel(mealType)}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddMeal?.(selectedDay, mealType)}
                          className="hover:bg-white/50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {/* Meal Stats */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/70 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold">{meal?.totalCalories || 0}</div>
                            <div className="text-xs text-gray-600">Calories</div>
                          </div>
                          <div className="bg-white/70 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold text-green-600">
                              {formatCurrency(meal?.totalCost || 0)}
                            </div>
                            <div className="text-xs text-gray-600">Chi phí</div>
                          </div>
                        </div>

                        {/* Cooking Time */}
                        <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-700">Thời gian</span>
                          </div>
                          <span className="text-xs font-medium">{meal?.totalCookingTime || 0} phút</span>
                        </div>

                        {/* Dishes Placeholder */}
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="text-center text-gray-500">
                            <ChefHat className="h-6 w-6 mx-auto mb-1" />
                            <p className="text-xs">Chưa có món ăn</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAddMeal?.(selectedDay, mealType)}
                              className="mt-2 text-xs"
                            >
                              Thêm món
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 <span>Tóm tắt tuần</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{plan.totalCalories}</div>
              <div className="text-sm text-gray-600">Tổng calories</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(plan.averageCaloriesPerDay)}</div>
              <div className="text-sm text-gray-600">Trung bình/ngày</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(plan.totalCost)}</div>
              <div className="text-sm text-gray-600">Tổng chi phí</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{plan.cookingTime}</div>
              <div className="text-sm text-gray-600">Phút nấu/ngày</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeekPlanDetail;
