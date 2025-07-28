import { 
  Dish, 
  MealTemplate, 
  DayPlanTemplate, 
  WeekPlan,
  CalculationResult 
} from '@/types/meal-planning';

/**
 * Service tự động tính toán calories, chi phí, thời gian nấu
 * cho các level khác nhau: bữa ăn, ngày, tuần, tháng
 */
class AutoCalculatorService {
  
  /**
   * Tính toán cho một món ăn
   */
  calculateDish(dish: Dish): CalculationResult {
    return {
      calories: dish.calories,
      cost: dish.cost,
      cookingTime: dish.cookingTime,
      nutrition: {
        protein: dish.nutrition.protein,
        carbs: dish.nutrition.carbs,
        fat: dish.nutrition.fat,
        fiber: dish.nutrition.fiber
      },
      breakdown: {
        [dish.id]: {
          name: dish.name,
          calories: dish.calories,
          cost: dish.cost,
          cookingTime: dish.cookingTime,
          nutrition: dish.nutrition
        }
      }
    };
  }

  /**
   * Tính toán cho một bữa ăn (meal template)
   */
  calculateMealTemplate(mealTemplate: MealTemplate): CalculationResult {
    const result: CalculationResult = {
      calories: 0,
      cost: 0,
      cookingTime: 0,
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      breakdown: {}
    };

    // Tính tổng từ các món ăn
    mealTemplate.dishes.forEach(dish => {
      result.calories += dish.calories;
      result.cost += dish.cost;
      result.cookingTime = Math.max(result.cookingTime, dish.cookingTime); // Thời gian nấu song song
      
      result.nutrition.protein += dish.nutrition.protein;
      result.nutrition.carbs += dish.nutrition.carbs;
      result.nutrition.fat += dish.nutrition.fat;
      result.nutrition.fiber += dish.nutrition.fiber;

      result.breakdown[dish.id] = {
        name: dish.name,
        calories: dish.calories,
        cost: dish.cost,
        cookingTime: dish.cookingTime,
        nutrition: dish.nutrition
      };
    });

    return result;
  }

  /**
   * Tính toán cho thực đơn ngày
   */
  calculateDayPlan(dayPlanTemplate: DayPlanTemplate): CalculationResult {
    const result: CalculationResult = {
      calories: 0,
      cost: 0,
      cookingTime: 0,
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      breakdown: {}
    };

    // Tính tổng từ tất cả các bữa ăn trong ngày
    const allMeals = [
      ...dayPlanTemplate.meals.breakfast,
      ...dayPlanTemplate.meals.lunch,
      ...dayPlanTemplate.meals.dinner,
      ...dayPlanTemplate.meals.snacks
    ];

    allMeals.forEach(mealTemplate => {
      const mealResult = this.calculateMealTemplate(mealTemplate);
      
      result.calories += mealResult.calories;
      result.cost += mealResult.cost;
      result.cookingTime += mealResult.cookingTime; // Tổng thời gian nấu trong ngày
      
      result.nutrition.protein += mealResult.nutrition.protein;
      result.nutrition.carbs += mealResult.nutrition.carbs;
      result.nutrition.fat += mealResult.nutrition.fat;
      result.nutrition.fiber += mealResult.nutrition.fiber;

      // Merge breakdown
      Object.assign(result.breakdown, mealResult.breakdown);
    });

    return result;
  }

  /**
   * Tính toán cho kế hoạch tuần
   */
  calculateWeekPlan(weekPlan: WeekPlan): CalculationResult {
    const result: CalculationResult = {
      calories: 0,
      cost: 0,
      cookingTime: 0,
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      breakdown: {}
    };

    weekPlan.days.forEach(dayPlan => {
      // Tính từ các meal slots trong ngày
      const dayMeals = [
        dayPlan.meals.breakfast,
        dayPlan.meals.lunch,
        dayPlan.meals.dinner,
        ...dayPlan.meals.snacks
      ];

      dayMeals.forEach(mealSlot => {
        if (mealSlot && mealSlot.dishes.length > 0) {
          mealSlot.dishes.forEach(dish => {
            result.calories += dish.calories;
            result.cost += dish.cost;
            result.cookingTime += dish.cookingTime;
            
            result.nutrition.protein += dish.nutrition.protein;
            result.nutrition.carbs += dish.nutrition.carbs;
            result.nutrition.fat += dish.nutrition.fat;
            result.nutrition.fiber += dish.nutrition.fiber;

            if (!result.breakdown[dish.id]) {
              result.breakdown[dish.id] = {
                name: dish.name,
                calories: dish.calories,
                cost: dish.cost,
                cookingTime: dish.cookingTime,
                nutrition: dish.nutrition
              };
            }
          });
        }
      });
    });

    return result;
  }

