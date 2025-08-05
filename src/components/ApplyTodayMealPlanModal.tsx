import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ChefHat, Check, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface ApplyTodayMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (planId: string) => void;
}

const ApplyTodayMealPlanModal: React.FC<ApplyTodayMealPlanModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const { userMealPlans, setActivePlan } = useMealPlanning();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date().toLocaleDateString('vi-VN');

  // Filter meal plans that have meals for today or can be applied to today
  const availablePlans = userMealPlans.filter(plan => {
    // Check if plan has meals for today
    const hasTodayMeals = plan.meals.some(meal => meal.date === today);
    
    // Check if plan is within date range
    const planStartDate = new Date(plan.startDate);
    const planEndDate = new Date(plan.endDate);
    const todayDate = new Date(today);
    
    const isWithinRange = todayDate >= planStartDate && todayDate <= planEndDate;
    
    // Show plan if it has meals for today OR if it's within date range
    return hasTodayMeals || isWithinRange;
  });

  const handleApply = async () => {
    if (!selectedPlan) return;

    setIsApplying(true);
    try {
      // Find the selected plan
      const planToApply = userMealPlans.find(plan => plan.id === selectedPlan);
      
      if (planToApply) {
        // Set as active plan
        setActivePlan(planToApply);
        
        // Save to localStorage
        localStorage.setItem('activeMealPlan', JSON.stringify(planToApply));
        
        if (onApply) {
          onApply(selectedPlan);
        }
        
        // Show success message
        alert(`Đã áp dụng kế hoạch "${planToApply.name}" cho hôm nay! Trang sẽ được tải lại.`);
        
        // Reload page to show new meal plan
        window.location.reload();
      }
      
      onClose();
    } catch (error) {
      console.error('Error applying meal plan:', error);
      alert('Có lỗi xảy ra khi áp dụng kế hoạch. Vui lòng thử lại.');
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Áp dụng kế hoạch cho hôm nay ({todayDate})
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isApplying}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Chọn một kế hoạch bữa ăn có sẵn để áp dụng cho ngày hôm nay
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {availablePlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePlans.map((plan) => {
                const todayMeals = plan.meals.filter(meal => meal.date === today);
                const totalMeals = plan.meals.length;
                const hasTodayMeals = todayMeals.length > 0;
                
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md',
                      selectedPlan === plan.id && 'ring-2 ring-orange-500 ring-offset-2'
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      {/* Plan Info */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        {plan.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {plan.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {new Date(plan.endDate).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center">
                            <ChefHat className="h-3 w-3 mr-1" />
                            {totalMeals} món
                          </div>
                        </div>

                        {/* Today's meals status */}
                        <div className="mb-3">
                          {hasTodayMeals ? (
                            <Badge className="bg-green-100 text-green-800">
                              ✅ Có {todayMeals.length} món cho hôm nay
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              📅 Có thể áp dụng cho hôm nay
                            </Badge>
                          )}
                        </div>

                        {/* Today's meals preview */}
                        {hasTodayMeals && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Món ăn hôm nay:</p>
                            <div className="space-y-1">
                              {todayMeals.slice(0, 3).map((meal, index) => (
                                <div key={index} className="flex items-center text-xs text-gray-600">
                                  <span className="w-12">
                                    {meal.mealType === 'breakfast' ? '🌅 Sáng' :
                                     meal.mealType === 'lunch' ? '☀️ Trưa' :
                                     meal.mealType === 'dinner' ? '🌙 Tối' : '🍎 Phụ'}
                                  </span>
                                  <span className="flex-1">
                                    {meal.recipe?.title || 'Món ăn'}
                                  </span>
                                </div>
                              ))}
                              {todayMeals.length > 3 && (
                                <p className="text-xs text-gray-500">
                                  +{todayMeals.length - 3} món khác...
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Selection indicator */}
                        {selectedPlan === plan.id && (
                          <div className="mt-3 flex items-center text-orange-600">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Đã chọn</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có kế hoạch nào phù hợp
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có kế hoạch bữa ăn nào cho ngày hôm nay. Hãy tạo kế hoạch mới.
              </p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link to="/meal-plans?tab=daily-menu">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo kế hoạch mới
                </Link>
              </Button>
            </div>
          )}

          {/* Create New Plan Option */}
          {availablePlans.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  Muốn tạo kế hoạch mới?
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Tạo kế hoạch bữa ăn tùy chỉnh cho ngày hôm nay
                </p>
                <Button variant="outline" asChild>
                  <Link to="/meal-plans?tab=daily-menu">
                    <Plus className="h-4 w-4 mr-2" />
                    Lên kế hoạch cho hôm nay
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        {availablePlans.length > 0 && (
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
                disabled={!selectedPlan || isApplying}
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
                    Áp dụng kế hoạch
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplyTodayMealPlanModal;
