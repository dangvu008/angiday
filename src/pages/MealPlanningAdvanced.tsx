import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarDays, CalendarRange, ChefHat, Clock, Users, Plus, Edit, Trash2, Copy, ArrowLeft, Filter } from 'lucide-react';
import { AnyPlan, MealPlan, SingleDayPlan, WeekPlan, MonthPlan } from '@/types/meal-planning';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import WeekCalendarView from '@/components/meal-planning/WeekCalendarView';
import DayDetailView from '@/components/meal-planning/DayDetailView';
import SimpleWeekView from '@/components/meal-planning/SimpleWeekView';
import WeekPlanDetail from '@/components/meal-planning/WeekPlanDetail';

const MealPlanningAdvanced = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<'week' | 'month'>('week');
  const [selectedPlan, setSelectedPlan] = useState<AnyPlan | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Mock data - các kế hoạch đang được áp dụng của user
  const [activePlans] = useState<AnyPlan[]>([
    {
      id: 'week_active_1',
      name: 'Kế hoạch tuần 27/7/2025',
      description: 'Tuần ăn healthy và cân bằng dinh dưỡng',
      type: 'week',
      startDate: '2025-07-27',
      endDate: '2025-08-02',
      days: Array.from({ length: 7 }, (_, i) => {
        const date = new Date('2025-07-27');
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          meals: {
            breakfast: {
              id: `breakfast_${i}`,
              dishes: [],
              totalCalories: 350,
              totalCost: 25000,
              totalCookingTime: 15,
              calorieDistribution: {}
            },
            lunch: {
              id: `lunch_${i}`,
              dishes: [],
              totalCalories: 450,
              totalCost: 35000,
              totalCookingTime: 30,
              calorieDistribution: {}
            },
            dinner: {
              id: `dinner_${i}`,
              dishes: [],
              totalCalories: 400,
              totalCost: 40000,
              totalCookingTime: 45,
              calorieDistribution: {}
            },
            snacks: []
          },
          totalCalories: 1200,
          totalCost: 100000,
          nutritionSummary: {
            protein: 60,
            carbs: 150,
            fat: 40,
            fiber: 25
          }
        };
      }),
      averageCaloriesPerDay: 1200,
      servings: 1,
      cookingTime: 90,
      createdBy: 'user_123',
      createdByName: 'Nguyễn Văn A',
      createdAt: '2025-07-25T10:00:00Z',
      updatedAt: '2025-07-25T10:00:00Z',
      tags: ['healthy', 'balanced', 'applied'],
      isTemplate: false,
      isPublic: false,
      totalCalories: 8400,
      totalCost: 700000,
      nutrition: {
        protein: 420,
        carbs: 1050,
        fat: 280,
        fiber: 175
      }
    } as WeekPlan,
    {
      id: 'day_active_1',
      name: 'Kế hoạch ngày 28/7/2025',
      description: 'Ngày ăn đặc biệt cho cuối tuần',
      type: 'day',
      date: '2025-07-28',
      meals: {
        breakfast: {
          id: 'breakfast_special',
          dishes: [],
          totalCalories: 400,
          totalCost: 30000,
          totalCookingTime: 20,
          calorieDistribution: {}
        },
        lunch: {
          id: 'lunch_special',
          dishes: [],
          totalCalories: 500,
          totalCost: 45000,
          totalCookingTime: 40,
          calorieDistribution: {}
        },
        dinner: {
          id: 'dinner_special',
          dishes: [],
          totalCalories: 450,
          totalCost: 50000,
          totalCookingTime: 60,
          calorieDistribution: {}
        },
        snacks: []
      },
      servings: 1,
      cookingTime: 120,
      createdBy: 'user_123',
      createdByName: 'Nguyễn Văn A',
      createdAt: '2025-07-26T15:00:00Z',
      updatedAt: '2025-07-26T15:00:00Z',
      tags: ['weekend', 'special', 'applied'],
      isTemplate: false,
      isPublic: false,
      totalCalories: 1350,
      totalCost: 125000,
      nutrition: {
        protein: 65,
        carbs: 170,
        fat: 45,
        fiber: 30
      }
    } as SingleDayPlan
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
  };

  const getWeekDays = (startDate: string) => {
    const days = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayName = (date: Date) => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return dayNames[date.getDay()];
  };

  const handleEditPlan = (planId: string) => {
    toast({
      title: "Chỉnh sửa kế hoạch",
      description: "Tính năng đang được phát triển",
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) {
      toast({
        title: "Đã xóa",
        description: "Kế hoạch đã được xóa thành công",
      });
    }
  };

  const handleCopyPlan = (planId: string) => {
    toast({
      title: "Sao chép thành công",
      description: "Đã tạo bản sao của kế hoạch",
    });
  };

  const handleDayClick = (planId: string, dayIndex: number) => {
    toast({
      title: "Chi tiết ngày",
      description: `Xem chi tiết ngày ${dayIndex + 1}`,
    });
  };

  const handleEditMeal = (planId: string, mealType: string) => {
    toast({
      title: "Chỉnh sửa bữa ăn",
      description: `Chỉnh sửa ${mealType}`,
    });
  };

  const handleAddDish = (planId: string, mealType: string) => {
    toast({
      title: "Thêm món ăn",
      description: `Thêm món vào ${mealType}`,
    });
  };

  const handlePlanClick = (plan: AnyPlan) => {
    setSelectedPlan(plan);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setShowDetail(false);
  };

  const handleEditDay = (dayIndex: number) => {
    toast({
      title: "Chỉnh sửa ngày",
      description: `Chỉnh sửa ngày ${dayIndex + 1}`,
    });
  };

  const handleAddMeal = (dayIndex: number, mealType: string) => {
    toast({
      title: "Thêm món ăn",
      description: `Thêm món ${mealType} cho ngày ${dayIndex + 1}`,
    });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition-colors">🏠 Trang chủ</a>
            <span>/</span>
            <a href="/ke-hoach-nau-an" className="hover:text-blue-600 transition-colors">📅 Kế hoạch nấu ăn</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">🚀 Nâng cao</span>
          </div>
        </nav>

        {/* Header - Simple like in image */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {showDetail ? 'Chi tiết kế hoạch' : 'Kế hoạch tuần'}
              </h1>
              {!showDetail && (
                <p className="text-sm text-gray-600 mt-1">
                  {activePlans.length} kế hoạch đang hoạt động • Click vào thẻ để xem chi tiết
                </p>
              )}
            </div>
            {!showDetail && (
              <Button
                onClick={() => window.open('/ke-hoach-nau-an', '_blank')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo kế hoạch mới
              </Button>
            )}
          </div>
        </div>



        {/* Conditional Rendering */}
        {showDetail && selectedPlan ? (
          <WeekPlanDetail
            plan={selectedPlan as WeekPlan}
            onBack={handleBackToList}
            onEditDay={handleEditDay}
            onAddMeal={handleAddMeal}
          />
        ) : (
          /* Active Plans - Simple List View */
          <div className="space-y-4">
            {activePlans.map((plan) => (
              <SimpleWeekView
                key={plan.id}
                plan={plan as WeekPlan}
                onEdit={() => handleEditPlan(plan.id)}
                onCopy={() => handleCopyPlan(plan.id)}
                onDelete={() => handleDeletePlan(plan.id)}
                onClick={() => handlePlanClick(plan)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {activePlans.length === 0 && (
          <Card className="border-2 border-dashed border-gray-200 bg-white/50">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có kế hoạch nào đang áp dụng
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy tạo hoặc áp dụng kế hoạch từ thư viện để bắt đầu
              </p>
              <Button
                onClick={() => window.open('/ke-hoach-nau-an', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo kế hoạch đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanningAdvanced;
