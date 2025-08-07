import { useParams, useNavigate } from 'react-router-dom';
import StandardLayout from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, ChefHat, Heart } from 'lucide-react';

const MealDetailPage = () => {
  const { planId, day, mealType } = useParams();
  const navigate = useNavigate();

  // Helper functions - moved to top to avoid hoisting issues
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

  // Mock data for meal details with multiple dishes per meal
  const getMealData = (mealType: string) => {
    const mealData = {
      breakfast: {
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
          },
          {
            id: 2,
            name: "Bánh mì trứng ốp la",
            image: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=400&h=300&fit=crop",
            cookTime: "10 phút",
            servings: "1 người",
            difficulty: "Dễ",
            description: "Bánh mì nướng giòn kết hợp với trứng ốp la thơm ngon",
            ingredients: [
              "2 lát bánh mì",
              "2 quả trứng gà",
              "1 thìa dầu ăn",
              "Muối, tiêu",
              "Rau xà lách"
            ],
            instructions: [
              "Nướng bánh mì cho giòn",
              "Đun chảo với dầu ăn",
              "Đập trứng vào chảo, ốp la hai mặt",
              "Nêm muối tiêu vừa ăn",
              "Kẹp trứng vào bánh mì với rau xà lách"
            ],
            nutrition: {
              calories: "280 kcal",
              protein: "15g",
              carbs: "25g",
              fat: "12g"
            }
          }
        ]
      },
      lunch: {
        dishes: [
          {
            id: 3,
            name: "Cơm gà nướng mật ong",
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
            cookTime: "45 phút",
            servings: "2 người",
            difficulty: "Trung bình",
            description: "Cơm trắng kết hợp với gà nướng mật ong thơm ngon, bổ dưỡng",
            ingredients: [
              "300g đùi gà",
              "2 chén cơm trắng",
              "3 thìa mật ong",
              "2 thìa nước tương",
              "1 thìa dầu mè",
              "Tỏi, gừng"
            ],
            instructions: [
              "Ướp gà với mật ong, nước tương, dầu mè",
              "Để ướp 30 phút",
              "Nướng gà trong lò 25 phút ở 200°C",
              "Trở mặt và nướng thêm 15 phút",
              "Thái gà và ăn kèm cơm trắng"
            ],
            nutrition: {
              calories: "450 kcal",
              protein: "35g",
              carbs: "45g",
              fat: "15g"
            }
          },
          {
            id: 4,
            name: "Canh chua cá lóc",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            cookTime: "30 phút",
            servings: "3 người",
            difficulty: "Trung bình",
            description: "Canh chua đậm đà với cá lóc tươi ngon, rau thơm",
            ingredients: [
              "500g cá lóc",
              "200g bầu",
              "100g đậu bắp",
              "Me chua, cà chua",
              "Ngò gai, rau kinh giới"
            ],
            instructions: [
              "Rửa sạch cá, cắt khúc vừa ăn",
              "Nấu nước dùng từ xương cá",
              "Cho me chua, cà chua vào nấu",
              "Thêm bầu, đậu bắp và cá",
              "Nêm nếm vừa ăn, thêm rau thơm"
            ],
            nutrition: {
              calories: "180 kcal",
              protein: "25g",
              carbs: "12g",
              fat: "4g"
            }
          },
          {
            id: 5,
            name: "Rau muống xào tỏi",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            cookTime: "10 phút",
            servings: "2 người",
            difficulty: "Dễ",
            description: "Rau muống xào giòn ngọt với tỏi thơm, bổ sung chất xơ",
            ingredients: [
              "500g rau muống",
              "3 tép tỏi",
              "2 thìa dầu ăn",
              "Muối, nước mắm",
              "Ớt sừng"
            ],
            instructions: [
              "Nhặt rau muống, rửa sạch",
              "Băm nhỏ tỏi và ớt",
              "Đun nóng dầu, phi thơm tỏi",
              "Cho rau muống vào xào nhanh tay",
              "Nêm muối, nước mắm vừa ăn"
            ],
            nutrition: {
              calories: "85 kcal",
              protein: "4g",
              carbs: "8g",
              fat: "4g"
            }
          }
        ]
      },
      dinner: {
        dishes: [
          {
            id: 6,
            name: "Cháo tôm thịt",
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
            cookTime: "40 phút",
            servings: "2 người",
            difficulty: "Trung bình",
            description: "Cháo mềm ngọt với tôm tươi và thịt băm, dễ tiêu hóa",
            ingredients: [
              "1 chén gạo tẻ",
              "200g tôm tươi",
              "150g thịt heo băm",
              "Hành tây, cần tây",
              "Nước mắm, tiêu"
            ],
            instructions: [
              "Vo gạo sạch, nấu cháo",
              "Tôm lột vỏ, thái nhỏ",
              "Ướp thịt băm với gia vị",
              "Cho tôm thịt vào cháo nấu chín",
              "Thêm hành cần, nêm nếm vừa ăn"
            ],
            nutrition: {
              calories: "380 kcal",
              protein: "28g",
              carbs: "40g",
              fat: "10g"
            }
          },
          {
            id: 7,
            name: "Salad trái cây",
            image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
            cookTime: "15 phút",
            servings: "2 người",
            difficulty: "Dễ",
            description: "Salad trái cây tươi mát, giàu vitamin và chất xơ",
            ingredients: [
              "1 quả táo",
              "1 quả lê",
              "100g nho",
              "1 quả cam",
              "2 thìa mật ong",
              "Lá bạc hà"
            ],
            instructions: [
              "Rửa sạch tất cả trái cây",
              "Thái táo, lê thành miếng vừa ăn",
              "Tách múi cam, bóc vỏ nho",
              "Trộn tất cả với mật ong",
              "Trang trí với lá bạc hà"
            ],
            nutrition: {
              calories: "150 kcal",
              protein: "2g",
              carbs: "38g",
              fat: "1g"
            }
          }
        ]
      }
    };

    return mealData[mealType as keyof typeof mealData] || mealData.breakfast;
  };

  const mealDetails = {
    planTitle: "Thực đơn 7 ngày cho bà bầu",
    day: getDayInVietnamese(day || ''),
    mealType: getMealTypeInVietnamese(mealType || ''),
    dishes: getMealData(mealType || 'breakfast').dishes
  };

  return (
    <StandardLayout>
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
              <Badge className="bg-orange-600">{mealDetails.day}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bữa {mealDetails.mealType}
            </h1>
            <p className="text-lg text-gray-600">
              {mealDetails.dishes.length} món ăn được chọn lọc kỹ càng cho bữa {mealDetails.mealType.toLowerCase()}
            </p>
          </div>
        </section>

        {/* Dishes List */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {mealDetails.dishes.map((dish, index) => (
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
                        <div className="flex items-center space-x-3">
                          <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <h2 className="text-2xl font-bold text-gray-900">{dish.name}</h2>
                        </div>
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
    </StandardLayout>
  );
};

export default MealDetailPage;
