import { 
  Dish, 
  MealSlot, 
  DayPlan, 
  WeekPlan, 
  MealTemplate, 
  NutritionStats,
  WeeklyStats,
  ShoppingList,
  ShoppingListItem,
  UserPreferences,
  SearchFilters,
  SortOptions
} from '@/types/meal-planning';

class MealPlanningService {
  private readonly STORAGE_KEYS = {
    WEEK_PLANS: 'meal_planning_week_plans',
    MEAL_TEMPLATES: 'meal_planning_templates',
    USER_PREFERENCES: 'meal_planning_preferences',
    DISHES: 'meal_planning_dishes'
  };

  // Week Plan Management
  async getWeekPlans(): Promise<WeekPlan[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.WEEK_PLANS);
    return stored ? JSON.parse(stored) : [];
  }

  async saveWeekPlan(weekPlan: WeekPlan): Promise<void> {
    const weekPlans = await this.getWeekPlans();
    const existingIndex = weekPlans.findIndex(plan => plan.id === weekPlan.id);
    
    if (existingIndex >= 0) {
      weekPlans[existingIndex] = { ...weekPlan, updatedAt: new Date().toISOString() };
    } else {
      weekPlans.push(weekPlan);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.WEEK_PLANS, JSON.stringify(weekPlans));
  }

  async deleteWeekPlan(planId: string): Promise<void> {
    const weekPlans = await this.getWeekPlans();
    const filtered = weekPlans.filter(plan => plan.id !== planId);
    localStorage.setItem(this.STORAGE_KEYS.WEEK_PLANS, JSON.stringify(filtered));
  }

  async duplicateWeekPlan(planId: string, newName: string): Promise<WeekPlan> {
    const weekPlans = await this.getWeekPlans();
    const originalPlan = weekPlans.find(plan => plan.id === planId);
    
    if (!originalPlan) {
      throw new Error('Week plan not found');
    }

    const duplicatedPlan: WeekPlan = {
      ...originalPlan,
      id: this.generateId(),
      name: newName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.saveWeekPlan(duplicatedPlan);
    return duplicatedPlan;
  }

  // Day Plan Management
  async updateDayPlan(weekPlanId: string, dayPlan: DayPlan): Promise<void> {
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      throw new Error('Week plan not found');
    }

    const dayIndex = weekPlan.days.findIndex(day => day.date === dayPlan.date);
    if (dayIndex >= 0) {
      weekPlan.days[dayIndex] = dayPlan;
    } else {
      weekPlan.days.push(dayPlan);
    }

    // Recalculate week totals
    this.recalculateWeekTotals(weekPlan);
    await this.saveWeekPlan(weekPlan);
  }

  // Meal Slot Management
  async addDishToMealSlot(
    weekPlanId: string, 
    date: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner', 
    dish: Dish,
    slotIndex?: number
  ): Promise<void> {
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      throw new Error('Week plan not found');
    }

    let dayPlan = weekPlan.days.find(day => day.date === date);
    if (!dayPlan) {
      dayPlan = this.createEmptyDayPlan(date);
      weekPlan.days.push(dayPlan);
    }

    const mealSlot = dayPlan.meals[mealType];
    mealSlot.dishes.push(dish);
    
    // Recalculate meal slot totals
    this.recalculateMealSlotTotals(mealSlot);
    
    // Recalculate day totals
    this.recalculateDayTotals(dayPlan);
    
    // Recalculate week totals
    this.recalculateWeekTotals(weekPlan);
    
    await this.saveWeekPlan(weekPlan);
  }

  async removeDishFromMealSlot(
    weekPlanId: string, 
    date: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner', 
    dishId: string
  ): Promise<void> {
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      throw new Error('Week plan not found');
    }

    const dayPlan = weekPlan.days.find(day => day.date === date);
    if (!dayPlan) {
      return;
    }

    const mealSlot = dayPlan.meals[mealType];
    mealSlot.dishes = mealSlot.dishes.filter(dish => dish.id !== dishId);
    
    // Recalculate totals
    this.recalculateMealSlotTotals(mealSlot);
    this.recalculateDayTotals(dayPlan);
    this.recalculateWeekTotals(weekPlan);
    
    await this.saveWeekPlan(weekPlan);
  }

  // Meal Templates
  async getMealTemplates(): Promise<MealTemplate[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.MEAL_TEMPLATES);
    return stored ? JSON.parse(stored) : this.getDefaultMealTemplates();
  }

  async saveMealTemplate(template: MealTemplate): Promise<void> {
    const templates = await this.getMealTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.MEAL_TEMPLATES, JSON.stringify(templates));
  }

  async applyMealTemplate(
    weekPlanId: string, 
    date: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner', 
    templateId: string
  ): Promise<void> {
    const templates = await this.getMealTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Meal template not found');
    }

    // Clear existing dishes in the meal slot
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      throw new Error('Week plan not found');
    }

    let dayPlan = weekPlan.days.find(day => day.date === date);
    if (!dayPlan) {
      dayPlan = this.createEmptyDayPlan(date);
      weekPlan.days.push(dayPlan);
    }

    // Apply template dishes
    const mealSlot = dayPlan.meals[mealType];
    mealSlot.dishes = [...template.dishes];
    
    // Recalculate totals
    this.recalculateMealSlotTotals(mealSlot);
    this.recalculateDayTotals(dayPlan);
    this.recalculateWeekTotals(weekPlan);
    
    await this.saveWeekPlan(weekPlan);
  }

  // Statistics
  async getNutritionStats(weekPlanId: string): Promise<NutritionStats[]> {
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      return [];
    }

    const preferences = await this.getUserPreferences();
    
    return weekPlan.days.map(day => ({
      date: day.date,
      calories: day.totalCalories,
      protein: day.nutritionSummary.protein,
      carbs: day.nutritionSummary.carbs,
      fat: day.nutritionSummary.fat,
      fiber: day.nutritionSummary.fiber,
      goalProgress: {
        calories: (day.totalCalories / preferences.nutritionGoals.dailyCalories) * 100,
        protein: (day.nutritionSummary.protein / (preferences.nutritionGoals.dailyCalories * preferences.nutritionGoals.protein / 100 / 4)) * 100,
        carbs: (day.nutritionSummary.carbs / (preferences.nutritionGoals.dailyCalories * preferences.nutritionGoals.carbs / 100 / 4)) * 100,
        fat: (day.nutritionSummary.fat / (preferences.nutritionGoals.dailyCalories * preferences.nutritionGoals.fat / 100 / 9)) * 100,
        fiber: (day.nutritionSummary.fiber / preferences.nutritionGoals.fiber) * 100
      }
    }));
  }

  // Shopping List Generation
  async generateShoppingList(weekPlanId: string): Promise<ShoppingList> {
    const weekPlans = await this.getWeekPlans();
    const weekPlan = weekPlans.find(plan => plan.id === weekPlanId);
    
    if (!weekPlan) {
      throw new Error('Week plan not found');
    }

    const ingredientMap = new Map<string, ShoppingListItem>();
    
    // Collect all ingredients from all dishes
    weekPlan.days.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        if (Array.isArray(meal)) {
          // Handle snacks array
          meal.forEach(snack => {
            snack.dishes.forEach(dish => {
              this.addIngredientsToMap(dish, ingredientMap);
            });
          });
        } else {
          // Handle regular meals
          meal.dishes.forEach(dish => {
            this.addIngredientsToMap(dish, ingredientMap);
          });
        }
      });
    });

    const items = Array.from(ingredientMap.values());
    const totalCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);

    return {
      id: this.generateId(),
      weekPlanId,
      items,
      totalCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : this.getDefaultUserPreferences();
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private createEmptyDayPlan(date: string): DayPlan {
    const emptyMealSlot = (): MealSlot => ({
      id: this.generateId(),
      dishes: [],
      totalCalories: 0,
      totalCost: 0,
      totalCookingTime: 0
    });

    return {
      date,
      meals: {
        breakfast: emptyMealSlot(),
        lunch: emptyMealSlot(),
        dinner: emptyMealSlot(),
        snacks: []
      },
      totalCalories: 0,
      totalCost: 0,
      nutritionSummary: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      }
    };
  }

  private recalculateMealSlotTotals(mealSlot: MealSlot): void {
    mealSlot.totalCalories = mealSlot.dishes.reduce((sum, dish) => sum + dish.calories, 0);
    mealSlot.totalCost = mealSlot.dishes.reduce((sum, dish) => sum + dish.cost, 0);
    mealSlot.totalCookingTime = Math.max(...mealSlot.dishes.map(dish => dish.cookingTime), 0);
  }

  private recalculateDayTotals(dayPlan: DayPlan): void {
    const allMeals = [dayPlan.meals.breakfast, dayPlan.meals.lunch, dayPlan.meals.dinner, ...dayPlan.meals.snacks];
    
    dayPlan.totalCalories = allMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    dayPlan.totalCost = allMeals.reduce((sum, meal) => sum + meal.totalCost, 0);
    
    // Calculate nutrition summary
    const allDishes = allMeals.flatMap(meal => meal.dishes);
    dayPlan.nutritionSummary = {
      protein: allDishes.reduce((sum, dish) => sum + dish.nutrition.protein, 0),
      carbs: allDishes.reduce((sum, dish) => sum + dish.nutrition.carbs, 0),
      fat: allDishes.reduce((sum, dish) => sum + dish.nutrition.fat, 0),
      fiber: allDishes.reduce((sum, dish) => sum + dish.nutrition.fiber, 0)
    };
  }

  private recalculateWeekTotals(weekPlan: WeekPlan): void {
    weekPlan.totalCalories = weekPlan.days.reduce((sum, day) => sum + day.totalCalories, 0);
    weekPlan.totalCost = weekPlan.days.reduce((sum, day) => sum + day.totalCost, 0);
    weekPlan.averageCaloriesPerDay = weekPlan.days.length > 0 ? weekPlan.totalCalories / weekPlan.days.length : 0;
  }

  private addIngredientsToMap(dish: Dish, ingredientMap: Map<string, ShoppingListItem>): void {
    dish.ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase();
      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.quantity += 1; // Simple quantity increment
        existing.estimatedCost += dish.cost * 0.1; // Rough estimate
      } else {
        ingredientMap.set(key, {
          id: this.generateId(),
          name: ingredient,
          quantity: 1,
          unit: 'portion',
          category: 'other',
          estimatedCost: dish.cost * 0.1,
          isChecked: false
        });
      }
    });
  }

  private getDefaultUserPreferences(): UserPreferences {
    return {
      dietaryRestrictions: [],
      allergies: [],
      dislikedIngredients: [],
      preferredCuisines: [],
      budgetLimit: 200000, // 200k VND per day
      nutritionGoals: {
        dailyCalories: 2000,
        protein: 20, // 20%
        carbs: 50,   // 50%
        fat: 30,     // 30%
        fiber: 25    // 25g
      },
      familySize: 4
    };
  }

  private getDefaultMealTemplates(): MealTemplate[] {
    // Return some default meal templates
    return [];
  }
}

export const mealPlanningService = new MealPlanningService();
