import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Copy, Trash2 } from 'lucide-react';
import { WeekPlan } from '@/types/meal-planning';

interface SimpleWeekViewProps {
  plan: WeekPlan;
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const SimpleWeekView = ({ plan, onEdit, onCopy, onDelete, onClick }: SimpleWeekViewProps) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <Card
      className="border border-gray-200 hover:shadow-sm transition-shadow bg-white cursor-pointer hover:border-orange-300"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {formatDateRange(plan.startDate, plan.endDate)}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{Math.round(plan.averageCaloriesPerDay)} kcal/ngày</span>
                <span>0đ</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="hover:bg-gray-50 h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy?.();
              }}
              className="hover:bg-gray-50 h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="hover:bg-gray-50 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleWeekView;
