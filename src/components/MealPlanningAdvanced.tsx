import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import {
  Calendar,
  ChefHat,
  Plus,
  Settings,
  BarChart3,
  ShoppingCart,
  Download,
  Share2,
  Copy,
  Trash2,
  Filter,
  Search,
  Menu,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WeekPlan, CalendarView, Dish, MealTemplate, FamilyMember } from '@/types/meal-planning';
import { mealPlanningService } from '@/services/meal-planning.service';
import { CalorieCalculatorService } from '@/services/calorie-calculator.service';
import MealPlanCalendarView from '@/components/meal-planning/MealPlanCalendarView';
import MealPlannerDashboard from '@/components/meal-planning/MealPlannerDashboard';
import DishLibrary from '@/components/meal-planning/DishLibrary';
import MealTemplates from '@/components/meal-planning/MealTemplates';
import MenuSelector from '@/components/meal-planning/MenuSelector';
import NutritionStats from '@/components/meal-planning/NutritionStats';
import ShoppingListView from '@/components/meal-planning/ShoppingListView';
import MultiMenuShoppingList from '@/components/meal-planning/MultiMenuShoppingList';
import UserPreferencesModal from '@/components/meal-planning/UserPreferencesModal';
import { FamilyMemberManager } from '@/components/meal-planning/FamilyMemberManager';
import { CalorieDistributionView } from '@/components/meal-planning/CalorieDistributionView';

