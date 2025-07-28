import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus, X, Clock, DollarSign, Flame, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MealTemplate } from '@/types/meal-planning';

interface DayPlanMealSlotProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
  mealTemplates: MealTemplate[];
  onAddTemplate: () => void;
  onRemoveTemplate: (templateId: string) => void;
  onMoveTemplate: (toMealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', templateId: string) => void;
}

const DayPlanMealSlot: React.FC<DayPlanMealSlotProps> = ({
  mealType,
  label,
  icon: Icon,
  color,
  iconColor,
  mealTemplates,
  onAddTemplate,
  onRemoveTemplate,
  onMoveTemplate
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'meal-template',
    drop: (item: { template: MealTemplate; fromMealType?: string }) => {
      if (item.fromMealType && item.fromMealType !== mealType) {
        onMoveTemplate(mealType, item.template.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isEmpty = mealTemplates.length === 0;
  const isDropTarget = isOver && canDrop;

  const getTotalStats = () => {
    return mealTemplates.reduce(
      (total, template) => ({
        calories: total.calories + template.totalCalories,
        cost: total.cost + template.totalCost,
        cookingTime: Math.max(total.cookingTime, template.cookingTime) // Thời gian nấu song song
      }),
      { calories: 0, cost: 0, cookingTime: 0 }
    );
  };

  const stats = getTotalStats();

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
      case 'medium': return 'TB';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  const getMealTypeOptions = () => {
    const options = [
      { key: 'breakfast', label: 'Bữa sáng' },
      { key: 'lunch', label: 'Bữa trưa' },
      { key: 'dinner', label: 'Bữa tối' },
      { key: 'snacks', label: 'Bữa phụ' }
    ];
    return options.filter(option => option.key !== mealType);
  };

  return (
    <Card
      ref={drop}
      className={`
        ${color}
        transition-all duration-200 min-h-[300px]
        ${isDropTarget ? 'ring-2 ring-blue-500 bg-blue-50 scale-105' : ''}
        ${canDrop && !isOver ? 'ring-1 ring-blue-300' : ''}
        ${isEmpty ? 'border-dashed border-2' : ''}
        hover:shadow-md
      `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            {label}
            <Badge variant="outline" className="text-xs">
              {mealTemplates.length}
            </Badge>
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddTemplate}
            className="flex items-center gap-1 border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Thêm
          </Button>
        </div>

        {/* Stats Summary */}
        {!isEmpty && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>{stats.calories}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-500" />
              <span>{(stats.cost / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>{stats.cookingTime}p</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
            <Icon className={`h-12 w-12 ${iconColor} mb-3 opacity-50`} />
            <p className="text-center text-sm">
              {isDropTarget ? 'Thả template vào đây' : 'Chưa có bữa ăn nào'}
            </p>
            <p className="text-center text-xs mt-1">
              Nhấn "Thêm" hoặc kéo template từ thư viện
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mealTemplates.map((template) => (
              <MealTemplateItem
                key={template.id}
                template={template}
                mealType={mealType}
                onRemove={() => onRemoveTemplate(template.id)}
                onMove={onMoveTemplate}
                moveOptions={getMealTypeOptions()}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component con để hiển thị meal template item
interface MealTemplateItemProps {
  template: MealTemplate;
  mealType: string;
  onRemove: () => void;
  onMove: (toMealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', templateId: string) => void;
  moveOptions: Array<{ key: string; label: string }>;
}

const MealTemplateItem: React.FC<MealTemplateItemProps> = ({
  template,
  mealType,
  onRemove,
  onMove,
  moveOptions
}) => {
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
      case 'medium': return 'TB';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow group">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{template.name}</h4>
            <Badge className={`${getDifficultyColor(template.difficulty)} text-xs`}>
              {getDifficultyText(template.difficulty)}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {template.totalCalories}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-500" />
              {(template.totalCost / 1000).toFixed(0)}k
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              {template.cookingTime}p
            </span>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moveOptions.map(option => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => onMove(option.key as any, template.id)}
                >
                  Chuyển đến {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={onRemove} className="text-red-600">
                Xóa khỏi bữa ăn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DayPlanMealSlot;
