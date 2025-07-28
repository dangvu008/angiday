import { Recipe } from '@/contexts/MealPlanningContext';

export interface UserPreferences {
  dietaryRestrictions: string[]; // ['vegetarian', 'gluten-free', 'dairy-free', etc.]
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  timeConstraints: 'quick' | 'moderate' | 'flexible'; // <30min, 30-60min, >60min
  cuisinePreferences: string[]; // ['vietnamese', 'asian', 'western', etc.]
  servingSize: number; // Number of people
  budgetRange: 'low' | 'medium' | 'high';
  healthGoals: string[]; // ['weight-loss', 'muscle-gain', 'maintenance', etc.]
  dislikedIngredients: string[];
  preferredMealTypes: string[]; // ['breakfast', 'lunch', 'dinner', 'snack']
  weeklyGoals: string; // Free text description
}

export interface AIGeneratedMeal {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  suggestedRecipe: {
    title: string;
    description: string;
    cookTime: string;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    ingredients: string[];
    instructions: string[];
    calories: number;
    tags: string[];
    reasoning: string; // Why AI chose this meal
  };
  matchedRecipeId?: string; // If found in existing recipes
  confidence: number; // 0-1 how confident AI is about this choice
}

export interface AIGeneratedPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  meals: AIGeneratedMeal[];
  nutritionSummary: {
    totalCalories: number;
    avgCaloriesPerDay: number;
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
  planReasoning: string; // Overall explanation of the plan
  confidence: number;
  generatedAt: string;
}

