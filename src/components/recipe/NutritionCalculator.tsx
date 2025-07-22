import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp } from 'lucide-react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface NutritionCalculatorProps {
  nutrition: NutritionInfo;
  servings: number;
  className?: string;
}

export const NutritionCalculator = ({ 
  nutrition, 
  servings,
  className 
}: NutritionCalculatorProps) => {
  // Tính toán dinh dưỡng theo khẩu phần
  const calculatedNutrition = {
    calories: Math.round(nutrition.calories * servings),
    protein: Math.round(nutrition.protein * servings * 10) / 10,
    carbs: Math.round(nutrition.carbs * servings * 10) / 10,
    fat: Math.round(nutrition.fat * servings * 10) / 10,
    fiber: Math.round(nutrition.fiber * servings * 10) / 10,
    sugar: Math.round(nutrition.sugar * servings * 10) / 10,
  };

  // Tính tỷ lệ phần trăm macro (protein, carbs, fat)
  const totalCaloriesFromMacros = (calculatedNutrition.protein * 4) + 
                                  (calculatedNutrition.carbs * 4) + 
                                  (calculatedNutrition.fat * 9);
  
  const proteinPercent = totalCaloriesFromMacros > 0 
    ? Math.round((calculatedNutrition.protein * 4 / totalCaloriesFromMacros) * 100)
    : 0;
  const carbsPercent = totalCaloriesFromMacros > 0 
    ? Math.round((calculatedNutrition.carbs * 4 / totalCaloriesFromMacros) * 100)
    : 0;
  const fatPercent = totalCaloriesFromMacros > 0 
    ? Math.round((calculatedNutrition.fat * 9 / totalCaloriesFromMacros) * 100)
    : 0;

  const nutritionItems = [
    {
      label: 'Protein',
      value: calculatedNutrition.protein,
      unit: 'g',
      percent: proteinPercent,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Carbs',
      value: calculatedNutrition.carbs,
      unit: 'g',
      percent: carbsPercent,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Chất béo',
      value: calculatedNutrition.fat,
      unit: 'g',
      percent: fatPercent,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Thông tin dinh dưỡng
          {servings !== 1 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({servings} khẩu phần)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calories chính */}
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <div className="text-3xl font-bold text-primary">
            {calculatedNutrition.calories}
          </div>
          <div className="text-sm text-muted-foreground">Calories</div>
        </div>

        {/* Macro nutrients */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Thành phần dinh dưỡng chính
          </h4>
          {nutritionItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="text-right">
                  <span className={`font-medium ${item.textColor}`}>
                    {item.value}{item.unit}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({item.percent}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={item.percent} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Thông tin bổ sung */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {calculatedNutrition.fiber}g
            </div>
            <div className="text-xs text-muted-foreground">Chất xơ</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {calculatedNutrition.sugar}g
            </div>
            <div className="text-xs text-muted-foreground">Đường</div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded">
          * Thông tin dinh dưỡng được tính toán ước lượng dựa trên nguyên liệu
        </div>
      </CardContent>
    </Card>
  );
};