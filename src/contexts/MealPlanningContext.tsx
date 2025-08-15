import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { kitchenService } from '@/services/kitchenService';
import { SupabaseAdapter } from '@/services/adapters/SupabaseAdapter';
import { Recipe, MealSlot, MealPlan, NutritionSummary } from '@/types/unified';

// Re-export types for backward compatibility
export type { Recipe, MealSlot, MealPlan, NutritionSummary } from '@/types/unified';

interface MealPlanningContextType {
  // Current meal plan being edited
  currentPlan: MealPlan | null;
  setCurrentPlan: (plan: MealPlan | null) => void;

  // Active meal plan (the one being used for daily tracking and shopping)
  activePlan: MealPlan | null;
  setActivePlan: (plan: MealPlan | null) => void;

  // All user's meal plans
  userMealPlans: MealPlan[];

  // Available recipes
  availableRecipes: Recipe[];

  // Current view date
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // View mode
  viewMode: 'week' | 'month';
  setViewMode: (mode: 'week' | 'month') => void;

  // Actions
  createNewPlan: (name: string, startDate: string, endDate: string) => MealPlan;
  saveMealPlan: (plan: MealPlan) => void;
  deleteMealPlan: (planId: string) => void;
  addMealToSlot: (planId: string, date: string, mealType: string, recipe: Recipe) => void;
  addDishToMeal: (planId: string, date: string, mealType: string, recipe: Recipe) => void;
  removeMealFromSlot: (planId: string, date: string, mealType: string) => void;
  removeDishFromMeal: (planId: string, mealSlotId: string) => void;

  // Nutrition
  getDayNutrition: (date: string) => NutritionSummary;
  getWeekNutrition: (startDate: string) => NutritionSummary;

  // Shopping list
  generateShoppingList: (planId: string) => { [category: string]: string[] };
  generateActiveShoppingList: () => { [category: string]: string[] };

  // Loading states
  isLoading: boolean;
}

const MealPlanningContext = createContext<MealPlanningContextType | undefined>(undefined);

// Custom hook for accessing meal planning context
function useMealPlanning() {
  const context = useContext(MealPlanningContext);
  if (!context) {
    throw new Error('useMealPlanning must be used within a MealPlanningProvider');
  }
  return context;
}

export { useMealPlanning };

// Mock recipes data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Phở Bò Hà Nội',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
    cookTime: '2 giờ',
    servings: 4,
    difficulty: 'Khó',
    calories: 450,
    ingredients: ['Xương bò', 'Bánh phở', 'Hành tây', 'Gừng', 'Thịt bò', 'Hành lá'],
    instructions: ['Ninh xương bò 3-4 tiếng', 'Chuẩn bị gia vị', 'Trần bánh phở', 'Bày biện và thưởng thức'],
    category: 'Món chính',
    tags: ['Truyền thống', 'Bò', 'Nước dùng']
  },
  {
    id: '2',
    title: 'Cơm Tấm Sườn Nướng',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    cookTime: '45 phút',
    servings: 2,
    difficulty: 'Trung bình',
    calories: 650,
    ingredients: ['Cơm tấm', 'Sườn heo', 'Nước mắm', 'Đường', 'Tỏi', 'Ớt'],
    instructions: ['Ướp sườn', 'Nướng sườn', 'Chuẩn bị cơm tấm', 'Bày biện'],
    category: 'Món chính',
    tags: ['Nướng', 'Heo', 'Miền Nam']
  },
  {
    id: '3',
    title: 'Bánh Mì Thịt Nướng',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
    cookTime: '30 phút',
    servings: 2,
    difficulty: 'Dễ',
    calories: 380,
    ingredients: ['Bánh mì', 'Thịt heo', 'Pate', 'Rau thơm', 'Dưa chua'],
    instructions: ['Nướng thịt', 'Chuẩn bị rau', 'Lắp bánh mì'],
    category: 'Ăn sáng',
    tags: ['Nhanh', 'Tiện lợi', 'Đường phố']
  }
];

