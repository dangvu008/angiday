import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Download, Printer } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  recipeNames: string[];
  checked: boolean;
}

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (itemId: string) => void;
  onExportList: () => void;
  className?: string;
}

export const ShoppingList = ({ 
  items, 
  onToggleItem, 
  onExportList,
  className 
}: ShoppingListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Tất cả', count: items.length },
    { key: 'vegetables', label: 'Rau củ quả', count: items.filter(item => item.category === 'vegetables').length },
    { key: 'meat', label: 'Thịt cá', count: items.filter(item => item.category === 'meat').length },
    { key: 'dairy', label: 'Sữa & trứng', count: items.filter(item => item.category === 'dairy').length },
    { key: 'grains', label: 'Gạo & ngũ cốc', count: items.filter(item => item.category === 'grains').length },
    { key: 'spices', label: 'Gia vị', count: items.filter(item => item.category === 'spices').length },
    { key: 'others', label: 'Khác', count: items.filter(item => item.category === 'others').length }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const checkedCount = filteredItems.filter(item => item.checked).length;
  const totalCount = filteredItems.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      vegetables: 'Rau củ quả',
      meat: 'Thịt cá',
      dairy: 'Sữa & trứng',
      grains: 'Gạo & ngũ cốc',
      spices: 'Gia vị',
      others: 'Khác'
    };
    return categoryMap[category] || 'Khác';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Danh sách mua hàng
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onExportList}>
              <Download className="h-4 w-4 mr-2" />
              Xuất file
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              In
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ mua hàng</span>
            <span>{checkedCount}/{totalCount} mục</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Shopping Items */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                item.checked ? 'bg-muted/50 opacity-60' : 'hover:bg-muted/20'
              }`}
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => onToggleItem(item.id)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-1">
                <div className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                  {item.name}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.amount}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
                
                {item.recipeNames.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Cho: {item.recipeNames.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Không có mục nào trong danh mục này
          </div>
        )}

        {/* Summary */}
        {totalCount > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground text-center">
              {checkedCount > 0 && (
                <span className="text-green-600 font-medium">
                  Đã mua {checkedCount} mục
                </span>
              )}
              {checkedCount < totalCount && (
                <span className={checkedCount > 0 ? 'ml-2' : ''}>
                  Còn lại {totalCount - checkedCount} mục cần mua
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};