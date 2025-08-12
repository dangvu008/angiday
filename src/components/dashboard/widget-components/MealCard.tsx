import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Flame, 
  Users, 
  Eye, 
  X,
  ImageIcon
} from 'lucide-react';
import { MealCardProps } from '@/types/today-meal-widget';

const MealCard: React.FC<MealCardProps> = ({
  meal,
  onViewRecipe,
  onRemoveMeal
}) => {
  const handleViewRecipe = () => {
    if (meal.recipeId) {
      onViewRecipe(meal.recipeId);
    }
  };

  const handleRemoveMeal = () => {
    onRemoveMeal(meal.id);
  };

  return (
    <Card className="group relative overflow-hidden border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 bg-white">
      {/* Remove button - hiện khi hover */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 w-6 h-6 p-0 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full shadow-sm"
        onClick={handleRemoveMeal}
        aria-label={`Xóa ${meal.name}`}
      >
        <X className="h-3 w-3" />
      </Button>

      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
              {meal.thumbnail || meal.image ? (
                <img
                  src={meal.thumbnail || meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback khi ảnh lỗi
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${meal.thumbnail || meal.image ? 'hidden' : ''}`}>
                <ImageIcon className="h-6 w-6 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="flex-1 min-w-0">
            {/* Tên món ăn */}
            <h4 className="font-medium text-neutral-900 text-sm line-clamp-2 mb-1">
              {meal.name}
            </h4>

            {/* Mô tả ngắn */}
            {meal.description && (
              <p className="text-xs text-neutral-600 line-clamp-1 mb-2">
                {meal.description}
              </p>
            )}

            {/* Thông tin chi tiết */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{meal.cookingTime}p</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>{meal.calories} cal</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{meal.servings} phần</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {/* Badge số nguyên liệu */}
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {meal.ingredients.length} nguyên liệu
              </Badge>

              {/* Nút xem công thức */}
              {meal.recipeId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  onClick={handleViewRecipe}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Xem
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
