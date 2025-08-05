import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  ChefHat, 
  Star, 
  Search, 
  Plus, 
  MoreHorizontal,
  CheckCircle,
  Copy,
  Edit,
  Trash2,
  ShoppingCart
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { Link } from 'react-router-dom';

interface ActivePlanManagerProps {
  onSelectPlan: (planId: string) => void;
  selectedPlanId?: string;
}

const ActivePlanManager: React.FC<ActivePlanManagerProps> = ({ onSelectPlan, selectedPlanId }) => {
  const { userMealPlans, activePlan, setActivePlan, deleteMealPlan, saveMealPlan } = useMealPlanning();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = userMealPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetActivePlan = (plan: any) => {
    setActivePlan(plan);
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) {
      deleteMealPlan(planId);
    }
  };

  const handleCopyPlan = (plan: any) => {
    const newPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      name: `${plan.name} (Sao chép)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveMealPlan(newPlan);
  };

  const getPlanStats = (plan: any) => {
    const totalMeals = plan.meals.length;
    const mealsWithRecipes = plan.meals.filter((meal: any) => meal.recipe).length;
    const completionRate = totalMeals > 0 ? Math.round((mealsWithRecipes / totalMeals) * 100) : 0;
    
    return {
      totalMeals,
      mealsWithRecipes,
      completionRate
    };
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const end = new Date(endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Các Kế Hoạch Của Tôi</h2>
          <p className="text-gray-600">Chọn kế hoạch để xem chi tiết hoặc đặt làm kế hoạch đang áp dụng</p>
        </div>
        <Button asChild>
          <Link to="/meal-planner/create">
            <Plus className="h-4 w-4 mr-2" />
            Tạo kế hoạch mới
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm kế hoạch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const isActive = activePlan?.id === plan.id;
          const isSelected = selectedPlanId === plan.id;
          const stats = getPlanStats(plan);

          return (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isActive 
                  ? 'border-orange-300 bg-orange-50 shadow-lg' 
                  : isSelected
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectPlan(plan.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ChefHat className="h-5 w-5" />
                      {plan.name}
                      {isActive && (
                        <Badge className="bg-orange-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đang áp dụng
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateRange(plan.startDate, plan.endDate)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                {plan.description && (
                  <p className="text-sm text-gray-600">{plan.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-gray-900">{stats.mealsWithRecipes}</div>
                    <div className="text-gray-600">Món ăn</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-gray-900">{stats.completionRate}%</div>
                    <div className="text-gray-600">Hoàn thành</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlan(plan.id);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Xem & Sửa
                  </Button>
                  
                  {!isActive && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetActivePlan(plan);
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Áp dụng
                    </Button>
                  )}

                  {isActive && (
                    <Button 
                      size="sm"
                      variant="outline"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to="/shopping-list">
                        <ShoppingCart className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy kế hoạch nào' : 'Chưa có kế hoạch nào'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Thử tìm kiếm với từ khóa khác' 
                : 'Tạo kế hoạch đầu tiên để bắt đầu quản lý ăn uống của bạn'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/meal-planner/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo kế hoạch mới
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivePlanManager;
