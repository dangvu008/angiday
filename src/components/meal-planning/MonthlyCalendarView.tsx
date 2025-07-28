import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MonthlyCalendarViewProps {
  currentDate: Date;
  onAddDayPlan: (date: string) => void;
  onDateSelect: (date: Date) => void;
}

const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  currentDate,
  onAddDayPlan,
  onDateSelect
}) => {
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday of the week containing first day
    const startDate = new Date(firstDay);
    const startDayOfWeek = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1));
    
    // Generate 42 days (6 weeks)
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthDays = getMonthDays();
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="h-full flex flex-col">
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1">
        {monthDays.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          
          return (
            <Card
              key={index}
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-md
                ${!isCurrentMonth(date) ? 'opacity-30' : ''}
                ${isToday(date) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
              `}
              onClick={() => onDateSelect(date)}
            >
              <CardContent className="p-2 h-full flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-blue-600' : 
                    isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDayPlan(dateString);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Placeholder for meal indicators */}
                <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                  <div className="text-xs">Chưa có thực đơn</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
