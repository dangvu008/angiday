import { SampleDataService } from '@/services/sampleDataService';
import { kitchenService } from '@/services/kitchenService';

/**
 * Utility để tự động tạo dữ liệu mẫu khi cần thiết
 */
export class AutoSampleDataManager {
  private static isInitialized = false;
  private static isInitializing = false;

  /**
   * Tự động khởi tạo dữ liệu mẫu nếu cần thiết
   */
  static async ensureSampleData(userId?: string): Promise<boolean> {
    if (this.isInitialized || this.isInitializing) {
      return this.isInitialized;
    }

    this.isInitializing = true;

    try {
      // Kiểm tra xem đã có dữ liệu cơ bản chưa
      const existingRecipes = await kitchenService.getRecipes();
      
      if (existingRecipes.length === 0) {
        console.log('🚀 Auto-initializing sample data...');
        
        // Tạo sample data
        const { recipes, dailyMenus } = SampleDataService.populateSampleData();
        
        // Tạo recipes trong service
        for (const recipe of recipes) {
          await kitchenService.createRecipe(recipe);
        }
        
        console.log(`✅ Created ${recipes.length} sample recipes`);
        console.log(`✅ Created ${dailyMenus.length} daily menu templates`);
      }

      // Nếu có userId, tạo meal plan mẫu cho user
      if (userId) {
        await this.ensureUserMealPlan(userId);
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Error auto-initializing sample data:', error);
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Đảm bảo user có meal plan cho hôm nay
   */
  static async ensureUserMealPlan(userId: string): Promise<boolean> {
    try {
      const existingPlans = await kitchenService.getMealPlans(userId);
      const todayMeals = await kitchenService.getTodayMeals(userId);

      // Nếu chưa có meals cho hôm nay, tạo meal plan mẫu
      if (todayMeals.length === 0) {
        console.log('🍽️ Creating sample meal plan for today...');
        
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        // Tạo meal plan nếu chưa có
        let mealPlan;
        if (existingPlans.length === 0) {
          mealPlan = await kitchenService.createMealPlan({
            userId: userId,
            name: 'Thực đơn tuần này',
            description: 'Thực đơn healthy cho tuần hiện tại',
            startDate: today.toISOString().split('T')[0],
            endDate: nextWeek.toISOString().split('T')[0]
          });
        } else {
          mealPlan = existingPlans[0];
        }

        // Tạo meals cho hôm nay
        const todayStr = today.toISOString().split('T')[0];
        
        const sampleMeals = [
          {
            mealPlanId: mealPlan.id,
            mealDate: todayStr,
            mealType: 'breakfast' as const,
            recipeId: 'vn_004', // Phở Gà
            completed: false
          },
          {
            mealPlanId: mealPlan.id,
            mealDate: todayStr,
            mealType: 'lunch' as const,
            recipeId: 'vn_005', // Cơm Tấm Sườn Nướng
            completed: false
          },
          {
            mealPlanId: mealPlan.id,
            mealDate: todayStr,
            mealType: 'dinner' as const,
            recipeId: 'vn_001', // Canh Chua Cá Lóc
            completed: false
          }
        ];

        for (const meal of sampleMeals) {
          await kitchenService.createMeal(meal);
        }

        console.log(`✅ Created ${sampleMeals.length} sample meals for today`);
        return true;
      }

      return true;
    } catch (error) {
      console.error('❌ Error ensuring user meal plan:', error);
      return false;
    }
  }

  /**
   * Tạo shopping status cho thực đơn hôm nay
   */
  static async ensureTodayShoppingStatus(userId: string): Promise<string | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Kiểm tra xem đã có shopping status cho hôm nay chưa
      const existingStatus = await kitchenService.getDailyShoppingStatus(userId, today);
      
      if (existingStatus) {
        return existingStatus.id;
      }

      // Tạo shopping status mới
      const shoppingStatus = await kitchenService.createDailyShoppingStatus({
        userId,
        date: today,
        status: 'not_started',
        totalEstimatedCost: 0,
        totalActualCost: 0
      });

      console.log('✅ Created shopping status for today');
      return shoppingStatus.id;
    } catch (error) {
      console.error('❌ Error ensuring shopping status:', error);
      return null;
    }
  }

  /**
   * Reset initialization state (for testing)
   */
  static reset() {
    this.isInitialized = false;
    this.isInitializing = false;
  }

  /**
   * Kiểm tra xem đã có dữ liệu mẫu chưa
   */
  static async hasSampleData(): Promise<boolean> {
    try {
      const recipes = await kitchenService.getRecipes();
      return recipes.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra xem user có thực đơn hôm nay chưa
   */
  static async hasTodayMenu(userId: string): Promise<boolean> {
    try {
      const todayMeals = await kitchenService.getTodayMeals(userId);
      return todayMeals.length > 0;
    } catch (error) {
      return false;
    }
  }
}
