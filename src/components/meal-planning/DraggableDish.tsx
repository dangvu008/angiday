import React from 'react';
import { useDrag } from 'react-dnd';
import { Clock, Star, Eye, Users, Flame, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dish } from '@/types/meal-planning';

interface DraggableDishProps {
  dish: Dish;
  onSelect?: (dish: Dish) => void;
  showDetails?: boolean;
  compact?: boolean;
}

const DraggableDish: React.FC<DraggableDishProps> = ({
  dish,
  onSelect,
  showDetails = true,
  compact = false
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'dish',
    item: { dish },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

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

  if (compact) {
    return (
      <div
        ref={drag}
        className={`
          cursor-move transition-all duration-200
          ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'}
        `}
      >
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {dish.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${getDifficultyColor(dish.difficulty)}`}>
                    {getDifficultyText(dish.difficulty)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {dish.cookingTime} phút
                  </span>
                  <span className="text-xs text-gray-500">
                    {dish.calories} kcal
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`
        cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'}
      `}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getDifficultyColor(dish.difficulty)} text-xs font-medium shadow-sm`}>
              {getDifficultyText(dish.difficulty)}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-700">{dish.rating}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">{dish.views}</span>
          </div>
        </div>

        <CardContent className="p-4">
          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {dish.name}
          </h4>

          {showDetails && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{dish.cookingTime} phút</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>{dish.servings} người</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Flame className="h-3 w-3" />
                  <span>{dish.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  <span>{dish.cost.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Dinh dưỡng (100g):</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>Protein: {dish.nutrition.protein}g</span>
                  <span>Carbs: {dish.nutrition.carbs}g</span>
                  <span>Fat: {dish.nutrition.fat}g</span>
                  <span>Fiber: {dish.nutrition.fiber}g</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {dish.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {dish.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{dish.tags.length - 3}
                  </Badge>
                )}
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm"
              onClick={() => onSelect?.(dish)}
            >
              Xem chi tiết
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="px-3"
              onClick={(e) => {
                e.stopPropagation();
                // Handle add to favorites
                console.log('Add to favorites:', dish.id);
              }}
            >
              ♡
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableDish;