  /**
   * Tính toán chi phí trung bình theo người
   */
  calculateCostPerPerson(totalCost: number, servings: number): number {
    return servings > 0 ? totalCost / servings : totalCost;
  }

  /**
   * Tính toán calories trung bình theo bữa ăn
   */
  calculateCaloriesPerMeal(totalCalories: number, mealsCount: number): number {
    return mealsCount > 0 ? totalCalories / mealsCount : totalCalories;
  }

  /**
   * Tính toán phân bố dinh dưỡng theo phần trăm
   */
  calculateNutritionPercentage(nutrition: { protein: number; carbs: number; fat: number; fiber: number }) {
    const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat;
    
    return {
      protein: totalMacros > 0 ? (nutrition.protein / totalMacros) * 100 : 0,
      carbs: totalMacros > 0 ? (nutrition.carbs / totalMacros) * 100 : 0,
      fat: totalMacros > 0 ? (nutrition.fat / totalMacros) * 100 : 0,
      fiber: nutrition.fiber // Fiber không tính vào phần trăm macro
    };
  }

  /**
   * Ước tính thời gian chuẩn bị tổng cộng
   */
  calculateTotalPrepTime(cookingTimes: number[], parallelCooking: boolean = false): number {
    if (parallelCooking) {
      // Nếu có thể nấu song song, lấy thời gian lớn nhất
      return Math.max(...cookingTimes);
    } else {
      // Nếu nấu tuần tự, tính tổng
      return cookingTimes.reduce((total, time) => total + time, 0);
    }
  }

  /**
   * Tính toán điểm đánh giá tổng thể
   */
  calculateOverallScore(
    nutritionScore: number,
    costScore: number,
    timeScore: number,
    weights: { nutrition: number; cost: number; time: number } = { nutrition: 0.4, cost: 0.3, time: 0.3 }
  ): number {
    return (
      nutritionScore * weights.nutrition +
      costScore * weights.cost +
      timeScore * weights.time
    );
  }

  /**
   * Tính toán thống kê theo tháng
   */
  calculateMonthlyStats(weekPlans: WeekPlan[]): CalculationResult {
    const result: CalculationResult = {
      calories: 0,
      cost: 0,
      cookingTime: 0,
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      breakdown: {}
    };

    weekPlans.forEach(weekPlan => {
      const weekResult = this.calculateWeekPlan(weekPlan);

      result.calories += weekResult.calories;
      result.cost += weekResult.cost;
      result.cookingTime += weekResult.cookingTime;

      result.nutrition.protein += weekResult.nutrition.protein;
      result.nutrition.carbs += weekResult.nutrition.carbs;
      result.nutrition.fat += weekResult.nutrition.fat;
      result.nutrition.fiber += weekResult.nutrition.fiber;

      // Merge breakdown
      Object.assign(result.breakdown, weekResult.breakdown);
    });

    return result;
  }

  /**
   * So sánh hiệu quả giữa các kế hoạch
   */
  comparePlans(plans: (MealTemplate | DayPlanTemplate | WeekPlan)[]): Array<{
    plan: any;
    result: CalculationResult;
    efficiency: {
      caloriesPerCost: number;
      nutritionDensity: number;
      timeEfficiency: number;
    };
  }> {
    return plans.map(plan => {
      let result: CalculationResult;

      if ('dishes' in plan) {
        // MealTemplate
        result = this.calculateMealTemplate(plan as MealTemplate);
      } else if ('meals' in plan && 'totalCalories' in plan) {
        // DayPlanTemplate
        result = this.calculateDayPlan(plan as DayPlanTemplate);
      } else {
        // WeekPlan
        result = this.calculateWeekPlan(plan as WeekPlan);
      }

      const efficiency = {
        caloriesPerCost: result.cost > 0 ? result.calories / result.cost : 0,
        nutritionDensity: (result.nutrition.protein + result.nutrition.fiber) / Math.max(result.calories, 1),
        timeEfficiency: result.cookingTime > 0 ? result.calories / result.cookingTime : 0
      };

      return { plan, result, efficiency };
    });
  }

