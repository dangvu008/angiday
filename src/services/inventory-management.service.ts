import { 
  Inventory, 
  InventoryItem, 
  PlanShoppingStatus, 
  EnhancedPlanStatus,
  CookingSession,
  AnyPlan,
  Recipe,
  ShoppingList,
  ShoppingListItem
} from '@/types/meal-planning';
import { IngredientManagementService } from './IngredientManagementService';

class InventoryManagementService {
  private readonly STORAGE_KEYS = {
    INVENTORY: 'angiday_inventory',
    PLAN_STATUS: 'angiday_plan_status',
    COOKING_SESSIONS: 'angiday_cooking_sessions'
  };

  // Inventory Management
  async getInventory(userId: string): Promise<Inventory> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
    
    let userInventory = inventories.find(inv => inv.userId === userId);
    
    if (!userInventory) {
      userInventory = {
        id: this.generateId(),
        userId,
        items: [],
        lastUpdated: new Date().toISOString(),
        totalValue: 0
      };
      inventories.push(userInventory);
      localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
    }
    
    return userInventory;
  }

  async updateInventory(inventory: Inventory): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
    
    const index = inventories.findIndex(inv => inv.id === inventory.id);
    inventory.lastUpdated = new Date().toISOString();
    inventory.totalValue = this.calculateTotalValue(inventory.items);
    
    if (index >= 0) {
      inventories[index] = inventory;
    } else {
      inventories.push(inventory);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
  }

  async addInventoryItem(userId: string, item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const inventory = await this.getInventory(userId);
    
    const newItem: InventoryItem = {
      ...item,
      id: this.generateId(),
      isLowStock: item.quantity <= item.minimumQuantity
    };
    
    inventory.items.push(newItem);
    await this.updateInventory(inventory);
    
    return newItem;
  }

  async updateInventoryItem(userId: string, itemId: string, updates: Partial<InventoryItem>): Promise<void> {
    const inventory = await this.getInventory(userId);
    const itemIndex = inventory.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      inventory.items[itemIndex] = {
        ...inventory.items[itemIndex],
        ...updates,
        isLowStock: (updates.quantity ?? inventory.items[itemIndex].quantity) <= 
                   (updates.minimumQuantity ?? inventory.items[itemIndex].minimumQuantity)
      };
      await this.updateInventory(inventory);
    }
  }

  async removeInventoryItem(userId: string, itemId: string): Promise<void> {
    const inventory = await this.getInventory(userId);
    inventory.items = inventory.items.filter(item => item.id !== itemId);
    await this.updateInventory(inventory);
  }

  // Shopping Status Management
  async checkPlanShoppingStatus(plan: AnyPlan, userId: string): Promise<PlanShoppingStatus> {
    const inventory = await this.getInventory(userId);
    const requiredIngredients = this.extractIngredientsFromPlan(plan);
    const missingIngredients: string[] = [];
    let estimatedCost = 0;

    // Kiểm tra từng nguyên liệu cần thiết
    for (const ingredient of requiredIngredients) {
      const inventoryItem = inventory.items.find(item => 
        item.name.toLowerCase() === ingredient.toLowerCase() ||
        item.ingredientId === ingredient
      );

      if (!inventoryItem || inventoryItem.quantity <= 0) {
        missingIngredients.push(ingredient);
        // Ước tính chi phí từ IngredientManagementService
        const standardIngredient = IngredientManagementService.searchIngredients(ingredient)[0];
        if (standardIngredient?.averagePrice) {
          estimatedCost += standardIngredient.averagePrice;
        } else {
          estimatedCost += 50000; // Giá mặc định
        }
      }
    }

    const status: PlanShoppingStatus = {
      planId: plan.id,
      planType: plan.type,
      hasAllIngredients: missingIngredients.length === 0,
      missingIngredients,
      lastChecked: new Date().toISOString(),
      canStartCooking: missingIngredients.length === 0,
      estimatedShoppingCost: estimatedCost
    };

    // Lưu trạng thái
    await this.savePlanStatus(status);
    
    return status;
  }

  async createShoppingListFromMissingIngredients(
    planId: string, 
    missingIngredients: string[]
  ): Promise<ShoppingList> {
    const items: ShoppingListItem[] = missingIngredients.map(ingredient => {
      const standardIngredient = IngredientManagementService.searchIngredients(ingredient)[0];
      
      return {
        id: this.generateId(),
        name: ingredient,
        quantity: 1,
        unit: standardIngredient?.baseUnit || 'phần',
        category: standardIngredient?.category || 'khác',
        estimatedCost: standardIngredient?.averagePrice || 50000,
        isChecked: false,
        notes: 'Cần mua để hoàn thành kế hoạch'
      };
    });

    const shoppingList: ShoppingList = {
      id: this.generateId(),
      weekPlanId: planId,
      items,
      totalCost: items.reduce((sum, item) => sum + item.estimatedCost, 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Lưu shopping list
    const stored = localStorage.getItem('angiday_shopping_lists');
    const lists: ShoppingList[] = stored ? JSON.parse(stored) : [];
    lists.push(shoppingList);
    localStorage.setItem('angiday_shopping_lists', JSON.stringify(lists));

    return shoppingList;
  }

  // Enhanced Plan Status Management
  async getEnhancedPlanStatus(planId: string): Promise<EnhancedPlanStatus | null> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.PLAN_STATUS);
    const statuses: EnhancedPlanStatus[] = stored ? JSON.parse(stored) : [];
    return statuses.find(status => status.planId === planId) || null;
  }

  async updateEnhancedPlanStatus(status: EnhancedPlanStatus): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.PLAN_STATUS);
    const statuses: EnhancedPlanStatus[] = stored ? JSON.parse(stored) : [];
    
    const index = statuses.findIndex(s => s.planId === status.planId);
    status.lastUpdated = new Date().toISOString();
    
    if (index >= 0) {
      statuses[index] = status;
    } else {
      statuses.push(status);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.PLAN_STATUS, JSON.stringify(statuses));
  }

  // Cooking Session Management
  async startCookingSession(plan: AnyPlan): Promise<CookingSession> {
    const recipes = this.extractRecipesFromPlan(plan);
    
    const session: CookingSession = {
      id: this.generateId(),
      planId: plan.id,
      planType: plan.type,
      recipes,
      currentRecipeIndex: 0,
      status: 'preparing',
      startTime: new Date().toISOString(),
      totalCookingTime: recipes.reduce((total, recipe) => {
        const time = parseInt(recipe.cookingTime) || 30;
        return total + time;
      }, 0),
      completedSteps: {}
    };

    // Lưu cooking session
    const stored = localStorage.getItem(this.STORAGE_KEYS.COOKING_SESSIONS);
    const sessions: CookingSession[] = stored ? JSON.parse(stored) : [];
    sessions.push(session);
    localStorage.setItem(this.STORAGE_KEYS.COOKING_SESSIONS, JSON.stringify(sessions));

    return session;
  }

  // Inventory Quick Actions
  async addQuickInventoryItems(userId: string, ingredients: string[]): Promise<void> {
    const inventory = await this.getInventory(userId);

    for (const ingredient of ingredients) {
      const standardIngredient = IngredientManagementService.searchIngredients(ingredient)[0];

      const newItem: InventoryItem = {
        id: this.generateId(),
        ingredientId: standardIngredient?.id || ingredient,
        name: ingredient,
        quantity: 1,
        unit: standardIngredient?.baseUnit || 'phần',
        category: standardIngredient?.category || 'khác',
        purchaseDate: new Date().toISOString(),
        location: 'pantry',
        cost: standardIngredient?.averagePrice || 50000,
        isLowStock: false,
        minimumQuantity: 1
      };

      inventory.items.push(newItem);
    }

    await this.updateInventory(inventory);
  }

  async markShoppingListCompleted(shoppingListId: string, userId: string): Promise<void> {
    // Get shopping list
    const stored = localStorage.getItem('angiday_shopping_lists');
    const lists: ShoppingList[] = stored ? JSON.parse(stored) : [];
    const listIndex = lists.findIndex(list => list.id === shoppingListId);

    if (listIndex >= 0) {
      const shoppingList = lists[listIndex];

      // Add purchased items to inventory
      const purchasedIngredients = shoppingList.items
        .filter(item => item.isChecked)
        .map(item => item.name);

      if (purchasedIngredients.length > 0) {
        await this.addQuickInventoryItems(userId, purchasedIngredients);
      }

      // Update shopping list status
      lists[listIndex] = {
        ...shoppingList,
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('angiday_shopping_lists', JSON.stringify(lists));
    }
  }

  // Get low stock items
  async getLowStockItems(userId: string): Promise<InventoryItem[]> {
    const inventory = await this.getInventory(userId);
    return inventory.items.filter(item => item.isLowStock);
  }

  // Get expiring items
  async getExpiringItems(userId: string, daysAhead: number = 3): Promise<InventoryItem[]> {
    const inventory = await this.getInventory(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return inventory.items.filter(item => {
      if (!item.expiryDate) return false;
      return new Date(item.expiryDate) <= cutoffDate;
    });
  }

  // Helper methods
  private calculateTotalValue(items: InventoryItem[]): number {
    return items.reduce((total, item) => total + item.cost, 0);
  }

  private extractIngredientsFromPlan(plan: AnyPlan): string[] {
    const ingredients: string[] = [];

    switch (plan.type) {
      case 'meal':
        if ('meal' in plan) {
          plan.meal.dishes.forEach(dish => {
            ingredients.push(...dish.ingredients);
          });
        }
        break;
      case 'day':
        if ('meals' in plan) {
          Object.values(plan.meals).forEach(meal => {
            if (Array.isArray(meal)) {
              meal.forEach(m => m.dishes.forEach(dish => ingredients.push(...dish.ingredients)));
            } else {
              meal.dishes.forEach(dish => ingredients.push(...dish.ingredients));
            }
          });
        }
        break;
      case 'week':
        if ('days' in plan) {
          plan.days.forEach(day => {
            Object.values(day.meals).forEach(meal => {
              if (Array.isArray(meal)) {
                meal.forEach(m => m.dishes.forEach(dish => ingredients.push(...dish.ingredients)));
              } else {
                meal.dishes.forEach(dish => ingredients.push(...dish.ingredients));
              }
            });
          });
        }
        break;
    }

    return [...new Set(ingredients)]; // Remove duplicates
  }

  private extractRecipesFromPlan(plan: AnyPlan): Recipe[] {
    const recipes: Recipe[] = [];

    switch (plan.type) {
      case 'meal':
        if ('meal' in plan) {
          plan.meal.dishes.forEach(dish => {
            const recipe: Recipe = {
              id: dish.id,
              title: dish.name,
              description: `Món ${dish.name} với ${dish.calories} calories`,
              category: dish.category,
              difficulty: dish.difficulty === 'easy' ? 'Dễ' :
                         dish.difficulty === 'medium' ? 'Trung bình' : 'Khó',
              cookingTime: `${dish.cookingTime} phút`,
              servings: dish.servings,
              author: 'AnGiDay',
              status: 'published',
              createdDate: new Date().toISOString(),
              views: dish.views,
              image: dish.image,
              ingredients: dish.ingredients,
              instructions: dish.instructions,
              nutrition: {
                calories: dish.calories,
                protein: dish.nutrition.protein,
                carbs: dish.nutrition.carbs,
                fat: dish.nutrition.fat,
                fiber: dish.nutrition.fiber
              },
              tags: dish.tags,
              cuisine: 'Việt Nam',
              rating: dish.rating,
              reviews: Math.floor(dish.views / 10)
            };
            recipes.push(recipe);
          });
        }
        break;

      case 'day':
        if ('meals' in plan) {
          // Extract from breakfast
          plan.meals.breakfast.dishes.forEach(dish => {
            recipes.push(this.convertDishToRecipe(dish, 'Sáng'));
          });

          // Extract from lunch
          plan.meals.lunch.dishes.forEach(dish => {
            recipes.push(this.convertDishToRecipe(dish, 'Trưa'));
          });

          // Extract from dinner
          plan.meals.dinner.dishes.forEach(dish => {
            recipes.push(this.convertDishToRecipe(dish, 'Tối'));
          });

          // Extract from snacks
          if (plan.meals.snacks && Array.isArray(plan.meals.snacks)) {
            plan.meals.snacks.forEach(snackMeal => {
              snackMeal.dishes.forEach(dish => {
                recipes.push(this.convertDishToRecipe(dish, 'Ăn vặt'));
              });
            });
          }
        }
        break;

      case 'week':
        if ('days' in plan) {
          plan.days.forEach(day => {
            // Extract from each day's meals
            Object.values(day.meals).forEach(meal => {
              if (Array.isArray(meal)) {
                meal.forEach(m => {
                  m.dishes.forEach(dish => {
                    recipes.push(this.convertDishToRecipe(dish, 'Tuần'));
                  });
                });
              } else {
                meal.dishes.forEach(dish => {
                  recipes.push(this.convertDishToRecipe(dish, 'Tuần'));
                });
              }
            });
          });
        }
        break;
    }

    return recipes;
  }

  private convertDishToRecipe(dish: any, mealType: string): Recipe {
    return {
      id: dish.id,
      title: dish.name,
      description: `Món ${dish.name} cho bữa ${mealType.toLowerCase()} với ${dish.calories} calories`,
      category: dish.category || 'Món chính',
      difficulty: dish.difficulty === 'easy' ? 'Dễ' :
                 dish.difficulty === 'medium' ? 'Trung bình' : 'Khó',
      cookingTime: `${dish.cookingTime || 30} phút`,
      servings: dish.servings || 2,
      author: 'AnGiDay',
      status: 'published',
      createdDate: new Date().toISOString(),
      views: dish.views || 100,
      image: dish.image || '/placeholder.svg',
      ingredients: dish.ingredients || ['Nguyên liệu chưa được cập nhật'],
      instructions: dish.instructions || [
        'Chuẩn bị nguyên liệu',
        'Chế biến theo hướng dẫn',
        'Nêm nếm vừa ăn',
        'Trang trí và thưởng thức'
      ],
      nutrition: {
        calories: dish.calories || 300,
        protein: dish.nutrition?.protein || 15,
        carbs: dish.nutrition?.carbs || 40,
        fat: dish.nutrition?.fat || 10,
        fiber: dish.nutrition?.fiber || 5
      },
      tags: dish.tags || [mealType],
      cuisine: 'Việt Nam',
      rating: dish.rating || 4.5,
      reviews: Math.floor((dish.views || 100) / 10)
    };
  }

  private async savePlanStatus(status: PlanShoppingStatus): Promise<void> {
    const stored = localStorage.getItem('angiday_plan_shopping_status');
    const statuses: PlanShoppingStatus[] = stored ? JSON.parse(stored) : [];

    const index = statuses.findIndex(s => s.planId === status.planId);
    if (index >= 0) {
      statuses[index] = status;
    } else {
      statuses.push(status);
    }

    localStorage.setItem('angiday_plan_shopping_status', JSON.stringify(statuses));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const inventoryManagementService = new InventoryManagementService();
export default inventoryManagementService;
