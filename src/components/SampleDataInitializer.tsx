import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { SampleDataService } from '@/services/sampleDataService';
import { kitchenService } from '@/services/kitchenService';
import { useAuth } from '@/contexts/AuthContext';
import { useKitchen } from '@/contexts/KitchenContext';

interface SampleDataInitializerProps {
  onDataInitialized?: () => void;
  autoInitialize?: boolean;
  showUI?: boolean;
}

const SampleDataInitializer: React.FC<SampleDataInitializerProps> = ({
  onDataInitialized,
  autoInitialize = false,
  showUI = true
}) => {
  const { user, isAuthenticated } = useAuth();
  const { refreshTodayMeals, refreshRecipes, refreshMealPlans, refreshTodayMenuStatus } = useKitchen();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [dataStats, setDataStats] = useState({
    recipes: 0,
    dailyMenus: 0,
    mealPlans: 0,
    todayMeals: 0
  });

  // Auto-initialize on mount if enabled
  useEffect(() => {
    if (autoInitialize && isAuthenticated && user) {
      initializeSampleData();
    }
  }, [autoInitialize, isAuthenticated, user]);

  // Check existing data on mount
  useEffect(() => {
    checkExistingData();
  }, []);

  const checkExistingData = async () => {
    try {
      const recipes = await kitchenService.getRecipes();
      const dailyMenus = kitchenService.getDailyMenuPlans();
      
      let mealPlans = 0;
      let todayMeals = 0;
      
      if (user) {
        const plans = await kitchenService.getMealPlans(user.id);
        mealPlans = plans.length;
        
        const meals = await kitchenService.getTodayMeals(user.id);
        todayMeals = meals.length;
      }

      setDataStats({
        recipes: recipes.length,
        dailyMenus: dailyMenus.length,
        mealPlans,
        todayMeals
      });
    } catch (error) {
      console.error('Error checking existing data:', error);
    }
  };

  const initializeSampleData = async () => {
    if (!user) {
      setInitStatus('error');
      setStatusMessage('Vui lòng đăng nhập để khởi tạo dữ liệu');
      return;
    }

    setIsInitializing(true);
    setInitStatus('idle');
    setStatusMessage('Đang khởi tạo dữ liệu mẫu...');

    try {
      // Step 1: Initialize sample data in localStorage
      setStatusMessage('Tạo dữ liệu công thức và thực đơn...');
      const { recipes, dailyMenus } = SampleDataService.populateSampleData();

      // Step 2: Create recipes in service if they don't exist
      setStatusMessage('Lưu công thức vào hệ thống...');
      const existingRecipes = await kitchenService.getRecipes();
      
      if (existingRecipes.length === 0) {
        for (const recipe of recipes) {
          await kitchenService.createRecipe(recipe);
        }
      }

      // Step 3: Create sample meal plan if none exists
      setStatusMessage('Tạo kế hoạch bữa ăn...');
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

        // Add sample meals for today
        const todayStr = today.toISOString().split('T')[0];
        
        setStatusMessage('Thêm bữa ăn cho hôm nay...');
        await kitchenService.createMeal({
          mealPlanId: samplePlan.id,
          mealDate: todayStr,
          mealType: 'breakfast',
          recipeId: 'vn_004', // Phở Gà
          completed: false
        });

        await kitchenService.createMeal({
          mealPlanId: samplePlan.id,
          mealDate: todayStr,
          mealType: 'lunch',
          recipeId: 'vn_005', // Cơm Tấm Sườn Nướng
          completed: false
        });

        await kitchenService.createMeal({
          mealPlanId: samplePlan.id,
          mealDate: todayStr,
          mealType: 'dinner',
          recipeId: 'vn_001', // Canh Chua Cá Lóc
          completed: false
        });
      }

      // Step 4: Refresh all data in context
      setStatusMessage('Cập nhật dữ liệu...');
      await Promise.all([
        refreshRecipes(),
        refreshMealPlans(),
        refreshTodayMeals(),
        refreshTodayMenuStatus()
      ]);

      // Step 5: Check final stats
      await checkExistingData();

      setInitStatus('success');
      setStatusMessage('Khởi tạo dữ liệu thành công!');
      
      if (onDataInitialized) {
        onDataInitialized();
      }

    } catch (error) {
      console.error('Error initializing sample data:', error);
      setInitStatus('error');
      setStatusMessage(`Lỗi khởi tạo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả dữ liệu mẫu?')) return;

    setIsInitializing(true);
    setStatusMessage('Đang xóa dữ liệu...');

    try {
      SampleDataService.clearSampleData();
      
      // Clear localStorage completely
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('kitchen_')) {
          localStorage.removeItem(key);
        }
      });

      await checkExistingData();
      setInitStatus('success');
      setStatusMessage('Đã xóa tất cả dữ liệu mẫu');
    } catch (error) {
      console.error('Error clearing data:', error);
      setInitStatus('error');
      setStatusMessage('Lỗi khi xóa dữ liệu');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!showUI) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Quản lý dữ liệu mẫu
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Data Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dataStats.recipes}</div>
            <div className="text-sm text-gray-600">Công thức</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{dataStats.dailyMenus}</div>
            <div className="text-sm text-gray-600">Thực đơn</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{dataStats.mealPlans}</div>
            <div className="text-sm text-gray-600">Kế hoạch</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{dataStats.todayMeals}</div>
            <div className="text-sm text-gray-600">Bữa hôm nay</div>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
            {initStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {initStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
            {isInitializing && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            <span className="text-sm">{statusMessage}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div>
            {dataStats.recipes > 0 ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Đã có dữ liệu
              </Badge>
            ) : (
              <Badge variant="secondary">
                Chưa có dữ liệu
              </Badge>
            )}
          </div>
          
          {!isAuthenticated && (
            <Badge variant="outline" className="text-orange-600">
              Cần đăng nhập
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={initializeSampleData}
            disabled={isInitializing || !isAuthenticated}
            className="flex-1"
          >
            {isInitializing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang khởi tạo...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Khởi tạo dữ liệu mẫu
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={checkExistingData}
            disabled={isInitializing}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {dataStats.recipes > 0 && (
            <Button
              variant="destructive"
              onClick={clearAllData}
              disabled={isInitializing}
            >
              Xóa tất cả
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <div className="text-sm text-gray-600 text-center">
            Vui lòng đăng nhập để khởi tạo dữ liệu mẫu và sử dụng đầy đủ tính năng
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SampleDataInitializer;
