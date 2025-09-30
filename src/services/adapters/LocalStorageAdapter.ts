// @ts-nocheck
// LocalStorage Adapter Implementation
import { 
  DatabaseAdapter, 
  LocalStorageAdapter as ILocalStorageAdapter,
  Recipe, 
  MealPlan, 
  ShoppingList, 
  DailyMenuShoppingStatus, 
  MealShoppingItem 
} from '../interfaces/DatabaseAdapter';

export class LocalStorageAdapter implements ILocalStorageAdapter {
  private getStorageKey(type: string, userId?: string): string {
    return userId ? `angiday_${type}_${userId}` : `angiday_${type}`;
  }

  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private generateId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return this.getFromStorage<Recipe>(this.getStorageKey('recipes'));
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    const recipes = await this.getRecipes();
    return recipes.find(r => r.id === id) || null;
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const recipes = await this.getRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    recipes.push(newRecipe);
    this.saveToStorage(this.getStorageKey('recipes'), recipes);
    return newRecipe;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const recipes = await this.getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    recipes[index] = { ...recipes[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage(this.getStorageKey('recipes'), recipes);
    return recipes[index];
  }

  async deleteRecipe(id: string): Promise<void> {
    const recipes = await this.getRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    this.saveToStorage(this.getStorageKey('recipes'), filtered);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const recipes = await this.getRecipes();
    const lowerQuery = query.toLowerCase();
    return recipes.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description?.toLowerCase().includes(lowerQuery) ||
      r.ingredients.some(i => i.toLowerCase().includes(lowerQuery)) ||
      r.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  // Meal plan methods
  async getMealPlans(userId: string, startDate?: string, endDate?: string): Promise<MealPlan[]> {
    const mealPlans = this.getFromStorage<MealPlan>(this.getStorageKey('meal_plans', userId));
    let filtered = mealPlans.filter(mp => mp.userId === userId);
    
    if (startDate) {
      filtered = filtered.filter(mp => mp.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(mp => mp.date <= endDate);
    }
    
    return filtered;
  }

  async getMealPlan(id: string): Promise<MealPlan | null> {
    const mealPlans = this.getFromStorage<MealPlan>(this.getStorageKey('meal_plans'));
    return mealPlans.find(mp => mp.id === id) || null;
  }

  async createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan> {
    const mealPlans = this.getFromStorage<MealPlan>(this.getStorageKey('meal_plans', mealPlan.userId));
    const newMealPlan: MealPlan = {
      ...mealPlan,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mealPlans.push(newMealPlan);
    this.saveToStorage(this.getStorageKey('meal_plans', mealPlan.userId), mealPlans);
    return newMealPlan;
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    const mealPlans = this.getFromStorage<MealPlan>(this.getStorageKey('meal_plans'));
    const index = mealPlans.findIndex(mp => mp.id === id);
    if (index === -1) throw new Error('Meal plan not found');
    
    mealPlans[index] = { ...mealPlans[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage(this.getStorageKey('meal_plans'), mealPlans);
    return mealPlans[index];
  }

  async deleteMealPlan(id: string): Promise<void> {
    const mealPlans = this.getFromStorage<MealPlan>(this.getStorageKey('meal_plans'));
    const filtered = mealPlans.filter(mp => mp.id !== id);
    this.saveToStorage(this.getStorageKey('meal_plans'), filtered);
  }

  // Shopping list methods
  async getShoppingLists(userId: string): Promise<ShoppingList[]> {
    const lists = this.getFromStorage<ShoppingList>(this.getStorageKey('shopping_lists', userId));
    return lists.filter(sl => sl.userId === userId);
  }

  async getShoppingList(id: string): Promise<ShoppingList | null> {
    const lists = this.getFromStorage<ShoppingList>(this.getStorageKey('shopping_lists'));
    return lists.find(sl => sl.id === id) || null;
  }

  async createShoppingList(shoppingList: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList> {
    const lists = this.getFromStorage<ShoppingList>(this.getStorageKey('shopping_lists', shoppingList.userId));
    const newList: ShoppingList = {
      ...shoppingList,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    lists.push(newList);
    this.saveToStorage(this.getStorageKey('shopping_lists', shoppingList.userId), lists);
    return newList;
  }

  async updateShoppingList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList> {
    const lists = this.getFromStorage<ShoppingList>(this.getStorageKey('shopping_lists'));
    const index = lists.findIndex(sl => sl.id === id);
    if (index === -1) throw new Error('Shopping list not found');
    
    lists[index] = { ...lists[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage(this.getStorageKey('shopping_lists'), lists);
    return lists[index];
  }

  async deleteShoppingList(id: string): Promise<void> {
    const lists = this.getFromStorage<ShoppingList>(this.getStorageKey('shopping_lists'));
    const filtered = lists.filter(sl => sl.id !== id);
    this.saveToStorage(this.getStorageKey('shopping_lists'), filtered);
  }

  // Daily shopping status methods
  async getDailyShoppingStatus(userId: string, menuDate: string): Promise<DailyMenuShoppingStatus | null> {
    const statuses = this.getFromStorage<DailyMenuShoppingStatus>(this.getStorageKey('daily_shopping_status', userId));
    return statuses.find(s => s.userId === userId && s.menuDate === menuDate) || null;
  }

  async createDailyShoppingStatus(status: Omit<DailyMenuShoppingStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMenuShoppingStatus> {
    const statuses = this.getFromStorage<DailyMenuShoppingStatus>(this.getStorageKey('daily_shopping_status', status.userId));
    const newStatus: DailyMenuShoppingStatus = {
      ...status,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    statuses.push(newStatus);
    this.saveToStorage(this.getStorageKey('daily_shopping_status', status.userId), statuses);
    return newStatus;
  }

  async updateDailyShoppingStatus(id: string, updates: Partial<DailyMenuShoppingStatus>): Promise<DailyMenuShoppingStatus> {
    const statuses = this.getFromStorage<DailyMenuShoppingStatus>(this.getStorageKey('daily_shopping_status'));
    const index = statuses.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Daily shopping status not found');
    
    statuses[index] = { ...statuses[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage(this.getStorageKey('daily_shopping_status'), statuses);
    return statuses[index];
  }

  async deleteDailyShoppingStatus(id: string): Promise<void> {
    const statuses = this.getFromStorage<DailyMenuShoppingStatus>(this.getStorageKey('daily_shopping_status'));
    const filtered = statuses.filter(s => s.id !== id);
    this.saveToStorage(this.getStorageKey('daily_shopping_status'), filtered);
  }

  // Meal shopping items methods
  async getMealShoppingItems(dailyShoppingStatusId: string): Promise<MealShoppingItem[]> {
    const items = this.getFromStorage<MealShoppingItem>(this.getStorageKey('meal_shopping_items'));
    return items.filter(item => item.dailyShoppingStatusId === dailyShoppingStatusId);
  }

  async createMealShoppingItem(item: Omit<MealShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealShoppingItem> {
    const items = this.getFromStorage<MealShoppingItem>(this.getStorageKey('meal_shopping_items'));
    const newItem: MealShoppingItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.saveToStorage(this.getStorageKey('meal_shopping_items'), items);
    return newItem;
  }

  async updateMealShoppingItem(id: string, updates: Partial<MealShoppingItem>): Promise<MealShoppingItem> {
    const items = this.getFromStorage<MealShoppingItem>(this.getStorageKey('meal_shopping_items'));
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Meal shopping item not found');
    
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage(this.getStorageKey('meal_shopping_items'), items);
    return items[index];
  }

  async deleteMealShoppingItem(id: string): Promise<void> {
    const items = this.getFromStorage<MealShoppingItem>(this.getStorageKey('meal_shopping_items'));
    const filtered = items.filter(item => item.id !== id);
    this.saveToStorage(this.getStorageKey('meal_shopping_items'), filtered);
  }

  async bulkUpdateMealShoppingItems(updates: Array<{ id: string; updates: Partial<MealShoppingItem> }>): Promise<MealShoppingItem[]> {
    const items = this.getFromStorage<MealShoppingItem>(this.getStorageKey('meal_shopping_items'));
    const updatedItems: MealShoppingItem[] = [];
    
    for (const update of updates) {
      const index = items.findIndex(item => item.id === update.id);
      if (index !== -1) {
        items[index] = { ...items[index], ...update.updates, updatedAt: new Date().toISOString() };
        updatedItems.push(items[index]);
      }
    }
    
    this.saveToStorage(this.getStorageKey('meal_shopping_items'), items);
    return updatedItems;
  }
}
