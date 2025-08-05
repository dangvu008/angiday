import { mockRecipes } from './mockRecipes';

export interface MockMealPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  meals: MockMeal[];
  createdDate: string;
  totalCost: number;
  totalCalories: number;
}

export interface MockMeal {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: {
    id: string;
    title: string;
    image: string;
    cookTime: string;
    calories: number;
    cost: number;
    ingredients: string[];
    difficulty: string;
    servings: number;
  };
  completed?: boolean;
}

// Tạo meal plan mẫu cho tuần này
const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const weekDates = getWeekDates();

// Tạo meals cho tuần này với dữ liệu thực tế
const createWeekMeals = (): MockMeal[] => {
  const meals: MockMeal[] = [];
  const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner'];
  
  weekDates.forEach((date, dayIndex) => {
    mealTypes.forEach((mealType, mealIndex) => {
      const mealId = `${date}-${mealType}`;
      
      // Chọn recipe phù hợp cho từng bữa
      let selectedRecipe;
      if (mealType === 'breakfast') {
        selectedRecipe = mockRecipes.find(r => r.category === 'Bữa sáng') || mockRecipes[7]; // Bánh mì ốp la
      } else if (mealType === 'lunch') {
        const lunchRecipes = [mockRecipes[0], mockRecipes[1], mockRecipes[6]]; // Gà rang gừng, Đậu phụ nhồi thịt, Cơm chiên
        selectedRecipe = lunchRecipes[dayIndex % lunchRecipes.length];
      } else if (mealType === 'dinner') {
        const dinnerRecipes = [mockRecipes[3], mockRecipes[4], mockRecipes[0]]; // Thịt kho, Cá nướng, Gà rang gừng
        selectedRecipe = dinnerRecipes[dayIndex % dinnerRecipes.length];
      }
      
      // Chỉ thêm meal nếu có recipe và không phải là ngày cuối tuần cho một số bữa
      const shouldAddMeal = selectedRecipe && (dayIndex < 5 || Math.random() > 0.3);
      
      if (shouldAddMeal && selectedRecipe) {
        meals.push({
          id: mealId,
          date,
          mealType,
          recipe: {
            id: selectedRecipe.id,
            title: selectedRecipe.title,
            image: selectedRecipe.image,
            cookTime: selectedRecipe.cookingTime,
            calories: selectedRecipe.nutrition.calories,
            cost: selectedRecipe.cost,
            ingredients: selectedRecipe.ingredients,
            difficulty: selectedRecipe.difficulty,
            servings: selectedRecipe.servings
          },
          completed: dayIndex < 2 // Đánh dấu 2 ngày đầu đã hoàn thành
        });
      } else {
        // Thêm meal trống
        meals.push({
          id: mealId,
          date,
          mealType,
          completed: false
        });
      }
    });
  });
  
  return meals;
};

export const mockMealPlans: MockMealPlan[] = [
  {
    id: 'plan-1',
    name: 'Kế hoạch tuần này',
    description: 'Thực đơn gia đình cân bằng dinh dưỡng cho tuần 29/07 - 04/08',
    startDate: weekDates[0],
    endDate: weekDates[6],
    status: 'active',
    meals: createWeekMeals(),
    createdDate: '2024-07-28',
    totalCost: 385000,
    totalCalories: 12600
  },
  {
    id: 'plan-2',
    name: 'Thực đơn tiết kiệm',
    description: 'Kế hoạch ăn uống tiết kiệm nhưng vẫn đầy đủ dinh dưỡng',
    startDate: '2024-07-22',
    endDate: '2024-07-28',
    status: 'completed',
    meals: [],
    createdDate: '2024-07-21',
    totalCost: 280000,
    totalCalories: 11200
  },
  {
    id: 'plan-3',
    name: 'Thực đơn healthy',
    description: 'Tập trung vào các món ăn ít calo, nhiều rau xanh',
    startDate: '2024-08-05',
    endDate: '2024-08-11',
    status: 'draft',
    meals: [],
    createdDate: '2024-07-29',
    totalCost: 420000,
    totalCalories: 10500
  }
];

// Active plan (kế hoạch đang áp dụng)
export const activeMealPlan = mockMealPlans[0];

// Today's meals
export const getTodayMeals = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = activeMealPlan.meals.filter(meal => meal.date === today);
  
  return {
    breakfast: todayMeals.find(meal => meal.mealType === 'breakfast') || null,
    lunch: todayMeals.find(meal => meal.mealType === 'lunch') || null,
    dinner: todayMeals.find(meal => meal.mealType === 'dinner') || null,
    snack: todayMeals.find(meal => meal.mealType === 'snack') || null
  };
};

// Weekly stats
export const getWeeklyStats = () => {
  const completedMeals = activeMealPlan.meals.filter(meal => meal.recipe).length;
  const totalMeals = 21; // 7 days * 3 meals
  const totalCost = activeMealPlan.meals
    .filter(meal => meal.recipe)
    .reduce((sum, meal) => sum + (meal.recipe?.cost || 0), 0);
  
  return {
    totalSpent: totalCost,
    budget: 700000,
    caloriesTarget: 2000,
    caloriesConsumed: 1850,
    mealsCompleted: completedMeals,
    totalMeals,
    weeklyProgress: Math.round((completedMeals / totalMeals) * 100),
    daysRemaining: 7 - Math.floor((new Date().getTime() - new Date(activeMealPlan.startDate).getTime()) / (1000 * 60 * 60 * 24))
  };
};
