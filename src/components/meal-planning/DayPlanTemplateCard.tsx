import React from 'react';
import { Star, Clock, DollarSign, Flame, Calendar, Eye, Download, Coffee, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DayPlanTemplate } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';

interface DayPlanTemplateCardProps {
  template: DayPlanTemplate;
  viewMode: 'grid' | 'list';
  onSelect?: (template: DayPlanTemplate) => void;
  selectionMode?: boolean;
}

const DayPlanTemplateCard: React.FC<DayPlanTemplateCardProps> = ({
  template,
  viewMode,
  onSelect,
  selectionMode = false
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
      // Tăng usage count
      templateLibraryService.incrementUsageCount(template.id, 'day-plan');
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

  const getMealCount = () => {
    const { breakfast, lunch, dinner, snacks } = template.meals;
    return breakfast.length + lunch.length + dinner.length + snacks.length;
  };

  const getMealIcons = () => {
    const icons = [];
    if (template.meals.breakfast.length > 0) icons.push(<Coffee key="breakfast" className="h-4 w-4 text-yellow-600" />);
    if (template.meals.lunch.length > 0) icons.push(<Sun key="lunch" className="h-4 w-4 text-orange-600" />);
    if (template.meals.dinner.length > 0) icons.push(<Moon key="dinner" className="h-4 w-4 text-purple-600" />);
    return icons;
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Template Image/Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>

            {/* Template Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{template.name}</h3>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {getDifficultyText(template.difficulty)}
                </Badge>
                <div className="flex items-center gap-1">
                  {getMealIcons()}
                </div>
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
                  <span>{template.totalCookingTime} phút</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>{getMealCount()} bữa ăn</span>
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
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getDifficultyColor(template.difficulty)}>
            {getDifficultyText(template.difficulty)}
          </Badge>
          <div className="flex items-center gap-1">
            {getMealIcons()}
          </div>
        </div>

        {/* Template Visual */}
        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Calendar className="h-12 w-12 text-blue-600" />
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
            <span>{template.totalCookingTime}p</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>{getMealCount()} bữa</span>
          </div>
        </div>

        {/* Meal Breakdown */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Coffee className="h-3 w-3 text-yellow-600" />
              Sáng:
            </span>
            <span>{template.meals.breakfast.length} món</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sun className="h-3 w-3 text-orange-600" />
              Trưa:
            </span>
            <span>{template.meals.lunch.length} món</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Moon className="h-3 w-3 text-purple-600" />
              Tối:
            </span>
            <span>{template.meals.dinner.length} món</span>
          </div>
          {template.meals.snacks.length > 0 && (
            <div className="flex items-center justify-between">
              <span>Phụ:</span>
              <span>{template.meals.snacks.length} món</span>
            </div>
          )}
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

        {/* Target Audience */}
        {template.targetAudience.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.targetAudience.slice(0, 2).map(audience => (
              <Badge key={audience} variant="outline" className="text-xs">
                {audience}
              </Badge>
            ))}
          </div>
        )}

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
      </CardContent>
    </Card>
  );
};

export default DayPlanTemplateCard;