const MealPlanningAdvanced: React.FC = () => {
  // Use MealPlanningContext for real user data
  const {
    currentPlan,
    setCurrentPlan,
    userMealPlans,
    availableRecipes,
    createNewPlan,
    saveMealPlan,
    deleteMealPlan,
    addMealToSlot,
    removeMealFromSlot,
    generateShoppingList,
    isLoading: contextLoading
  } = useMealPlanning();

  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showMultiMenuShoppingList, setShowMultiMenuShoppingList] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
    loadSampleFamilyMembers();
  }, []);

  // Debug: Log userMealPlans when it changes
  useEffect(() => {
    console.log('MealPlanningAdvanced - userMealPlans:', userMealPlans);
    console.log('MealPlanningAdvanced - currentPlan:', currentPlan);
  }, [userMealPlans, currentPlan]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dishesData, templatesData] = await Promise.all([
        loadSampleDishes(), // We'll implement this
        mealPlanningService.getMealTemplates()
      ]);

      setDishes(dishesData);
      setMealTemplates(templatesData);

      // Use context loading state
      setIsLoading(contextLoading);
    } catch (error) {
      console.error('Error loading meal planning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWeekPlan = async () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 6);

    const newPlan = createNewPlan(
      `Kế hoạch tuần ${startDate.toLocaleDateString('vi-VN')}`,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    saveMealPlan(newPlan);
  };

  const handleWeekPlanSelect = (plan: any) => {
    // Convert to context format if needed
    setCurrentPlan(plan);
  };

  const loadSampleFamilyMembers = () => {
    const sampleMembers: FamilyMember[] = [
      {
        id: '1',
        name: 'Bố',
        age: 35,
        gender: 'male',
        weight: 70,
        height: 175,
        activityLevel: 'moderate',
        dailyCalorieNeeds: 0,
        nutritionGoals: {
          dailyCalories: 2500,
          protein: 20,
          carbs: 50,
          fat: 30,
          fiber: 25
        },
        dietaryRestrictions: [],
        allergies: [],
        isActive: true
      },
      {
        id: '2',
        name: 'Mẹ',
        age: 32,
        gender: 'female',
        weight: 55,
        height: 165,
        activityLevel: 'light',
        dailyCalorieNeeds: 0,
        nutritionGoals: {
          dailyCalories: 2000,
          protein: 20,
          carbs: 50,
          fat: 30,
          fiber: 25
        },
        dietaryRestrictions: [],
        allergies: [],
        isActive: true
      },
      {
        id: '3',
        name: 'Con trai',
        age: 8,
        gender: 'male',
        weight: 25,
        height: 130,
        activityLevel: 'active',
        dailyCalorieNeeds: 0,
        nutritionGoals: {
          dailyCalories: 1800,
          protein: 20,
          carbs: 55,
          fat: 25,
          fiber: 20
        },
        dietaryRestrictions: [],
        allergies: [],
        isActive: true
      }
    ];

    // Calculate calorie needs for each member
    const membersWithCalories = sampleMembers.map(member =>
      CalorieCalculatorService.updateMemberCalorieNeeds(member)
    );

    setFamilyMembers(membersWithCalories);
  };

  // Sample menus for shopping list generation
  const getSampleMenus = () => {
    return [
      {
        id: '1',
        name: 'Thực đơn ăn chay',
        description: 'Tập hợp các món ăn chay bổ dưỡng và ngon miệng',
        type: 'full_day' as const,
        recipes: [
          {
            id: 'recipe-1',
            title: 'Phở chay nấm hương',
            description: 'Phở chay thơm ngon với nấm hương và rau củ',
            category: 'Ăn chay',
            difficulty: 'Trung bình' as const,
            cookingTime: '45 phút',
            servings: 4,
            author: 'Chef Minh',
            status: 'published' as const,
            createdDate: '2024-01-15',
            views: 150,
            ingredients: ['Bánh phở', 'Nấm hương', 'Hành tây', 'Gừng', 'Nước tương chay'],
            instructions: ['Nấu nước dashi chay', 'Xào nấm hương', 'Trụng bánh phở', 'Trang trí và thưởng thức'],
            nutrition: { calories: 350, protein: 12, carbs: 65, fat: 8, fiber: 6 },
            tags: ['chay', 'phở', 'nấm'],
            cuisine: 'Việt Nam',
            rating: 4.6,
            reviews: 25
          },
          {
            id: 'recipe-2',
            title: 'Gỏi cuốn chay',
            description: 'Gỏi cuốn tươi mát với rau củ và đậu hũ',
            category: 'Ăn chay',
            difficulty: 'Dễ' as const,
            cookingTime: '20 phút',
            servings: 4,
            author: 'Chef Minh',
            status: 'published' as const,
            createdDate: '2024-01-15',
            views: 120,
            ingredients: ['Bánh tráng', 'Đậu hũ', 'Rau sống', 'Bún tươi', 'Nước chấm chay'],
            instructions: ['Chuẩn bị rau sống', 'Chiên đậu hũ', 'Cuốn bánh tráng', 'Chấm nước mắm chay'],
            nutrition: { calories: 180, protein: 8, carbs: 25, fat: 6, fiber: 4 },
            tags: ['chay', 'gỏi cuốn', 'tươi mát'],
            cuisine: 'Việt Nam',
            rating: 4.4,
            reviews: 18
          }
        ],
        totalCalories: 1800,
        totalCost: 150000,
        servings: 4,
        tags: ['chay', 'healthy', 'gia đình'],
        difficulty: 'Trung bình' as const,
        totalCookingTime: 120,
        nutrition: { protein: 60, carbs: 250, fat: 50, fiber: 35 },
        isPublic: true,
        createdBy: 'Admin',
        createdByName: 'Admin',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        category: 'Ăn chay',
        cuisine: 'Việt Nam',
        targetAudience: ['family'],
        dietaryRestrictions: ['vegetarian'],
        usageCount: 45,
        rating: 4.5,
        reviews: 12
      },
      {
        id: '2',
        name: 'Thực đơn hải sản',
        description: 'Các món hải sản tươi ngon cho bữa tiệc',
        type: 'dinner' as const,
        recipes: [
          {
            id: 'recipe-4',
            title: 'Tôm nướng muối ớt',
            description: 'Tôm tươi nướng với muối ớt thơm lừng',
            category: 'Hải sản',
            difficulty: 'Trung bình' as const,
            cookingTime: '30 phút',
            servings: 6,
            author: 'Chef Hải',
            status: 'published' as const,
            createdDate: '2024-01-12',
            views: 180,
            ingredients: ['Tôm sú', 'Muối', 'Ớt', 'Tỏi', 'Lá chanh'],
            instructions: ['Sơ chế tôm', 'Ướp gia vị', 'Nướng tôm', 'Trang trí'],
            nutrition: { calories: 250, protein: 35, carbs: 5, fat: 8, fiber: 1 },
            tags: ['hải sản', 'nướng', 'tôm'],
            cuisine: 'Việt Nam',
            rating: 4.8,
            reviews: 42
          }
        ],
        totalCalories: 2200,
        totalCost: 300000,
        servings: 6,
        tags: ['hải sản', 'tiệc tùng', 'cao cấp'],
        difficulty: 'Khó' as const,
        totalCookingTime: 180,
        nutrition: { protein: 120, carbs: 180, fat: 80, fiber: 20 },
        isPublic: true,
        createdBy: 'Chef Hải',
        createdByName: 'Chef Hải',
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z',
        category: 'Hải sản',
        cuisine: 'Việt Nam',
        targetAudience: ['family', 'couple'],
        dietaryRestrictions: [],
        usageCount: 23,
        rating: 4.2,
        reviews: 8
      }
    ];
  };

  const handleDuplicateWeekPlan = async (planId: string) => {
    try {
      const planToDuplicate = userMealPlans.find(p => p.id === planId);
      if (planToDuplicate) {
        const newPlan = createNewPlan(
          `${planToDuplicate.name} (Copy)`,
          planToDuplicate.startDate,
          planToDuplicate.endDate
        );
        // Copy meals from original plan
        newPlan.meals = [...planToDuplicate.meals];
        saveMealPlan(newPlan);
        setCurrentPlan(newPlan);
      }
    } catch (error) {
      console.error('Error duplicating week plan:', error);
    }
  };

  const handleDeleteWeekPlan = async (planId: string) => {
    try {
      deleteMealPlan(planId);

      if (currentPlan?.id === planId) {
        const remainingPlans = userMealPlans.filter(plan => plan.id !== planId);
        setCurrentPlan(remainingPlans.length > 0 ? remainingPlans[0] : null);
      }
    } catch (error) {
      console.error('Error deleting week plan:', error);
    }
  };

  const handleExportWeekPlan = () => {
    if (!currentPlan) return;

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      mealPlan: currentPlan
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${currentPlan.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintWeekPlan = () => {
    if (!currentPlan) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = generatePrintableMealPlan(currentPlan);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintableMealPlan = (plan: any) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kế hoạch bữa ăn - ${plan.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .meal { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>${plan.name}</h1>
          <p>Từ: ${new Date(plan.startDate).toLocaleDateString('vi-VN')}</p>
          <p>Đến: ${new Date(plan.endDate).toLocaleDateString('vi-VN')}</p>
          <p>Số bữa ăn: ${plan.meals.length}</p>
          <div>
            ${plan.meals.map((meal: any) => `
              <div class="meal">
                <h3>${meal.recipe?.title || 'Chưa có món'}</h3>
                <p>Ngày: ${new Date(meal.date).toLocaleDateString('vi-VN')}</p>
                <p>Bữa: ${meal.mealType}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  };

  const generatePrintableWeekPlan = (weekPlan: WeekPlan): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${weekPlan.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .day { margin-bottom: 20px; page-break-inside: avoid; }
            .meal { margin-bottom: 10px; }
            .dish { margin-left: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${weekPlan.name}</h1>
            <p>Từ ${weekPlan.startDate} đến ${weekPlan.endDate}</p>
            <p>Tổng calories: ${weekPlan.totalCalories} | Tổng chi phí: ${weekPlan.totalCost.toLocaleString()}đ</p>
          </div>
          ${weekPlan.days.map(day => `
            <div class="day">
              <h2>${new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
              <div class="meal">
                <h3>Sáng</h3>
                ${day.meals.breakfast.dishes.map(dish => `<div class="dish">• ${dish.name}</div>`).join('')}
              </div>
              <div class="meal">
                <h3>Trưa</h3>
                ${day.meals.lunch.dishes.map(dish => `<div class="dish">• ${dish.name}</div>`).join('')}
              </div>
              <div class="meal">
                <h3>Tối</h3>
                ${day.meals.dinner.dishes.map(dish => `<div class="dish">• ${dish.name}</div>`).join('')}
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kế hoạch bữa ăn...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Quản Lý Bữa Ăn <span className="text-yellow-300">Toàn Diện</span>
                </h1>
                <p className="text-white/90">
                  Lên kế hoạch, theo dõi dinh dưỡng và quản lý chi phí một cách thông minh
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => setShowPreferences(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleExportWeekPlan}
                  disabled={!currentPlan}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handlePrintWeekPlan}
                  disabled={!currentPlan}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  In
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          {/* Week Plan Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Kế hoạch tuần</h2>
              <Button onClick={createNewWeekPlan} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Tạo kế hoạch mới
              </Button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {userMealPlans.length === 0 ? (
                <div className="w-full text-center py-8 text-gray-500">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có kế hoạch nào</p>
                  <p className="text-sm">Nhấn "Tạo kế hoạch mới" để bắt đầu</p>
                </div>
              ) : (
                userMealPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`flex-shrink-0 cursor-pointer transition-all border-2 rounded-xl ${
                    currentPlan?.id === plan.id
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-orange-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => handleWeekPlanSelect(plan)}
                >
                  <CardContent className="p-6 min-w-[320px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{plan.name}</h3>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateWeekPlan(plan.id);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWeekPlan(plan.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-base text-gray-600 font-medium">
                        {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {new Date(plan.endDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">{plan.meals.length} bữa ăn</span>
                        <span className="text-sm text-gray-600">
                          {plan.description || 'Không có mô tả'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Lịch
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Gia đình
              </TabsTrigger>
              <TabsTrigger value="menus" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                Thực đơn
              </TabsTrigger>
              <TabsTrigger value="dishes" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Món ăn
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Mẫu
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Thống kê
              </TabsTrigger>
              <TabsTrigger value="shopping" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Mua sắm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <MealPlannerDashboard />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              {currentPlan ? (
                <MealPlanCalendarView
                  currentPlan={currentPlan}
                  onPlanUpdate={(updatedPlan) => {
                    setCurrentPlan(updatedPlan);
                    saveMealPlan(updatedPlan);
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có kế hoạch nào được chọn
                  </h3>
                  <p className="text-gray-600">
                    Chọn hoặc tạo kế hoạch để bắt đầu lên lịch bữa ăn
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="family" className="mt-6">
              <FamilyMemberManager
                familyMembers={familyMembers}
                onFamilyMembersChange={setFamilyMembers}
              />
            </TabsContent>

            <TabsContent value="menus" className="mt-6">
              <div className="space-y-6">
                {/* Shopping List Generator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Tạo danh sách mua sắm từ thực đơn
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Chọn món ăn từ nhiều thực đơn để tạo danh sách mua sắm tổng hợp
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => setShowMultiMenuShoppingList(true)}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Tạo danh sách mua sắm
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Chọn từ {getSampleMenus().length} thực đơn có sẵn
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Menu Library */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Menu className="h-5 w-5" />
                      Thư viện thực đơn
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Chọn thực đơn có sẵn để thêm vào kế hoạch ăn uống của bạn
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getSampleMenus().map(menu => (
                        <Card key={menu.id} className="border hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{menu.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{menu.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <ChefHat className="h-4 w-4" />
                                  <span>{menu.recipes.length} món</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{menu.totalCookingTime} phút</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{menu.servings} người</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {menu.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dishes" className="mt-6">
              <div className="space-y-6">
                {/* Dishes in Current Plan */}
                {currentPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Món ăn trong kế hoạch hiện tại
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Các món ăn có trong kế hoạch "{currentPlan.name}"
                      </p>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Extract all recipes from current plan meals
                        const planRecipes: any[] = [];
                        currentPlan.meals.forEach(meal => {
                          if (meal.recipe && !planRecipes.find(r => r.id === meal.recipe!.id)) {
                            planRecipes.push(meal.recipe);
                          }
                        });

                        if (planRecipes.length === 0) {
                          return (
                            <div className="text-center py-8 text-muted-foreground">
                              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>Chưa có món ăn nào trong kế hoạch này</p>
                              <p className="text-sm">Thêm món ăn vào lịch để xem ở đây</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {planRecipes.map((recipe) => (
                              <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="bg-white/90">
                                      {recipe.cookTime}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{recipe.servings} người</span>
                                    <span>{recipe.calories || 'N/A'} kcal</span>
                                    <span>{recipe.category}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {recipe.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {recipe.difficulty}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Favorite Dishes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-red-500">❤️</span>
                      Món ăn yêu thích
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Các món ăn bạn đã đánh dấu yêu thích
                    </p>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Use available recipes from context (sample favorites)
                      const favoriteRecipes = availableRecipes.slice(0, 6); // Show first 6 as favorites

                      if (favoriteRecipes.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <span className="text-4xl mb-4 block">❤️</span>
                            <p>Chưa có món ăn yêu thích nào</p>
                            <p className="text-sm">Đánh dấu yêu thích các món ăn để xem ở đây</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {favoriteRecipes.map((recipe) => (
                            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge variant="secondary" className="bg-white/90">
                                    {recipe.cookTime}
                                  </Badge>
                                </div>
                                <div className="absolute top-2 left-2">
                                  <span className="text-red-500 text-lg">❤️</span>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>{recipe.servings} người</span>
                                  <span>{recipe.calories || 'N/A'} kcal</span>
                                  <span>{recipe.category}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {recipe.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {recipe.difficulty}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <MealTemplates
                templates={mealTemplates}
                onTemplateApply={(templateId, weekPlanId, date, mealType) => {
                  // Handle template application
                  console.log('Apply template:', templateId, weekPlanId, date, mealType);
                }}
              />
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              {currentPlan ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Thống kê dinh dưỡng
                  </h3>
                  <p className="text-gray-600">
                    Thống kê cho kế hoạch "{currentPlan.name}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chọn kế hoạch để xem thống kê
                </div>
              )}
            </TabsContent>

            <TabsContent value="shopping" className="mt-6">
              {currentPlan ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Danh sách mua sắm
                  </h3>
                  <p className="text-gray-600">
                    Danh sách cho kế hoạch "{currentPlan.name}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chọn kế hoạch để tạo danh sách mua sắm
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* User Preferences Modal */}
        {showPreferences && (
          <UserPreferencesModal
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
            onSave={(preferences) => {
              // Handle preferences save
              console.log('Save preferences:', preferences);
              setShowPreferences(false);
            }}
          />
        )}

        {/* Multi Menu Shopping List Modal */}
        <MultiMenuShoppingList
          isOpen={showMultiMenuShoppingList}
          onClose={() => setShowMultiMenuShoppingList(false)}
          availableMenus={getSampleMenus()}
          selectedDate={new Date().toISOString().split('T')[0]}
        />

        <Footer />
      </div>
    </DndProvider>
  );
};

// Sample dishes loader - we'll implement this properly later
const loadSampleDishes = async (): Promise<Dish[]> => {
  return [
    {
      id: '1',
      name: 'Phở bò',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      cookingTime: 45,
      difficulty: 'medium',
      rating: 4.5,
      views: 1250,
      servings: 4,
      calories: 350,
      nutrition: { protein: 25, carbs: 45, fat: 8, fiber: 3 },
      ingredients: ['Thịt bò', 'Bánh phở', 'Hành tây', 'Ngò gai'],
      instructions: ['Nấu nước dùng', 'Luộc bánh phở', 'Thái thịt bò'],
      tags: ['vietnamese', 'soup', 'beef'],
      category: 'main',
      cost: 45000
    }
    // Add more sample dishes...
  ];
};

export default MealPlanningAdvanced;
