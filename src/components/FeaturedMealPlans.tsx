import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar, Clock, Users, Star, ChefHat, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedMealPlans = () => {
  const navigate = useNavigate();

  const featuredPlan = {
    id: 1,
    title: "Thực đơn 7 ngày cho bà bầu",
    description: "Dinh dưỡng đầy đủ, an toàn cho mẹ và bé với các món ăn được chọn lọc kỹ càng",
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

        {/* Featured Plan - Hero Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 to-green-200 relative overflow-hidden">
                  <img 
                    src={featuredPlan.image} 
                    alt={featuredPlan.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Nổi bật nhất
                    </span>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-800">
                      {featuredPlan.price}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-orange-500 mr-4">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-semibold">{featuredPlan.rating}</span>
                    <span className="ml-1 text-gray-500 text-sm">({featuredPlan.reviews} đánh giá)</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPlan.difficulty}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPlan.title}
                </h3>
                
                <p className="text-gray-600 text-lg mb-6">
                  {featuredPlan.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    <span>{featuredPlan.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Utensils className="h-5 w-5 mr-2 text-orange-500" />
                    <span>{featuredPlan.meals} món</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Cả gia đình</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Chuyên gia</span>
                  </div>
                </div>
                
                <div className="mb-8">
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
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
                  onClick={() => navigate(`/meal-plans/${featuredPlan.id}`)}
                >
                  Xem chi tiết thực đơn
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Plans Carousel */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Thực đơn khác</h3>
            <Button 
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={() => navigate('/meal-plans')}
            >
              Xem tất cả
            </Button>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {otherPlans.map((plan) => (
                <CarouselItem key={plan.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                        <img 
                          src={plan.image} 
                          alt={plan.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1 text-orange-500" />
                            {plan.rating}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {plan.price}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {plan.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {plan.duration}
                        </span>
                        <span>{plan.meals} món</span>
                      </div>
                      
                      <div className="text-xs text-green-600 font-medium">
                        {plan.difficulty}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => navigate(`/meal-plans/${plan.id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMealPlans;
