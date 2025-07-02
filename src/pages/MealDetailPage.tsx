
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, ChefHat, Heart } from 'lucide-react';

const MealDetailPage = () => {
  const { planId, day, mealType } = useParams();
  const navigate = useNavigate();

  // Mock data for meal details
  const mealDetails = {
    planTitle: "Thực đơn 7 ngày cho bà bầu",
    day: "Thứ 2",
    mealType: "Sáng",
    dishes: [
      {
        id: 1,
        name: "Cháo yến mạch chuối",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        cookTime: "15 phút",
        servings: "1 người",
        difficulty: "Dễ",
        description: "Cháo yến mạch bổ dưỡng với chuối tươi, giàu chất xơ và vitamin",
        ingredients: [
          "100g yến mạch",
          "1 quả chuối chín",
          "300ml sữa tươi",
          "1 thìa mật ong",
          "1 nhúm muối"
        ],
        instructions: [
          "Đun sôi sữa tươi trong nồi",
          "Cho yến mạch vào nấu nhỏ lửa 10 phút",
          "Nghiền chuối và trộn vào cháo",
          "Nêm mật ong và muối vừa ăn",
          "Trang trí với lát chuối và dùng nóng"
        ],
        nutrition: {
          calories: "320 kcal",
          protein: "12g",
          carbs: "45g",
          fat: "8g"
        }
      }
    ]
  };

  const getMealTypeInVietnamese = (type: string) => {
    switch(type) {
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
      default: return type;
    }
  };

  const getDayInVietnamese = (dayParam: string) => {
    const days = {
      'monday': 'Thứ 2',
      'tuesday': 'Thứ 3',
      'wednesday': 'Thứ 4',
      'thursday': 'Thứ 5',
      'friday': 'Thứ 6',
      'saturday': 'Thứ 7',
      'sunday': 'Chủ nhật'
    };
    return days[dayParam as keyof typeof days] || dayParam;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Back Navigation */}
        <section className="py-4 px-4 border-b">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/meal-plans/${planId}`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại thực đơn</span>
            </Button>
          </div>
        </section>

        {/* Page Header */}
        <section className="py-8 px-4 bg-gradient-to-br from-orange-50 to-green-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">{mealDetails.planTitle}</Badge>
              <Badge className="bg-orange-600">{getDayInVietnamese(day || '')}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bữa {getMealTypeInVietnamese(mealType || '')}
            </h1>
            <p className="text-lg text-gray-600">
              Các món ăn được chọn lọc kỹ càng cho bữa {getMealTypeInVietnamese(mealType || '').toLowerCase()}
            </p>
          </div>
        </section>

        {/* Dishes List */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {mealDetails.dishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="aspect-video lg:aspect-square overflow-hidden">
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{dish.name}</h2>
                        <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer" />
                      </div>

                      <p className="text-gray-600 mb-4">{dish.description}</p>

                      {/* Quick Info */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-600">{dish.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-600">{dish.servings}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChefHat className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-600">{dish.difficulty}</span>
                        </div>
                      </div>

                      {/* Nutrition */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-2">Dinh dưỡng</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Calories: {dish.nutrition.calories}</div>
                          <div>Protein: {dish.nutrition.protein}</div>
                          <div>Carbs: {dish.nutrition.carbs}</div>
                          <div>Fat: {dish.nutrition.fat}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() => navigate(`/recipes/${dish.id}`)}
                        >
                          Xem công thức
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Thêm vào yêu thích
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients & Instructions */}
                  <div className="p-6 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Ingredients */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Nguyên liệu</h3>
                        <ul className="space-y-2">
                          {dish.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-orange-600 mt-1">•</span>
                              <span className="text-gray-700">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Cách làm</h3>
                        <ol className="space-y-2">
                          {dish.instructions.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MealDetailPage;
