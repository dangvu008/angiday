// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  kitchenService,
  MealSlot,
  MealPlan,
  ShoppingList,
  InventoryItem,
  vietnameseRecipes,
  dailyMenuPlans,
  DailyMenuPlan,
  TodayMenuStatus,
  DailyMenuShoppingStatus
} from '@/services/kitchenService';
import { Recipe, TodayMeals } from '@/types/kitchen';
import { SampleDataService } from '@/services/sampleDataService';

interface KitchenContextType {
  // Today's meals - Updated to use TodayMeals interface
  todayMeals: TodayMeals | null;
  setTodayMeals: (meals: TodayMeals | null) => void;

  // Meal plans
  mealPlans: MealPlan[];
  activeMealPlan: MealPlan | null;
  setActiveMealPlan: (plan: MealPlan | null) => void;

  // Daily menu plans
  dailyMenus: DailyMenuPlan[];
  selectedDailyMenu: DailyMenuPlan | null;
  setSelectedDailyMenu: (menu: DailyMenuPlan | null) => void;

  // Recipes
  recipes: Recipe[];

  // Shopping lists
  shoppingLists: ShoppingList[];

  // Inventory
  inventory: InventoryItem[];
  expiringItems: InventoryItem[];

  // Shopping status
  todayMenuStatus: TodayMenuStatus | null;
  dailyShoppingStatus: DailyMenuShoppingStatus | null;

  // Loading states
  isLoading: boolean;
  
  // Actions
  refreshTodayMeals: () => Promise<void>;
  refreshMealPlans: () => Promise<void>;
  refreshRecipes: () => Promise<void>;
  refreshShoppingLists: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshTodayMenuStatus: () => Promise<void>;

  // Daily menu actions
  applyDailyMenu: (menuId: string) => Promise<void>;
  getRandomDailyMenu: () => DailyMenuPlan | null;

  // Meal actions
  toggleMealCompleted: (mealId: string) => Promise<void>;
  addMealToSlot: (mealType: string, recipeId: string) => Promise<void>;
  removeMealFromSlot: (mealId: string) => Promise<void>;

  // Shopping list actions
  generateShoppingListFromActivePlan: () => Promise<ShoppingList | null>;
  toggleShoppingItem: (listId: string, itemId: string) => Promise<void>;

  // Shopping status actions
  createTodayShoppingList: () => Promise<{ statusId: string; itemCount: number }>;
  updateShoppingItemPrice: (itemId: string, price: number) => Promise<void>;
  
  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeInventoryItem: (id: string) => Promise<void>;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
};

// Use Vietnamese recipes data

interface KitchenProviderProps {
  children: ReactNode;
}

