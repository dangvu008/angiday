import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  ShoppingCart, 
  Plus, 
  ArrowRight,
  ChefHat,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionButtonsProps {
  hasCurrentPlan: boolean;
  hasTodayMeals: boolean;
  activePlanName?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ hasCurrentPlan, hasTodayMeals, activePlanName }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        {/* Nút Đi Chợ Chính - Nổi bật nhất */}
        {hasCurrentPlan && (
          <div className="mb-4">
            <Button
              asChild
              size="lg"
              className="w-full h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl text-lg font-bold"
            >
              <Link to="/shopping-list" className="flex items-center justify-center gap-4">
                <ShoppingCart className="h-8 w-8" />
                <div className="text-center">
                  <div className="text-xl font-bold">
                    🛒 Chuẩn Bị Đi Chợ Cho Tuần Này
                  </div>
                  <div className="text-sm opacity-90">
                    {activePlanName ? `Từ: ${activePlanName}` : 'Kế hoạch đang áp dụng'}
                  </div>
                </div>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nút Kế hoạch tuần */}
          <Button
            asChild
            size="lg"
            className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            <Link to="/meal-planner" className="flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">
                  {hasCurrentPlan ? 'Xem & Chỉnh Sửa' : 'Tạo Kế Hoạch'}
                </div>
                <div className="text-sm opacity-90">
                  {hasCurrentPlan ? 'Kế hoạch tuần' : 'Kế hoạch ăn uống'}
                </div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          {/* Nút Danh sách đi chợ hôm nay */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-16 border-2 border-green-200 hover:bg-green-50 hover:border-green-300"
            disabled={!hasTodayMeals}
          >
            <Link to="/shopping-list" className="flex items-center justify-center gap-3">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-semibold text-green-700">
                  Danh Sách Hôm Nay
                </div>
                <div className="text-sm text-green-600">
                  Chỉ món ăn hôm nay
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-green-600" />
            </Link>
          </Button>
        </div>

        {/* Các nút phụ */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button variant="outline" size="sm" asChild className="h-12">
            <Link to="/recipes" className="flex flex-col items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className="text-xs">Công thức</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild className="h-12">
            <Link to="/meal-planner/create" className="flex flex-col items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="text-xs">Thêm món</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild className="h-12">
            <Link to="/nutrition" className="flex flex-col items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Dinh dưỡng</span>
            </Link>
          </Button>
        </div>

        {/* Thông báo nếu chưa có kế hoạch */}
        {!hasCurrentPlan && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              💡 Tạo kế hoạch ăn uống để bắt đầu quản lý bữa ăn hàng ngày một cách hiệu quả
            </p>
          </div>
        )}

        {/* Thông báo nếu chưa có món ăn hôm nay */}
        {hasCurrentPlan && !hasTodayMeals && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700 text-center">
              🍽️ Thêm món ăn cho hôm nay để có thể tạo danh sách đi chợ
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
