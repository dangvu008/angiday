// @ts-nocheck
// Types và interfaces cho widget "Thực Đơn Hôm Nay"

export interface MealItem {
  id: string;
  name: string;
  image?: string;
  thumbnail?: string; // Thêm thumbnail riêng cho hiển thị trong card
  cookingTime: number; // phút
  calories: number;
  servings: number;
  ingredients: string[];
  recipeId?: string;
  description?: string; // Mô tả ngắn cho món ăn
}

export interface MealSlot {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meals: MealItem[]; // Thay đổi từ meal đơn lẻ thành array để hỗ trợ nhiều món
  isCompleted: boolean;
  completedAt?: string;
  notes?: string; // Ghi chú cho bữa ăn
}

export interface TodayMealPlan {
  id: string;
  date: string; // YYYY-MM-DD format
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
    snack: MealSlot;
  };
  totalCalories: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

// Trạng thái widget
export type WidgetState = 
  | 'no-plan'           // Chưa có kế hoạch cho hôm nay
  | 'need-shopping'     // Đã có kế hoạch, cần đi chợ
  | 'ready-to-cook'     // Đã có kế hoạch, đã sẵn sàng nấu
  | 'completed';        // Đã hoàn thành tất cả các bữa trong ngày

export interface ShoppingStatus {
  isNeeded: boolean;
  ingredientCount: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface WidgetStateData {
  state: WidgetState;
  todayPlan: TodayMealPlan | null;
  shoppingStatus: ShoppingStatus;
  nextMealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  completedMealsCount: number;
  totalMealsCount: number;
}

// Props cho các component
export interface TodayMealWidgetProps {
  className?: string;
}

export interface MealCardProps {
  mealSlot: MealSlot;
  isNext: boolean;
  onViewRecipe: (recipeId: string) => void;
  onReplaceMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string) => void;
  onAddMeal: (mealType: string) => void;
}

export interface MealSectionProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealSlot: MealSlot;
  isNext: boolean;
  onViewRecipe: (recipeId: string) => void;
  onReplaceMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string) => void;
  onAddMeal: (mealType: string) => void;
}

export interface WidgetFooterProps {
  state: WidgetState;
  shoppingStatus: ShoppingStatus;
  nextMealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  onCreatePlan: () => void;
  onCreateShoppingList: () => void;
  onStartCooking: () => void;
  onPlanTomorrow: () => void;
  onAISuggestion?: () => void; // Thêm action cho AI suggestion
}

// Utility types
export interface MealTypeConfig {
  key: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  label: string;
  emoji: string;
  icon: string;
  timeRange: [number, number]; // [start_hour, end_hour]
}

export const MEAL_TYPE_CONFIGS: Record<string, MealTypeConfig> = {
  breakfast: {
    key: 'breakfast',
    label: 'Bữa Sáng',
    emoji: '☕',
    icon: 'Coffee',
    timeRange: [6, 10]
  },
  lunch: {
    key: 'lunch', 
    label: 'Bữa Trưa',
    emoji: '🍚',
    icon: 'Utensils',
    timeRange: [11, 14]
  },
  dinner: {
    key: 'dinner',
    label: 'Bữa Tối', 
    emoji: '🍽️',
    icon: 'Utensils',
    timeRange: [17, 20]
  },
  snack: {
    key: 'snack',
    label: 'Bữa Phụ',
    emoji: '🍪',
    icon: 'Cookie',
    timeRange: [14, 17]
  }
};

// New interfaces for horizontal layout
export interface MealCardProps {
  meal: MealItem;
  onViewRecipe: (recipeId: string) => void;
  onRemoveMeal: (mealId: string) => void;
}

export interface MealSectionProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealSlot: MealSlot;
  config: MealTypeConfig;
  onViewRecipe: (recipeId: string) => void;
  onAddMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string, mealId: string) => void;
}

export interface MealPlanContentProps {
  todayPlan: TodayMealPlan;
  onViewRecipe: (recipeId: string) => void;
  onAddMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string, mealId: string) => void;
}

// Actions
export interface WidgetActions {
  createTodayPlan: () => Promise<void>;
  addMealToSlot: (mealType: string, mealId: string) => Promise<void>;
  removeMealFromSlot: (mealType: string, mealId?: string) => Promise<void>; // mealId optional để xóa toàn bộ hoặc một món
  replaceMealInSlot: (mealType: string, newMealId: string) => Promise<void>;
  markMealCompleted: (mealType: string) => Promise<void>;
  createShoppingList: () => Promise<void>;
  markShoppingCompleted: () => Promise<void>;
  startCookingMode: (mealType: string) => Promise<void>;
  requestAISuggestion: () => Promise<void>; // Thêm action cho AI suggestion
}
