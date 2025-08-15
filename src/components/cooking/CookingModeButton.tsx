import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Play, Smartphone, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { CookingOptimizer } from '@/utils/cookingOptimizer';
import { Recipe } from '@/types/kitchen';
import { CookingRecipe, CookingSession } from '@/types/cookingMode';
import { toast } from 'sonner';

interface CookingModeButtonProps {
  recipe?: Recipe;
  recipes?: Recipe[];
  mealName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showMobileOptimized?: boolean;
}

const CookingModeButton: React.FC<CookingModeButtonProps> = ({
  recipe,
  recipes,
  mealName,
  variant = 'default',
  size = 'default',
  className = '',
  showMobileOptimized = true
}) => {
  const navigate = useNavigate();
  const { startSession } = useCookingMode();
  const [isStarting, setIsStarting] = useState(false);

  // Determine recipes to cook
  const recipesToCook = recipe ? [recipe] : (recipes || []);
  const displayName = mealName || recipe?.title || `${recipesToCook.length} món ăn`;

  // Convert Recipe to CookingRecipe
  const convertToCookingRecipe = (recipe: Recipe): CookingRecipe => {
    return {
      id: recipe.id,
      name: recipe.title,
      description: recipe.description || '',
      ingredients: recipe.ingredients,
      steps: recipe.instructions.map((instruction, index) => ({
        id: `${recipe.id}-step-${index + 1}`,
        stepNumber: index + 1,
        instruction,
        ingredients: [], // Will be populated by optimizer
        timers: CookingOptimizer.extractTimersFromInstruction(instruction, `${recipe.id}-step-${index + 1}`),
        estimatedTime: 5 // Default 5 minutes per step
      })),
      totalTime: (recipe.prepTime || 0) + (recipe.cookTime || 0),
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      tags: recipe.tags || []
    };
  };

  const handleStartCooking = async () => {
    if (recipesToCook.length === 0) {
      toast.error('Không có công thức nào để nấu');
      return;
    }

    setIsStarting(true);
    
    try {
      // Convert recipes
      const cookingRecipes = recipesToCook.map(convertToCookingRecipe);
      
      // Create optimized timeline
      const timeline = cookingRecipes.length === 1 
        ? CookingOptimizer.createSingleRecipeTimeline(cookingRecipes[0])
        : CookingOptimizer.createOptimizedTimeline(cookingRecipes, displayName);

      // Create cooking session with mobile-optimized settings
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
          gestureControlEnabled: true, // Enable swipe gestures
          autoAdvanceSteps: false,
          timerSounds: true,
          vibrationAlerts: true,
          layout: 'mobile' // Mobile-optimized layout
        },
        status: 'active'
      };

      // Start session
      startSession(session);

      // Navigate to all-in-one cooking mode (optimized for hands-free cooking)
      navigate('/all-in-one-cooking');

      toast.success(`Bắt đầu nấu ${displayName}`);
      
    } catch (error) {
      console.error('Error starting cooking mode:', error);
      toast.error('Có lỗi xảy ra khi khởi động chế độ nấu ăn');
    } finally {
      setIsStarting(false);
    }
  };

  const totalTime = recipesToCook.reduce((total, recipe) => 
    total + (recipe.prepTime || 0) + (recipe.cookTime || 0), 0
  );

  return (
    <Button
      onClick={handleStartCooking}
      disabled={isStarting || recipesToCook.length === 0}
      variant={variant}
      size={size}
      className={`${className} relative`}
    >
      {isStarting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Đang khởi tạo...
        </>
      ) : (
        <>
          <ChefHat className="h-4 w-4 mr-2" />
          Chế độ nấu ăn
          {showMobileOptimized && (
            <div className="flex items-center ml-2 space-x-1">
              <Smartphone className="h-3 w-3" />
              {totalTime > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  <Timer className="h-3 w-3 mr-1" />
                  {totalTime}p
                </Badge>
              )}
            </div>
          )}
        </>
      )}
    </Button>
  );
};

export default CookingModeButton;
