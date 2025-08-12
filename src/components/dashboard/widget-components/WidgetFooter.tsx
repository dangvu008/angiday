import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  CheckCircle,
  Play,
  Sparkles,
  Plus,
  Lightbulb
} from 'lucide-react';
import { WidgetFooterProps } from '@/types/today-meal-widget';

const WidgetFooter: React.FC<WidgetFooterProps> = ({
  state,
  shoppingStatus,
  nextMealType,
  onCreatePlan,
  onCreateShoppingList,
  onStartCooking,
  onPlanTomorrow,
  onAISuggestion
}) => {
  // Trạng thái 2: Đã có kế hoạch, cần đi chợ
  if (state === 'need-shopping') {
    return (
      <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Khối 1: Trạng thái Mua Sắm */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 text-sm">Trạng Thái Mua Sắm</h4>
                <p className="text-xs text-neutral-600">
                  Cần chuẩn bị đi chợ
                </p>
                <p className="text-xs text-neutral-500">
                  Cho {shoppingStatus.ingredientCount} nguyên liệu hôm nay.
                </p>
              </div>
            </div>
          </div>

          {/* Khối 2: Hành Động Chính */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <Button
              onClick={onCreateShoppingList}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full lg:w-auto"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              🛒 Tạo Danh Sách Mua Sắm Ngay
            </Button>
          </div>

          {/* Khối 3: Gợi Ý Thông Minh */}
          <div className="lg:col-span-1 flex items-center justify-center lg:justify-end">
            <div className="text-center lg:text-right">
              <h4 className="font-medium text-neutral-700 text-sm mb-1">Gợi ý thông minh</h4>
              <button
                onClick={onAISuggestion}
                className="text-xs text-primary-600 hover:text-primary-700 underline transition-colors flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" />
                Nhờ AI gợi ý cho ngày mai?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái 3: Đã có kế hoạch, đã sẵn sàng nấu
  if (state === 'ready-to-cook') {
    return (
      <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Khối 1: Trạng thái Mua Sắm */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 text-sm">Trạng Thái Mua Sắm</h4>
                <p className="text-xs text-neutral-600">
                  Đã sẵn sàng nguyên liệu!
                </p>
                <button className="text-xs text-primary-600 hover:text-primary-700 underline transition-colors">
                  Xem lại danh sách.
                </button>
              </div>
            </div>
          </div>

          {/* Khối 2: Hành Động Chính */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <Button
              onClick={onStartCooking}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full lg:w-auto"
            >
              <Play className="h-4 w-4 mr-2" />
              ▶️ Bắt Đầu Nấu Bữa Tiếp Theo
            </Button>
          </div>

          {/* Khối 3: Gợi Ý Thông Minh */}
          <div className="lg:col-span-1 flex items-center justify-center lg:justify-end">
            <div className="text-center lg:text-right">
              <h4 className="font-medium text-neutral-700 text-sm mb-1">Gợi ý thông minh</h4>
              <button
                onClick={onAISuggestion}
                className="text-xs text-primary-600 hover:text-primary-700 underline transition-colors flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" />
                Nhờ AI gợi ý cho ngày mai?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái 4: Đã hoàn thành tất cả các bữa trong ngày
  if (state === 'completed') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Khối 1: Trạng thái Hoàn thành */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 text-sm">Trạng Thái Hoàn Thành</h4>
                <p className="text-xs text-neutral-600">
                  Hoàn thành kế hoạch hôm nay!
                </p>
                <p className="text-xs text-neutral-500">
                  Bạn thật tuyệt vời!
                </p>
              </div>
            </div>
          </div>

          {/* Khối 2: Hành Động Chính */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <Button
              onClick={onPlanTomorrow}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 w-full lg:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Lên Kế Hoạch Cho Ngày Mai?
            </Button>
          </div>

          {/* Khối 3: Gợi Ý Thông Minh */}
          <div className="lg:col-span-1 flex items-center justify-center lg:justify-end">
            <div className="text-center lg:text-right">
              <h4 className="font-medium text-neutral-700 text-sm mb-1">Gợi ý thông minh</h4>
              <button
                onClick={onAISuggestion}
                className="text-xs text-primary-600 hover:text-primary-700 underline transition-colors flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" />
                Nhờ AI gợi ý cho ngày mai?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - không nên xảy ra
  return null;
};

export default WidgetFooter;