  /**
   * Tính toán xu hướng theo thời gian
   */
  calculateTrends(historicalData: Array<{ date: string; result: CalculationResult }>): {
    caloriesTrend: number;
    costTrend: number;
    nutritionTrend: number;
  } {
    if (historicalData.length < 2) {
      return { caloriesTrend: 0, costTrend: 0, nutritionTrend: 0 };
    }

    const recent = historicalData.slice(-7); // Last 7 entries
    const previous = historicalData.slice(-14, -7); // Previous 7 entries

    const recentAvg = {
      calories: recent.reduce((sum, d) => sum + d.result.calories, 0) / recent.length,
      cost: recent.reduce((sum, d) => sum + d.result.cost, 0) / recent.length,
      nutrition: recent.reduce((sum, d) => sum + d.result.nutrition.protein + d.result.nutrition.fiber, 0) / recent.length
    };

    const previousAvg = {
      calories: previous.reduce((sum, d) => sum + d.result.calories, 0) / previous.length,
      cost: previous.reduce((sum, d) => sum + d.result.cost, 0) / previous.length,
      nutrition: previous.reduce((sum, d) => sum + d.result.nutrition.protein + d.result.nutrition.fiber, 0) / previous.length
    };

    return {
      caloriesTrend: previousAvg.calories > 0 ? ((recentAvg.calories - previousAvg.calories) / previousAvg.calories) * 100 : 0,
      costTrend: previousAvg.cost > 0 ? ((recentAvg.cost - previousAvg.cost) / previousAvg.cost) * 100 : 0,
      nutritionTrend: previousAvg.nutrition > 0 ? ((recentAvg.nutrition - previousAvg.nutrition) / previousAvg.nutrition) * 100 : 0
    };
  }

  /**
   * Đề xuất tối ưu hóa
   */
  generateOptimizationSuggestions(result: CalculationResult, targets: {
    maxCalories?: number;
    maxCost?: number;
    maxTime?: number;
    minProtein?: number;
    minFiber?: number;
  }): string[] {
    const suggestions: string[] = [];

    if (targets.maxCalories && result.calories > targets.maxCalories) {
      suggestions.push(`Giảm ${result.calories - targets.maxCalories} calories để đạt mục tiêu`);
    }

    if (targets.maxCost && result.cost > targets.maxCost) {
      suggestions.push(`Tiết kiệm ${((result.cost - targets.maxCost) / 1000).toFixed(0)}k VND để đạt ngân sách`);
    }

    if (targets.maxTime && result.cookingTime > targets.maxTime) {
      suggestions.push(`Giảm ${result.cookingTime - targets.maxTime} phút thời gian nấu`);
    }

    if (targets.minProtein && result.nutrition.protein < targets.minProtein) {
      suggestions.push(`Thêm ${(targets.minProtein - result.nutrition.protein).toFixed(1)}g protein`);
    }

    if (targets.minFiber && result.nutrition.fiber < targets.minFiber) {
      suggestions.push(`Thêm ${(targets.minFiber - result.nutrition.fiber).toFixed(1)}g chất xơ`);
    }

    // Nutrition balance suggestions
    const nutritionPercentages = this.calculateNutritionPercentage(result.nutrition);
    if (nutritionPercentages.protein < 15) {
      suggestions.push('Tăng protein để cân bằng dinh dưỡng');
    }
    if (nutritionPercentages.carbs > 65) {
      suggestions.push('Giảm carbs để cân bằng dinh dưỡng');
    }
    if (nutritionPercentages.fat < 20) {
      suggestions.push('Tăng chất béo tốt để cân bằng dinh dưỡng');
    }

    return suggestions;
  }
}

export const autoCalculatorService = new AutoCalculatorService();
