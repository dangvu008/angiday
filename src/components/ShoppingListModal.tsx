import React, { useState, useMemo } from 'react';
import { MealPlan, useMealPlanning } from '@/contexts/MealPlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, 
  Download, 
  Printer, 
  Check, 
  X,
  Package,
  Apple,
  Beef,
  Wheat
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: MealPlan | null;
}

interface ShoppingItem {
  name: string;
  category: string;
  recipes: string[];
  checked: boolean;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  mealPlan
}) => {
  const { generateShoppingList } = useMealPlanning();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Generate shopping list with categories
  const shoppingList = useMemo(() => {
    if (!mealPlan) return {};
    
    const rawList = generateShoppingList(mealPlan.id);
    const categorizedItems: { [category: string]: ShoppingItem[] } = {};

    // Process raw shopping list into structured format
    Object.entries(rawList).forEach(([category, ingredients]) => {
      categorizedItems[category] = ingredients.map(ingredient => ({
        name: ingredient,
        category,
        recipes: mealPlan.meals
          .filter(meal => meal.recipe?.ingredients.includes(ingredient))
          .map(meal => meal.recipe!.title),
        checked: checkedItems[`${category}-${ingredient}`] || false
      }));
    });

    return categorizedItems;
  }, [mealPlan, generateShoppingList, checkedItems]);

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'rau củ':
      case 'trái cây':
        return <Apple className="h-4 w-4" />;
      case 'thịt':
      case 'hải sản':
        return <Beef className="h-4 w-4" />;
      case 'ngũ cốc':
      case 'bánh mì':
        return <Wheat className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Toggle item checked status
  const toggleItemCheck = (category: string, itemName: string) => {
    const key = `${category}-${itemName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate statistics
  const totalItems = Object.values(shoppingList).reduce((total, items) => total + items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  // Export functions
  const exportToText = () => {
    let text = `DANH SÁCH MUA SẮM - ${mealPlan?.name}\n`;
    text += `Tạo ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    Object.entries(shoppingList).forEach(([category, items]) => {
      text += `${category.toUpperCase()}\n`;
      text += '─'.repeat(category.length + 10) + '\n';
      items.forEach(item => {
        const status = checkedItems[`${category}-${item.name}`] ? '✓' : '☐';
        text += `${status} ${item.name}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mua-sam-${mealPlan?.name || 'meal-plan'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống danh sách mua sắm');
  };

  const printList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <html>
        <head>
          <title>Danh sách mua sắm - ${mealPlan?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; }
            .item { margin: 5px 0; }
            .checked { text-decoration: line-through; color: #9ca3af; }
            .meta { color: #6b7280; font-size: 0.9em; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>DANH SÁCH MUA SẮM</h1>
          <div class="meta">
            <strong>${mealPlan?.name}</strong><br>
            Tạo ngày: ${new Date().toLocaleDateString('vi-VN')}<br>
            Tổng số món: ${totalItems} | Đã mua: ${checkedCount} (${completionPercentage}%)
          </div>
    `;

    Object.entries(shoppingList).forEach(([category, items]) => {
      html += `<h2>${category}</h2>`;
      items.forEach(item => {
        const isChecked = checkedItems[`${category}-${item.name}`];
        html += `<div class="item ${isChecked ? 'checked' : ''}">☐ ${item.name}</div>`;
      });
    });

    html += '</body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  if (!mealPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-2xl">
            <ShoppingCart className="h-6 w-6 mr-3 text-orange-600" />
            Danh sách mua sắm
          </DialogTitle>
          <DialogDescription>
            Cho kế hoạch: <strong>{mealPlan.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Progress Summary */}
        <Card className="flex-shrink-0 bg-gradient-to-r from-orange-50 to-green-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalItems}</div>
                  <div className="text-sm text-gray-600">Tổng món</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{checkedCount}</div>
                  <div className="text-sm text-gray-600">Đã mua</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                  <div className="text-sm text-gray-600">Hoàn thành</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={exportToText}>
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <Button size="sm" variant="outline" onClick={printList}>
                  <Printer className="h-4 w-4 mr-2" />
                  In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-6">
            {Object.entries(shoppingList).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {items.length} món
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map(item => (
                      <div
                        key={item.name}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          checkedItems[`${category}-${item.name}`]
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          checked={checkedItems[`${category}-${item.name}`] || false}
                          onCheckedChange={() => toggleItemCheck(category, item.name)}
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${
                            checkedItems[`${category}-${item.name}`] ? 'line-through' : ''
                          }`}>
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Dùng trong: {item.recipes.slice(0, 2).join(', ')}
                            {item.recipes.length > 2 && ` +${item.recipes.length - 2} món khác`}
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

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
          <Button onClick={() => {
            toast.success('Chúc bạn mua sắm vui vẻ!');
            onClose();
          }}>
            <Check className="h-4 w-4 mr-2" />
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListModal;
