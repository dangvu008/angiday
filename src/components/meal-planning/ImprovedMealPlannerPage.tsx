import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ChefHat, 
  ShoppingCart, 
  ArrowLeft,
  Plus,
  Settings
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import ActivePlanManager from './ActivePlanManager';
import ShoppingListGenerator from './ShoppingListGenerator';
import EnhancedMealPlannerMain from './EnhancedMealPlannerMain';

type ViewMode = 'manager' | 'planner' | 'shopping';

const ImprovedMealPlannerPage: React.FC = () => {
  const { activePlan, userMealPlans } = useMealPlanning();
  const [viewMode, setViewMode] = useState<ViewMode>('manager');
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>();

  const selectedPlan = selectedPlanId ? userMealPlans.find(p => p.id === selectedPlanId) : null;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('planner');
  };

  const handleBackToManager = () => {
    setViewMode('manager');
    setSelectedPlanId(undefined);
  };

  const handleCreateShoppingList = (planId?: string) => {
    if (planId) {
      setSelectedPlanId(planId);
    }
    setViewMode('shopping');
  };

  const renderHeader = () => {
    switch (viewMode) {
      case 'manager':
        return (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kế Hoạch Bữa Ăn</h1>
              <p className="text-gray-600 mt-1">
                Quản lý thực đơn và tạo danh sách mua sắm thông minh
              </p>
            </div>
            {activePlan && (
              <Button 
                onClick={() => handleCreateShoppingList(activePlan.id)}
                className="bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                🛒 Đi Chợ Cho Tuần Này
              </Button>
            )}
          </div>
        );
      
      case 'planner':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBackToManager}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi tiết: {selectedPlan?.name}
                </h1>
                <p className="text-gray-600">
                  Chỉnh sửa thực đơn và quản lý bữa ăn
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleCreateShoppingList(selectedPlanId)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Tạo Danh Sách Đi Chợ
            </Button>
          </div>
        );
      
      case 'shopping':
        return (
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToManager}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại kế hoạch
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Danh Sách Mua Sắm</h1>
              <p className="text-gray-600">
                Chuẩn bị nguyên liệu cho kế hoạch của bạn
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'manager':
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Khu vực 1: Quản lý các kế hoạch */}
            <div className="lg:col-span-2">
              <ActivePlanManager 
                onSelectPlan={handleSelectPlan}
                selectedPlanId={selectedPlanId}
              />
            </div>

            {/* Khu vực 2: Thông tin kế hoạch đang áp dụng */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Active Plan Info */}
                {activePlan ? (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                        Kế Hoạch Đang Áp Dụng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activePlan.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(activePlan.startDate).toLocaleDateString('vi-VN')} - {' '}
                          {new Date(activePlan.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-white rounded">
                          <div className="font-semibold text-gray-900">
                            {activePlan.meals.filter(m => m.recipe).length}
                          </div>
                          <div className="text-gray-600">Món ăn</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="font-semibold text-gray-900">
                            {Math.round((activePlan.meals.filter(m => m.recipe).length / Math.max(activePlan.meals.length, 1)) * 100)}%
                          </div>
                          <div className="text-gray-600">Hoàn thành</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleCreateShoppingList(activePlan.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Tạo Danh Sách Đi Chợ
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleSelectPlan(activePlan.id)}
                        >
                          Xem & Chỉnh Sửa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">
                        Chưa có kế hoạch đang áp dụng
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Chọn một kế hoạch và đặt làm "Đang áp dụng"
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hành Động Nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo kế hoạch mới
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt sở thích
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'planner':
        return <EnhancedMealPlannerMain />;

      case 'shopping':
        return (
          <ShoppingListGenerator 
            planId={selectedPlanId}
            useActivePlan={!selectedPlanId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {renderHeader()}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ImprovedMealPlannerPage;
