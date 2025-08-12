import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ShoppingCart,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  TodayMealPlanWidget as TodayMealPlanWidgetProps,
  MEAL_TYPE_CONFIGS
} from '@/types/today-meal-widget';
import { useTodayMealWidget } from '@/hooks/useTodayMealWidget';
import MealCarousel from './widget-components/MealCarousel';
import WidgetFooter from './widget-components/WidgetFooter';

const TodayMealPlanWidget: React.FC<TodayMealPlanWidgetProps> = ({ className }) => {
  const { widgetStateData, actions } = useTodayMealWidget();

  // Lấy ngày hôm nay
  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Handlers
  const handleCreatePlan = () => {
    actions.createTodayPlan();
    // Navigate to meal planner
    window.location.href = '/meal-planner';
  };

  const handleCreateShoppingList = () => {
    actions.createShoppingList();
    // Navigate to shopping list creation
    window.location.href = '/shopping-list';
  };

  const handleStartCooking = () => {
    if (widgetStateData.nextMealType) {
      actions.startCookingMode(widgetStateData.nextMealType);
      // Navigate to cooking mode
      window.location.href = `/cooking/${widgetStateData.nextMealType}`;
    }
  };

  const handlePlanTomorrow = () => {
    // Navigate to meal planner for tomorrow
    window.location.href = '/meal-planner?date=tomorrow';
  };

  const handleViewRecipe = (recipeId: string) => {
    window.location.href = `/recipes/${recipeId}`;
  };

  const handleReplaceMeal = (mealType: string) => {
    actions.replaceMealInSlot(mealType, 'new-meal-id');
  };

  const handleRemoveMeal = (mealType: string) => {
    actions.removeMealFromSlot(mealType);
  };

  const handleAddMeal = (mealType: string) => {
    actions.addMealToSlot(mealType, 'new-meal-id');
  };

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br from-primary-50 to-secondary-50 ${className}`}>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600 flex-shrink-0" />
            <span className="line-clamp-2">Thực Đơn Hôm Nay: {todayDate}</span>
          </CardTitle>
          <Link
            to="/meal-planner"
            className="text-sm text-neutral-600 hover:text-primary-600 flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            Xem & Sửa Kế Hoạch Tuần <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* Nội dung chính */}
        {widgetStateData.state === 'no-plan' ? (
          // Trạng thái 1: Chưa có kế hoạch
          <div className="text-center py-8 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">📅</div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 sm:mb-3">
              Hôm nay bạn chưa có kế hoạch nào.
            </h3>
            <p className="text-neutral-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
              Hãy bắt đầu để Angiday giúp bạn có một ngày ăn uống thật tuyệt vời!
            </p>
            <Button
              onClick={handleCreatePlan}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Lên Kế Hoạch Cho Hôm Nay
            </Button>
          </div>
        ) : (
          // Có kế hoạch - hiển thị carousel các bữa ăn
          <MealCarousel
            todayPlan={widgetStateData.todayPlan!}
            currentMealType={widgetStateData.nextMealType}
            onViewRecipe={handleViewRecipe}
            onReplaceMeal={handleReplaceMeal}
            onRemoveMeal={handleRemoveMeal}
            onAddMeal={handleAddMeal}
          />
        )}

        {/* Footer với trạng thái và hành động */}
        {widgetStateData.state !== 'no-plan' && (
          <WidgetFooter
            state={widgetStateData.state}
            shoppingStatus={widgetStateData.shoppingStatus}
            nextMealType={widgetStateData.nextMealType}
            onCreatePlan={handleCreatePlan}
            onCreateShoppingList={handleCreateShoppingList}
            onStartCooking={handleStartCooking}
            onPlanTomorrow={handlePlanTomorrow}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TodayMealPlanWidget;