class AIMealPlanGenerator {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || null;
  }

  // Mock AI generation for demo (since we don't have real API key)
  private async mockAIGeneration(preferences: UserPreferences, availableRecipes: Recipe[]): Promise<AIGeneratedPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Smart meal suggestions based on preferences
    const mealSuggestions = this.generateSmartMealSuggestions(preferences, availableRecipes);
    
    const plan: AIGeneratedPlan = {
      id: `ai_plan_${Date.now()}`,
      name: `Thực đơn AI cho ${preferences.servingSize} người`,
      description: this.generatePlanDescription(preferences),
      startDate,
      endDate,
      meals: mealSuggestions,
      nutritionSummary: this.calculateNutritionSummary(mealSuggestions),
      planReasoning: this.generatePlanReasoning(preferences),
      confidence: 0.85,
      generatedAt: new Date().toISOString()
    };

    return plan;
  }

  private generateSmartMealSuggestions(preferences: UserPreferences, availableRecipes: Recipe[]): AIGeneratedMeal[] {
    const meals: AIGeneratedMeal[] = [];
    const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner'];
    
    // Generate meals for 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      mealTypes.forEach(mealType => {
        // Filter recipes based on preferences
        const suitableRecipes = this.filterRecipesByPreferences(availableRecipes, preferences, mealType);
        
        if (suitableRecipes.length > 0) {
          // Pick a recipe (in real AI, this would be more sophisticated)
          const selectedRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
          
          meals.push({
            date,
            mealType,
            suggestedRecipe: {
              title: selectedRecipe.title,
              description: `Món ${selectedRecipe.title} phù hợp với sở thích của bạn`,
              cookTime: selectedRecipe.cookTime,
              difficulty: selectedRecipe.difficulty,
              ingredients: selectedRecipe.ingredients,
              instructions: selectedRecipe.instructions,
              calories: selectedRecipe.calories || 400,
              tags: selectedRecipe.tags,
              reasoning: this.generateMealReasoning(selectedRecipe, preferences, mealType)
            },
            matchedRecipeId: selectedRecipe.id,
            confidence: 0.8 + Math.random() * 0.2
          });
        } else {
          // Generate custom meal if no suitable recipe found
          meals.push(this.generateCustomMeal(date, mealType, preferences));
        }
      });
    }

    return meals;
  }

  private filterRecipesByPreferences(recipes: Recipe[], preferences: UserPreferences, mealType: string): Recipe[] {
    return recipes.filter(recipe => {
      // Filter by dietary restrictions
      if (preferences.dietaryRestrictions.includes('vegetarian')) {
        if (!recipe.tags.some(tag => tag.toLowerCase().includes('chay') || tag.toLowerCase().includes('vegetarian'))) {
          return false;
        }
      }

      // Filter by cooking skill
      if (preferences.cookingSkill === 'beginner' && recipe.difficulty === 'Khó') {
        return false;
      }

      // Filter by time constraints
      const cookTimeMinutes = parseInt(recipe.cookTime);
      if (preferences.timeConstraints === 'quick' && cookTimeMinutes > 30) {
        return false;
      }

      // Filter by disliked ingredients
      if (preferences.dislikedIngredients.some(disliked => 
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(disliked.toLowerCase())
        )
      )) {
        return false;
      }

      return true;
    });
  }

  private generateCustomMeal(date: string, mealType: string, preferences: UserPreferences): AIGeneratedMeal {
    const mealSuggestions = {
      breakfast: [
        { title: 'Bánh mì trứng ốp la', calories: 350, time: '15 phút' },
        { title: 'Cháo gà', calories: 300, time: '20 phút' },
        { title: 'Phở bò', calories: 450, time: '30 phút' }
      ],
      lunch: [
        { title: 'Cơm tấm sườn nướng', calories: 650, time: '45 phút' },
        { title: 'Bún bò Huế', calories: 550, time: '60 phút' },
        { title: 'Mì Quảng', calories: 500, time: '40 phút' }
      ],
      dinner: [
        { title: 'Cơm chiên dương châu', calories: 600, time: '25 phút' },
        { title: 'Lẩu thái', calories: 400, time: '35 phút' },
        { title: 'Gà nướng mật ong', calories: 550, time: '50 phút' }
      ],
      snack: [
        { title: 'Chè đậu xanh', calories: 200, time: '10 phút' },
        { title: 'Bánh flan', calories: 250, time: '5 phút' },
        { title: 'Sinh tố bơ', calories: 300, time: '5 phút' }
      ]
    };

    const suggestions = mealSuggestions[mealType as keyof typeof mealSuggestions] || mealSuggestions.lunch;
    const selected = suggestions[Math.floor(Math.random() * suggestions.length)];

    return {
      date,
      mealType: mealType as any,
      suggestedRecipe: {
        title: selected.title,
        description: `Món ${selected.title} được AI đề xuất phù hợp với sở thích của bạn`,
        cookTime: selected.time,
        difficulty: preferences.cookingSkill === 'beginner' ? 'Dễ' : 'Trung bình',
        ingredients: ['Nguyên liệu sẽ được cập nhật', 'Dựa trên công thức chi tiết'],
        instructions: ['Hướng dẫn chi tiết', 'Sẽ được cung cấp sau'],
        calories: selected.calories,
        tags: ['AI đề xuất', mealType],
        reasoning: `AI chọn món này vì phù hợp với ${preferences.cookingSkill} skill level và ${preferences.timeConstraints} time constraint`
      },
      confidence: 0.7
    };
  }

  private generateMealReasoning(recipe: Recipe, preferences: UserPreferences, mealType: string): string {
    const reasons = [];
    
    if (preferences.cookingSkill === 'beginner' && recipe.difficulty === 'Dễ') {
      reasons.push('phù hợp với trình độ nấu ăn của bạn');
    }
    
    if (preferences.timeConstraints === 'quick' && parseInt(recipe.cookTime) <= 30) {
      reasons.push('nấu nhanh trong thời gian hạn chế');
    }
    
    if (preferences.dietaryRestrictions.includes('vegetarian') && recipe.tags.includes('chay')) {
      reasons.push('phù hợp với chế độ ăn chay');
    }

    reasons.push(`là món ${mealType} phổ biến và ngon miệng`);
    
    return `AI chọn món này vì ${reasons.join(', ')}.`;
  }

  private generatePlanDescription(preferences: UserPreferences): string {
    let description = `Thực đơn 7 ngày được AI tạo riêng cho ${preferences.servingSize} người`;
    
    if (preferences.dietaryRestrictions.length > 0) {
      description += `, phù hợp với ${preferences.dietaryRestrictions.join(', ')}`;
    }
    
    description += `. Trình độ nấu ăn: ${preferences.cookingSkill}`;
    
    if (preferences.timeConstraints === 'quick') {
      description += ', tập trung vào các món nấu nhanh';
    }
    
    return description;
  }

  private generatePlanReasoning(preferences: UserPreferences): string {
    return `Thực đơn này được thiết kế dựa trên sở thích cá nhân của bạn, bao gồm ${preferences.cookingSkill} cooking skill, ${preferences.timeConstraints} time preference, và các yêu cầu đặc biệt khác. AI đã cân nhắc cân bằng dinh dưỡng, đa dạng món ăn, và tính khả thi trong việc chuẩn bị.`;
  }

  private calculateNutritionSummary(meals: AIGeneratedMeal[]) {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.suggestedRecipe.calories, 0);
    const avgCaloriesPerDay = totalCalories / 7;
    
    return {
      totalCalories,
      avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
      proteinPercentage: 25, // Mock values
      carbsPercentage: 50,
      fatPercentage: 25
    };
  }

  // Main public method
  async generateMealPlan(preferences: UserPreferences, availableRecipes: Recipe[]): Promise<AIGeneratedPlan> {
    try {
      if (this.apiKey) {
        // Real AI implementation would go here
        return await this.callOpenAI(preferences, availableRecipes);
      } else {
        // Use mock implementation for demo
        return await this.mockAIGeneration(preferences, availableRecipes);
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Không thể tạo thực đơn. Vui lòng thử lại sau.');
    }
  }

  private async callOpenAI(preferences: UserPreferences, availableRecipes: Recipe[]): Promise<AIGeneratedPlan> {
    // Real OpenAI implementation would be here
    // For now, fallback to mock
    return await this.mockAIGeneration(preferences, availableRecipes);
  }
}

export const aiMealPlanGenerator = new AIMealPlanGenerator();
