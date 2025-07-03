import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, Users, Star, ChefHat, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedMealPlansGrid = () => {
  const navigate = useNavigate();

  const featuredPlan = {
    id: 1,
    title: "Thực đơn 7 ngày cho bà bầu",
    description: "Dinh dưỡng đầy đủ, an toàn cho mẹ và bé với các món ăn được chọn lọc kỹ càng. Cung cấp đủ chất dinh dưỡng cần thiết cho cả mẹ và thai nhi trong suốt thai kỳ.",
    image: "/placeholder.svg",
    duration: "7 ngày",
    meals: 21,
    difficulty: "Dễ làm",
    rating: 4.9,
    reviews: 234,
    price: "Miễn phí",
    highlights: ["Giàu axit folic", "Đủ canxi", "Ít đường", "Dễ tiêu hóa"]
  };

  const otherPlans = [
    {
      id: 2,
      title: "Bữa tiệc sinh nhật gia đình",
      description: "Thực đơn hoàn chỉnh cho 8-10 người",
      image: "/placeholder.svg",
      duration: "1 ngày",
      meals: 8,
      difficulty: "Trung bình",
      rating: 4.6,
      price: "200k"
    },
    {
      id: 3,
      title: "Bữa trưa 100k cho cả nhà",
      description: "Tiết kiệm mà vẫn đủ dinh dưỡng",
      image: "/placeholder.svg",
      duration: "5 ngày",
      meals: 15,
      difficulty: "Dễ làm",
      rating: 4.7,
      price: "100k"
    },
    {
      id: 4,
      title: "Thực đơn chay thanh đạm",
      description: "Healthy và dễ tiêu hóa",
      image: "/placeholder.svg",
      duration: "7 ngày",
      meals: 21,
      difficulty: "Dễ làm",
      rating: 4.5,
      price: "150k"
    },
    {
      id: 5,
      title: "Thực đơn Tết truyền thống",
      description: "Những món ăn không thể thiếu trong ngày Tết",
      image: "/placeholder.svg",
      duration: "3 ngày",
      meals: 12,
      difficulty: "Khó",
      rating: 4.8,
      price: "300k"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thực đơn mẫu <span className="text-orange-600">nổi bật</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những thực đơn được thiết kế kỹ lưỡng để giải quyết các nhu cầu cụ thể của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Plan - Left Side */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white overflow-hidden cursor-pointer h-full"
                  onClick={() => navigate(`/meal-plans/${featuredPlan.id}`)}>
              <CardHeader className="p-0">
                <div className="aspect-[16/10] bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                  <img 
                    src={featuredPlan.image} 
                    alt={featuredPlan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Nổi bật nhất
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-800">
                      {featuredPlan.price}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-orange-300 transition-colors">
                      {featuredPlan.title}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {featuredPlan.duration}
                      </span>
                      <span className="flex items-center">
                        <Utensils className="h-4 w-4 mr-1" />
                        {featuredPlan.meals} món
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        {featuredPlan.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {featuredPlan.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Điểm nổi bật:</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredPlan.highlights.map((highlight, index) => (
                      <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/meal-plans/${featuredPlan.id}`);
                  }}
                >
                  Xem chi tiết thực đơn
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Plans - Right Side Grid */}
          <div className="space-y-6">
            {otherPlans.map((plan) => (
              <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/meal-plans/${plan.id}`)}>
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                      <img 
                        src={plan.image} 
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {plan.price}
                      </span>
                      <div className="flex items-center text-xs text-orange-500">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {plan.rating}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {plan.duration}
                      </span>
                      <span>{plan.meals} món</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate('/meal-plans')}
          >
            Xem tất cả thực đơn
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMealPlansGrid;
