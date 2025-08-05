import { useEffect, useState } from 'react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { useKitchen } from '@/contexts/KitchenContext';
import { TodayMeals, TodayStats, MenuSuggestion } from '@/types/kitchen';

/**
 * Hook để đồng bộ dữ liệu thực đơn hôm nay giữa MealPlanningContext và KitchenContext
 */
export const useTodayMenuSync = () => {
  const { activePlan, addMealToSlot: addToMealPlan } = useMealPlanning();
  const { 
    selectedDailyMenu, 
    todayMeals, 
    dailyMenus,
    applyDailyMenu,
    addMealToSlot: addToKitchen,
    getRandomDailyMenu
  } = useKitchen();

  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const today = new Date().toISOString().split('T')[0];

  /**
   * Lấy thực đơn hôm nay từ multiple sources với priority order
   */
  const getTodayMeals = (): TodayMeals => {
    // Priority 1: Active meal plan
    if (activePlan) {
      const todayMealsFromPlan = activePlan.meals.filter(meal => meal.date === today);
      if (todayMealsFromPlan.length > 0) {
        return {
          source: 'activePlan',
          meals: {
            breakfast: todayMealsFromPlan.find(m => m.mealType === 'breakfast'),
            lunch: todayMealsFromPlan.find(m => m.mealType === 'lunch'),
            dinner: todayMealsFromPlan.find(m => m.mealType === 'dinner'),
            snack: todayMealsFromPlan.find(m => m.mealType === 'snack')
          }
        };
      }
    }

    // Priority 2: Selected daily menu
    if (selectedDailyMenu) {
      return {
        source: 'dailyMenu',
        meals: selectedDailyMenu.meals
      };
    }

    // Priority 3: Today meals from kitchen context
    if (todayMeals && todayMeals.length > 0) {
      return {
        source: 'todayMeals',
        meals: {
          breakfast: todayMeals.find(m => m.mealType === 'breakfast'),
          lunch: todayMeals.find(m => m.mealType === 'lunch'),
          dinner: todayMeals.find(m => m.mealType === 'dinner'),
          snack: todayMeals.find(m => m.mealType === 'snack')
        }
      };
    }

    return {
      source: 'empty',
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null
      }
    };
  };

  /**
   * Áp dụng daily menu template vào thực đơn hôm nay
   */
  const applyDailyMenuToToday = async (menuId: string) => {
    setIsLoading(true);
    try {
      await applyDailyMenu(menuId);
      
      // Sync với meal planning context nếu có active plan
      const menu = dailyMenus.find(m => m.id === menuId);
      if (menu && activePlan) {
        // Add meals to active plan
        Object.entries(menu.meals).forEach(([mealType, meal]) => {
          if (meal && meal.recipe) {
            addToMealPlan(activePlan.id, today, mealType, meal.recipe);
          }
        });
      }
      
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error applying daily menu:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Áp dụng random daily menu
   */
  const applyRandomDailyMenu = async () => {
    const randomMenu = getRandomDailyMenu();
    if (randomMenu) {
      await applyDailyMenuToToday(randomMenu.id);
    }
  };

  /**
   * Thêm món từ recipe library vào meal slot
   */
  const addRecipeToMealSlot = async (recipeId: string, mealType: string) => {
    setIsLoading(true);
    try {
      // Add to kitchen context
      await addToKitchen(mealType, recipeId);
      
      // Sync với meal planning context nếu có active plan
      if (activePlan) {
        // Tìm recipe từ available recipes
        // Note: Cần implement logic để lấy recipe object từ recipeId
        // addToMealPlan(activePlan.id, today, mealType, recipe);
      }
      
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error adding recipe to meal slot:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Tính toán thống kê thực đơn hôm nay
   */
  const getTodayStats = (): TodayStats => {
    const todayMealData = getTodayMeals();
    const meals = Object.values(todayMealData.meals).filter(Boolean);
    
    const totalCalories = meals.reduce((sum, meal) => {
      const recipe = meal?.recipe || meal?.dish || meal;
      return sum + (recipe?.calories || 0);
    }, 0);

    const totalPrepTime = meals.reduce((sum, meal) => {
      const recipe = meal?.recipe || meal?.dish || meal;
      const timeStr = recipe?.cookingTime || recipe?.cookTime || recipe?.prepTime || '0';
      const timeNum = parseInt(timeStr.replace(/\D/g, '')) || 0;
      return sum + timeNum;
    }, 0);

    return {
      mealsCount: meals.length,
      totalCalories,
      totalPrepTime,
      hasBreakfast: !!todayMealData.meals.breakfast,
      hasLunch: !!todayMealData.meals.lunch,
      hasDinner: !!todayMealData.meals.dinner,
      hasSnack: !!todayMealData.meals.snack,
      source: todayMealData.source
    };
  };

  /**
   * Kiểm tra xem có cần suggest daily menu không
   */
  const shouldSuggestDailyMenu = () => {
    const stats = getTodayStats();
    return stats.mealsCount === 0 && dailyMenus.length > 0;
  };

  /**
   * Lấy suggestions cho thực đơn
   */
  const getMenuSuggestions = (): MenuSuggestion[] => {
    if (dailyMenus.length === 0) return [];
    
    // Lấy 3 thực đơn đầu tiên làm suggestions
    return dailyMenus.slice(0, 3).map(menu => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      difficulty: menu.difficulty,
      totalCalories: menu.totalCalories,
      prepTime: menu.prepTime,
      mealsPreview: {
        breakfast: menu.meals.breakfast?.name || menu.meals.breakfast?.title,
        lunch: menu.meals.lunch?.name || menu.meals.lunch?.title,
        dinner: menu.meals.dinner?.name || menu.meals.dinner?.title
      }
    }));
  };

  // Auto-sync khi có thay đổi
  useEffect(() => {
    if (selectedDailyMenu && !lastSyncTime) {
      setLastSyncTime(new Date());
    }
  }, [selectedDailyMenu, lastSyncTime]);

  return {
    // Data
    todayMeals: getTodayMeals(),
    todayStats: getTodayStats(),
    menuSuggestions: getMenuSuggestions(),
    
    // States
    isLoading,
    lastSyncTime,
    shouldSuggestDailyMenu: shouldSuggestDailyMenu(),
    
    // Actions
    applyDailyMenuToToday,
    applyRandomDailyMenu,
    addRecipeToMealSlot,
    
    // Utils
    availableDailyMenus: dailyMenus,
    hasActivePlan: !!activePlan,
    hasSelectedDailyMenu: !!selectedDailyMenu
  };
};
