import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Download, 
  Printer, 
  Share2,
  Trash2,
  CheckCircle,
  Package,
  Beef,
  Fish,
  Carrot,
  Wheat,
  Milk
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  recipeNames: string[];
  checked: boolean;
}

interface MealSlot {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe?: {
    id: string;
    title: string;
    ingredients: string[];
  };
}

interface ShoppingListGeneratorProps {
  planId?: string;
  planName?: string;
  useActivePlan?: boolean;
  selectedMeals?: MealSlot[]; // New prop for selected meals
}

const ShoppingListGenerator: React.FC<ShoppingListGeneratorProps> = ({
  planId,
  planName,
  useActivePlan = false,
  selectedMeals
}) => {
  const { generateShoppingList, generateActiveShoppingList, activePlan, userMealPlans } = useMealPlanning();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Generate shopping list from selected meals
  const generateShoppingListFromMeals = (meals: MealSlot[]) => {
    const ingredientMap: { [category: string]: Set<string> } = {};

    meals.forEach(meal => {
      if (meal.recipe && meal.recipe.ingredients) {
        meal.recipe.ingredients.forEach(ingredient => {
          // Categorize ingredients (simple categorization)
          const category = categorizeIngredient(ingredient);

          if (!ingredientMap[category]) {
            ingredientMap[category] = new Set();
          }
          ingredientMap[category].add(ingredient);
        });
      }
    });

    // Convert Sets to Arrays
    const result: { [category: string]: string[] } = {};
    Object.entries(ingredientMap).forEach(([category, ingredientSet]) => {
      result[category] = Array.from(ingredientSet);
    });

    return result;
  };

  // Simple ingredient categorization
  const categorizeIngredient = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase();

    if (lowerIngredient.includes('thịt') || lowerIngredient.includes('bò') ||
        lowerIngredient.includes('heo') || lowerIngredient.includes('gà') ||
        lowerIngredient.includes('cá') || lowerIngredient.includes('tôm')) {
      return 'Thịt & Hải sản';
    }

    if (lowerIngredient.includes('rau') || lowerIngredient.includes('củ') ||
        lowerIngredient.includes('cà chua') || lowerIngredient.includes('hành')) {
      return 'Rau củ';
    }

    if (lowerIngredient.includes('sữa') || lowerIngredient.includes('trứng') ||
        lowerIngredient.includes('phô mai')) {
      return 'Sữa & Trứng';
    }

    if (lowerIngredient.includes('gạo') || lowerIngredient.includes('bún') ||
        lowerIngredient.includes('bánh') || lowerIngredient.includes('mì')) {
      return 'Ngũ cốc';
    }

    return 'Nguyên liệu khác';
  };

  // Get shopping list data
  const shoppingData = useMemo(() => {
    if (selectedMeals && selectedMeals.length > 0) {
      return generateShoppingListFromMeals(selectedMeals);
    } else if (useActivePlan) {
      return generateActiveShoppingList();
    } else if (planId) {
      return generateShoppingList(planId);
    }
    return {};
  }, [planId, useActivePlan, generateShoppingList, generateActiveShoppingList, selectedMeals]);

  // Get plan info
  const planInfo = useMemo(() => {
    if (selectedMeals && selectedMeals.length > 0) {
      const mealCount = selectedMeals.length;
      const dateRange = selectedMeals.length > 0 ?
        `${selectedMeals.length} bữa ăn đã chọn` :
        'Không có bữa ăn nào';
      return {
        name: `Danh sách từ ${dateRange}`,
        id: 'selected-meals',
        isFromSelection: true
      };
    } else if (useActivePlan && activePlan) {
      return { name: activePlan.name, id: activePlan.id };
    } else if (planId) {
      const plan = userMealPlans.find(p => p.id === planId);
      return plan ? { name: plan.name, id: plan.id } : null;
    }
    return planName ? { name: planName, id: planId } : null;
  }, [useActivePlan, activePlan, planId, planName, userMealPlans, selectedMeals]);

  // Convert shopping data to items with better categorization
  const shoppingItems = useMemo(() => {
    const items: ShoppingItem[] = [];

    Object.entries(shoppingData).forEach(([category, ingredients]) => {
      if (Array.isArray(ingredients)) {
        ingredients.forEach((ingredient, index) => {
          // Track which recipes use this ingredient when using selected meals
          const recipeNames: string[] = [];
          if (selectedMeals) {
            selectedMeals.forEach(meal => {
              if (meal.recipe && meal.recipe.ingredients.includes(ingredient)) {
                recipeNames.push(meal.recipe.title);
              }
            });
          }

          items.push({
            id: `${category}-${index}`,
            name: ingredient,
            category: category, // Use category directly since we're already categorizing properly
            recipeNames: recipeNames,
            checked: checkedItems.has(`${category}-${index}`)
          });
        });
      }
    });

    return items;
  }, [shoppingData, checkedItems, selectedMeals]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: { [category: string]: ShoppingItem[] } = {};
    
    shoppingItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [shoppingItems]);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Món chính': 'Thịt & Hải sản',
      'Ăn sáng': 'Thực phẩm sáng',
      'Món tráng miệng': 'Tráng miệng',
      'Đồ uống': 'Đồ uống',
      'default': 'Nguyên liệu khác'
    };
    return categoryMap[category] || categoryMap.default;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Thịt & Hải sản': return <Beef className="h-4 w-4" />;
      case 'Rau củ': return <Carrot className="h-4 w-4" />;
      case 'Sữa & Trứng': return <Milk className="h-4 w-4" />;
      case 'Ngũ cốc': return <Wheat className="h-4 w-4" />;
      case 'Hải sản': return <Fish className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const handleToggleItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const handleClearChecked = () => {
    setCheckedItems(new Set());
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log('Export shopping list');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implementation for share functionality
    console.log('Share shopping list');
  };

  const totalItems = shoppingItems.length;
  const checkedCount = checkedItems.size;
  const completionPercentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  if (!planInfo) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy kế hoạch
          </h3>
          <p className="text-gray-600">
            Vui lòng chọn một kế hoạch để tạo danh sách đi chợ
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-green-600" />
            Danh Sách Mua Sắm cho: {planInfo.name}
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {totalItems} mục • {checkedCount} đã mua • {completionPercentage}% hoàn thành
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Chia sẻ
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                In
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Xuất
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      {totalItems > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ mua sắm</span>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shopping List */}
      {Object.keys(groupedItems).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category}</span>
                  <Badge variant="secondary" className="ml-2">
                    {items.length} mục
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        item.checked ? 'bg-green-50 text-green-800' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <span className={`flex-1 ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                      {item.checked && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleClearChecked}
                  disabled={checkedCount === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa các mục đã chọn
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Danh sách trống
            </h3>
            <p className="text-gray-600">
              Kế hoạch này chưa có món ăn nào hoặc chưa có nguyên liệu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingListGenerator;
