import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ChefHat, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MealPlan } from '@/types/kitchen';
import { mealPlanningService } from '@/services/mealPlanningService';
import { cn } from '@/lib/utils';

interface ApplyMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (planId: string, date: string, mealType: string) => void;
  preselectedDate?: string;
  preselectedMealType?: string;
}

const ApplyMealPlanModal: React.FC<ApplyMealPlanModalProps> = ({
  isOpen,
  onClose,
  onApply,
  preselectedDate,
  preselectedMealType
}) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    preselectedDate || new Date().toISOString().split('T')[0]
  );
  const [selectedMealType, setSelectedMealType] = useState<string>(
    preselectedMealType || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

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

  const handleApply = async () => {
    if (!selectedPlan || !selectedDate || !selectedMealType) {
      return;
    }

    setIsApplying(true);
    try {
      await mealPlanningService.applyMealPlanToMeal(
        selectedPlan,
        selectedDate,
        selectedMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      );
      
      onApply(selectedPlan, selectedDate, selectedMealType);
      onClose();
    } catch (error) {
      console.error('Error applying meal plan:', error);
    } finally {
      setIsApplying(false);
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
            <Calendar className="h-5 w-5 mr-2 text-orange-500" />
            Áp dụng Thực đơn
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

        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Date and Meal Type Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Chọn ngày
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

          {/* Meal Plans Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Chọn thực đơn
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải thực đơn...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {mealPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedPlan === plan.id
                        ? "ring-2 ring-orange-500 bg-orange-50"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">
                              {getCategoryIcon(plan.category)}
                            </span>
                            <h4 className="font-medium text-gray-900">
                              {plan.name}
                            </h4>
                            {selectedPlan === plan.id && (
                              <Check className="h-4 w-4 text-orange-500" />
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {plan.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{plan.totalTime} phút</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{plan.servings} người</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ChefHat className="h-4 w-4" />
                              <span>{plan.recipes.length} món</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-3">
                            {plan.difficulty && (
                              <Badge className={getDifficultyColor(plan.difficulty)}>
                                {plan.difficulty === 'easy' && 'Dễ'}
                                {plan.difficulty === 'medium' && 'Trung bình'}
                                {plan.difficulty === 'hard' && 'Khó'}
                              </Badge>
                            )}
                            
                            {plan.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
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
          </div>

          {/* Preview */}
          {selectedPlan && selectedDate && selectedMealType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Xem trước áp dụng
              </h4>
              <p className="text-sm text-blue-700">
                Thực đơn "{mealPlans.find(p => p.id === selectedPlan)?.name}" 
                sẽ được áp dụng cho {getMealTypeLabel(selectedMealType).toLowerCase()} 
                ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isApplying}
            >
              Hủy
            </Button>
            
            <Button
              onClick={handleApply}
              disabled={!selectedPlan || !selectedDate || !selectedMealType || isApplying}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang áp dụng...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Áp dụng thực đơn
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplyMealPlanModal;
