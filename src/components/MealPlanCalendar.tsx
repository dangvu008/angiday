import React, { useState, useMemo } from 'react';
import { Recipe, MealSlot, useMealPlanning } from '@/contexts/MealPlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Trash2,
  Eye
} from 'lucide-react';
// Simple date utilities without date-fns
const formatDate = (date: Date, format: string) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (format === 'yyyy-MM-dd') {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  if (format === 'dd/MM/yyyy') {
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }
  if (format === 'dd/MM') {
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
  }
  if (format === 'EEE') {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }
  if (format === 'd') {
    return day.toString();
  }
  return date.toLocaleDateString('vi-VN');
};

const getWeekDays = (date: Date) => {
  const days = [];
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday start
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
};

const addWeeks = (date: Date, weeks: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (weeks * 7));
  return newDate;
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

interface MealPlanCalendarProps {
  onAddMeal: (date: string, mealType: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onRemoveMeal: (date: string, mealType: string) => void;
}

const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  onAddMeal,
  onViewRecipe,
  onRemoveMeal
}) => {
  const { currentPlan, currentDate, setCurrentDate, viewMode, getDayNutrition } = useMealPlanning();
  
  // Get week dates
  const weekDays = getWeekDays(currentDate);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  const mealTypes = [
    { key: 'breakfast', label: 'Sáng', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'lunch', label: 'Trưa', color: 'bg-orange-50 border-orange-200' },
    { key: 'dinner', label: 'Tối', color: 'bg-blue-50 border-blue-200' },
    { key: 'snack', label: 'Phụ', color: 'bg-green-50 border-green-200' }
  ];

  // Get meals for a specific date and meal type
  const getMealForSlot = (date: Date, mealType: string): MealSlot | undefined => {
    if (!currentPlan) return undefined;
    const dateStr = formatDate(date, 'yyyy-MM-dd');
    return currentPlan.meals.find(meal =>
      meal.date === dateStr && meal.mealType === mealType
    );
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentDate(addWeeks(currentDate, -1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get day nutrition summary
  const getDayCalories = (date: Date): number => {
    const dateStr = formatDate(date, 'yyyy-MM-dd');
    const nutrition = getDayNutrition(dateStr);
    return nutrition.calories;
  };

  if (!currentPlan) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có kế hoạch bữa ăn
            </h3>
            <p className="text-gray-600">
              Tạo kế hoạch mới để bắt đầu lập thực đơn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {formatDate(weekStart, 'dd/MM')} - {formatDate(weekEnd, 'dd/MM/yyyy')}
                </h2>
                <p className="text-sm text-gray-600">
                  Tuần {Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)} năm {currentDate.getFullYear()}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hôm nay
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-4">
        {/* Time slots header */}
        <div className="space-y-2">
          <div className="h-16"></div> {/* Empty space for day headers */}
          {mealTypes.map(mealType => (
            <div key={mealType.key} className="h-32 flex items-center justify-center">
              <div className="text-sm font-medium text-gray-700 text-center">
                {mealType.label}
              </div>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="space-y-2">
            {/* Day header */}
            <Card className={`h-16 ${isSameDay(day, new Date()) ? 'bg-orange-50 border-orange-200' : ''}`}>
              <CardContent className="p-3 text-center">
                <div className="text-sm font-medium">
                  {formatDate(day, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {formatDate(day, 'd')}
                </div>
                <div className="text-xs text-gray-600">
                  {getDayCalories(day)} cal
                </div>
              </CardContent>
            </Card>

            {/* Meal slots */}
            {mealTypes.map(mealType => {
              const meal = getMealForSlot(day, mealType.key);
              const dateStr = formatDate(day, 'yyyy-MM-dd');

              return (
                <Card 
                  key={`${day.toISOString()}-${mealType.key}`}
                  className={`h-32 ${mealType.color} hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-2 h-full">
                    {meal?.recipe ? (
                      <div className="h-full flex flex-col">
                        <div className="flex-1">
                          <img
                            src={meal.recipe.image}
                            alt={meal.recipe.title}
                            className="w-full h-16 object-cover rounded mb-1"
                          />
                          <h4 className="text-xs font-medium line-clamp-2 mb-1">
                            {meal.recipe.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {meal.recipe.cookTime}
                          </div>
                        </div>
                        <div className="flex space-x-1 mt-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => onViewRecipe(meal.recipe!)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            onClick={() => onRemoveMeal(dateStr, mealType.key)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-full w-full border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                          onClick={() => onAddMeal(dateStr, mealType.key)}
                        >
                          <Plus className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      {/* Week Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tổng quan tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {weekDays.reduce((total, day) => total + getDayCalories(day), 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentPlan.meals.filter(meal => {
                  const mealDate = new Date(meal.date);
                  return mealDate >= weekStart && mealDate <= weekEnd;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Bữa ăn đã lên kế hoạch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(weekDays.reduce((total, day) => total + getDayCalories(day), 0) / 7)}
              </div>
              <div className="text-sm text-gray-600">Trung bình/ngày</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(currentPlan.meals.map(meal => meal.recipe?.id)).size}
              </div>
              <div className="text-sm text-gray-600">Công thức khác nhau</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanCalendar;
