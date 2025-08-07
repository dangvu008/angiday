import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  ChefHat,
  Clock,
  DollarSign,
  Package
} from 'lucide-react';
import { 
  AnyPlan, 
  PlanShoppingStatus, 
  EnhancedPlanStatus 
} from '@/types/meal-planning';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { toast } from 'sonner';

interface PlanShoppingStatusProps {
  plan: AnyPlan;
  userId: string;
  onStartShopping?: (shoppingListId: string) => void;
  onStartCooking?: (planId: string) => void;
  className?: string;
}

const PlanShoppingStatus: React.FC<PlanShoppingStatusProps> = ({
  plan,
  userId,
  onStartShopping,
  onStartCooking,
  className = ''
}) => {
  const [shoppingStatus, setShoppingStatus] = useState<PlanShoppingStatus | null>(null);
  const [enhancedStatus, setEnhancedStatus] = useState<EnhancedPlanStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkShoppingStatus();
  }, [plan.id, userId]);

  const checkShoppingStatus = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra trạng thái shopping
      const status = await inventoryManagementService.checkPlanShoppingStatus(plan, userId);
      setShoppingStatus(status);

      // Lấy enhanced status
      const enhanced = await inventoryManagementService.getEnhancedPlanStatus(plan.id);
      if (enhanced) {
        setEnhancedStatus(enhanced);
      } else {
        // Tạo enhanced status mới
        const newEnhanced: EnhancedPlanStatus = {
          planId: plan.id,
          planType: plan.type,
          shoppingStatus: status,
          phase: status.hasAllIngredients ? 'ready_to_cook' : 'shopping',
          progress: {
            planning: true,
            shopping: status.hasAllIngredients,
            cooking: false,
            completed: false
          },
          lastUpdated: new Date().toISOString()
        };
        await inventoryManagementService.updateEnhancedPlanStatus(newEnhanced);
        setEnhancedStatus(newEnhanced);
      }
    } catch (error) {
      console.error('Error checking shopping status:', error);
      toast.error('Không thể kiểm tra trạng thái nguyên liệu');
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

      // Cập nhật shopping status
      const updatedStatus = { ...shoppingStatus, shoppingListId: shoppingList.id };
      setShoppingStatus(updatedStatus);

      // Cập nhật enhanced status
      if (enhancedStatus) {
        const updatedEnhanced = {
          ...enhancedStatus,
          shoppingStatus: updatedStatus,
          phase: 'shopping' as const
        };
        await inventoryManagementService.updateEnhancedPlanStatus(updatedEnhanced);
        setEnhancedStatus(updatedEnhanced);
      }

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
      
      // Cập nhật enhanced status
      if (enhancedStatus) {
        const updatedEnhanced = {
          ...enhancedStatus,
          cookingStatus: cookingSession,
          phase: 'cooking' as const,
          progress: {
            ...enhancedStatus.progress,
            cooking: true
          }
        };
        await inventoryManagementService.updateEnhancedPlanStatus(updatedEnhanced);
        setEnhancedStatus(updatedEnhanced);
      }

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
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shoppingStatus) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Không thể kiểm tra trạng thái nguyên liệu</p>
        </CardContent>
      </Card>
    );
  }

  const getPhaseProgress = () => {
    if (!enhancedStatus) return 0;
    const { progress } = enhancedStatus;
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / 4) * 100;
  };

  const getStatusColor = () => {
    if (shoppingStatus.hasAllIngredients) return 'text-green-600';
    return 'text-orange-600';
  };

  const getStatusIcon = () => {
    if (shoppingStatus.hasAllIngredients) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-orange-600" />;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Trạng thái chuẩn bị
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ chuẩn bị</span>
            <span>{Math.round(getPhaseProgress())}%</span>
          </div>
          <Progress value={getPhaseProgress()} className="h-2" />
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Trạng thái nguyên liệu</p>
            <Badge variant={shoppingStatus.hasAllIngredients ? "default" : "secondary"}>
              {shoppingStatus.hasAllIngredients ? 'Đã đủ' : 'Thiếu nguyên liệu'}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Giai đoạn</p>
            <Badge variant="outline">
              {enhancedStatus?.phase === 'ready_to_cook' ? 'Sẵn sàng nấu' : 
               enhancedStatus?.phase === 'shopping' ? 'Cần đi chợ' : 
               enhancedStatus?.phase === 'cooking' ? 'Đang nấu' : 'Lên kế hoạch'}
            </Badge>
          </div>
        </div>

        {/* Missing Ingredients */}
        {!shoppingStatus.hasAllIngredients && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Thiếu {shoppingStatus.missingIngredients.length} nguyên liệu:
            </p>
            <div className="flex flex-wrap gap-1">
              {shoppingStatus.missingIngredients.slice(0, 5).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
              {shoppingStatus.missingIngredients.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{shoppingStatus.missingIngredients.length - 5} khác
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Chi phí ước tính: {shoppingStatus.estimatedShoppingCost.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {!shoppingStatus.hasAllIngredients ? (
            <Button 
              onClick={handleCreateShoppingList}
              disabled={creating}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {creating ? 'Đang tạo...' : 'Đi chợ'}
            </Button>
          ) : (
            <Button 
              onClick={handleStartCooking}
              className="flex-1"
            >
              <ChefHat className="h-4 w-4 mr-2" />
              Bắt đầu nấu
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={checkShoppingStatus}
            size="sm"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>

        {/* Last Checked */}
        <p className="text-xs text-gray-500 text-center">
          Kiểm tra lần cuối: {new Date(shoppingStatus.lastChecked).toLocaleString('vi-VN')}
        </p>
      </CardContent>
    </Card>
  );
};

export default PlanShoppingStatus;
