// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  ListChecks,
  X
} from 'lucide-react';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { toast } from 'sonner';
import ShoppingListModal from './ShoppingListModal';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    clearCart, 
    updateServings, 
    getConsolidatedIngredients,
    getTotalItems 
  } = useShoppingCart();
  
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  const handleServingsChange = (itemId: string, newServings: number) => {
    if (newServings > 0) {
      updateServings(itemId, newServings);
    }
  };

  const handleGenerateShoppingList = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm món ăn trước khi tạo danh sách mua sắm.');
      return;
    }
    setIsShoppingListOpen(true);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Đã xóa tất cả món ăn khỏi giỏ hàng');
  };

  const totalIngredients = React.useMemo(() => {
    const consolidated = getConsolidatedIngredients();
    return Object.values(consolidated).reduce((total, ingredients) => total + ingredients.length, 0);
  }, [getConsolidatedIngredients]);

  // Convert cart items to meal slots for the shopping list modal
  const mealSlots = React.useMemo(() => {
    return cartItems.map((item, index) => ({
      id: item.id,
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch' as const,
      recipe: {
        id: item.id,
        title: item.name,
        ingredients: item.ingredients
      }
    }));
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Giỏ hàng ({getTotalItems()} món)
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {totalIngredients > 0 && (
              <p className="text-sm text-muted-foreground">
                Tổng cộng {totalIngredients} nguyên liệu
              </p>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Giỏ hàng trống
                  </h3>
                  <p className="text-gray-600">
                    Thêm món ăn, thực đơn hoặc bữa ăn để tạo danh sách mua sắm
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'recipe' ? 'Món ăn' : 
                               item.type === 'menu' ? 'Thực đơn' : 'Bữa ăn'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.ingredients.length} nguyên liệu
                            </span>
                          </div>
                          
                          {item.metadata && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.metadata.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.metadata.category}
                                </Badge>
                              )}
                              {item.metadata.prepTime && (
                                <span className="text-xs text-muted-foreground">
                                  Chuẩn bị: {item.metadata.prepTime}
                                </span>
                              )}
                              {item.metadata.cookTime && (
                                <span className="text-xs text-muted-foreground">
                                  Nấu: {item.metadata.cookTime}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {/* Servings Control */}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleServingsChange(item.id, (item.servings || 1) - 1)}
                              disabled={(item.servings || 1) <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.servings || 1}
                              onChange={(e) => handleServingsChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center text-sm"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleServingsChange(item.id, (item.servings || 1) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success(`Đã xóa ${item.name} khỏi giỏ hàng`);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {index < cartItems.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          {cartItems.length > 0 && (
            <div className="border-t p-6">
              <div className="flex space-x-3">
                <Button
                  onClick={handleGenerateShoppingList}
                  className="flex-1"
                  size="lg"
                >
                  <ListChecks className="h-4 w-4 mr-2" />
                  Tạo danh sách mua sắm
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        mealSlots={mealSlots}
        title="Danh sách mua sắm từ giỏ hàng"
      />
    </>
  );
};

export default ShoppingCart;