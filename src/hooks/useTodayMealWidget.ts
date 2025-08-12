import { useMemo, useCallback, useEffect } from 'react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { 
  WidgetState, 
  WidgetStateData, 
  TodayMealPlan,
  MealSlot,
  ShoppingStatus
} from '@/types/today-meal-widget';

export const useTodayMealWidget = () => {
  const {
    activePlan,
    setActivePlan,
    currentDate,
    availableRecipes,
    createNewPlan,
    saveMealPlan,
    addMealToSlot,
    removeMealFromSlot,
    generateActiveShoppingList,
    userMealPlans
  } = useMealPlanning();

  // Debug logging (commented out to reduce console spam)
  // console.log('🔍 useTodayMealWidget state:', {
  //   hasActivePlan: !!activePlan,
  //   activePlanId: activePlan?.id,
  //   availableRecipesCount: availableRecipes.length,
  //   userMealPlansCount: userMealPlans.length
  // });

  // Auto-create active plan if none exists
  useEffect(() => {
    if (!activePlan && userMealPlans.length === 0) {
      console.log('🚀 Auto-creating meal plan since none exists');
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const newPlan = createNewPlan(
        'Thực đơn tuần này',
        today,
        nextWeek.toISOString().split('T')[0]
      );
      setActivePlan(newPlan);
    } else if (!activePlan && userMealPlans.length > 0) {
      console.log('🎯 Setting first meal plan as active');
      setActivePlan(userMealPlans[0]);
    }
  }, [activePlan, userMealPlans, createNewPlan, setActivePlan]);

  // Xác định bữa ăn hiện tại dựa trên thời gian - logic cải tiến
  const getCurrentMealType = useCallback((): 'breakfast' | 'lunch' | 'dinner' | 'snack' | null => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + minute / 60; // Chuyển thành decimal để so sánh chính xác hơn

    // Định nghĩa khung thời gian cho từng bữa ăn
    const mealTimes = {
      breakfast: { start: 6, end: 10 },
      lunch: { start: 11, end: 14 },
      snack: { start: 14.5, end: 17 },
      dinner: { start: 17.5, end: 21 }
    };

    // Tìm bữa ăn hiện tại
    for (const [mealType, timeRange] of Object.entries(mealTimes)) {
      if (currentTime >= timeRange.start && currentTime < timeRange.end) {
        return mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack';
      }
    }

    // Nếu ngoài giờ ăn, tìm bữa ăn tiếp theo gần nhất
    if (currentTime < 6) return 'breakfast';
    if (currentTime >= 21 || currentTime < 6) return 'breakfast'; // Sau 21h thì chuẩn bị cho bữa sáng hôm sau
    if (currentTime >= 10 && currentTime < 11) return 'lunch';
    if (currentTime >= 14 && currentTime < 14.5) return 'snack';
    if (currentTime >= 17 && currentTime < 17.5) return 'dinner';

    return null;
  }, []);

  // Helper function to convert Recipe to MealItem
  const convertRecipeToMealItem = useCallback((recipe: any): any => {
    return {
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      thumbnail: recipe.image, // Use same image as thumbnail for now
      cookingTime: parseInt(recipe.cookTime) || 30, // Extract number from string like "30 phút"
      calories: recipe.calories || 0,
      servings: recipe.servings || 1,
      ingredients: recipe.ingredients || [],
      recipeId: recipe.id,
      description: `${recipe.category} - ${recipe.difficulty}`
    };
  }, []);

  // Lấy kế hoạch bữa ăn hôm nay từ activePlan
  const getTodayMealPlan = useCallback((): TodayMealPlan | null => {
    if (!activePlan) return null;

    const today = new Date().toISOString().split('T')[0];

    // Lấy các meals cho hôm nay từ activePlan
    const todayMeals = activePlan.meals.filter(meal => meal.date === today);

    // Tạo structure cho widget
    const mealSlots = {
      breakfast: {
        id: `breakfast-${today}`,
        mealType: 'breakfast' as const,
        meals: [] as any[],
        isCompleted: false
      },
      lunch: {
        id: `lunch-${today}`,
        mealType: 'lunch' as const,
        meals: [] as any[],
        isCompleted: false
      },
      dinner: {
        id: `dinner-${today}`,
        mealType: 'dinner' as const,
        meals: [] as any[],
        isCompleted: false
      },
      snack: {
        id: `snack-${today}`,
        mealType: 'snack' as const,
        meals: [] as any[],
        isCompleted: false
      }
    };

    // Populate meals from activePlan
    todayMeals.forEach(meal => {
      if (meal.recipe && mealSlots[meal.mealType]) {
        const mealItem = convertRecipeToMealItem(meal.recipe);
        mealSlots[meal.mealType].meals.push(mealItem);
      }
    });

    const todayPlan: TodayMealPlan = {
      id: `today-plan-${today}`,
      date: today,
      meals: mealSlots,
      totalCalories: 0, // Will be calculated
      totalCost: 0, // Will be calculated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate totals
    let totalCalories = 0;
    Object.values(todayPlan.meals).forEach(mealSlot => {
      mealSlot.meals.forEach(meal => {
        totalCalories += meal.calories || 0;
      });
    });
    todayPlan.totalCalories = totalCalories;

    return todayPlan;
  }, [activePlan, convertRecipeToMealItem]);

  // Tính toán trạng thái shopping
  const getShoppingStatus = useCallback((todayPlan: TodayMealPlan | null): ShoppingStatus => {
    if (!todayPlan) {
      return {
        isNeeded: false,
        ingredientCount: 0,
        isCompleted: false
      };
    }

    const allIngredients = Object.values(todayPlan.meals)
      .filter(meal => meal.meals.length > 0)
      .flatMap(meal => meal.meals.flatMap(m => m.ingredients));

    // Trong thực tế, sẽ check từ shopping list API
    // Hiện tại mock là chưa hoàn thành shopping
    return {
      isNeeded: allIngredients.length > 0,
      ingredientCount: allIngredients.length,
      isCompleted: false // Mock - sẽ được update từ shopping list service
    };
  }, []);

  // Xác định trạng thái widget
  const determineWidgetState = useCallback((
    todayPlan: TodayMealPlan | null,
    shoppingStatus: ShoppingStatus
  ): WidgetState => {
    if (!todayPlan) return 'no-plan';

    // Đếm số bữa ăn đã hoàn thành
    const completedMeals = Object.values(todayPlan.meals).filter(meal => meal.isCompleted);
    const totalMeals = Object.values(todayPlan.meals).filter(meal => meal.meals.length > 0);

    // Nếu đã hoàn thành tất cả bữa ăn
    if (completedMeals.length === totalMeals.length && totalMeals.length > 0) {
      return 'completed';
    }

    // Nếu cần shopping và chưa hoàn thành
    if (shoppingStatus.isNeeded && !shoppingStatus.isCompleted) {
      return 'need-shopping';
    }

    // Đã sẵn sàng nấu
    return 'ready-to-cook';
  }, []);

  // Tính toán trạng thái widget
  const widgetStateData = useMemo((): WidgetStateData => {
    const todayPlan = getTodayMealPlan();
    const shoppingStatus = getShoppingStatus(todayPlan);
    const state = determineWidgetState(todayPlan, shoppingStatus);
    const nextMealType = getCurrentMealType();

    const completedMealsCount = todayPlan 
      ? Object.values(todayPlan.meals).filter(meal => meal.isCompleted).length
      : 0;
    
    const totalMealsCount = todayPlan
      ? Object.values(todayPlan.meals).filter(meal => meal.meals.length > 0).length
      : 0;

    return {
      state,
      todayPlan,
      shoppingStatus,
      nextMealType,
      completedMealsCount,
      totalMealsCount
    };
  }, [getTodayMealPlan, getShoppingStatus, determineWidgetState, getCurrentMealType]);

  // Actions
  const actions = useMemo(() => ({
    createTodayPlan: async () => {
      if (!activePlan) {
        // Create a new meal plan for today
        const today = new Date();
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 6);

        const newPlan = createNewPlan(
          `Kế hoạch tuần ${today.toLocaleDateString('vi-VN')}`,
          today.toISOString().split('T')[0],
          endOfWeek.toISOString().split('T')[0]
        );

        setActivePlan(newPlan);
        saveMealPlan(newPlan);
      }
    },

    addMealToSlot: async (mealType: string, recipeId: string) => {
      console.log('🍽️ Adding meal to slot:', { mealType, recipeId, activePlan: !!activePlan });

      if (!activePlan) {
        console.error('❌ No active plan found, creating one...');

        // Tự động tạo plan nếu chưa có
        const today = new Date();
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 6);

        const newPlan = createNewPlan(
          `Kế hoạch tuần ${today.toLocaleDateString('vi-VN')}`,
          today.toISOString().split('T')[0],
          endOfWeek.toISOString().split('T')[0]
        );

        setActivePlan(newPlan);
        saveMealPlan(newPlan);

        console.log('✅ Created new plan:', newPlan.id);

        // Sử dụng plan mới tạo
        const currentActivePlan = newPlan;

        // Tiếp tục với logic thêm meal
        const recipe = availableRecipes.find(r => r.id === recipeId);
        console.log('🔍 Recipe search:', { recipeId, found: !!recipe, totalRecipes: availableRecipes.length });

        if (!recipe) {
          console.error('❌ Recipe not found:', recipeId);
          throw new Error('Không tìm thấy công thức này. Vui lòng thử lại.');
        }

        try {
          const today = new Date().toISOString().split('T')[0];
          console.log('✅ Adding meal to new plan:', { planId: currentActivePlan.id, today, mealType, recipeTitle: recipe.title });
          await addMealToSlot(currentActivePlan.id, today, mealType, recipe);
          console.log('✅ Meal added successfully to new plan');
        } catch (error) {
          console.error('❌ Error adding meal to new plan:', error);
          throw error;
        }

        return;
      }

      // Find recipe from available recipes
      const recipe = availableRecipes.find(r => r.id === recipeId);
      console.log('🔍 Recipe search:', { recipeId, found: !!recipe, totalRecipes: availableRecipes.length });

      if (!recipe) {
        console.error('❌ Recipe not found:', recipeId);
        throw new Error('Không tìm thấy công thức này. Vui lòng thử lại.');
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        console.log('✅ Adding meal:', { planId: activePlan.id, today, mealType, recipeTitle: recipe.title });
        await addMealToSlot(activePlan.id, today, mealType, recipe);
        console.log('✅ Meal added successfully');
      } catch (error) {
        console.error('❌ Error adding meal:', error);
        throw error;
      }
    },

    removeMealFromSlot: async (mealType: string, mealId?: string) => {
      if (!activePlan) return;

      const today = new Date().toISOString().split('T')[0];

      if (mealId) {
        // Remove specific meal - since context only supports one recipe per slot,
        // we'll remove the entire slot for now
        // TODO: Enhance context to support multiple recipes per slot
        console.log(`Removing specific meal ${mealId} from ${mealType}`);
        removeMealFromSlot(activePlan.id, today, mealType);
      } else {
        // Remove entire meal slot
        removeMealFromSlot(activePlan.id, today, mealType);
      }
    },

    replaceMealInSlot: async (mealType: string, newMealId: string) => {
      // Implement replace meal logic
      console.log('Replacing meal in slot:', mealType, newMealId);
    },

    markMealCompleted: async (mealType: string) => {
      // Implement mark meal completed logic
      console.log('Marking meal completed:', mealType);
    },

    createShoppingList: async () => {
      if (!activePlan) return;

      const shoppingList = generateActiveShoppingList();
      console.log('Creating shopping list:', shoppingList);
      // TODO: Open shopping list modal
      return shoppingList;
    },

    markShoppingCompleted: async () => {
      // Implement mark shopping completed logic
      console.log('Marking shopping completed');
    },

    startCookingMode: async (mealType: string) => {
      // This will be handled by the widget component directly
      // since it needs to navigate and use CookingModeStarter
      console.log('Starting cooking mode for:', mealType);
      return { mealType, todayPlan: widgetStateData.todayPlan };
    },

    requestAISuggestion: async () => {
      // Implement AI suggestion logic
      console.log('Requesting AI suggestion for tomorrow');
    }
  }), [
    activePlan,
    createNewPlan,
    setActivePlan,
    saveMealPlan,
    availableRecipes,
    addMealToSlot,
    removeMealFromSlot,
    generateActiveShoppingList
  ]);

  return {
    widgetStateData,
    actions
  };
};
