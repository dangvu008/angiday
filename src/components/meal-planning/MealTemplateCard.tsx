import React from 'react';
import { Star, Clock, DollarSign, Flame, Users, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MealTemplate } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import { HoverAnimation, BounceAnimation } from '@/components/ui/animated-transitions';
import { SuccessAnimation } from '@/components/ui/feedback';

interface MealTemplateCardProps {
  template: MealTemplate;
  viewMode: 'grid' | 'list';
  onSelect?: (template: MealTemplate) => void;
  selectionMode?: boolean;
}

const MealTemplateCard: React.FC<MealTemplateCardProps> = ({
  template,
  viewMode,
  onSelect,
  selectionMode = false
}) => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSelect = () => {
    if (onSelect) {
      setIsSelected(true);
      setShowSuccess(true);

      // Show success animation briefly
      setTimeout(() => {
        onSelect(template);
        // Tăng usage count
        templateLibraryService.incrementUsageCount(template.id, 'meal');
      }, 300);

      // Reset states
      setTimeout(() => {
        setIsSelected(false);
        setShowSuccess(false);
      }, 1000);
    }
  };

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

  const getMealTypeText = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
      case 'snack': return 'Phụ';
      default: return type;
    }
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Template Image/Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Flame className="h-8 w-8 text-orange-600" />
            </div>

            {/* Template Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{template.name}</h3>
                <Badge className={getMealTypeColor(template.type)}>
                  {getMealTypeText(template.type)}
                </Badge>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {getDifficultyText(template.difficulty)}
                </Badge>
              </div>

              {template.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {template.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{template.totalCalories} cal</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>{(template.totalCost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{template.cookingTime} phút</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>{template.servings} phần</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 max-w-xs">
              {template.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {selectionMode ? (
                <Button onClick={handleSelect}>
                  <Download className="h-4 w-4 mr-2" />
                  Chọn
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSelect}>
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <HoverAnimation scale={1.02} lift glow>
      <BounceAnimation trigger={isSelected}>
        <Card className={`
          transition-all duration-300 group cursor-pointer relative overflow-hidden
          ${isSelected ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-lg'}
        `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getDifficultyColor(template.difficulty)}>
            {getDifficultyText(template.difficulty)}
          </Badge>
          <Badge className={getMealTypeColor(template.type)}>
            {getMealTypeText(template.type)}
          </Badge>
        </div>

        {/* Template Visual */}
        <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Flame className="h-12 w-12 text-orange-600" />
        </div>

        <CardTitle className="text-lg line-clamp-2 mb-1">{template.name}</CardTitle>
        
        {template.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{template.totalCalories} cal</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>{(template.totalCost / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{template.cookingTime}p</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-purple-500" />
            <span>{template.servings} phần</span>
          </div>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Rating & Usage */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{template.rating.toFixed(1)}</span>
            <span className="text-gray-500">({template.reviews})</span>
          </div>
          <span className="text-gray-500">Dùng {template.usageCount} lần</span>
        </div>

        {/* Category & Cuisine */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {template.category && <span>{template.category}</span>}
          {template.cuisine && <span>{template.cuisine}</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {selectionMode ? (
            <Button size="sm" className="flex-1" onClick={handleSelect}>
              <Download className="h-4 w-4 mr-2" />
              Chọn template
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1 border-2 border-gray-400 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-500 transition-all duration-300">
                <Eye className="h-4 w-4 mr-2" />
                Xem
              </Button>
              <Button size="sm" className="flex-1" onClick={handleSelect}>
                <Download className="h-4 w-4 mr-2" />
                Dùng
              </Button>
            </>
          )}
        </div>

        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
            <SuccessAnimation size="md" />
          </div>
        )}
      </CardContent>
    </Card>
      </BounceAnimation>
    </HoverAnimation>
  );
};

export default MealTemplateCard;
