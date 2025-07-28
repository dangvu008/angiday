import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  servings: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  calories?: number;
  ingredients: string[];
  instructions: string[];
  category: string;
  tags: string[];
}

export interface MealSlot {
  id: string;
  date: string; // YYYY-MM-DD format
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: Recipe;
  notes?: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  meals: MealSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealPlanningContextType {
  // Current meal plan being edited
  currentPlan: MealPlan | null;
  setCurrentPlan: (plan: MealPlan | null) => void;
  
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
  
  // Loading states
  isLoading: boolean;
}

const MealPlanningContext = createContext<MealPlanningContextType | undefined>(undefined);

export const useMealPlanning = () => {
  const context = useContext(MealPlanningContext);
  if (!context) {
    throw new Error('useMealPlanning must be used within a MealPlanningProvider');
  }
  return context;
};

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
      name: 'Kế hoạch tuần này',
      description: 'Kế hoạch ăn uống cho tuần hiện tại',
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      meals: [
        {
          id: `meal_${Date.now()}_1`,
          date: today.toISOString().split('T')[0],
          mealType: 'lunch',
          recipe: sampleRecipes[0],
          notes: 'Món ăn truyền thống Việt Nam'
        },
        {
          id: `meal_${Date.now()}_2`,
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mealType: 'dinner',
          recipe: sampleRecipes[1],
          notes: 'Cơm chiều ngon miệng'
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
  const [userMealPlans, setUserMealPlans] = useState<MealPlan[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);

  // Load user's meal plans from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedPlans = localStorage.getItem(`meal_plans_${user.id}`);
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        setUserMealPlans(plans);
        // Set first plan as current if no current plan
        if (plans.length > 0 && !currentPlan) {
          setCurrentPlan(plans[0]);
        }
      } else {
        // Create sample meal plans for new users
        const samplePlans = createSampleMealPlans(user.id);
        setUserMealPlans(samplePlans);
        localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(samplePlans));
        if (samplePlans.length > 0) {
          setCurrentPlan(samplePlans[0]);
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

  const saveMealPlan = (plan: MealPlan) => {
    if (!user) return;
    
    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
    const updatedPlans = userMealPlans.filter(p => p.id !== plan.id);
    updatedPlans.push(updatedPlan);
    
    setUserMealPlans(updatedPlans);
    localStorage.setItem(`meal_plans_${user.id}`, JSON.stringify(updatedPlans));
    
    if (currentPlan?.id === plan.id) {
      setCurrentPlan(updatedPlan);
    }
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

  const addMealToSlot = (planId: string, date: string, mealType: string, recipe: Recipe) => {
    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) return;

    const existingMealIndex = plan.meals.findIndex(
      m => m.date === date && m.mealType === mealType
    );

    const newMeal: MealSlot = {
      id: `meal_${Date.now()}`,
      date,
      mealType: mealType as MealSlot['mealType'],
      recipe
    };

    if (existingMealIndex >= 0) {
      plan.meals[existingMealIndex] = newMeal;
    } else {
      plan.meals.push(newMeal);
    }

    saveMealPlan(plan);
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
    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) return;

    plan.meals = plan.meals.filter(
      m => !(m.date === date && m.mealType === mealType)
    );

    saveMealPlan(plan);
  };

  // New function to remove a specific dish from a meal
  const removeDishFromMeal = (planId: string, mealSlotId: string) => {
    const plan = userMealPlans.find(p => p.id === planId);
    if (!plan) return;

    plan.meals = plan.meals.filter(m => m.id !== mealSlotId);
    saveMealPlan(plan);
  };

  const getDayNutrition = (date: string): NutritionSummary => {
    if (!currentPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    const dayMeals = currentPlan.meals.filter(m => m.date === date);
    return dayMeals.reduce((total, meal) => ({
      calories: total.calories + (meal.recipe?.calories || 0),
      protein: total.protein + 0, // Would calculate from recipe data
      carbs: total.carbs + 0,
      fat: total.fat + 0,
      fiber: total.fiber + 0
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
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

  const value: MealPlanningContextType = {
    currentPlan,
    setCurrentPlan,
    userMealPlans,
    availableRecipes: mockRecipes,
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
    isLoading
  };

  return (
    <MealPlanningContext.Provider value={value}>
      {children}
    </MealPlanningContext.Provider>
  );
};
