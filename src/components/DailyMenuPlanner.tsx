import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Utensils, CheckCircle, Star, Plus, Settings } from 'lucide-react';
import { useKitchen } from '@/contexts/KitchenContext';
import { DailyMealSchedule, MealAssignment } from '@/types/kitchen';
import { mealPlanningService } from '@/services/mealPlanningService';
import ApplyMealPlanModal from './meal-planning/ApplyMealPlanModal';

// Meal Assignment Card Component
const MealAssignmentCard: React.FC<{ assignment: MealAssignment }> = ({ assignment }) => {
  const { mealPlan, customRecipes, status } = assignment;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang thực hiện';
      default: return 'Đã lên kế hoạch';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 space-y-2">
      {mealPlan && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-gray-900">{mealPlan.name}</h4>
            <Badge className={getStatusColor(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-2">{mealPlan.description}</p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {mealPlan.totalTime} phút
            </span>
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {mealPlan.servings} người
            </span>
            <span className="flex items-center">
              <Utensils className="h-3 w-3 mr-1" />
              {mealPlan.recipes.length} món
            </span>
          </div>
        </div>
      )}

      {customRecipes && customRecipes.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-2">Món riêng lẻ:</h4>
          <div className="space-y-1">
            {customRecipes.map((recipe) => (
              <div key={recipe.id} className="text-xs text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {recipe.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DailyMenuPlanner: React.FC = () => {
  const { 
    dailyMenus, 
    selectedDailyMenu, 
    recipes,
    isLoading,
    applyDailyMenu 
  } = useKitchen();
  
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dailySchedule, setDailySchedule] = useState<DailyMealSchedule | null>(null);
  const [isApplyMealPlanModalOpen, setIsApplyMealPlanModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // Load daily schedule when date changes
  useEffect(() => {
    loadDailySchedule();
  }, [loadDailySchedule]);

  const loadDailySchedule = useCallback(async () => {
    setIsLoadingSchedule(true);
    try {
      const schedule = await mealPlanningService.getMealAssignmentsForDate(selectedDate);
      setDailySchedule(schedule);
    } catch (error) {
      console.error('Error loading daily schedule:', error);
    } finally {
      setIsLoadingSchedule(false);
    }
  }, [selectedDate]);

  const handleApplyMealPlan = (planId: string, date: string, mealType: string) => {
    // Refresh the schedule after applying
    loadDailySchedule();
  };

  const handleOpenApplyMealPlan = (mealType: string) => {
    setSelectedMealType(mealType);
    setIsApplyMealPlanModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getRecipeById = (recipeId: string) => {
    return recipes.find(recipe => recipe.id === recipeId);
  };

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

  const handleApplyMenu = async (menuId: string) => {
    setSelectedMenuId(menuId);
    await applyDailyMenu(menuId);
    setSelectedMenuId(null);
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
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
          <Calendar className="h-8 w-8 text-orange-600" />
          Kế Hoạch Thực Đơn Hàng Ngày
        </div>
        <p className="text-gray-600">Chọn thực đơn phù hợp cho gia đình bạn</p>
      </div>

      {/* Current Applied Menu */}
      {selectedDailyMenu && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Thực đơn đang áp dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">{selectedDailyMenu.name}</h3>
                <p className="text-sm text-green-700">{selectedDailyMenu.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-green-600">
                  <span>{selectedDailyMenu.totalCalories} kcal</span>
                  <span>{selectedDailyMenu.prepTime} phút</span>
                  <Badge className={getDifficultyColor(selectedDailyMenu.difficulty)}>
                    {getDifficultyLabel(selectedDailyMenu.difficulty)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selector */}
      <div className="flex justify-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Daily Meal Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Thực đơn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDailySchedule()}
              disabled={isLoadingSchedule}
            >
              {isLoadingSchedule ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
              ) : (
                'Làm mới'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải lịch trình...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Breakfast */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    🌅 Bữa sáng
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenApplyMealPlan('breakfast')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Áp dụng
                  </Button>
                </div>
                {dailySchedule?.breakfast ? (
                  <MealAssignmentCard assignment={dailySchedule.breakfast} />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500">
                    Chưa có thực đơn
                  </div>
                )}
              </div>

              {/* Lunch */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    🍽️ Bữa trưa
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenApplyMealPlan('lunch')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Áp dụng
                  </Button>
                </div>
                {dailySchedule?.lunch ? (
                  <MealAssignmentCard assignment={dailySchedule.lunch} />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500">
                    Chưa có thực đơn
                  </div>
                )}
              </div>

              {/* Dinner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    🌙 Bữa tối
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenApplyMealPlan('dinner')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Áp dụng
                  </Button>
                </div>
                {dailySchedule?.dinner ? (
                  <MealAssignmentCard assignment={dailySchedule.dinner} />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500">
                    Chưa có thực đơn
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {dailyMenus.map((menu) => (
          <Card 
            key={menu.id} 
            className={`transition-all duration-200 hover:shadow-lg ${
              selectedDailyMenu?.id === menu.id 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:shadow-md'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {selectedDailyMenu?.id === menu.id && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {menu.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(menu.difficulty)}>
                    {getDifficultyLabel(menu.difficulty)}
                  </Badge>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  <span>{menu.totalCalories} kcal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{menu.prepTime} phút</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {menu.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Meals */}
              <div className="space-y-3">
                {Object.entries(menu.meals).map(([mealType, recipeIds]) => (
                  <div key={mealType} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                      <span className="font-medium text-gray-900">
                        {getMealTypeLabel(mealType)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {recipeIds.map((recipeId) => {
                        const recipe = getRecipeById(recipeId);
                        if (!recipe) return null;
                        
                        return (
                          <div 
                            key={recipeId}
                            className="flex items-center justify-between bg-white p-2 rounded border"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">
                                {recipe.name}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <span>{recipe.prepTime + recipe.cookTime} phút</span>
                                <span>{recipe.nutrition.calories} kcal</span>
                              </div>
                            </div>
                            <Badge className={getDifficultyColor(recipe.difficulty)} variant="outline">
                              {getDifficultyLabel(recipe.difficulty)}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleApplyMenu(menu.id)}
                disabled={selectedMenuId === menu.id || selectedDailyMenu?.id === menu.id}
                className={`w-full ${
                  selectedDailyMenu?.id === menu.id
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {selectedMenuId === menu.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang áp dụng...
                  </div>
                ) : selectedDailyMenu?.id === menu.id ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Đang sử dụng
                  </div>
                ) : (
                  'Áp dụng thực đơn này'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Star className="h-5 w-5" />
            Mẹo hay
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Chọn thực đơn phù hợp với thời gian và kỹ năng nấu ăn của bạn</li>
            <li>• Thực đơn "Dễ" phù hợp cho người mới bắt đầu hoặc bận rộn</li>
            <li>• Thực đơn "Khó" dành cho cuối tuần hoặc dịp đặc biệt</li>
            <li>• Có thể thay đổi thực đơn bất cứ lúc nào trong Kitchen Command Center</li>
          </ul>
        </CardContent>
      </Card>

      {/* Apply Meal Plan Modal */}
      <ApplyMealPlanModal
        isOpen={isApplyMealPlanModalOpen}
        onClose={() => setIsApplyMealPlanModalOpen(false)}
        onApply={handleApplyMealPlan}
        preselectedDate={selectedDate}
        preselectedMealType={selectedMealType}
      />
    </div>
  );
};

export default DailyMenuPlanner;
