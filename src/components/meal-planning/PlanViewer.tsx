import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, Users, ChefHat, CalendarDays, CalendarRange,
  ArrowLeft, Edit, Copy, Share2, Download, Plus, Utensils
} from 'lucide-react';
import { AnyPlan, MealPlan, SingleDayPlan, WeekPlan, MonthPlan } from '@/types/meal-planning';

interface PlanViewerProps {
  plan: AnyPlan;
  onBack: () => void;
  onEdit: (plan: AnyPlan) => void;
  onCopy: (plan: AnyPlan) => void;
  onAddMeal?: (planId: string, mealType: string, date?: string) => void;
}

const PlanViewer = ({ plan, onBack, onEdit, onCopy, onAddMeal }: PlanViewerProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const planTypeIcons = {
    meal: ChefHat,
    day: Calendar,
    week: CalendarDays,
    month: CalendarRange
  };

  const planTypeLabels = {
    meal: 'Kế hoạch bữa ăn',
    day: 'Kế hoạch ngày',
    week: 'Kế hoạch tuần',
    month: 'Kế hoạch tháng'
  };

  const planTypeColors = {
    meal: 'bg-orange-100 text-orange-800',
    day: 'bg-blue-100 text-blue-800',
    week: 'bg-green-100 text-green-800',
    month: 'bg-purple-100 text-purple-800'
  };

  const mealTypeLabels = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    snack: 'Ăn vặt'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const Icon = planTypeIcons[plan.type];

  const renderMealPlan = (mealPlan: MealPlan) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết bữa ăn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Utensils className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-gray-600">Loại bữa ăn</p>
              <p className="font-semibold">{mealTypeLabels[mealPlan.mealType]}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Khẩu phần</p>
              <p className="font-semibold">{mealPlan.servings} người</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Thời gian nấu</p>
              <p className="font-semibold">{mealPlan.cookingTime} phút</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <span className="text-2xl block mb-2">🔥</span>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="font-semibold">{mealPlan.totalCalories} cal</p>
            </div>
          </div>
          
          {mealPlan.date && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Ngày thực hiện</p>
              <p className="font-semibold">{formatDate(mealPlan.date)}</p>
            </div>
          )}

          <div className="text-center py-8 text-gray-500">
            <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có món ăn nào</p>
            <Button 
              className="mt-4" 
              onClick={() => onAddMeal?.(plan.id, mealPlan.mealType, mealPlan.date)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm món ăn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDayPlan = (dayPlan: SingleDayPlan) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kế hoạch ngày {formatDate(dayPlan.date)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(dayPlan.meals).map(([mealType, meal]) => {
              if (mealType === 'snacks') return null; // Handle snacks separately
              
              return (
                <Card key={mealType} className="border-2 border-dashed border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">Chưa có món ăn</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => onAddMeal?.(plan.id, mealType, dayPlan.date)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Snacks section */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🍿</span>
                Ăn vặt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Chưa có món ăn vặt</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onAddMeal?.(plan.id, 'snack', dayPlan.date)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm ăn vặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderWeekPlan = (weekPlan: WeekPlan) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Kế hoạch tuần: {formatDate(weekPlan.startDate)} - {formatDate(weekPlan.endDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {weekPlan.days.map((day, index) => (
              <Card key={day.date} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {formatDate(day.date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {Object.entries(day.meals).map(([mealType, meal]) => {
                      if (mealType === 'snacks') return null;
                      
                      return (
                        <div key={mealType} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm mb-2">
                            {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
                          </h4>
                          <div className="text-center py-2 text-gray-500 text-xs">
                            <p>Chưa có món</p>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="mt-1 h-6 text-xs"
                              onClick={() => onAddMeal?.(plan.id, mealType, day.date)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Thêm
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMonthPlan = (monthPlan: MonthPlan) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Kế hoạch tháng {monthPlan.month}/{monthPlan.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthPlan.weeks.map((week, index) => (
              <Card key={`week-${index}`} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Tuần {index + 1}: {formatDate(week.startDate)} - {formatDate(week.endDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {week.days.map((day) => (
                      <div key={day.date} className="p-2 border rounded text-center">
                        <p className="text-xs font-medium">
                          {new Date(day.date).getDate()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {day.totalCalories} cal
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlanContent = () => {
    switch (plan.type) {
      case 'meal':
        return renderMealPlan(plan as MealPlan);
      case 'day':
        return renderDayPlan(plan as SingleDayPlan);
      case 'week':
        return renderWeekPlan(plan as WeekPlan);
      case 'month':
        return renderMonthPlan(plan as MonthPlan);
      default:
        return <div>Loại kế hoạch không được hỗ trợ</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${planTypeColors[plan.type]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-gray-600">{planTypeLabels[plan.type]}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onEdit(plan)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => onCopy(plan)}>
            <Copy className="h-4 w-4 mr-2" />
            Sao chép
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất
          </Button>
        </div>
      </div>

      {/* Plan Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{plan.totalCalories}</div>
              <div className="text-sm text-gray-600">Tổng calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(plan.totalCost)}</div>
              <div className="text-sm text-gray-600">Chi phí ước tính</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{plan.nutrition.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{plan.nutrition.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
          </div>
          
          {plan.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-2">Mô tả</h3>
              <p className="text-gray-600">{plan.description}</p>
            </div>
          )}
          
          {plan.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
          <TabsTrigger value="shopping">Mua sắm</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderPlanContent()}
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích dinh dưỡng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{plan.nutrition.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{plan.nutrition.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{plan.nutrition.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{plan.nutrition.fiber}g</div>
                  <div className="text-sm text-gray-600">Chất xơ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách mua sắm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Danh sách mua sắm sẽ được tạo tự động khi bạn thêm món ăn vào kế hoạch</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanViewer;
