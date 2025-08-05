import React from 'react';
import { Recipe } from '@/types/kitchen';

interface RecipeImageProps {
  recipe: Recipe;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ recipe, size = 'medium', className = '' }) => {
  // Early return if recipe is not provided
  if (!recipe) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-2xl">🍽️</span>
      </div>
    );
  }

  // Map Vietnamese recipe names to appropriate emojis
  const getRecipeEmoji = (recipeName: string): string => {
    const name = (recipeName || '').toLowerCase();
    
    if (name.includes('canh chua')) return '🍲';
    if (name.includes('thịt kho')) return '🥩';
    if (name.includes('cá kho')) return '🐟';
    if (name.includes('gà')) return '🐔';
    if (name.includes('tôm')) return '🦐';
    if (name.includes('rau muống')) return '🥬';
    if (name.includes('đậu phụ')) return '🧈';
    if (name.includes('cà tím')) return '🍆';
    if (name.includes('bí đỏ')) return '🎃';
    if (name.includes('gỏi đu đủ')) return '🥗';
    if (name.includes('bánh xèo')) return '🥞';
    if (name.includes('chả cá')) return '🐠';
    if (name.includes('bún bò')) return '🍜';
    if (name.includes('cơm âm phủ')) return '🍚';
    if (name.includes('nướng')) return '🔥';
    if (name.includes('lá lốt')) return '🌿';
    
    // Default based on tags
    const tags = (recipe.tags as string[] || []);
    if (tags.includes('soup')) return '🍲';
    if (tags.includes('grilled')) return '🔥';
    if (tags.includes('vegetarian')) return '🥬';
    if (tags.includes('fish')) return '🐟';
    if (tags.includes('chicken')) return '🐔';
    if (tags.includes('pork')) return '🥩';
    if (tags.includes('shrimp')) return '🦐';
    if (tags.includes('salad')) return '🥗';
    
    return '🍽️';
  };

  const getGradientColors = (recipeName: string): string => {
    const name = (recipeName || '').toLowerCase();
    
    if (name.includes('canh chua')) return 'from-yellow-100 to-orange-100';
    if (name.includes('thịt kho')) return 'from-red-100 to-orange-100';
    if (name.includes('cá kho')) return 'from-blue-100 to-cyan-100';
    if (name.includes('gà')) return 'from-yellow-100 to-amber-100';
    if (name.includes('tôm')) return 'from-pink-100 to-red-100';
    if (name.includes('rau')) return 'from-green-100 to-emerald-100';
    if (name.includes('đậu phụ')) return 'from-yellow-100 to-lime-100';
    if (name.includes('cà tím')) return 'from-purple-100 to-violet-100';
    if (name.includes('bí đỏ')) return 'from-orange-100 to-yellow-100';
    if (name.includes('gỏi')) return 'from-green-100 to-lime-100';
    if (name.includes('bánh xèo')) return 'from-yellow-100 to-orange-100';
    if (name.includes('bún')) return 'from-red-100 to-pink-100';
    if (name.includes('nướng')) return 'from-orange-100 to-red-100';
    
    return 'from-orange-100 to-red-100';
  };

  const getSizeClasses = (size: string): string => {
    switch (size) {
      case 'small':
        return 'h-24 w-24 text-2xl';
      case 'large':
        return 'h-64 w-full text-8xl';
      default:
        return 'h-48 w-full text-4xl';
    }
  };

  const emoji = getRecipeEmoji(recipe.title || '');
  const gradientColors = getGradientColors(recipe.title || '');
  const sizeClasses = getSizeClasses(size);

  return (
    <div 
      className={`
        bg-gradient-to-br ${gradientColors} 
        rounded-lg flex items-center justify-center 
        ${sizeClasses} ${className}
        transition-all duration-200 hover:scale-105
        border border-gray-200 shadow-sm
      `}
    >
      <span className="select-none">{emoji}</span>
    </div>
  );
};

export default RecipeImage;
