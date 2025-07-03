import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    highlights: ["Giàu axit folic", "Đủ canxi", "Ít đường", "Dễ tiêu hóa"],
    type: "week", // week type
    category: "Thực đơn tuần"
  };

  const mealPlansByType = {
    single: [
      {
        id: 2,
        title: "Bữa sáng dinh dưỡng",
        description: "Bữa sáng đầy đủ chất dinh dưỡng",
        image: "/placeholder.svg",
        duration: "30 phút",
        meals: 1,
        difficulty: "Dễ làm",
        rating: 4.6,
        price: "50k",
        type: "single",
        category: "Thực đơn lẻ"
      },
      {
        id: 3,
        title: "Bữa trưa văn phòng",
        description: "Bữa trưa nhanh gọn cho dân văn phòng",
        image: "/placeholder.svg",
        duration: "45 phút",
        meals: 1,
        difficulty: "Dễ làm",
        rating: 4.5,
        price: "80k",
        type: "single",
        category: "Thực đơn lẻ"
      }
    ],
    daily: [
      {
        id: 4,
        title: "Thực đơn 1 ngày gia đình",
        description: "3 bữa đầy đủ cho cả gia đình",
        image: "/placeholder.svg",
        duration: "1 ngày",
        meals: 3,
        difficulty: "Trung bình",
        rating: 4.7,
        price: "200k",
        type: "daily",
        category: "Thực đơn ngày"
      },
      {
        id: 5,
        title: "Ngày ăn chay thanh đạm",
        description: "Thực đơn chay 1 ngày đầy đủ dinh dưỡng",
        image: "/placeholder.svg",
        duration: "1 ngày",
        meals: 3,
        difficulty: "Dễ làm",
        rating: 4.4,
        price: "120k",
        type: "daily",
        category: "Thực đơn ngày"
      }
    ],
    weekly: [
      {
        id: 6,
        title: "Thực đơn giảm cân 7 ngày",
        description: "Kế hoạch giảm cân hiệu quả trong 1 tuần",
        image: "/placeholder.svg",
        duration: "7 ngày",
        meals: 21,
        difficulty: "Trung bình",
        rating: 4.8,
        price: "500k",
        type: "week",
        category: "Thực đơn tuần"
      }
    ],
    monthly: [
      {
        id: 7,
        title: "Thực đơn Keto 30 ngày",
        description: "Chế độ ăn Keto hoàn chỉnh 1 tháng",
        image: "/placeholder.svg",
        duration: "30 ngày",
        meals: 90,
        difficulty: "Khó",
        rating: 4.6,
        price: "2M",
        type: "month",
        category: "Thực đơn tháng"
      }
    ]
  };

  const categories = [
    { key: 'all', label: 'Tất cả', color: 'bg-gray-600' },
    { key: 'single', label: 'Thực đơn lẻ', color: 'bg-blue-600' },
    { key: 'daily', label: 'Thực đơn ngày', color: 'bg-green-600' },
    { key: 'weekly', label: 'Thực đơn tuần', color: 'bg-orange-600' },
    { key: 'monthly', label: 'Thực đơn tháng', color: 'bg-purple-600' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thực đơn mẫu <span className="text-orange-600">nổi bật</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những thực đơn được phân loại theo từng bữa ăn, ngày, tuần và tháng để phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Badge 
              key={category.key}
              className={`${category.color} text-white cursor-pointer hover:opacity-80 px-6 py-2 text-sm font-medium`}
            >
              {category.label}
            </Badge>
          ))}
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
                  <div className="absolute bottom-6 left-6">
                    <Badge className="bg-orange-600 text-white mb-2">
                      {featuredPlan.category}
                    </Badge>
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

          {/* Other Plans by Category - Right Side Grid */}
          <div className="space-y-8">
            {/* Thực đơn lẻ */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                Thực đơn lẻ
              </h3>
              <div className="space-y-3">
                {mealPlansByType.single.map((plan) => (
                  <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/meal-plans/${plan.id}`)}>
                    <div className="flex">
                      <div className="w-20 h-20 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                          <img 
                            src={plan.image} 
                            alt={plan.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {plan.price}
                          </Badge>
                          <div className="flex items-center text-xs text-orange-500">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {plan.rating}
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {plan.title}
                        </h4>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                          {plan.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
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

            {/* Thực đơn ngày */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                Thực đơn ngày
              </h3>
              <div className="space-y-3">
                {mealPlansByType.daily.map((plan) => (
                  <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/meal-plans/${plan.id}`)}>
                    <div className="flex">
                      <div className="w-20 h-20 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                          <img 
                            src={plan.image} 
                            alt={plan.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {plan.price}
                          </Badge>
                          <div className="flex items-center text-xs text-orange-500">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {plan.rating}
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
                          {plan.title}
                        </h4>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
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

            {/* Thực đơn tháng */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                Thực đơn tháng
              </h3>
              <div className="space-y-3">
                {mealPlansByType.monthly.map((plan) => (
                  <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/meal-plans/${plan.id}`)}>
                    <div className="flex">
                      <div className="w-20 h-20 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 relative overflow-hidden">
                          <img 
                            src={plan.image} 
                            alt={plan.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            {plan.price}
                          </Badge>
                          <div className="flex items-center text-xs text-orange-500">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {plan.rating}
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {plan.title}
                        </h4>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
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
