import { 
  MealPlan, 
  MealAssignment, 
  DailyMealSchedule, 
  WeeklyMealSchedule, 
  Recipe 
} from '@/types/kitchen';

// Mock data storage (in real app, this would be API calls)
class MealPlanningService {
  private mealPlans: MealPlan[] = [];
  private mealAssignments: MealAssignment[] = [];
  private weeklySchedules: WeeklyMealSchedule[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Initialize with some mock data
  private initializeMockData() {
    // Sample meal plans
    this.mealPlans = [
      {
        id: 'plan-1',
        name: 'Thực đơn Việt Nam truyền thống',
        description: 'Các món ăn Việt Nam quen thuộc, phù hợp cho gia đình',
        recipes: [], // Will be populated with actual recipes
        totalTime: 120,
        servings: 4,
        tags: ['vietnamese', 'traditional', 'family'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isTemplate: true,
        category: 'mixed',
        totalCalories: 2000,
        difficulty: 'medium'
      },
      {
        id: 'plan-2',
        name: 'Thực đơn ăn sáng nhanh gọn',
        description: 'Các món ăn sáng đơn giản, chuẩn bị nhanh',
        recipes: [],
        totalTime: 30,
        servings: 2,
        tags: ['breakfast', 'quick', 'healthy'],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        isTemplate: true,
        category: 'breakfast',
        totalCalories: 600,
        difficulty: 'easy'
      },
      {
        id: 'plan-3',
        name: 'Thực đơn cơm trưa văn phòng',
        description: 'Các món cơm trưa phù hợp mang đi làm',
        recipes: [],
        totalTime: 45,
        servings: 1,
        tags: ['lunch', 'office', 'portable'],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        isTemplate: true,
        category: 'lunch',
        totalCalories: 800,
        difficulty: 'easy'
      }
    ];
  }

  // Get all meal plans
  async getMealPlans(): Promise<MealPlan[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.mealPlans]), 300);
    });
  }

  // Get meal plan by ID
  async getMealPlan(id: string): Promise<MealPlan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.mealPlans.find(p => p.id === id);
        resolve(plan || null);
      }, 200);
    });
  }

  // Create new meal plan
  async createMealPlan(planData: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlan: MealPlan = {
          ...planData,
          id: `plan-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mealPlans.push(newPlan);
        resolve(newPlan);
      }, 500);
    });
  }

  // Update meal plan
  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mealPlans.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mealPlans[index] = {
            ...this.mealPlans[index],
            ...updates,
            updatedAt: new Date()
          };
          resolve(this.mealPlans[index]);
        } else {
          resolve(null);
        }
      }, 400);
    });
  }

  // Delete meal plan
  async deleteMealPlan(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mealPlans.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mealPlans.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // Add recipe to meal plan
  async addRecipeToMealPlan(planId: string, recipe: Recipe): Promise<MealPlan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.mealPlans.find(p => p.id === planId);
        if (plan) {
          // Check if recipe already exists
          const existingRecipe = plan.recipes.find(r => r.id === recipe.id);
          if (!existingRecipe) {
            plan.recipes.push(recipe);
            plan.updatedAt = new Date();
            // Recalculate totals
            plan.totalTime = plan.recipes.reduce((total, r) => {
              const cookingTime = parseInt(r.cooking_time || '0') || 0;
              return total + cookingTime;
            }, 0);
            resolve(plan);
          } else {
            resolve(plan); // Recipe already exists
          }
        } else {
          resolve(null);
        }
      }, 400);
    });
  }

  // Remove recipe from meal plan
  async removeRecipeFromMealPlan(planId: string, recipeId: string): Promise<MealPlan | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.mealPlans.find(p => p.id === planId);
        if (plan) {
          plan.recipes = plan.recipes.filter(r => r.id !== recipeId);
          plan.updatedAt = new Date();
          // Recalculate totals
          plan.totalTime = plan.recipes.reduce((total, r) => {
            const cookingTime = parseInt(r.cooking_time || '0') || 0;
            return total + cookingTime;
          }, 0);
          resolve(plan);
        } else {
          resolve(null);
        }
      }, 400);
    });
  }

  // Apply meal plan to specific meal
  async applyMealPlanToMeal(
    planId: string, 
    date: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<MealAssignment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.mealPlans.find(p => p.id === planId);
        if (!plan) {
          throw new Error('Meal plan not found');
        }

        const assignment: MealAssignment = {
          id: `assignment-${Date.now()}`,
          date,
          mealType,
          mealPlan: plan,
          status: 'planned',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Remove existing assignment for same date/meal type
        this.mealAssignments = this.mealAssignments.filter(
          a => !(a.date === date && a.mealType === mealType)
        );

        this.mealAssignments.push(assignment);
        resolve(assignment);
      }, 500);
    });
  }

  // Get meal assignments for a date
  async getMealAssignmentsForDate(date: string): Promise<DailyMealSchedule> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dayAssignments = this.mealAssignments.filter(a => a.date === date);
        
        const schedule: DailyMealSchedule = {
          date,
          breakfast: dayAssignments.find(a => a.mealType === 'breakfast'),
          lunch: dayAssignments.find(a => a.mealType === 'lunch'),
          dinner: dayAssignments.find(a => a.mealType === 'dinner'),
          snacks: dayAssignments.filter(a => a.mealType === 'snack')
        };

        resolve(schedule);
      }, 300);
    });
  }

  // Get weekly meal schedule
  async getWeeklySchedule(weekStart: string): Promise<WeeklyMealSchedule> {
    return new Promise(async (resolve) => {
      const days: DailyMealSchedule[] = [];
      const startDate = new Date(weekStart);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        const daySchedule = await this.getMealAssignmentsForDate(dateString);
        days.push(daySchedule);
      }

      resolve({
        weekStart,
        days
      });
    });
  }

  // Add custom recipe to meal assignment
  async addCustomRecipeToMeal(
    date: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    recipe: Recipe
  ): Promise<MealAssignment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let assignment = this.mealAssignments.find(
          a => a.date === date && a.mealType === mealType
        );

        if (!assignment) {
          // Create new assignment
          assignment = {
            id: `assignment-${Date.now()}`,
            date,
            mealType,
            customRecipes: [recipe],
            status: 'planned',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          this.mealAssignments.push(assignment);
        } else {
          // Add to existing assignment
          if (!assignment.customRecipes) {
            assignment.customRecipes = [];
          }
          
          // Check if recipe already exists
          const existingRecipe = assignment.customRecipes.find(r => r.id === recipe.id);
          if (!existingRecipe) {
            assignment.customRecipes.push(recipe);
            assignment.updatedAt = new Date();
          }
        }

        resolve(assignment);
      }, 400);
    });
  }

  // Remove custom recipe from meal assignment
  async removeCustomRecipeFromMeal(
    date: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    recipeId: string
  ): Promise<MealAssignment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assignment = this.mealAssignments.find(
          a => a.date === date && a.mealType === mealType
        );

        if (assignment && assignment.customRecipes) {
          assignment.customRecipes = assignment.customRecipes.filter(r => r.id !== recipeId);
          assignment.updatedAt = new Date();
          resolve(assignment);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  // Update meal assignment status
  async updateMealStatus(
    assignmentId: string, 
    status: 'planned' | 'in-progress' | 'completed'
  ): Promise<MealAssignment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assignment = this.mealAssignments.find(a => a.id === assignmentId);
        if (assignment) {
          assignment.status = status;
          assignment.updatedAt = new Date();
          resolve(assignment);
        } else {
          resolve(null);
        }
      }, 200);
    });
  }
}

// Export singleton instance
export const mealPlanningService = new MealPlanningService();
export default mealPlanningService;
