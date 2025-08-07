import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, Calendar, Clock, Users, ChefHat, 
  Plus, Minus, Download, Printer, Check, X 
} from 'lucide-react';
import { Menu, Recipe } from '@/types/meal-planning';

interface MultiMenuShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
  availableMenus: Menu[];
  selectedDate?: string;
  dateRange?: { start: string; end: string };
}

interface SelectedDish {
  id: string;
  recipe: Recipe;
  menuId: string;
  menuName: string;
  servings: number;
  selected: boolean;
}

interface ShoppingItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  recipes: string[];
  checked: boolean;
}

const MultiMenuShoppingList: React.FC<MultiMenuShoppingListProps> = ({
  isOpen,
  onClose,
  availableMenus,
  selectedDate,
  dateRange
}) => {
  const [selectedMenus, setSelectedMenus] = useState<Set<string>>(new Set());
  const [selectedDishes, setSelectedDishes] = useState<Map<string, SelectedDish>>(new Map());
  const [activeTab, setActiveTab] = useState('select');
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  // Get all dishes from selected menus
  const availableDishes = useMemo(() => {
    const dishes: SelectedDish[] = [];
    availableMenus.forEach(menu => {
      if (selectedMenus.has(menu.id)) {
        menu.recipes.forEach(recipe => {
          dishes.push({
            id: `${menu.id}-${recipe.id}`,
            recipe,
            menuId: menu.id,
            menuName: menu.name,
            servings: menu.servings,
            selected: selectedDishes.has(`${menu.id}-${recipe.id}`)
          });
        });
      }
    });
    return dishes;
  }, [availableMenus, selectedMenus, selectedDishes]);

  // Generate shopping list from selected dishes
  const generateShoppingList = () => {
    const ingredientMap = new Map<string, ShoppingItem>();
    
    selectedDishes.forEach(dish => {
      if (dish.selected) {
        dish.recipe.ingredients.forEach(ingredient => {
          const key = ingredient.toLowerCase();
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            existing.quantity += 1;
            existing.recipes.push(dish.recipe.title);
          } else {
            ingredientMap.set(key, {
              name: ingredient,
              category: getCategoryFromIngredient(ingredient),
              quantity: 1,
              unit: 'phần',
              recipes: [dish.recipe.title],
              checked: false
            });
          }
        });
      }
    });

    const items = Array.from(ingredientMap.values());
    setShoppingItems(items);
    setActiveTab('shopping');
  };

  const getCategoryFromIngredient = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase();
    if (lowerIngredient.includes('thịt') || lowerIngredient.includes('cá') || lowerIngredient.includes('tôm')) {
      return 'Thịt cá';
    }
    if (lowerIngredient.includes('rau') || lowerIngredient.includes('củ') || lowerIngredient.includes('quả')) {
      return 'Rau củ quả';
    }
    if (lowerIngredient.includes('gạo') || lowerIngredient.includes('bún') || lowerIngredient.includes('bánh')) {
      return 'Gạo & ngũ cốc';
    }
    if (lowerIngredient.includes('sữa') || lowerIngredient.includes('trứng')) {
      return 'Sữa & trứng';
    }
    if (lowerIngredient.includes('muối') || lowerIngredient.includes('đường') || lowerIngredient.includes('nước mắm')) {
      return 'Gia vị';
    }
    return 'Khác';
  };

  const handleMenuToggle = (menuId: string) => {
    const newSelected = new Set(selectedMenus);
    if (newSelected.has(menuId)) {
      newSelected.delete(menuId);
      // Remove all dishes from this menu
      const newSelectedDishes = new Map(selectedDishes);
      availableMenus.find(m => m.id === menuId)?.recipes.forEach(recipe => {
        newSelectedDishes.delete(`${menuId}-${recipe.id}`);
      });
      setSelectedDishes(newSelectedDishes);
    } else {
      newSelected.add(menuId);
    }
    setSelectedMenus(newSelected);
  };

  const handleDishToggle = (dishId: string) => {
    const newSelectedDishes = new Map(selectedDishes);
    const dish = availableDishes.find(d => d.id === dishId);
    if (dish) {
      if (newSelectedDishes.has(dishId)) {
        newSelectedDishes.delete(dishId);
      } else {
        newSelectedDishes.set(dishId, { ...dish, selected: true });
      }
      setSelectedDishes(newSelectedDishes);
    }
  };

  const handleShoppingItemToggle = (index: number) => {
    const newItems = [...shoppingItems];
    newItems[index].checked = !newItems[index].checked;
    setShoppingItems(newItems);
  };

  const exportShoppingList = () => {
    const content = shoppingItems.map(item => 
      `${item.checked ? '✓' : '☐'} ${item.name} (${item.quantity} ${item.unit}) - ${item.recipes.join(', ')}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mua-sam-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedDishCount = selectedDishes.size;
  const totalIngredients = shoppingItems.length;
  const checkedIngredients = shoppingItems.filter(item => item.checked).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tạo danh sách mua sắm từ thực đơn
            {selectedDate && (
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {selectedDate}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Chọn thực đơn</TabsTrigger>
            <TabsTrigger value="dishes">Chọn món ăn ({selectedDishCount})</TabsTrigger>
            <TabsTrigger value="shopping">Danh sách mua sắm ({totalIngredients})</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMenus.map(menu => (
                  <Card 
                    key={menu.id} 
                    className={`cursor-pointer transition-all ${
                      selectedMenus.has(menu.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleMenuToggle(menu.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedMenus.has(menu.id)}
                            onChange={() => handleMenuToggle(menu.id)}
                          />
                          <div>
                            <CardTitle className="text-lg">{menu.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{menu.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ChefHat className="h-4 w-4" />
                          <span>{menu.recipes.length} món</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{menu.totalCookingTime} phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{menu.servings} người</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Đã chọn {selectedMenus.size} thực đơn
              </div>
              <Button 
                onClick={() => setActiveTab('dishes')}
                disabled={selectedMenus.size === 0}
              >
                Tiếp theo: Chọn món ăn
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dishes" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {availableDishes.map(dish => (
                  <Card 
                    key={dish.id}
                    className={`cursor-pointer transition-all ${
                      selectedDishes.has(dish.id) ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleDishToggle(dish.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedDishes.has(dish.id)}
                          onChange={() => handleDishToggle(dish.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{dish.recipe.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{dish.recipe.description}</p>
                              <Badge variant="outline" className="mt-2">
                                {dish.menuName}
                              </Badge>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div>{dish.recipe.cookingTime}</div>
                              <div>{dish.recipe.nutrition.calories} cal</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Đã chọn {selectedDishCount} món ăn
              </div>
              <Button 
                onClick={generateShoppingList}
                disabled={selectedDishCount === 0}
              >
                Tạo danh sách mua sắm
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {checkedIngredients}/{totalIngredients} mục đã mua
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportShoppingList}>
                  <Download className="h-4 w-4 mr-2" />
                  Xuất file
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  In
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[50vh]">
              <div className="space-y-4">
                {Object.entries(
                  shoppingItems.reduce((acc, item, index) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push({ ...item, index });
                    return acc;
                  }, {} as Record<string, (ShoppingItem & { index: number })[]>)
                ).map(([category, items]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {category}
                        <Badge variant="secondary">{items.length} mục</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div 
                            key={item.index}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              item.checked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                            }`}
                          >
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => handleShoppingItemToggle(item.index)}
                            />
                            <div className="flex-1">
                              <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}>
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.quantity} {item.unit} • Từ: {item.recipes.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MultiMenuShoppingList;
