// Unified Recipe type that satisfies all usages across the codebase
export interface Recipe {
  id: string;
  title: string;
  name?: string; // Alias for title - for compatibility
  description?: string | null;
  image?: string | null;
  
  // Time fields - supporting multiple naming conventions
  cooking_time?: string | null;
  cookTime?: string;
  cookingTime?: string;
  prepTime?: string;
  
  // Basic info
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  cuisine?: string | null;
  author?: string | null;
  status?: string | null;
  
  // Dates
  created_at?: string | null;
  updated_at?: string | null;
  created_date?: string | null;
  createdAt?: string;
  updatedAt?: string;
  
  // Metrics
  views?: number | null;
  rating?: number | null;
  reviews?: number | null;
  cost?: number | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  
  // Flags
  is_favorite?: boolean | null;
  is_popular?: boolean | null;
  is_user_created?: boolean | null;
  
  // Arrays - supporting both string[] and any for JSON fields
  ingredients?: string[] | any;
  instructions?: string[] | any;
  tags?: string[] | any;
  nutrition?: any;
}

export interface MealItem {
  id: string;
  name?: string;
  title?: string;
  recipe?: Recipe;
  dish?: Recipe;
  mealType: string;
  completed?: boolean;
  notes?: string;
  status?: string;
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
  userId?: string;
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

// Kitchen types
export interface DailyMenuPlan {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  totalCalories: number;
  prepTime: string;
  servings: number;
  meals: {
    breakfast?: MealItem;
    lunch?: MealItem;
    dinner?: MealItem;
    snack?: MealItem;
  };
  tags?: string[];
}

export interface TodayMeals {
  source: 'activePlan' | 'dailyMenu' | 'todayMeals' | 'empty';
  meals: {
    breakfast: MealItem | null;
    lunch: MealItem | null;
    dinner: MealItem | null;
    snack: MealItem | null;
  };
}

export interface TodayStats {
  mealsCount: number;
  totalCalories: number;
  totalPrepTime: number;
  hasBreakfast: boolean;
  hasLunch: boolean;
  hasDinner: boolean;
  hasSnack: boolean;
  source: string;
}

export interface MenuSuggestion {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  totalCalories: number;
  prepTime: string;
  mealsPreview: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

// Enhanced Meal Plan for advanced meal planning
export interface AdvancedMealPlan {
  id: string;
  name: string;
  description?: string;
  recipes: Recipe[];
  totalTime: number;
  servings: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate?: boolean;
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'mixed';
  totalCalories?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Meal assignment cho một bữa ăn cụ thể
export interface MealAssignment {
  id: string;
  date: string; // YYYY-MM-DD format
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealPlan?: AdvancedMealPlan;
  customRecipes?: Recipe[];
  status: 'planned' | 'in-progress' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Daily meal schedule
export interface DailyMealSchedule {
  date: string; // YYYY-MM-DD format
  breakfast?: MealAssignment;
  lunch?: MealAssignment;
  dinner?: MealAssignment;
  snacks?: MealAssignment[];
}

// Weekly meal schedule
export interface WeeklyMealSchedule {
  weekStart: string; // YYYY-MM-DD format (Monday)
  days: DailyMealSchedule[];
}

// Meal planning context state
export interface MealPlanningState {
  mealPlans: AdvancedMealPlan[];
  currentWeekSchedule: WeeklyMealSchedule | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}