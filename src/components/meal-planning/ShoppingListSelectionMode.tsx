import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  X, 
  Coffee, 
  UtensilsCrossed, 
  Moon,
  Snack,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MealSlot {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: {
    id: string;
    title: string;
    ingredients: string[];
  };
  selected: boolean;
}

interface DayPlan {
  date: string;
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
    snacks: MealSlot[];
  };
  allSelected: boolean;
}

interface ShoppingListSelectionModeProps {
  isActive: boolean;
  onExit: () => void;
  onCreateShoppingList: (selectedMeals: MealSlot[]) => void;
  weekPlan: DayPlan[];
}

const ShoppingListSelectionMode: React.FC<ShoppingListSelectionModeProps> = ({
  isActive,
  onExit,
  onCreateShoppingList,
  weekPlan: initialWeekPlan
}) => {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(initialWeekPlan);
  const [allWeekSelected, setAllWeekSelected] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setWeekPlan(initialWeekPlan);
  }, [initialWeekPlan]);

  // Calculate selected meals count
  const selectedMeals = weekPlan.flatMap(day => [
    day.meals.breakfast,
    day.meals.lunch,
    day.meals.dinner,
    ...day.meals.snacks
  ]).filter(meal => meal.selected && meal.recipe);

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4 text-amber-600" />;
      case 'lunch': return <UtensilsCrossed className="h-4 w-4 text-orange-600" />;
      case 'dinner': return <Moon className="h-4 w-4 text-indigo-600" />;
      case 'snack': return <Snack className="h-4 w-4 text-green-600" />;
      default: return <UtensilsCrossed className="h-4 w-4" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
      case 'snack': return 'Phụ';
      default: return mealType;
    }
  };

  const toggleMealSelection = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', snackIndex?: number) => {
    setWeekPlan(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        const updatedDay = { ...day };
        
        if (mealType === 'snack' && snackIndex !== undefined) {
          updatedDay.meals.snacks = day.meals.snacks.map((snack, idx) => 
            idx === snackIndex ? { ...snack, selected: !snack.selected } : snack
          );
        } else {
          updatedDay.meals[mealType] = {
            ...day.meals[mealType],
            selected: !day.meals[mealType].selected
          };
        }
        
        // Update day's allSelected status
        const dayMeals = [
          updatedDay.meals.breakfast,
          updatedDay.meals.lunch,
          updatedDay.meals.dinner,
          ...updatedDay.meals.snacks
        ].filter(meal => meal.recipe);
        
        updatedDay.allSelected = dayMeals.length > 0 && dayMeals.every(meal => meal.selected);
        
        return updatedDay;
      }
      return day;
    }));
  };

  const toggleDaySelection = (dayIndex: number) => {
    setWeekPlan(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        const newSelected = !day.allSelected;
        const updatedDay = { ...day, allSelected: newSelected };
        
        // Update all meals in the day
        updatedDay.meals.breakfast = { ...day.meals.breakfast, selected: newSelected };
        updatedDay.meals.lunch = { ...day.meals.lunch, selected: newSelected };
        updatedDay.meals.dinner = { ...day.meals.dinner, selected: newSelected };
        updatedDay.meals.snacks = day.meals.snacks.map(snack => ({ ...snack, selected: newSelected }));
        
        return updatedDay;
      }
      return day;
    }));
  };

  const toggleWeekSelection = () => {
    const newSelected = !allWeekSelected;
    setAllWeekSelected(newSelected);
    
    setWeekPlan(prev => prev.map(day => ({
      ...day,
      allSelected: newSelected,
      meals: {
        breakfast: { ...day.meals.breakfast, selected: newSelected },
        lunch: { ...day.meals.lunch, selected: newSelected },
        dinner: { ...day.meals.dinner, selected: newSelected },
        snacks: day.meals.snacks.map(snack => ({ ...snack, selected: newSelected }))
      }
    })));
  };

  const getSelectionSummary = () => {
    const mealCounts = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };

    selectedMeals.forEach(meal => {
      mealCounts[meal.mealType]++;
    });

    const parts = [];
    if (mealCounts.breakfast > 0) parts.push(`${mealCounts.breakfast} bữa sáng`);
    if (mealCounts.lunch > 0) parts.push(`${mealCounts.lunch} bữa trưa`);
    if (mealCounts.dinner > 0) parts.push(`${mealCounts.dinner} bữa tối`);
    if (mealCounts.snack > 0) parts.push(`${mealCounts.snack} bữa phụ`);

    return parts.join(', ') || 'Chưa chọn bữa ăn nào';
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      {/* Header with week selection */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              Chế Độ Chọn Món Đi Chợ
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allWeekSelected}
                onCheckedChange={toggleWeekSelection}
                id="select-all-week"
              />
              <label htmlFor="select-all-week" className="text-sm font-medium cursor-pointer">
                Chọn cả tuần
              </label>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Week Calendar with Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekPlan.map((day, dayIndex) => (
          <Card key={day.date} className={`${day.allSelected ? 'ring-2 ring-orange-300 bg-orange-50' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">
                    {format(new Date(day.date), 'EEEE', { locale: vi })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(day.date), 'dd/MM')}
                  </div>
                </div>
                <Checkbox
                  checked={day.allSelected}
                  onCheckedChange={() => toggleDaySelection(dayIndex)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Breakfast */}
              {day.meals.breakfast.recipe && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                  <Checkbox
                    checked={day.meals.breakfast.selected}
                    onCheckedChange={() => toggleMealSelection(dayIndex, 'breakfast')}
                  />
                  {getMealIcon('breakfast')}
                  <span className="text-xs flex-1">{getMealLabel('breakfast')}</span>
                </div>
              )}
              
              {/* Lunch */}
              {day.meals.lunch.recipe && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                  <Checkbox
                    checked={day.meals.lunch.selected}
                    onCheckedChange={() => toggleMealSelection(dayIndex, 'lunch')}
                  />
                  {getMealIcon('lunch')}
                  <span className="text-xs flex-1">{getMealLabel('lunch')}</span>
                </div>
              )}
              
              {/* Dinner */}
              {day.meals.dinner.recipe && (
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                  <Checkbox
                    checked={day.meals.dinner.selected}
                    onCheckedChange={() => toggleMealSelection(dayIndex, 'dinner')}
                  />
                  {getMealIcon('dinner')}
                  <span className="text-xs flex-1">{getMealLabel('dinner')}</span>
                </div>
              )}
              
              {/* Snacks */}
              {day.meals.snacks.map((snack, snackIndex) => 
                snack.recipe && (
                  <div key={snack.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      checked={snack.selected}
                      onCheckedChange={() => toggleMealSelection(dayIndex, 'snack', snackIndex)}
                    />
                    {getMealIcon('snack')}
                    <span className="text-xs flex-1">{getMealLabel('snack')}</span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Đã chọn:</span> {getSelectionSummary()}
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {selectedMeals.length} bữa ăn
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onExit}>
              <X className="h-4 w-4 mr-2" />
              Hủy chọn
            </Button>
            <Button 
              onClick={() => onCreateShoppingList(selectedMeals)}
              disabled={selectedMeals.length === 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tạo Danh Sách Cho {selectedMeals.length} Bữa Đã Chọn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListSelectionMode;
