import React from 'react';
import { Star, Clock, DollarSign, Flame, Calendar, Eye, Download, Coffee, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DayPlanTemplate } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Mobile: Header Row */}
            <div className="flex items-center gap-3 sm:hidden">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{template.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {getDifficultyText(template.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getMealIcons().slice(0, 3)}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Template Image/Icon */}
            <div className="hidden sm:block w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>

            {/* Template Info */}
            <div className="flex-1 min-w-0">
              {/* Desktop: Title and badges */}
              <div className="hidden sm:flex items-center gap-2 mb-1">
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

              {/* Mobile: Compact stats */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:hidden mb-2">
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>{template.totalCalories} cal</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-green-500" />
                  <span>{(template.totalCost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>{template.totalCookingTime}p</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Desktop: Horizontal stats */}
              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
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
            <div className="flex flex-wrap gap-1 sm:max-w-xs">
              {template.tags.slice(0, isMobile ? 2 : 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > (isMobile ? 2 : 3) && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tags.length - (isMobile ? 2 : 3)}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              {selectionMode ? (
                <Button onClick={handleSelect} size="sm" className="flex-1 sm:flex-initial">
                  <Download className="h-4 w-4 mr-2" />
                  Chọn
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                    <Eye className="h-4 w-4 sm:mr-0" />
                    <span className="sm:hidden ml-2">Xem</span>
                  </Button>
                  <Button size="sm" onClick={handleSelect} className="flex-1 sm:flex-initial">
                    <Download className="h-4 w-4 sm:mr-0" />
                    <span className="sm:hidden ml-2">Dùng</span>
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
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getDifficultyColor(template.difficulty)}>
            {getDifficultyText(template.difficulty)}
          </Badge>
          <div className="flex items-center gap-1">
            {getMealIcons().slice(0, isMobile ? 2 : 3)}
          </div>
        </div>

        {/* Template Visual - smaller on mobile */}
        <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
        </div>

        <CardTitle className="text-base sm:text-lg line-clamp-2 mb-1">{template.name}</CardTitle>
        
        {template.description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        {/* Stats Grid - compact on mobile */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            <span className="truncate">{template.totalCalories} cal</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            <span className="truncate">{(template.totalCost / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            <span className="truncate">{template.totalCookingTime}p</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
            <span className="truncate">{getMealCount()} bữa</span>
          </div>
        </div>

        {/* Meal Breakdown - condensed on mobile */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Coffee className="h-3 w-3 text-yellow-600" />
              <span className="hidden sm:inline">Sáng:</span>
              <span className="sm:hidden">S:</span>
            </span>
            <span>{template.meals.breakfast.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sun className="h-3 w-3 text-orange-600" />
              <span className="hidden sm:inline">Trưa:</span>
              <span className="sm:hidden">T:</span>
            </span>
            <span>{template.meals.lunch.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Moon className="h-3 w-3 text-purple-600" />
              <span className="hidden sm:inline">Tối:</span>
              <span className="sm:hidden">Tối:</span>
            </span>
            <span>{template.meals.dinner.length}</span>
          </div>
          {template.meals.snacks.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="hidden sm:inline">Phụ:</span>
              <span className="sm:hidden">P:</span>
              <span>{template.meals.snacks.length}</span>
            </div>
          )}
        </div>

        {/* Tags - fewer on mobile */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, isMobile ? 2 : 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs truncate max-w-20 sm:max-w-none">
                {tag}
              </Badge>
            ))}
            {template.tags.length > (isMobile ? 2 : 3) && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - (isMobile ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* Rating & Usage - compact on mobile */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            <span>{template.rating.toFixed(1)}</span>
            <span className="text-gray-500 hidden sm:inline">({template.reviews})</span>
          </div>
          <span className="text-gray-500 truncate">Dùng {template.usageCount}</span>
        </div>

        {/* Target Audience - hide on small mobile */}
        {template.targetAudience.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1">
            {template.targetAudience.slice(0, 2).map(audience => (
              <Badge key={audience} variant="outline" className="text-xs truncate">
                {audience}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions - stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 pt-1 sm:pt-2">
          {selectionMode ? (
            <Button size="sm" className="flex-1 text-xs sm:text-sm" onClick={handleSelect}>
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Chọn
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm border-2 border-gray-400 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-500 transition-all duration-300">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Xem
              </Button>
              <Button size="sm" className="flex-1 text-xs sm:text-sm" onClick={handleSelect}>
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
