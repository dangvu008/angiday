import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChefHat, Clock, Users, Star, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MealPlan } from '@/types/kitchen';
import { mealPlanningService } from '@/services/mealPlanningService';
// import CreateMealPlanModal from './CreateMealPlanModal';
import { cn } from '@/lib/utils';

const MealPlanManager: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    loadMealPlans();
  }, []);

  // Show notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadMealPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await mealPlanningService.getMealPlans();
      setMealPlans(plans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
      setNotification('Có lỗi khi tải thực đơn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMealPlan = async (planId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa thực đơn này?')) {
      return;
    }

    try {
      await mealPlanningService.deleteMealPlan(planId);
      setMealPlans(prev => prev.filter(plan => plan.id !== planId));
      setNotification('Đã xóa thực đơn thành công');
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      setNotification('Có lỗi khi xóa thực đơn');
    }
  };

  const handleCreateSuccess = (newPlan: MealPlan) => {
    setMealPlans(prev => [...prev, newPlan]);
    setNotification('Đã tạo thực đơn mới thành công');
    setIsCreateModalOpen(false);
  };

  // Filter meal plans
  const filteredMealPlans = mealPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍪';
      default: return '🍳';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải thực đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChefHat className="h-8 w-8 mr-3 text-orange-600" />
            Quản Lý Thực Đơn
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các thực đơn cho gia đình
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo thực đơn mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm thực đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="breakfast">Bữa sáng</option>
            <option value="lunch">Bữa trưa</option>
            <option value="dinner">Bữa tối</option>
            <option value="snack">Bữa phụ</option>
            <option value="mixed">Hỗn hợp</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tổng thực đơn</p>
                <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Template</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mealPlans.filter(p => p.isTemplate).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Thời gian TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mealPlans.reduce((sum, p) => sum + p.totalTime, 0) / mealPlans.length || 0)} phút
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Khẩu phần TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mealPlans.reduce((sum, p) => sum + p.servings, 0) / mealPlans.length || 0)} người
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMealPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(plan.category)}</span>
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.isTemplate && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Template
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* TODO: Edit functionality */}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMealPlan(plan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {plan.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{plan.totalTime} phút</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{plan.servings} người</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{plan.recipes.length} món</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {plan.difficulty && (
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {plan.difficulty === 'easy' && 'Dễ'}
                      {plan.difficulty === 'medium' && 'Trung bình'}
                      {plan.difficulty === 'hard' && 'Khó'}
                    </Badge>
                  )}
                  {plan.totalCalories && (
                    <Badge variant="outline">
                      {plan.totalCalories} kcal
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {plan.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {plan.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredMealPlans.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy thực đơn nào
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc tạo thực đơn mới'
              : 'Bắt đầu bằng cách tạo thực đơn đầu tiên của bạn'
            }
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo thực đơn mới
          </Button>
        </div>
      )}

      {/* Create Meal Plan Modal - TODO: Implement */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Tạo thực đơn mới</h3>
            <p className="text-gray-600 mb-4">Tính năng này sẽ được triển khai trong phiên bản tiếp theo.</p>
            <Button onClick={() => setIsCreateModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanManager;
