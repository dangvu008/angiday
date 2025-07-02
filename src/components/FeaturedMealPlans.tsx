import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedMealPlans = () => {
  const navigate = useNavigate();

  const featuredPlans = [
    {
      id: 1,
      title: "Thực đơn 7 ngày cho bà bầu",
      description: "Dinh dưỡng đầy đủ, an toàn cho mẹ và bé",
      image: "/placeholder.svg",
      duration: "7 ngày",
      meals: 21,
      difficulty: "Dễ làm",
      popular: true
    },
    {
      id: 2,
      title: "Bữa tiệc sinh nhật gia đình",
      description: "Thực đơn hoàn chỉnh cho 8-10 người",
      image: "/placeholder.svg",
      duration: "1 ngày",
      meals: 8,
      difficulty: "Trung bình",
      popular: false
    },
    {
      id: 3,
      title: "Bữa trưa 100k cho cả nhà",
      description: "Tiết kiệm mà vẫn đủ dinh dưỡng",
      image: "/placeholder.svg",
      duration: "5 ngày",
      meals: 15,
      difficulty: "Dễ làm",
      popular: true
    },
    {
      id: 4,
      title: "Thực đơn chay thanh đạm",
      description: "Healthy và dễ tiêu hóa",
      image: "/placeholder.svg",
      duration: "7 ngày",
      meals: 21,
      difficulty: "Dễ làm",
      popular: false
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thực đơn mẫu <span className="text-orange-600">nổi bật</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những thực đơn được thiết kế kỹ lưỡng để giải quyết các nhu cầu cụ thể của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlans.map((plan) => (
            <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              {plan.popular && (
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Phổ biến
                </div>
              )}
              
              <CardHeader className="p-0">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                  <img 
                    src={plan.image} 
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {plan.title}
                </CardTitle>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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

              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    navigate(`/meal-plans/${plan.id}`);
                  }}
                >
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
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

export default FeaturedMealPlans;
