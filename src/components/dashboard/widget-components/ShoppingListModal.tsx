import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Check,
  X,
  Plus,
  Trash2,
  Download,
  Share
} from 'lucide-react';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: { [category: string]: string[] };
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  isChecked: boolean;
  isCustom?: boolean;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  shoppingList
}) => {
  // Convert shopping list to items with state
  const initialItems = useMemo(() => {
    const items: ShoppingItem[] = [];
    Object.entries(shoppingList).forEach(([category, ingredients]) => {
      ingredients.forEach((ingredient, index) => {
        items.push({
          id: `${category}-${index}`,
          name: ingredient,
          category,
          isChecked: false,
          isCustom: false
        });
      });
    });
    return items;
  }, [shoppingList]);

  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Khác');

  // Get categories
  const categories = useMemo(() => {
    const cats = [...new Set(items.map(item => item.category))];
    return cats.length > 0 ? cats : ['Khác'];
  }, [items]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: { [category: string]: ShoppingItem[] } = {};
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [items]);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const checked = items.filter(item => item.isChecked).length;
    const remaining = total - checked;
    const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    return { total, checked, remaining, progress };
  }, [items]);

  const handleToggleItem = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isChecked: !item.isChecked }
        : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      isChecked: false,
      isCustom: true
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const handleExport = () => {
    const text = Object.entries(itemsByCategory)
      .map(([category, categoryItems]) => {
        const itemList = categoryItems
          .map(item => `${item.isChecked ? '✓' : '○'} ${item.name}`)
          .join('\n');
        return `${category.toUpperCase()}\n${itemList}`;
      })
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mua-sam-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Danh sách mua sắm (${stats.checked}/${stats.total} hoàn thành)\n\n` +
      Object.entries(itemsByCategory)
        .map(([category, categoryItems]) => {
          const itemList = categoryItems
            .map(item => `${item.isChecked ? '✓' : '○'} ${item.name}`)
            .join('\n');
          return `${category.toUpperCase()}\n${itemList}`;
        })
        .join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Danh sách mua sắm',
          text: text
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      // TODO: Show toast notification
      console.log('Copied to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Danh sách mua sắm
          </DialogTitle>
          <DialogDescription>
            Quản lý và theo dõi danh sách mua sắm cho thực đơn hôm nay
          </DialogDescription>
        </DialogHeader>

        {/* Progress Stats */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ mua sắm</span>
              <span className="text-sm text-neutral-600">
                {stats.checked}/{stats.total} món
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Hoàn thành: {stats.checked}</span>
              <span>Còn lại: {stats.remaining}</span>
            </div>
          </CardContent>
        </Card>

        {/* Add New Item */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Thêm món cần mua..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                className="flex-1"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="Khác">Khác</option>
              </select>
              <Button onClick={handleAddItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <Card key={category} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{category}</span>
                  <Badge variant="secondary">
                    {categoryItems.filter(item => item.isChecked).length}/{categoryItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        item.isChecked 
                          ? 'bg-green-50 text-green-800' 
                          : 'bg-neutral-50 hover:bg-neutral-100'
                      }`}
                    >
                      <Checkbox
                        checked={item.isChecked}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <span className={`flex-1 ${item.isChecked ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                      {item.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Xuất file
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
            <Button variant="outline" onClick={onClose} className="ml-auto">
              <X className="h-4 w-4 mr-2" />
              Đóng
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListModal;
