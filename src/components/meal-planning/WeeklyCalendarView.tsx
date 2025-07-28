import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus, Coffee, Sun, Moon, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeekPlan, DayPlan } from '@/types/meal-planning';

interface WeeklyCalendarViewProps {
  currentDate: Date;
  weekPlan: WeekPlan | null;
  onAddDayPlan: (date: string) => void;
  onUpdatePlan: (plan: WeekPlan) => void;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  currentDate,
  weekPlan,
  onAddDayPlan,
  onUpdatePlan
}) => {
  const getWeekDays = () => {
    const start = getWeekStart(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getWeekStart = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  };

  const getDayPlan = (date: Date): DayPlan | undefined => {
    if (!weekPlan) return undefined;
    const dateString = date.toISOString().split('T')[0];
    return weekPlan.days.find(day => day.date === dateString);
  };

  const getDayName = (date: Date): string => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = getWeekDays();

  return (
    <div className="h-full flex flex-col">
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((date, index) => (
          <div key={index} className="text-center">
            <div className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-600'}`}>
              {getDayName(date)}
            </div>
            <div className={`text-lg font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-2 overflow-y-auto">
        {weekDays.map((date, index) => {
          const dayPlan = getDayPlan(date);
          const dateString = date.toISOString().split('T')[0];
          
          return (
            <DayColumn
              key={index}
              date={date}
              dayPlan={dayPlan}
              onAddDayPlan={() => onAddDayPlan(dateString)}
            />
          );
        })}
      </div>
    </div>
  );
};

// Component cho mỗi cột ngày
interface DayColumnProps {
  date: Date;
  dayPlan?: DayPlan;
  onAddDayPlan: () => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  date,
  dayPlan,
  onAddDayPlan
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'day-plan-template',
    drop: (item: any) => {
      // Handle drop day plan template
      console.log('Dropped day plan template:', item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isToday = date.toDateString() === new Date().toDateString();
  const isEmpty = !dayPlan || (
    dayPlan.meals.breakfast.dishes.length === 0 &&
    dayPlan.meals.lunch.dishes.length === 0 &&
    dayPlan.meals.dinner.dishes.length === 0 &&
    dayPlan.meals.snacks.length === 0
  );

  const getMealCount = () => {
    if (!dayPlan) return 0;
    return (
      dayPlan.meals.breakfast.dishes.length +
      dayPlan.meals.lunch.dishes.length +
      dayPlan.meals.dinner.dishes.length +
      dayPlan.meals.snacks.reduce((sum, snack) => sum + snack.dishes.length, 0)
    );
  };

  return (
    <Card
      ref={drop}
      className={`
        h-full min-h-[400px] transition-all duration-200
        ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        ${isOver && canDrop ? 'ring-2 ring-green-500 bg-green-50' : ''}
        ${isEmpty ? 'border-dashed border-2' : ''}
        hover:shadow-md
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddDayPlan}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
            <Plus className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-xs text-center">
              {isOver && canDrop ? 'Thả thực đơn vào đây' : 'Chưa có thực đơn'}
            </p>
          </div>
        ) : (
          <>
            {/* Meal Summary */}
            <div className="space-y-1">
              {dayPlan!.meals.breakfast.dishes.length > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Coffee className="h-3 w-3 text-yellow-600" />
                  <span>{dayPlan!.meals.breakfast.dishes.length} món</span>
                </div>
              )}
              
              {dayPlan!.meals.lunch.dishes.length > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Sun className="h-3 w-3 text-orange-600" />
                  <span>{dayPlan!.meals.lunch.dishes.length} món</span>
                </div>
              )}
              
              {dayPlan!.meals.dinner.dishes.length > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Moon className="h-3 w-3 text-purple-600" />
                  <span>{dayPlan!.meals.dinner.dishes.length} món</span>
                </div>
              )}
              
              {dayPlan!.meals.snacks.length > 0 && (
                <div className="text-xs text-gray-600">
                  +{dayPlan!.meals.snacks.length} bữa phụ
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-600 space-y-1">
                <div>{dayPlan!.totalCalories} cal</div>
                <div>{(dayPlan!.totalCost / 1000).toFixed(0)}k VND</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary" className="text-xs">
                {getMealCount()} món
              </Badge>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendarView;
