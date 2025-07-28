import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Wheat, Droplets, Apple, Heart } from 'lucide-react';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface KnorrNutritionFactsProps {
  nutrition: NutritionData;
  servings: number;
  className?: string;
}

const KnorrNutritionFacts: React.FC<KnorrNutritionFactsProps> = ({
  nutrition,
  servings,
  className = ""
}) => {
  // Daily Value percentages (based on 2000 calorie diet)
  const dailyValues = {
    calories: Math.round((nutrition.calories / 2000) * 100),
    protein: Math.round((nutrition.protein / 50) * 100),
    carbs: Math.round((nutrition.carbs / 300) * 100),
    fat: Math.round((nutrition.fat / 65) * 100),
    fiber: Math.round((nutrition.fiber / 25) * 100),
    sugar: Math.round((nutrition.sugar / 50) * 100)
  };

  const nutritionItems = [
    {
      name: 'Năng lượng',
      value: nutrition.calories,
      unit: 'kcal',
      dailyValue: dailyValues.calories,
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Chất đạm',
      value: nutrition.protein,
      unit: 'g',
      dailyValue: dailyValues.protein,
      icon: <Activity className="h-5 w-5 text-red-500" />,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Carbohydrate',
      value: nutrition.carbs,
      unit: 'g',
      dailyValue: dailyValues.carbs,
      icon: <Wheat className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      name: 'Chất béo',
      value: nutrition.fat,
      unit: 'g',
      dailyValue: dailyValues.fat,
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Chất xơ',
      value: nutrition.fiber,
      unit: 'g',
      dailyValue: dailyValues.fiber,
      icon: <Apple className="h-5 w-5 text-green-500" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Đường',
      value: nutrition.sugar,
      unit: 'g',
      dailyValue: dailyValues.sugar,
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50'
    }
  ];

  const getHealthScore = () => {
    // Simple health score calculation
    let score = 0;
    if (nutrition.fiber >= 3) score += 20;
    if (nutrition.protein >= 15) score += 20;
    if (nutrition.sugar <= 10) score += 20;
    if (nutrition.calories <= 500) score += 20;
    if (nutrition.fat <= 15) score += 20;
    return score;
  };

  const healthScore = getHealthScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Rất tốt cho sức khỏe';
    if (score >= 60) return 'Tốt cho sức khỏe';
    return 'Nên ăn vừa phải';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Giá trị dinh dưỡng</h3>
        <p className="text-sm text-gray-600">Cho mỗi khẩu phần ({servings} người)</p>
      </div>

      {/* Health Score */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(healthScore)}`}>
          <Heart className="h-4 w-4 mr-2" />
          <span className="font-semibold text-sm">{getScoreLabel(healthScore)}</span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-gray-900">{healthScore}/100</div>
          <div className="text-xs text-gray-500">Điểm sức khỏe</div>
        </div>
      </div>

      {/* Nutrition Grid */}
      <div className="grid grid-cols-1 gap-4">
        {nutritionItems.map((item, index) => (
          <div key={index} className={`p-4 rounded-xl ${item.bgColor} border border-gray-100`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.dailyValue}% DV*</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {item.value}
                  <span className="text-sm font-normal text-gray-600 ml-1">{item.unit}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={Math.min(item.dailyValue, 100)} 
                className="h-2"
                style={{
                  background: 'rgba(255,255,255,0.5)'
                }}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>0{item.unit}</span>
                <span className="font-medium">{item.dailyValue}% DV</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calories Breakdown */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-orange-800 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Phân tích calo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Từ chất đạm</span>
              <span className="font-semibold text-red-600">{Math.round(nutrition.protein * 4)} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Từ carbohydrate</span>
              <span className="font-semibold text-amber-600">{Math.round(nutrition.carbs * 4)} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Từ chất béo</span>
              <span className="font-semibold text-blue-600">{Math.round(nutrition.fat * 9)} kcal</span>
            </div>
            <div className="pt-2 border-t border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="font-bold text-orange-600 text-lg">{nutrition.calories} kcal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Value Note */}
      <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
        <p>* DV = Daily Value (Giá trị dinh dưỡng hàng ngày)</p>
        <p>Dựa trên chế độ ăn 2000 calo/ngày</p>
      </div>

      {/* Health Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            Lời khuyên dinh dưỡng
          </h4>
          <div className="space-y-2 text-sm text-green-700">
            {nutrition.fiber >= 3 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Giàu chất xơ, tốt cho tiêu hóa</span>
              </div>
            )}
            {nutrition.protein >= 15 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Cung cấp protein chất lượng cao</span>
              </div>
            )}
            {nutrition.calories <= 400 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Ít calo, phù hợp giảm cân</span>
              </div>
            )}
            {nutrition.sugar <= 10 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Ít đường, tốt cho sức khỏe</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnorrNutritionFacts;
