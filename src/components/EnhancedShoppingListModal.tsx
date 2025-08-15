import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Wheat,
  DollarSign,
  Eye,
  EyeOff,
  Calculator,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { kitchenService, MealShoppingItem } from '@/services/kitchenService';
import { 
  validateVNDPrice, 
  formatVNDPrice, 
  generatePriceSuggestions,
  calculateTotalCost,
  calculateCategoryBreakdown
} from '@/utils/vndPriceUtils';

interface EnhancedShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyShoppingStatusId?: string;
}

interface ShoppingItemWithPrice extends MealShoppingItem {
  tempPrice?: string; // Temporary price input
  showPriceInput?: boolean;
}

const EnhancedShoppingListModal: React.FC<EnhancedShoppingListModalProps> = ({
  isOpen,
  onClose,
  dailyShoppingStatusId
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItemWithPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(true);
  const [totalBudget, setTotalBudget] = useState<string>('');
  const [useTotalBudget, setUseTotalBudget] = useState(false);

  // Load shopping items
  useEffect(() => {
    if (isOpen && dailyShoppingStatusId) {
      const loadItems = async () => {
        if (!dailyShoppingStatusId) return;
        
        try {
          setIsLoading(true);
          const shoppingItems = await kitchenService.getMealShoppingItems(dailyShoppingStatusId);
          setItems(shoppingItems);
        } catch (error) {
          console.error('Error loading shopping items:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadItems();
    }
  }, [isOpen, dailyShoppingStatusId]);

  const loadShoppingItems = useCallback(async () => {
    if (!dailyShoppingStatusId) return;
    
    try {
      setIsLoading(true);
      const shoppingItems = await kitchenService.getMealShoppingItems(dailyShoppingStatusId);
      setItems(shoppingItems.map(item => ({
        ...item,
        tempPrice: item.actualPrice?.toString() || '',
        showPriceInput: false
      })));
    } catch (error) {
      console.error('Error loading shopping items:', error);
      toast.error('Không thể tải danh sách mua sắm');
    } finally {
      setIsLoading(false);
    }
  }, [dailyShoppingStatusId]);

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

  // Toggle item purchased status
  const toggleItemPurchased = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const updatedItem = await kitchenService.updateMealShoppingItem(itemId, {
        isPurchased: !item.isPurchased,
        purchasedAt: !item.isPurchased ? new Date().toISOString() : undefined
      });

      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, ...updatedItem } : i
      ));

      toast.success(updatedItem.isPurchased ? 'Đã đánh dấu đã mua' : 'Đã bỏ đánh dấu');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Update item price
  const updateItemPrice = async (itemId: string, priceInput: string) => {
    const validation = validateVNDPrice(priceInput);
    
    if (!validation.isValid) {
      toast.error('Giá tiền không hợp lệ');
      return;
    }

    try {
      const updatedItem = await kitchenService.updateShoppingItemPrice(itemId, validation.numericValue);
      
      setItems(prev => prev.map(i => 
        i.id === itemId ? { 
          ...i, 
          ...updatedItem, 
          tempPrice: validation.numericValue.toString(),
          showPriceInput: false 
        } : i
      ));

      toast.success(`Đã cập nhật giá: ${validation.formattedPrice}`);
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Không thể cập nhật giá');
    }
  };

  // Handle price input change
  const handlePriceInputChange = (itemId: string, value: string) => {
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, tempPrice: value } : i
    ));
  };

  // Toggle price input visibility
  const togglePriceInput = (itemId: string) => {
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, showPriceInput: !i.showPriceInput } : i
    ));
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalItems = items.length;
    const purchasedItems = items.filter(item => item.isPurchased).length;
    const totalEstimated = calculateTotalCost(items, false);
    const totalActual = calculateTotalCost(items, true);
    const categoryBreakdown = calculateCategoryBreakdown(items, true);
    
    return {
      totalItems,
      purchasedItems,
      completionPercentage: totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0,
      totalEstimated,
      totalActual,
      categoryBreakdown
    };
  }, [items]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: { [category: string]: ShoppingItemWithPrice[] } = {};
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [items]);

  // Price suggestion component
  const PriceSuggestions: React.FC<{ 
    currentPrice: string; 
    onSelect: (price: string) => void; 
  }> = ({ currentPrice, onSelect }) => {
    const suggestions = generatePriceSuggestions(parseFloat(currentPrice) || 0);
    
    return (
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Gợi ý giá:</Label>
        <div className="flex flex-wrap gap-1">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-6 px-2"
              onClick={() => onSelect(suggestion.replace(/[^\d]/g, ''))}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="animate-pulse p-8">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Danh sách mua sắm
          </DialogTitle>
          <DialogDescription>
            Quản lý nguyên liệu và giá cả cho thực đơn hôm nay
          </DialogDescription>
        </DialogHeader>

        {/* Controls */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-prices"
                checked={showPriceDetails}
                onCheckedChange={setShowPriceDetails}
              />
              <Label htmlFor="show-prices" className="text-sm">
                {showPriceDetails ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Hiện giá chi tiết
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="total-budget"
                checked={useTotalBudget}
                onCheckedChange={setUseTotalBudget}
              />
              <Label htmlFor="total-budget" className="text-sm">
                <Calculator className="h-4 w-4" />
                Chỉ nhập tổng tiền
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {statistics.purchasedItems}/{statistics.totalItems} món
            </Badge>
            <Badge variant="outline">
              {statistics.completionPercentage}% hoàn thành
            </Badge>
          </div>
        </div>

        {/* Total Budget Input */}
        {useTotalBudget && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="total-budget-input" className="text-sm font-medium">
                  Tổng tiền mua sắm:
                </Label>
                <Input
                  id="total-budget-input"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="Nhập tổng số tiền..."
                  className="max-w-xs"
                />
                <Button size="sm" variant="outline">
                  Phân bổ tự động
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {showPriceDetails && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatVNDPrice(statistics.totalEstimated)}
                </div>
                <div className="text-sm text-gray-600">Ước tính</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatVNDPrice(statistics.totalActual)}
                </div>
                <div className="text-sm text-gray-600">Thực tế</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.totalActual > statistics.totalEstimated ? '+' : ''}
                  {formatVNDPrice(statistics.totalActual - statistics.totalEstimated)}
                </div>
                <div className="text-sm text-gray-600">Chênh lệch</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shopping List */}
        <ScrollArea className="flex-1 max-h-96">
          <div className="space-y-4">
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {categoryItems.length} món
                    </Badge>
                    {showPriceDetails && (
                      <Badge variant="outline" className="ml-2">
                        {formatVNDPrice(calculateTotalCost(categoryItems, true))}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          item.isPurchased
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={item.isPurchased}
                            onCheckedChange={() => toggleItemPurchased(item.id)}
                          />
                          <div>
                            <div className={`font-medium ${
                              item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {item.ingredientName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.recipeName} • {item.quantity} {item.unit}
                            </div>
                          </div>
                        </div>

                        {showPriceDetails && (
                          <div className="flex items-center space-x-2">
                            {item.showPriceInput ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <DollarSign className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor={`price-${item.id}`}>Giá tiền (VND)</Label>
                                      <Input
                                        id={`price-${item.id}`}
                                        value={item.tempPrice}
                                        onChange={(e) => handlePriceInputChange(item.id, e.target.value)}
                                        placeholder="Nhập giá..."
                                      />
                                    </div>
                                    
                                    <PriceSuggestions
                                      currentPrice={item.tempPrice || '0'}
                                      onSelect={(price) => handlePriceInputChange(item.id, price)}
                                    />
                                    
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => updateItemPrice(item.id, item.tempPrice || '0')}
                                      >
                                        Lưu
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => togglePriceInput(item.id)}
                                      >
                                        Hủy
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePriceInput(item.id)}
                              >
                                {item.actualPrice ? formatVNDPrice(item.actualPrice) : 'Nhập giá'}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất file
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Thống kê
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button onClick={onClose}>
                <Check className="h-4 w-4 mr-2" />
                Hoàn thành
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedShoppingListModal;
