import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Download, 
  Printer, 
  Share2,
  Check, 
  X,
  Search,
  Package,
  Apple,
  Beef,
  Wheat,
  Fish,
  Carrot,
  Milk,
  Coffee,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MealSlot } from '@/contexts/MealPlanningContext';
import { toast } from 'sonner';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealSlots?: MealSlot[];
  title?: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  recipes: string[];
  checked: boolean;
  quantity?: number;
  unit?: string;
  estimatedPrice?: number;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  mealSlots = [],
  title = 'Danh sách mua sắm'
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemInput, setNewItemInput] = useState('');

  // Categorize ingredients
  const categorizeIngredient = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase();
    
    if (lowerIngredient.includes('thịt') || lowerIngredient.includes('bò') || 
        lowerIngredient.includes('heo') || lowerIngredient.includes('gà') ||
        lowerIngredient.includes('vịt')) {
      return 'Thịt';
    }
    
    if (lowerIngredient.includes('cá') || lowerIngredient.includes('tôm') ||
        lowerIngredient.includes('cua') || lowerIngredient.includes('mực')) {
      return 'Hải sản';
    }
    
    if (lowerIngredient.includes('rau') || lowerIngredient.includes('cải') ||
        lowerIngredient.includes('cà') || lowerIngredient.includes('hành') ||
        lowerIngredient.includes('tỏi') || lowerIngredient.includes('ớt')) {
      return 'Rau củ';
    }
    
    if (lowerIngredient.includes('trái') || lowerIngredient.includes('quả') ||
        lowerIngredient.includes('táo') || lowerIngredient.includes('cam')) {
      return 'Trái cây';
    }
    
    if (lowerIngredient.includes('sữa') || lowerIngredient.includes('phô mai') ||
        lowerIngredient.includes('bơ') || lowerIngredient.includes('kem')) {
      return 'Sữa & Chế phẩm';
    }
    
    if (lowerIngredient.includes('gạo') || lowerIngredient.includes('bún') ||
        lowerIngredient.includes('bánh') || lowerIngredient.includes('mì')) {
      return 'Ngũ cốc';
    }
    
    if (lowerIngredient.includes('nước mắm') || lowerIngredient.includes('tương') ||
        lowerIngredient.includes('dầu') || lowerIngredient.includes('muối')) {
      return 'Gia vị';
    }
    
    return 'Khác';
  };

  // Generate shopping list from meal slots
  const shoppingList = useMemo(() => {
    const ingredientMap = new Map<string, ShoppingItem>();
    
    // Process meal slots
    mealSlots.forEach(slot => {
      if (slot.recipe?.ingredients) {
        slot.recipe.ingredients.forEach(ingredient => {
          const key = ingredient.toLowerCase().trim();
          const category = categorizeIngredient(ingredient);
          
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            if (!existing.recipes.includes(slot.recipe!.title)) {
              existing.recipes.push(slot.recipe!.title);
            }
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            ingredientMap.set(key, {
              id: key,
              name: ingredient,
              category,
              recipes: [slot.recipe!.title],
              checked: checkedItems[key] || false,
              quantity: 1,
              unit: 'phần'
            });
          }
        });
      }
    });

    // Add custom items
    customItems.forEach(item => {
      const key = item.toLowerCase().trim();
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          id: key,
          name: item,
          category: 'Tự thêm',
          recipes: [],
          checked: checkedItems[key] || false,
          quantity: 1,
          unit: 'cái'
        });
      }
    });

    return Array.from(ingredientMap.values());
  }, [mealSlots, customItems, checkedItems]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const filtered = shoppingList.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const groups: { [category: string]: ShoppingItem[] } = {};
    filtered.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    
    return groups;
  }, [shoppingList, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Thịt': return <Beef className="h-4 w-4 text-red-600" />;
      case 'Hải sản': return <Fish className="h-4 w-4 text-blue-600" />;
      case 'Rau củ': return <Carrot className="h-4 w-4 text-green-600" />;
      case 'Trái cây': return <Apple className="h-4 w-4 text-yellow-600" />;
      case 'Sữa & Chế phẩm': return <Milk className="h-4 w-4 text-blue-400" />;
      case 'Ngũ cốc': return <Wheat className="h-4 w-4 text-amber-600" />;
      case 'Gia vị': return <Coffee className="h-4 w-4 text-brown-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAddCustomItem = () => {
    if (newItemInput.trim()) {
      setCustomItems(prev => [...prev, newItemInput.trim()]);
      setNewItemInput('');
      toast.success('Đã thêm mục mới');
    }
  };

  const handleShare = async () => {
    try {
      const shoppingText = `🛒 ${title}\n\n` +
        Object.entries(groupedItems).map(([category, items]) =>
          `📦 ${category}:\n` +
          items.map(item => 
            `${checkedItems[item.id] ? '✅' : '☐'} ${item.name}${item.quantity && item.quantity > 1 ? ` (${item.quantity} ${item.unit})` : ''}`
          ).join('\n')
        ).join('\n\n') +
        `\n\n📱 Tạo từ ứng dụng AngiDay`;

      if (navigator.share) {
        await navigator.share({
          title: title,
          text: shoppingText
        });
      } else {
        await navigator.clipboard.writeText(shoppingText);
        toast.success('Đã sao chép vào clipboard');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chia sẻ');
    }
  };

  const handleDownload = () => {
    const shoppingText = `${title}\nTạo ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n` +
      Object.entries(groupedItems).map(([category, items]) =>
        `${category}:\n` +
        items.map(item => 
          `☐ ${item.name}${item.quantity && item.quantity > 1 ? ` (${item.quantity} ${item.unit})` : ''}`
        ).join('\n')
      ).join('\n\n');

    const blob = new Blob([shoppingText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-mua-sam-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Đã tải xuống danh sách');
  };

  const totalItems = shoppingList.length;
  const checkedCount = shoppingList.filter(item => checkedItems[item.id]).length;
  const completionPercentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {totalItems} mục • {checkedCount} đã mua • {completionPercentage}% hoàn thành
          </DialogDescription>
        </DialogHeader>

        {/* Search and Add Custom Item */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Thêm mục mới..."
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomItem()}
              className="flex-1"
            />
            <Button onClick={handleAddCustomItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shopping List */}
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
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
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          checkedItems[item.id]
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          checked={checkedItems[item.id] || false}
                          onCheckedChange={() => handleItemCheck(item.id)}
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${checkedItems[item.id] ? 'line-through' : ''}`}>
                            {item.name}
                            {item.quantity && item.quantity > 1 && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({item.quantity} {item.unit})
                              </span>
                            )}
                          </div>
                          {item.recipes.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Dùng cho: {item.recipes.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
          </div>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListModal;
