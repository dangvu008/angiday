// Types for comprehensive meal planning system

export interface Dish {
  id: string;
  name: string;
  image: string;
  cookingTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  views: number;
  servings: number;
  calories: number;
  nutrition: {
    protein: number; // grams
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: string[];
  instructions: string[];
  tags: string[];
  category: string;
  cost: number; // VND
}

export interface MealSlot {
  id: string;
  dishes: Dish[];
  totalCalories: number;
  totalCost: number;
  totalCookingTime: number;
  notes?: string;
  // Calorie distribution per family member
  calorieDistribution: {
    [memberId: string]: {
      memberName: string;
      calories: number;
      percentage: number; // percentage of total calories for this meal
    };
  };
}

export interface DayPlan {
  date: string; // YYYY-MM-DD format
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
    snacks: MealSlot[];
  };
  totalCalories: number;
  totalCost: number;
  nutritionSummary: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// Base Plan Interface
export interface BasePlan {
  id: string;
  name: string;
  description?: string;
  type: 'meal' | 'day' | 'week' | 'month';
  createdBy: string;
  createdByName?: string; // Display name of creator
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isTemplate: boolean;
  isPublic: boolean;
  totalCalories: number;
  totalCost: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// Meal Plan - Kế hoạch cho một bữa ăn
export interface MealPlan extends BasePlan {
  type: 'meal';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: string; // Optional - for specific date
  meal: MealSlot;
  servings: number;
  cookingTime: number;
}

// Single Day Plan - Kế hoạch cho một ngày (updated)
export interface SingleDayPlan extends BasePlan {
  type: 'day';
  date: string; // YYYY-MM-DD format
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
    snacks: MealSlot[];
  };
  nutritionSummary: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// Week Plan - Kế hoạch cho một tuần
export interface WeekPlan extends BasePlan {
  type: 'week';
  startDate: string;
  endDate: string;
  days: DayPlan[];
  averageCaloriesPerDay: number;
}

// Month Plan - Kế hoạch cho một tháng
export interface MonthPlan extends BasePlan {
  type: 'month';
  year: number;
  month: number; // 1-12
  weeks: WeekPlan[];
  averageCaloriesPerDay: number;
  averageCaloriesPerWeek: number;
}

// Union type for all plan types
export type AnyPlan = MealPlan | SingleDayPlan | WeekPlan | MonthPlan;

// Individual Meal Template - Bữa ăn riêng lẻ
// Recipe - Công thức nấu ăn cụ thể
export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  createdDate: string;
  views: number;
  image?: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  cuisine: string;
  season?: string;
  rating: number;
  reviews: number;
}

// Menu - Thực đơn (tập hợp các công thức)
export interface Menu {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'full_day' | 'custom';
  recipes: Recipe[];
  totalCalories: number;
  totalCost: number;
  servings: number;
  tags: string[];
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  totalCookingTime: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  isPublic: boolean;
  createdBy: string;
  createdByName: string; // Tên hiển thị của người tạo
  createdAt: string;
  updatedAt: string;
  // Menu metadata
  category: string;
  cuisine: string;
  season?: string;
  targetAudience: string[]; // ['family', 'single', 'couple', 'kids']
  dietaryRestrictions: string[];
  // Usage tracking
  usageCount: number;
  rating: number;
  reviews: number;
  // Permission flags
  canEdit?: boolean; // Có thể chỉnh sửa (computed field)
  canDelete?: boolean; // Có thể xóa (computed field)
  canAddToPersonalPlan?: boolean; // Có thể thêm vào kế hoạch cá nhân
}

export interface MealTemplate {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dishes: Dish[];
  totalCalories: number;
  totalCost: number;
  servings: number;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  cookingTime: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Template metadata
  category: string;
  cuisine: string;
  season?: string;
  // Usage tracking
  usageCount: number;
  rating: number;
  reviews: number;
}

// Day Plan Template - Template thực đơn ngày
export interface DayPlanTemplate {
  id: string;
  name: string;
  description: string;
  meals: {
    breakfast: MealTemplate[];
    lunch: MealTemplate[];
    dinner: MealTemplate[];
    snacks: MealTemplate[];
  };
  totalCalories: number;
  totalCost: number;
  totalCookingTime: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Template metadata
  category: string;
  targetAudience: string[]; // ['family', 'single', 'couple', 'kids']
  dietaryRestrictions: string[];
  // Usage tracking
  usageCount: number;
  rating: number;
  reviews: number;
}

export interface NutritionGoals {
  dailyCalories: number;
  protein: number; // percentage
  carbs: number; // percentage
  fat: number; // percentage
  fiber: number; // grams
}

// Individual person in family
export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dailyCalorieNeeds: number; // calculated based on BMR and activity
  nutritionGoals: NutritionGoals;
  dietaryRestrictions: string[];
  allergies: string[];
  isActive: boolean; // whether to include in meal planning
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  dislikedIngredients: string[];
  preferredCuisines: string[];
  budgetLimit: number; // VND per day
  nutritionGoals: NutritionGoals;
  familySize: number;
  familyMembers: FamilyMember[]; // detailed family member info
  totalDailyCalorieNeeds: number; // sum of all active family members
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimatedCost: number;
  isChecked: boolean;
  notes?: string;
}

