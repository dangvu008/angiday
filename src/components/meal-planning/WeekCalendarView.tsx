import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeekPlan } from '@/types/meal-planning';

interface WeekCalendarViewProps {
  plan: WeekPlan;
  onDayClick?: (dayIndex: number) => void;
}

const WeekCalendarView = ({ plan, onDayClick }: WeekCalendarViewProps) => {
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

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-sm text-gray-600">
              {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {new Date(plan.endDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{plan.totalCalories}</div>
            <div className="text-xs text-gray-600">Tổng calories</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayData = plan.days[index];
          const isToday = day.getTime() === today.getTime();
          const isPast = day < today;
          const isFuture = day > today;

          return (
            <Card 
              key={index} 
              className={`
                transition-all duration-200 cursor-pointer hover:shadow-lg
                ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isPast ? 'opacity-75' : ''}
                ${isFuture ? 'border-dashed' : ''}
              `}
              onClick={() => onDayClick?.(index)}
            >
              <CardContent className="p-4">
                {/* Day Header */}
                <div className="text-center mb-3">
                  <div className={`font-medium text-sm ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                    {getShortDayName(day)}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tháng {day.getMonth() + 1}
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-2">
                  {/* Breakfast */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🌅</span>
                        <span className="text-xs font-medium text-orange-800">Sáng</span>
                      </div>
                      <div className="text-xs text-orange-700 font-medium">
                        {dayData?.meals.breakfast.totalCalories || 0} kcal
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatCurrency(dayData?.meals.breakfast.totalCost || 0)}
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">☀️</span>
                        <span className="text-xs font-medium text-green-800">Trưa</span>
                      </div>
                      <div className="text-xs text-green-700 font-medium">
                        {dayData?.meals.lunch.totalCalories || 0} kcal
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatCurrency(dayData?.meals.lunch.totalCost || 0)}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🌙</span>
                        <span className="text-xs font-medium text-purple-800">Tối</span>
                      </div>
                      <div className="text-xs text-purple-700 font-medium">
                        {dayData?.meals.dinner.totalCalories || 0} kcal
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatCurrency(dayData?.meals.dinner.totalCost || 0)}
                    </div>
                  </div>
                </div>

                {/* Day Total */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Tổng ngày:</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {dayData?.totalCalories || 0} kcal
                      </div>
                      <div className="text-gray-600">
                        {formatCurrency(dayData?.totalCost || 0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
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

      {/* Week Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-800 mb-3">📊 Tóm tắt tuần</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{plan.totalCalories}</div>
              <div className="text-xs text-gray-600">Tổng calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(plan.averageCaloriesPerDay)}</div>
              <div className="text-xs text-gray-600">Trung bình/ngày</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(plan.totalCost)}</div>
              <div className="text-xs text-gray-600">Tổng chi phí</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{plan.cookingTime}</div>
              <div className="text-xs text-gray-600">Phút nấu/ngày</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-800 mb-3">🥗 Dinh dưỡng tuần</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">{plan.nutrition.protein}g</div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">{plan.nutrition.carbs}g</div>
              <div className="text-xs text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{plan.nutrition.fat}g</div>
              <div className="text-xs text-gray-600">Fat</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-purple-600">{plan.nutrition.fiber}g</div>
              <div className="text-xs text-gray-600">Chất xơ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeekCalendarView;
