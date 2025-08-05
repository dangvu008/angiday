import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import MealCard from './MealCard';

interface MealSlot {
  id?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: {
    id: string;
    name: string;
    image?: string;
    cookTime?: string | number;
    servings?: number;
    difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
    calories?: number;
  };
  dish?: {
    id: string;
    name: string;
    image?: string;
    cookTime?: string | number;
    servings?: number;
    difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
    calories?: number;
  };
  completed?: boolean;
  notes?: string;
}

interface MealPlanGridProps {
  date: string;
  meals: MealSlot[];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showStats?: boolean;
  onMealClick?: (meal: MealSlot) => void;
  onAddMeal?: (mealType: string) => void;
  onEditMeal?: (meal: MealSlot) => void;
  onRemoveMeal?: (meal: MealSlot) => void;
  onCompleteMeal?: (meal: MealSlot) => void;
}

const MealPlanGrid: React.FC<MealPlanGridProps> = ({
  date,
  meals,
  className,
  variant = 'default',
  showActions = true,
  showStats = true,
  onMealClick,
  onAddMeal,
  onEditMeal,
  onRemoveMeal,
  onCompleteMeal
}) => {
  const mealTypes = [
    { key: 'breakfast', label: 'Bữa sáng', time: '6:00 - 9:00' },
    { key: 'lunch', label: 'Bữa trưa', time: '11:00 - 14:00' },
    { key: 'dinner', label: 'Bữa tối', time: '17:00 - 20:00' },
    { key: 'snack', label: 'Bữa phụ', time: '14:00 - 16:00' }
  ];

  const getMealForType = (mealType: string) => {
    return meals.find(meal => meal.mealType === mealType);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalStats = () => {
    const totalCalories = meals.reduce((sum, meal) => {
      const item = meal.recipe || meal.dish;
      return sum + (item?.calories || 0);
    }, 0);

    const totalTime = meals.reduce((sum, meal) => {
      const item = meal.recipe || meal.dish;
      const time = item?.cookTime;
      if (typeof time === 'number') return sum + time;
      if (typeof time === 'string') {
        const match = time.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
      }
      return sum;
    }, 0);

    const completedMeals = meals.filter(meal => meal.completed).length;

    return {
      totalCalories,
      totalTime,
      completedMeals,
      totalMeals: meals.length,
      completionPercentage: meals.length > 0 ? Math.round((completedMeals / meals.length) * 100) : 0
    };
  };

  const stats = getTotalStats();

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(date)}
            </CardTitle>
            {showStats && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {stats.totalTime} phút
                </div>
                <div>
                  {stats.totalCalories} kcal
                </div>
                <Badge variant={stats.completionPercentage === 100 ? 'default' : 'secondary'}>
                  {stats.completedMeals}/{stats.totalMeals} hoàn thành
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className={cn(
          'grid gap-4',
          variant === 'compact' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        )}>
          {mealTypes.map(({ key, label, time }) => {
            const meal = getMealForType(key);
            const mealItem = meal?.recipe || meal?.dish;

            return (
              <div key={key} className="space-y-2">
                {/* Meal Type Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <p className="text-xs text-gray-500">{time}</p>
                  </div>
                  
                  {showActions && onAddMeal && !meal && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddMeal(key)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Meal Content */}
                {meal && mealItem ? (
                  <MealCard
                    id={mealItem.id}
                    name={mealItem.name}
                    image={mealItem.image}
                    cookTime={mealItem.cookTime}
                    servings={mealItem.servings}
                    difficulty={mealItem.difficulty}
                    calories={mealItem.calories}
                    isCompleted={meal.completed}
                    variant={variant === 'compact' ? 'compact' : 'default'}
                    showActions={showActions}
                    showStats={showStats}
                    onClick={() => onMealClick?.(meal)}
                    onComplete={() => onCompleteMeal?.(meal)}
                  >
                    {/* Meal-specific actions */}
                    {showActions && (
                      <div className="flex space-x-1 mt-2">
                        {onEditMeal && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditMeal(meal);
                            }}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                        )}
                        
                        {onRemoveMeal && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveMeal(meal);
                            }}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {meal.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {meal.notes}
                      </div>
                    )}
                  </MealCard>
                ) : (
                  <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="text-gray-400 mb-2">
                        <Plus className="h-8 w-8 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Chưa có món ăn</p>
                      {showActions && onAddMeal && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddMeal(key)}
                          className="w-full"
                        >
                          Thêm món
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanGrid;
