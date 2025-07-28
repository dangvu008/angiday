import { FamilyMember } from '@/types/meal-planning';

/**
 * Service for calculating calorie needs and distribution for family members
 */
export class CalorieCalculatorService {
  
  /**
   * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
   */
  static calculateBMR(member: FamilyMember): number {
    const { weight, height, age, gender } = member;
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Calculate Total Daily Energy Expenditure (TDEE)
   */
  static calculateTDEE(member: FamilyMember): number {
    const bmr = this.calculateBMR(member);
    
    const activityMultipliers = {
      'sedentary': 1.2,      // Little to no exercise
      'light': 1.375,        // Light exercise 1-3 days/week
      'moderate': 1.55,      // Moderate exercise 3-5 days/week
      'active': 1.725,       // Heavy exercise 6-7 days/week
      'very-active': 1.9     // Very heavy exercise, physical job
    };
    
    return Math.round(bmr * activityMultipliers[member.activityLevel]);
  }

  /**
   * Update family member with calculated calorie needs
   */
  static updateMemberCalorieNeeds(member: FamilyMember): FamilyMember {
    return {
      ...member,
      dailyCalorieNeeds: this.calculateTDEE(member)
    };
  }

  /**
   * Calculate total family calorie needs
   */
  static calculateFamilyTotalCalories(familyMembers: FamilyMember[]): number {
    return familyMembers
      .filter(member => member.isActive)
      .reduce((total, member) => total + member.dailyCalorieNeeds, 0);
  }

  /**
   * Distribute meal calories among family members based on their daily needs
   */
  static distributeMealCalories(
    totalMealCalories: number,
    familyMembers: FamilyMember[]
  ): { [memberId: string]: { memberName: string; calories: number; percentage: number } } {
    const activeMembers = familyMembers.filter(member => member.isActive);
    const totalFamilyCalories = this.calculateFamilyTotalCalories(activeMembers);
    
    const distribution: { [memberId: string]: { memberName: string; calories: number; percentage: number } } = {};
    
    activeMembers.forEach(member => {
      const percentage = member.dailyCalorieNeeds / totalFamilyCalories;
      const memberCalories = Math.round(totalMealCalories * percentage);
      
      distribution[member.id] = {
        memberName: member.name,
        calories: memberCalories,
        percentage: Math.round(percentage * 100)
      };
    });
    
    return distribution;
  }

  /**
   * Get recommended calorie distribution for meals throughout the day
   */
  static getMealCalorieDistribution(dailyCalories: number): {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  } {
    return {
      breakfast: Math.round(dailyCalories * 0.25), // 25%
      lunch: Math.round(dailyCalories * 0.35),     // 35%
      dinner: Math.round(dailyCalories * 0.30),    // 30%
      snacks: Math.round(dailyCalories * 0.10)     // 10%
    };
  }

  /**
   * Calculate ideal portion sizes for each family member
   */
  static calculatePortionSizes(
    baseDishCalories: number,
    baseDishServings: number,
    familyMembers: FamilyMember[]
  ): { [memberId: string]: { servings: number; calories: number } } {
    const activeMembers = familyMembers.filter(member => member.isActive);
    const totalFamilyCalories = this.calculateFamilyTotalCalories(activeMembers);
    const caloriesPerServing = baseDishCalories / baseDishServings;
    
    const portions: { [memberId: string]: { servings: number; calories: number } } = {};
    
    activeMembers.forEach(member => {
      const memberRatio = member.dailyCalorieNeeds / totalFamilyCalories;
      const memberServings = Math.round((baseDishServings * memberRatio) * 10) / 10; // Round to 1 decimal
      const memberCalories = Math.round(memberServings * caloriesPerServing);
      
      portions[member.id] = {
        servings: memberServings,
        calories: memberCalories
      };
    });
    
    return portions;
  }

  /**
   * Get calorie recommendations by age group
   */
  static getCalorieRecommendationsByAge(age: number, gender: 'male' | 'female'): {
    sedentary: number;
    moderate: number;
    active: number;
  } {
    // Based on USDA Dietary Guidelines
    const recommendations: { [key: string]: { [key: string]: { sedentary: number; moderate: number; active: number } } } = {
      male: {
        '2-3': { sedentary: 1000, moderate: 1200, active: 1400 },
        '4-8': { sedentary: 1400, moderate: 1600, active: 2000 },
        '9-13': { sedentary: 1800, moderate: 2000, active: 2600 },
        '14-18': { sedentary: 2200, moderate: 2800, active: 3200 },
        '19-30': { sedentary: 2400, moderate: 2700, active: 3000 },
        '31-50': { sedentary: 2200, moderate: 2500, active: 2900 },
        '51+': { sedentary: 2000, moderate: 2300, active: 2600 }
      },
      female: {
        '2-3': { sedentary: 1000, moderate: 1200, active: 1400 },
        '4-8': { sedentary: 1200, moderate: 1500, active: 1800 },
        '9-13': { sedentary: 1600, moderate: 1900, active: 2200 },
        '14-18': { sedentary: 1800, moderate: 2000, active: 2400 },
        '19-30': { sedentary: 2000, moderate: 2200, active: 2400 },
        '31-50': { sedentary: 1800, moderate: 2000, active: 2200 },
        '51+': { sedentary: 1600, moderate: 1800, active: 2000 }
      }
    };

    let ageGroup = '19-30';
    if (age <= 3) ageGroup = '2-3';
    else if (age <= 8) ageGroup = '4-8';
    else if (age <= 13) ageGroup = '9-13';
    else if (age <= 18) ageGroup = '14-18';
    else if (age <= 30) ageGroup = '19-30';
    else if (age <= 50) ageGroup = '31-50';
    else ageGroup = '51+';

    return recommendations[gender][ageGroup];
  }

  /**
   * Validate family member data
   */
  static validateFamilyMember(member: Partial<FamilyMember>): string[] {
    const errors: string[] = [];
    
    if (!member.name || member.name.trim().length === 0) {
      errors.push('Tên không được để trống');
    }
    
    if (!member.age || member.age < 1 || member.age > 120) {
      errors.push('Tuổi phải từ 1 đến 120');
    }
    
    if (!member.weight || member.weight < 1 || member.weight > 300) {
      errors.push('Cân nặng phải từ 1kg đến 300kg');
    }
    
    if (!member.height || member.height < 30 || member.height > 250) {
      errors.push('Chiều cao phải từ 30cm đến 250cm');
    }
    
    if (!member.gender || !['male', 'female'].includes(member.gender)) {
      errors.push('Giới tính phải là nam hoặc nữ');
    }
    
    if (!member.activityLevel || !['sedentary', 'light', 'moderate', 'active', 'very-active'].includes(member.activityLevel)) {
      errors.push('Mức độ hoạt động không hợp lệ');
    }
    
    return errors;
  }
}
