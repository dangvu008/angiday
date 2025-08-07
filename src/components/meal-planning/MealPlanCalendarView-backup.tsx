import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Coffee, Sun, Moon, Clock, Users, Flame, X, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import AddDishModal from './AddDishModal';

interface MealPlanCalendarViewProps {
  currentPlan: any;
  onPlanUpdate: (updatedPlan: any) => void;
}

const MealPlanCalendarView: React.FC<MealPlanCalendarViewProps> = ({
  currentPlan,
  onPlanUpdate
}) => {
  const { addMealToSlot, addDishToMeal, removeMealFromSlot, removeDishFromMeal, saveMealPlan } = useMealPlanning();
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    mealType: string;
  } | null>(null);

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const startDate = new Date(currentWeekStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const getMealsForDate = (date: Date) => {
    if (!currentPlan) return [];
    const dateString = date.toISOString().split('T')[0];
    return currentPlan.meals.filter((meal: any) => meal.date === dateString);
  };

  const getMealsByType = (date: Date, mealType: string) => {
    const meals = getMealsForDate(date);
    return meals.filter((meal: any) => meal.mealType === mealType);
  };

  const getDayNutrition = (date: Date) => {
    const meals = getMealsForDate(date);
    let totalCalories = 0;
    let totalTime = 0;

    meals.forEach((meal: any) => {
      if (meal.recipe) {
        totalCalories += meal.recipe.calories || 0;
        // Parse cooking time (e.g., "30 phút" -> 30)
        const timeMatch = meal.recipe.cookTime.match(/\d+/);
        if (timeMatch) {
          totalTime += parseInt(timeMatch[0]);
        }
      }
    });

    return { totalCalories, totalTime, mealCount: meals.length };
  };

  const handleAddMeal = (date: Date, mealType: string) => {
    setSelectedSlot({
      date: date.toISOString().split('T')[0],
      mealType
    });
    setShowAddDishModal(true);
  };

  const handleAddDish = (recipe: any) => {
    if (!selectedSlot || !currentPlan) return;

    // Use addDishToMeal to allow multiple dishes per meal
    addDishToMeal(
      currentPlan.id,
      selectedSlot.date,
      selectedSlot.mealType,
      recipe
    );

    setSelectedSlot(null);
    setShowAddDishModal(false);
  };

  const handleRemoveDish = (mealSlotId: string) => {
    if (!currentPlan) return;
    removeDishFromMeal(currentPlan.id, mealSlotId);
  };

  const handleRemoveMeal = (date: Date, mealType: string) => {
    if (!currentPlan) return;

    const dateString = date.toISOString().split('T')[0];

    // Remove meal from current plan
    removeMealFromSlot(currentPlan.id, dateString, mealType);

    // Update the plan
    saveMealPlan(currentPlan);
  };

  const handleMoveMeal = (fromDate: Date, fromMealType: string, toDate: Date, toMealType: string) => {
    if (!currentPlan) return;

    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

    // Get the meal to move
    const mealToMove = getMealByType(fromDate, fromMealType);
    if (!mealToMove) return;

    // Remove from original slot
    removeMealFromSlot(currentPlan.id, fromDateString, fromMealType);

    // Add to new slot
    addMealToSlot(currentPlan.id, toDateString, toMealType, mealToMove.recipe);

    // Update the plan
    saveMealPlan(currentPlan);
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Sáng', icon: Coffee, color: 'bg-yellow-50 border-yellow-200' },
    { key: 'lunch', label: 'Trưa', icon: Sun, color: 'bg-orange-50 border-orange-200' },
    { key: 'dinner', label: 'Tối', icon: Moon, color: 'bg-purple-50 border-purple-200' }
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            Tuần {weekDays[0].toLocaleDateString('vi-VN')} - {weekDays[6].toLocaleDateString('vi-VN')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(new Date())}
        >
          Hôm nay
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, dayIndex) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const dayNutrition = getDayNutrition(date);

          return (
            <div key={dayIndex} className="space-y-2">
              {/* Day Header */}
              <div className={`text-center p-2 rounded-lg ${
                isToday ? 'bg-orange-100 text-orange-800' : 'bg-gray-50'
              }`}>
                <div className="text-sm font-medium">{dayNames[dayIndex]}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>

                {/* Day Nutrition Summary */}
                {dayNutrition.mealCount > 0 && (
                  <div className="text-xs mt-1 space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="h-3 w-3" />
                      <span>{dayNutrition.totalCalories} kcal</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{dayNutrition.totalTime}p</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Meal Slots */}
              <div className="space-y-2">
                {mealTypes.map((mealType) => {
                  const meals = getMealsByType(date, mealType.key);
                  const Icon = mealType.icon;

                  return (
                    <Card
                      key={`${dayIndex}-${mealType.key}`}
                      className={`${mealType.color} min-h-[120px] hover:shadow-md transition-shadow`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {mealType.label}
                          {meals.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {meals.length}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {/* Display all dishes for this meal */}
                          {meals.map((meal: any) => (
                            <div key={meal.id} className="bg-white rounded-lg p-2 border group hover:shadow-sm transition-shadow">
                              <div className="flex items-start gap-2">
                                <img
                                  src={meal.recipe.image}
                                  alt={meal.recipe.title}
                                  className="w-10 h-8 object-cover rounded flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {meal.recipe.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="h-3 w-3" />
                                      {meal.recipe.cookTime}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Users className="h-3 w-3" />
                                      {meal.recipe.servings}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Flame className="h-3 w-3" />
                                      {meal.recipe.calories || 'N/A'}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                    onClick={() => handleRemoveDish(meal.id)}
                                    title="Xóa món này"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Meal Notes */}
                              {meal.notes && (
                                <div className="mt-2 text-xs text-gray-600 italic">
                                  "{meal.notes}"
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Add Dish Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full h-8 text-xs border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                            onClick={() => handleAddMeal(date, mealType.key)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {meals.length > 0 ? 'Thêm món khác' : 'Thêm món'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dish Modal */}
      <AddDishModal
        isOpen={showAddDishModal}
        onClose={() => {
          setShowAddDishModal(false);
          setSelectedSlot(null);
        }}
        onAddDish={handleAddDish}
        selectedDate={selectedSlot?.date}
        selectedMealType={selectedSlot?.mealType}
      />
    </div>
  );
};

export default MealPlanCalendarView;
