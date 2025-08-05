import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Coffee, 
  UtensilsCrossed, 
  Moon,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Dish {
  id: string;
  name: string;
  calories: number;
  cost: number;
  cookingTime: number;
}

interface MealSlot {
  id: string;
  dishes: Dish[];
  totalCalories: number;
  totalCost: number;
  totalCookingTime: number;
}

interface DayPlan {
  date: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
  totalCalories: number;
  totalCost: number;
  isPlanned: boolean;
}

const SimpleMealPlanner: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Mock data for week plan
  const [weekPlan] = useState<DayPlan[]>(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeek, i);
      days.push({
        date: date.toISOString().split('T')[0],
        breakfast: {
          id: `breakfast-${i}`,
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0
        },
        lunch: {
          id: `lunch-${i}`,
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0
        },
        dinner: {
          id: `dinner-${i}`,
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0
        },
        totalCalories: 0,
        totalCost: 0,
        isPlanned: false
      });
    }
    return days;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const getDayName = (date: string) => {
    return format(new Date(date), 'EEEE', { locale: vi });
  };

  const getFormattedDate = (date: string) => {
    return format(new Date(date), 'dd/MM', { locale: vi });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-5 w-5 text-amber-600" />;
      case 'lunch': return <UtensilsCrossed className="h-5 w-5 text-orange-600" />;
      case 'dinner': return <Moon className="h-5 w-5 text-indigo-600" />;
      default: return <UtensilsCrossed className="h-5 w-5" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      default: return mealType;
    }
  };

  const selectedDay = weekPlan[selectedDayIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lập Kế Hoạch Bữa Ăn</h1>
          <p className="text-gray-600">Quản lý thực đơn hàng ngày một cách thông minh và hiệu quả</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Week Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Tuần {format(currentWeek, 'dd/MM')} - {format(addDays(currentWeek, 6), 'dd/MM/yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {weekPlan.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDayIndex(index)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedDayIndex === index
                          ? 'border-orange-300 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {getDayName(day.date)}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {getFormattedDate(day.date)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {day.isPlanned ? '✓' : '○'}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Day Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getDayName(selectedDay.date)} - {getFormattedDate(selectedDay.date)}
                  </h3>

                  {/* Meals */}
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                    <Card key={mealType} className="border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getMealIcon(mealType)}
                          {getMealLabel(mealType)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedDay[mealType].dishes.length === 0 ? (
                          <Button
                            variant="outline"
                            className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Thêm món ăn
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            {selectedDay[mealType].dishes.map((dish) => (
                              <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <h4 className="font-medium text-gray-900">{dish.name}</h4>
                                  <div className="text-sm text-gray-500">
                                    {dish.calories} kcal • {dish.cookingTime} phút • {dish.cost.toLocaleString()}đ
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  Xóa
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm món
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Hành Động Chính */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hành Động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  🛒 Chọn Món Để Đi Chợ
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem Kế Hoạch Tuần
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng Quan Ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng calo:</span>
                    <span className="font-semibold">{selectedDay.totalCalories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chi phí:</span>
                    <span className="font-semibold">{selectedDay.totalCost.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge variant={selectedDay.isPlanned ? "default" : "secondary"}>
                      {selectedDay.isPlanned ? "Đã lên kế hoạch" : "Chưa hoàn thành"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMealPlanner;
