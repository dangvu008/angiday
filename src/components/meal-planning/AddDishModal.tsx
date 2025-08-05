import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Filter,
  Clock,
  Users,
  Flame,
  Star,
  Heart,
  Plus,
  ChefHat,
  Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { Recipe } from '@/types/meal-planning';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  showFavoriteIcon?: boolean;
  showUserCreated?: boolean;
  favoriteRecipes: string[];
  onToggleFavorite: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  showFavoriteIcon = false,
  showUserCreated = false,
  favoriteRecipes,
  onToggleFavorite
}) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    onClick={() => onSelect(recipe)}
  >
    <CardContent className="p-4">
      <div className="relative">
        {/* Recipe Image */}
        <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Favorite/User Created Icons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {showFavoriteIcon && (
            <div className="bg-red-500 rounded-full p-1">
              <Heart className="h-3 w-3 text-white fill-current" />
            </div>
          )}
          {showUserCreated && (
            <div className="bg-orange-500 rounded-full p-1">
              <Star className="h-3 w-3 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Favorite Toggle Button */}
        <div className="absolute top-2 left-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
          >
            <Heart
              className={`h-4 w-4 ${
                favoriteRecipes.includes(recipe.id)
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-400'
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{recipe.title}</h3>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.cookingTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings} người
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {recipe.difficulty}
          </Badge>
          {recipe.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              {recipe.rating}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (recipe: Recipe) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  onAddDish,
  mealType,
  date
}) => {
  const { availableRecipes } = useMealPlanning();
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [userCreatedRecipes, setUserCreatedRecipes] = useState<Recipe[]>([]);

  // Form state for new recipe creation
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    image: '',
    ingredients: '',
    instructions: ''
  });

  useEffect(() => {
    // Load favorites, recent, and user created from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_recipes') || '[]');
    const savedRecent = JSON.parse(localStorage.getItem('recent_recipes') || '[]');
    const savedUserCreated = JSON.parse(localStorage.getItem('user_created_recipes') || '[]');

    setFavoriteRecipes(savedFavorites);
    setRecentRecipes(savedRecent);
    setUserCreatedRecipes(savedUserCreated);
  }, []);

  // Quick filters for explore tab
  const quickFilters = [
    'Món Việt', 'Món Âu', 'Món Chay', '< 30 phút', 'Dễ làm', 'Healthy'
  ];

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getMealTypeLabel = () => {
    const labels = {
      breakfast: 'bữa sáng',
      lunch: 'bữa trưa',
      dinner: 'bữa tối',
      snack: 'bữa phụ'
    };
    return labels[mealType];
  };

  const handleAddRecipe = (recipe: Recipe) => {
    // Add to recent recipes
    const updatedRecent = [recipe, ...recentRecipes.filter(r => r.id !== recipe.id)].slice(0, 10);
    setRecentRecipes(updatedRecent);
    localStorage.setItem('recent_recipes', JSON.stringify(updatedRecent));

    onAddDish(recipe);
    onClose();
  };

  const handleCreateNewRecipe = () => {
    if (!newRecipe.title.trim()) return;

    const recipe: Recipe = {
      id: `new_${Date.now()}`,
      title: newRecipe.title,
      description: 'Công thức tự tạo',
      category: 'Tự tạo',
      difficulty: 'Dễ',
      cookingTime: '30 phút',
      servings: 2,
      author: 'Bạn',
      status: 'draft',
      createdDate: new Date().toISOString(),
      views: 0,
      image: newRecipe.image || undefined,
      ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
      instructions: newRecipe.instructions.split('\n').filter(i => i.trim()),
      nutrition: { calories: 200, protein: 10, carbs: 20, fat: 8, fiber: 3 },
      tags: ['Tự tạo'],
      cuisine: 'Tự tạo',
      rating: 0,
      reviews: 0
    };

    // Save to user created recipes
    const updatedUserCreated = [recipe, ...userCreatedRecipes];
    setUserCreatedRecipes(updatedUserCreated);
    localStorage.setItem('user_created_recipes', JSON.stringify(updatedUserCreated));

    onAddDish(recipe);
    onClose();
  };

  const toggleFavorite = (recipeId: string) => {
    const updatedFavorites = favoriteRecipes.includes(recipeId)
      ? favoriteRecipes.filter(id => id !== recipeId)
      : [...favoriteRecipes, recipeId];

    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favorite_recipes', JSON.stringify(updatedFavorites));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get personal recipes (favorites + user created + recent)
  const getPersonalRecipes = () => {
    const favorites = availableRecipes.filter(recipe => favoriteRecipes.includes(recipe.id));
    const userCreated = userCreatedRecipes;
    const recent = recentRecipes.filter(recipe => !favoriteRecipes.includes(recipe.id) && !userCreatedRecipes.some(uc => uc.id === recipe.id));

    return [...favorites, ...userCreated, ...recent];
  };

  // Filter recipes for explore tab
  const getExploreRecipes = () => {
    let filtered = availableRecipes;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedFilters.some(filter =>
          recipe.tags.includes(filter) ||
          recipe.cuisine.includes(filter) ||
          (filter === '< 30 phút' && recipe.cookingTime.includes('30')) ||
          (filter === 'Dễ làm' && recipe.difficulty === 'Dễ')
        )
      );
    }

    return filtered;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thêm món cho {getMealTypeLabel()} - {new Date(date).toLocaleDateString('vi-VN')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Sổ Tay Của Bạn
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Khám Phá Món Mới
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo Công Thức Mới
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Sổ Tay Của Bạn */}
          <TabsContent value="personal" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm trong sổ tay của bạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {getPersonalRecipes()
                .filter(recipe =>
                  recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={handleAddRecipe}
                    showFavoriteIcon={favoriteRecipes.includes(recipe.id)}
                    showUserCreated={recipe.author === 'Bạn'}
                    favoriteRecipes={favoriteRecipes}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
            </div>

            {getPersonalRecipes().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có món ăn trong sổ tay</p>
                <p className="text-sm">Đánh dấu yêu thích hoặc tạo món mới để xem ở đây</p>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Khám Phá Món Mới */}
          <TabsContent value="explore" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm trong +10.000 công thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterToggle(filter)}
                    className="text-xs"
                  >
                    {filter}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Bộ lọc nâng cao...
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {getExploreRecipes().map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={handleAddRecipe}
                  favoriteRecipes={favoriteRecipes}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {getExploreRecipes().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy món ăn nào</p>
                <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Tạo Công Thức Mới */}
          <TabsContent value="create" className="mt-4 space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Tên món ăn *</label>
                <Input
                  placeholder="Nhập tên món ăn..."
                  value={newRecipe.title}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ảnh đại diện</label>
                <Input
                  placeholder="URL ảnh hoặc để trống..."
                  value={newRecipe.image}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, image: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nguyên liệu (mỗi dòng một nguyên liệu)</label>
                <Textarea
                  placeholder="Ví dụ:&#10;500g thịt bò&#10;2 củ hành tây&#10;1 thìa muối"
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hướng dẫn sơ bộ</label>
                <Textarea
                  placeholder="Mô tả ngắn gọn cách làm món này..."
                  value={newRecipe.instructions}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCreateNewRecipe}
                disabled={!newRecipe.title.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo & Thêm vào Kế hoạch
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishModal;
