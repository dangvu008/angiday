import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, ShoppingCart, Shuffle, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useKitchen } from '@/contexts/KitchenContext';

const KitchenCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const {
    todayMeals,
    recipes,
    expiringItems,
    isLoading,
    dailyMenus,
    selectedDailyMenu,
    toggleMealCompleted,
    addMealToSlot,
    generateShoppingListFromActivePlan,
    applyDailyMenu,
    getRandomDailyMenu
  } = useKitchen();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa', 
      dinner: 'Bữa tối'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeIcon = (type: string) => {
    const icons = {
      breakfast: '☀️',
      lunch: '🌤️',
      dinner: '🌙'
    };
    return icons[type as keyof typeof icons] || '🍽️';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddMealToSlot = (mealType: string) => {
    // For demo, add first available recipe
    if (recipes.length > 0) {
      addMealToSlot(mealType, recipes[0].id);
    }
  };

  const handleApplyRandomMenu = async () => {
    const randomMenu = getRandomDailyMenu();
    if (randomMenu) {
      await applyDailyMenu(randomMenu.id);
    }
  };

  const handleApplySpecificMenu = async (menuId: string) => {
    await applyDailyMenu(menuId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const completedMeals = todayMeals.filter(meal => meal.completed).length;
  const totalMeals = todayMeals.filter(meal => meal.recipe).length;
  const progressPercentage = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
  
  const today = new Date().toISOString().split('T')[0];

  // Group meals by type for display
  const mealSlots = ['breakfast', 'lunch', 'dinner'].map(type => {
    const meal = todayMeals.find(m => m.mealType === type);
    return {
      id: meal?.id || `empty_${type}`,
      type,
      recipe: meal?.recipe,
      completed: meal?.completed || false,
      notes: meal?.notes
    };
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải Kitchen Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
          🏠 Kitchen Command Center
        </div>
        <p className="text-gray-600">Trung tâm điều khiển nhà bếp thông minh của bạn</p>
      </div>

      {/* Today's Plan Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Thực Đơn Hôm Nay - {formatDate(today)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyRandomMenu}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Thực đơn ngẫu nhiên
              </Button>
            </div>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Tiến độ: {completedMeals}/{totalMeals} bữa ăn</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          {selectedDailyMenu && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Đang áp dụng:</span>
                <span className="text-gray-700">{selectedDailyMenu.name}</span>
                <span className="text-xs text-gray-500">({selectedDailyMenu.totalCalories} kcal)</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{selectedDailyMenu.description}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Meal Slots */}
      <div className="grid md:grid-cols-3 gap-6">
        {mealSlots.map((meal) => (
          <Card 
            key={meal.id} 
            className={`transition-all duration-200 ${
              meal.completed 
                ? 'bg-green-50 border-green-200' 
                : meal.recipe 
                  ? 'hover:shadow-md border-gray-200' 
                  : 'border-dashed border-gray-300 bg-gray-50'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMealTypeIcon(meal.type)}</span>
                  <span className="text-lg font-semibold">
                    {getMealTypeLabel(meal.type)}
                  </span>
                </div>
                {meal.recipe && (
                  <Button
                    variant={meal.completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMealCompleted(meal.id)}
                    className={meal.completed ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {meal.recipe ? (
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🍽️</span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {meal.recipe.name || meal.recipe.title || 'Không có tên'}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{meal.recipe.prepTime} phút</span>
                    </div>
                    
                    <Badge className={getDifficultyColor(meal.recipe.difficulty)}>
                      {meal.recipe.difficulty === 'easy' ? 'Dễ' : 
                       meal.recipe.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </Badge>
                  </div>
                  
                  {meal.completed && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Đã hoàn thành
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Chưa có món nào</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleAddMealToSlot(meal.type)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm món
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Menu Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Gợi Ý Thực Đơn Hàng Ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyMenus.slice(0, 6).map((menu) => (
              <div
                key={menu.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedDailyMenu?.id === menu.id
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleApplySpecificMenu(menu.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{menu.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      menu.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      menu.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {menu.difficulty === 'easy' ? 'Dễ' :
                       menu.difficulty === 'medium' ? 'TB' : 'Khó'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{menu.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{menu.totalCalories} kcal</span>
                  <span>{menu.prepTime} phút</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {menu.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Danh sách mua sắm</h3>
                  <p className="text-sm text-gray-600">Chuẩn bị nguyên liệu cho tuần</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => generateShoppingListFromActivePlan()}
              >
                Tạo danh sách
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-medium">Nguyên liệu sắp hết hạn</h3>
                  <p className="text-sm text-gray-600">{expiringItems.length} món cần sử dụng sớm</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Kiểm tra
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KitchenCommandCenter;
