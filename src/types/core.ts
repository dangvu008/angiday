// Core unified types for the entire application
export interface Recipe {
  id: string;
  title: string;
  name?: string; // For backward compatibility
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

export interface Menu {
  id: string;
  name: string;
  description: string;
  type: string;
  recipes: Recipe[];
  category: string;
  difficulty: string;
  totalCalories: number;
  prepTime: string;
  servings: number;
  tags: string[];
  isPopular: boolean;
  rating: number;
  reviews: number;
  createdByName: string; // Required field
  createdAt: string;
  updatedAt: string;
}

export interface ImportedRecipe {
  id: string;
  title: string;
  description: string;
  cookingTime: string;
  servings: number;
  difficulty: string;
  category: string;
  ingredients: string[];
  instructions: string[];
}

export interface StatusType {
  key: string;
  connected: boolean;
  isInitialized: boolean;
  hasClient: boolean;
  url: string;
}

export interface ResultType {
  success: boolean;
  message: string;
  testTime?: number;
  methodsAttempted?: string[];
  debugInfo?: any;
  errorCode?: string;
  errorDetails?: string;
  extractionMethod?: string;
  dataQuality?: string;
}

export interface MealShoppingItem {
  id: string;
  name: string;
  category: string; // Required
  estimatedPrice?: number;
  actualPrice?: number;
}

export interface TemplateType {
  id: string;
  name: string;
  meals: {
    id: string;
    name: string;
    type: string;
  }[];
}

export interface MealPlanTemplate {
  id: string;
  name: string;
  meals: {
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId: string;
  }[];
}

// Re-export for backward compatibility
export type { Recipe as KitchenRecipe };
export type { Recipe as MealPlanningRecipe };