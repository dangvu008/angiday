import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChefHat, Clock, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { CookingOptimizer } from '@/utils/cookingOptimizer';
import { Recipe } from '@/services/kitchenService';
import { CookingRecipe, CookingSession } from '@/types/cookingMode';

interface CookingModeStarterProps {
  recipes: Recipe[];
  mealName?: string;
  onStart?: () => void;
  className?: string;
}

const CookingModeStarter: React.FC<CookingModeStarterProps> = ({
  recipes,
  mealName = 'Bữa ăn của bạn',
  onStart,
  className
}) => {
  const navigate = useNavigate();
  const { startSession } = useCookingMode();
  const [isStarting, setIsStarting] = useState(false);

  // Convert Recipe to CookingRecipe
  const convertToCookingRecipe = (recipe: Recipe): CookingRecipe => {
    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.instructions.map((instruction, index) => ({
        id: `${recipe.id}-step-${index + 1}`,
        stepNumber: index + 1,
        instruction,
        ingredients: [], // Will be populated by optimizer
        timers: CookingOptimizer.extractTimersFromInstruction(instruction, `${recipe.id}-step-${index + 1}`),
        estimatedTime: 5 // Default 5 minutes per step
      })),
      totalTime: recipe.prepTime + recipe.cookTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      tags: recipe.tags
    };
  };

  const handleStartCooking = async () => {
    setIsStarting(true);
    
    try {
      // Convert recipes
      const cookingRecipes = recipes.map(convertToCookingRecipe);
      
      // Create optimized timeline
      const timeline = recipes.length === 1 
        ? CookingOptimizer.createSingleRecipeTimeline(cookingRecipes[0])
        : CookingOptimizer.createOptimizedTimeline(cookingRecipes, mealName);

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
      
      // Call onStart callback
      onStart?.();
      
    } catch (error) {
      console.error('Error starting cooking mode:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const totalTime = recipes.reduce((total, recipe) => total + recipe.prepTime + recipe.cookTime, 0);
  const totalServings = recipes.reduce((total, recipe) => total + recipe.servings, 0);
  const maxDifficulty = recipes.reduce((max, recipe) => {
    const difficultyLevels = { easy: 1, medium: 2, hard: 3 };
    const recipeDifficulty = difficultyLevels[recipe.difficulty];
    const maxDifficulty = difficultyLevels[max];
    return recipeDifficulty > maxDifficulty ? recipe.difficulty : max;
  }, 'easy' as 'easy' | 'medium' | 'hard');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChefHat className="h-5 w-5 text-orange-500" />
          <span>Chế độ Nấu ăn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recipe Summary */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">{mealName}</h3>
          <div className="space-y-1">
            {recipes.map((recipe, index) => (
              <div key={recipe.id} className="text-sm text-gray-600 flex items-center">
                <span className="w-4 h-4 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                  {index + 1}
                </span>
                {recipe.name}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} phút</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{totalServings} người</span>
          </div>
          <Badge variant={maxDifficulty === 'easy' ? 'default' : maxDifficulty === 'medium' ? 'secondary' : 'destructive'}>
            {maxDifficulty === 'easy' && 'Dễ'}
            {maxDifficulty === 'medium' && 'Trung bình'}
            {maxDifficulty === 'hard' && 'Khó'}
          </Badge>
        </div>

        {/* Features */}
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-blue-900">Tính năng thông minh:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Hướng dẫn từng bước với font chữ lớn</li>
            <li>• Timer tự động cho các bước nấu</li>
            <li>• Đọc hướng dẫn bằng giọng nói</li>
            <li>• Tối ưu thứ tự nấu nhiều món</li>
            <li>• Điều khiển bằng cử chỉ vuốt</li>
          </ul>
        </div>

        {/* Warning for multiple recipes */}
        {recipes.length > 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-700">
              <p className="font-medium">Nấu nhiều món cùng lúc</p>
              <p>Hệ thống sẽ tối ưu thứ tự các bước để bạn nấu hiệu quả nhất.</p>
            </div>
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={handleStartCooking}
          disabled={isStarting || recipes.length === 0}
          size="lg"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
        >
          {isStarting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Đang khởi tạo...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Bắt đầu Nấu ăn
            </>
          )}
        </Button>

        {/* Tips */}
        <div className="text-xs text-gray-500 text-center">
          💡 Mẹo: Chuẩn bị đầy đủ nguyên liệu trước khi bắt đầu
        </div>
      </CardContent>
    </Card>
  );
};

export default CookingModeStarter;
