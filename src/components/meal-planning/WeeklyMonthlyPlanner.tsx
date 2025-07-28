import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Save, 
  Eye,
  Grid,
  List,
  Filter,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { WeekPlan, DayPlan, DayPlanTemplate, CalculationResult } from '@/types/meal-planning';
import { mealPlanningService } from '@/services/meal-planning.service';
import { autoCalculatorService } from '@/services/auto-calculator.service';
import { templateLibraryService } from '@/services/template-library.service';
import WeeklyCalendarView from './WeeklyCalendarView';
import MonthlyCalendarView from './MonthlyCalendarView';
import DayPlanLibrary from './DayPlanLibrary';
import PlannerSidebar from './PlannerSidebar';

interface WeeklyMonthlyPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: WeekPlan | null;
  onSave?: (plan: WeekPlan) => void;
}

const WeeklyMonthlyPlanner: React.FC<WeeklyMonthlyPlannerProps> = ({
  isOpen,
  onClose,
  initialPlan,
  onSave
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPlan, setCurrentPlan] = useState<WeekPlan | null>(null);
  const [showDayPlanLibrary, setShowDayPlanLibrary] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Calculation data
  const [weeklyStats, setWeeklyStats] = useState<CalculationResult>({
    calories: 0,
    cost: 0,
    cookingTime: 0,
    nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
    breakdown: {}
  });

  useEffect(() => {
    if (isOpen) {
      if (initialPlan) {
        setCurrentPlan(initialPlan);
        setCurrentDate(new Date(initialPlan.startDate));
      } else {
        createNewPlan();
      }
    }
  }, [isOpen, initialPlan]);

  useEffect(() => {
    if (currentPlan) {
      calculateWeeklyStats();
    }
  }, [currentPlan]);

  const createNewPlan = () => {
    const startDate = getWeekStart(currentDate);
    const endDate = getWeekEnd(startDate);
    
    const newPlan: WeekPlan = {
      id: `week_plan_${Date.now()}`,
      name: `Kế hoạch tuần ${formatDate(startDate)}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      days: generateEmptyDays(startDate, endDate),
      totalCalories: 0,
      totalCost: 0,
      averageCaloriesPerDay: 0,
      tags: [],
      isTemplate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentPlan(newPlan);
  };

  const generateEmptyDays = (startDate: Date, endDate: Date): DayPlan[] => {
    const days: DayPlan[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push({
        date: current.toISOString().split('T')[0],
        meals: {
          breakfast: { id: `breakfast_${current.getTime()}`, dishes: [], totalCalories: 0, totalCost: 0, totalCookingTime: 0, calorieDistribution: {} },
          lunch: { id: `lunch_${current.getTime()}`, dishes: [], totalCalories: 0, totalCost: 0, totalCookingTime: 0, calorieDistribution: {} },
          dinner: { id: `dinner_${current.getTime()}`, dishes: [], totalCalories: 0, totalCost: 0, totalCookingTime: 0, calorieDistribution: {} },
          snacks: []
        },
        totalCalories: 0,
        totalCost: 0,
        nutritionSummary: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
      });
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calculateWeeklyStats = () => {
    if (!currentPlan) return;

    const result = autoCalculatorService.calculateWeekPlan(currentPlan);
    setWeeklyStats(result);
  };

  const getWeekStart = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    return start;
  };

  const getWeekEnd = (startDate: Date): Date => {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    return end;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
    
    // Create new plan for the new period
    if (!initialPlan) {
      createNewPlan();
    }
  };

  const handleAddDayPlan = (date: string) => {
    setSelectedDate(date);
    setShowDayPlanLibrary(true);
  };

  const handleSelectDayPlanTemplate = async (template: DayPlanTemplate) => {
    if (!currentPlan || !selectedDate) return;

    try {
      // Convert template to day plan
      const dayPlan: DayPlan = {
        date: selectedDate,
        meals: {
          breakfast: {
            id: `breakfast_${selectedDate}`,
            dishes: template.meals.breakfast.flatMap(t => t.dishes),
            totalCalories: template.meals.breakfast.reduce((sum, t) => sum + t.totalCalories, 0),
            totalCost: template.meals.breakfast.reduce((sum, t) => sum + t.totalCost, 0),
            totalCookingTime: Math.max(...template.meals.breakfast.map(t => t.cookingTime), 0),
            calorieDistribution: {}
          },
          lunch: {
            id: `lunch_${selectedDate}`,
            dishes: template.meals.lunch.flatMap(t => t.dishes),
            totalCalories: template.meals.lunch.reduce((sum, t) => sum + t.totalCalories, 0),
            totalCost: template.meals.lunch.reduce((sum, t) => sum + t.totalCost, 0),
            totalCookingTime: Math.max(...template.meals.lunch.map(t => t.cookingTime), 0),
            calorieDistribution: {}
          },
          dinner: {
            id: `dinner_${selectedDate}`,
            dishes: template.meals.dinner.flatMap(t => t.dishes),
            totalCalories: template.meals.dinner.reduce((sum, t) => sum + t.totalCalories, 0),
            totalCost: template.meals.dinner.reduce((sum, t) => sum + t.totalCost, 0),
            totalCookingTime: Math.max(...template.meals.dinner.map(t => t.cookingTime), 0),
            calorieDistribution: {}
          },
          snacks: template.meals.snacks.map(snackTemplate => ({
            id: `snack_${selectedDate}_${snackTemplate.id}`,
            dishes: snackTemplate.dishes,
            totalCalories: snackTemplate.totalCalories,
            totalCost: snackTemplate.totalCost,
            totalCookingTime: snackTemplate.cookingTime,
            calorieDistribution: {}
          }))
        },
        totalCalories: template.totalCalories,
        totalCost: template.totalCost,
        nutritionSummary: template.nutrition
      };

      // Update current plan
      const updatedPlan = {
        ...currentPlan,
        days: currentPlan.days.map(day => 
          day.date === selectedDate ? dayPlan : day
        ),
        updatedAt: new Date().toISOString()
      };

      setCurrentPlan(updatedPlan);
      setShowDayPlanLibrary(false);
      toast.success('Đã thêm thực đơn ngày');

      // Increment usage count
      await templateLibraryService.incrementUsageCount(template.id, 'day-plan');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm thực đơn ngày');
      console.error('Error adding day plan:', error);
    }
  };

  const handleSavePlan = async () => {
    if (!currentPlan) return;

    setLoading(true);
    try {
      // Recalculate totals
      const result = autoCalculatorService.calculateWeekPlan(currentPlan);
      const updatedPlan = {
        ...currentPlan,
        totalCalories: result.calories,
        totalCost: result.cost,
        averageCaloriesPerDay: result.calories / 7,
        updatedAt: new Date().toISOString()
      };

      await mealPlanningService.saveWeekPlan(updatedPlan);
      
      if (onSave) {
        onSave(updatedPlan);
      }
      
      toast.success('Đã lưu kế hoạch tuần');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu kế hoạch');
      console.error('Error saving plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPeriodLabel = () => {
    if (viewMode === 'week') {
      const start = getWeekStart(currentDate);
      const end = getWeekEnd(start);
      return `${formatDate(start)} - ${formatDate(end)}`;
    } else {
      return currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    }
  };

  if (!isOpen) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                Kế hoạch {viewMode === 'week' ? 'tuần' : 'tháng'}
              </DialogTitle>
              
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                  <TabsList>
                    <TabsTrigger value="week">Tuần</TabsTrigger>
                    <TabsTrigger value="month">Tháng</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <PlannerSidebar
                weeklyStats={weeklyStats}
                currentPlan={currentPlan}
                onPlanUpdate={setCurrentPlan}
              />
            </div>

            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold min-w-[200px] text-center">
                    {getCurrentPeriodLabel()}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => setCurrentDate(new Date())}
                  variant="outline"
                  size="sm"
                >
                  Hôm nay
                </Button>
              </div>

              {/* Calendar Views */}
              <div className="flex-1 overflow-hidden">
                {viewMode === 'week' ? (
                  <WeeklyCalendarView
                    currentDate={currentDate}
                    weekPlan={currentPlan}
                    onAddDayPlan={handleAddDayPlan}
                    onUpdatePlan={setCurrentPlan}
                  />
                ) : (
                  <MonthlyCalendarView
                    currentDate={currentDate}
                    onAddDayPlan={handleAddDayPlan}
                    onDateSelect={setCurrentDate}
                  />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSavePlan} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Đang lưu...' : 'Lưu kế hoạch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Plan Library */}
      {showDayPlanLibrary && (
        <DayPlanLibrary
          isOpen={showDayPlanLibrary}
          onClose={() => setShowDayPlanLibrary(false)}
          onSelectTemplate={handleSelectDayPlanTemplate}
          selectedDate={selectedDate}
        />
      )}
    </DndProvider>
  );
};

export default WeeklyMonthlyPlanner;
