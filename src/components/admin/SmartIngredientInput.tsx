import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  X,
  Search,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Package,
  Calculator,
  Zap
} from 'lucide-react';
import {
  IngredientManagementService,
  StandardIngredient,
  RecipeIngredient
} from '@/services/IngredientManagementService';
import { NutritionCalculatorService, NutritionInfo } from '@/services/NutritionCalculatorService';

interface SmartIngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  existingRecipes?: any[];
  className?: string;
  servings?: number;
  showNutrition?: boolean;
  onNutritionChange?: (nutrition: NutritionInfo) => void;
}

const SmartIngredientInput: React.FC<SmartIngredientInputProps> = ({
  value,
  onChange,
  existingRecipes = [],
  className,
  servings = 1,
  showNutrition = true,
  onNutritionChange
}) => {
  const [mode, setMode] = useState<'text' | 'structured'>('text');
  const [structuredIngredients, setStructuredIngredients] = useState<RecipeIngredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StandardIngredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [isCalculatingNutrition, setIsCalculatingNutrition] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Khởi tạo service nếu chưa có
    IngredientManagementService.initialize();
    
    // Parse ingredients từ text khi component mount
    if (value && mode === 'structured') {
      const parsed = IngredientManagementService.parseIngredientsFromText(value);
      setStructuredIngredients(parsed);
    }
  }, []);

  useEffect(() => {
    // Cập nhật text khi structured ingredients thay đổi
    if (mode === 'structured') {
      const text = IngredientManagementService.formatIngredientsToText(structuredIngredients);
      onChange(text);
    }
  }, [structuredIngredients, mode, onChange]);

  useEffect(() => {
    // Phân tích trùng lặp và đề xuất tối ưu hóa
    if (structuredIngredients.length > 0) {
      analyzeDuplicatesAndSuggestions();
      if (showNutrition) {
        calculateNutrition();
      }
    } else {
      setNutritionInfo(null);
    }
  }, [structuredIngredients, existingRecipes, servings, showNutrition]);

  const analyzeDuplicatesAndSuggestions = () => {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Kiểm tra trùng lặp với các công thức khác
    for (const recipe of existingRecipes) {
      if (recipe.ingredients) {
        const otherIngredients = IngredientManagementService.parseIngredientsFromText(recipe.ingredients);
        const commonIngredients = structuredIngredients.filter(ing1 =>
          otherIngredients.some(ing2 => ing1.ingredientId === ing2.ingredientId)
        );

        if (commonIngredients.length > 3) {
          warnings.push(`Có ${commonIngredients.length} nguyên liệu trùng với "${recipe.title}"`);
        }
      }
    }

    // Đề xuất tối ưu hóa
    if (structuredIngredients.length > 15) {
      suggestions.push('Công thức có nhiều nguyên liệu. Cân nhắc chia thành các bước chuẩn bị riêng.');
    }

    const expensiveIngredients = structuredIngredients.filter(ing => {
      const standard = IngredientManagementService.getIngredientsByCategory()
        .find(s => s.id === ing.ingredientId);
      return standard?.averagePrice && standard.averagePrice > 100000;
    });

    if (expensiveIngredients.length > 0) {
      suggestions.push(`Có ${expensiveIngredients.length} nguyên liệu đắt tiền. Cân nhắc đề xuất nguyên liệu thay thế.`);
    }

    setDuplicateWarnings(warnings);
    setOptimizationSuggestions(suggestions);
  };

  const calculateNutrition = async () => {
    if (!structuredIngredients.length) {
      setNutritionInfo(null);
      return;
    }

    setIsCalculatingNutrition(true);
    try {
      const nutritionBreakdown = NutritionCalculatorService.calculateNutritionFromIngredients(
        structuredIngredients,
        servings
      );

      setNutritionInfo(nutritionBreakdown.perServing);

      // Callback to parent component
      if (onNutritionChange) {
        onNutritionChange(nutritionBreakdown.perServing);
      }
    } catch (error) {
      console.error('Error calculating nutrition:', error);
      setNutritionInfo(null);
    } finally {
      setIsCalculatingNutrition(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      const results = IngredientManagementService.searchIngredients(term);
      setSearchResults(results.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const addIngredientFromSearch = (ingredient: StandardIngredient) => {
    const newIngredient: RecipeIngredient = {
      ingredientId: ingredient.id,
      amount: 1,
      unit: ingredient.baseUnit,
      note: ''
    };

    setStructuredIngredients([...structuredIngredients, newIngredient]);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    const updated = [...structuredIngredients];
    updated[index] = { ...updated[index], ...updates };
    setStructuredIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    const updated = structuredIngredients.filter((_, i) => i !== index);
    setStructuredIngredients(updated);
  };

  const switchToStructuredMode = () => {
    const parsed = IngredientManagementService.parseIngredientsFromText(value);
    setStructuredIngredients(parsed);
    setMode('structured');
  };

  const switchToTextMode = () => {
    setMode('text');
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      'thit-hai-san': 'bg-red-100 text-red-800',
      'rau-cu-qua': 'bg-green-100 text-green-800',
      'gia-vi-bot': 'bg-yellow-100 text-yellow-800',
      'sua-trung': 'bg-blue-100 text-blue-800',
      'khac': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['khac'];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <Label>Chế độ nhập:</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === 'text' ? 'default' : 'outline'}
            onClick={switchToTextMode}
          >
            Văn bản
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === 'structured' ? 'default' : 'outline'}
            onClick={switchToStructuredMode}
          >
            Có cấu trúc
          </Button>
        </div>
      </div>

      {/* Warnings and Suggestions */}
      {(duplicateWarnings.length > 0 || optimizationSuggestions.length > 0) && (
        <div className="space-y-2">
          {duplicateWarnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">{warning}</span>
            </div>
          ))}
          
          {optimizationSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {mode === 'text' ? (
        // Text Mode
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="Nhập từng nguyên liệu trên một dòng...&#10;VD:&#10;- 500g thịt bò&#10;- 200g bánh phở&#10;- 1 củ hành tây"
          className="font-mono"
        />
      ) : (
        // Structured Mode
        <div className="space-y-4">
          {/* Add Ingredient Search */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  placeholder="Tìm và thêm nguyên liệu..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const newIngredient: RecipeIngredient = {
                    ingredientId: 'custom-' + Date.now(),
                    amount: 1,
                    unit: 'phần',
                    note: 'Nguyên liệu tùy chỉnh'
                  };
                  setStructuredIngredients([...structuredIngredients, newIngredient]);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            {showSuggestions && searchResults.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto">
                <CardContent className="p-2">
                  {searchResults.map(ingredient => (
                    <div
                      key={ingredient.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded"
                      onClick={() => addIngredientFromSearch(ingredient)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ingredient.name}</span>
                        <Badge className={getCategoryColor(ingredient.category)} size="sm">
                          {ingredient.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{ingredient.baseUnit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ingredients List */}
          <div className="space-y-2">
            {structuredIngredients.map((ingredient, index) => {
              const standardIngredient = IngredientManagementService.getIngredientsByCategory()
                .find(s => s.id === ingredient.ingredientId);

              return (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <Input
                      type="number"
                      placeholder="Số lượng"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, { amount: parseFloat(e.target.value) || 0 })}
                      className="text-center"
                    />
                    
                    <Input
                      placeholder="Đơn vị"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                    />
                    
                    <div className="flex items-center">
                      <span className="font-medium">
                        {standardIngredient?.name || ingredient.ingredientId}
                      </span>
                      {standardIngredient && (
                        <Badge className={getCategoryColor(standardIngredient.category)} size="sm" className="ml-2">
                          {standardIngredient.category}
                        </Badge>
                      )}
                    </div>
                    
                    <Input
                      placeholder="Ghi chú (tùy chọn)"
                      value={ingredient.note || ''}
                      onChange={(e) => updateIngredient(index, { note: e.target.value })}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {structuredIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có nguyên liệu nào. Tìm kiếm để thêm nguyên liệu.</p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {structuredIngredients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Tổng: {structuredIngredients.length} nguyên liệu</span>
            <span>•</span>
            <span>
              Ước tính giá: {
                structuredIngredients.reduce((total, ing) => {
                  const standard = IngredientManagementService.getIngredientsByCategory()
                    .find(s => s.id === ing.ingredientId);
                  return total + (standard?.averagePrice || 0) * ing.amount;
                }, 0).toLocaleString()
              }đ
            </span>
          </div>

          {/* Nutrition Info */}
          {showNutrition && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-yellow-600" />
                    Thông tin dinh dưỡng
                    {servings > 1 && (
                      <span className="text-xs text-gray-500">({servings} khẩu phần)</span>
                    )}
                  </h4>
                  {isCalculatingNutrition && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Calculator className="h-3 w-3 animate-spin" />
                      Đang tính...
                    </div>
                  )}
                </div>

                {nutritionInfo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-2xl font-bold text-yellow-600">
                          {nutritionInfo.calories}
                        </span>
                      </div>
                      <div className="text-xs text-yellow-700">calories/khẩu phần</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Protein:</span>
                        <span className="font-medium">{nutritionInfo.protein}g</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-600">Carbs:</span>
                        <span className="font-medium">{nutritionInfo.carbs}g</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-600">Chất béo:</span>
                        <span className="font-medium">{nutritionInfo.fat}g</span>
                      </div>
                      {nutritionInfo.fiber && nutritionInfo.fiber > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">Chất xơ:</span>
                          <span className="font-medium">{nutritionInfo.fiber}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    <Calculator className="h-6 w-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Thêm nguyên liệu để xem thông tin dinh dưỡng</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartIngredientInput;
