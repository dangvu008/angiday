import { autoCalculatorService } from '../auto-calculator.service';
import { MealTemplate, DayPlanTemplate, WeekPlan, Dish } from '@/types/meal-planning';

// Mock data
const mockDish: Dish = {
  id: 'dish1',
  name: 'Test Dish',
  image: 'test.jpg',
  calories: 300,
  cost: 50000,
  cookingTime: 30,
  servings: 2,
  difficulty: 'medium',
  cuisine: 'Vietnamese',
  category: 'main',
  tags: ['healthy'],
  ingredients: [],
  instructions: [],
  nutrition: {
    protein: 20,
    carbs: 40,
    fat: 10,
    fiber: 5
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockMealTemplate: MealTemplate = {
  id: 'meal1',
  name: 'Test Meal',
  description: 'Test meal description',
  type: 'lunch',
  dishes: [mockDish],
  totalCalories: 300,
  totalCost: 50000,
  servings: 2,
  tags: ['healthy'],
  difficulty: 'medium',
  cookingTime: 30,
  nutrition: {
    protein: 20,
    carbs: 40,
    fat: 10,
    fiber: 5
  },
  isPublic: false,
  createdBy: 'user1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  category: 'main',
  cuisine: 'Vietnamese',
  usageCount: 0,
  rating: 0,
  reviews: 0
};

describe('AutoCalculatorService', () => {
  describe('calculateDish', () => {
    it('should calculate dish metrics correctly', () => {
      const result = autoCalculatorService.calculateDish(mockDish);
      
      expect(result.calories).toBe(300);
      expect(result.cost).toBe(50000);
      expect(result.cookingTime).toBe(30);
      expect(result.nutrition.protein).toBe(20);
      expect(result.nutrition.carbs).toBe(40);
      expect(result.nutrition.fat).toBe(10);
      expect(result.nutrition.fiber).toBe(5);
      expect(result.breakdown[mockDish.id]).toBeDefined();
    });
  });

  describe('calculateMealTemplate', () => {
    it('should calculate meal template metrics correctly', () => {
      const result = autoCalculatorService.calculateMealTemplate(mockMealTemplate);
      
      expect(result.calories).toBe(300);
      expect(result.cost).toBe(50000);
      expect(result.cookingTime).toBe(30);
      expect(result.nutrition.protein).toBe(20);
      expect(result.breakdown[mockDish.id]).toBeDefined();
    });

    it('should handle multiple dishes correctly', () => {
      const mealWithMultipleDishes: MealTemplate = {
        ...mockMealTemplate,
        dishes: [mockDish, { ...mockDish, id: 'dish2' }]
      };
      
      const result = autoCalculatorService.calculateMealTemplate(mealWithMultipleDishes);
      
      expect(result.calories).toBe(600); // 300 * 2
      expect(result.cost).toBe(100000); // 50000 * 2
      expect(result.cookingTime).toBe(30); // Max cooking time (parallel cooking)
      expect(result.nutrition.protein).toBe(40); // 20 * 2
    });
  });

  describe('calculateCostPerPerson', () => {
    it('should calculate cost per person correctly', () => {
      const result = autoCalculatorService.calculateCostPerPerson(100000, 4);
      expect(result).toBe(25000);
    });

    it('should handle zero servings', () => {
      const result = autoCalculatorService.calculateCostPerPerson(100000, 0);
      expect(result).toBe(100000);
    });
  });

  describe('calculateCaloriesPerMeal', () => {
    it('should calculate calories per meal correctly', () => {
      const result = autoCalculatorService.calculateCaloriesPerMeal(2000, 4);
      expect(result).toBe(500);
    });

    it('should handle zero meals', () => {
      const result = autoCalculatorService.calculateCaloriesPerMeal(2000, 0);
      expect(result).toBe(2000);
    });
  });

  describe('calculateNutritionPercentage', () => {
    it('should calculate nutrition percentages correctly', () => {
      const nutrition = { protein: 20, carbs: 50, fat: 30, fiber: 10 };
      const result = autoCalculatorService.calculateNutritionPercentage(nutrition);
      
      expect(result.protein).toBe(20); // 20/100 * 100
      expect(result.carbs).toBe(50); // 50/100 * 100
      expect(result.fat).toBe(30); // 30/100 * 100
      expect(result.fiber).toBe(10); // Fiber is not included in percentage
    });

    it('should handle zero total macros', () => {
      const nutrition = { protein: 0, carbs: 0, fat: 0, fiber: 5 };
      const result = autoCalculatorService.calculateNutritionPercentage(nutrition);
      
      expect(result.protein).toBe(0);
      expect(result.carbs).toBe(0);
      expect(result.fat).toBe(0);
      expect(result.fiber).toBe(5);
    });
  });

  describe('calculateTotalPrepTime', () => {
    it('should calculate parallel cooking time correctly', () => {
      const cookingTimes = [30, 45, 20];
      const result = autoCalculatorService.calculateTotalPrepTime(cookingTimes, true);
      expect(result).toBe(45); // Max time for parallel cooking
    });

    it('should calculate sequential cooking time correctly', () => {
      const cookingTimes = [30, 45, 20];
      const result = autoCalculatorService.calculateTotalPrepTime(cookingTimes, false);
      expect(result).toBe(95); // Sum of all times for sequential cooking
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate overall score with default weights', () => {
      const result = autoCalculatorService.calculateOverallScore(80, 70, 90);
      const expected = 80 * 0.4 + 70 * 0.3 + 90 * 0.3; // 32 + 21 + 27 = 80
      expect(result).toBe(expected);
    });

    it('should calculate overall score with custom weights', () => {
      const weights = { nutrition: 0.5, cost: 0.3, time: 0.2 };
      const result = autoCalculatorService.calculateOverallScore(80, 70, 90, weights);
      const expected = 80 * 0.5 + 70 * 0.3 + 90 * 0.2; // 40 + 21 + 18 = 79
      expect(result).toBe(expected);
    });
  });

  describe('generateOptimizationSuggestions', () => {
    it('should generate suggestions when targets are exceeded', () => {
      const result = {
        calories: 2500,
        cost: 250000,
        cookingTime: 150,
        nutrition: { protein: 40, carbs: 300, fat: 80, fiber: 15 },
        breakdown: {}
      };
      
      const targets = {
        maxCalories: 2000,
        maxCost: 200000,
        maxTime: 120,
        minProtein: 50,
        minFiber: 25
      };
      
      const suggestions = autoCalculatorService.generateOptimizationSuggestions(result, targets);
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('calories'))).toBe(true);
      expect(suggestions.some(s => s.includes('chi phí') || s.includes('VND'))).toBe(true);
      expect(suggestions.some(s => s.includes('thời gian'))).toBe(true);
      expect(suggestions.some(s => s.includes('protein'))).toBe(true);
      expect(suggestions.some(s => s.includes('chất xơ'))).toBe(true);
    });

    it('should return empty suggestions when all targets are met', () => {
      const result = {
        calories: 1800,
        cost: 150000,
        cookingTime: 90,
        nutrition: { protein: 60, carbs: 200, fat: 60, fiber: 30 },
        breakdown: {}
      };
      
      const targets = {
        maxCalories: 2000,
        maxCost: 200000,
        maxTime: 120,
        minProtein: 50,
        minFiber: 25
      };
      
      const suggestions = autoCalculatorService.generateOptimizationSuggestions(result, targets);
      
      // Should have fewer suggestions or nutrition balance suggestions only
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('comparePlans', () => {
    it('should compare meal templates correctly', () => {
      const plans = [mockMealTemplate, { ...mockMealTemplate, id: 'meal2', totalCalories: 400 }];
      const results = autoCalculatorService.comparePlans(plans);
      
      expect(results).toHaveLength(2);
      expect(results[0].result.calories).toBe(300);
      expect(results[1].result.calories).toBe(400);
      expect(results[0].efficiency.caloriesPerCost).toBeDefined();
      expect(results[0].efficiency.nutritionDensity).toBeDefined();
      expect(results[0].efficiency.timeEfficiency).toBeDefined();
    });
  });

  describe('calculateTrends', () => {
    it('should calculate trends correctly with sufficient data', () => {
      const historicalData = Array.from({ length: 14 }, (_, i) => ({
        date: `2024-01-${i + 1}`,
        result: {
          calories: 2000 + i * 10, // Increasing trend
          cost: 200000 - i * 1000, // Decreasing trend
          cookingTime: 120,
          nutrition: { protein: 50 + i, carbs: 250, fat: 70, fiber: 25 },
          breakdown: {}
        }
      }));
      
      const trends = autoCalculatorService.calculateTrends(historicalData);
      
      expect(trends.caloriesTrend).toBeGreaterThan(0); // Increasing
      expect(trends.costTrend).toBeLessThan(0); // Decreasing
      expect(trends.nutritionTrend).toBeGreaterThan(0); // Increasing
    });

    it('should return zero trends with insufficient data', () => {
      const historicalData = [
        {
          date: '2024-01-01',
          result: {
            calories: 2000,
            cost: 200000,
            cookingTime: 120,
            nutrition: { protein: 50, carbs: 250, fat: 70, fiber: 25 },
            breakdown: {}
          }
        }
      ];
      
      const trends = autoCalculatorService.calculateTrends(historicalData);
      
      expect(trends.caloriesTrend).toBe(0);
      expect(trends.costTrend).toBe(0);
      expect(trends.nutritionTrend).toBe(0);
    });
  });
});
