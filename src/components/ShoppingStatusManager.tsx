import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  ChefHat,
  AlertCircle,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useKitchen } from '@/contexts/KitchenContext';
import { kitchenService, TodayMenuStatus, DailyMenuShoppingStatus } from '@/services/kitchenService';
import { formatVNDPrice } from '@/utils/vndPriceUtils';
import { toast } from 'sonner';

interface ShoppingStatusManagerProps {
  className?: string;
  onGoShopping?: () => void;
  onStartCooking?: () => void;
}

const ShoppingStatusManager: React.FC<ShoppingStatusManagerProps> = ({
  className = '',
  onGoShopping,
  onStartCooking
}) => {
  const { user } = useAuth();
  const { todayMenuStatus, dailyShoppingStatus, createTodayShoppingList, refreshTodayMenuStatus } = useKitchen();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Use menu status from context
  const menuStatus = todayMenuStatus;

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user && !isUpdating) {
        try {
          await refreshTodayMenuStatus();
          setLastRefresh(new Date());
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, isUpdating, refreshTodayMenuStatus]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (!user || isUpdating) return;

    try {
      setIsUpdating(true);
      await refreshTodayMenuStatus();
      setLastRefresh(new Date());
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      console.error('Manual refresh failed:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateShoppingList = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      const result = await createTodayShoppingList();

      toast.success(`Đã tạo danh sách mua sắm với ${result.itemCount} món`);

      // Call onGoShopping callback if provided
      if (onGoShopping) {
        onGoShopping();
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast.error('Không thể tạo danh sách mua sắm');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartCooking = () => {
    if (onStartCooking) {
      onStartCooking();
    } else {
      // Default action - navigate to cooking mode
      toast.info('Chuyển sang chế độ nấu ăn');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'purchased':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partially_purchased':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_purchased':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'purchased':
        return 'Đã mua sắm';
      case 'partially_purchased':
        return 'Mua sắm một phần';
      case 'not_purchased':
        return 'Chưa mua sắm';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'purchased':
        return <CheckCircle className="h-4 w-4" />;
      case 'partially_purchased':
        return <Clock className="h-4 w-4" />;
      case 'not_purchased':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (shoppingStatus?: DailyMenuShoppingStatus) => {
    if (!shoppingStatus) return 0;

    switch (shoppingStatus.status) {
      case 'purchased':
        return 100;
      case 'partially_purchased':
        return 50; // This could be calculated more precisely
      case 'not_purchased':
        return 0;
      default:
        return 0;
    }
  };

  if (!menuStatus) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Chưa có thực đơn hôm nay</p>
          <p className="text-sm text-gray-500">Vui lòng tạo thực đơn để bắt đầu quản lý mua sắm</p>
        </CardContent>
      </Card>
    );
  }

  if (!menuStatus.hasMenu) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Trạng thái mua sắm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Chưa có thực đơn để tạo danh sách mua sắm
            </p>
            <Button variant="outline" disabled>
              Tạo thực đơn trước
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { shoppingStatus, nextAction } = menuStatus;
  const progressPercentage = getProgressPercentage(shoppingStatus);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Trạng thái mua sắm
          </div>
          {shoppingStatus && (
            <Badge className={getStatusColor(shoppingStatus.status)}>
              {getStatusIcon(shoppingStatus.status)}
              <span className="ml-1">{getStatusText(shoppingStatus.status)}</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ mua sắm</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Cost Information */}
        {shoppingStatus && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Ước tính</div>
              <div className="font-semibold text-gray-900">
                {formatVNDPrice(shoppingStatus.totalEstimatedCost)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Thực tế</div>
              <div className="font-semibold text-gray-900">
                {formatVNDPrice(shoppingStatus.totalActualCost)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {nextAction === 'go_shopping' && (
            <Button 
              onClick={handleCreateShoppingList}
              disabled={isUpdating}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {shoppingStatus ? 'Tiếp tục mua sắm' : 'Đi chợ mua nguyên liệu'}
            </Button>
          )}

          {nextAction === 'start_cooking' && (
            <Button 
              onClick={handleStartCooking}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <ChefHat className="h-4 w-4 mr-2" />
              Bắt đầu nấu ăn
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="flex space-x-2">
            {shoppingStatus && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Xem chi tiết mua sắm')}
                className="flex-1"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Chi tiết
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.info('Xem thống kê')}
              className="flex-1"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Thống kê
            </Button>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-sm text-gray-600 text-center">
          {nextAction === 'go_shopping' && 'Chuẩn bị nguyên liệu để bắt đầu nấu ăn'}
          {nextAction === 'start_cooking' && 'Nguyên liệu đã sẵn sàng, có thể bắt đầu nấu ăn'}
          {nextAction === 'create_menu' && 'Tạo thực đơn để bắt đầu'}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingStatusManager;
