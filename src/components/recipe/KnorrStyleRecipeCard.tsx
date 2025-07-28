import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Heart, Star, Bookmark } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { RatingStars } from './RatingStars';

interface KnorrStyleRecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    cookTime: string;
    servings: string;
    difficulty: string;
    rating: number;
    likes: number;
    chef: string;
  };
  onClick?: () => void;
  className?: string;
}

const KnorrStyleRecipeCard: React.FC<KnorrStyleRecipeCardProps> = ({
  recipe,
  onClick,
  className = ""
}) => {
  return (
    <Card 
      className={`group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl ${className}`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white border-0 shadow-md">
            {recipe.category}
          </Badge>
        </div>
        
        {/* Favorite Button */}
        <div className="absolute top-4 right-4">
          <FavoriteButton 
            itemId={recipe.id} 
            itemType="recipe"
            className="bg-white/90 hover:bg-white text-gray-700 border-0 shadow-md w-10 h-10 rounded-full p-0"
          />
        </div>
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{recipe.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-xs text-gray-500">Thời gian</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.cookTime}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xs text-gray-500">Khẩu phần</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.servings}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ChefHat className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xs text-gray-500">Độ khó</div>
            <div className="text-sm font-semibold text-gray-900">{recipe.difficulty}</div>
          </div>
        </div>

        {/* Rating & Chef */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <RatingStars rating={recipe.rating} readonly size="sm" />
            <span className="text-xs text-gray-500">({recipe.likes})</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <ChefHat className="h-3 w-3 mr-1" />
            <span>{recipe.chef}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Xem công thức
        </Button>
      </CardContent>
    </Card>
  );
};

export default KnorrStyleRecipeCard;
