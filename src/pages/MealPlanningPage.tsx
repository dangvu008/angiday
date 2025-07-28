import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChefHat, CalendarDays, CalendarRange, BarChart3, ShoppingCart } from 'lucide-react';
import { AnyPlan, MealPlan, SingleDayPlan, WeekPlan, MonthPlan } from '@/types/meal-planning';
import PlanManager from '@/components/meal-planning/PlanManager';
import PlanViewer from '@/components/meal-planning/PlanViewer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const MealPlanningPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<AnyPlan[]>([
    // Mock data - sample plans
    {
      id: 'meal_1',
      name: 'Bữa sáng healthy',
      description: 'Bữa sáng bổ dưỡng với yến mạch và trái cây',
      type: 'meal',
      mealType: 'breakfast',
      date: '2025-01-28',
      meal: {
        id: 'meal_slot_1',
        dishes: [],
        totalCalories: 0,
        totalCost: 0,
        totalCookingTime: 0,
        calorieDistribution: {}
      },
      servings: 2,
      cookingTime: 15,
      createdBy: 'user_123', // Current user
      createdByName: 'Nguyễn Văn A',
      createdAt: '2025-01-27T10:00:00Z',
      updatedAt: '2025-01-27T10:00:00Z',
      tags: ['healthy', 'quick', 'breakfast'],
      isTemplate: false,
      isPublic: false,
      totalCalories: 350,
      totalCost: 45000,
      nutrition: {
        protein: 15,
        carbs: 45,
        fat: 12,
        fiber: 8
      }
    } as MealPlan,
    {
      id: 'day_1',
      name: 'Ngày ăn chay',
      description: 'Kế hoạch ăn chay cho cả ngày',
      type: 'day',
      date: '2025-01-28',
      meals: {
        breakfast: {
          id: 'breakfast_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        lunch: {
          id: 'lunch_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        dinner: {
          id: 'dinner_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        snacks: []
      },
      nutritionSummary: {
        protein: 60,
        carbs: 200,
        fat: 40,
        fiber: 25
      },
      createdBy: 'user_1',
      createdAt: '2025-01-27T09:00:00Z',
      updatedAt: '2025-01-27T09:00:00Z',
      tags: ['vegetarian', 'healthy', 'full-day'],
      isTemplate: true,
      isPublic: true,
      totalCalories: 1200,
      totalCost: 150000,
      nutrition: {
        protein: 60,
        carbs: 200,
        fat: 40,
        fiber: 25
      }
    } as SingleDayPlan,
    {
      id: 'week_1',
      name: 'Tuần ăn healthy',
      description: 'Kế hoạch ăn uống lành mạnh cho cả tuần',
      type: 'week',
      startDate: '2025-01-27',
      endDate: '2025-02-02',
      days: Array.from({ length: 7 }, (_, i) => {
        const date = new Date('2025-01-27');
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          meals: {
            breakfast: {
              id: `breakfast_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            lunch: {
              id: `lunch_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            dinner: {
              id: `dinner_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            snacks: []
          },
          totalCalories: 0,
          totalCost: 0,
          nutritionSummary: {
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
          }
        };
      }),
      averageCaloriesPerDay: 1500,
      createdBy: 'user_123', // Current user
      createdByName: 'Nguyễn Văn A',
      createdAt: '2025-01-27T08:00:00Z',
      updatedAt: '2025-01-27T08:00:00Z',
      tags: ['weekly', 'healthy', 'balanced'],
      isTemplate: false,
      isPublic: false,
      totalCalories: 10500,
      totalCost: 1000000,
      nutrition: {
        protein: 420,
        carbs: 1400,
        fat: 280,
        fiber: 175
      }
    } as WeekPlan,
    // Public plans from other users
    {
      id: 'meal_public_1',
      name: 'Bữa sáng Việt Nam truyền thống',
      description: 'Phở bò, bánh mì, cà phê sữa - hương vị Việt đậm đà',
      type: 'meal',
      mealType: 'breakfast',
      date: '2025-01-28',
      meal: {
        id: 'meal_slot_public_1',
        dishes: [],
        totalCalories: 0,
        totalCost: 0,
        totalCookingTime: 0,
        calorieDistribution: {}
      },
      servings: 4,
      cookingTime: 45,
      createdBy: 'chef_456',
      createdByName: 'Chef Minh',
      createdAt: '2025-01-25T09:00:00Z',
      updatedAt: '2025-01-25T09:00:00Z',
      tags: ['vietnamese', 'traditional', 'breakfast', 'popular'],
      isTemplate: true,
      isPublic: true,
      totalCalories: 650,
      totalCost: 85000,
      nutrition: {
        protein: 25,
        carbs: 75,
        fat: 20,
        fiber: 5
      }
    } as MealPlan,
    {
      id: 'day_public_1',
      name: 'Ngày ăn healthy cho người bận rộn',
      description: 'Kế hoạch ăn uống cân bằng cho người làm việc văn phòng',
      type: 'day',
      date: '2025-01-29',
      meals: {
        breakfast: {
          id: 'breakfast_public_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        lunch: {
          id: 'lunch_public_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        dinner: {
          id: 'dinner_public_1',
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0,
          calorieDistribution: {}
        },
        snacks: []
      },
      servings: 1,
      cookingTime: 60,
      createdBy: 'expert_123',
      createdByName: 'Chuyên gia dinh dưỡng',
      createdAt: '2025-01-24T14:00:00Z',
      updatedAt: '2025-01-24T14:00:00Z',
      tags: ['healthy', 'office', 'balanced', 'quick'],
      isTemplate: true,
      isPublic: true,
      totalCalories: 1400,
      totalCost: 120000,
      nutrition: {
        protein: 70,
        carbs: 180,
        fat: 45,
        fiber: 25
      }
    } as SingleDayPlan,
    {
      id: 'week_public_1',
      name: 'Tuần ăn chay thanh đạm',
      description: 'Kế hoạch ăn chay 7 ngày với đầy đủ dinh dưỡng',
      type: 'week',
      startDate: '2025-02-03',
      endDate: '2025-02-09',
      days: Array.from({ length: 7 }, (_, i) => {
        const date = new Date('2025-02-03');
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          meals: {
            breakfast: {
              id: `breakfast_veg_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            lunch: {
              id: `lunch_veg_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            dinner: {
              id: `dinner_veg_${i}`,
              dishes: [],
              totalCalories: 0,
              totalCost: 0,
              totalCookingTime: 0,
              calorieDistribution: {}
            },
            snacks: []
          },
          totalCalories: 0,
          totalCost: 0,
          nutritionSummary: {
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
          }
        };
      }),
      averageCaloriesPerDay: 1300,
      createdBy: 'chef_789',
      createdByName: 'Chef Linh',
      createdAt: '2025-01-20T11:00:00Z',
      updatedAt: '2025-01-20T11:00:00Z',
      tags: ['vegetarian', 'healthy', 'weekly', 'clean-eating'],
      isTemplate: true,
      isPublic: true,
      totalCalories: 9100,
      totalCost: 700000,
      nutrition: {
        protein: 280,
        carbs: 1200,
        fat: 200,
        fiber: 210
      }
    } as WeekPlan,
    {
      id: 'meal_public_2',
      name: 'Bữa tối gia đình ấm cúng',
      description: 'Thực đơn bữa tối đầy đủ cho cả gia đình 4 người',
      type: 'meal',
      mealType: 'dinner',
      date: '2025-01-30',
      meal: {
        id: 'meal_slot_public_2',
        dishes: [],
        totalCalories: 0,
        totalCost: 0,
        totalCookingTime: 0,
        calorieDistribution: {}
      },
      servings: 4,
      cookingTime: 90,
      createdBy: 'user_456',
      createdByName: 'Chị Hoa',
      createdAt: '2025-01-22T16:00:00Z',
      updatedAt: '2025-01-22T16:00:00Z',
      tags: ['family', 'dinner', 'comfort-food', 'vietnamese'],
      isTemplate: true,
      isPublic: true,
      totalCalories: 800,
      totalCost: 150000,
      nutrition: {
        protein: 35,
        carbs: 90,
        fat: 25,
        fiber: 12
      }
    } as MealPlan
  ]);

  const [selectedPlan, setSelectedPlan] = useState<AnyPlan | null>(null);
  const [currentView, setCurrentView] = useState<'manager' | 'viewer'>('manager');
  const { toast } = useToast();

  const handleCreatePlan = (newPlan: AnyPlan) => {
    setPlans(prev => [...prev, newPlan]);
    toast({
      title: "Thành công",
      description: `Đã tạo ${getPlanTypeLabel(newPlan.type)} "${newPlan.name}" thành công`,
    });
  };

  const handleUpdatePlan = (updatedPlan: AnyPlan) => {
    setPlans(prev => prev.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    ));
    toast({
      title: "Thành công",
      description: `Đã cập nhật ${getPlanTypeLabel(updatedPlan.type)} "${updatedPlan.name}" thành công`,
    });
  };

  const handleDeletePlan = (planId: string) => {
    const planToDelete = plans.find(p => p.id === planId);
    if (planToDelete && confirm(`Bạn có chắc chắn muốn xóa ${getPlanTypeLabel(planToDelete.type)} "${planToDelete.name}"?`)) {
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      toast({
        title: "Thành công",
        description: `Đã xóa ${getPlanTypeLabel(planToDelete.type)} "${planToDelete.name}" thành công`,
      });
    }
  };

  const handleApplyPlan = (appliedPlan: {
    originalPlan: AnyPlan;
    newName: string;
    startDate: string;
    personalNotes: string;
  }) => {
    // Create a new plan based on the original
    const newPlan: AnyPlan = {
      ...appliedPlan.originalPlan,
      id: `applied_${Date.now()}`,
      name: appliedPlan.newName,
      description: appliedPlan.personalNotes || appliedPlan.originalPlan.description,
      createdBy: user?.id || 'unknown',
      createdByName: user?.name || 'Unknown User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false, // Applied plans are private by default
      isTemplate: false, // Applied plans are not templates
      tags: [...appliedPlan.originalPlan.tags, 'applied'],
      // Update dates based on plan type
      ...(appliedPlan.originalPlan.type === 'meal' && {
        date: appliedPlan.startDate
      }),
      ...(appliedPlan.originalPlan.type === 'day' && {
        date: appliedPlan.startDate
      }),
      ...(appliedPlan.originalPlan.type === 'week' && {
        startDate: appliedPlan.startDate,
        endDate: (() => {
          const start = new Date(appliedPlan.startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return end.toISOString().split('T')[0];
        })()
      }),
      ...(appliedPlan.originalPlan.type === 'month' && {
        month: new Date(appliedPlan.startDate).getMonth() + 1,
        year: new Date(appliedPlan.startDate).getFullYear()
      })
    };

    setPlans(prev => [...prev, newPlan]);
    toast({
      title: "Thành công",
      description: `Đã áp dụng kế hoạch "${appliedPlan.newName}" thành công`,
    });
  };

  const handleSelectPlan = (plan: AnyPlan) => {
    setSelectedPlan(plan);
    setCurrentView('viewer');
  };

  const handleBackToManager = () => {
    setSelectedPlan(null);
    setCurrentView('manager');
  };

  const handleEditPlan = (plan: AnyPlan) => {
    // TODO: Implement edit functionality
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng chỉnh sửa kế hoạch sẽ được cập nhật sớm",
    });
  };

  const handleCopyPlan = (plan: AnyPlan) => {
    const copiedPlan = {
      ...plan,
      id: `${plan.type}_${Date.now()}`,
      name: `${plan.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: false
    };
    
    setPlans(prev => [...prev, copiedPlan]);
    toast({
      title: "Thành công",
      description: `Đã sao chép ${getPlanTypeLabel(plan.type)} "${plan.name}" thành công`,
    });
  };

  const handleAddMeal = (planId: string, mealType: string, date?: string) => {
    // TODO: Implement add meal functionality
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng thêm món ăn sẽ được cập nhật sớm",
    });
  };

  const getPlanTypeLabel = (type: string) => {
    const labels = {
      meal: 'kế hoạch bữa ăn',
      day: 'kế hoạch ngày',
      week: 'kế hoạch tuần',
      month: 'kế hoạch tháng'
    };
    return labels[type as keyof typeof labels] || 'kế hoạch';
  };

  const getStats = () => {
    const stats = {
      total: plans.length,
      meal: plans.filter(p => p.type === 'meal').length,
      day: plans.filter(p => p.type === 'day').length,
      week: plans.filter(p => p.type === 'week').length,
      month: plans.filter(p => p.type === 'month').length,
      totalCalories: plans.reduce((sum, p) => sum + p.totalCalories, 0),
      totalCost: plans.reduce((sum, p) => sum + p.totalCost, 0)
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition-colors">🏠 Trang chủ</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">📅 Kế hoạch nấu ăn</span>
          </div>
        </nav>



        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kế Hoạch Ăn Uống Thông Minh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá, tạo mới và áp dụng các kế hoạch ăn uống từ cộng đồng.
            Quản lý dinh dưỡng và chi phí một cách hiệu quả.
          </p>
        </div>

        {currentView === 'manager' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng kế hoạch</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Kế hoạch bữa ăn</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.meal}</p>
                    </div>
                    <ChefHat className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Kế hoạch tuần</p>
                      <p className="text-3xl font-bold text-green-600">{stats.week}</p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng calories</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {(stats.totalCalories / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Manager */}
            <PlanManager
              plans={plans}
              onCreatePlan={handleCreatePlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
              onSelectPlan={handleSelectPlan}
              onApplyPlan={handleApplyPlan}
            />
          </>
        ) : (
          selectedPlan && (
            <PlanViewer
              plan={selectedPlan}
              onBack={handleBackToManager}
              onEdit={handleEditPlan}
              onCopy={handleCopyPlan}
              onAddMeal={handleAddMeal}
            />
          )
        )}
      </main>



      <Footer />
    </div>
  );
};

export default MealPlanningPage;
