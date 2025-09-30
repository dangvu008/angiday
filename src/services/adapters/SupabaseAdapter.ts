// @ts-nocheck
import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient, supabaseHelpers } from '../../config/supabase';
import {
  DatabaseAdapter,
  Recipe,
  MealPlan,
  ShoppingList,
  ShoppingItem,
  DailyMenuShoppingStatus,
  MealShoppingItem
} from '../interfaces/DatabaseAdapter';

// Helper functions for converting between snake_case (database) and camelCase (TypeScript)
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const convertKeysToCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase);
  if (typeof obj !== 'object') return obj;

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    converted[camelKey] = convertKeysToCamelCase(value);
  }
  return converted;
};

const convertKeysToSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnakeCase);
  if (typeof obj !== 'object') return obj;

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    converted[snakeKey] = convertKeysToSnakeCase(value);
  }
  return converted;
};

export class SupabaseAdapter implements DatabaseAdapter {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = getSupabaseClient();
    console.log('🔗 SupabaseAdapter initialized with secure config');
  }

  // Test connection on initialization
  async initialize(): Promise<boolean> {
    try {
      const isConnected = await supabaseHelpers.testConnection();
      if (isConnected) {
        console.log('✅ SupabaseAdapter connection verified');
      } else {
        console.warn('⚠️ SupabaseAdapter connection test failed');
      }
      return isConnected;
    } catch (error) {
      console.error('❌ SupabaseAdapter initialization error:', error);
      return false;
    }
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertKeysToCamelCase);
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data ? convertKeysToCamelCase(data) : null;
  }

  async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    // Convert camelCase to snake_case for database
    const dbRecipe = convertKeysToSnakeCase({
      ...recipe,
      created_at: new Date().toISOString()
    });

    const { data, error } = await this.supabase
      .from('recipes')
      .insert([dbRecipe])
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    // Convert camelCase to snake_case for database
    const dbUpdates = convertKeysToSnakeCase(updates);

    const { data, error } = await this.supabase
      .from('recipes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async deleteRecipe(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('recipes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Meal Plans
  async getMealPlans(userId: string): Promise<MealPlan[]> {
    const { data, error } = await this.supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertKeysToCamelCase);
  }

  async getMealPlan(id: string): Promise<MealPlan | null> {
    const { data, error } = await this.supabase
      .from('meal_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? convertKeysToCamelCase(data) : null;
  }

  async createMealPlan(mealPlan: Omit<MealPlan, 'id'>): Promise<MealPlan> {
    // Convert camelCase to snake_case for database
    const dbMealPlan = convertKeysToSnakeCase({
      ...mealPlan,
      created_at: new Date().toISOString()
    });

    const { data, error } = await this.supabase
      .from('meal_plans')
      .insert([dbMealPlan])
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    // Convert camelCase to snake_case for database
    const dbUpdates = convertKeysToSnakeCase(updates);

    const { data, error } = await this.supabase
      .from('meal_plans')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async deleteMealPlan(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Meals
  async getMeals(mealPlanId: string): Promise<MealSlot[]> {
    const { data, error } = await this.supabase
      .from('meals')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('meal_plan_id', mealPlanId)
      .order('meal_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(convertKeysToCamelCase);
  }

  async getMeal(id: string): Promise<MealSlot | null> {
    const { data, error } = await this.supabase
      .from('meals')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? convertKeysToCamelCase(data) : null;
  }

  async getMealsByDate(userId: string, date: string): Promise<MealSlot[]> {
    // First get user's meal plans
    const mealPlans = await this.getMealPlans(userId);
    const mealPlanIds = mealPlans.map(plan => plan.id);

    if (mealPlanIds.length === 0) return [];

    const { data, error } = await this.supabase
      .from('meals')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .in('meal_plan_id', mealPlanIds)
      .eq('meal_date', date)
      .order('meal_type');

    if (error) throw error;
    return (data || []).map(convertKeysToCamelCase);
  }

  async createMeal(meal: Omit<MealSlot, 'id' | 'createdAt'>): Promise<MealSlot> {
    // Convert camelCase to snake_case for database
    const dbMeal = convertKeysToSnakeCase({
      ...meal,
      created_at: new Date().toISOString()
    });

    const { data, error } = await this.supabase
      .from('meals')
      .insert([dbMeal])
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async updateMeal(id: string, updates: Partial<MealSlot>): Promise<MealSlot> {
    // Convert camelCase to snake_case for database
    const dbUpdates = convertKeysToSnakeCase(updates);

    const { data, error } = await this.supabase
      .from('meals')
      .update(dbUpdates)
      .eq('id', id)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async deleteMeal(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('meals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Shopping Lists
  async getShoppingLists(): Promise<ShoppingList[]> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .select(`
        *,
        items:shopping_items(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getShoppingList(id: string): Promise<ShoppingList | null> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .select(`
        *,
        items:shopping_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createShoppingList(shoppingList: Omit<ShoppingList, 'id'>): Promise<ShoppingList> {
    const { items, ...listData } = shoppingList;
    
    // Create shopping list
    const { data: list, error: listError } = await this.supabase
      .from('shopping_lists')
      .insert([{
        ...listData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (listError) throw listError;

    // Create shopping items
    if (items && items.length > 0) {
      const { error: itemsError } = await this.supabase
        .from('shopping_items')
        .insert(
          items.map(item => ({
            ...item,
            shopping_list_id: list.id
          }))
        );
      
      if (itemsError) throw itemsError;
    }

    // Return complete shopping list
    return this.getShoppingList(list.id) as Promise<ShoppingList>;
  }

  async updateShoppingList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        items:shopping_items(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteShoppingList(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async updateShoppingItem(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
    const { data, error } = await this.supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    const { data, error } = await this.supabase
      .from('inventory')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getInventoryItem(id: string): Promise<InventoryItem | null> {
    const { data, error } = await this.supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const { data, error } = await this.supabase
      .from('inventory')
      .insert([{
        ...item,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const { data, error } = await this.supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Daily Shopping Status Methods
  async getDailyShoppingStatus(userId: string, menuDate: string): Promise<DailyMenuShoppingStatus | null> {
    console.log('🔄 SupabaseAdapter: getDailyShoppingStatus called with:', { userId, menuDate });
    try {
      console.log('📡 SupabaseAdapter: Making Supabase query...');
      console.log('📡 SupabaseAdapter: Supabase URL:', this.supabase.supabaseUrl);
      console.log('📡 SupabaseAdapter: Table name: daily_menu_shopping_status');

      // Use limit(1) instead of single() to avoid PGRST116 error in console
      const { data, error } = await this.supabase
        .from('daily_menu_shopping_status')
        .select('*')
        .eq('user_id', userId)
        .eq('menu_date', menuDate)
        .limit(1);

      console.log('📡 SupabaseAdapter: Query result:', { data, error });

      if (error) {
        console.error('❌ SupabaseAdapter: Query failed with error:', error);

        if (error.code === '42P01') {
          // Table doesn't exist, fallback to localStorage
          console.warn('daily_menu_shopping_status table not found, using localStorage fallback');
          return null;
        }

        throw error;
      }

      // Return first record if found, null if no records
      const record = data && data.length > 0 ? data[0] : null;
      console.log('📝 SupabaseAdapter: Found record:', record ? 'Yes' : 'No');

      return record ? convertKeysToCamelCase(record) : null;
    } catch (error) {
      console.warn('Error accessing daily_menu_shopping_status, using localStorage fallback:', error);
      return null;
    }
  }

  async getDailyShoppingStatusById(id: string): Promise<DailyMenuShoppingStatus | null> {
    try {
      // Use limit(1) instead of single() to avoid PGRST116 error in console
      const { data, error } = await this.supabase
        .from('daily_menu_shopping_status')
        .select('*')
        .eq('id', id)
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, fallback to localStorage
          console.warn('daily_menu_shopping_status table not found, using localStorage fallback');
          return null;
        }
        throw error;
      }

      // Return first record if found, null if no records
      const record = data && data.length > 0 ? data[0] : null;
      return record ? convertKeysToCamelCase(record) : null;
    } catch (error) {
      console.warn('Error accessing daily_menu_shopping_status, using localStorage fallback:', error);
      return null;
    }
  }

  async createDailyShoppingStatus(status: Omit<DailyMenuShoppingStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMenuShoppingStatus> {
    const { data, error } = await this.supabase
      .from('daily_menu_shopping_status')
      .insert([{
        user_id: status.userId,
        menu_date: status.menuDate,
        status: status.status,
        total_estimated_cost: status.totalEstimatedCost,
        total_actual_cost: status.totalActualCost,
        shopping_completed_at: status.shoppingCompletedAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async updateDailyShoppingStatus(id: string, updates: Partial<DailyMenuShoppingStatus>): Promise<DailyMenuShoppingStatus> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.totalEstimatedCost !== undefined) updateData.total_estimated_cost = updates.totalEstimatedCost;
    if (updates.totalActualCost !== undefined) updateData.total_actual_cost = updates.totalActualCost;
    if (updates.shoppingCompletedAt !== undefined) updateData.shopping_completed_at = updates.shoppingCompletedAt;

    const { data, error } = await this.supabase
      .from('daily_menu_shopping_status')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async deleteDailyShoppingStatus(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('daily_menu_shopping_status')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Meal Shopping Items Methods
  async getMealShoppingItems(dailyShoppingStatusId: string): Promise<MealShoppingItem[]> {
    const { data, error } = await this.supabase
      .from('meal_shopping_items')
      .select('*')
      .eq('daily_shopping_status_id', dailyShoppingStatusId)
      .order('created_at');

    if (error) throw error;
    return (data || []).map(convertKeysToCamelCase);
  }

  async createMealShoppingItem(item: Omit<MealShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealShoppingItem> {
    const { data, error } = await this.supabase
      .from('meal_shopping_items')
      .insert([{
        daily_shopping_status_id: item.dailyShoppingStatusId,
        ingredient_name: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        estimated_price: item.estimatedPrice,
        actual_price: item.actualPrice,
        is_purchased: item.isPurchased,
        recipe_id: item.recipeId,
        recipe_name: item.recipeName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async updateMealShoppingItem(id: string, updates: Partial<MealShoppingItem>): Promise<MealShoppingItem> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.estimatedPrice !== undefined) updateData.estimated_price = updates.estimatedPrice;
    if (updates.actualPrice !== undefined) updateData.actual_price = updates.actualPrice;
    if (updates.isPurchased !== undefined) updateData.is_purchased = updates.isPurchased;

    const { data, error } = await this.supabase
      .from('meal_shopping_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertKeysToCamelCase(data);
  }

  async deleteMealShoppingItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('meal_shopping_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
