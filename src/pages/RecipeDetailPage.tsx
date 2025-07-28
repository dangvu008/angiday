import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Star, ShoppingCart, Utensils } from 'lucide-react';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [isCookingMode, setIsCookingMode] = useState(false);

  // Debug log
  console.log('RecipeDetailPage rendering, id:', id);

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
    ]
  };

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
            <span className="text-gray-900">{recipe.title}</span>
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
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Recipe Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-3">
                {recipe.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {recipe.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Recipe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.cookTime.split(' ')[0]}</div>
                <div className="text-sm text-gray-600">Thời gian nấu</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.prepTime.split(' ')[0]}</div>
                <div className="text-sm text-gray-600">Chuẩn bị</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{recipe.servings.split(' ')[0]}</div>
                <div className="text-sm text-gray-600">Phục vụ</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <ChefHat className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-gray-900">{recipe.difficulty}</div>
                <div className="text-sm text-gray-600">Độ khó</div>
              </div>
            </div>

            {/* Rating & Chef */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{recipe.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({recipe.likes} đánh giá)</span>
                <div className="flex items-center text-sm text-gray-600">
                  <ChefHat className="h-4 w-4 mr-1" />
                  <span>{recipe.chef}</span>
                </div>
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
                <Button 
                  variant="outline" 
                  className="w-full py-3 rounded-xl font-semibold border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => setIsCookingMode(true)}
                >
                  <Utensils className="h-5 w-5 mr-2" />
                  Chế độ nấu ăn
                </Button>
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
