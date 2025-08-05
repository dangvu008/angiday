import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Heart, Plus, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ui/theme-provider';

interface MealCardProps {
  id?: string;
  name: string;
  image?: string;
  cookTime?: string | number;
  servings?: number;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  calories?: number;
  category?: string;
  tags?: string[];
  description?: string;
  isSelected?: boolean;
  isCompleted?: boolean;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'grid';
  showActions?: boolean;
  showStats?: boolean;
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onFavorite?: () => void;
  onComplete?: () => void;
  children?: React.ReactNode;
}

const MealCard: React.FC<MealCardProps> = ({
  id,
  name,
  image,
  cookTime,
  servings,
  difficulty,
  calories,
  category,
  tags = [],
  description,
  isSelected = false,
  isCompleted = false,
  isFavorite = false,
  variant = 'default',
  showActions = true,
  showStats = true,
  className,
  onClick,
  onSelect,
  onFavorite,
  onComplete,
  children
}) => {
  const { designTokens } = useTheme();

  const difficultyColors = {
    'Dễ': 'bg-green-100 text-green-800',
    'Trung bình': 'bg-yellow-100 text-yellow-800',
    'Khó': 'bg-red-100 text-red-800'
  };

  const variantStyles = {
    default: 'w-full',
    compact: 'w-full max-w-sm',
    detailed: 'w-full max-w-md',
    grid: 'w-full aspect-square'
  };

  const formatCookTime = (time: string | number | undefined) => {
    if (!time) return null;
    if (typeof time === 'number') return `${time} phút`;
    return time.toString().includes('phút') ? time : `${time} phút`;
  };

  return (
    <Card 
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg',
        isSelected && 'ring-2 ring-primary-500 ring-offset-2',
        isCompleted && 'opacity-75',
        onClick && 'cursor-pointer hover:scale-105',
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative">
        {image ? (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <Utensils className="h-12 w-12 text-orange-400" />
          </div>
        )}
        
        {/* Overlay Actions */}
        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onFavorite && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite();
                }}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )} />
              </Button>
            )}
            
            {onSelect && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </Button>
            )}
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {isCompleted && (
            <Badge className="bg-green-500 text-white">
              Đã hoàn thành
            </Badge>
          )}
          
          {difficulty && (
            <Badge className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </CardTitle>
          
          {onComplete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            >
              <ChefHat className="h-4 w-4" />
            </Button>
          )}
        </div>

        {description && variant === 'detailed' && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              {cookTime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatCookTime(cookTime)}
                </div>
              )}
              
              {servings && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {servings} người
                </div>
              )}
            </div>
            
            {calories && (
              <div className="text-xs font-medium text-orange-600">
                {calories} kcal
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Category */}
        {category && (
          <div className="text-xs text-gray-500 mb-2">
            {category}
          </div>
        )}

        {/* Custom Children */}
        {children}
      </CardContent>
    </Card>
  );
};

export default MealCard;
