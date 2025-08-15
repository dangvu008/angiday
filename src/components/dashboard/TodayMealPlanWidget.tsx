import React, { useMemo, useState } from 'react';
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
import MealPlanContent from './widget-components/MealPlanContent';
import WidgetFooter from './widget-components/WidgetFooter';
import AddMealModal from './widget-components/AddMealModal';
import RecipeDetailModal from './widget-components/RecipeDetailModal';
import ShoppingListModal from './widget-components/ShoppingListModal';
import AISuggestionModal from './widget-components/AISuggestionModal';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { useNavigate } from 'react-router-dom';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { useKitchen } from '@/contexts/KitchenContext';
import { CookingOptimizer } from '@/utils/cookingOptimizer';
import { CookingSession } from '@/types/cookingMode';
import UnifiedShoppingListModal from '@/components/UnifiedShoppingListModal';

const TodayMealPlanWidget: React.FC<TodayMealPlanWidgetProps> = ({ className }) => {
  const { widgetStateData, actions } = useTodayMealWidget();
  const { availableRecipes, activePlan } = useMealPlanning();
  const { startSession } = useCookingMode();
  const { createTodayShoppingList, todayMenuStatus, dailyShoppingStatus } = useKitchen();
  const navigate = useNavigate();

  // Modal states
  const [addMealModal, setAddMealModal] = useState<{
    isOpen: boolean;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  }>({
    isOpen: false,
    mealType: null
  });

  const [recipeDetailModal, setRecipeDetailModal] = useState<{
    isOpen: boolean;
    recipeId: string | null;
  }>({
    isOpen: false,
    recipeId: null
  });

  const [shoppingListModal, setShoppingListModal] = useState<{
    isOpen: boolean;
    shoppingList: { [category: string]: string[] };
  }>({
    isOpen: false,
    shoppingList: {}
  });

  const [aiSuggestionModal, setAiSuggestionModal] = useState(false);
  const [unifiedShoppingModal, setUnifiedShoppingModal] = useState(false);

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
  const handleCreatePlan = async () => {
    try {
      await actions.createTodayPlan();
      // The widget will automatically update when the plan is created
      // No need to navigate away - user can start adding meals right here
    } catch (error) {
      console.error('Error creating today plan:', error);
      // TODO: Show error toast
    }
  };

  const handleCreateShoppingList = async () => {
    try {
      console.log('🛒 Creating shopping list from today meal plan...');

      // Try to create shopping list using KitchenContext first
      if (createTodayShoppingList) {
        const result = await createTodayShoppingList();
        console.log('✅ Shopping list created:', result);

        // Open unified shopping modal with daily shopping status
        setUnifiedShoppingModal(true);
        return;
      }

      // Fallback to widget actions
      const shoppingList = await actions.createShoppingList();
      if (shoppingList) {
        setShoppingListModal({
          isOpen: true,
          shoppingList: shoppingList
        });
      }
    } catch (error) {
      console.error('❌ Error creating shopping list:', error);
      // Still try to open the modal for manual shopping list creation
      setUnifiedShoppingModal(true);
    }
  };

  const handleStartCooking = async () => {
    if (!widgetStateData.todayPlan || !widgetStateData.nextMealType) return;

    // Get recipes for the next meal
    const mealSlot = widgetStateData.todayPlan.meals[widgetStateData.nextMealType];
    if (!mealSlot || mealSlot.meals.length === 0) return;

    // Convert meal items to recipes format expected by CookingModeStarter
    const recipes = mealSlot.meals.map(meal => {
      const recipe = availableRecipes.find(r => r.id === meal.recipeId);
      if (!recipe) {
        // Create a basic recipe structure if not found
        return {
          id: meal.id,
          name: meal.name,
          description: meal.description || '',
          ingredients: meal.ingredients,
          instructions: [`Nấu ${meal.name} theo hướng dẫn`],
          prepTime: Math.floor(meal.cookingTime * 0.3),
          cookTime: Math.floor(meal.cookingTime * 0.7),
          difficulty: 'medium' as const,
          servings: meal.servings,
          tags: []
        };
      }
      return recipe;
    });

    try {
      // Convert to cooking recipes
      const cookingRecipes = recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.instructions.map((instruction, index) => ({
          id: `${recipe.id}-step-${index + 1}`,
          stepNumber: index + 1,
          instruction,
          ingredients: [],
          timers: CookingOptimizer.extractTimersFromInstruction(instruction, `${recipe.id}-step-${index + 1}`),
          estimatedTime: 5
        })),
        totalTime: recipe.prepTime + recipe.cookTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        tags: recipe.tags
      }));

      // Create optimized timeline
      const mealTypeLabels = {
        breakfast: 'Bữa Sáng',
        lunch: 'Bữa Trưa',
        dinner: 'Bữa Tối',
        snack: 'Bữa Phụ'
      };

      const timeline = cookingRecipes.length === 1
        ? CookingOptimizer.createSingleRecipeTimeline(cookingRecipes[0])
        : CookingOptimizer.createOptimizedTimeline(cookingRecipes, mealTypeLabels[widgetStateData.nextMealType]);

      // Create cooking session
      const session: CookingSession = {
        id: `session-${Date.now()}`,
        timeline,
        currentStepIndex: 0,
        startTime: new Date(),
        activeTimers: [],
        completedSteps: [],
        settings: {
          keepScreenOn: true,
          darkMode: true,
          fontSize: 'large',
          voiceEnabled: false,
          voiceLanguage: 'vi-VN',
          gestureControlEnabled: false,
          autoAdvanceSteps: false,
          timerSounds: true,
          vibrationAlerts: true,
          layout: 'mobile'
        },
        status: 'active'
      };

      // Start session
      startSession(session);

      // Navigate to cooking mode
      navigate('/cooking-mode');

    } catch (error) {
      console.error('Error starting cooking mode:', error);
    }
  };

  const handlePlanTomorrow = () => {
    // Navigate to meal planner for tomorrow
    window.location.href = '/meal-planner?date=tomorrow';
  };

  const handleViewRecipe = (recipeId: string) => {
    setRecipeDetailModal({
      isOpen: true,
      recipeId: recipeId
    });
  };

  const handleAddMeal = (mealType: string) => {
    setAddMealModal({
      isOpen: true,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
    });
  };

  const handleAddMealConfirm = async (recipeId: string) => {
    console.log('🎯 TodayMealPlanWidget.handleAddMealConfirm:', { mealType: addMealModal.mealType, recipeId });

    if (!addMealModal.mealType) {
      console.error('❌ No meal type selected');
      alert('Lỗi: Không xác định được loại bữa ăn');
      return;
    }

    try {
      await actions.addMealToSlot(addMealModal.mealType, recipeId);
      console.log('✅ Meal added successfully');

      // Đóng modal sau khi thêm thành công
      setAddMealModal({ isOpen: false, mealType: null });

      // Thông báo thành công (tùy chọn)
      // alert('Đã thêm món thành công!');

    } catch (error) {
      console.error('❌ Error adding meal:', error);
      alert('Có lỗi xảy ra khi thêm món. Vui lòng thử lại.');
    }
  };



  const handleRemoveMeal = (mealType: string, mealId?: string) => {
    console.log('🗑️ TodayMealPlanWidget.handleRemoveMeal called:', { mealType, mealId });

    // Debug: Kiểm tra dữ liệu và activePlan
    console.log('🔍 DEBUG - TodayMealPlanWidget.handleRemoveMeal:');
    console.log('- mealType:', mealType);
    console.log('- mealId:', mealId);
    console.log('- typeof mealId:', typeof mealId);
    console.log('- activePlan exists:', !!activePlan);
    console.log('- activePlan.id:', activePlan?.id);
    console.log('- activePlan meals count:', activePlan?.meals?.length || 0);

    if (activePlan) {
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = activePlan.meals.filter(m => m.date === today);
      console.log('- Today meals in activePlan:', todayMeals.map(m => ({
        id: m.id,
        mealType: m.mealType,
        recipeTitle: m.recipe?.title
      })));

      // Tìm meal cụ thể cần xóa
      const mealToRemove = todayMeals.find(m => m.id === mealId);
      console.log('- Meal to remove found:', !!mealToRemove);
      if (mealToRemove) {
        console.log('- Meal to remove details:', {
          id: mealToRemove.id,
          mealType: mealToRemove.mealType,
          recipeTitle: mealToRemove.recipe?.title,
          date: mealToRemove.date
        });
      }
    }

    try {
      actions.removeMealFromSlot(mealType, mealId);
      console.log('✅ TodayMealPlanWidget.handleRemoveMeal completed successfully');
    } catch (error) {
      console.error('❌ TodayMealPlanWidget.handleRemoveMeal error:', error);
    }
  };

  const handleAISuggestion = () => {
    setAiSuggestionModal(true);
  };

  const handleGenerateAISuggestions = async (preferences: any) => {
    if (actions.requestAISuggestion) {
      await actions.requestAISuggestion();
    }
    // TODO: Implement actual AI suggestion logic
    console.log('Generating AI suggestions with preferences:', preferences);
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
            Chỉnh sửa trong Kế Hoạch Tuần <ArrowRight className="h-4 w-4" />
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
          // Có kế hoạch - hiển thị danh sách các bữa ăn theo chiều dọc
          <MealPlanContent
            todayPlan={widgetStateData.todayPlan!}
            onViewRecipe={handleViewRecipe}
            onAddMeal={handleAddMeal}
            onRemoveMeal={handleRemoveMeal}
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
            onAISuggestion={handleAISuggestion}
          />
        )}


      </CardContent>

      {/* Modals */}
      <AddMealModal
        isOpen={addMealModal.isOpen}
        onClose={() => setAddMealModal({ isOpen: false, mealType: null })}
        mealType={addMealModal.mealType || 'breakfast'}
        onAddMeal={handleAddMealConfirm}
      />

      <RecipeDetailModal
        isOpen={recipeDetailModal.isOpen}
        onClose={() => setRecipeDetailModal({ isOpen: false, recipeId: null })}
        recipeId={recipeDetailModal.recipeId}
      />

      <ShoppingListModal
        isOpen={shoppingListModal.isOpen}
        onClose={() => setShoppingListModal({ isOpen: false, shoppingList: {} })}
        shoppingList={shoppingListModal.shoppingList}
      />

      <AISuggestionModal
        isOpen={aiSuggestionModal}
        onClose={() => setAiSuggestionModal(false)}
        onGenerateSuggestions={handleGenerateAISuggestions}
      />

      <UnifiedShoppingListModal
        isOpen={unifiedShoppingModal}
        onClose={() => setUnifiedShoppingModal(false)}
        mealPlan={activePlan}
        dailyShoppingStatusId={dailyShoppingStatus?.id}
        enablePriceTracking={true}
        enableCategoryBreakdown={true}
        enableExport={true}
        mode="enhanced"
      />
    </Card>
  );
};

export default TodayMealPlanWidget;
