import React, { useState } from 'react';
import { X, Check, Circle, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CookingRecipe } from '@/types/cookingMode';
import { cn } from '@/lib/utils';

interface IngredientsListProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: CookingRecipe[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ 
  isOpen, 
  onClose, 
  recipes 
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Consolidate all ingredients from all recipes
  const consolidatedIngredients = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach(ingredient => {
      const existing = acc.find(item => item.name === ingredient);
      if (existing) {
        existing.recipes.push(recipe.name);
      } else {
        acc.push({
          name: ingredient,
          recipes: [recipe.name]
        });
      }
    });
    return acc;
  }, [] as Array<{ name: string; recipes: string[] }>);

  const handleToggleIngredient = (ingredient: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedIngredients(newChecked);
  };

  const checkedCount = checkedIngredients.size;
  const totalCount = consolidatedIngredients.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-gray-800 border-gray-700 text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-green-400" />
              Danh sách nguyên liệu
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              {checkedCount} / {totalCount} đã chuẩn bị ({Math.round(progress)}%)
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
          {/* Progress Bar */}
          <div className="p-4 border-b border-gray-700">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Ingredients by Recipe */}
          <div className="space-y-6 p-4">
            {recipes.map((recipe, recipeIndex) => (
              <div key={recipe.id} className="space-y-3">
                <h3 className="font-medium text-orange-400 flex items-center">
                  <Circle className="h-4 w-4 mr-2" />
                  {recipe.name}
                  <span className="ml-2 text-xs text-gray-500">
                    ({recipe.ingredients.length} nguyên liệu)
                  </span>
                </h3>

                <div className="grid gap-2 ml-6">
                  {recipe.ingredients.map((ingredient, ingredientIndex) => {
                    const isChecked = checkedIngredients.has(ingredient);
                    const consolidatedItem = consolidatedIngredients.find(item => item.name === ingredient);
                    const isShared = consolidatedItem && consolidatedItem.recipes.length > 1;

                    return (
                      <div
                        key={`${recipe.id}-${ingredientIndex}`}
                        className={cn(
                          "flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-700/50",
                          isChecked && "bg-green-900/20 border border-green-700"
                        )}
                        onClick={() => handleToggleIngredient(ingredient)}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleIngredient(ingredient)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        
                        <div className="flex-1">
                          <span className={cn(
                            "text-sm",
                            isChecked && "line-through text-gray-500"
                          )}>
                            {ingredient}
                          </span>
                          
                          {isShared && (
                            <div className="text-xs text-blue-400 mt-1">
                              Dùng chung cho: {consolidatedItem.recipes.join(', ')}
                            </div>
                          )}
                        </div>

                        {isChecked && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {consolidatedIngredients.length > 0 && (
            <div className="border-t border-gray-700 p-4 bg-gray-800/50">
              <h3 className="font-medium text-gray-300 mb-3">
                Tổng hợp nguyên liệu ({consolidatedIngredients.length} loại)
              </h3>
              
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {consolidatedIngredients.map((item, index) => {
                  const isChecked = checkedIngredients.has(item.name);
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-2 rounded text-sm",
                        isChecked 
                          ? "bg-green-900/20 text-green-300" 
                          : "bg-gray-700/50 text-gray-300"
                      )}
                    >
                      <span className={cn(isChecked && "line-through")}>
                        {item.name}
                      </span>
                      
                      {item.recipes.length > 1 && (
                        <span className="text-xs text-blue-400">
                          {item.recipes.length} món
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {checkedCount === totalCount ? (
                <span className="text-green-400 font-medium">
                  ✅ Đã chuẩn bị đầy đủ nguyên liệu!
                </span>
              ) : (
                <span>
                  Còn lại {totalCount - checkedCount} nguyên liệu cần chuẩn bị
                </span>
              )}
            </div>
            
            <Button
              onClick={onClose}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Đóng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IngredientsList;
