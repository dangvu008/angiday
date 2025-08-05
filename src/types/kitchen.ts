// Kitchen types for the integrated system

export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  cooking_time?: string | null;
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  cuisine?: string | null;
  author?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_date?: string | null;
  views?: number | null;
  rating?: number | null;
  reviews?: number | null;
  cost?: number | null;
  is_favorite?: boolean | null;
  is_popular?: boolean | null;
  is_user_created?: boolean | null;
  ingredients?: any; // JSON field
  instructions?: any; // JSON field
  tags?: any; // JSON field
  nutrition?: any; // JSON field
}

export interface MealItem {
  id: string;
  name?: string;
  title?: string;
  recipe?: Recipe;
  dish?: Recipe;
  mealType: string;
}

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
export interface MealPlan {
  id: string;
  name: string;
  description?: string;
  recipes: Recipe[];
  totalTime: number;
  servings: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate?: boolean; // Có phải template không
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'mixed';
  totalCalories?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Meal assignment cho một bữa ăn cụ thể
export interface MealAssignment {
  id: string;
  date: string; // YYYY-MM-DD format
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealPlan?: MealPlan; // Thực đơn được áp dụng
  customRecipes?: Recipe[]; // Món được thêm riêng lẻ
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
  mealPlans: MealPlan[];
  currentWeekSchedule: WeeklyMealSchedule | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}