export interface ShoppingList {
  id: string;
  weekPlanId: string;
  items: ShoppingListItem[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

// Template Library với search và filter
export interface TemplateLibrary {
  mealTemplates: MealTemplate[];
  dayPlanTemplates: DayPlanTemplate[];
  searchFilters: LibrarySearchFilters;
  sortOptions: LibrarySortOptions;
}

export interface LibrarySearchFilters {
  query?: string;
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'day-plan';
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCalories?: number;
  maxCost?: number;
  maxCookingTime?: number;
  tags?: string[];
  category?: string;
  cuisine?: string;
  dietaryRestrictions?: string[];
  rating?: number;
}

export interface LibrarySortOptions {
  field: 'name' | 'calories' | 'cost' | 'cookingTime' | 'rating' | 'usageCount' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Drag & Drop interfaces
export interface DragItem {
  type: 'meal-template' | 'day-plan-template' | 'dish';
  data: MealTemplate | DayPlanTemplate | Dish;
}

export interface DropTarget {
  type: 'meal-slot' | 'day-slot' | 'week-slot';
  date: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  position?: number;
}

// Auto Calculator Results
export interface CalculationResult {
  calories: number;
  cost: number;
  cookingTime: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  breakdown: {
    [itemId: string]: {
      name: string;
      calories: number;
      cost: number;
      cookingTime: number;
      nutrition: {
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  };
}

// Drag & Drop Types
export interface DragItem {
  type: 'dish' | 'meal-template' | 'meal-slot';
  data: Dish | MealTemplate | MealSlot;
}

export interface DropTarget {
  type: 'meal-slot' | 'day-plan' | 'trash';
  date?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  slotIndex?: number;
}

// Calendar View Types
export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  dishes: Dish[];
  calories: number;
  cost: number;
  color: string;
}

// Statistics Types
export interface NutritionStats {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  goalProgress: {
    calories: number; // percentage
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalCalories: number;
  averageCaloriesPerDay: number;
  totalCost: number;
  averageCostPerDay: number;
  nutritionBreakdown: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  topDishes: Array<{
    dish: Dish;
    frequency: number;
  }>;
  goalAchievement: {
    daysMetCalorieGoal: number;
    daysMetNutritionGoals: number;
    budgetCompliance: number; // percentage
  };
}

// Export/Import Types
export interface MealPlanExport {
  version: string;
  exportDate: string;
  weekPlans: WeekPlan[];
  mealTemplates: MealTemplate[];
  userPreferences: UserPreferences;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  categories?: string[];
  tags?: string[];
  maxCalories?: number;
  maxCookingTime?: number;
  difficulty?: ('easy' | 'medium' | 'hard')[];
  maxCost?: number;
  minRating?: number;
  dietaryRestrictions?: string[];
  excludeIngredients?: string[];
}

export interface SortOptions {
  field: 'name' | 'calories' | 'cookingTime' | 'rating' | 'cost' | 'createdAt';
  direction: 'asc' | 'desc';
}
