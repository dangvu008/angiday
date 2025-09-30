import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Users,
  ChefHat,
  Search,
  Filter,
  Heart,
  Plus,
  Eye,
  Star,
  Calendar,
  UtensilsCrossed,
  X,
  CheckCircle
} from 'lucide-react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Recipe } from '@/types/kitchen';
import RecipeImage from './RecipeImage';
import AddToMealPlanModal from './meal-planning/AddToMealPlanModal';
import { CreateRecipeModal } from './recipe/CreateRecipeModal';

// Recipe Detail Modal Component
const RecipeDetailModal: React.FC<{
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMealPlan: (recipeId: string, mealType: string) => void;
  onAddToToday: (recipeId: string, mealType: string) => void;
}> = ({ recipe, isOpen, onClose, onAddToMealPlan, onAddToToday }) => {
  const [selectedMealType, setSelectedMealType] = useState<string>('lunch');

  if (!isOpen || !recipe) return null;

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{recipe.title || 'Không có tên'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Recipe Image */}
          <RecipeImage recipe={recipe} size="large" />

          {/* Recipe Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-600">{recipe.description || 'Không có mô tả'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Thời gian</span>
                  </div>
                  <p className="text-lg font-semibold">{recipe.cooking_time || 'N/A'}</p>
                  <p className="text-xs text-gray-600">Thời gian nấu</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Khẩu phần</span>
                  </div>
                  <p className="text-lg font-semibold">{recipe.servings || 'N/A'} người</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin dinh dưỡng</h3>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: <span className="font-semibold">{recipe.nutrition?.calories || 0} kcal</span></div>
                    <div>Protein: <span className="font-semibold">{recipe.nutrition?.protein || 0}g</span></div>
                    <div>Carbs: <span className="font-semibold">{recipe.nutrition?.carbs || 0}g</span></div>
                    <div>Fat: <span className="font-semibold">{recipe.nutrition?.fat || 0}g</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nguyên liệu ({(recipe.ingredients as string[] || []).length} món)</h3>
                <ul className="space-y-1">
                  {(recipe.ingredients as string[] || []).map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cách làm ({(recipe.instructions as string[] || []).length} bước)</h3>
                <ol className="space-y-2">
                  {(recipe.instructions as string[] || []).map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Thêm vào thực đơn</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-600">Chọn bữa ăn:</span>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="breakfast">Bữa sáng</option>
                  <option value="lunch">Bữa trưa</option>
                  <option value="dinner">Bữa tối</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onAddToToday(recipe.id, selectedMealType)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Thêm vào hôm nay
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onAddToMealPlan(recipe.id, selectedMealType)}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  Thêm vào kế hoạch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecipeLibrary: React.FC = () => {
  const {
    recipes,
    isLoading,
    addMealToSlot,
    activeMealPlan,
    refreshTodayMeals,
    refreshMealPlans,
    refreshRecipes
  } = useKitchen();

  const location = useLocation();
  const isMyRecipes = location.pathname === '/my-recipes';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddToMealPlanModalOpen, setIsAddToMealPlanModalOpen] = useState(false);
  const [recipeToAdd, setRecipeToAdd] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [notification, setNotification] = useState<string>('');

  // Show notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter(recipe => {
      const matchesSearch = (recipe.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (recipe.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (recipe.ingredients as string[])?.some(ing => (ing || '').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      const matchesTag = selectedTag === 'all' || (recipe.tags as string[])?.includes(selectedTag);

      return matchesSearch && matchesDifficulty && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'time': {
          // Parse cooking_time string (e.g., "30 phút") to number
          const parseTime = (timeStr: string | null) => {
            if (!timeStr) return 0;
            const match = timeStr.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return parseTime(a.cooking_time) - parseTime(b.cooking_time);
        }
        case 'difficulty': {
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) -
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        }
        case 'calories': {
          const aNutrition = a.nutrition as { calories?: number };
          const bNutrition = b.nutrition as { calories?: number };
          return (aNutrition?.calories || 0) - (bNutrition?.calories || 0);
        }
        default:
          return 0;
      }
    });

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
  };

  const handleAddToToday = async (recipeId: string, mealType: string) => {
    try {
      await addMealToSlot(mealType, recipeId);
      await refreshTodayMeals();
      setNotification(`Đã thêm món ăn vào ${getMealTypeLabel(mealType)} hôm nay!`);
      setIsDetailModalOpen(false);
    } catch (error) {
      setNotification('Có lỗi xảy ra khi thêm món ăn');
    }
  };

  const handleAddToMealPlan = async (recipeId: string, mealType: string) => {
    try {
      // This would need to be implemented in KitchenContext
      setNotification(`Đã thêm món ăn vào kế hoạch ${getMealTypeLabel(mealType)}!`);
      setIsDetailModalOpen(false);
    } catch (error) {
      setNotification('Có lỗi xảy ra khi thêm vào kế hoạch');
    }
  };

  const handleOpenAddToMealPlan = (recipe: Recipe) => {
    setRecipeToAdd(recipe);
    setIsAddToMealPlanModalOpen(true);
  };

  const handleAddToMealPlanSuccess = (planId: string, action: 'added-to-plan' | 'added-to-meal') => {
    if (action === 'added-to-plan') {
      setNotification(`Đã thêm món vào thực đơn!`);
    } else {
      setNotification(`Đã thêm món vào bữa ăn!`);
    }
    setIsAddToMealPlanModalOpen(false);
    setRecipeToAdd(null);
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
        setNotification('Đã xóa khỏi yêu thích');
      } else {
        newFavorites.add(recipeId);
        setNotification('Đã thêm vào yêu thích');
      }
      return newFavorites;
    });
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Get unique tags
  const allTags = Array.from(new Set(recipes.flatMap(recipe => (recipe.tags as string[] || []))));

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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
          <ChefHat className="h-8 w-8 text-orange-600" />
          {isMyRecipes ? 'Công Thức Của Tôi' : 'Tất Cả Công Thức'}
        </div>
        <p className="text-gray-600">
          {isMyRecipes
            ? `Quản lý ${recipes.length} công thức cá nhân của bạn`
            : `Khám phá ${recipes.length} công thức món ăn đa dạng`
          }
          {filteredRecipes.length !== recipes.length && (
            <span className="text-orange-600"> • Hiển thị {filteredRecipes.length} kết quả</span>
          )}
        </p>

        {/* Create Recipe Button */}
        {isMyRecipes && (
          <div className="flex justify-center">
            <CreateRecipeModal onRecipeCreated={refreshRecipes} />
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{favorites.size} yêu thích</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Trung bình {Math.round(filteredRecipes.reduce((acc, r) => acc + (typeof r.prepTime === 'number' ? r.prepTime : parseInt(r.prepTime) || 0) + (typeof r.cookTime === 'number' ? r.cookTime : parseInt(r.cookTime) || 0), 0) / filteredRecipes.length || 0)} phút</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4 text-green-500" />
            <span>{filteredRecipes.filter(r => r.difficulty === 'easy').length} món dễ làm</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Độ khó:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Thể loại:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="name">Tên món</option>
                <option value="time">Thời gian</option>
                <option value="difficulty">Độ khó</option>
                <option value="calories">Calories</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            Hiển thị {filteredRecipes.length} / {recipes.length} công thức
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="relative">
                <RecipeImage
                  recipe={recipe}
                  size="medium"
                  className="mb-3 group-hover:scale-105 transition-transform duration-200"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.has(recipe.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <CardTitle className="text-lg flex items-start justify-between">
                <span className="line-clamp-2">{recipe.title || 'Không có tên'}</span>
                {favorites.has(recipe.id) && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0 ml-2" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{recipe.description || 'Không có mô tả'}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cooking_time || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings || 'N/A'} người</span>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(recipe.difficulty)}>
                  {getDifficultyLabel(recipe.difficulty)}
                </Badge>
                <span className="text-sm text-gray-600">
                  {recipe.nutrition.calories} kcal
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {(recipe.tags as string[] || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {(recipe.tags as string[] || []).length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{(recipe.tags as string[] || []).length - 3}
                  </span>
                )}
              </div>

              {/* Ingredients preview */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Nguyên liệu chính:</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {(recipe.ingredients as string[] || []).slice(0, 4).join(', ')}
                  {(recipe.ingredients as string[] || []).length > 4 && '...'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewRecipe(recipe)}
                  className="flex-1 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Chi tiết
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenAddToMealPlan(recipe)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Thêm vào thực đơn
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAddToToday(recipe.id, 'lunch')}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Hôm nay
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy công thức nào
          </h3>
          <p className="text-gray-600">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToMealPlan={handleAddToMealPlan}
        onAddToToday={handleAddToToday}
      />

      {/* Add to Meal Plan Modal */}
      {recipeToAdd && (
        <AddToMealPlanModal
          isOpen={isAddToMealPlanModalOpen}
          onClose={() => setIsAddToMealPlanModalOpen(false)}
          recipe={recipeToAdd}
          onSuccess={handleAddToMealPlanSuccess}
        />
      )}
    </div>
  );
};

export default RecipeLibrary;
