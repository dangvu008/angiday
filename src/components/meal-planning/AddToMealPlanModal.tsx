import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Clock, Users, ChefHat, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealPlan, Recipe } from '@/types/kitchen';
import { mealPlanningService } from '@/services/mealPlanningService';
import { cn } from '@/lib/utils';

interface AddToMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  onSuccess: (planId: string, action: 'added-to-plan' | 'added-to-meal') => void;
}

const AddToMealPlanModal: React.FC<AddToMealPlanModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'direct'>('existing');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Load meal plans
  useEffect(() => {
    if (isOpen) {
      loadMealPlans();
    }
  }, [isOpen]);

  const loadMealPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await mealPlanningService.getMealPlans();
      setMealPlans(plans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToExistingPlan = async () => {
    if (!selectedPlan) return;

    setIsAdding(true);
    try {
      await mealPlanningService.addRecipeToMealPlan(selectedPlan, recipe);
      onSuccess(selectedPlan, 'added-to-plan');
      onClose();
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddDirectToMeal = async () => {
    if (!selectedDate || !selectedMealType) return;

    setIsAdding(true);
    try {
      await mealPlanningService.addCustomRecipeToMeal(
        selectedDate,
        selectedMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        recipe
      );
      onSuccess('', 'added-to-meal');
      onClose();
    } catch (error) {
      console.error('Error adding recipe to meal:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối',
      snack: 'Bữa phụ'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍪';
      default: return '🍳';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Plus className="h-5 w-5 mr-2 text-green-500" />
            Thêm món vào thực đơn
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Recipe Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{recipe.cooking_time || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{recipe.servings || 'N/A'} người</span>
                  </div>
                  {recipe.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{recipe.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'existing' | 'direct')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Thêm vào thực đơn có sẵn</TabsTrigger>
              <TabsTrigger value="direct">Thêm trực tiếp vào bữa ăn</TabsTrigger>
            </TabsList>

            {/* Add to Existing Plan */}
            <TabsContent value="existing" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chọn thực đơn
                </h3>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải thực đơn...</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {mealPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md",
                          selectedPlan === plan.id
                            ? "ring-2 ring-green-500 bg-green-50"
                            : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {getCategoryIcon(plan.category)}
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {plan.name}
                                </h4>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{plan.recipes.length} món</span>
                                  <span>{plan.totalTime} phút</span>
                                  <span>{plan.servings} người</span>
                                </div>
                              </div>
                            </div>
                            {selectedPlan === plan.id && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {mealPlans.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <ChefHat className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Chưa có thực đơn nào</p>
                        <p className="text-sm">Tạo thực đơn mới để bắt đầu</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedPlan && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      Xem trước
                    </h4>
                    <p className="text-sm text-green-700">
                      Món "{recipe.title}" sẽ được thêm vào thực đơn "
                      {mealPlans.find(p => p.id === selectedPlan)?.name}"
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Add Direct to Meal */}
            <TabsContent value="direct" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Chọn ngày
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Chọn bữa ăn
                  </label>
                  <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bữa ăn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">🌅 Bữa sáng</SelectItem>
                      <SelectItem value="lunch">🍽️ Bữa trưa</SelectItem>
                      <SelectItem value="dinner">🌙 Bữa tối</SelectItem>
                      <SelectItem value="snack">🍪 Bữa phụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedDate && selectedMealType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Xem trước
                  </h4>
                  <p className="text-sm text-blue-700">
                    Món "{recipe.title}" sẽ được thêm vào {getMealTypeLabel(selectedMealType).toLowerCase()} 
                    ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isAdding}
            >
              Hủy
            </Button>
            
            <Button
              onClick={activeTab === 'existing' ? handleAddToExistingPlan : handleAddDirectToMeal}
              disabled={
                isAdding || 
                (activeTab === 'existing' && !selectedPlan) ||
                (activeTab === 'direct' && (!selectedDate || !selectedMealType))
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {activeTab === 'existing' ? 'Thêm vào thực đơn' : 'Thêm vào bữa ăn'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddToMealPlanModal;