export const KitchenProvider: React.FC<KitchenProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [todayMeals, setTodayMeals] = useState<TodayMeals | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null);
  const [dailyMenus, setDailyMenus] = useState<DailyMenuPlan[]>(dailyMenuPlans);
  const [selectedDailyMenu, setSelectedDailyMenu] = useState<DailyMenuPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
  const [todayMenuStatus, setTodayMenuStatus] = useState<TodayMenuStatus | null>(null);
  const [dailyShoppingStatus, setDailyShoppingStatus] = useState<DailyMenuShoppingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize sample data (temporarily disabled for debugging)
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('⚠️ Sample data initialization disabled for debugging');
      // initializeSampleData();
    }
  }, [isAuthenticated, user]);

  // Load today menu status when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshTodayMenuStatus();
    }
  }, [isAuthenticated, user]);

  const initializeSampleData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Initialize sample data using SampleDataService
      let existingRecipes = [];
      try {
        existingRecipes = await kitchenService.getRecipes();
      } catch (error) {
        console.warn('Failed to fetch recipes from database, using fallback data:', error);
        // Set fallback data immediately to prevent infinite loading
        setTodayMeals({
          source: 'fallback',
          meals: {
            breakfast: {
              id: 'fallback-1',
              name: 'Phở Bò',
              recipe: {
                id: 'fallback-recipe-1',
                name: 'Phở Bò',
                description: 'Món phở bò truyền thống',
                ingredients: ['Bánh phở', 'Thịt bò', 'Hành tây'],
                instructions: ['Luộc xương', 'Thái thịt', 'Trần bánh phở'],
                prepTime: 30,
                cookTime: 120,
                servings: 4,
                difficulty: 'medium',
                tags: ['vietnamese', 'soup'],
                createdAt: new Date().toISOString()
              },
              mealType: 'breakfast'
            },
            lunch: null,
            dinner: null,
            snack: null
          }
        });
        setIsLoading(false);
        return;
      }

      if (existingRecipes.length === 0) {
        console.log('Initializing sample data...');
        const { recipes, dailyMenus } = SampleDataService.populateSampleData();

        // Create recipes in service
        for (const recipe of recipes) {
          await kitchenService.createRecipe(recipe);
        }

        console.log(`Initialized ${recipes.length} recipes and ${dailyMenus.length} daily menus`);
      }

      // Refresh recipes and daily menus to ensure they're loaded
      await refreshRecipes();

      // Load daily menus
      const loadedDailyMenus = kitchenService.getDailyMenuPlans();
      setDailyMenus(loadedDailyMenus);
      
      // Create sample meal plan if none exists
      const existingPlans = await kitchenService.getMealPlans(user.id);
      if (existingPlans.length === 0) {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const samplePlan = await kitchenService.createMealPlan({
          userId: user.id,
          name: 'Kế hoạch tuần này',
          description: 'Thực đơn healthy cho tuần hiện tại',
          startDate: today.toISOString().split('T')[0],
          endDate: nextWeek.toISOString().split('T')[0]
        });
        
        // Add sample meals for today using existing recipes
        const todayStr = today.toISOString().split('T')[0];
        const availableRecipes = await kitchenService.getRecipes();

        if (availableRecipes.length >= 3) {
          await kitchenService.createMeal({
            mealPlanId: samplePlan.id,
            mealDate: todayStr,
            mealType: 'breakfast',
            recipeId: availableRecipes[0].id,
            completed: false
          });

          await kitchenService.createMeal({
            mealPlanId: samplePlan.id,
            mealDate: todayStr,
            mealType: 'lunch',
            recipeId: availableRecipes[1].id,
            completed: false
          });

          await kitchenService.createMeal({
            mealPlanId: samplePlan.id,
            mealDate: todayStr,
            mealType: 'dinner',
            recipeId: availableRecipes[2].id,
            completed: false
          });
        }
        
        setActiveMealPlan(samplePlan);
      } else {
        setActiveMealPlan(existingPlans[0]);
      }
      
      // Refresh all data
      await Promise.all([
        refreshTodayMeals(),
        refreshMealPlans(),
        refreshRecipes(),
        refreshShoppingLists(),
        refreshInventory()
      ]);
      
    } catch (error) {
      console.error('Error initializing sample data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh functions
  const refreshTodayMeals = async () => {
    if (!user) return;
    try {
      const meals = await kitchenService.getTodayMeals(user.id);

      if (meals.length === 0) {
        setTodayMeals({
          source: 'empty',
          meals: {
            breakfast: null,
            lunch: null,
            dinner: null,
            snack: null
          }
        });
        return;
      }

      // Convert MealSlot[] to TodayMeals format
      const todayMealsData: TodayMeals = {
        source: 'todayMeals',
        meals: {
          breakfast: null,
          lunch: null,
          dinner: null,
          snack: null
        }
      };

      // Populate meals with recipe data
      for (const meal of meals) {
        let recipe = null;
        if (meal.recipeId) {
          recipe = await kitchenService.getRecipe(meal.recipeId);
        }

        const mealItem = {
          id: meal.id,
          name: recipe?.name || 'Món ăn',
          recipe: recipe,
          mealType: meal.mealType
        };

        if (meal.mealType === 'breakfast') todayMealsData.meals.breakfast = mealItem;
        else if (meal.mealType === 'lunch') todayMealsData.meals.lunch = mealItem;
        else if (meal.mealType === 'dinner') todayMealsData.meals.dinner = mealItem;
        else if (meal.mealType === 'snack') todayMealsData.meals.snack = mealItem;
      }

      setTodayMeals(todayMealsData);
    } catch (error) {
      console.error('Error refreshing today meals:', error);
      setTodayMeals({
        source: 'empty',
        meals: {
          breakfast: null,
          lunch: null,
          dinner: null,
          snack: null
        }
      });
    }
  };

  const refreshMealPlans = async () => {
    if (!user) return;
    try {
      const plans = await kitchenService.getMealPlans(user.id);
      setMealPlans(plans);
    } catch (error) {
      console.error('Error refreshing meal plans:', error);
    }
  };

  const refreshRecipes = async () => {
    try {
      const allRecipes = await kitchenService.getRecipes();
      setRecipes(allRecipes);
    } catch (error) {
      console.error('Error refreshing recipes:', error);
    }
  };

  const refreshShoppingLists = async () => {
    if (!user) return;
    try {
      const lists = await kitchenService.getShoppingLists(user.id);
      setShoppingLists(lists);
    } catch (error) {
      console.error('Error refreshing shopping lists:', error);
    }
  };

  const refreshInventory = async () => {
    if (!user) return;
    try {
      const items = await kitchenService.getInventory(user.id);
      setInventory(items);

      const expiring = await kitchenService.getExpiringItems(user.id, 3);
      setExpiringItems(expiring);
    } catch (error) {
      console.error('Error refreshing inventory:', error);
    }
  };

  const refreshTodayMenuStatus = async () => {
    if (!user) return;
    try {
      console.log('🔄 KitchenContext: Refreshing today menu status for user:', user.id);
      const status = await kitchenService.getTodayMenuStatus(user.id);
      console.log('✅ KitchenContext: Got today menu status:', status);
      setTodayMenuStatus(status);
      setDailyShoppingStatus(status.shoppingStatus || null);
    } catch (error) {
      console.error('❌ KitchenContext: Error refreshing today menu status:', error);
      // Set fallback status to prevent UI errors
      setTodayMenuStatus({
        hasMenu: false,
        currentMealTime: 'breakfast',
        nextAction: 'create_menu'
      });
      setDailyShoppingStatus(null);
    }
  };

  // Meal actions
  const toggleMealCompleted = async (mealId: string) => {
    try {
      // Find meal in todayMeals structure
      let foundMeal = null;
      if (todayMeals) {
        Object.values(todayMeals.meals).forEach(meal => {
          if (meal && meal.id === mealId) {
            foundMeal = meal;
          }
        });
      }

      if (foundMeal) {
        // Update meal completion status
        await kitchenService.updateMeal(mealId, { completed: true });
        await refreshTodayMeals();
      }
    } catch (error) {
      console.error('Error toggling meal completed:', error);
    }
  };

  const addMealToSlot = async (mealType: string, recipeId: string, replaceExisting: boolean = false) => {
    if (!user || !activeMealPlan) {
      console.warn('No user or active meal plan');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      // Check if there's already a meal in this slot
      const existingMeals = await kitchenService.getMealsByDate(today);
      const existingMeal = existingMeals.find(meal =>
        meal.mealType === mealType && meal.mealPlanId === activeMealPlan.id
      );

      if (existingMeal && !replaceExisting) {
        // Add as additional meal instead of replacing
        console.log(`Adding additional meal to ${mealType}`);
      } else if (existingMeal && replaceExisting) {
        // Replace existing meal
        await kitchenService.deleteMeal(existingMeal.id);
        console.log(`Replaced existing meal in ${mealType}`);
      }

      await kitchenService.createMeal({
        mealPlanId: activeMealPlan.id,
        mealDate: today,
        mealType: mealType as any,
        recipeId,
        completed: false
      });

      await refreshTodayMeals();
      console.log(`Successfully added meal to ${mealType}`);
    } catch (error) {
      console.error('Error adding meal to slot:', error);
      throw error; // Re-throw to handle in UI
    }
  };

  const removeMealFromSlot = async (mealId: string) => {
    try {
      await kitchenService.deleteMeal(mealId);
      await refreshTodayMeals();
    } catch (error) {
      console.error('Error removing meal from slot:', error);
    }
  };

  // Shopping list actions
  const generateShoppingListFromActivePlan = async (): Promise<ShoppingList | null> => {
    if (!user || !activeMealPlan) return null;
    
    try {
      const shoppingList = await kitchenService.generateShoppingListFromMealPlan(user.id, activeMealPlan.id);
      await refreshShoppingLists();
      return shoppingList;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      return null;
    }
  };

  const toggleShoppingItem = async (listId: string, itemId: string) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (list) {
        const updatedItems = list.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        await kitchenService.updateShoppingList(listId, { items: updatedItems });
        await refreshShoppingLists();
      }
    } catch (error) {
      console.error('Error toggling shopping item:', error);
    }
  };

  // Inventory actions
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      await kitchenService.createInventoryItem({ ...item, userId: user.id });
      await refreshInventory();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await kitchenService.updateInventoryItem(id, updates);
      await refreshInventory();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const removeInventoryItem = async (id: string) => {
    try {
      await kitchenService.deleteInventoryItem(id);
      await refreshInventory();
    } catch (error) {
      console.error('Error removing inventory item:', error);
    }
  };

  // Daily menu actions
  const applyDailyMenu = async (menuId: string) => {
    const menu = dailyMenus.find(m => m.id === menuId);
    if (!menu) return;

    try {
      setIsLoading(true);

      // Clear today's meals first
      const today = new Date().toISOString().split('T')[0];
      const existingMeals = await kitchenService.getMealsByDate(today);
      for (const meal of existingMeals) {
        await kitchenService.deleteMeal(meal.id);
      }

      // Create new meals based on daily menu
      if (activeMealPlan) {
        // Breakfast
        for (const recipeId of menu.meals.breakfast) {
          await kitchenService.createMeal({
            mealPlanId: activeMealPlan.id,
            mealDate: today,
            mealType: 'breakfast',
            recipeId,
            completed: false
          });
        }

        // Lunch
        for (const recipeId of menu.meals.lunch) {
          await kitchenService.createMeal({
            mealPlanId: activeMealPlan.id,
            mealDate: today,
            mealType: 'lunch',
            recipeId,
            completed: false
          });
        }

        // Dinner
        for (const recipeId of menu.meals.dinner) {
          await kitchenService.createMeal({
            mealPlanId: activeMealPlan.id,
            mealDate: today,
            mealType: 'dinner',
            recipeId,
            completed: false
          });
        }
      }

      setSelectedDailyMenu(menu);
      await refreshTodayMeals();
    } catch (error) {
      console.error('Error applying daily menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomDailyMenu = () => {
    if (dailyMenus.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * dailyMenus.length);
    return dailyMenus[randomIndex];
  };

  // Shopping status actions
  const createTodayShoppingList = async (): Promise<{ statusId: string; itemCount: number }> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const result = await kitchenService.createShoppingListFromTodayMenu(user.id);
      await refreshTodayMenuStatus();
      return {
        statusId: result.shoppingStatus.id,
        itemCount: result.items.length
      };
    } catch (error) {
      console.error('Error creating today shopping list:', error);
      // Return fallback data instead of throwing
      return {
        statusId: 'fallback',
        itemCount: 0
      };
    }
  };

  const updateShoppingItemPrice = async (itemId: string, price: number): Promise<void> => {
    try {
      await kitchenService.updateShoppingItemPrice(itemId, price);
      await refreshTodayMenuStatus();
    } catch (error) {
      console.error('Error updating shopping item price:', error);
      throw error;
    }
  };

  const value: KitchenContextType = {
    // State
    todayMeals,
    setTodayMeals,
    mealPlans,
    activeMealPlan,
    setActiveMealPlan,
    dailyMenus,
    selectedDailyMenu,
    setSelectedDailyMenu,
    recipes,
    shoppingLists,
    inventory,
    expiringItems,
    todayMenuStatus,
    dailyShoppingStatus,
    isLoading,

    // Refresh functions
    refreshTodayMeals,
    refreshMealPlans,
    refreshRecipes,
    refreshShoppingLists,
    refreshInventory,
    refreshTodayMenuStatus,

    // Actions
    toggleMealCompleted,
    addMealToSlot,
    removeMealFromSlot,
    generateShoppingListFromActivePlan,
    toggleShoppingItem,
    addInventoryItem,
    updateInventoryItem,
    removeInventoryItem,

    // Daily menu actions
    applyDailyMenu,
    getRandomDailyMenu,

    // Shopping status actions
    createTodayShoppingList,
    updateShoppingItemPrice
  };

  return (
    <KitchenContext.Provider value={value}>
      {children}
    </KitchenContext.Provider>
  );
};
