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
  Trash2,
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MealSlot, MealTypeConfig } from '@/types/today-meal-widget';

interface MealSlideCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealSlot: MealSlot;
  config: MealTypeConfig;
  isCurrent: boolean; // Bữa ăn hiện tại theo thời gian
  isActive: boolean;  // Slide đang được hiển thị
  onViewRecipe: (recipeId: string) => void;
  onReplaceMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string) => void;
  onAddMeal: (mealType: string) => void;
}

const MealSlideCard: React.FC<MealSlideCardProps> = ({
  mealType,
  mealSlot,
  config,
  isCurrent,
  isActive,
  onViewRecipe,
  onReplaceMeal,
  onRemoveMeal,
  onAddMeal
}) => {
  // Nếu không có món ăn
  if (!mealSlot.meal) {
    return (
      <div className={`relative rounded-2xl border-2 transition-all duration-500 min-h-[400px] sm:min-h-[450px] ${
        isCurrent
          ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg sm:scale-105'
          : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}>
        {/* Current Meal Indicator */}
        {isCurrent && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-primary-600 text-white px-3 py-1 text-xs font-medium shadow-md">
              <Play className="h-3 w-3 mr-1" />
              Bữa tiếp theo
            </Badge>
          </div>
        )}

        <div className="p-4 sm:p-6 text-center">
          {/* Meal Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${
              isCurrent ? 'bg-primary-200' : 'bg-neutral-100'
            }`}>
              <span className="text-2xl sm:text-3xl">{config.emoji}</span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className={`text-lg sm:text-xl font-bold ${
                isCurrent ? 'text-primary-800' : 'text-neutral-700'
              }`}>
                {config.label}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                {config.timeRange[0]}:00 - {config.timeRange[1]}:00
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="py-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isCurrent ? 'bg-primary-100' : 'bg-neutral-100'
            }`}>
              <Plus className={`h-8 w-8 ${
                isCurrent ? 'text-primary-600' : 'text-neutral-400'
              }`} />
            </div>
            <p className="text-neutral-500 mb-4">Chưa có món ăn nào</p>
            <Button 
              onClick={() => onAddMeal(mealType)}
              className={`${
                isCurrent 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-neutral-600 hover:bg-neutral-700'
              } text-white px-6 py-2`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm món
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Có món ăn
  return (
    <div className={`relative rounded-2xl border-2 transition-all duration-500 min-h-[400px] sm:min-h-[500px] ${
      isCurrent
        ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-primary-100 shadow-xl sm:scale-105'
        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg'
    }`}>
      {/* Current Meal Indicator */}
      {isCurrent && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary-600 text-white px-3 py-1 text-xs font-medium shadow-md">
            <Play className="h-3 w-3 mr-1" />
            Bữa tiếp theo
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Meal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCurrent ? 'bg-primary-200' : 'bg-neutral-100'
            }`}>
              <span className="text-2xl">{config.emoji}</span>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${
                isCurrent ? 'text-primary-800' : 'text-neutral-700'
              }`}>
                {config.label}
              </h3>
              <p className="text-xs text-neutral-500">
                {config.timeRange[0]}:00 - {config.timeRange[1]}:00
              </p>
            </div>
          </div>

          {/* Menu Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

        {/* Meal Image */}
        <div className="relative mb-4">
          <img
            src={mealSlot.meal.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center`}
            alt={mealSlot.meal.name}
            className={`w-full h-40 sm:h-48 rounded-xl object-cover transition-all duration-300 ${
              isCurrent ? 'shadow-lg' : 'shadow-md'
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center`;
            }}
          />
          {mealSlot.isCompleted && (
            <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-success-500 rounded-full flex items-center justify-center shadow-md">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Meal Info */}
        <div className="mb-4">
          <h4 className="font-bold text-neutral-900 mb-2 text-lg line-clamp-2">
            {mealSlot.meal.name}
          </h4>
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{mealSlot.meal.cookingTime} phút</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              <span>{mealSlot.meal.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{mealSlot.meal.servings} người</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => onViewRecipe(mealSlot.meal!.recipeId || '')}
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Xem công thức
          </Button>
          {isCurrent && !mealSlot.isCompleted && (
            <Button
              size="sm"
              className="bg-success-600 hover:bg-success-700 text-white text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Nấu ngay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealSlideCard;
