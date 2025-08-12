import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TodayMealPlan, MEAL_TYPE_CONFIGS } from '@/types/today-meal-widget';
import MealSlideCard from './MealSlideCard';

interface MealCarouselProps {
  todayPlan: TodayMealPlan;
  currentMealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  onViewRecipe: (recipeId: string) => void;
  onReplaceMeal: (mealType: string) => void;
  onRemoveMeal: (mealType: string) => void;
  onAddMeal: (mealType: string) => void;
}

const MealCarousel: React.FC<MealCarouselProps> = ({
  todayPlan,
  currentMealType,
  onViewRecipe,
  onReplaceMeal,
  onRemoveMeal,
  onAddMeal
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Tạo array các bữa ăn theo thứ tự thời gian
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  const meals = mealOrder.map(mealType => ({
    type: mealType,
    slot: todayPlan.meals[mealType],
    config: MEAL_TYPE_CONFIGS[mealType],
    isCurrent: mealType === currentMealType
  }));

  // Tự động scroll đến bữa ăn hiện tại khi component mount
  useEffect(() => {
    if (currentMealType) {
      const currentIndex = mealOrder.indexOf(currentMealType);
      if (currentIndex !== -1) {
        setCurrentSlide(currentIndex);
        scrollToSlide(currentIndex);
      }
    }
  }, [currentMealType]);

  const scrollToSlide = useCallback((index: number) => {
    if (carouselRef.current && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(index);

      // Smooth transition với CSS transform
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % meals.length;
    scrollToSlide(newIndex);
  }, [currentSlide, meals.length, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = currentSlide === 0 ? meals.length - 1 : currentSlide - 1;
    scrollToSlide(newIndex);
  }, [currentSlide, meals.length, scrollToSlide]);

  const goToSlide = useCallback((index: number) => {
    scrollToSlide(index);
  }, [scrollToSlide]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative" role="region" aria-label="Thực đơn các bữa ăn">
      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          role="tabpanel"
          aria-live="polite"
        >
          {meals.map((meal, index) => (
            <div
              key={meal.type}
              className="w-full flex-shrink-0 px-2 sm:px-4"
              role="tabpanel"
              aria-hidden={index !== currentSlide}
            >
              <MealSlideCard
                mealType={meal.type}
                mealSlot={meal.slot}
                config={meal.config}
                isCurrent={meal.isCurrent}
                isActive={index === currentSlide}
                onViewRecipe={onViewRecipe}
                onReplaceMeal={onReplaceMeal}
                onRemoveMeal={onRemoveMeal}
                onAddMeal={onAddMeal}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 transition-all duration-200 hover:scale-110"
        onClick={prevSlide}
        disabled={isTransitioning}
        aria-label="Bữa ăn trước"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 transition-all duration-200 hover:scale-110"
        onClick={nextSlide}
        disabled={isTransitioning}
        aria-label="Bữa ăn tiếp theo"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-3" role="tablist">
        {meals.map((meal, index) => (
          <button
            key={meal.type}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Chuyển đến ${meal.config.label}`}
            className={`relative transition-all duration-300 hover:scale-110 ${
              index === currentSlide
                ? 'w-8 h-3 bg-primary-600 rounded-full'
                : meal.isCurrent
                ? 'w-3 h-3 bg-primary-400 rounded-full'
                : 'w-3 h-3 bg-neutral-300 rounded-full hover:bg-neutral-400'
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
          >
            {meal.isCurrent && index !== currentSlide && (
              <div className="absolute inset-0 bg-primary-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Meal Time Labels */}
      <div className="flex justify-center mt-3 space-x-6">
        {meals.map((meal, index) => (
          <button
            key={meal.type}
            className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
              index === currentSlide
                ? 'text-primary-600 font-bold'
                : meal.isCurrent
                ? 'text-primary-500 font-semibold'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
          >
            <span className="flex items-center gap-1">
              <span className="text-lg">{meal.config.emoji}</span>
              <span>{meal.config.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MealCarousel;
