
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { RatingStars } from '@/components/recipe/RatingStars';
import { ReviewSection } from '@/components/recipe/ReviewSection';
import { ServingConverter } from '@/components/recipe/ServingConverter';
import { Clock, Users, ChefHat, Heart, BookOpen, Star } from 'lucide-react';
import { NutritionCalculator } from '@/components/recipe/NutritionCalculator';
import { CookingMode } from '@/components/recipe/CookingMode';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [isCookingMode, setIsCookingMode] = useState(false);

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const recipe = {
    id: id,
    title: "Phở bò truyền thống Hà Nội",
    description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon được truyền từ đời này sang đời khác",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    cookTime: "3 giờ",
    prepTime: "30 phút",
    servings: "4 người",
    difficulty: "Trung bình",
    chef: "Chef Hương",
    rating: 4.8,
    likes: 1200,
    category: "Món chính",
    ingredients: [
      { name: "Xương bò", amount: "1kg", note: "xương ống, xương nầm" },
      { name: "Thịt bò", amount: "500g", note: "thăn, nạm" },
      { name: "Bánh phở tươi", amount: "400g", note: "" },
      { name: "Hành tây", amount: "2 củ", note: "to" },
      { name: "Gừng", amount: "100g", note: "tươi" },
      { name: "Quế", amount: "2 thanh", note: "" },
      { name: "Hồi", amount: "3 cái", note: "" },
      { name: "Đinh hương", amount: "5 cái", note: "" },
      { name: "Thảo quả", amount: "2 quả", note: "" },
      { name: "Nước mắm", amount: "3 tbsp", note: "ngon" },
      { name: "Muối", amount: "1 tsp", note: "" },
      { name: "Đường phê", amount: "1 tbsp", note: "" },
    ],
    instructions: [
      "Ngâm xương bò trong nước lạnh 2 tiếng để loại bỏ máu tươi",
      "Blanch xương bò: Cho vào nồi nước sôi, đun 5 phút rồi vớt ra rửa sạch",
      "Nướng hành tây và gừng trên bếp gas cho thơm, cạo sạch phần cháy",
      "Rang thơm các loại gia vị: quế, hồi, đinh hương, thảo quả",
      "Cho xương vào nồi lớn, đổ nước ngập. Thêm hành tây, gừng và gia vị đã rang",
      "Ninh nước dùng ít nhất 3 tiếng với lửa nhỏ, vớt bọt thường xuyên",
      "Luộc thịt bò riêng khoảng 40 phút, để nguội rồi thái mỏng",
      "Trần bánh phở qua nước sôi",
      "Nêm nước dùng với nước mắm, muối, đường cho vừa miệng",
      "Cho bánh phở vào tô, xếp thịt bò lên trên, chan nước dùng nóng",
      "Ăn kèm với rau thơm, chanh, ớt"
    ],
    tips: [
      "Ninh xương càng lâu nước dùng càng ngọt và trong",
      "Không nên cho quá nhiều gia vị để giữ hương vị tự nhiên",
      "Thịt bò thái mỏng sẽ chín vừa đủ khi chan nước dùng nóng"
    ],
    nutrition: {
      calories: 420,
      protein: 28.5,
      carbs: 45.2,
      fat: 12.8,
      fiber: 3.2,
      sugar: 8.1
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 pb-8 text-white">
              <Badge className="mb-4 bg-orange-600 hover:bg-orange-700">
                {recipe.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {recipe.title}
              </h1>
              <p className="text-xl mb-6 max-w-2xl">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <RatingStars rating={recipe.rating} readonly />
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-1" />
                    <span>{recipe.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-1" />
                    <span>{recipe.chef}</span>
                  </div>
                </div>
                <FavoriteButton 
                  itemId={recipe.id || '1'} 
                  itemType="recipe" 
                  showText
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Info */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold">Thời gian nấu</div>
                <div className="text-gray-600">{recipe.cookTime}</div>
              </div>
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold">Chuẩn bị</div>
                <div className="text-gray-600">{recipe.prepTime}</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold">Khẩu phần</div>
                <div className="text-gray-600">{recipe.servings}</div>
              </div>
              <div className="text-center">
                <ChefHat className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold">Độ khó</div>
                <div className="text-gray-600">{recipe.difficulty}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Content */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Ingredients */}
              <div className="md:col-span-1 space-y-6">
                <ServingConverter 
                  originalServings={4}
                  ingredients={recipe.ingredients}
                />
                
                <NutritionCalculator
                  nutrition={recipe.nutrition}
                  servings={4}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nguyên liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-start border-b pb-2">
                          <span className="font-medium">{ingredient.name}</span>
                          <div className="text-right text-sm">
                            <div className="text-orange-600 font-medium">{ingredient.amount}</div>
                            {ingredient.note && (
                              <div className="text-gray-500">{ingredient.note}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex space-x-2 mt-4">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                        Thêm vào danh sách mua
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsCookingMode(true)}
                      >
                        🍳 Chế độ nấu ăn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cách làm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-6">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-medium mr-4">
                            {index + 1}
                          </div>
                          <div className="text-gray-700 leading-relaxed">{step}</div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-green-600">Mẹo nhỏ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ReviewSection recipeId={recipe.id || '1'} />
          </div>
        </section>
      </main>
      
      {/* Cooking Mode Modal */}
      {isCookingMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CookingMode
              steps={recipe.instructions}
              recipeName={recipe.title}
              onClose={() => setIsCookingMode(false)}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;
