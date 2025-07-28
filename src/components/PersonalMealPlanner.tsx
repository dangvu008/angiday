import React, { useState } from 'react';
import { Recipe, MealPlan, useMealPlanning } from '@/contexts/MealPlanningContext';
import { UserPreferences, AIGeneratedPlan, aiMealPlanGenerator } from '@/services/aiMealPlanGenerator';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeSelector from '@/components/RecipeSelector';
import MealPlanCalendar from '@/components/MealPlanCalendar';
import ShoppingListModal from '@/components/ShoppingListModal';
import MealPlanTemplates from '@/components/MealPlanTemplates';
import UserPreferencesModal from '@/components/UserPreferencesModal';
import AIPlanPreview from '@/components/AIPlanPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Save,
  Calendar,
  ChefHat,
  Settings,
  BookOpen,
  ShoppingCart,
  BarChart3,
  Trash2,
  Edit,
  Brain,
  Sparkles,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PersonalMealPlanner: React.FC = () => {
  const {
    currentPlan,
    setCurrentPlan,
    userMealPlans,
    availableRecipes,
    createNewPlan,
    saveMealPlan,
    deleteMealPlan,
    addMealToSlot,
    removeMealFromSlot,
    generateShoppingList
  } = useMealPlanning();

  const [isRecipeSelectorOpen, setIsRecipeSelectorOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: string } | null>(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  const [selectedRecipeForView, setSelectedRecipeForView] = useState<Recipe | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // AI-related states
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [isAIPlanPreviewOpen, setIsAIPlanPreviewOpen] = useState(false);

  // Handle creating new meal plan
  const handleCreatePlan = () => {
    if (!newPlanData.name || !newPlanData.startDate || !newPlanData.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const plan = createNewPlan(newPlanData.name, newPlanData.startDate, newPlanData.endDate);
    saveMealPlan(plan);
    setIsCreatePlanOpen(false);
    setNewPlanData({ name: '', startDate: '', endDate: '' });
    toast.success('Tạo kế hoạch bữa ăn thành công!');
  };

  // Handle adding meal to slot
  const handleAddMeal = (date: string, mealType: string) => {
    if (!currentPlan) {
      toast.error('Vui lòng chọn hoặc tạo kế hoạch bữa ăn trước');
      return;
    }
    setSelectedSlot({ date, mealType });
    setIsRecipeSelectorOpen(true);
  };

  // Handle selecting recipe
  const handleSelectRecipe = (recipe: Recipe) => {
    if (!currentPlan || !selectedSlot) return;
    
    addMealToSlot(currentPlan.id, selectedSlot.date, selectedSlot.mealType, recipe);
    setSelectedSlot(null);
    toast.success(`Đã thêm ${recipe.title} vào kế hoạch`);
  };

  // Handle removing meal
  const handleRemoveMeal = (date: string, mealType: string) => {
    if (!currentPlan) return;
    
    removeMealFromSlot(currentPlan.id, date, mealType);
    toast.success('Đã xóa món ăn khỏi kế hoạch');
  };

  // Handle viewing recipe details
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipeForView(recipe);
  };

  // Handle saving current plan
  const handleSavePlan = () => {
    if (!currentPlan) return;
    saveMealPlan(currentPlan);
    toast.success('Đã lưu kế hoạch bữa ăn');
  };

  // Handle deleting plan
  const handleDeletePlan = (planId: string) => {
    if (confirm('Bạn có chắc muốn xóa kế hoạch này?')) {
      deleteMealPlan(planId);
      toast.success('Đã xóa kế hoạch bữa ăn');
    }
  };

  // Generate shopping list
  const handleGenerateShoppingList = () => {
    if (!currentPlan) {
      toast.error('Vui lòng chọn kế hoạch bữa ăn trước');
      return;
    }
    setIsShoppingListOpen(true);
  };

  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const plan = createNewPlan(template.name, startDate, endDate);

    // Add template meals to plan (simplified)
    template.meals.forEach((meal: any, index: number) => {
      const mealDate = new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      // In real implementation, would map template recipes to actual recipes
    });

    saveMealPlan(plan);
    toast.success(`Đã tạo kế hoạch từ template: ${template.name}`);
  };

  // Handle AI meal plan generation
  const handleAIPreferences = async (preferences: UserPreferences) => {
    setIsPreferencesOpen(false);
    setIsAIGenerating(true);

    try {
      const generatedPlan = await aiMealPlanGenerator.generateMealPlan(preferences, availableRecipes);
      setAiGeneratedPlan(generatedPlan);
      setIsAIPlanPreviewOpen(true);
      toast.success('AI đã tạo thực đơn thành công!');
    } catch (error) {
      toast.error('Không thể tạo thực đơn. Vui lòng thử lại.');
      console.error('AI generation error:', error);
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Handle AI plan approval
  const handleAIPlanApproval = (aiPlan: AIGeneratedPlan) => {
    // Convert AI plan to regular meal plan
    const plan = createNewPlan(aiPlan.name, aiPlan.startDate, aiPlan.endDate);

    // Add AI meals to plan
    aiPlan.meals.forEach(aiMeal => {
      if (aiMeal.matchedRecipeId) {
        const recipe = availableRecipes.find(r => r.id === aiMeal.matchedRecipeId);
        if (recipe) {
          addMealToSlot(plan.id, aiMeal.date, aiMeal.mealType, recipe);
        }
      } else {
        // Create custom recipe from AI suggestion
        const customRecipe: Recipe = {
          id: `ai_recipe_${Date.now()}_${Math.random()}`,
          title: aiMeal.suggestedRecipe.title,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
          cookTime: aiMeal.suggestedRecipe.cookTime,
          servings: 2,
          difficulty: aiMeal.suggestedRecipe.difficulty,
          calories: aiMeal.suggestedRecipe.calories,
          ingredients: aiMeal.suggestedRecipe.ingredients,
          instructions: aiMeal.suggestedRecipe.instructions,
          category: 'AI đề xuất',
          tags: aiMeal.suggestedRecipe.tags
        };
        addMealToSlot(plan.id, aiMeal.date, aiMeal.mealType, customRecipe);
      }
    });

    saveMealPlan(plan);
    setIsAIPlanPreviewOpen(false);
    setAiGeneratedPlan(null);
    toast.success('Đã áp dụng thực đơn AI thành công!');
  };

  // Handle AI plan regeneration
  const handleAIRegenerate = () => {
    setIsAIPlanPreviewOpen(false);
    setIsPreferencesOpen(true);
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Calendar className="h-8 w-8 mr-3 text-orange-600" />
                    Kế hoạch bữa ăn cá nhân
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Tạo và quản lý thực đơn hàng tuần của bạn
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isAIGenerating}
                  >
                    {isAIGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI đang tạo...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Tạo với AI
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsTemplatesOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Chọn template
                  </Button>
                  <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo kế hoạch mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo kế hoạch bữa ăn mới</DialogTitle>
                        <DialogDescription>
                          Tạo kế hoạch bữa ăn cho tuần hoặc tháng
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="planName">Tên kế hoạch</Label>
                          <Input
                            id="planName"
                            placeholder="VD: Thực đơn tuần này"
                            value={newPlanData.name}
                            onChange={(e) => setNewPlanData({...newPlanData, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Ngày bắt đầu</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={newPlanData.startDate}
                              onChange={(e) => setNewPlanData({...newPlanData, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">Ngày kết thúc</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={newPlanData.endDate}
                              onChange={(e) => setNewPlanData({...newPlanData, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleCreatePlan}>
                          Tạo kế hoạch
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Current Plan Info */}
              {currentPlan && (
                <Card className="bg-gradient-to-r from-orange-50 to-green-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {currentPlan.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(currentPlan.startDate).toLocaleDateString('vi-VN')} - {new Date(currentPlan.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={handleSavePlan}>
                          <Save className="h-4 w-4 mr-2" />
                          Lưu
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleGenerateShoppingList}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Danh sách mua sắm
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* My Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Kế hoạch của tôi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {userMealPlans.length === 0 ? (
                      <p className="text-sm text-gray-600">
                        Chưa có kế hoạch nào
                      </p>
                    ) : (
                      userMealPlans.map(plan => (
                        <div
                          key={plan.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentPlan?.id === plan.id 
                              ? 'bg-orange-50 border-orange-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentPlan(plan)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{plan.name}</h4>
                              <p className="text-xs text-gray-600">
                                {plan.meals.length} bữa ăn
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlan(plan.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                {currentPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Thống kê
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tổng bữa ăn:</span>
                        <Badge variant="secondary">{currentPlan.meals.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Công thức khác nhau:</span>
                        <Badge variant="secondary">
                          {new Set(currentPlan.meals.map(m => m.recipe?.id)).size}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Main Calendar */}
              <div className="lg:col-span-3">
                <MealPlanCalendar
                  onAddMeal={handleAddMeal}
                  onViewRecipe={handleViewRecipe}
                  onRemoveMeal={handleRemoveMeal}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />

        {/* Recipe Selector Modal */}
        <RecipeSelector
          isOpen={isRecipeSelectorOpen}
          onClose={() => {
            setIsRecipeSelectorOpen(false);
            setSelectedSlot(null);
          }}
          onSelectRecipe={handleSelectRecipe}
          selectedDate={selectedSlot?.date}
          selectedMealType={selectedSlot?.mealType}
        />

        {/* Recipe Detail Modal */}
        {selectedRecipeForView && (
          <Dialog open={!!selectedRecipeForView} onOpenChange={() => setSelectedRecipeForView(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedRecipeForView.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedRecipeForView.image}
                  alt={selectedRecipeForView.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{selectedRecipeForView.cookTime}</div>
                    <div className="text-sm text-gray-600">Thời gian</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{selectedRecipeForView.servings}</div>
                    <div className="text-sm text-gray-600">Khẩu phần</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{selectedRecipeForView.calories || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Nguyên liệu:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRecipeForView.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm">{ingredient}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Shopping List Modal */}
        <ShoppingListModal
          isOpen={isShoppingListOpen}
          onClose={() => setIsShoppingListOpen(false)}
          mealPlan={currentPlan}
        />

        {/* Templates Modal */}
        <MealPlanTemplates
          isOpen={isTemplatesOpen}
          onClose={() => setIsTemplatesOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* AI Preferences Modal */}
        <UserPreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          onSubmit={handleAIPreferences}
          isLoading={isAIGenerating}
        />

        {/* AI Plan Preview Modal */}
        <AIPlanPreview
          isOpen={isAIPlanPreviewOpen}
          onClose={() => setIsAIPlanPreviewOpen(false)}
          onApprove={handleAIPlanApproval}
          onRegenerate={handleAIRegenerate}
          plan={aiGeneratedPlan}
          isLoading={isAIGenerating}
        />
      </div>
    </ProtectedRoute>
  );
};

export default PersonalMealPlanner;
