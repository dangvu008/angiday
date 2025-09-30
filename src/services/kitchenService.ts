// @ts-nocheck
// Kitchen Command Center Service Layer
// Hỗ trợ multiple backends: Supabase, Firebase, PocketBase, LocalStorage

import { AdapterFactory } from './adapters/AdapterFactory';
import {
  Recipe as IRecipe,
  MealPlan as IMealPlan,
  ShoppingList as IShoppingList,
  ShoppingItem as IShoppingItem,
  DailyMenuShoppingStatus as IDailyMenuShoppingStatus,
  MealShoppingItem as IMealShoppingItem,
  DatabaseAdapter as IDatabaseAdapter
} from './interfaces/DatabaseAdapter';

// Re-export interfaces for backward compatibility
export type {
  IRecipe as Recipe,
  IMealPlan as MealPlan,
  IShoppingList as ShoppingList,
  IShoppingItem as ShoppingItem,
  IDailyMenuShoppingStatus as DailyMenuShoppingStatus,
  IMealShoppingItem as MealShoppingItem,
  IDatabaseAdapter as DatabaseAdapter
};

// Keep original Recipe interface for now (will be removed later)
export interface RecipeOld {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface MealSlot {
  id: string;
  mealPlanId: string;
  mealDate: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  recipe?: Recipe;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId?: string;
  items: ShoppingItem[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  price?: number;
  estimatedPrice?: number; // Giá ước tính (VND)
  actualPrice?: number; // Giá thực tế (VND)
  isPurchased?: boolean; // Trạng thái đã mua
  purchasedAt?: string; // Thời điểm mua
  notes?: string; // Ghi chú
  recipeId?: string; // ID của recipe chứa nguyên liệu này
  recipeName?: string; // Tên món ăn
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // Loại bữa ăn
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemName: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Shopping Status Interfaces
export interface DailyMenuShoppingStatus {
  id: string;
  userId: string;
  menuDate: string; // YYYY-MM-DD
  dailyMenuId?: string; // ID của daily menu plan
  status: 'not_purchased' | 'purchased' | 'partially_purchased';
  totalEstimatedCost: number; // VND
  totalActualCost: number; // VND
  shoppingCompletedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealShoppingItem {
  id: string;
  dailyShoppingStatusId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  recipeName: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  category: string;
  estimatedPrice: number; // VND
  actualPrice?: number; // VND
  isPurchased: boolean;
  purchasedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingCostStatistics {
  id: string;
  userId: string;
  periodType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  periodValue: string; // YYYY-MM-DD, YYYY-WW, YYYY-MM, YYYY
  totalCost: number; // VND
  mealCount: number;
  avgCostPerMeal: number; // VND
  categoryBreakdown: Record<string, number>; // category -> cost
  createdAt: string;
  updatedAt: string;
}

export interface IngredientPriceSuggestion {
  id: string;
  ingredientName: string;
  category: string;
  unit: string;
  avgPrice: number; // VND
  minPrice?: number; // VND
  maxPrice?: number; // VND
  region: string;
  lastUpdated: string;
  sampleCount: number;
}

// VND Price Validation Utilities
export interface VNDPriceValidation {
  isValid: boolean;
  formattedPrice: string;
  numericValue: number;
  suggestions?: string[]; // Gợi ý với số 0 đằng sau
}

// Current meal time detection
export type CurrentMealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'none';

export interface TodayMenuStatus {
  hasMenu: boolean;
  currentMealTime: CurrentMealTime;
  shoppingStatus?: DailyMenuShoppingStatus;
  nextAction: 'create_menu' | 'go_shopping' | 'start_cooking' | 'none';
}

// Abstract Database Interface
export interface DatabaseAdapter {
  // Meal Plans
  getMealPlans(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan>;
  updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan>;
  deleteMealPlan(id: string): Promise<void>;

  // Meals
  getMeals(mealPlanId: string): Promise<MealSlot[]>;
  getMealsByDate(userId: string, date: string): Promise<MealSlot[]>;
  createMeal(meal: Omit<MealSlot, 'id' | 'createdAt'>): Promise<MealSlot>;
  updateMeal(id: string, updates: Partial<MealSlot>): Promise<MealSlot>;
  deleteMeal(id: string): Promise<void>;

  // Recipes
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe>;
  updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe>;
  deleteRecipe(id: string): Promise<void>;

  // Shopping Lists
  getShoppingLists(userId: string): Promise<ShoppingList[]>;
  createShoppingList(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList>;
  updateShoppingList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList>;
  deleteShoppingList(id: string): Promise<void>;

  // Inventory
  getInventory(userId: string): Promise<InventoryItem[]>;
  createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem>;
  updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem>;
  deleteInventoryItem(id: string): Promise<void>;

  // Shopping Status
  getDailyShoppingStatus(userId: string, menuDate: string): Promise<DailyMenuShoppingStatus | null>;
  getDailyShoppingStatusById(id: string): Promise<DailyMenuShoppingStatus | null>;
  createDailyShoppingStatus(status: Omit<DailyMenuShoppingStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMenuShoppingStatus>;
  updateDailyShoppingStatus(id: string, updates: Partial<DailyMenuShoppingStatus>): Promise<DailyMenuShoppingStatus>;
  deleteDailyShoppingStatus(id: string): Promise<void>;

  // Meal Shopping Items
  getMealShoppingItems(dailyShoppingStatusId: string): Promise<MealShoppingItem[]>;
  createMealShoppingItem(item: Omit<MealShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealShoppingItem>;
  updateMealShoppingItem(id: string, updates: Partial<MealShoppingItem>): Promise<MealShoppingItem>;
  deleteMealShoppingItem(id: string): Promise<void>;

  // Shopping Cost Statistics
  getShoppingCostStatistics(userId: string, periodType?: string, periodValue?: string): Promise<ShoppingCostStatistics[]>;
  createOrUpdateShoppingCostStatistics(stats: Omit<ShoppingCostStatistics, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingCostStatistics>;

  // Ingredient Price Suggestions
  getIngredientPriceSuggestions(ingredientName?: string, category?: string): Promise<IngredientPriceSuggestion[]>;
  createOrUpdateIngredientPriceSuggestion(suggestion: Omit<IngredientPriceSuggestion, 'id'>): Promise<IngredientPriceSuggestion>;
}

// LocalStorage Adapter (for demo/offline)
export class LocalStorageAdapter implements DatabaseAdapter {
  private getKey(table: string): string {
    return `kitchen_${table}`;
  }

  private getData<T>(table: string): T[] {
    const data = localStorage.getItem(this.getKey(table));
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getKey(table), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Meal Plans
  async getMealPlans(userId: string): Promise<MealPlan[]> {
    const plans = this.getData<MealPlan>('meal_plans');
    return plans.filter(plan => plan.userId === userId);
  }

  async createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan> {
    const plans = this.getData<MealPlan>('meal_plans');
    const newPlan: MealPlan = {
      ...mealPlan,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    plans.push(newPlan);
    this.setData('meal_plans', plans);
    return newPlan;
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    const plans = this.getData<MealPlan>('meal_plans');
    const index = plans.findIndex(plan => plan.id === id);
    if (index === -1) throw new Error('Meal plan not found');
    
    plans[index] = { ...plans[index], ...updates, updatedAt: new Date().toISOString() };
    this.setData('meal_plans', plans);
    return plans[index];
  }

  async deleteMealPlan(id: string): Promise<void> {
    const plans = this.getData<MealPlan>('meal_plans');
    const filtered = plans.filter(plan => plan.id !== id);
    this.setData('meal_plans', filtered);
  }

  // Meals
  async getMeals(mealPlanId: string): Promise<MealSlot[]> {
    const meals = this.getData<MealSlot>('meals');
    return meals.filter(meal => meal.mealPlanId === mealPlanId);
  }

  async getMealsByDate(userId: string, date: string): Promise<MealSlot[]> {
    const meals = this.getData<MealSlot>('meals');
    const userPlans = await this.getMealPlans(userId);
    const userPlanIds = userPlans.map(plan => plan.id);
    
    return meals.filter(meal => 
      userPlanIds.includes(meal.mealPlanId) && meal.mealDate === date
    );
  }

  async createMeal(meal: Omit<MealSlot, 'id' | 'createdAt'>): Promise<MealSlot> {
    const meals = this.getData<MealSlot>('meals');
    const newMeal: MealSlot = {
      ...meal,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    meals.push(newMeal);
    this.setData('meals', meals);
    return newMeal;
  }

  async updateMeal(id: string, updates: Partial<MealSlot>): Promise<MealSlot> {
    const meals = this.getData<MealSlot>('meals');
    const index = meals.findIndex(meal => meal.id === id);
    if (index === -1) throw new Error('Meal not found');
    
    meals[index] = { ...meals[index], ...updates };
    this.setData('meals', meals);
    return meals[index];
  }

  async deleteMeal(id: string): Promise<void> {
    const meals = this.getData<MealSlot>('meals');
    const filtered = meals.filter(meal => meal.id !== id);
    this.setData('meals', filtered);
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return this.getData<Recipe>('recipes');
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    const recipes = this.getData<Recipe>('recipes');
    return recipes.find(recipe => recipe.id === id) || null;
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> {
    const recipes = this.getData<Recipe>('recipes');
    const newRecipe: Recipe = {
      ...recipe,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    recipes.push(newRecipe);
    this.setData('recipes', recipes);
    return newRecipe;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const recipes = this.getData<Recipe>('recipes');
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    recipes[index] = { ...recipes[index], ...updates };
    this.setData('recipes', recipes);
    return recipes[index];
  }

  async deleteRecipe(id: string): Promise<void> {
    const recipes = this.getData<Recipe>('recipes');
    const filtered = recipes.filter(recipe => recipe.id !== id);
    this.setData('recipes', filtered);
  }

  // Shopping Lists
  async getShoppingLists(userId: string): Promise<ShoppingList[]> {
    const lists = this.getData<ShoppingList>('shopping_lists');
    return lists.filter(list => list.userId === userId);
  }

  async createShoppingList(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList> {
    const lists = this.getData<ShoppingList>('shopping_lists');
    const newList: ShoppingList = {
      ...list,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    lists.push(newList);
    this.setData('shopping_lists', lists);
    return newList;
  }

  async updateShoppingList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList> {
    const lists = this.getData<ShoppingList>('shopping_lists');
    const index = lists.findIndex(list => list.id === id);
    if (index === -1) throw new Error('Shopping list not found');
    
    lists[index] = { ...lists[index], ...updates, updatedAt: new Date().toISOString() };
    this.setData('shopping_lists', lists);
    return lists[index];
  }

  async deleteShoppingList(id: string): Promise<void> {
    const lists = this.getData<ShoppingList>('shopping_lists');
    const filtered = lists.filter(list => list.id !== id);
    this.setData('shopping_lists', filtered);
  }

  // Inventory
  async getInventory(userId: string): Promise<InventoryItem[]> {
    const items = this.getData<InventoryItem>('inventory');
    return items.filter(item => item.userId === userId);
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const items = this.getData<InventoryItem>('inventory');
    const newItem: InventoryItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.setData('inventory', items);
    return newItem;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const items = this.getData<InventoryItem>('inventory');
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.setData('inventory', items);
    return items[index];
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const items = this.getData<InventoryItem>('inventory');
    const filtered = items.filter(item => item.id !== id);
    this.setData('inventory', filtered);
  }

  // Shopping Status Methods
  async getDailyShoppingStatus(userId: string, menuDate: string): Promise<DailyMenuShoppingStatus | null> {
    const statuses = this.getData<DailyMenuShoppingStatus>('daily_shopping_status');
    return statuses.find(status => status.userId === userId && status.menuDate === menuDate) || null;
  }

  async getDailyShoppingStatusById(id: string): Promise<DailyMenuShoppingStatus | null> {
    const statuses = this.getData<DailyMenuShoppingStatus>('daily_shopping_status');
    return statuses.find(status => status.id === id) || null;
  }

  async createDailyShoppingStatus(status: Omit<DailyMenuShoppingStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMenuShoppingStatus> {
    const statuses = this.getData<DailyMenuShoppingStatus>('daily_shopping_status');
    const newStatus: DailyMenuShoppingStatus = {
      ...status,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    statuses.push(newStatus);
    this.setData('daily_shopping_status', statuses);
    return newStatus;
  }

  async updateDailyShoppingStatus(id: string, updates: Partial<DailyMenuShoppingStatus>): Promise<DailyMenuShoppingStatus> {
    const statuses = this.getData<DailyMenuShoppingStatus>('daily_shopping_status');
    const index = statuses.findIndex(status => status.id === id);
    if (index === -1) throw new Error('Daily shopping status not found');

    statuses[index] = { ...statuses[index], ...updates, updatedAt: new Date().toISOString() };
    this.setData('daily_shopping_status', statuses);
    return statuses[index];
  }

  async deleteDailyShoppingStatus(id: string): Promise<void> {
    const statuses = this.getData<DailyMenuShoppingStatus>('daily_shopping_status');
    const filtered = statuses.filter(status => status.id !== id);
    this.setData('daily_shopping_status', filtered);
  }

  // Meal Shopping Items Methods
  async getMealShoppingItems(dailyShoppingStatusId: string): Promise<MealShoppingItem[]> {
    const items = this.getData<MealShoppingItem>('meal_shopping_items');
    return items.filter(item => item.dailyShoppingStatusId === dailyShoppingStatusId);
  }

  async createMealShoppingItem(item: Omit<MealShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealShoppingItem> {
    const items = this.getData<MealShoppingItem>('meal_shopping_items');
    const newItem: MealShoppingItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.setData('meal_shopping_items', items);
    return newItem;
  }

  async updateMealShoppingItem(id: string, updates: Partial<MealShoppingItem>): Promise<MealShoppingItem> {
    const items = this.getData<MealShoppingItem>('meal_shopping_items');
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Meal shopping item not found');

    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.setData('meal_shopping_items', items);
    return items[index];
  }

  async deleteMealShoppingItem(id: string): Promise<void> {
    const items = this.getData<MealShoppingItem>('meal_shopping_items');
    const filtered = items.filter(item => item.id !== id);
    this.setData('meal_shopping_items', filtered);
  }

  // Shopping Cost Statistics Methods
  async getShoppingCostStatistics(userId: string, periodType?: string, periodValue?: string): Promise<ShoppingCostStatistics[]> {
    const stats = this.getData<ShoppingCostStatistics>('shopping_cost_statistics');
    let filtered = stats.filter(stat => stat.userId === userId);

    if (periodType) {
      filtered = filtered.filter(stat => stat.periodType === periodType);
    }

    if (periodValue) {
      filtered = filtered.filter(stat => stat.periodValue === periodValue);
    }

    return filtered;
  }

  async createOrUpdateShoppingCostStatistics(stats: Omit<ShoppingCostStatistics, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingCostStatistics> {
    const allStats = this.getData<ShoppingCostStatistics>('shopping_cost_statistics');
    const existingIndex = allStats.findIndex(
      stat => stat.userId === stats.userId &&
              stat.periodType === stats.periodType &&
              stat.periodValue === stats.periodValue
    );

    if (existingIndex !== -1) {
      // Update existing
      allStats[existingIndex] = {
        ...allStats[existingIndex],
        ...stats,
        updatedAt: new Date().toISOString()
      };
      this.setData('shopping_cost_statistics', allStats);
      return allStats[existingIndex];
    } else {
      // Create new
      const newStats: ShoppingCostStatistics = {
        ...stats,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      allStats.push(newStats);
      this.setData('shopping_cost_statistics', allStats);
      return newStats;
    }
  }

  // Ingredient Price Suggestions Methods
  async getIngredientPriceSuggestions(ingredientName?: string, category?: string): Promise<IngredientPriceSuggestion[]> {
    const suggestions = this.getData<IngredientPriceSuggestion>('ingredient_price_suggestions');
    let filtered = suggestions;

    if (ingredientName) {
      filtered = filtered.filter(suggestion =>
        suggestion.ingredientName.toLowerCase().includes(ingredientName.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(suggestion => suggestion.category === category);
    }

    return filtered;
  }

  async createOrUpdateIngredientPriceSuggestion(suggestion: Omit<IngredientPriceSuggestion, 'id'>): Promise<IngredientPriceSuggestion> {
    const suggestions = this.getData<IngredientPriceSuggestion>('ingredient_price_suggestions');
    const existingIndex = suggestions.findIndex(
      s => s.ingredientName === suggestion.ingredientName &&
           s.category === suggestion.category &&
           s.unit === suggestion.unit &&
           s.region === suggestion.region
    );

    if (existingIndex !== -1) {
      // Update existing - recalculate average price
      const existing = suggestions[existingIndex];
      const totalSamples = existing.sampleCount + 1;
      const newAvgPrice = ((existing.avgPrice * existing.sampleCount) + suggestion.avgPrice) / totalSamples;

      suggestions[existingIndex] = {
        ...existing,
        avgPrice: Math.round(newAvgPrice),
        minPrice: Math.min(existing.minPrice || suggestion.avgPrice, suggestion.avgPrice),
        maxPrice: Math.max(existing.maxPrice || suggestion.avgPrice, suggestion.avgPrice),
        sampleCount: totalSamples,
        lastUpdated: new Date().toISOString()
      };
      this.setData('ingredient_price_suggestions', suggestions);
      return suggestions[existingIndex];
    } else {
      // Create new
      const newSuggestion: IngredientPriceSuggestion = {
        ...suggestion,
        id: this.generateId(),
        minPrice: suggestion.avgPrice,
        maxPrice: suggestion.avgPrice,
        sampleCount: 1,
        lastUpdated: new Date().toISOString()
      };
      suggestions.push(newSuggestion);
      this.setData('ingredient_price_suggestions', suggestions);
      return newSuggestion;
    }
  }
}

// Vietnamese Popular Recipes Data
export const vietnameseRecipes: Recipe[] = [
  {
    id: 'vn_001',
    name: 'Canh Chua Cá Lóc',
    description: 'Món canh chua truyền thống miền Nam với cá lóc tươi ngon',
    ingredients: ['Cá lóc', 'Me', 'Cà chua', 'Dứa', 'Đậu bắp', 'Giá đỗ', 'Ngò gai', 'Tỏi', 'Ớt'],
    instructions: ['Sơ chế cá lóc', 'Nấu nước dùng chua', 'Cho cá vào nấu', 'Nêm nếm gia vị', 'Thêm rau củ'],
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 180, protein: 22, carbs: 12, fat: 6 },
    tags: ['vietnamese', 'soup', 'fish', 'sour'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_002',
    name: 'Thịt Kho Tàu',
    description: 'Món thịt kho đậm đà hương vị, ăn kèm cơm trắng',
    ingredients: ['Thịt ba chỉ', 'Trứng', 'Nước dừa', 'Đường thốt nốt', 'Nước mắm', 'Tỏi', 'Hành tím'],
    instructions: ['Luộc thịt sơ qua', 'Kho thịt với nước dừa', 'Thêm trứng luộc', 'Nêm nếm vừa ăn'],
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 420, protein: 28, carbs: 8, fat: 32 },
    tags: ['vietnamese', 'pork', 'braised', 'comfort-food'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_003',
    name: 'Cá Kho Tộ',
    description: 'Cá kho niêu đất thơm ngon, đậm đà hương vị Nam Bộ',
    ingredients: ['Cá basa', 'Thịt ba chỉ', 'Nước dừa', 'Đường', 'Nước mắm', 'Tỏi', 'Ớt', 'Lá chuối'],
    instructions: ['Ướp cá với gia vị', 'Kho cá trong niêu đất', 'Thêm thịt ba chỉ', 'Nấu đến cạn nước'],
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 350, protein: 30, carbs: 10, fat: 22 },
    tags: ['vietnamese', 'fish', 'braised', 'traditional'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_004',
    name: 'Gà Kho Gừng',
    description: 'Gà kho gừng ấm bụng, bổ dưỡng cho cả gia đình',
    ingredients: ['Gà ta', 'Gừng', 'Nước mắm', 'Đường', 'Dầu ăn', 'Hành lá', 'Tiêu'],
    instructions: ['Chặt gà miếng vừa', 'Xào gà với gừng', 'Kho với nước mắm', 'Nêm nếm vừa ăn'],
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 380, protein: 35, carbs: 5, fat: 24 },
    tags: ['vietnamese', 'chicken', 'ginger', 'warming'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_005',
    name: 'Canh Khổ Qua Nhồi Thịt',
    description: 'Canh khổ qua nhồi thịt thanh mát, giải nhiệt mùa hè',
    ingredients: ['Khổ qua', 'Thịt heo xay', 'Hành tím', 'Tỏi', 'Nước mắm', 'Tiêu', 'Hành lá'],
    instructions: ['Chuẩn bị nhân thịt', 'Nhồi thịt vào khổ qua', 'Nấu canh trong nước trong', 'Nêm nếm vừa ăn'],
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 220, protein: 18, carbs: 8, fat: 14 },
    tags: ['vietnamese', 'soup', 'bitter-melon', 'cooling'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_006',
    name: 'Rau Muống Xào Tỏi',
    description: 'Rau muống xào tỏi giòn ngon, bổ sung vitamin',
    ingredients: ['Rau muống', 'Tỏi', 'Dầu ăn', 'Nước mắm', 'Đường', 'Ớt'],
    instructions: ['Nhặt rau muống sạch', 'Xào tỏi thom', 'Cho rau vào xào nhanh', 'Nêm nếm vừa ăn'],
    prepTime: 10,
    cookTime: 5,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 80, protein: 3, carbs: 8, fat: 4 },
    tags: ['vietnamese', 'vegetable', 'stir-fry', 'quick'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_007',
    name: 'Tôm Rim Me',
    description: 'Tôm rim me chua ngọt, ăn kèm cơm nóng',
    ingredients: ['Tôm sú', 'Me', 'Đường', 'Nước mắm', 'Tỏi', 'Ớt', 'Hành lá'],
    instructions: ['Sơ chế tôm sạch', 'Nấu nước me chua', 'Rim tôm với me', 'Nêm nếm chua ngọt'],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 280, protein: 25, carbs: 15, fat: 12 },
    tags: ['vietnamese', 'shrimp', 'tamarind', 'sweet-sour'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_008',
    name: 'Canh Cải Thịt Băm',
    description: 'Canh cải thịt băm thanh đạm, dễ ăn',
    ingredients: ['Cải ngọt', 'Thịt heo băm', 'Tỏi', 'Hành lá', 'Nước mắm', 'Tiêu'],
    instructions: ['Xào thịt băm thơm', 'Nấu nước dùng', 'Cho cải vào nấu', 'Nêm nếm vừa ăn'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 150, protein: 12, carbs: 6, fat: 8 },
    tags: ['vietnamese', 'soup', 'vegetable', 'light'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_009',
    name: 'Đậu Phụ Sốt Cà Chua',
    description: 'Đậu phụ sốt cà chua đậm đà, bổ sung protein thực vật',
    ingredients: ['Đậu phụ', 'Cà chua', 'Hành tây', 'Tỏi', 'Đường', 'Nước mắm', 'Dầu ăn'],
    instructions: ['Chiên đậu phụ vàng', 'Xào cà chua nhuyễn', 'Nấu sốt đậm đà', 'Trộn đều với đậu phụ'],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 200, protein: 15, carbs: 12, fat: 12 },
    tags: ['vietnamese', 'tofu', 'tomato', 'vegetarian'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_010',
    name: 'Cà Tím Nướng',
    description: 'Cà tím nướng mỡ hành thơm lừng, ăn kèm cơm',
    ingredients: ['Cà tím', 'Mỡ heo', 'Hành lá', 'Tỏi', 'Nước mắm', 'Đường', 'Tiêu'],
    instructions: ['Nướng cà tím chín mềm', 'Làm mỡ hành thơm', 'Rưới mỡ hành lên cà', 'Trang trí hành lá'],
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 120, protein: 3, carbs: 15, fat: 6 },
    tags: ['vietnamese', 'eggplant', 'grilled', 'aromatic'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_011',
    name: 'Thịt Heo Quay',
    description: 'Thịt heo quay da giòn, thịt thơm ngon',
    ingredients: ['Thịt heo ba chỉ', 'Muối', 'Ngũ vị hương', 'Tỏi', 'Gừng', 'Rượu trắng'],
    instructions: ['Ướp thịt với gia vị', 'Quay lò nhiệt độ cao', 'Để da giòn vàng', 'Thái miếng vừa ăn'],
    prepTime: 30,
    cookTime: 60,
    servings: 6,
    difficulty: 'hard',
    nutrition: { calories: 480, protein: 32, carbs: 2, fat: 38 },
    tags: ['vietnamese', 'pork', 'roasted', 'crispy'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_012',
    name: 'Canh Bí Đỏ Tôm Khô',
    description: 'Canh bí đỏ tôm khô ngọt thanh, bổ dưỡng',
    ingredients: ['Bí đỏ', 'Tôm khô', 'Thịt heo', 'Hành lá', 'Nước mắm', 'Tiêu'],
    instructions: ['Ngâm tôm khô mềm', 'Nấu nước dùng từ tôm', 'Cho bí đỏ vào nấu', 'Nêm nếm vừa ăn'],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 160, protein: 12, carbs: 18, fat: 4 },
    tags: ['vietnamese', 'soup', 'pumpkin', 'dried-shrimp'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_013',
    name: 'Gỏi Đu Đủ',
    description: 'Gỏi đu đủ chua cay, giải ngán ngày hè',
    ingredients: ['Đu đủ xanh', 'Cà rốt', 'Đậu phộng', 'Tôm khô', 'Ớt', 'Tỏi', 'Chanh', 'Nước mắm'],
    instructions: ['Bào sợi đu đủ', 'Giã gia vị', 'Trộn đều tất cả', 'Để ngấm gia vị'],
    prepTime: 20,
    cookTime: 0,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 120, protein: 6, carbs: 20, fat: 3 },
    tags: ['vietnamese', 'salad', 'papaya', 'refreshing'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_014',
    name: 'Cơm Âm Phủ',
    description: 'Cơm âm phủ đậm đà với nhiều loại thịt',
    ingredients: ['Gạo tẻ', 'Thịt heo', 'Gà', 'Lạp xưởng', 'Nấm hương', 'Hành tím', 'Nước mắm'],
    instructions: ['Nấu cơm với nước dùng', 'Xào thịt thơm', 'Trộn cơm với thịt', 'Nêm nếm đậm đà'],
    prepTime: 25,
    cookTime: 45,
    servings: 6,
    difficulty: 'medium',
    nutrition: { calories: 520, protein: 28, carbs: 65, fat: 18 },
    tags: ['vietnamese', 'rice', 'mixed', 'hearty'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_015',
    name: 'Bánh Xèo',
    description: 'Bánh xèo giòn rụm, nhân tôm thịt đậm đà',
    ingredients: ['Bột bánh xèo', 'Tôm', 'Thịt ba chỉ', 'Giá đỗ', 'Hành lá', 'Nghệ', 'Nước cốt dừa'],
    instructions: ['Pha bột bánh xèo', 'Xào nhân tôm thịt', 'Đổ bánh trong chảo', 'Ăn kèm rau sống'],
    prepTime: 30,
    cookTime: 40,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 380, protein: 20, carbs: 45, fat: 15 },
    tags: ['vietnamese', 'pancake', 'crispy', 'traditional'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_016',
    name: 'Chả Cá Lã Vọng',
    description: 'Chả cá Lã Vọng thơm nghệ, đặc sản Hà Nội',
    ingredients: ['Cá lăng', 'Nghệ', 'Thì là', 'Hành lá', 'Mắm tôm', 'Bún', 'Đậu phộng'],
    instructions: ['Ướp cá với nghệ', 'Nướng cá thơm', 'Xào với thì là', 'Ăn kèm bún và rau'],
    prepTime: 40,
    cookTime: 25,
    servings: 4,
    difficulty: 'hard',
    nutrition: { calories: 420, protein: 35, carbs: 25, fat: 20 },
    tags: ['vietnamese', 'fish', 'hanoi', 'specialty'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_017',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng, đậm đà hương vị cố đô',
    ingredients: ['Bún bò', 'Xương heo', 'Thịt bò', 'Chả cua', 'Sả', 'Ớt', 'Mắm ruốc', 'Hành lá'],
    instructions: ['Nấu nước dùng từ xương', 'Ướp thịt bò', 'Nấu bún trong nước dùng', 'Trang trí đầy đủ'],
    prepTime: 45,
    cookTime: 120,
    servings: 6,
    difficulty: 'hard',
    nutrition: { calories: 450, protein: 28, carbs: 55, fat: 12 },
    tags: ['vietnamese', 'noodle', 'spicy', 'hue'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_018',
    name: 'Gà Nướng Lá Chuối',
    description: 'Gà nướng lá chuối thơm lừng, đậm đà gia vị',
    ingredients: ['Gà ta', 'Lá chuối', 'Sả', 'Tỏi', 'Gừng', 'Nước mắm', 'Mật ong', 'Ngũ vị hương'],
    instructions: ['Ướp gà với gia vị', 'Gói gà trong lá chuối', 'Nướng than hồng', 'Nướng đều hai mặt'],
    prepTime: 60,
    cookTime: 45,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 420, protein: 38, carbs: 8, fat: 26 },
    tags: ['vietnamese', 'chicken', 'grilled', 'banana-leaf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_019',
    name: 'Canh Chua Tôm',
    description: 'Canh chua tôm thanh mát, kích thích vị giác',
    ingredients: ['Tôm sú', 'Cà chua', 'Dứa', 'Me', 'Đậu bắp', 'Ngò gai', 'Giá đỗ', 'Ớt'],
    instructions: ['Sơ chế tôm sạch', 'Nấu nước chua từ me', 'Cho tôm và rau vào', 'Nêm nếm chua ngọt'],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    nutrition: { calories: 180, protein: 20, carbs: 15, fat: 5 },
    tags: ['vietnamese', 'soup', 'shrimp', 'sour'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'vn_020',
    name: 'Thịt Nướng Lá Lốt',
    description: 'Thịt nướng lá lốt thơm ngon, ăn kèm bánh tráng',
    ingredients: ['Thịt heo xay', 'Lá lốt', 'Tỏi', 'Hành tím', 'Nước mắm', 'Đường', 'Tiêu', 'Dầu ăn'],
    instructions: ['Ướp thịt với gia vị', 'Gói thịt trong lá lốt', 'Nướng trên than hồng', 'Ăn kèm bánh tráng'],
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    nutrition: { calories: 320, protein: 25, carbs: 5, fat: 22 },
    tags: ['vietnamese', 'pork', 'grilled', 'wild-betel-leaf'],
    createdAt: new Date().toISOString()
  }
];

// Daily Menu Plans Data
export interface DailyMenuPlan {
  id: string;
  name: string;
  description: string;
  date: string;
  meals: {
    breakfast: string[]; // recipe IDs
    lunch: string[];
    dinner: string[];
  };
  totalCalories: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // total minutes
  tags: string[];
}

export const dailyMenuPlans: DailyMenuPlan[] = [
  {
    id: 'menu_001',
    name: 'Thực đơn gia đình truyền thống',
    description: 'Bữa ăn đầm ấm với các món quen thuộc',
    date: '2025-08-03',
    meals: {
      breakfast: ['vn_001'], // Canh Chua Cá Lóc
      lunch: ['vn_002', 'vn_006'], // Thịt Kho Tàu + Rau Muống Xào Tỏi
      dinner: ['vn_003', 'vn_008'] // Cá Kho Tộ + Canh Cải Thịt Băm
    },
    totalCalories: 1330,
    difficulty: 'medium',
    prepTime: 120,
    tags: ['traditional', 'family', 'comfort']
  },
  {
    id: 'menu_002',
    name: 'Thực đơn healthy giảm cân',
    description: 'Bữa ăn nhẹ nhàng, ít calo, nhiều rau xanh',
    date: '2025-08-04',
    meals: {
      breakfast: ['vn_019'], // Canh Chua Tôm
      lunch: ['vn_013', 'vn_009'], // Gỏi Đu Đủ + Đậu Phụ Sốt Cà Chua
      dinner: ['vn_010', 'vn_012'] // Cà Tím Nướng + Canh Bí Đỏ Tôm Khô
    },
    totalCalories: 880,
    difficulty: 'easy',
    prepTime: 90,
    tags: ['healthy', 'low-calorie', 'vegetarian-friendly']
  },
  {
    id: 'menu_003',
    name: 'Thực đơn cuối tuần đặc biệt',
    description: 'Những món ngon đặc sắc cho ngày nghỉ',
    date: '2025-08-05',
    meals: {
      breakfast: ['vn_015'], // Bánh Xèo
      lunch: ['vn_016'], // Chả Cá Lã Vọng
      dinner: ['vn_011', 'vn_005'] // Thịt Heo Quay + Canh Khổ Qua Nhồi Thịt
    },
    totalCalories: 1420,
    difficulty: 'hard',
    prepTime: 180,
    tags: ['weekend', 'special', 'gourmet']
  },
  {
    id: 'menu_004',
    name: 'Thực đơn nhanh gọn cho người bận',
    description: 'Các món dễ làm, tiết kiệm thời gian',
    date: '2025-08-06',
    meals: {
      breakfast: ['vn_008'], // Canh Cải Thịt Băm
      lunch: ['vn_006', 'vn_007'], // Rau Muống Xào Tỏi + Tôm Rim Me
      dinner: ['vn_004', 'vn_009'] // Gà Kho Gừng + Đậu Phụ Sốt Cà Chua
    },
    totalCalories: 1040,
    difficulty: 'easy',
    prepTime: 75,
    tags: ['quick', 'busy', 'simple']
  },
  {
    id: 'menu_005',
    name: 'Thực đơn miền Nam đậm đà',
    description: 'Hương vị đặc trưng của ẩm thực miền Nam',
    date: '2025-08-07',
    meals: {
      breakfast: ['vn_001'], // Canh Chua Cá Lóc
      lunch: ['vn_003', 'vn_013'], // Cá Kho Tộ + Gỏi Đu Đủ
      dinner: ['vn_020', 'vn_012'] // Thịt Nướng Lá Lốt + Canh Bí Đỏ Tôm Khô
    },
    totalCalories: 1050,
    difficulty: 'medium',
    prepTime: 110,
    tags: ['southern', 'authentic', 'flavorful']
  },
  {
    id: 'menu_006',
    name: 'Thực đơn miền Bắc truyền thống',
    description: 'Hương vị đặc trưng Hà Nội cổ kính',
    date: '2025-08-08',
    meals: {
      breakfast: ['vn_017'], // Bún Bò Huế
      lunch: ['vn_016'], // Chả Cá Lã Vọng
      dinner: ['vn_018', 'vn_008'] // Gà Nướng Lá Chuối + Canh Cải Thịt Băm
    },
    totalCalories: 1290,
    difficulty: 'hard',
    prepTime: 200,
    tags: ['northern', 'hanoi', 'traditional']
  },
  {
    id: 'menu_007',
    name: 'Thực đơn chay thanh đạm',
    description: 'Bữa ăn chay bổ dưỡng, thanh tịnh',
    date: '2025-08-09',
    meals: {
      breakfast: ['vn_012'], // Canh Bí Đỏ Tôm Khô
      lunch: ['vn_009', 'vn_010'], // Đậu Phụ Sốt Cà Chua + Cà Tím Nướng
      dinner: ['vn_013', 'vn_006'] // Gỏi Đu Đủ + Rau Muống Xào Tỏi
    },
    totalCalories: 720,
    difficulty: 'easy',
    prepTime: 80,
    tags: ['vegetarian', 'light', 'healthy']
  },
  {
    id: 'menu_008',
    name: 'Thực đơn tiệc tùng',
    description: 'Những món ngon cho bữa tiệc gia đình',
    date: '2025-08-10',
    meals: {
      breakfast: ['vn_015'], // Bánh Xèo
      lunch: ['vn_011', 'vn_020'], // Thịt Heo Quay + Thịt Nướng Lá Lốt
      dinner: ['vn_018', 'vn_016'] // Gà Nướng Lá Chuối + Chả Cá Lã Vọng
    },
    totalCalories: 1640,
    difficulty: 'hard',
    prepTime: 240,
    tags: ['party', 'festive', 'special-occasion']
  },
  {
    id: 'menu_009',
    name: 'Thực đơn mùa hè mát mẻ',
    description: 'Các món thanh mát, giải nhiệt mùa hè',
    date: '2025-08-11',
    meals: {
      breakfast: ['vn_019'], // Canh Chua Tôm
      lunch: ['vn_013', 'vn_005'], // Gỏi Đu Đủ + Canh Khổ Qua Nhồi Thịt
      dinner: ['vn_010', 'vn_012'] // Cà Tím Nướng + Canh Bí Đỏ Tôm Khô
    },
    totalCalories: 880,
    difficulty: 'medium',
    prepTime: 95,
    tags: ['summer', 'cooling', 'refreshing']
  },
  {
    id: 'menu_010',
    name: 'Thực đơn mùa đông ấm áp',
    description: 'Những món ấm bụng cho ngày lạnh',
    date: '2025-08-12',
    meals: {
      breakfast: ['vn_017'], // Bún Bò Huế
      lunch: ['vn_002', 'vn_004'], // Thịt Kho Tàu + Gà Kho Gừng
      dinner: ['vn_003', 'vn_001'] // Cá Kho Tộ + Canh Chua Cá Lóc
    },
    totalCalories: 1430,
    difficulty: 'medium',
    prepTime: 150,
    tags: ['winter', 'warming', 'hearty']
  },
  {
    id: 'menu_011',
    name: 'Thực đơn protein cao',
    description: 'Bữa ăn giàu protein cho người tập gym',
    date: '2025-08-13',
    meals: {
      breakfast: ['vn_018'], // Gà Nướng Lá Chuối
      lunch: ['vn_011', 'vn_007'], // Thịt Heo Quay + Tôm Rim Me
      dinner: ['vn_016', 'vn_019'] // Chả Cá Lã Vọng + Canh Chua Tôm
    },
    totalCalories: 1480,
    difficulty: 'hard',
    prepTime: 180,
    tags: ['high-protein', 'fitness', 'muscle-building']
  },
  {
    id: 'menu_012',
    name: 'Thực đơn kinh tế tiết kiệm',
    description: 'Bữa ăn ngon bổ rẻ cho sinh viên',
    date: '2025-08-14',
    meals: {
      breakfast: ['vn_008'], // Canh Cải Thịt Băm
      lunch: ['vn_009', 'vn_006'], // Đậu Phụ Sốt Cà Chua + Rau Muống Xào Tỏi
      dinner: ['vn_004', 'vn_012'] // Gà Kho Gừng + Canh Bí Đỏ Tôm Khô
    },
    totalCalories: 920,
    difficulty: 'easy',
    prepTime: 85,
    tags: ['budget', 'student', 'economical']
  },
  {
    id: 'menu_013',
    name: 'Thực đơn cho trẻ em',
    description: 'Những món dễ ăn, bổ dưỡng cho bé',
    date: '2025-08-15',
    meals: {
      breakfast: ['vn_012'], // Canh Bí Đỏ Tôm Khô
      lunch: ['vn_002', 'vn_008'], // Thịt Kho Tàu + Canh Cải Thịt Băm
      dinner: ['vn_007', 'vn_009'] // Tôm Rim Me + Đậu Phụ Sốt Cà Chua
    },
    totalCalories: 1050,
    difficulty: 'easy',
    prepTime: 100,
    tags: ['kids', 'nutritious', 'mild-flavor']
  },
  {
    id: 'menu_014',
    name: 'Thực đơn người cao tuổi',
    description: 'Bữa ăn mềm, dễ tiêu hóa cho người lớn tuổi',
    date: '2025-08-16',
    meals: {
      breakfast: ['vn_001'], // Canh Chua Cá Lóc
      lunch: ['vn_012', 'vn_009'], // Canh Bí Đỏ Tôm Khô + Đậu Phụ Sốt Cà Chua
      dinner: ['vn_008', 'vn_010'] // Canh Cải Thịt Băm + Cà Tím Nướng
    },
    totalCalories: 860,
    difficulty: 'easy',
    prepTime: 90,
    tags: ['elderly', 'soft', 'digestible']
  },
  {
    id: 'menu_015',
    name: 'Thực đơn cơm văn phòng',
    description: 'Bữa trưa nhanh gọn cho dân công sở',
    date: '2025-08-17',
    meals: {
      breakfast: ['vn_019'], // Canh Chua Tôm
      lunch: ['vn_014'], // Cơm Âm Phủ
      dinner: ['vn_006', 'vn_007'] // Rau Muống Xào Tỏi + Tôm Rim Me
    },
    totalCalories: 1020,
    difficulty: 'medium',
    prepTime: 95,
    tags: ['office', 'lunch-box', 'convenient']
  },
  {
    id: 'menu_016',
    name: 'Thực đơn đãi khách',
    description: 'Bữa ăn trang trọng để đãi khách quý',
    date: '2025-08-18',
    meals: {
      breakfast: ['vn_015'], // Bánh Xèo
      lunch: ['vn_016', 'vn_020'], // Chả Cá Lã Vọng + Thịt Nướng Lá Lốt
      dinner: ['vn_011', 'vn_018'] // Thịt Heo Quay + Gà Nướng Lá Chuối
    },
    totalCalories: 1640,
    difficulty: 'hard',
    prepTime: 220,
    tags: ['guests', 'formal', 'impressive']
  },
  {
    id: 'menu_017',
    name: 'Thực đơn cân bằng dinh dưỡng',
    description: 'Bữa ăn cân bằng đầy đủ chất dinh dưỡng',
    date: '2025-08-19',
    meals: {
      breakfast: ['vn_017'], // Bún Bò Huế
      lunch: ['vn_003', 'vn_013'], // Cá Kho Tộ + Gỏi Đu Đủ
      dinner: ['vn_018', 'vn_012'] // Gà Nướng Lá Chuối + Canh Bí Đỏ Tôm Khô
    },
    totalCalories: 1290,
    difficulty: 'medium',
    prepTime: 140,
    tags: ['balanced', 'nutritious', 'complete']
  },
  {
    id: 'menu_018',
    name: 'Thực đơn món nướng BBQ',
    description: 'Tiệc nướng ngoài trời cùng gia đình',
    date: '2025-08-20',
    meals: {
      breakfast: ['vn_013'], // Gỏi Đu Đủ
      lunch: ['vn_018', 'vn_020'], // Gà Nướng Lá Chuối + Thịt Nướng Lá Lốt
      dinner: ['vn_010', 'vn_019'] // Cà Tím Nướng + Canh Chua Tôm
    },
    totalCalories: 1160,
    difficulty: 'medium',
    prepTime: 120,
    tags: ['bbq', 'grilled', 'outdoor']
  },
  {
    id: 'menu_019',
    name: 'Thực đơn detox thanh lọc',
    description: 'Bữa ăn thanh lọc cơ thể, giảm độc tố',
    date: '2025-08-21',
    meals: {
      breakfast: ['vn_012'], // Canh Bí Đỏ Tôm Khô
      lunch: ['vn_013', 'vn_006'], // Gỏi Đu Đủ + Rau Muống Xào Tỏi
      dinner: ['vn_005', 'vn_010'] // Canh Khổ Qua Nhồi Thịt + Cà Tím Nướng
    },
    totalCalories: 760,
    difficulty: 'easy',
    prepTime: 85,
    tags: ['detox', 'cleansing', 'light']
  },
  {
    id: 'menu_020',
    name: 'Thực đơn cuối tháng tiết kiệm',
    description: 'Bữa ăn ngon miệng với ngân sách eo hẹp',
    date: '2025-08-22',
    meals: {
      breakfast: ['vn_008'], // Canh Cải Thịt Băm
      lunch: ['vn_009', 'vn_006'], // Đậu Phụ Sốt Cà Chua + Rau Muống Xào Tỏi
      dinner: ['vn_012', 'vn_004'] // Canh Bí Đỏ Tôm Khô + Gà Kho Gừng
    },
    totalCalories: 920,
    difficulty: 'easy',
    prepTime: 90,
    tags: ['budget', 'end-of-month', 'affordable']
  }
];

// Kitchen Service - Main API
export class KitchenService {
  private adapter: DatabaseAdapter;

  constructor(adapter?: DatabaseAdapter) {
    this.adapter = adapter || AdapterFactory.getAdapterFromEnv();
  }

  // Method to switch adapter (useful for testing different backends)
  setAdapter(adapter: DatabaseAdapter) {
    this.adapter = adapter;
  }

  // High-level business logic methods
  async getTodayMeals(userId: string): Promise<MealSlot[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.adapter.getMealsByDate(userId, today);
  }

  async generateShoppingListFromMealPlan(userId: string, mealPlanId: string): Promise<ShoppingList> {
    const meals = await this.adapter.getMeals(mealPlanId);
    const items: ShoppingItem[] = [];
    
    // Aggregate ingredients from all meals
    for (const meal of meals) {
      if (meal.recipeId) {
        const recipe = await this.adapter.getRecipe(meal.recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            const existingItem = items.find(item => item.name === ingredient);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              items.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: ingredient,
                quantity: 1,
                unit: 'portion',
                category: 'ingredient',
                completed: false
              });
            }
          });
        }
      }
    }

    return this.adapter.createShoppingList({
      userId,
      mealPlanId,
      items,
      completed: false
    });
  }

  async getExpiringItems(userId: string, days: number = 3): Promise<InventoryItem[]> {
    const inventory = await this.adapter.getInventory(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return inventory.filter(item => {
      if (!item.expiryDate) return false;
      return new Date(item.expiryDate) <= cutoffDate;
    });
  }

  // High-level Shopping Status Business Logic
  async getTodayMenuStatus(userId: string): Promise<TodayMenuStatus> {
    console.log('🔄 KitchenService: Getting today menu status for user:', userId);
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 KitchenService: Today date:', today);

    const todayMeals = await this.getTodayMeals(userId);
    console.log('🍽️ KitchenService: Today meals count:', todayMeals.length);

    console.log('🛒 KitchenService: Getting daily shopping status...');
    const shoppingStatus = await this.getDailyShoppingStatus(userId, today);
    console.log('🛒 KitchenService: Shopping status result:', shoppingStatus);

    // Import getCurrentMealTime from utils
    const { getCurrentMealTime } = await import('@/utils/vndPriceUtils');
    const currentMealTime = getCurrentMealTime();

    if (todayMeals.length === 0) {
      return {
        hasMenu: false,
        currentMealTime,
        nextAction: 'create_menu'
      };
    }

    if (!shoppingStatus || shoppingStatus.status === 'not_purchased') {
      return {
        hasMenu: true,
        currentMealTime,
        shoppingStatus,
        nextAction: 'go_shopping'
      };
    }

    if (shoppingStatus.status === 'purchased') {
      return {
        hasMenu: true,
        currentMealTime,
        shoppingStatus,
        nextAction: 'start_cooking'
      };
    }

    return {
      hasMenu: true,
      currentMealTime,
      shoppingStatus,
      nextAction: 'go_shopping'
    };
  }

  async createShoppingListFromTodayMenu(userId: string): Promise<{ shoppingStatus: DailyMenuShoppingStatus; items: MealShoppingItem[] }> {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = await this.getTodayMeals(userId);

    // Create or get existing shopping status
    let shoppingStatus = await this.getDailyShoppingStatus(userId, today);
    if (!shoppingStatus) {
      shoppingStatus = await this.createDailyShoppingStatus({
        userId,
        menuDate: today,
        status: 'not_purchased',
        totalEstimatedCost: 0,
        totalActualCost: 0
      });
    }

    // Generate shopping items from meals
    const items: MealShoppingItem[] = [];
    let totalEstimatedCost = 0;

    for (const meal of todayMeals) {
      if (meal.recipeId) {
        const recipe = await this.getRecipe(meal.recipeId);
        if (recipe) {
          for (const ingredient of recipe.ingredients) {
            // Get price suggestion if available
            const priceSuggestions = await this.getIngredientPriceSuggestions(ingredient);
            const estimatedPrice = priceSuggestions.length > 0 ? priceSuggestions[0].avgPrice : 10000; // Default 10k VND

            const item = await this.createMealShoppingItem({
              dailyShoppingStatusId: shoppingStatus.id,
              mealType: meal.mealType,
              recipeId: meal.recipeId,
              recipeName: recipe.name,
              ingredientName: ingredient,
              quantity: 1,
              unit: 'portion',
              category: this.categorizeIngredient(ingredient),
              estimatedPrice,
              isPurchased: false
            });

            items.push(item);
            totalEstimatedCost += estimatedPrice;
          }
        }
      }
    }

    // Update shopping status with total estimated cost
    shoppingStatus = await this.updateDailyShoppingStatus(shoppingStatus.id, {
      totalEstimatedCost
    });

    return { shoppingStatus, items };
  }

  async updateShoppingItemPrice(itemId: string, actualPrice: number): Promise<MealShoppingItem> {
    const { validateVNDPrice } = await import('@/utils/vndPriceUtils');
    const validation = validateVNDPrice(actualPrice.toString());

    if (!validation.isValid) {
      throw new Error('Invalid price format');
    }

    const updatedItem = await this.updateMealShoppingItem(itemId, {
      actualPrice: validation.numericValue,
      isPurchased: true,
      purchasedAt: new Date().toISOString()
    });

    // Update price suggestion
    await this.createOrUpdateIngredientPriceSuggestion({
      ingredientName: updatedItem.ingredientName,
      category: updatedItem.category,
      unit: updatedItem.unit,
      avgPrice: validation.numericValue,
      region: 'vietnam'
    });

    // Recalculate shopping status
    await this.recalculateShoppingStatus(updatedItem.dailyShoppingStatusId);

    return updatedItem;
  }

  private async recalculateShoppingStatus(dailyShoppingStatusId: string): Promise<void> {
    const items = await this.getMealShoppingItems(dailyShoppingStatusId);
    const totalItems = items.length;
    const purchasedItems = items.filter(item => item.isPurchased).length;
    const totalActualCost = items.reduce((sum, item) => sum + (item.actualPrice || 0), 0);

    let status: 'not_purchased' | 'purchased' | 'partially_purchased';
    if (purchasedItems === 0) {
      status = 'not_purchased';
    } else if (purchasedItems === totalItems) {
      status = 'purchased';
    } else {
      status = 'partially_purchased';
    }

    await this.updateDailyShoppingStatus(dailyShoppingStatusId, {
      status,
      totalActualCost,
      shoppingCompletedAt: status === 'purchased' ? new Date().toISOString() : undefined
    });

    // Update statistics
    await this.updateShoppingStatistics(dailyShoppingStatusId);
  }

  private async updateShoppingStatistics(dailyShoppingStatusId: string): Promise<void> {
    try {
      // Get shopping status and items
      const items = await this.getMealShoppingItems(dailyShoppingStatusId);
      if (items.length === 0) return;

      const firstItem = items[0];
      const shoppingStatus = await this.adapter.getDailyShoppingStatusById(firstItem.dailyShoppingStatusId);
      if (!shoppingStatus) return;

      const { formatPeriodValue, calculateCategoryBreakdown } = await import('@/utils/vndPriceUtils');
      const today = new Date();

      // Calculate statistics for different periods
      const periods: Array<'daily' | 'weekly' | 'monthly' | 'yearly'> = ['daily', 'weekly', 'monthly', 'yearly'];

      for (const periodType of periods) {
        const periodValue = formatPeriodValue(today, periodType);

        // Get existing statistics for this period
        const existingStats = await this.getShoppingCostStatistics(shoppingStatus.userId, periodType, periodValue);

        // Calculate new statistics
        const totalCost = shoppingStatus.totalActualCost || 0;
        const mealCount = this.countUniqueMeals(items);
        const avgCostPerMeal = mealCount > 0 ? totalCost / mealCount : 0;
        const categoryBreakdown = calculateCategoryBreakdown(items, true);

        if (existingStats.length > 0) {
          // Update existing statistics
          const existing = existingStats[0];
          await this.createOrUpdateShoppingCostStatistics({
            userId: shoppingStatus.userId,
            periodType,
            periodValue,
            totalCost: existing.totalCost + totalCost,
            mealCount: existing.mealCount + mealCount,
            avgCostPerMeal: (existing.totalCost + totalCost) / (existing.mealCount + mealCount),
            categoryBreakdown: this.mergeCategoryBreakdowns(existing.categoryBreakdown, categoryBreakdown)
          });
        } else {
          // Create new statistics
          await this.createOrUpdateShoppingCostStatistics({
            userId: shoppingStatus.userId,
            periodType,
            periodValue,
            totalCost,
            mealCount,
            avgCostPerMeal,
            categoryBreakdown
          });
        }
      }
    } catch (error) {
      console.error('Error updating shopping statistics:', error);
    }
  }

  private countUniqueMeals(items: MealShoppingItem[]): number {
    const uniqueMeals = new Set();
    items.forEach(item => {
      uniqueMeals.add(`${item.mealType}-${item.recipeId}`);
    });
    return uniqueMeals.size;
  }

  private mergeCategoryBreakdowns(existing: Record<string, number>, newBreakdown: Record<string, number>): Record<string, number> {
    const merged = { ...existing };
    Object.entries(newBreakdown).forEach(([category, cost]) => {
      merged[category] = (merged[category] || 0) + cost;
    });
    return merged;
  }

  private categorizeIngredient(ingredient: string): string {
    const categories: Record<string, string[]> = {
      'rau củ': ['rau', 'củ', 'cải', 'cà chua', 'hành', 'tỏi', 'ớt', 'gừng', 'lá'],
      'thịt': ['thịt', 'heo', 'bò', 'gà', 'vịt'],
      'hải sản': ['cá', 'tôm', 'cua', 'mực', 'nghêu', 'sò'],
      'gia vị': ['muối', 'đường', 'nước mắm', 'dầu', 'giấm', 'tiêu', 'me'],
      'ngũ cốc': ['gạo', 'bún', 'miến', 'bánh', 'bột'],
      'đậu': ['đậu', 'đỗ', 'phụ']
    };

    const lowerIngredient = ingredient.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerIngredient.includes(keyword))) {
        return category;
      }
    }

    return 'khác';
  }

  // Delegate to adapter
  getMealPlans = (userId: string) => this.adapter.getMealPlans(userId);
  createMealPlan = (mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createMealPlan(mealPlan);
  updateMealPlan = (id: string, updates: Partial<MealPlan>) => this.adapter.updateMealPlan(id, updates);
  deleteMealPlan = (id: string) => this.adapter.deleteMealPlan(id);

  getMeals = (mealPlanId: string) => this.adapter.getMeals(mealPlanId);
  createMeal = (meal: Omit<MealSlot, 'id' | 'createdAt'>) => this.adapter.createMeal(meal);
  updateMeal = (id: string, updates: Partial<MealSlot>) => this.adapter.updateMeal(id, updates);
  deleteMeal = (id: string) => this.adapter.deleteMeal(id);

  getRecipes = () => this.adapter.getRecipes();
  getRecipe = (id: string) => this.adapter.getRecipe(id);
  createRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => this.adapter.createRecipe(recipe);
  updateRecipe = (id: string, updates: Partial<Recipe>) => this.adapter.updateRecipe(id, updates);
  deleteRecipe = (id: string) => this.adapter.deleteRecipe(id);

  getShoppingLists = (userId: string) => this.adapter.getShoppingLists(userId);
  createShoppingList = (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createShoppingList(list);
  updateShoppingList = (id: string, updates: Partial<ShoppingList>) => this.adapter.updateShoppingList(id, updates);
  deleteShoppingList = (id: string) => this.adapter.deleteShoppingList(id);

  getInventory = (userId: string) => this.adapter.getInventory(userId);
  createInventoryItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createInventoryItem(item);
  updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => this.adapter.updateInventoryItem(id, updates);
  deleteInventoryItem = (id: string) => this.adapter.deleteInventoryItem(id);

  // Shopping Status Methods
  getDailyShoppingStatus = (userId: string, menuDate: string) => this.adapter.getDailyShoppingStatus(userId, menuDate);
  getDailyShoppingStatusById = (id: string) => this.adapter.getDailyShoppingStatusById(id);
  createDailyShoppingStatus = (status: Omit<DailyMenuShoppingStatus, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createDailyShoppingStatus(status);
  updateDailyShoppingStatus = (id: string, updates: Partial<DailyMenuShoppingStatus>) => this.adapter.updateDailyShoppingStatus(id, updates);
  deleteDailyShoppingStatus = (id: string) => this.adapter.deleteDailyShoppingStatus(id);

  getMealShoppingItems = (dailyShoppingStatusId: string) => this.adapter.getMealShoppingItems(dailyShoppingStatusId);
  createMealShoppingItem = (item: Omit<MealShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createMealShoppingItem(item);
  updateMealShoppingItem = (id: string, updates: Partial<MealShoppingItem>) => this.adapter.updateMealShoppingItem(id, updates);
  deleteMealShoppingItem = (id: string) => this.adapter.deleteMealShoppingItem(id);

  getShoppingCostStatistics = (userId: string, periodType?: string, periodValue?: string) => this.adapter.getShoppingCostStatistics(userId, periodType, periodValue);
  createOrUpdateShoppingCostStatistics = (stats: Omit<ShoppingCostStatistics, 'id' | 'createdAt' | 'updatedAt'>) => this.adapter.createOrUpdateShoppingCostStatistics(stats);

  getIngredientPriceSuggestions = (ingredientName?: string, category?: string) => this.adapter.getIngredientPriceSuggestions(ingredientName, category);
  createOrUpdateIngredientPriceSuggestion = (suggestion: Omit<IngredientPriceSuggestion, 'id'>) => this.adapter.createOrUpdateIngredientPriceSuggestion(suggestion);

  // Daily Menu Plans
  getDailyMenuPlans = (): DailyMenuPlan[] => {
    const stored = localStorage.getItem('kitchen_daily_menus');
    if (stored) {
      return JSON.parse(stored);
    }
    return dailyMenuPlans; // fallback to static data
  };
}

// Export singleton instance with environment-based adapter
const defaultAdapter = AdapterFactory.getAdapterFromEnv();
export const kitchenService = new KitchenService(defaultAdapter);
