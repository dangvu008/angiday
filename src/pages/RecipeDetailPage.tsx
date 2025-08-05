import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { recipeManagementService, Recipe } from '@/services/recipeManagementService';
import { Clock, Users, ChefHat, Star, ShoppingCart, Utensils, Eye, Calendar } from 'lucide-react';
import CookingModeStarter from '@/components/cooking/CookingModeStarter';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const recipeData = await recipeManagementService.getRecipe(id);
      if (recipeData) {
        setRecipe(recipeData);
        // Increment views
        await recipeManagementService.incrementViews(id);
      } else {
        toast.error('Không tìm thấy công thức');
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      toast.error('Có lỗi xảy ra khi tải công thức');

      // Fallback to mock data
      const mockRecipe: Recipe = {
        id: id || '1',
        name: "Phở bò truyền thống Hà Nội",
        description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon được truyền từ đời này sang đời khác",
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
        ingredients: [
          "Xương bò 1kg (xương ống, xương nầm)",
          "Thịt bò 500g (thăn, nạm)",
          "Bánh phở tươi 400g",
          "Hành tây 2 củ to",
          "Gừng 100g tươi",
          "Quế 2 thanh",
          "Hồi 3 cái",
          "Đinh hương 5 cái",
          "Thảo quả 2 quả",
          "Nước mắm 3 tbsp ngon",
          "Muối 1 tsp",
          "Đường phê 1 tbsp"
        ],
        instructions: [
          "Ngâm xương bò trong nước lạnh 2 tiếng để loại bỏ máu tươi",
          "Blanch xương bò: Cho vào nồi nước sôi, đun 5 phút rồi vớt ra rửa sạch",
          "Nướng hành tây và gừng trên bếp gas cho thơm, cạo sạch phần cháy",
          "Rang thơm các loại gia vị: quế, hồi, đinh hương, thảo quả",
          "Cho xương vào nồi lớn, đổ nước ngập. Thêm hành tây, gừng và gia vị đã rang",
          "Ninh nước dùng ít nhất 3 tiếng với lửa nhỏ, vớt bọt thường xuyên",
          "Luộc thịt bò riêng, thái lát mỏng",
          "Trần bánh phở qua nước sôi",
          "Bày bánh phở vào tô, xếp thịt bò lên trên",
          "Chan nước dùng nóng, rắc hành lá, ngò gai"
        ],
        prep_time: 30,
        cook_time: 180,
        servings: 4,
        difficulty: 'medium',
        rating: 4.8,
        views: 1200,
        is_public: true,
        source: 'system',
        tags: ['phở', 'bò', 'hà nội', 'truyền thống'],
        created_at: '2024-01-01T08:00:00Z',
        updated_at: '2024-01-01T08:00:00Z'
      };
      setRecipe(mockRecipe);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công thức</h2>
            <p className="text-gray-600">Công thức bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-orange-600">Trang chủ</a>
            <span>/</span>
            <a href="/recipes" className="hover:text-orange-600">Công thức nấu ăn</a>
            <span>/</span>
            <span className="text-gray-900">{recipe.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Recipe Image */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Recipe Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {recipe.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Recipe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.cook_time}</div>
                <div className="text-sm text-gray-600">Thời gian nấu (phút)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.prep_time}</div>
                <div className="text-sm text-gray-600">Chuẩn bị (phút)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Phục vụ (người)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <ChefHat className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-gray-900">{getDifficultyLabel(recipe.difficulty)}</div>
                <div className="text-sm text-gray-600">Độ khó</div>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{recipe.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{recipe.views} lượt xem</span>
                </div>
                <Badge className={getDifficultyColor(recipe.difficulty)}>
                  {getDifficultyLabel(recipe.difficulty)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton
                  itemId={recipe.id}
                  itemType="recipe"
                  showText={true}
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thành phần</h2>
              
              <div className="space-y-3 mb-6">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                      {ingredient.note && (
                        <span className="text-sm text-gray-500">({ingredient.note})</span>
                      )}
                    </div>
                    <span className="font-semibold text-orange-600">{ingredient.amount}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào danh sách mua
                </Button>
              </div>
            </div>

            {/* Cooking Mode Starter - Temporarily disabled */}
            <div className="mt-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-orange-700 font-medium">🍳 Chế Độ Nấu Ăn</p>
                <p className="text-sm text-orange-600 mt-1">
                  Truy cập <a href="/cooking-demo" className="underline font-medium">/cooking-demo</a> để trải nghiệm tính năng mới!
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Hướng dẫn nấu ăn</h2>
                
                <div className="space-y-6">
                  {recipe.instructions.map((step, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-gray-800 leading-relaxed text-lg">{step}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tips */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mr-4">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">Bí quyết từ đầu bếp</h3>
                </div>
                <div className="space-y-4">
                  {recipe.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-green-800 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;
