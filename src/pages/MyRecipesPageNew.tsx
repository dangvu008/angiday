// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { CreateRecipeModal } from '@/components/recipe/CreateRecipeModal';
import RecipeImportButton from '@/components/recipe/RecipeImportButton';
import { recipeManagementService, Recipe } from '@/services/recipeManagementService';
import { toast } from 'sonner';
import {
  Plus,
  Heart,
  Search,
  Filter,
  Clock,
  Users,
  ChefHat,
  Star,
  Eye,
  Calendar,
  BookOpen,
  Utensils
} from 'lucide-react';

interface ExtendedRecipe extends Recipe {
  is_favorite?: boolean;
  used_in_meal_plans?: number;
}

const MyRecipesPageNew = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [recipes, setRecipes] = useState<ExtendedRecipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<ExtendedRecipe[]>([]);
  const [mealPlanRecipes, setMealPlanRecipes] = useState<ExtendedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (user) {
      loadAllRecipes();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadAllRecipes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load user's own recipes
      const userRecipes = await recipeManagementService.getRecipes({
        user_id: user.id,
        limit: 100
      });

      // Load favorite recipes
      const favorites = await recipeManagementService.getUserFavorites(user.id);

      // Load recipes from meal plans
      const mealPlanRecipes = await recipeManagementService.getRecipesFromMealPlans(user.id);

      // Add extended properties
      const extendedUserRecipes: ExtendedRecipe[] = userRecipes.map(recipe => ({
        ...recipe,
        used_in_meal_plans: mealPlanRecipes.filter(r => r.id === recipe.id).length
      }));

      const extendedFavorites: ExtendedRecipe[] = favorites.map(recipe => ({
        ...recipe,
        is_favorite: true,
        used_in_meal_plans: mealPlanRecipes.filter(r => r.id === recipe.id).length
      }));

      const extendedMealPlanRecipes: ExtendedRecipe[] = mealPlanRecipes.map(recipe => ({
        ...recipe,
        used_in_meal_plans: 1 // At least 1 since it's from meal plans
      }));

      setRecipes(extendedUserRecipes);
      setFavoriteRecipes(extendedFavorites);
      setMealPlanRecipes(extendedMealPlanRecipes);

    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Có lỗi xảy ra khi tải công thức');

      // Fallback to mock data
      const mockMyRecipes: ExtendedRecipe[] = [
        {
          id: '1',
          name: 'Món canh chua cá lóc của mẹ',
          description: 'Công thức canh chua truyền thống trong gia đình được truyền từ mẹ',
          image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
          ingredients: ['Cá lóc', 'Cà chua', 'Dứa', 'Đậu bắp'],
          instructions: ['Sơ chế cá', 'Nấu nước dùng', 'Cho gia vị'],
          prep_time: 15,
          cook_time: 30,
          servings: 4,
          difficulty: 'medium',
          rating: 4.8,
          views: 156,
          user_id: user?.id,
          is_public: true,
          source: 'user',
          tags: ['canh', 'cá', 'truyền thống'],
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          used_in_meal_plans: 3
        },
        {
          id: '2',
          name: 'Bánh tráng nướng Đà Lạt',
          description: 'Món ăn vặt yêu thích từ thời sinh viên ở Đà Lạt',
          image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
          ingredients: ['Bánh tráng', 'Trứng', 'Hành lá', 'Tôm khô'],
          instructions: ['Nướng bánh tráng', 'Đập trứng lên', 'Rắc gia vị'],
          prep_time: 10,
          cook_time: 10,
          servings: 2,
          difficulty: 'easy',
          rating: 4.5,
          views: 89,
          user_id: user?.id,
          is_public: false,
          source: 'user',
          tags: ['ăn vặt', 'nướng', 'đà lạt'],
          created_at: '2024-01-10T14:30:00Z',
          updated_at: '2024-01-10T14:30:00Z',
          used_in_meal_plans: 1
        }
      ];

      const mockFavorites: ExtendedRecipe[] = [
        {
          id: '3',
          name: 'Phở Bò Hà Nội',
          description: 'Công thức truyền thống để nấu tô phở bò thơm ngon đúng vị Hà Nội',
          image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
          ingredients: ['Xương bò', 'Thịt bò', 'Bánh phở', 'Hành tây'],
          instructions: ['Ninh xương', 'Luộc thịt', 'Pha nước dùng'],
          prep_time: 30,
          cook_time: 120,
          servings: 4,
          difficulty: 'hard',
          rating: 4.9,
          views: 2341,
          is_public: true,
          source: 'system',
          tags: ['phở', 'bò', 'hà nội'],
          created_at: '2024-01-01T08:00:00Z',
          updated_at: '2024-01-01T08:00:00Z',
          is_favorite: true,
          used_in_meal_plans: 5
        }
      ];

      const mockMealPlanRecipes: ExtendedRecipe[] = [
        ...mockMyRecipes.filter(r => r.used_in_meal_plans && r.used_in_meal_plans > 0),
        ...mockFavorites.filter(r => r.used_in_meal_plans && r.used_in_meal_plans > 0)
      ];

      setRecipes(mockMyRecipes);
      setFavoriteRecipes(mockFavorites);
      setMealPlanRecipes(mockMealPlanRecipes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportRecipe = async (importedRecipe: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để nhập công thức');
      return;
    }

    try {
      // Convert imported recipe to our format
      const recipe = {
        name: importedRecipe.title,
        description: importedRecipe.description,
        ingredients: importedRecipe.ingredients,
        instructions: importedRecipe.instructions,
        prep_time: parseInt(importedRecipe.cookTime) || 30,
        cook_time: 0,
        servings: importedRecipe.servings,
        difficulty: importedRecipe.difficulty.toLowerCase(),
        image_url: importedRecipe.image,
        tags: [importedRecipe.category],
        is_public: false,
        source: importedRecipe.source || 'import'
      };

      // Save to database
      const savedRecipe = await recipeManagementService.createRecipe(recipe);

      // Reload recipes to show the new one
      await loadAllRecipes();

      toast.success(`Đã nhập công thức "${importedRecipe.title}" thành công!`);
    } catch (error) {
      console.error('Error importing recipe:', error);
      toast.error('Có lỗi xảy ra khi nhập công thức');
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`;
    return `${Math.ceil(diffDays / 30)} tháng trước`;
  };

  const filterAndSortRecipes = (recipeList: ExtendedRecipe[]) => {
    let filtered = recipeList.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === filterDifficulty);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const RecipeCard = ({ recipe }: { recipe: ExtendedRecipe }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={recipe.image_url || '/placeholder.svg'}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {recipe.is_favorite && (
            <Badge className="bg-red-500 text-white">
              <Heart className="h-3 w-3 mr-1" />
              Yêu thích
            </Badge>
          )}
          {recipe.source === 'user' && (
            <Badge className="bg-blue-500 text-white">
              Của tôi
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{recipe.name}</CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {recipe.rating}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.prep_time + recipe.cook_time} phút
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {recipe.servings} người
          </div>
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {getDifficultyLabel(recipe.difficulty)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {recipe.views} lượt xem
          </div>
          {recipe.used_in_meal_plans && recipe.used_in_meal_plans > 0 && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {recipe.used_in_meal_plans} thực đơn
            </div>
          )}
          <span>{formatDate(recipe.created_at)}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/recipe/${recipe.id}`}>
              <BookOpen className="h-4 w-4 mr-1" />
              Xem chi tiết
            </Link>
          </Button>
          <FavoriteButton
            itemId={recipe.id}
            itemType="recipe"
            size="sm"
            variant="outline"
            onToggle={(isFavorite) => {
              // Refresh favorites when toggled
              if (user) {
                loadAllRecipes();
              }
            }}
          />
          <Button variant="outline" size="sm">
            <Utensils className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải công thức...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Kho công thức của tôi
                </h1>
                <p className="text-xl text-gray-600 mb-6 md:mb-0">
                  Quản lý công thức cá nhân, yêu thích và từ thực đơn
                </p>
              </div>
              <div className="flex gap-3">
                <RecipeImportButton
                  onImport={handleImportRecipe}
                  variant="outline"
                  showDropdown={true}
                />
                <CreateRecipeModal onRecipeCreated={loadAllRecipes} />
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm công thức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="views">Xem nhiều</SelectItem>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="my-recipes" className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Công thức của tôi ({recipes.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Yêu thích ({favoriteRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="meal-plans" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Từ thực đơn ({mealPlanRecipes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-recipes" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Công thức do tôi tạo</h2>
                  <p className="text-gray-600">Những công thức nấu ăn bạn đã tự tạo và chia sẻ</p>
                </div>
                {filterAndSortRecipes(recipes).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <ChefHat className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || filterDifficulty !== 'all' ? 'Không tìm thấy công thức nào' : 'Chưa có công thức nào'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterDifficulty !== 'all'
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                        : 'Hãy tạo công thức đầu tiên của bạn để chia sẻ với cộng đồng'
                      }
                    </p>
                    {!searchTerm && filterDifficulty === 'all' && (
                      <CreateRecipeModal onRecipeCreated={loadAllRecipes} />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterAndSortRecipes(recipes).map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Công thức yêu thích</h2>
                  <p className="text-gray-600">Những công thức bạn đã đánh dấu yêu thích</p>
                </div>
                {filterAndSortRecipes(favoriteRecipes).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Heart className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || filterDifficulty !== 'all' ? 'Không tìm thấy công thức yêu thích nào' : 'Chưa có công thức yêu thích'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterDifficulty !== 'all'
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                        : 'Hãy khám phá và đánh dấu những công thức yêu thích của bạn'
                      }
                    </p>
                    {!searchTerm && filterDifficulty === 'all' && (
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Link to="/recipes">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Khám phá công thức
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterAndSortRecipes(favoriteRecipes).map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="meal-plans" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Công thức từ thực đơn</h2>
                  <p className="text-gray-600">Những công thức đã được sử dụng trong các thực đơn của bạn</p>
                </div>
                {filterAndSortRecipes(mealPlanRecipes).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || filterDifficulty !== 'all' ? 'Không tìm thấy công thức nào' : 'Chưa có công thức từ thực đơn'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterDifficulty !== 'all'
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                        : 'Hãy tạo thực đơn và thêm công thức vào để xem chúng ở đây'
                      }
                    </p>
                    {!searchTerm && filterDifficulty === 'all' && (
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Link to="/meal-planning">
                          <Calendar className="h-5 w-5 mr-2" />
                          Tạo thực đơn
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterAndSortRecipes(mealPlanRecipes).map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyRecipesPageNew;
