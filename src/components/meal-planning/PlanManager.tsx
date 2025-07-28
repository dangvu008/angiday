import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { 
  Plus, Search, Calendar, Clock, Users, ChefHat, CalendarDays, 
  CalendarRange, Edit, Trash2, Copy, Eye, Star, Filter 
} from 'lucide-react';
import { AnyPlan, MealPlan, SingleDayPlan, WeekPlan, MonthPlan } from '@/types/meal-planning';
import PlanCreator from './PlanCreator';
import ApplyPlanModal from './ApplyPlanModal';
import { useAuth } from '@/hooks/useAuth';

interface PlanManagerProps {
  plans: AnyPlan[];
  onCreatePlan: (plan: AnyPlan) => void;
  onUpdatePlan: (plan: AnyPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSelectPlan: (plan: AnyPlan) => void;
  onApplyPlan?: (appliedPlan: any) => void;
}

const PlanManager = ({ plans, onCreatePlan, onUpdatePlan, onDeletePlan, onSelectPlan, onApplyPlan }: PlanManagerProps) => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'meal' | 'day' | 'week' | 'month'>('all');
  const [creatorType, setCreatorType] = useState<'meal' | 'day' | 'week' | 'month'>('day');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPlanToApply, setSelectedPlanToApply] = useState<AnyPlan | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'my' | 'public'>('all');
  const { user } = useAuth();

  const planTypeIcons = {
    meal: ChefHat,
    day: Calendar,
    week: CalendarDays,
    month: CalendarRange
  };

  const planTypeLabels = {
    meal: 'Bữa ăn',
    day: 'Ngày',
    week: 'Tuần',
    month: 'Tháng'
  };

  const planTypeColors = {
    meal: 'bg-orange-100 text-orange-800',
    day: 'bg-blue-100 text-blue-800',
    week: 'bg-green-100 text-green-800',
    month: 'bg-purple-100 text-purple-800'
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || plan.type === selectedType;

    // Filter by view mode
    let matchesViewMode = true;
    if (viewMode === 'my') {
      matchesViewMode = plan.createdBy === user?.id;
    } else if (viewMode === 'public') {
      matchesViewMode = plan.isPublic && plan.createdBy !== user?.id;
    } else if (viewMode === 'all') {
      // Show public plans and user's own plans
      matchesViewMode = plan.isPublic || plan.createdBy === user?.id;
    }

    return matchesSearch && matchesType && matchesViewMode;
  });

  const handleApplyPlan = (plan: AnyPlan) => {
    setSelectedPlanToApply(plan);
    setShowApplyModal(true);
  };

  const handleApplyConfirm = (appliedPlan: any) => {
    if (onApplyPlan) {
      onApplyPlan(appliedPlan);
    }
  };

  const canEditPlan = (plan: AnyPlan) => {
    return plan.createdBy === user?.id;
  };

  const canDeletePlan = (plan: AnyPlan) => {
    return plan.createdBy === user?.id;
  };

  const groupedPlans = {
    meal: filteredPlans.filter(p => p.type === 'meal') as MealPlan[],
    day: filteredPlans.filter(p => p.type === 'day') as SingleDayPlan[],
    week: filteredPlans.filter(p => p.type === 'week') as WeekPlan[],
    month: filteredPlans.filter(p => p.type === 'month') as MonthPlan[]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDuration = (plan: AnyPlan) => {
    switch (plan.type) {
      case 'meal':
        return `${(plan as MealPlan).cookingTime} phút`;
      case 'day':
        return formatDate((plan as SingleDayPlan).date);
      case 'week':
        const weekPlan = plan as WeekPlan;
        return `${formatDate(weekPlan.startDate)} - ${formatDate(weekPlan.endDate)}`;
      case 'month':
        const monthPlan = plan as MonthPlan;
        return `Tháng ${monthPlan.month}/${monthPlan.year}`;
      default:
        return '';
    }
  };

  const getServings = (plan: AnyPlan) => {
    switch (plan.type) {
      case 'meal':
        return `${(plan as MealPlan).servings} người`;
      case 'day':
        return 'Cả ngày';
      case 'week':
        return '7 ngày';
      case 'month':
        const monthPlan = plan as MonthPlan;
        return `${monthPlan.weeks.length} tuần`;
      default:
        return '';
    }
  };

  const handleCreatePlan = (type: 'meal' | 'day' | 'week' | 'month') => {
    setCreatorType(type);
    setIsCreatorOpen(true);
  };

  // Function to get representative image for a plan
  const getPlanImage = (plan: AnyPlan) => {
    const images = {
      meal: {
        breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop",
        lunch: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        dinner: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        snack: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop"
      },
      day: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      week: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
      month: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&h=300&fit=crop"
    };

    if (plan.type === 'meal') {
      const mealPlan = plan as MealPlan;
      return images.meal[mealPlan.mealType] || images.meal.lunch;
    }

    return images[plan.type as keyof typeof images] || images.day;
  };

  const PlanCard = ({ plan }: { plan: AnyPlan }) => {
    const Icon = planTypeIcons[plan.type];
    const isOwner = canEditPlan(plan);
    const planImage = getPlanImage(plan);

    return (
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={planImage}
            alt={plan.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Plan Type Badge */}
          <div className="absolute top-3 left-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${planTypeColors[plan.type]} backdrop-blur-sm shadow-lg`}>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{planTypeLabels[plan.type]}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {plan.isPublic && (
              <Badge className="text-xs bg-green-500/90 text-white border-0 shadow-sm backdrop-blur-sm">
                🌍 Công khai
              </Badge>
            )}
            {plan.isTemplate && (
              <Badge className="text-xs bg-yellow-500/90 text-white border-0 shadow-sm backdrop-blur-sm">
                ⭐ Template
              </Badge>
            )}
            {isOwner && (
              <Badge className="text-xs bg-blue-500/90 text-white border-0 shadow-sm backdrop-blur-sm">
                👤 Của bạn
              </Badge>
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg line-clamp-2 mb-1">
              {plan.name}
            </h3>
            <p className="text-white/90 text-sm line-clamp-1">
              {plan.description || 'Không có mô tả'}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{getServings(plan)}</div>
                <div className="text-xs text-gray-600">👥 Khẩu phần</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{plan.totalCalories}</div>
                <div className="text-xs text-gray-600">🔥 Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{formatCurrency(plan.totalCost)}</div>
                <div className="text-xs text-gray-600">💰 Chi phí</div>
              </div>
            </div>

            {/* Duration and Time */}
            <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white text-gray-700 border-gray-200">
                  ⏱️ {getDuration(plan)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{plan.cookingTime} phút</span>
              </div>
            </div>

            {/* Tags */}
            {plan.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {plan.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                    #{tag}
                  </Badge>
                ))}
                {plan.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{plan.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Creator Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(plan.createdByName || plan.createdBy).charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-600">bởi</span>
                <span className="font-medium text-gray-800">{plan.createdByName || plan.createdBy}</span>
              </div>
              <span className="text-xs text-gray-500">{new Date(plan.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectPlan(plan)}
                className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Button>

              {canEditPlan(plan) ? (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle edit */}}
                    className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyPlan(plan)}
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePlan(plan.id)}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : plan.isPublic ? (
                <Button
                  size="sm"
                  onClick={() => handleApplyPlan(plan)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Áp dụng
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kế Hoạch Nấu Ăn Thông Minh
            </h2>
            <p className="text-gray-600 mt-2">
              Khám phá, tạo mới và áp dụng các kế hoạch ăn uống từ cộng đồng
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {plans.filter(p => p.isPublic && p.createdBy !== user?.id).length} kế hoạch công khai
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {plans.filter(p => p.createdBy === user?.id).length} kế hoạch của bạn
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsCreatorOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tạo kế hoạch
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* View Mode Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={viewMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('all')}
                  className={viewMode === 'all' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'hover:bg-blue-50'}
                >
                  🌍 Tất cả
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                    {plans.filter(p => p.isPublic || p.createdBy === user?.id).length}
                  </Badge>
                </Button>
                <Button
                  variant={viewMode === 'my' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('my')}
                  className={viewMode === 'my' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'hover:bg-green-50'}
                >
                  👤 Của tôi
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                    {plans.filter(p => p.createdBy === user?.id).length}
                  </Badge>
                </Button>
                <Button
                  variant={viewMode === 'public' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('public')}
                  className={viewMode === 'public' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'hover:bg-orange-50'}
                >
                  🔓 Công khai
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                    {plans.filter(p => p.isPublic && p.createdBy !== user?.id).length}
                  </Badge>
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm kế hoạch theo tên, mô tả hoặc tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'meal', 'day', 'week', 'month'] as const).map((type) => {
                  const isActive = selectedType === type;
                  const count = type === 'all' ? filteredPlans.length : filteredPlans.filter(p => p.type === type).length;

                  return (
                    <Button
                      key={type}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className={`${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'hover:bg-gray-50'} transition-all duration-200`}
                    >
                      {type === 'all' ? '📋 Tất cả' :
                       type === 'meal' ? '🍽️ Bữa ăn' :
                       type === 'day' ? '📅 Ngày' :
                       type === 'week' ? '📆 Tuần' : '🗓️ Tháng'}
                      <Badge variant="secondary" className={`ml-2 ${isActive ? 'bg-white/20 text-current' : ''}`}>
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            {filteredPlans.length > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <span>Tìm thấy {filteredPlans.length} kế hoạch</span>
                <div className="flex items-center gap-4">
                  <span>Tổng calories: {filteredPlans.reduce((sum, p) => sum + p.totalCalories, 0).toLocaleString()}</span>
                  <span>Chi phí trung bình: {Math.round(filteredPlans.reduce((sum, p) => sum + p.totalCost, 0) / filteredPlans.length).toLocaleString()}đ</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có kế hoạch nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo kế hoạch đầu tiên để bắt đầu quản lý ăn uống của bạn
            </p>
            <Button onClick={() => setIsCreatorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan Creator Modal */}
      <PlanCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onCreatePlan={onCreatePlan}
        initialType={creatorType}
      />

      {/* Apply Plan Modal */}
      <ApplyPlanModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        plan={selectedPlanToApply}
        onApplyPlan={handleApplyConfirm}
      />
    </div>
  );
};

export default PlanManager;
