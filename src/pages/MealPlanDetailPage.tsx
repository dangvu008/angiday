import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import StandardLayout from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Heart, Clock, ChefHat } from 'lucide-react';

const MealPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock authentication check - in real app this would come from auth context
  const isLoggedIn = false; // This would come from your auth state

  const handleApplyMealPlan = () => {
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }
    
    // Handle meal plan application logic here
    console.log('Applying meal plan...');
    // You can add toast notification or other feedback here
  };

  const mealPlan = {
    id: parseInt(id || '1'),
    title: "Thực đơn 7 ngày cho bà bầu",
    description: "Thực đơn được thiết kế đặc biệt cho mẹ bầu, bổ sung đầy đủ các chất dinh dưỡng cần thiết cho sự phát triển của bé và sức khỏe của mẹ. Mỗi bữa ăn đều được cân bằng dinh dưỡng và dễ tiêu hóa.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    duration: "7 ngày",
    servings: "1-2 người",
    budget: "800K/tuần",
    difficulty: "Trung bình",
    rating: 4.8,
    meals: 21,
    tags: ["Bà bầu", "Dinh dưỡng", "Sức khỏe"],
    author: "Chuyên gia dinh dưỡng Nguyễn Thị Mai",
    totalTime: "45 phút/ngày",
    benefits: [
      "Cung cấp đầy đủ acid folic cần thiết",
      "Bổ sung canxi cho xương răng chắc khỏe",
      "Giàu sắt ngăn ngừa thiếu máu",
      "Dễ tiêu hóa, không gây buồn nôn"
    ],
    weeklyPlan: [
      {
        day: "Thứ 2",
        breakfast: "Cháo yến mạch chuối",
        lunch: "Cơm gạo lứt + Canh chua cá + Rau muống xào tỏi",
        dinner: "Miến gà + Salad bơ cà chua"
      },
      {
        day: "Thứ 3", 
        breakfast: "Bánh mì nguyên cám + Sữa chua",
        lunch: "Cơm + Thịt bò xào bông cải + Canh rau ngót",
        dinner: "Phở gà + Chè đậu xanh"
      },
      {
        day: "Thứ 4",
        breakfast: "Smoothie xoài chuối + Bánh quy yến mạch",
        lunch: "Cơm + Cá hồi nướng + Súp bí đỏ",
        dinner: "Bún thịt nướng + Nước ép cam"
      },
      {
        day: "Thứ 5",
        breakfast: "Cháo tôm rau củ",
        lunch: "Cơm + Gà hấp lá chanh + Canh khổ qua",
        dinner: "Mì Ý sốt cà chua + Salad rau trộn"
      },
      {
        day: "Thứ 6",
        breakfast: "Bánh flan + Sữa tươi",
        lunch: "Cơm + Thịt heo luộc + Canh cải thảo",
        dinner: "Cháo cá chép + Rau luộc chấm nước mắm"
      },
      {
        day: "Thứ 7",
        breakfast: "Chè đậu đen + Bánh mì sandwich",
        lunch: "Cơm + Tôm rang me + Canh bí đao",
        dinner: "Bánh canh cua + Chả cá"
      },
      {
        day: "Chủ nhật",
        breakfast: "Pancake chuối + Mật ong",
        lunch: "Cơm + Sườn non kho + Rau lang luộc",
        dinner: "Lẩu cá + Bánh tráng nướng"
      }
    ]
  };

  const getDayParam = (day: string) => {
    const dayMap: { [key: string]: string } = {
      "Thứ 2": "monday",
      "Thứ 3": "tuesday", 
      "Thứ 4": "wednesday",
      "Thứ 5": "thursday",
      "Thứ 6": "friday",
      "Thứ 7": "saturday",
      "Chủ nhật": "sunday"
    };
    return dayMap[day] || day;
  };

  const handleMealClick = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    navigate(`/meal-plans/${id}/${getDayParam(day)}/${mealType}`);
  };

  return (
    <StandardLayout>
        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden">
            <img 
              src={mealPlan.image} 
              alt={mealPlan.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="max-w-6xl mx-auto p-6 text-white w-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mealPlan.tags.map((tag) => (
                    <Badge key={tag} className="bg-orange-600 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {mealPlan.title}
                </h1>
                <p className="text-lg md:text-xl max-w-3xl opacity-90">
                  {mealPlan.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian</p>
                  <p className="font-semibold">{mealPlan.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Phục vụ</p>
                  <p className="font-semibold">{mealPlan.servings}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngân sách</p>
                  <p className="font-semibold">{mealPlan.budget}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Độ khó</p>
                  <p className="font-semibold">{mealPlan.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Số món</p>
                  <p className="font-semibold">{mealPlan.meals} món</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian nấu</p>
                  <p className="font-semibold">{mealPlan.totalTime}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Weekly Plan */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kế hoạch 7 ngày</h2>
              <div className="space-y-4">
                {mealPlan.weeklyPlan.map((day, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-lg font-semibold text-orange-800">
                        {day.day}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">🌅 Sáng</h4>
                          <p 
                            className="text-gray-600 hover:text-orange-600 cursor-pointer hover:underline"
                            onClick={() => handleMealClick(day.day, 'breakfast')}
                          >
                            {day.breakfast}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">☀️ Trưa</h4>
                          <p 
                            className="text-gray-600 hover:text-orange-600 cursor-pointer hover:underline"
                            onClick={() => handleMealClick(day.day, 'lunch')}
                          >
                            {day.lunch}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">🌙 Tối</h4>
                          <p 
                            className="text-gray-600 hover:text-orange-600 cursor-pointer hover:underline"
                            onClick={() => handleMealClick(day.day, 'dinner')}
                          >
                            {day.dinner}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Benefits & Actions */}
            <div className="space-y-6">
              {/* Rating & Author */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <span className="text-2xl font-bold text-orange-600">⭐ {mealPlan.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">Được tạo bởi</p>
                    <p className="font-semibold">{mealPlan.author}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Lợi ích</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mealPlan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  onClick={handleApplyMealPlan}
                >
                  Áp dụng thực đơn này
                </Button>
                <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-12">
                  Tải xuống PDF
                </Button>
                <Button variant="outline" className="w-full h-12">
                  Chia sẻ thực đơn
                </Button>
              </div>
            </div>
          </div>
        </section>
    </StandardLayout>
  );
};

export default MealPlanDetailPage;
