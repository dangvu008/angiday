import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Utensils } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MealPlan {
  id: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeName: string;
  recipeId: string;
}

interface CalendarGridProps {
  mealPlans: MealPlan[];
  onAddMeal: (date: Date, mealType: string) => void;
  onRemoveMeal: (mealPlanId: string) => void;
}

export const CalendarGrid = ({ 
  mealPlans, 
  onAddMeal, 
  onRemoveMeal 
}: CalendarGridProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Bắt đầu từ thứ 2
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const mealTypes = [
    { key: 'breakfast', label: 'Sáng', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'lunch', label: 'Trưa', color: 'bg-blue-100 text-blue-800' },
    { key: 'dinner', label: 'Tối', color: 'bg-purple-100 text-purple-800' },
    { key: 'snack', label: 'Phụ', color: 'bg-green-100 text-green-800' }
  ];

  const getMealsForDay = (date: Date) => {
    return mealPlans.filter(meal => isSameDay(meal.date, date));
  };

  const getMealsByType = (date: Date, mealType: string) => {
    return mealPlans.filter(meal => 
      isSameDay(meal.date, date) && meal.mealType === mealType
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'prev' 
      ? subWeeks(currentWeek, 1) 
      : addWeeks(currentWeek, 1)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="h-5 w-5 mr-2" />
            Lịch thực đơn
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(weekStart, 'dd/MM', { locale: vi })} - {format(addDays(weekStart, 6), 'dd/MM/yyyy', { locale: vi })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="font-medium text-sm mb-2">
                {format(day, 'EEE', { locale: vi })}
              </div>
              <div className={`text-xs p-1 rounded ${
                isSameDay(day, new Date()) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {format(day, 'dd')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-2 min-h-[300px] space-y-2">
              {mealTypes.map((mealType) => {
                const meals = getMealsByType(day, mealType.key);
                return (
                  <div key={mealType.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${mealType.color}`}
                      >
                        {mealType.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onAddMeal(day, mealType.key)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="bg-muted rounded p-2 text-xs group relative cursor-pointer"
                        onClick={() => onRemoveMeal(meal.id)}
                      >
                        <div className="truncate" title={meal.recipeName}>
                          {meal.recipeName}
                        </div>
                        <div className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                          Xóa
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Tổng kết tuần */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Tổng kết tuần này:</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            {mealTypes.map((mealType) => {
              const count = mealPlans.filter(meal => 
                weekDays.some(day => isSameDay(day, meal.date)) && 
                meal.mealType === mealType.key
              ).length;
              return (
                <div key={mealType.key}>
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-muted-foreground">{mealType.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};