import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Users, ChefHat, Utensils, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MealItem } from '@/types/kitchen';
import { getCurrentMealTime, getMealTimeDisplayName } from '@/utils/vndPriceUtils';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { useAuth } from '@/contexts/AuthContext';
import QuickMealPlanModal from './QuickMealPlanModal';
import ApplyTodayMealPlanModal from './ApplyTodayMealPlanModal';

interface TodayMenuSliderProps {
  meals: MealItem[];
  onMealSelect?: (meal: MealItem) => void;
  className?: string;
}

const TodayMenuSlider: React.FC<TodayMenuSliderProps> = ({
  meals,
  onMealSelect,
  className
}) => {
  const { userMealPlans } = useMealPlanning();
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showQuickMealPlanModal, setShowQuickMealPlanModal] = useState(false);
  const [showApplyTodayModal, setShowApplyTodayModal] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Tự động scroll đến bữa hiện tại khi component mount
  useEffect(() => {
    if (meals.length > 0) {
      const currentMealTime = getCurrentMealTime();
      const currentMealIndex = meals.findIndex(meal => meal.mealType === currentMealTime);
      
      if (currentMealIndex !== -1) {
        setCurrentIndex(currentMealIndex);
        scrollToIndex(currentMealIndex);
      }
    }
  }, [meals]);

  // Auto scroll functionality
  useEffect(() => {
    if (isAutoScrolling && meals.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % meals.length);
      }, 4000);
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, meals.length]);

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const cardWidth = slider.children[0]?.clientWidth || 300;
      const scrollLeft = index * (cardWidth + 16); // 16px gap
      slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : meals.length - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setIsAutoScrolling(false);
  };

  const handleNext = () => {
    const newIndex = currentIndex < meals.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setIsAutoScrolling(false);
  };

  const handleMealClick = (meal: MealItem, index: number) => {
    setCurrentIndex(index);
    scrollToIndex(index);
    setIsAutoScrolling(false);
    if (onMealSelect) {
      onMealSelect(meal);
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-orange-100 text-orange-800';
      case 'lunch':
        return 'bg-yellow-100 text-yellow-800';
      case 'dinner':
        return 'bg-blue-100 text-blue-800';
      case 'snack':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isCurrentMeal = (mealType: string) => {
    return getCurrentMealTime() === mealType;
  };

  if (!meals || meals.length === 0) {
    // Check if user has existing meal plans
    const hasExistingPlans = isAuthenticated && userMealPlans && userMealPlans.length > 0;

    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-8 text-center">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có thực đơn hôm nay
          </h3>
          <p className="text-gray-600 mb-6">
            {hasExistingPlans
              ? 'Bạn có kế hoạch bữa ăn nhưng chưa áp dụng cho hôm nay'
              : 'Vui lòng tạo thực đơn để bắt đầu quản lý bữa ăn'
            }
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasExistingPlans ? (
              <>
                <Button
                  onClick={() => setShowApplyTodayModal(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Áp dụng kế hoạch có sẵn
                </Button>

                <Button variant="outline" asChild>
                  <Link to="/meal-plans?tab=daily-menu">
                    <Plus className="h-4 w-4 mr-2" />
                    Lên kế hoạch hôm nay
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setShowQuickMealPlanModal(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Chọn thực đơn nhanh
                </Button>

                <Button variant="outline" asChild>
                  <Link to="/meal-plans">
                    <Calendar className="h-4 w-4 mr-2" />
                    Xem tất cả thực đơn
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Quick Tips */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800 font-medium mb-2">💡 Gợi ý:</p>
            <ul className="text-sm text-orange-700 space-y-1">
              {hasExistingPlans ? (
                <>
                  <li>• Áp dụng kế hoạch có sẵn cho ngày hôm nay</li>
                  <li>• Hoặc tạo kế hoạch mới cho ngày cụ thể</li>
                  <li>• Có thể chỉnh sửa kế hoạch sau khi áp dụng</li>
                </>
              ) : (
                <>
                  <li>• Tạo kế hoạch bữa ăn cho cả tuần</li>
                  <li>• Chọn từ thư viện công thức có sẵn</li>
                  <li>• Tự động tạo danh sách mua sắm</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Thực đơn hôm nay
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={cn(
              'text-xs',
              isAutoScrolling && 'bg-orange-50 text-orange-600 border-orange-200'
            )}
          >
            {isAutoScrolling ? 'Tắt tự động' : 'Tự động'}
          </Button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {meals.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {meals.map((meal, index) => {
            const isCurrent = index === currentIndex;
            const isCurrentMealTime = isCurrentMeal(meal.mealType);
            
            return (
              <Card
                key={`${meal.mealType}-${index}`}
                className={cn(
                  'flex-shrink-0 w-80 cursor-pointer transition-all duration-300 hover:shadow-lg',
                  isCurrent && 'ring-2 ring-orange-500 ring-offset-2 scale-105',
                  isCurrentMealTime && 'bg-gradient-to-br from-orange-50 to-orange-100'
                )}
                onClick={() => handleMealClick(meal, index)}
              >
                <CardContent className="p-4">
                  {/* Meal Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={cn('text-xs', getMealTypeColor(meal.mealType))}>
                      {getMealTypeIcon(meal.mealType)} {getMealTimeDisplayName(meal.mealType)}
                    </Badge>
                    
                    {isCurrentMealTime && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        Bữa hiện tại
                      </Badge>
                    )}
                  </div>

                  {/* Recipe Image */}
                  <div className="aspect-video w-full mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                    {meal.recipe?.image ? (
                      <img
                        src={meal.recipe.image}
                        alt={meal.recipe.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="h-12 w-12 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Recipe Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {meal.recipe?.name || meal.dish?.name || 'Món ăn'}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        {meal.recipe?.cookTime && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {meal.recipe.cookTime}
                          </div>
                        )}
                        
                        {meal.recipe?.servings && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {meal.recipe.servings}
                          </div>
                        )}
                      </div>
                      
                      {meal.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Đã hoàn thành
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dots Indicator */}
        {meals.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {meals.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  scrollToIndex(index);
                  setIsAutoScrolling(false);
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'bg-orange-500 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Meal Plan Modal */}
      <QuickMealPlanModal
        isOpen={showQuickMealPlanModal}
        onClose={() => setShowQuickMealPlanModal(false)}
        onApply={(planId) => {
          console.log('Applied meal plan:', planId);
          // The modal will handle page reload
        }}
      />

      {/* Apply Today Meal Plan Modal */}
      <ApplyTodayMealPlanModal
        isOpen={showApplyTodayModal}
        onClose={() => setShowApplyTodayModal(false)}
        onApply={(planId) => {
          console.log('Applied existing meal plan for today:', planId);
          // The modal will handle page reload
        }}
      />
    </div>
  );
};

export default TodayMenuSlider;
