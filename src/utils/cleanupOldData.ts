/**
 * Utility để xóa dữ liệu cũ với UUID không hợp lệ
 */

import { getSupabaseClient } from '@/config/supabase';

export class DataCleanupService {
  /**
   * Xóa dữ liệu với user_id không phải UUID hợp lệ
   */
  static async cleanupInvalidUserIds(): Promise<void> {
    try {
      console.log('🧹 Bắt đầu dọn dẹp dữ liệu cũ...');
      const supabase = getSupabaseClient();

      // Xóa meal_plans với user_id không hợp lệ
      const { error: mealPlansError } = await supabase
        .from('meal_plans')
        .delete()
        .like('user_id', 'demo-%')
        .or('user_id.like.admin-%');

      if (mealPlansError) {
        console.error('Lỗi xóa meal_plans:', mealPlansError);
      } else {
        console.log('✅ Đã xóa meal_plans cũ');
      }

      // Xóa meals với user_id không hợp lệ (thông qua meal_plan_id)
      const { error: mealsError } = await supabase
        .from('meals')
        .delete()
        .in('meal_plan_id', [
          // Có thể cần query để lấy danh sách meal_plan_id cũ
        ]);

      // Xóa shopping_lists với user_id không hợp lệ
      const { error: shoppingError } = await supabase
        .from('shopping_lists')
        .delete()
        .like('user_id', 'demo-%')
        .or('user_id.like.admin-%');

      if (shoppingError) {
        console.error('Lỗi xóa shopping_lists:', shoppingError);
      } else {
        console.log('✅ Đã xóa shopping_lists cũ');
      }

      // Xóa inventory với user_id không hợp lệ
      const { error: inventoryError } = await supabase
        .from('inventory')
        .delete()
        .like('user_id', 'demo-%')
        .or('user_id.like.admin-%');

      if (inventoryError) {
        console.error('Lỗi xóa inventory:', inventoryError);
      } else {
        console.log('✅ Đã xóa inventory cũ');
      }

      console.log('🎉 Hoàn thành dọn dẹp dữ liệu cũ!');
    } catch (error) {
      console.error('❌ Lỗi trong quá trình dọn dẹp:', error);
    }
  }

  /**
   * Xóa toàn bộ localStorage để reset
   */
  static clearLocalStorage(): void {
    try {
      console.log('🧹 Xóa localStorage...');
      
      // Xóa các key liên quan đến auth
      localStorage.removeItem('auth_user');
      localStorage.removeItem('registered_users');
      
      // Xóa các key liên quan đến kitchen
      localStorage.removeItem('kitchen_recipes');
      localStorage.removeItem('kitchen_meal_plans');
      localStorage.removeItem('kitchen_meals');
      localStorage.removeItem('kitchen_shopping_lists');
      localStorage.removeItem('kitchen_inventory');
      localStorage.removeItem('kitchen_daily_menus');
      
      console.log('✅ Đã xóa localStorage');
    } catch (error) {
      console.error('❌ Lỗi xóa localStorage:', error);
    }
  }

  /**
   * Reset hoàn toàn dữ liệu
   */
  static async fullReset(): Promise<void> {
    console.log('🔄 Bắt đầu reset hoàn toàn...');
    
    // Xóa localStorage trước
    this.clearLocalStorage();
    
    // Xóa dữ liệu Supabase
    await this.cleanupInvalidUserIds();
    
    // Reload trang để áp dụng thay đổi
    window.location.reload();
  }
}

// Export để có thể gọi từ console
(window as any).DataCleanupService = DataCleanupService;
