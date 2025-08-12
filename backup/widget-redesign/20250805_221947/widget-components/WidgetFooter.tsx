import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart,
  CheckCircle,
  Play,
  Sparkles,
  Plus
} from 'lucide-react';
import { WidgetFooterProps } from '@/types/today-meal-widget';

const WidgetFooter: React.FC<WidgetFooterProps> = ({
  state,
  shoppingStatus,
  nextMealType,
  onCreatePlan,
  onCreateShoppingList,
  onStartCooking,
  onPlanTomorrow
}) => {
  // Trạng thái 2: Đã có kế hoạch, cần đi chợ
  if (state === 'need-shopping') {
    return (
      <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Khối trái: Trạng thái */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 text-base sm:text-lg">Cần chuẩn bị đi chợ</h4>
              <p className="text-sm text-neutral-600">
                Cho {shoppingStatus.ingredientCount} nguyên liệu trong thực đơn hôm nay.
              </p>
            </div>
          </div>

          {/* Khối phải: Hành động */}
          <Button
            onClick={onCreateShoppingList}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Tạo Danh Sách Mua Sắm Ngay
          </Button>
        </div>
      </div>
    );
  }

  // Trạng thái 3: Đã có kế hoạch, đã sẵn sàng nấu
  if (state === 'ready-to-cook') {
    return (
      <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Khối trái: Trạng thái */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 text-base sm:text-lg">Đã sẵn sàng nguyên liệu!</h4>
              <button className="text-sm text-primary-600 hover:text-primary-700 underline transition-colors">
                Xem lại danh sách.
              </button>
            </div>
          </div>

          {/* Khối phải: Hành động */}
          <Button
            onClick={onStartCooking}
            className="bg-success-600 hover:bg-success-700 text-white px-6 py-3 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            Bắt Đầu Nấu Bữa Tiếp Theo
          </Button>
        </div>
      </div>
    );
  }

  // Trạng thái 4: Đã hoàn thành tất cả các bữa trong ngày
  if (state === 'completed') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Khối trái: Trạng thái */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 text-base sm:text-lg">Hoàn thành kế hoạch hôm nay!</h4>
              <p className="text-sm text-neutral-600">Bạn thật tuyệt vời!</p>
            </div>
          </div>

          {/* Khối phải: Hành động */}
          <Button
            onClick={onPlanTomorrow}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Lên Kế Hoạch Cho Ngày Mai?
          </Button>
        </div>
      </div>
    );
  }

  // Fallback - không nên xảy ra
  return null;
};

export default WidgetFooter;
