import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  ChefHat,
  Package,
  Clock
} from 'lucide-react';
import { 
  AnyPlan, 
  PlanShoppingStatus 
} from '@/types/meal-planning';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { toast } from 'sonner';

interface CompactShoppingStatusProps {
  plan: AnyPlan;
  userId: string;
  onStartShopping?: (shoppingListId: string) => void;
  onStartCooking?: (planId: string) => void;
  className?: string;
}

const CompactShoppingStatus: React.FC<CompactShoppingStatusProps> = ({
  plan,
  userId,
  onStartShopping,
  onStartCooking,
  className = ''
}) => {
  const [shoppingStatus, setShoppingStatus] = useState<PlanShoppingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkShoppingStatus();
  }, [plan.id, userId]);

  const checkShoppingStatus = async () => {
    try {
      setLoading(true);
      const status = await inventoryManagementService.checkPlanShoppingStatus(plan, userId);
      setShoppingStatus(status);
    } catch (error) {
      console.error('Error checking shopping status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShoppingList = async () => {
    if (!shoppingStatus || shoppingStatus.hasAllIngredients) return;

    try {
      setCreating(true);
      const shoppingList = await inventoryManagementService.createShoppingListFromMissingIngredients(
        plan.id,
        shoppingStatus.missingIngredients
      );

      toast.success('Đã tạo danh sách mua sắm!');
      
      if (onStartShopping) {
        onStartShopping(shoppingList.id);
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast.error('Không thể tạo danh sách mua sắm');
    } finally {
      setCreating(false);
    }
  };

  const handleStartCooking = async () => {
    if (!shoppingStatus?.hasAllIngredients) return;

    try {
      const cookingSession = await inventoryManagementService.startCookingSession(plan);
      toast.success('Bắt đầu chế độ nấu ăn!');
      
      if (onStartCooking) {
        onStartCooking(plan.id);
      }
    } catch (error) {
      console.error('Error starting cooking session:', error);
      toast.error('Không thể bắt đầu chế độ nấu ăn');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
        <span className="text-sm text-gray-500">Đang kiểm tra...</span>
      </div>
    );
  }

  if (!shoppingStatus) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Không thể kiểm tra</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {shoppingStatus.hasAllIngredients ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <Badge variant="default" className="bg-green-600 text-white text-xs">
              Sẵn sàng nấu
            </Badge>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <Badge variant="secondary" className="text-xs">
              Thiếu {shoppingStatus.missingIngredients.length} nguyên liệu
            </Badge>
          </>
        )}
      </div>

      {/* Missing Ingredients (if any) */}
      {!shoppingStatus.hasAllIngredients && shoppingStatus.missingIngredients.length > 0 && (
        <div className="text-xs text-gray-600">
          <span className="font-medium">Cần mua: </span>
          {shoppingStatus.missingIngredients.slice(0, 3).join(', ')}
          {shoppingStatus.missingIngredients.length > 3 && (
            <span> và {shoppingStatus.missingIngredients.length - 3} món khác</span>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex gap-2">
        {!shoppingStatus.hasAllIngredients ? (
          <Button 
            size="sm"
            onClick={handleCreateShoppingList}
            disabled={creating}
            className="h-7 px-3 text-xs"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {creating ? 'Đang tạo...' : 'Đi chợ'}
          </Button>
        ) : (
          <Button 
            size="sm"
            onClick={handleStartCooking}
            className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
          >
            <ChefHat className="h-3 w-3 mr-1" />
            Bắt đầu nấu
          </Button>
        )}
        
        <Button 
          size="sm"
          variant="outline" 
          onClick={checkShoppingStatus}
          className="h-7 px-2 text-xs"
        >
          <Clock className="h-3 w-3" />
        </Button>
      </div>

      {/* Cost Estimate (if missing ingredients) */}
      {!shoppingStatus.hasAllIngredients && shoppingStatus.estimatedShoppingCost > 0 && (
        <div className="text-xs text-gray-500">
          Chi phí ước tính: {shoppingStatus.estimatedShoppingCost.toLocaleString('vi-VN')}₫
        </div>
      )}
    </div>
  );
};

export default CompactShoppingStatus;
