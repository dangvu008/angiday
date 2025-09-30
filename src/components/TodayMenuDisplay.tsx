import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useKitchen } from '@/contexts/KitchenContext';
import { useAuth } from '@/contexts/AuthContext';
import { MealItem } from '@/types/kitchen';
import TodayMenuSlider from '@/components/TodayMenuSlider';
import { AutoSampleDataManager } from '@/utils/autoSampleData';

interface TodayMenuDisplayProps {
  className?: string;
}

const TodayMenuDisplay: React.FC<TodayMenuDisplayProps> = ({ className = '' }) => {
  const { todayMeals, isLoading, refreshTodayMeals } = useKitchen();
  const { isAuthenticated, user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);

  // Tự động khởi tạo dữ liệu mẫu khi cần thiết
  useEffect(() => {
    const initializeData = async () => {
      if (isAuthenticated && user && (!todayMeals || todayMeals.source === 'empty')) {
        setIsInitializing(true);
        try {
          await AutoSampleDataManager.ensureSampleData(user.id);
          await refreshTodayMeals();
        } catch (error) {
          console.error('Error initializing sample data:', error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeData();
  }, [isAuthenticated, user, todayMeals, refreshTodayMeals]);

  // Meal types in order
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  const mealDisplayNames = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    snack: 'Bữa phụ'
  };

  // Get meals array from todayMeals
  const mealsArray = mealTypes.map(mealType => ({
    type: mealType,
    displayName: mealDisplayNames[mealType],
    meal: todayMeals?.meals[mealType] || null
  }));

  // Loading state
  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thực đơn...</p>
        </CardContent>
      </Card>
    );
  }

  if (!todayMeals || todayMeals.source === 'empty') {
    if (isInitializing) {
      return (
        <Card className={`w-full ${className}`}>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thực đơn hôm nay...</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <TodayMenuSlider
        meals={[]}
        className={className}
      />
    );
  }

  // Convert mealsArray to MealItem format for TodayMenuSlider
  const mealItems: MealItem[] = mealsArray
    .filter(mealData => mealData.meal)
    .map(mealData => mealData.meal as MealItem);

  return (
    <div className={className}>
      {/* Show fallback data warning */}
      {todayMeals && 'source' in todayMeals && (todayMeals as any).source === 'fallback' && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 mb-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Đang sử dụng dữ liệu mẫu do không thể kết nối database.
            <a href="/debug-db" className="underline ml-1">Kiểm tra kết nối</a>
          </p>
        </div>
      )}

      <TodayMenuSlider
        meals={mealItems}
        onMealSelect={(meal) => {
          console.log('Selected meal:', meal);
          // Handle meal selection if needed
        }}
      />
    </div>
  );
};

export default TodayMenuDisplay;
