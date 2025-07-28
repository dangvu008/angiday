import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  Clock,
  DollarSign,
  Flame,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeekPlan, DayPlan, Dish, MealSlot } from '@/types/meal-planning';
import { mealPlanningService } from '@/services/meal-planning.service';
import DraggableDish from './DraggableDish';
import MealSlotDropZone from './MealSlotDropZone';

interface WeeklyCalendarProps {
  weekPlan: WeekPlan;
  onWeekPlanUpdate: (updatedPlan: WeekPlan) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  weekPlan,
  onWeekPlanUpdate
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(weekPlan.startDate));

  const getDaysOfWeek = () => {
    const days = [];
    const startDate = new Date(currentWeekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getDayPlan = (date: Date): DayPlan | null => {
    const dateString = date.toISOString().split('T')[0];
    return weekPlan.days.find(day => day.date === dateString) || null;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const handleDishDrop = async (
    dish: Dish, 
    date: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    try {
      await mealPlanningService.addDishToMealSlot(weekPlan.id, date, mealType, dish);
      
      // Reload the updated week plan
      const updatedPlans = await mealPlanningService.getWeekPlans();
      const updatedPlan = updatedPlans.find(plan => plan.id === weekPlan.id);
      
      if (updatedPlan) {
        onWeekPlanUpdate(updatedPlan);
      }
    } catch (error) {
      console.error('Error adding dish to meal slot:', error);
    }
  };

  const handleDishRemove = async (
    dishId: string,
    date: string,
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    try {
      await mealPlanningService.removeDishFromMealSlot(weekPlan.id, date, mealType, dishId);
      
      // Reload the updated week plan
      const updatedPlans = await mealPlanningService.getWeekPlans();
      const updatedPlan = updatedPlans.find(plan => plan.id === weekPlan.id);
      
      if (updatedPlan) {
        onWeekPlanUpdate(updatedPlan);
      }
    } catch (error) {
      console.error('Error removing dish from meal slot:', error);
    }
  };

  const daysOfWeek = getDaysOfWeek();
  const mealTypes = [
    { key: 'breakfast' as const, name: 'Sáng', icon: '🌅', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'lunch' as const, name: 'Trưa', icon: '☀️', color: 'bg-orange-50 border-orange-200' },
    { key: 'dinner' as const, name: 'Tối', icon: '🌙', color: 'bg-blue-50 border-blue-200' }
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentWeekStart.toLocaleDateString('vi-VN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })} - {' '}
              {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', { 
                day: 'numeric', 
                month: 'long' 
              })}
            </h2>
            <p className="text-sm text-gray-600">
              Tổng: {weekPlan.totalCalories} kcal • {weekPlan.totalCost.toLocaleString()}đ
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Flame className="h-3 w-3 mr-1" />
            {Math.round(weekPlan.averageCaloriesPerDay)} kcal/ngày
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <DollarSign className="h-3 w-3 mr-1" />
            {Math.round(weekPlan.totalCost / 7).toLocaleString()}đ/ngày
          </Badge>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-4">
        {/* Time Column */}
        <div className="space-y-4">
          <div className="h-16"></div> {/* Header spacer */}
          {mealTypes.map((mealType) => (
            <div key={mealType.key} className="h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">{mealType.icon}</div>
                <div className="text-sm font-medium text-gray-700">{mealType.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {daysOfWeek.map((date, dayIndex) => {
          const dayPlan = getDayPlan(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={dayIndex} className="space-y-4">
              {/* Day Header */}
              <Card className={`h-16 ${isToday ? 'ring-2 ring-orange-500 bg-orange-50' : ''}`}>
                <CardContent className="p-3 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </div>
                  {dayPlan && (
                    <div className="text-xs text-gray-500 mt-1">
                      {dayPlan.totalCalories} kcal
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Meal Slots */}
              {mealTypes.map((mealType) => {
                const mealSlot = dayPlan?.meals[mealType.key];
                const dateString = date.toISOString().split('T')[0];
                
                return (
                  <MealSlotDropZone
                    key={`${dayIndex}-${mealType.key}`}
                    date={dateString}
                    mealType={mealType.key}
                    mealSlot={mealSlot}
                    className={`h-32 ${mealType.color}`}
                    onDishDrop={handleDishDrop}
                    onDishRemove={handleDishRemove}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Calories</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {weekPlan.totalCalories.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(weekPlan.averageCaloriesPerDay)} kcal/ngày
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Chi phí</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {weekPlan.totalCost.toLocaleString()}đ
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(weekPlan.totalCost / 7).toLocaleString()}đ/ngày
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Thời gian nấu</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(weekPlan.days.reduce((total, day) => {
                const dayTime = Object.values(day.meals).reduce((mealTotal, meal) => {
                  if (Array.isArray(meal)) {
                    return mealTotal + meal.reduce((snackTotal, snack) => snackTotal + snack.totalCookingTime, 0);
                  }
                  return mealTotal + meal.totalCookingTime;
                }, 0);
                return total + dayTime;
              }, 0) / weekPlan.days.length)} phút
            </div>
            <div className="text-sm text-gray-600">
              Trung bình/ngày
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Món ăn</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {weekPlan.days.reduce((total, day) => {
                return total + Object.values(day.meals).reduce((mealTotal, meal) => {
                  if (Array.isArray(meal)) {
                    return mealTotal + meal.reduce((snackTotal, snack) => snackTotal + snack.dishes.length, 0);
                  }
                  return mealTotal + meal.dishes.length;
                }, 0);
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">
              Tổng số món
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
