import { IngredientManagementService, RecipeIngredient, StandardIngredient } from './IngredientManagementService';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  calcium?: number;
  iron?: number;
  vitaminC?: number;
}

export interface NutritionBreakdown {
  total: NutritionInfo;
  perServing: NutritionInfo;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
    nutrition: NutritionInfo;
    percentage: number; // % contribution to total calories
  }>;
  macroDistribution: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
  dailyValuePercent: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
  };
  healthScore: number; // 0-100
  recommendations: string[];
  warnings: string[];
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export class NutritionCalculatorService {
  // Recommended Daily Values (based on 2000 calorie diet)
  private static readonly DAILY_VALUES = {
    calories: 2000,
    protein: 50, // grams
    carbs: 300, // grams
    fat: 65, // grams
    fiber: 25, // grams
    sodium: 2300, // mg
    calcium: 1000, // mg
    iron: 18, // mg
    vitaminC: 90 // mg
  };

  // Calories per gram for macronutrients
  private static readonly CALORIES_PER_GRAM = {
    protein: 4,
    carbs: 4,
    fat: 9,
    alcohol: 7
  };

  /**
   * Tính toán dinh dưỡng từ danh sách nguyên liệu
   */
  static calculateNutritionFromIngredients(
    ingredients: RecipeIngredient[],
    servings: number = 1
  ): NutritionBreakdown {
    const ingredientNutritions: NutritionBreakdown['ingredients'] = [];
    let totalNutrition: NutritionInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0
    };

    // Tính dinh dưỡng cho từng nguyên liệu
    for (const ingredient of ingredients) {
      const standardIngredient = IngredientManagementService.getIngredientsByCategory()
        .find(ing => ing.id === ingredient.ingredientId);

      if (!standardIngredient?.nutritionPer100g) {
        // Nếu không có thông tin dinh dưỡng, ước tính dựa trên category
        const estimatedNutrition = this.estimateNutritionByCategory(
          standardIngredient?.category || 'khac',
          ingredient.amount,
          ingredient.unit
        );

        ingredientNutritions.push({
          ingredientId: ingredient.ingredientId,
          name: standardIngredient?.name || ingredient.ingredientId,
          amount: ingredient.amount,
          unit: ingredient.unit,
          nutrition: estimatedNutrition,
          percentage: 0 // Will be calculated later
        });

        // Add to total
        this.addNutrition(totalNutrition, estimatedNutrition);
        continue;
      }

      // Chuyển đổi về gram để tính toán
      const amountInGrams = this.convertToGrams(
        ingredient.amount,
        ingredient.unit,
        standardIngredient
      );

      // Tính dinh dưỡng dựa trên 100g
      const nutritionPer100g = standardIngredient.nutritionPer100g;
      const multiplier = amountInGrams / 100;

      const ingredientNutrition: NutritionInfo = {
        calories: Math.round(nutritionPer100g.calories * multiplier),
        protein: Math.round(nutritionPer100g.protein * multiplier * 10) / 10,
        carbs: Math.round(nutritionPer100g.carbs * multiplier * 10) / 10,
        fat: Math.round(nutritionPer100g.fat * multiplier * 10) / 10,
        fiber: Math.round((nutritionPer100g.fiber || 0) * multiplier * 10) / 10,
        sugar: Math.round((nutritionPer100g.sugar || 0) * multiplier * 10) / 10,
        sodium: Math.round((nutritionPer100g.sodium || 0) * multiplier),
        calcium: Math.round((nutritionPer100g.calcium || 0) * multiplier),
        iron: Math.round((nutritionPer100g.iron || 0) * multiplier * 10) / 10,
        vitaminC: Math.round((nutritionPer100g.vitaminC || 0) * multiplier * 10) / 10
      };

      ingredientNutritions.push({
        ingredientId: ingredient.ingredientId,
        name: standardIngredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        nutrition: ingredientNutrition,
        percentage: 0 // Will be calculated later
      });

      // Add to total
      this.addNutrition(totalNutrition, ingredientNutrition);
    }

    // Tính phần trăm contribution của từng nguyên liệu
    ingredientNutritions.forEach(ing => {
      ing.percentage = totalNutrition.calories > 0 
        ? Math.round((ing.nutrition.calories / totalNutrition.calories) * 100)
        : 0;
    });

    // Tính dinh dưỡng per serving
    const perServing: NutritionInfo = {
      calories: Math.round(totalNutrition.calories / servings),
      protein: Math.round(totalNutrition.protein / servings * 10) / 10,
      carbs: Math.round(totalNutrition.carbs / servings * 10) / 10,
      fat: Math.round(totalNutrition.fat / servings * 10) / 10,
      fiber: Math.round((totalNutrition.fiber || 0) / servings * 10) / 10,
      sugar: Math.round((totalNutrition.sugar || 0) / servings * 10) / 10,
      sodium: Math.round((totalNutrition.sodium || 0) / servings),
      calcium: Math.round((totalNutrition.calcium || 0) / servings),
      iron: Math.round((totalNutrition.iron || 0) / servings * 10) / 10,
      vitaminC: Math.round((totalNutrition.vitaminC || 0) / servings * 10) / 10
    };

    // Tính macro distribution
    const totalCaloriesFromMacros = 
      (perServing.protein * this.CALORIES_PER_GRAM.protein) +
      (perServing.carbs * this.CALORIES_PER_GRAM.carbs) +
      (perServing.fat * this.CALORIES_PER_GRAM.fat);

    const macroDistribution = {
      proteinPercent: totalCaloriesFromMacros > 0 
        ? Math.round((perServing.protein * this.CALORIES_PER_GRAM.protein / totalCaloriesFromMacros) * 100)
        : 0,
      carbsPercent: totalCaloriesFromMacros > 0 
        ? Math.round((perServing.carbs * this.CALORIES_PER_GRAM.carbs / totalCaloriesFromMacros) * 100)
        : 0,
      fatPercent: totalCaloriesFromMacros > 0 
        ? Math.round((perServing.fat * this.CALORIES_PER_GRAM.fat / totalCaloriesFromMacros) * 100)
        : 0
    };

    // Tính Daily Value percentages
    const dailyValuePercent = {
      calories: Math.round((perServing.calories / this.DAILY_VALUES.calories) * 100),
      protein: Math.round((perServing.protein / this.DAILY_VALUES.protein) * 100),
      carbs: Math.round((perServing.carbs / this.DAILY_VALUES.carbs) * 100),
      fat: Math.round((perServing.fat / this.DAILY_VALUES.fat) * 100),
      fiber: Math.round(((perServing.fiber || 0) / this.DAILY_VALUES.fiber) * 100),
      sodium: Math.round(((perServing.sodium || 0) / this.DAILY_VALUES.sodium) * 100)
    };

    // Tính health score và recommendations
    const { healthScore, recommendations, warnings } = this.calculateHealthScore(perServing, macroDistribution);

    return {
      total: totalNutrition,
      perServing,
      ingredients: ingredientNutritions,
      macroDistribution,
      dailyValuePercent,
      healthScore,
      recommendations,
      warnings
    };
  }

  /**
   * Chuyển đổi đơn vị về gram
   */
  private static convertToGrams(
    amount: number,
    unit: string,
    ingredient: StandardIngredient
  ): number {
    const normalizedUnit = unit.toLowerCase().trim();
    
    // Nếu đã là gram
    if (normalizedUnit === 'g' || normalizedUnit === 'gram') {
      return amount;
    }

    // Sử dụng conversion rates từ ingredient
    if (ingredient.conversionRates[normalizedUnit]) {
      return amount * ingredient.conversionRates[normalizedUnit];
    }

    // Conversion rates chung
    const commonConversions: { [key: string]: number } = {
      'kg': 1000,
      'lạng': 100,
      'ml': 1, // Assume 1ml = 1g for liquids
      'l': 1000,
      'thìa': 15,
      'thìa cà phê': 5,
      'cup': 240,
      'tbsp': 15,
      'tsp': 5
    };

    if (commonConversions[normalizedUnit]) {
      return amount * commonConversions[normalizedUnit];
    }

    // Fallback: estimate based on ingredient type
    return this.estimateGramsFromUnit(amount, normalizedUnit, ingredient.category);
  }

  /**
   * Ước tính gram từ đơn vị dựa trên category
   */
  private static estimateGramsFromUnit(
    amount: number,
    unit: string,
    category: string
  ): number {
    const estimates: { [key: string]: { [unit: string]: number } } = {
      'rau-cu-qua': {
        'củ': 150, // 1 củ = 150g
        'quả': 200, // 1 quả = 200g
        'lá': 5,    // 1 lá = 5g
        'cây': 100  // 1 cây = 100g
      },
      'thit-hai-san': {
        'miếng': 100, // 1 miếng = 100g
        'con': 500,   // 1 con = 500g
        'kg': 1000
      }
    };

    const categoryEstimates = estimates[category];
    if (categoryEstimates && categoryEstimates[unit]) {
      return amount * categoryEstimates[unit];
    }

    // Default fallback
    return amount * 100; // Assume 1 unit = 100g
  }

  /**
   * Ước tính dinh dưỡng dựa trên category khi không có data chính xác
   */
  private static estimateNutritionByCategory(
    category: string,
    amount: number,
    unit: string
  ): NutritionInfo {
    const amountInGrams = this.estimateGramsFromUnit(amount, unit, category);
    const multiplier = amountInGrams / 100;

    const categoryNutrition: { [key: string]: NutritionInfo } = {
      'thit-hai-san': {
        calories: 200, protein: 20, carbs: 0, fat: 10,
        fiber: 0, sugar: 0, sodium: 100, calcium: 20, iron: 2, vitaminC: 0
      },
      'rau-cu-qua': {
        calories: 25, protein: 2, carbs: 5, fat: 0.2,
        fiber: 2, sugar: 3, sodium: 10, calcium: 40, iron: 1, vitaminC: 20
      },
      'gia-vi-bot': {
        calories: 300, protein: 10, carbs: 60, fat: 2,
        fiber: 5, sugar: 1, sodium: 1000, calcium: 100, iron: 5, vitaminC: 0
      },
      'sua-trung': {
        calories: 150, protein: 12, carbs: 5, fat: 10,
        fiber: 0, sugar: 5, sodium: 100, calcium: 200, iron: 1, vitaminC: 0
      },
      'dau-mo': {
        calories: 884, protein: 0, carbs: 0, fat: 100,
        fiber: 0, sugar: 0, sodium: 0, calcium: 0, iron: 0, vitaminC: 0
      }
    };

    const baseNutrition = categoryNutrition[category] || categoryNutrition['rau-cu-qua'];
    
    return {
      calories: Math.round(baseNutrition.calories * multiplier),
      protein: Math.round(baseNutrition.protein * multiplier * 10) / 10,
      carbs: Math.round(baseNutrition.carbs * multiplier * 10) / 10,
      fat: Math.round(baseNutrition.fat * multiplier * 10) / 10,
      fiber: Math.round((baseNutrition.fiber || 0) * multiplier * 10) / 10,
      sugar: Math.round((baseNutrition.sugar || 0) * multiplier * 10) / 10,
      sodium: Math.round((baseNutrition.sodium || 0) * multiplier),
      calcium: Math.round((baseNutrition.calcium || 0) * multiplier),
      iron: Math.round((baseNutrition.iron || 0) * multiplier * 10) / 10,
      vitaminC: Math.round((baseNutrition.vitaminC || 0) * multiplier * 10) / 10
    };
  }

  /**
   * Cộng dồn dinh dưỡng
   */
  private static addNutrition(total: NutritionInfo, add: NutritionInfo): void {
    total.calories += add.calories;
    total.protein += add.protein;
    total.carbs += add.carbs;
    total.fat += add.fat;
    total.fiber = (total.fiber || 0) + (add.fiber || 0);
    total.sugar = (total.sugar || 0) + (add.sugar || 0);
    total.sodium = (total.sodium || 0) + (add.sodium || 0);
    total.calcium = (total.calcium || 0) + (add.calcium || 0);
    total.iron = (total.iron || 0) + (add.iron || 0);
    total.vitaminC = (total.vitaminC || 0) + (add.vitaminC || 0);
  }

  /**
   * Tính health score và đưa ra recommendations
   */
  private static calculateHealthScore(
    nutrition: NutritionInfo,
    macroDistribution: { proteinPercent: number; carbsPercent: number; fatPercent: number }
  ): { healthScore: number; recommendations: string[]; warnings: string[] } {
    let score = 100;
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Check calories
    if (nutrition.calories > 800) {
      score -= 10;
      warnings.push('Món ăn có lượng calo cao (>800 kcal/khẩu phần)');
      recommendations.push('Cân nhắc giảm khẩu phần hoặc thay thế nguyên liệu ít calo hơn');
    } else if (nutrition.calories < 200) {
      recommendations.push('Món ăn có lượng calo thấp, phù hợp cho chế độ ăn kiêng');
    }

    // Check protein
    if (macroDistribution.proteinPercent < 15) {
      score -= 5;
      recommendations.push('Nên tăng thêm protein (hiện tại chỉ ' + macroDistribution.proteinPercent + '%)');
    } else if (macroDistribution.proteinPercent > 30) {
      recommendations.push('Lượng protein cao (' + macroDistribution.proteinPercent + '%), tốt cho xây dựng cơ bắp');
    }

    // Check fat
    if (macroDistribution.fatPercent > 40) {
      score -= 15;
      warnings.push('Lượng chất béo cao (' + macroDistribution.fatPercent + '%)');
      recommendations.push('Cân nhắc giảm dầu mỡ hoặc chọn nguyên liệu ít béo hơn');
    }

    // Check sodium
    if ((nutrition.sodium || 0) > 1000) {
      score -= 10;
      warnings.push('Lượng natri cao, có thể ảnh hưởng đến huyết áp');
      recommendations.push('Giảm muối và gia vị có natri cao');
    }

    // Check fiber
    if ((nutrition.fiber || 0) > 5) {
      score += 5;
      recommendations.push('Giàu chất xơ, tốt cho tiêu hóa');
    } else if ((nutrition.fiber || 0) < 2) {
      recommendations.push('Nên thêm rau xanh để tăng chất xơ');
    }

    // Check vitamin C
    if ((nutrition.vitaminC || 0) > 20) {
      score += 5;
      recommendations.push('Giàu vitamin C, tốt cho hệ miễn dịch');
    }

    return {
      healthScore: Math.max(0, Math.min(100, score)),
      recommendations,
      warnings
    };
  }

  /**
   * So sánh với mục tiêu dinh dưỡng
   */
  static compareWithGoals(
    nutrition: NutritionInfo,
    goals: Partial<NutritionGoals>
  ): {
    comparison: { [key: string]: { actual: number; goal: number; percentage: number; status: 'under' | 'over' | 'good' } };
    overallScore: number;
  } {
    const comparison: any = {};
    let totalScore = 0;
    let itemCount = 0;

    Object.entries(goals).forEach(([key, goalValue]) => {
      if (goalValue && nutrition[key as keyof NutritionInfo] !== undefined) {
        const actual = nutrition[key as keyof NutritionInfo] as number;
        const percentage = Math.round((actual / goalValue) * 100);
        
        let status: 'under' | 'over' | 'good' = 'good';
        let score = 100;

        if (percentage < 80) {
          status = 'under';
          score = percentage;
        } else if (percentage > 120) {
          status = 'over';
          score = Math.max(0, 100 - (percentage - 120));
        }

        comparison[key] = {
          actual,
          goal: goalValue,
          percentage,
          status
        };

        totalScore += score;
        itemCount++;
      }
    });

    return {
      comparison,
      overallScore: itemCount > 0 ? Math.round(totalScore / itemCount) : 0
    };
  }

  /**
   * Đề xuất điều chỉnh nguyên liệu để đạt mục tiêu
   */
  static suggestAdjustments(
    currentNutrition: NutritionBreakdown,
    goals: Partial<NutritionGoals>
  ): string[] {
    const suggestions: string[] = [];
    const { comparison } = this.compareWithGoals(currentNutrition.perServing, goals);

    Object.entries(comparison).forEach(([nutrient, data]) => {
      if (data.status === 'under') {
        switch (nutrient) {
          case 'protein':
            suggestions.push('Thêm thịt, cá, trứng hoặc đậu để tăng protein');
            break;
          case 'fiber':
            suggestions.push('Thêm rau xanh, trái cây hoặc ngũ cốc nguyên hạt để tăng chất xơ');
            break;
          case 'calories':
            suggestions.push('Thêm dầu ăn, hạt hoặc tăng khẩu phần để tăng calo');
            break;
        }
      } else if (data.status === 'over') {
        switch (nutrient) {
          case 'calories':
            suggestions.push('Giảm dầu mỡ hoặc giảm khẩu phần để giảm calo');
            break;
          case 'fat':
            suggestions.push('Giảm dầu ăn, chọn thịt nạc thay vì thịt béo');
            break;
          case 'sodium':
            suggestions.push('Giảm muối, nước mắm và các gia vị có natri cao');
            break;
        }
      }
    });

    return suggestions;
  }
}
