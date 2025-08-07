import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ShoppingCart, Download, Printer, Check,
  Package, Utensils, Leaf, Fish, Wheat, Milk
} from 'lucide-react';
import { mealPlanningService } from '@/services/meal-planning.service';
import { ShoppingList, ShoppingListItem } from '@/types/meal-planning';

interface ShoppingListViewProps {
  weekPlanId: string;
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ weekPlanId }) => {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadShoppingList();
  }, [weekPlanId]);

  const loadShoppingList = async () => {
    try {
      setLoading(true);
      const list = await mealPlanningService.generateShoppingList(weekPlanId);
      setShoppingList(list);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const exportShoppingList = () => {
    if (!shoppingList) return;

    const content = shoppingList.items.map(item =>
      `${checkedItems.has(item.id) ? '✓' : '☐'} ${item.name} (${item.quantity} ${item.unit})`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mua-sam-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'rau củ quả':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'thịt cá':
        return <Fish className="h-4 w-4 text-red-600" />;
      case 'gạo & ngũ cốc':
        return <Wheat className="h-4 w-4 text-yellow-600" />;
      case 'sữa & trứng':
        return <Milk className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tạo danh sách mua sắm...</p>
      </div>
    );
  }

  if (!shoppingList || shoppingList.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có danh sách mua sắm</h3>
        <p className="text-gray-600">Thêm món ăn vào kế hoạch để tạo danh sách mua sắm</p>
      </div>
    );
  }

  const checkedCount = checkedItems.size;
  const totalCount = shoppingList.items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  // Group items by category
  const itemsByCategory = shoppingList.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Danh sách mua sắm</h3>
          <p className="text-sm text-gray-600 mt-1">
            {checkedCount}/{totalCount} mục đã mua • Tổng chi phí: {shoppingList.totalCost.toLocaleString('vi-VN')} ₫
          </p>
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

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ mua sắm</span>
            <span className="text-sm text-gray-600">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Shopping Items by Category */}
      <ScrollArea className="h-[60vh]">
        <div className="space-y-4">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                  <Badge variant="secondary" className="ml-auto">
                    {items.length} mục
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        checkedItems.has(item.id)
                          ? 'bg-green-50 border-green-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Checkbox
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => handleItemToggle(item.id)}
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          checkedItems.has(item.id) ? 'line-through text-gray-500' : ''
                        }`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} {item.unit} • {item.estimatedCost.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                      {checkedItems.has(item.id) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShoppingListView;
