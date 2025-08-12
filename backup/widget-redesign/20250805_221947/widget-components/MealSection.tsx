import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Flame,
  Users,
  MoreHorizontal,
  Plus,
  Eye,
  RefreshCw,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MealSectionProps, MEAL_TYPE_CONFIGS } from '@/types/today-meal-widget';

const MealSection: React.FC<MealSectionProps> = ({
  mealType,
  mealSlot,
  isNext,
  onViewRecipe,
  onReplaceMeal,
  onRemoveMeal,
  onAddMeal
}) => {
  const mealConfig = MEAL_TYPE_CONFIGS[mealType];

  // Nếu không có món ăn
  if (!mealSlot.meal) {
    return (
      <div className="space-y-3">
        {/* Header của bữa ăn */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mealConfig.emoji}</span>
          <h3 className="text-lg font-semibold text-gray-700">
            {mealConfig.label}
          </h3>
          {isNext && (
            <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-100">
              Bữa tiếp theo
            </Badge>
          )}
        </div>

        {/* Nút thêm món */}
        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 cursor-pointer group">
          <div className="text-neutral-400 group-hover:text-primary-500 mb-3 transition-colors">
            <Plus className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-sm text-neutral-500 mb-4">Chưa có món ăn</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddMeal(mealType)}
            className="border-dashed border-neutral-300 hover:border-primary-500 hover:text-primary-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm món
          </Button>
        </div>
      </div>
    );
  }

  // Có món ăn
  return (
    <div className="space-y-3">
      {/* Header của bữa ăn */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{mealConfig.emoji}</span>
        <h3 className="text-lg font-semibold text-gray-700">
          {mealConfig.label}
        </h3>
        {isNext && (
          <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-100">
            Bữa tiếp theo
          </Badge>
        )}
      </div>

      {/* Card món ăn */}
      <div className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
        isNext
          ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md'
          : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}>
        <div className="flex items-start gap-4">
          {/* Ảnh món ăn */}
          <div className="relative flex-shrink-0">
            <img
              src={mealSlot.meal.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center`}
              alt={mealSlot.meal.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center`;
              }}
            />
            {mealSlot.isCompleted && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Thông tin món ăn */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-900 mb-2 line-clamp-2 text-sm sm:text-base">
              {mealSlot.meal.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>~{mealSlot.meal.cookingTime} phút</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3 flex-shrink-0" />
                <span>~{mealSlot.meal.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 flex-shrink-0" />
                <span>{mealSlot.meal.servings} người</span>
              </div>
            </div>
          </div>

          {/* Menu hành động */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewRecipe(mealSlot.meal!.recipeId || '')}>
                <Eye className="h-4 w-4 mr-2" />
                Xem công thức
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReplaceMeal(mealType)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Thay thế món
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRemoveMeal(mealType)}
                className="text-error-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Nút thêm món khác (nếu muốn) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddMeal(mealType)}
        className="w-full border-dashed text-neutral-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        Thêm món khác
      </Button>
    </div>
  );
};

export default MealSection;