// Helper function to create sample meal plans
const createSampleMealPlans = (userId: string): MealPlan[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const sampleRecipes = [
    {
      id: 'recipe_1',
      title: 'Phở Bò',
      image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400',
      cookTime: '45 phút',
      servings: 4,
      difficulty: 'Trung bình' as const,
      calories: 450,
      ingredients: ['Bánh phở', 'Thịt bò', 'Hành tây', 'Ngò gai'],
      instructions: ['Nấu nước dùng', 'Chuẩn bị bánh phở', 'Thái thịt bò'],
      category: 'Món chính',
      tags: ['Việt Nam', 'Nóng']
    },
    {
      id: 'recipe_2',
      title: 'Cơm Tấm Sườn',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      cookTime: '30 phút',
      servings: 2,
      difficulty: 'Dễ' as const,
      calories: 650,
      ingredients: ['Cơm tấm', 'Sườn nướng', 'Chả trứng', 'Dưa chua'],
      instructions: ['Nướng sườn', 'Làm chả trứng', 'Chuẩn bị cơm'],
      category: 'Món chính',
      tags: ['Việt Nam', 'Nướng']
    }
  ];

  return [
    {
      id: `plan_${Date.now()}_1`,
      userId,
      name: 'Thực đơn healthy tuần này',
      description: 'Kế hoạch ăn uống cân bằng dinh dưỡng cho tuần hiện tại',
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      meals: [
        // Hôm nay - đầy đủ 4 bữa
        {
          id: `meal_${Date.now()}_1`,
          date: today.toISOString().split('T')[0],
          mealType: 'breakfast',
          recipe: {
            id: 'recipe_breakfast_1',
            title: 'Phở Gà Thanh Đạm',
            image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=200&fit=crop',
            cookTime: '30 phút',
            servings: 1,
            difficulty: 'Dễ',
            calories: 380,
            ingredients: ['Bánh phở', 'Thịt gà', 'Hành lá', 'Ngò gai', 'Gừng'],
            instructions: ['Luộc gà', 'Nấu nước dùng', 'Trần bánh phở', 'Bày bát và thưởng thức'],
            category: 'Món Việt',
            tags: ['healthy', 'vietnamese', 'soup']
          },
          notes: 'Bữa sáng nhẹ nhàng, bổ dưỡng'
        },
        {
          id: `meal_${Date.now()}_2`,
          date: today.toISOString().split('T')[0],
          mealType: 'lunch',
          recipe: {
            id: 'recipe_lunch_1',
            title: 'Salad Quinoa Tôm Nướng',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
            cookTime: '25 phút',
            servings: 1,
            difficulty: 'Trung bình',
            calories: 450,
            ingredients: ['Quinoa', 'Tôm sú', 'Rau xà lách', 'Cà chua cherry', 'Dầu olive'],
            instructions: ['Nấu quinoa', 'Nướng tôm', 'Trộn salad', 'Trang trí và thưởng thức'],
            category: 'Salad',
            tags: ['healthy', 'protein', 'low-carb']
          },
          notes: 'Bữa trưa giàu protein, ít carb'
        },
        {
          id: `meal_${Date.now()}_3`,
          date: today.toISOString().split('T')[0],
          mealType: 'dinner',
          recipe: {
            id: 'recipe_dinner_1',
            title: 'Cá Hồi Nướng Rau Củ',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
            cookTime: '35 phút',
            servings: 1,
            difficulty: 'Trung bình',
            calories: 520,
            ingredients: ['Cá hồi', 'Bông cải xanh', 'Cà rốt', 'Khoai tây', 'Thảo mộc'],
            instructions: ['Ướp cá hồi', 'Chuẩn bị rau củ', 'Nướng cùng lúc', 'Trang trí và thưởng thức'],
            category: 'Món Âu',
            tags: ['healthy', 'omega-3', 'grilled']
          },
          notes: 'Bữa tối giàu omega-3'
        },
        {
          id: `meal_${Date.now()}_4`,
          date: today.toISOString().split('T')[0],
          mealType: 'snack',
          recipe: {
            id: 'recipe_snack_1',
            title: 'Sinh Tố Bơ Chuối',
            image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop',
            cookTime: '5 phút',
            servings: 1,
            difficulty: 'Dễ',
            calories: 280,
            ingredients: ['Bơ chín', 'Chuối', 'Sữa tươi', 'Mật ong', 'Đá viên'],
            instructions: ['Cho tất cả vào máy xay', 'Xay nhuyễn', 'Rót ly và thưởng thức'],
            category: 'Đồ uống',
            tags: ['healthy', 'smoothie', 'vitamin']
          },
          notes: 'Bữa phụ bổ sung vitamin'
        },
        // Ngày mai
        {
          id: `meal_${Date.now()}_5`,
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'breakfast',
          recipe: {
            id: 'recipe_breakfast_2',
            title: 'Yến Mạch Trái Cây',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
            cookTime: '10 phút',
            servings: 1,
            difficulty: 'Dễ',
            calories: 320,
            ingredients: ['Yến mạch', 'Chuối', 'Dâu tây', 'Hạnh nhân', 'Sữa tươi'],
            instructions: ['Nấu yến mạch', 'Thái trái cây', 'Trang trí đẹp mắt'],
            category: 'Healthy',
            tags: ['healthy', 'fiber', 'breakfast']
          },
          notes: 'Bữa sáng giàu chất xơ'
        },
        {
          id: `meal_${Date.now()}_6`,
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'lunch',
          recipe: sampleRecipes[0],
          notes: 'Món ăn truyền thống Việt Nam'
        },
        {
          id: `meal_${Date.now()}_7`,
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'dinner',
          recipe: sampleRecipes[1],
          notes: 'Cơm chiều ngon miệng'
        },
        // Ngày kia
        {
          id: `meal_${Date.now()}_8`,
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'breakfast',
          recipe: {
            id: 'recipe_breakfast_3',
            title: 'Bánh Mì Trứng Ốp La',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop',
            cookTime: '15 phút',
            servings: 1,
            difficulty: 'Dễ',
            calories: 420,
            ingredients: ['Bánh mì', 'Trứng gà', 'Bơ', 'Rau xà lách', 'Cà chua'],
            instructions: ['Nướng bánh mì', 'Ốp la trứng', 'Kẹp bánh mì với rau'],
            category: 'Món Việt',
            tags: ['quick', 'breakfast', 'protein']
          },
          notes: 'Bữa sáng nhanh gọn'
        },
        {
          id: `meal_${Date.now()}_9`,
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'lunch',
          recipe: {
            id: 'recipe_lunch_2',
            title: 'Bún Chả Hà Nội',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
            cookTime: '40 phút',
            servings: 1,
            difficulty: 'Trung bình',
            calories: 580,
            ingredients: ['Bún tươi', 'Thịt nướng', 'Chả cá', 'Rau thơm', 'Nước mắm'],
            instructions: ['Nướng thịt', 'Pha nước chấm', 'Bày bún và rau', 'Thưởng thức'],
            category: 'Món Việt',
            tags: ['vietnamese', 'traditional', 'grilled']
          },
          notes: 'Món ăn đặc trưng Hà Nội'
        },
        // Thêm một số bữa ăn cho các ngày tiếp theo
        {
          id: `meal_${Date.now()}_10`,
          date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'breakfast',
          recipe: {
            id: 'recipe_breakfast_4',
            title: 'Chè Đậu Xanh',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
            cookTime: '20 phút',
            servings: 1,
            difficulty: 'Dễ',
            calories: 250,
            ingredients: ['Đậu xanh', 'Nước cốt dừa', 'Đường phèn', 'Lá dứa'],
            instructions: ['Nấu đậu xanh', 'Pha nước cốt dừa', 'Trộn đều và thưởng thức'],
            category: 'Chè',
            tags: ['sweet', 'traditional', 'vietnamese']
          },
          notes: 'Bữa sáng nhẹ nhàng'
        },
        {
          id: `meal_${Date.now()}_11`,
          date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'lunch',
          recipe: {
            id: 'recipe_lunch_3',
            title: 'Cơm Gà Hải Nam',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop',
            cookTime: '45 phút',
            servings: 1,
            difficulty: 'Trung bình',
            calories: 620,
            ingredients: ['Gà ta', 'Gạo thơm', 'Hành tây', 'Gừng', 'Nước mắm'],
            instructions: ['Luộc gà', 'Nấu cơm với nước luộc gà', 'Cắt gà và bày đĩa'],
            category: 'Cơm',
            tags: ['chicken', 'rice', 'comfort-food']
          },
          notes: 'Cơm trưa đầy đủ dinh dưỡng'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `plan_${Date.now()}_2`,
      userId,
      name: 'Kế hoạch tuần sau',
      description: 'Chuẩn bị cho tuần tới',
      startDate: nextWeek.toISOString().split('T')[0],
      endDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      meals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const MealPlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [activePlan, setActivePlanState] = useState<MealPlan | null>(null);
  const [userMealPlans, setUserMealPlans] = useState<MealPlan[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>(mockRecipes);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Supabase adapter (with error handling)
  const [supabaseAdapter, setSupabaseAdapter] = useState<SupabaseAdapter | null>(null);

  useEffect(() => {
    // Temporarily disable Supabase for debugging
    console.log('⚠️ SupabaseAdapter disabled for debugging - using localStorage only');
    // try {
    //   const adapter = new SupabaseAdapter();
    //   setSupabaseAdapter(adapter);
    //   console.log('✅ SupabaseAdapter initialized successfully');
    // } catch (error) {
    //   console.error('❌ Failed to initialize SupabaseAdapter:', error);
    //   console.log('⚠️ Will use localStorage fallback only');
    // }
  }, []);

  // Load recipes from kitchenService
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipes = await kitchenService.getRecipes();
        if (recipes && recipes.length > 0) {
          setAvailableRecipes(recipes);
          console.log('✅ Loaded recipes from database:', recipes.length);
        } else {
          console.log('⚠️ No recipes found in database, using mock data');
        }
      } catch (error) {
        console.error('❌ Error loading recipes:', error);
        console.log('🔄 Using mock recipes as fallback');
      }
    };

    loadRecipes();
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 MealPlanningContext state changed:', {
      hasActivePlan: !!activePlan,
      activePlanId: activePlan?.id,
      userMealPlansCount: userMealPlans.length,
      availableRecipesCount: availableRecipes.length,
      isAuthenticated,
      userId: user?.id
    });
  }, [activePlan, userMealPlans, availableRecipes, isAuthenticated, user]);

  // Function to set active plan with localStorage persistence
  const setActivePlan = (plan: MealPlan | null) => {
    setActivePlanState(plan);
    if (user && plan) {
      localStorage.setItem(`active_plan_${user.id}`, plan.id);
    } else if (user) {
      localStorage.removeItem(`active_plan_${user.id}`);
    }
  };

  // Load user's meal plans from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Loading meal plans for user:', user.id);
      const savedPlans = localStorage.getItem(`meal_plans_${user.id}`);
      const savedActivePlanId = localStorage.getItem(`active_plan_${user.id}`);

      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        console.log('📋 Found saved plans:', plans.length);
        setUserMealPlans(plans);

        // Set active plan from saved ID
        if (savedActivePlanId) {
          const activePlan = plans.find((p: MealPlan) => p.id === savedActivePlanId);
          if (activePlan) {
            console.log('✅ Setting saved active plan:', activePlan.name);
            setActivePlanState(activePlan);
          } else {
            // If saved active plan not found, set first plan as active
            if (plans.length > 0) {
              console.log('⚠️ Saved active plan not found, using first plan:', plans[0].name);
              setActivePlan(plans[0]);
            }
          }
        } else if (plans.length > 0) {
          // No saved active plan, set first as active
          console.log('📌 No saved active plan, using first plan:', plans[0].name);
          setActivePlan(plans[0]);
        }

        // Set first plan as current if no current plan
        if (plans.length > 0 && !currentPlan) {
          setCurrentPlan(plans[0]);
        }
      } else {
        // Create sample meal plans for new users
        console.log('🆕 Creating sample meal plans for new user');
        const samplePlans = createSampleMealPlans(user.id);
        setUserMealPlans(samplePlans);
        localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(samplePlans));
        if (samplePlans.length > 0) {
          console.log('✅ Setting sample plan as active:', samplePlans[0].name);
          setCurrentPlan(samplePlans[0]);
          setActivePlan(samplePlans[0]); // Set first plan as active
        }
      }
    }
  }, [isAuthenticated, user]);

  const createNewPlan = (name: string, startDate: string, endDate: string): MealPlan => {
    const newPlan: MealPlan = {
      id: `plan_${Date.now()}`,
      userId: user?.id || '',
      name,
      startDate,
      endDate,
      meals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentPlan(newPlan);
    return newPlan;
  };

  const saveMealPlan = async (plan: MealPlan) => {
    if (!user) {
      console.error('❌ No user found, cannot save meal plan');
      return;
    }

    console.log('💾 Saving meal plan:', { planId: plan.id, userId: user.id, mealsCount: plan.meals.length });

    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };

    // Try to save to database if adapter is available
    if (supabaseAdapter) {
      try {
        // Check if plan exists in database
        const existingPlan = await supabaseAdapter.getMealPlan(plan.id);

        let savedPlan: MealPlan;
        if (existingPlan) {
          console.log('🔄 Updating existing plan in database');
          savedPlan = await supabaseAdapter.updateMealPlan(plan.id, updatedPlan);
        } else {
          console.log('➕ Creating new plan in database');
          // For new plans, we need to exclude the id and let database generate it
          const { id, ...planWithoutId } = updatedPlan;
          savedPlan = await supabaseAdapter.createMealPlan({
            ...planWithoutId,
            userId: user.id
          });
        }

        // Update local state with database result
        const updatedPlans = userMealPlans.map(p =>
          p.id === plan.id ? savedPlan : p
        );

        // If plan doesn't exist, add it
        if (!userMealPlans.find(p => p.id === plan.id)) {
          updatedPlans.push(savedPlan);
        }

        setUserMealPlans(updatedPlans);

        // Also save to localStorage as backup
        localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(updatedPlans));

        if (currentPlan?.id === plan.id) {
          setCurrentPlan(savedPlan);
        }

        // Also update activePlan if it's the same plan
        if (activePlan?.id === plan.id) {
          setActivePlanState(savedPlan);
        }

        console.log('✅ Meal plan saved to database successfully:', savedPlan.id);
        return;

      } catch (error) {
        console.error('❌ Error saving meal plan to database:', error);
        console.log('⚠️ Falling back to localStorage only');
      }
    }

    // Fallback to localStorage only (or if no supabase adapter)
    const updatedPlans = userMealPlans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    // If plan doesn't exist, add it
    if (!userMealPlans.find(p => p.id === plan.id)) {
      updatedPlans.push(updatedPlan);
    }

    setUserMealPlans(updatedPlans);
    localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(updatedPlans));

    if (currentPlan?.id === plan.id) {
      setCurrentPlan(updatedPlan);
    }

    // Also update activePlan if it's the same plan
    if (activePlan?.id === plan.id) {
      setActivePlanState(updatedPlan);
    }

    console.log('✅ Meal plan saved to localStorage:', updatedPlan.id);
  };

  const deleteMealPlan = (planId: string) => {
    const updatedPlans = userMealPlans.filter(p => p.id !== planId);
    setUserMealPlans(updatedPlans);
    
    if (user) {
      localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(updatedPlans));
    }
    
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  };

  const addMealToSlot = async (planId: string, date: string, mealType: string, recipe: Recipe) => {
    console.log('🏪 MealPlanningContext.addMealToSlot:', { planId, date, mealType, recipeTitle: recipe.title });

    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) {
      console.error('❌ Plan not found:', planId, 'Available plans:', userMealPlans.map(p => p.id));
      return;
    }

    // Check if recipe already exists for this meal slot to avoid duplicates
    const existingMealWithSameRecipe = plan.meals.find(
      m => m.date === date && m.mealType === mealType && m.recipe?.id === recipe.id
    );

    if (existingMealWithSameRecipe) {
      console.log('⚠️ Recipe already exists for this meal slot, skipping:', recipe.title);
      return;
    }

    const newMeal: MealSlot = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date,
      mealType: mealType as MealSlot['mealType'],
      recipe
    };

    console.log('📝 Creating meal slot:', { newMeal });

    // Try to save meal to database if adapter is available
    if (supabaseAdapter && user) {
      try {
        console.log('💾 Saving meal to database...');
        const savedMeal = await supabaseAdapter.createMeal({
          mealPlanId: planId,
          date: date,
          mealType: mealType as MealSlot['mealType'],
          recipeId: recipe.id,
          recipe: recipe
        });
        console.log('✅ Meal saved to database:', savedMeal.id);

        // Use the saved meal with database-generated ID
        newMeal.id = savedMeal.id;
      } catch (error) {
        console.error('⚠️ Error saving meal to database, continuing with local storage:', error);
      }
    }

    // Always add new meal (allow multiple dishes per meal)
    console.log('➕ Adding new meal to slot');
    plan.meals.push(newMeal);

    console.log('💾 Saving plan with meals:', plan.meals.length);
    console.log('📋 Current plan meals:', plan.meals.map(m => ({ id: m.id, date: m.date, mealType: m.mealType, recipeTitle: m.recipe?.title })));

    await saveMealPlan(plan);

    // Count meals for this specific slot
    const mealsForThisSlot = plan.meals.filter(m => m.date === date && m.mealType === mealType);

    console.log('✅ Meal added successfully. Updated plan:', {
      planId: plan.id,
      totalMeals: plan.meals.length,
      newMealId: newMeal.id,
      mealsForThisSlot: mealsForThisSlot.length,
      slotInfo: `${date} - ${mealType}`
    });
  };

  // New function to add multiple dishes to a meal
  const addDishToMeal = (planId: string, date: string, mealType: string, recipe: Recipe) => {
    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) return;

    const newMeal: MealSlot = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date,
      mealType: mealType as MealSlot['mealType'],
      recipe
    };

    plan.meals.push(newMeal);
    saveMealPlan(plan);
  };

  const removeMealFromSlot = (planId: string, date: string, mealType: string) => {
    console.log('🗑️ removeMealFromSlot called with:', { planId, date, mealType });

    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) {
      console.error('❌ Plan not found:', planId);
      console.log('📋 Available plans:', userMealPlans.map(p => ({ id: p.id, name: p.name })));
      return;
    }

    const originalLength = plan.meals.length;
    console.log('📋 Meals before removal:', plan.meals.map(m => ({ id: m.id, recipe: m.recipe?.title, date: m.date, mealType: m.mealType })));

    // Create a new plan object with filtered meals (immutable update)
    const updatedPlan = {
      ...plan,
      meals: plan.meals.filter(
        m => !(m.date === date && m.mealType === mealType)
      )
    };

    console.log('📋 Meals after removal:', updatedPlan.meals.map(m => ({ id: m.id, recipe: m.recipe?.title, date: m.date, mealType: m.mealType })));
    console.log(`🔢 Removed ${originalLength - updatedPlan.meals.length} meal(s) from ${mealType} on ${date}`);

    saveMealPlan(updatedPlan);
    console.log('✅ removeMealFromSlot completed successfully');
  };

  // New function to remove a specific dish from a meal
  const removeDishFromMeal = (planId: string, mealSlotId: string) => {
    console.log('🗑️ MealPlanningContext.removeDishFromMeal called with:', { planId, mealSlotId });

    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) {
      console.error('❌ Plan not found:', planId);
      console.log('📋 Available plans:', userMealPlans.map(p => ({ id: p.id, name: p.name })));
      return;
    }

    console.log('🔍 DEBUG - MealPlanningContext.removeDishFromMeal:');
    console.log('- planId:', planId);
    console.log('- mealSlotId:', mealSlotId);
    console.log('- typeof mealSlotId:', typeof mealSlotId);
    console.log('- plan.meals.length:', plan.meals.length);

    console.log('📋 Meals before removal:', plan.meals.map(m => ({
      id: m.id,
      recipe: m.recipe?.title,
      date: m.date,
      mealType: m.mealType
    })));
    console.log('🎯 Looking for meal with ID:', mealSlotId);

    const originalLength = plan.meals.length;
    const mealToRemove = plan.meals.find(m => m.id === mealSlotId);

    if (!mealToRemove) {
      console.warn('⚠️ No meal found with ID:', mealSlotId);
      console.log('📋 Available meal IDs:', plan.meals.map(m => m.id));
      console.log('📋 Detailed meal comparison:');
      plan.meals.forEach((m, index) => {
        console.log(`  [${index}] ID: "${m.id}" (type: ${typeof m.id}) vs looking for: "${mealSlotId}" (type: ${typeof mealSlotId})`);
        console.log(`      Equal? ${m.id === mealSlotId}, Strict equal? ${m.id === mealSlotId}`);
      });
      return;
    }

    console.log('🎯 Found meal to remove:', {
      id: mealToRemove.id,
      recipe: mealToRemove.recipe?.title,
      date: mealToRemove.date,
      mealType: mealToRemove.mealType
    });

    // Create a new plan object with filtered meals (immutable update)
    const updatedPlan = {
      ...plan,
      meals: plan.meals.filter(m => m.id !== mealSlotId)
    };

    console.log('📋 Meals after removal:', updatedPlan.meals.map(m => ({ id: m.id, recipe: m.recipe?.title })));
    console.log(`🔢 Removed ${originalLength - updatedPlan.meals.length} meal(s)`);

    if (originalLength === updatedPlan.meals.length) {
      console.error('❌ No meals were actually removed! This indicates an ID mismatch.');
    }

    saveMealPlan(updatedPlan);
    console.log('✅ MealPlanningContext.removeDishFromMeal completed');
  };

  const getDayNutrition = (date: string): NutritionSummary => {
    if (!currentPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    const dayMeals = currentPlan.meals.filter(m => m.date === date);
    return dayMeals.reduce((total, meal) => {
      const calories = meal.recipe?.calories || 0;
      // Ước tính các chất dinh dưỡng dựa trên calories và loại món ăn
      const protein = Math.round(calories * 0.15 / 4); // 15% calories từ protein
      const carbs = Math.round(calories * 0.50 / 4); // 50% calories từ carbs
      const fat = Math.round(calories * 0.35 / 9); // 35% calories từ fat
      const fiber = Math.round(calories * 0.02); // Ước tính fiber

      return {
        calories: total.calories + calories,
        protein: total.protein + protein,
        carbs: total.carbs + carbs,
        fat: total.fat + fat,
        fiber: total.fiber + fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const getWeekNutrition = (startDate: string): NutritionSummary => {
    // Implementation for week nutrition calculation
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  };

  const generateShoppingList = (planId: string): { [category: string]: string[] } => {
    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) return {};

    const ingredients: { [category: string]: Set<string> } = {};

    plan.meals.forEach(meal => {
      if (meal.recipe) {
        meal.recipe.ingredients.forEach(ingredient => {
          const category = meal.recipe!.category;
          if (!ingredients[category]) {
            ingredients[category] = new Set();
          }
          ingredients[category].add(ingredient);
        });
      }
    });

    // Convert Sets to Arrays
    const result: { [category: string]: string[] } = {};
    Object.keys(ingredients).forEach(category => {
      result[category] = Array.from(ingredients[category]);
    });

    return result;
  };

  const generateActiveShoppingList = (): { [category: string]: string[] } => {
    if (!activePlan) return {};
    return generateShoppingList(activePlan.id);
  };

  const value: MealPlanningContextType = {
    currentPlan,
    setCurrentPlan,
    activePlan,
    setActivePlan,
    userMealPlans,
    availableRecipes,
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    createNewPlan,
    saveMealPlan,
    deleteMealPlan,
    addMealToSlot,
    addDishToMeal,
    removeMealFromSlot,
    removeDishFromMeal,
    getDayNutrition,
    getWeekNutrition,
    generateShoppingList,
    generateActiveShoppingList,
    isLoading
  };

  return (
    <MealPlanningContext.Provider value={value}>
      {children}
    </MealPlanningContext.Provider>
  );
};
