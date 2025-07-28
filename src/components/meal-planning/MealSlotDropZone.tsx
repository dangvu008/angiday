import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus, X, Clock, Flame, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dish, MealSlot } from '@/types/meal-planning';
import DraggableDish from './DraggableDish';

interface MealSlotDropZoneProps {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  mealSlot?: MealSlot;
  className?: string;
  onDishDrop: (dish: Dish, date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onDishRemove: (dishId: string, date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
}

const MealSlotDropZone: React.FC<MealSlotDropZoneProps> = ({
  date,
  mealType,
  mealSlot,
  className = '',
  onDishDrop,
  onDishRemove
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'dish',
    drop: (item: { dish: Dish }) => {
      onDishDrop(item.dish, date, mealType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isEmpty = !mealSlot || mealSlot.dishes.length === 0;
  const isDropTarget = isOver && canDrop;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  return (
    <Card
      ref={drop}
      className={`
        ${className}
        transition-all duration-200
        ${isDropTarget ? 'ring-2 ring-orange-500 bg-orange-100 scale-105' : ''}
        ${canDrop && !isOver ? 'ring-1 ring-orange-300' : ''}
        ${isEmpty ? 'border-dashed border-2 border-gray-300' : ''}
        hover:shadow-md
      `}
    >
      <CardContent className="p-3 h-full">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Plus className="h-6 w-6 mb-2" />
            <span className="text-xs text-center">
              {isDropTarget ? 'Thả món ăn vào đây' : 'Kéo món ăn vào đây'}
            </span>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Meal Slot Summary */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {mealSlot.totalCalories}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {Math.round(mealSlot.totalCost / 1000)}k
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {mealSlot.totalCookingTime}p
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {mealSlot.dishes.length} món
              </Badge>
            </div>

            {/* Dishes List */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {mealSlot.dishes.map((dish, index) => (
                <div
                  key={`${dish.id}-${index}`}
                  className="group relative bg-white rounded-md p-2 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-8 h-6 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-900 truncate">
                        {dish.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs px-1 py-0 ${getDifficultyColor(dish.difficulty)}`}
                        >
                          {getDifficultyText(dish.difficulty)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {dish.cookingTime}p
                        </span>
                        <span className="text-xs text-gray-500">
                          {dish.calories} kcal
                        </span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      onClick={() => onDishRemove(dish.id, date, mealType)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            {isDropTarget && (
              <div className="mt-2 p-2 border-2 border-dashed border-orange-300 rounded-md bg-orange-50">
                <div className="text-center text-xs text-orange-600">
                  Thả để thêm món ăn
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealSlotDropZone;
