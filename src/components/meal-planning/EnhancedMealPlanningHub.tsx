import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  ShoppingCart, 
  ChefHat, 
  Package,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AnyPlan, Menu } from '@/types/meal-planning';
import PlanShoppingStatus from './PlanShoppingStatus';
import SmartShoppingList from './SmartShoppingList';
import CookingMode from './CookingMode';
import InventoryManager from './InventoryManager';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { toast } from 'sonner';

interface EnhancedMealPlanningHubProps {
  userId: string;
  availablePlans?: AnyPlan[];
  availableMenus?: Menu[];
  onCreatePlan?: () => void;
  onCreateMenu?: () => void;
}

const EnhancedMealPlanningHub: React.FC<EnhancedMealPlanningHubProps> = ({
  userId,
  availablePlans = [],
  availableMenus = [],
  onCreatePlan,
  onCreateMenu
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState<AnyPlan | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
  const [planStatuses, setPlanStatuses] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanStatuses();
  }, [availablePlans, userId]);

  const loadPlanStatuses = async () => {
    try {
      setLoading(true);
      const statusMap = new Map();
      
      for (const plan of availablePlans) {
        const status = await inventoryManagementService.checkPlanShoppingStatus(plan, userId);
        statusMap.set(plan.id, status);
      }
      
      setPlanStatuses(statusMap);
    } catch (error) {
      console.error('Error loading plan statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartShopping = (shoppingListId: string) => {
    setShowShoppingList(true);
    toast.success('Mở danh sách mua sắm');
  };

  const handleStartCooking = (planId: string) => {
    const plan = availablePlans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowCookingMode(true);
    }
  };

  const getOverviewStats = () => {
    const totalPlans = availablePlans.length;
    const readyToCook = Array.from(planStatuses.values()).filter(status => status.hasAllIngredients).length;
    const needShopping = totalPlans - readyToCook;
    const totalMenus = availableMenus.length;

    return { totalPlans, readyToCook, needShopping, totalMenus };
  };

  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kế hoạch bữa ăn thông minh</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thực đơn, nguyên liệu và nấu ăn một cách thông minh
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowInventoryManager(true)}>
            <Package className="h-4 w-4 mr-2" />
            Quản lý kho
          </Button>
          <Button variant="outline" onClick={() => setShowShoppingList(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Mua sắm thông minh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng kế hoạch</p>
                <p className="text-2xl font-bold">{stats.totalPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Sẵn sàng nấu</p>
                <p className="text-2xl font-bold">{stats.readyToCook}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Cần đi chợ</p>
                <p className="text-2xl font-bold">{stats.needShopping}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Thực đơn</p>
                <p className="text-2xl font-bold">{stats.totalMenus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="plans">Kế hoạch bữa ăn</TabsTrigger>
          <TabsTrigger value="menus">Thực đơn</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Plans with Status */}
          <Card>
            <CardHeader>
              <CardTitle>Kế hoạch gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : availablePlans.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có kế hoạch nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tạo kế hoạch bữa ăn đầu tiên của bạn
                  </p>
                  <Button onClick={onCreatePlan}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo kế hoạch
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availablePlans.slice(0, 5).map(plan => {
                    const status = planStatuses.get(plan.id);
                    return (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {plan.type === 'day' ? 'Kế hoạch ngày' : 
                                 plan.type === 'week' ? 'Kế hoạch tuần' : 
                                 plan.type === 'month' ? 'Kế hoạch tháng' : 'Bữa ăn'}
                              </Badge>
                              <Badge variant="outline">
                                {plan.totalCalories} cal
                              </Badge>
                              <Badge variant="outline">
                                {plan.totalCost.toLocaleString('vi-VN')}₫
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {status ? (
                              <>
                                {status.hasAllIngredients ? (
                                  <Badge variant="default" className="bg-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Sẵn sàng nấu
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Thiếu {status.missingIngredients.length} nguyên liệu
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                Đang kiểm tra...
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <PlanShoppingStatus
                          plan={plan}
                          userId={userId}
                          onStartShopping={handleStartShopping}
                          onStartCooking={handleStartCooking}
                          className="mt-3"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kế hoạch bữa ăn</h2>
            <Button onClick={onCreatePlan}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <PlanShoppingStatus
                    plan={plan}
                    userId={userId}
                    onStartShopping={handleStartShopping}
                    onStartCooking={handleStartCooking}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menus" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Thực đơn có sẵn</h2>
            <Button onClick={onCreateMenu}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo thực đơn mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableMenus.map(menu => (
              <Card key={menu.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{menu.name}</CardTitle>
                  <p className="text-sm text-gray-600">{menu.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {menu.recipes.length} món
                    </Badge>
                    <Badge variant="outline">
                      {menu.totalCalories} cal
                    </Badge>
                    <Badge variant="outline">
                      {menu.totalCost.toLocaleString('vi-VN')}₫
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Xem chi tiết
                    </Button>
                    <Button size="sm" className="flex-1">
                      Thêm vào kế hoạch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SmartShoppingList
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        availablePlans={availablePlans}
        availableMenus={availableMenus}
        userId={userId}
      />

      {selectedPlan && (
        <CookingMode
          isOpen={showCookingMode}
          onClose={() => {
            setShowCookingMode(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}

      <InventoryManager
        isOpen={showInventoryManager}
        onClose={() => setShowInventoryManager(false)}
        userId={userId}
      />
    </div>
  );
};

export default EnhancedMealPlanningHub;
