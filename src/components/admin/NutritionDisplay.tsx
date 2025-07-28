import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  Zap,
  Activity,
  Wheat,
  Droplets,
  Heart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';
import { 
  NutritionCalculatorService, 
  NutritionBreakdown, 
  NutritionInfo,
  NutritionGoals 
} from '@/services/NutritionCalculatorService';
import { IngredientManagementService, RecipeIngredient } from '@/services/IngredientManagementService';

interface NutritionDisplayProps {
  ingredients: string;
  servings: number;
  onNutritionChange?: (nutrition: NutritionInfo) => void;
  showGoals?: boolean;
  className?: string;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  ingredients,
  servings,
  onNutritionChange,
  showGoals = false,
  className
}) => {
  const [nutritionData, setNutritionData] = useState<NutritionBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [goals, setGoals] = useState<Partial<NutritionGoals>>({
    calories: 500,
    protein: 25,
    carbs: 60,
    fat: 20,
    fiber: 8,
    sodium: 800
  });

  useEffect(() => {
    calculateNutrition();
  }, [ingredients, servings]);

  useEffect(() => {
    if (nutritionData && onNutritionChange) {
      onNutritionChange(nutritionData.perServing);
    }
  }, [nutritionData, onNutritionChange]);

  const calculateNutrition = async () => {
    if (!ingredients.trim()) {
      setNutritionData(null);
      return;
    }

    setIsCalculating(true);
    try {
      // Parse ingredients
      const parsedIngredients = IngredientManagementService.parseIngredientsFromText(ingredients);
      
      // Calculate nutrition
      const nutrition = NutritionCalculatorService.calculateNutritionFromIngredients(
        parsedIngredients,
        servings
      );
      
      setNutritionData(nutrition);
    } catch (error) {
      console.error('Error calculating nutrition:', error);
      setNutritionData(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const getNutritionIcon = (type: string) => {
    switch (type) {
      case 'calories': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'protein': return <Activity className="h-4 w-4 text-red-500" />;
      case 'carbs': return <Wheat className="h-4 w-4 text-amber-500" />;
      case 'fat': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'fiber': return <Heart className="h-4 w-4 text-green-500" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMacroColor = (type: string) => {
    switch (type) {
      case 'protein': return 'bg-red-500';
      case 'carbs': return 'bg-amber-500';
      case 'fat': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isCalculating) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Calculator className="h-5 w-5 animate-spin" />
            <span>Đang tính toán dinh dưỡng...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nutritionData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nhập nguyên liệu để xem thông tin dinh dưỡng</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const goalsComparison = showGoals 
    ? NutritionCalculatorService.compareWithGoals(nutritionData.perServing, goals)
    : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header với Health Score */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Thông Tin Dinh Dưỡng
              {servings > 1 && (
                <Badge variant="outline">
                  {servings} khẩu phần
                </Badge>
              )}
            </CardTitle>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(nutritionData.healthScore)}`}>
              <Heart className="h-4 w-4 inline mr-1" />
              {nutritionData.healthScore}/100
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="breakdown">Chi tiết</TabsTrigger>
              <TabsTrigger value="ingredients">Nguyên liệu</TabsTrigger>
              {showGoals && <TabsTrigger value="goals">Mục tiêu</TabsTrigger>}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Main Calories */}
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="text-4xl font-bold text-yellow-600 mb-1">
                  {nutritionData.perServing.calories}
                </div>
                <div className="text-sm text-yellow-700">calories mỗi khẩu phần</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {nutritionData.dailyValuePercent.calories}% nhu cầu hàng ngày
                </div>
              </div>

              {/* Macro Distribution */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {nutritionData.perServing.protein}g
                  </div>
                  <div className="text-sm text-red-700">Protein</div>
                  <div className="text-xs text-red-600">
                    {nutritionData.macroDistribution.proteinPercent}%
                  </div>
                </div>
                
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {nutritionData.perServing.carbs}g
                  </div>
                  <div className="text-sm text-amber-700">Carbs</div>
                  <div className="text-xs text-amber-600">
                    {nutritionData.macroDistribution.carbsPercent}%
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {nutritionData.perServing.fat}g
                  </div>
                  <div className="text-sm text-blue-700">Chất béo</div>
                  <div className="text-xs text-blue-600">
                    {nutritionData.macroDistribution.fatPercent}%
                  </div>
                </div>
              </div>

              {/* Macro Distribution Chart */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Phân bố macro
                </h4>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${nutritionData.macroDistribution.proteinPercent}%` }}
                  />
                  <div 
                    className="bg-amber-500" 
                    style={{ width: `${nutritionData.macroDistribution.carbsPercent}%` }}
                  />
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${nutritionData.macroDistribution.fatPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Protein {nutritionData.macroDistribution.proteinPercent}%</span>
                  <span>Carbs {nutritionData.macroDistribution.carbsPercent}%</span>
                  <span>Fat {nutritionData.macroDistribution.fatPercent}%</span>
                </div>
              </div>
            </TabsContent>

            {/* Detailed Breakdown */}
            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'calories', label: 'Calories', value: nutritionData.perServing.calories, unit: 'kcal', dv: nutritionData.dailyValuePercent.calories },
                  { key: 'protein', label: 'Protein', value: nutritionData.perServing.protein, unit: 'g', dv: nutritionData.dailyValuePercent.protein },
                  { key: 'carbs', label: 'Carbohydrate', value: nutritionData.perServing.carbs, unit: 'g', dv: nutritionData.dailyValuePercent.carbs },
                  { key: 'fat', label: 'Chất béo', value: nutritionData.perServing.fat, unit: 'g', dv: nutritionData.dailyValuePercent.fat },
                  { key: 'fiber', label: 'Chất xơ', value: nutritionData.perServing.fiber || 0, unit: 'g', dv: nutritionData.dailyValuePercent.fiber || 0 },
                  { key: 'sodium', label: 'Natri', value: nutritionData.perServing.sodium || 0, unit: 'mg', dv: nutritionData.dailyValuePercent.sodium || 0 }
                ].map((item) => (
                  <div key={item.key} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNutritionIcon(item.key)}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {item.value}{item.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.dv}% DV
                        </div>
                      </div>
                    </div>
                    <Progress value={Math.min(item.dv, 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Ingredients Breakdown */}
            <TabsContent value="ingredients" className="space-y-4">
              <div className="space-y-3">
                {nutritionData.ingredients
                  .sort((a, b) => b.nutrition.calories - a.nutrition.calories)
                  .map((ingredient, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-600">
                          {ingredient.nutrition.calories} kcal
                        </div>
                        <div className="text-xs text-gray-500">
                          {ingredient.percentage}% tổng calo
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-red-600">
                        P: {ingredient.nutrition.protein}g
                      </div>
                      <div className="text-amber-600">
                        C: {ingredient.nutrition.carbs}g
                      </div>
                      <div className="text-blue-600">
                        F: {ingredient.nutrition.fat}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Goals Comparison */}
            {showGoals && goalsComparison && (
              <TabsContent value="goals" className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {goalsComparison.overallScore}/100
                  </div>
                  <div className="text-sm text-gray-600">Điểm đạt mục tiêu</div>
                </div>

                <div className="space-y-3">
                  {Object.entries(goalsComparison.comparison).map(([key, data]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <Badge variant={
                          data.status === 'good' ? 'default' : 
                          data.status === 'under' ? 'secondary' : 'destructive'
                        }>
                          {data.status === 'good' ? 'Đạt' : 
                           data.status === 'under' ? 'Thiếu' : 'Thừa'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-2">
                        <span>Thực tế: {data.actual}</span>
                        <span>Mục tiêu: {data.goal}</span>
                      </div>
                      
                      <Progress 
                        value={Math.min(data.percentage, 150)} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {data.percentage}% mục tiêu
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Recommendations & Warnings */}
          {(nutritionData.recommendations.length > 0 || nutritionData.warnings.length > 0) && (
            <div className="mt-4 space-y-2">
              {nutritionData.warnings.map((warning, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{warning}</AlertDescription>
                </Alert>
              ))}
              
              {nutritionData.recommendations.map((rec, index) => (
                <Alert key={index}>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionDisplay;
