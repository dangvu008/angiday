import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  servings: number;
  difficulty: 'Dễ' | 'Trung bình';
  ingredients: string[];
  instructions: string[];
  tips: string;
  rating: number;
  image: string;
  tags: string[];
}

const easyRecipes: Recipe[] = [
  {
    id: 'thit-ba-chi-rang-chay-canh',
    name: 'Thịt Ba Chỉ Rang Cháy Cạnh',
    description: 'Món ăn đậm đà, thơm ngon, dễ làm cho bữa cơm gia đình',
    cookingTime: '25 phút',
    servings: 4,
    difficulty: 'Dễ',
    ingredients: [
      '500g thịt ba chỉ',
      '2 củ hành tím',
      '3 tép tỏi',
      '2 muỗng canh nước mắm',
      '1 muỗng canh đường',
      'Tiêu, ớt (tùy thích)'
    ],
    instructions: [
      'Thịt ba chỉ rửa sạch, cắt miếng vừa ăn',
      'Hành tím, tỏi băm nhỏ',
      'Cho thịt vào chảo không dầu, đảo đều cho thịt tiết dầu',
      'Thêm hành tỏi vào xào thơm',
      'Nêm nước mắm, đường, tiêu. Đảo đều cho thịt cháy cạnh',
      'Tắt bếp, rắc ớt lên trên'
    ],
    tips: 'Bí quyết: Không cho dầu vào chảo, để thịt tự tiết dầu sẽ thơm và giòn hơn',
    rating: 4.8,
    image: '/images/thit-ba-chi-rang.jpg',
    tags: ['Dễ làm', 'Đậm đà', 'Gia đình']
  },
  {
    id: 'canh-cua-rau-day',
    name: 'Canh Cua Rau Đay',
    description: 'Canh thanh mát, bổ dưỡng, phù hợp cho mọi bữa ăn',
    cookingTime: '20 phút',
    servings: 4,
    difficulty: 'Dễ',
    ingredients: [
      '200g cua đồng (hoặc cua biển)',
      '300g rau đay',
      '2 quả cà chua',
      '1 củ hành tím',
      'Nước mắm, muối',
      'Hành lá, ngò gai'
    ],
    instructions: [
      'Cua rửa sạch, đập dập. Rau đay nhặt sạch',
      'Cà chua cắt múi cau, hành tím băm nhỏ',
      'Phi thơm hành tím, cho cà chua vào xào',
      'Đổ nước vào nồi, cho cua vào nấu 10 phút',
      'Cho rau đay vào, nêm nếm vừa ăn',
      'Rắc hành lá, ngò gai lên trên'
    ],
    tips: 'Mẹo hay: Cho cà chua vào trước để canh có màu đẹp và vị chua tự nhiên',
    rating: 4.6,
    image: '/images/canh-cua-rau-day.jpg',
    tags: ['Thanh mát', 'Bổ dưỡng', 'Nhanh gọn']
  },
  {
    id: 'trung-chien-thit-bam',
    name: 'Trứng Chiên Thịt Bằm',
    description: 'Món ăn quen thuộc, đơn giản mà ngon miệng',
    cookingTime: '15 phút',
    servings: 3,
    difficulty: 'Dễ',
    ingredients: [
      '4 quả trứng gà',
      '150g thịt heo bằm',
      '1 củ hành tím',
      'Nước mắm, tiêu',
      'Dầu ăn',
      'Hành lá'
    ],
    instructions: [
      'Thịt bằm ướp với nước mắm, tiêu 10 phút',
      'Hành tím băm nhỏ, trứng đánh tan',
      'Phi thơm hành tím, cho thịt bằm vào xào chín',
      'Đổ trứng vào, để lửa nhỏ',
      'Khi trứng gần chín, gấp đôi lại',
      'Rắc hành lá lên trên'
    ],
    tips: 'Bí quyết: Lửa nhỏ để trứng chín đều, không bị cháy đáy',
    rating: 4.7,
    image: '/images/trung-chien-thit-bam.jpg',
    tags: ['Quen thuộc', 'Nhanh', 'Tiết kiệm']
  },
  {
    id: 'rau-muong-xao-toi',
    name: 'Rau Muống Xào Tỏi',
    description: 'Món rau xanh giòn ngon, bổ sung chất xơ cho bữa ăn',
    cookingTime: '10 phút',
    servings: 4,
    difficulty: 'Dễ',
    ingredients: [
      '500g rau muống',
      '4 tép tỏi',
      '1 muỗng canh dầu ăn',
      'Nước mắm, muối',
      'Ớt (tùy thích)'
    ],
    instructions: [
      'Rau muống nhặt sạch, cắt khúc 5cm',
      'Tỏi băm nhỏ hoặc đập dập',
      'Đun nóng chảo với dầu ăn',
      'Cho tỏi vào phi thơm',
      'Cho rau muống vào xào nhanh tay',
      'Nêm nước mắm, muối vừa ăn'
    ],
    tips: 'Mẹo vàng: Xào nhanh tay trên lửa lớn để rau giữ được màu xanh và độ giòn',
    rating: 4.5,
    image: '/images/rau-muong-xao-toi.jpg',
    tags: ['Xanh giòn', 'Nhanh', 'Healthy']
  }
];

const EasyDinnerRecipes: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleSignUpToViewFull = () => {
    setSelectedRecipe(null);
    navigate('/register');
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Món Ngon Dễ Nấu Cho Tối Nay
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những món ăn quen thuộc, dễ làm mà cả gia đình đều yêu thích. 
            Chỉ cần 15-25 phút là có ngay bữa cơm ngon!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {easyRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleViewRecipe(recipe)}
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <div className="text-4xl">🍽️</div>
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{recipe.rating}</span>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {recipe.name || recipe.title || 'Không có tên'}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} người</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-orange-50 group-hover:border-orange-300 group-hover:text-orange-600 transition-all"
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Xem công thức
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Bạn thích những món này? Angiday có hàng ngàn công thức tương tự!
          </p>
          <Button 
            onClick={() => navigate('/recipes')}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Khám phá thêm công thức khác
          </Button>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-4">
                  {selectedRecipe.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-4">{selectedRecipe.description}</p>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{selectedRecipe.cookingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>{selectedRecipe.servings} người</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedRecipe.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">🥘 Nguyên liệu:</h4>
                  <ul className="space-y-1">
                    {selectedRecipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {ingredient}
                      </li>
                    ))}
                    <li className="text-sm text-gray-500 italic">... và {selectedRecipe.ingredients.length - 3} nguyên liệu khác</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">👩‍🍳 Cách làm (xem trước):</h4>
                  <ol className="space-y-2">
                    {selectedRecipe.instructions.slice(0, 2).map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-700">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                    <li className="text-sm text-gray-500 italic ml-8">... và {selectedRecipe.instructions.length - 2} bước tiếp theo</li>
                  </ol>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Mẹo hay:</h4>
                  <p className="text-sm text-gray-700">{selectedRecipe.tips}</p>
                </div>

                <div className="text-center space-y-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-2 text-orange-600">
                    <Heart className="h-5 w-5" />
                    <span className="font-semibold">Bạn thích công thức này?</span>
                  </div>
                  <p className="text-gray-600">
                    Đăng ký ngay để xem công thức chi tiết, video hướng dẫn và hàng ngàn món ngon khác!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handleSignUpToViewFull}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Đăng ký ngay - Miễn phí! 🚀
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedRecipe(null)}
                      className="px-6 py-2 rounded-full"
                    >
                      Xem món khác
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EasyDinnerRecipes;
