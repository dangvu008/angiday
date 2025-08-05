import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Coffee, 
  UtensilsCrossed, 
  Moon,
  ShoppingCart,
  Calendar,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Trash2,
  Edit
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import AddDishModal from './AddDishModal';
import ShoppingListSelectionMode from './ShoppingListSelectionMode';
import { mockRecipes } from '@/data/mockRecipes';
import { activeMealPlan, getTodayMeals } from '@/data/mockMealPlans';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  calories: number;
  cost: number;
  ingredients: string[];
  difficulty: string;
  servings: number;
}

interface Dish {
  id: string;
  name: string;
  calories: number;
  cost: number;
  cookingTime: number;
  recipe?: Recipe;
}

interface MealSlot {
  id: string;
  dishes: Dish[];
  totalCalories: number;
  totalCost: number;
  totalCookingTime: number;
}

interface DayPlan {
  date: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
  totalCalories: number;
  totalCost: number;
  isPlanned: boolean;
}

const EnhancedMealPlannerMain: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<{
    dayIndex: number;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    date: string;
  } | null>(null);

  // Sử dụng dữ liệu mẫu từ activeMealPlan
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeek, i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Tìm meals từ activeMealPlan cho ngày này
      const dayMeals = activeMealPlan.meals.filter(meal => meal.date === dateStr);
      
      const createMealSlot = (mealType: 'breakfast' | 'lunch' | 'dinner'): MealSlot => {
        const meal = dayMeals.find(m => m.mealType === mealType);
        if (meal && meal.recipe) {
          const dish: Dish = {
            id: meal.recipe.id,
            name: meal.recipe.title,
            calories: meal.recipe.calories,
            cost: meal.recipe.cost,
            cookingTime: parseInt(meal.recipe.cookTime) || 30,
            recipe: {
              id: meal.recipe.id,
              title: meal.recipe.title,
              image: meal.recipe.image,
              cookTime: meal.recipe.cookTime,
              calories: meal.recipe.calories,
              cost: meal.recipe.cost,
              ingredients: meal.recipe.ingredients,
              difficulty: meal.recipe.difficulty,
              servings: meal.recipe.servings
            }
          };
          
          return {
            id: `${mealType}-${i}`,
            dishes: [dish],
            totalCalories: dish.calories,
            totalCost: dish.cost,
            totalCookingTime: dish.cookingTime
          };
        }
        
        return {
          id: `${mealType}-${i}`,
          dishes: [],
          totalCalories: 0,
          totalCost: 0,
          totalCookingTime: 0
        };
      };

      const breakfast = createMealSlot('breakfast');
      const lunch = createMealSlot('lunch');
      const dinner = createMealSlot('dinner');

      days.push({
        date: dateStr,
        breakfast,
        lunch,
        dinner,
        totalCalories: breakfast.totalCalories + lunch.totalCalories + dinner.totalCalories,
        totalCost: breakfast.totalCost + lunch.totalCost + dinner.totalCost,
        isPlanned: breakfast.dishes.length > 0 || lunch.dishes.length > 0 || dinner.dishes.length > 0
      });
    }
    return days;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const getDayName = (date: string) => {
    return format(new Date(date), 'EEEE', { locale: vi });
  };

  const getFormattedDate = (date: string) => {
    return format(new Date(date), 'dd/MM', { locale: vi });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-5 w-5 text-amber-600" />;
      case 'lunch': return <UtensilsCrossed className="h-5 w-5 text-orange-600" />;
      case 'dinner': return <Moon className="h-5 w-5 text-indigo-600" />;
      default: return <UtensilsCrossed className="h-5 w-5" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      default: return mealType;
    }
  };

  const handleAddDish = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const dayIndex = selectedDayIndex;
    const date = weekPlan[dayIndex]?.date;
    
    if (date) {
      setSelectedMealSlot({ dayIndex, mealType, date });
      setShowAddDishModal(true);
    }
  };

  const handleAddDishToMeal = (recipe: any) => {
    if (!selectedMealSlot) return;

    const { dayIndex, mealType } = selectedMealSlot;
    
    const newDish: Dish = {
      id: recipe.id,
      name: recipe.title,
      calories: recipe.nutrition?.calories || 200,
      cost: recipe.cost || 25000,
      cookingTime: parseInt(recipe.cookingTime) || 30,
      recipe: {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        cookTime: recipe.cookingTime,
        calories: recipe.nutrition?.calories || 200,
        cost: recipe.cost || 25000,
        ingredients: recipe.ingredients,
        difficulty: recipe.difficulty,
        servings: recipe.servings
      }
    };

    setWeekPlan(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        const updatedMeal = {
          ...day[mealType],
          dishes: [...day[mealType].dishes, newDish],
          totalCalories: day[mealType].totalCalories + newDish.calories,
          totalCost: day[mealType].totalCost + newDish.cost,
          totalCookingTime: day[mealType].totalCookingTime + newDish.cookingTime
        };
        
        return {
          ...day,
          [mealType]: updatedMeal,
          totalCalories: day.totalCalories + newDish.calories,
          totalCost: day.totalCost + newDish.cost,
          isPlanned: true
        };
      }
      return day;
    }));

    setShowAddDishModal(false);
    setSelectedMealSlot(null);
  };

  const handleRemoveDish = (mealType: 'breakfast' | 'lunch' | 'dinner', dishId: string) => {
    setWeekPlan(prev => prev.map((day, index) => {
      if (index === selectedDayIndex) {
        const dishToRemove = day[mealType].dishes.find(d => d.id === dishId);
        if (!dishToRemove) return day;

        const updatedMeal = {
          ...day[mealType],
          dishes: day[mealType].dishes.filter(d => d.id !== dishId),
          totalCalories: day[mealType].totalCalories - dishToRemove.calories,
          totalCost: day[mealType].totalCost - dishToRemove.cost,
          totalCookingTime: day[mealType].totalCookingTime - dishToRemove.cookingTime
        };
        
        return {
          ...day,
          [mealType]: updatedMeal,
          totalCalories: day.totalCalories - dishToRemove.calories,
          totalCost: day.totalCost - dishToRemove.cost
        };
      }
      return day;
    }));
  };

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
  };

  const handleCreateShoppingListFromSelection = (selectedMeals: any[]) => {
    setIsSelectionMode(false);
    // Redirect to shopping list page with selected meals
    console.log('Creating shopping list for:', selectedMeals);
  };

  const selectedDay = weekPlan[selectedDayIndex];

  if (isSelectionMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShoppingListSelectionMode
            isActive={isSelectionMode}
            onExit={handleExitSelectionMode}
            onCreateShoppingList={handleCreateShoppingListFromSelection}
            weekPlan={weekPlan.map(day => ({
              date: day.date,
              meals: {
                breakfast: {
                  id: day.breakfast.id,
                  date: day.date,
                  mealType: 'breakfast' as const,
                  recipe: day.breakfast.dishes[0]?.recipe ? {
                    id: day.breakfast.dishes[0].recipe.id,
                    title: day.breakfast.dishes[0].recipe.title,
                    ingredients: day.breakfast.dishes[0].recipe.ingredients
                  } : undefined,
                  selected: false
                },
                lunch: {
                  id: day.lunch.id,
                  date: day.date,
                  mealType: 'lunch' as const,
                  recipe: day.lunch.dishes[0]?.recipe ? {
                    id: day.lunch.dishes[0].recipe.id,
                    title: day.lunch.dishes[0].recipe.title,
                    ingredients: day.lunch.dishes[0].recipe.ingredients
                  } : undefined,
                  selected: false
                },
                dinner: {
                  id: day.dinner.id,
                  date: day.date,
                  mealType: 'dinner' as const,
                  recipe: day.dinner.dishes[0]?.recipe ? {
                    id: day.dinner.dishes[0].recipe.id,
                    title: day.dinner.dishes[0].recipe.title,
                    ingredients: day.dinner.dishes[0].recipe.ingredients
                  } : undefined,
                  selected: false
                },
                snacks: []
              },
              allSelected: false
            }))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lập Kế Hoạch Bữa Ăn</h1>
          <p className="text-gray-600">Quản lý thực đơn hàng ngày một cách thông minh và hiệu quả</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Week Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Tuần {format(currentWeek, 'dd/MM')} - {format(addDays(currentWeek, 6), 'dd/MM/yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {weekPlan.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDayIndex(index)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedDayIndex === index
                          ? 'border-orange-300 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {getDayName(day.date)}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {getFormattedDate(day.date)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {day.isPlanned ? '✓' : '○'}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Day Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getDayName(selectedDay.date)} - {getFormattedDate(selectedDay.date)}
                  </h3>

                  {/* Meals */}
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                    <Card key={mealType} className="border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getMealIcon(mealType)}
                          {getMealLabel(mealType)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedDay[mealType].dishes.length === 0 ? (
                          <Button
                            variant="outline"
                            className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                            onClick={() => handleAddDish(mealType)}
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Thêm món ăn
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            {selectedDay[mealType].dishes.map((dish) => (
                              <div key={dish.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                {dish.recipe?.image && (
                                  <img
                                    src={dish.recipe.image}
                                    alt={dish.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{dish.name}</h4>
                                  <div className="text-sm text-gray-500">
                                    {dish.calories} kcal • {dish.cookingTime} phút • {dish.cost.toLocaleString()}đ
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Xem công thức
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Thay thế
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleRemoveDish(mealType, dish.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Xóa món
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleAddDish(mealType)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm món
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Hành Động Chính */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hành Động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleEnterSelectionMode}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  🛒 Chọn Món Để Đi Chợ
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem Kế Hoạch Tuần
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng Quan Ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng calo:</span>
                    <span className="font-semibold">{selectedDay.totalCalories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chi phí:</span>
                    <span className="font-semibold">{selectedDay.totalCost.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge variant={selectedDay.isPlanned ? "default" : "secondary"}>
                      {selectedDay.isPlanned ? "Đã lên kế hoạch" : "Chưa hoàn thành"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Dish Modal */}
        {selectedMealSlot && (
          <AddDishModal
            isOpen={showAddDishModal}
            onClose={() => {
              setShowAddDishModal(false);
              setSelectedMealSlot(null);
            }}
            onAddDish={handleAddDishToMeal}
            mealType={selectedMealSlot.mealType}
            date={selectedMealSlot.date}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedMealPlannerMain;
