import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Users, Plus, Minus, Check, AlertCircle } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  note?: string;
}

interface KnorrIngredientsListProps {
  ingredients: Ingredient[];
  originalServings: number;
  className?: string;
}

const KnorrIngredientsList: React.FC<KnorrIngredientsListProps> = ({
  ingredients,
  originalServings,
  className = ""
}) => {
  const [servings, setServings] = useState(originalServings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const adjustAmount = (amount: string, ratio: number): string => {
    // Extract number from amount string
    const numberMatch = amount.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      const number = parseFloat(numberMatch[1]);
      const adjustedNumber = (number * ratio).toFixed(1);
      return amount.replace(numberMatch[1], adjustedNumber.replace('.0', ''));
    }
    return amount;
  };

  const ratio = servings / originalServings;

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const getCompletionPercentage = () => {
    return Math.round((checkedIngredients.size / ingredients.length) * 100);
  };

  const categorizeIngredients = (ingredients: Ingredient[]) => {
    // Simple categorization based on common ingredient types
    const categories = {
      'Thịt & Hải sản': [] as Ingredient[],
      'Rau củ': [] as Ingredient[],
      'Gia vị': [] as Ingredient[],
      'Khác': [] as Ingredient[]
    };

    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      if (name.includes('thịt') || name.includes('bò') || name.includes('gà') || name.includes('heo') || name.includes('tôm') || name.includes('cá')) {
        categories['Thịt & Hải sản'].push(ingredient);
      } else if (name.includes('hành') || name.includes('tỏi') || name.includes('gừng') || name.includes('rau') || name.includes('củ')) {
        categories['Rau củ'].push(ingredient);
      } else if (name.includes('muối') || name.includes('đường') || name.includes('nước mắm') || name.includes('tiêu') || name.includes('gia vị') || name.includes('quế') || name.includes('hồi')) {
        categories['Gia vị'].push(ingredient);
      } else {
        categories['Khác'].push(ingredient);
      }
    });

    return categories;
  };

  const categorizedIngredients = categorizeIngredients(ingredients);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Serving Adjuster */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Thành phần</h2>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            {ingredients.length} nguyên liệu
          </Badge>
        </div>

        {/* Serving Converter */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-900">Khẩu phần:</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 p-0 rounded-full border-orange-200 hover:bg-orange-50"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold text-orange-600 min-w-[3rem] text-center">
              {servings}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 p-0 rounded-full border-orange-200 hover:bg-orange-50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tiến độ chuẩn bị</span>
            <span className="text-sm font-bold text-orange-600">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Categorized Ingredients */}
      <div className="space-y-6">
        {Object.entries(categorizedIngredients).map(([category, categoryIngredients]) => {
          if (categoryIngredients.length === 0) return null;
          
          return (
            <Card key={category} className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  {category}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {categoryIngredients.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {categoryIngredients.map((ingredient, index) => {
                    const globalIndex = ingredients.indexOf(ingredient);
                    const isChecked = checkedIngredients.has(globalIndex);
                    
                    return (
                      <div
                        key={globalIndex}
                        className={`flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          isChecked ? 'bg-green-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredient(globalIndex)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        
                        <div className="flex-1 flex items-center justify-between">
                          <div className={`space-y-1 ${isChecked ? 'opacity-60' : ''}`}>
                            <div className={`font-medium text-gray-900 ${isChecked ? 'line-through' : ''}`}>
                              {ingredient.name}
                            </div>
                            {ingredient.note && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {ingredient.note}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-bold text-orange-600 ${isChecked ? 'line-through opacity-60' : ''}`}>
                              {adjustAmount(ingredient.amount, ratio)}
                            </div>
                            {ratio !== 1 && (
                              <div className="text-xs text-gray-500">
                                (gốc: {ingredient.amount})
                              </div>
                            )}
                          </div>
                        </div>

                        {isChecked && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <ShoppingCart className="h-5 w-5 mr-3" />
          Thêm vào danh sách mua ({checkedIngredients.size}/{ingredients.length})
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="py-3 rounded-xl font-semibold border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => setCheckedIngredients(new Set(ingredients.map((_, i) => i)))}
          >
            Chọn tất cả
          </Button>
          <Button 
            variant="outline" 
            className="py-3 rounded-xl font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => setCheckedIngredients(new Set())}
          >
            Bỏ chọn tất cả
          </Button>
        </div>
      </div>

      {/* Shopping Tips */}
      <Card className="bg-blue-50 border-blue-200 rounded-2xl">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Mẹo mua sắm
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Mua nguyên liệu tươi vào buổi sáng để đảm bảo chất lượng tốt nhất</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Kiểm tra hạn sử dụng của gia vị và nước mắm</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Có thể thay thế một số nguyên liệu theo sở thích cá nhân</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnorrIngredientsList;
