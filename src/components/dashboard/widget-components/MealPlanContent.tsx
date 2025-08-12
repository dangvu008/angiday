import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MealPlanContentProps, MEAL_TYPE_CONFIGS } from '@/types/today-meal-widget';
import MealCard from './MealCard';

const MealPlanContent: React.FC<MealPlanContentProps> = ({
  todayPlan,
  onViewRecipe,
  onAddMeal,
  onRemoveMeal
}) => {
  // Thứ tự hiển thị các bữa ăn
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  // Defensive programming: đảm bảo todayPlan và meals luôn tồn tại
  if (!todayPlan || !todayPlan.meals) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">Đang tải kế hoạch bữa ăn...</p>
      </div>
    );
  }

  const handleAddMeal = (mealType: string) => {
    onAddMeal(mealType);
  };

  const handleRemoveMeal = (mealType: string, mealId: string) => {
    onRemoveMeal(mealType, mealId);
  };

  return (
    <div className="space-y-6">
      {mealOrder.map((mealType) => {
        const mealSlot = todayPlan.meals[mealType];
        const config = MEAL_TYPE_CONFIGS[mealType];

        // Defensive programming: đảm bảo mealSlot và meals tồn tại
        if (!mealSlot) {
          return null;
        }

        // Đảm bảo meals là array
        const meals = Array.isArray(mealSlot.meals) ? mealSlot.meals : [];
        
        return (
          <div key={mealType} className="space-y-3">
            {/* Header của bữa ăn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.emoji}</span>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {config.label}
                </h3>
                {meals.length > 0 && (
                  <span className="text-sm text-neutral-500">
                    ({meals.length} món)
                  </span>
                )}
              </div>
              
              {/* Nút thêm món */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-dashed border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400"
                onClick={() => handleAddMeal(mealType)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm món
              </Button>
            </div>

            {/* Danh sách món ăn */}
            {meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onViewRecipe={onViewRecipe}
                    onRemoveMeal={(mealId) => handleRemoveMeal(mealType, mealId)}
                  />
                ))}
              </div>
            ) : (
              // Trạng thái trống
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">{config.emoji}</div>
                <p className="text-sm text-neutral-500 mb-3">
                  Chưa có món nào cho {config.label.toLowerCase()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-primary-300 text-primary-600 hover:bg-primary-50"
                  onClick={() => handleAddMeal(mealType)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm món đầu tiên
                </Button>
              </div>
            )}

            {/* Ghi chú bữa ăn */}
            {mealSlot.notes && (
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Ghi chú:</span> {mealSlot.notes}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MealPlanContent;
