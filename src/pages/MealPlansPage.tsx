import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MealPlansPage = () => {
  const navigate = useNavigate();

  const mealPlans = [
    {
      id: 1,
      title: "Thực đơn 7 ngày chay thanh đạm",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      duration: "7 ngày",
      servings: "2-3 người",
      budget: "500K/tuần",
      difficulty: "Dễ",
      tags: ["Chay", "Thanh đạm", "Giảm cân"],
      description: "Thực đơn chay đầy đủ dinh dưỡng, giúp thanh lọc cơ thể và duy trì sức khỏe tốt",
      meals: 21,
      rating: 4.7
    },
    {
      id: 2,
      title: "Bữa tiệc sinh nhật gia đình",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      duration: "1 ngày",
      servings: "8-10 người",
      budget: "1.2M",
      difficulty: "Trung bình",
      tags: ["Tiệc", "Gia đình", "Đặc biệt"],
      description: "Thực đơn tiệc sinh nhật đầy đủ từ khai vị đến tráng miệng, tạo không khí vui vẻ cho cả gia đình",
      meals: 8,
      rating: 4.9
    },
    {
      id: 3,
      title: "Bữa trưa dinh dưỡng với 100K",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      duration: "5 ngày",
      servings: "4 người",
      budget: "100K/ngày",
      difficulty: "Dễ",
      tags: ["Tiết kiệm", "Dinh dưỡng", "Nhanh gọn"],
      description: "Thực đơn bữa trưa kinh tế nhưng đầy đủ dinh dưỡng cho cả gia đình",
      meals: 5,
      rating: 4.5
    },
    {
      id: 4,
      title: "Thực đơn dinh dưỡng cho bà bầu",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      duration: "14 ngày",
      servings: "1-2 người",
      budget: "800K/tuần",
      difficulty: "Trung bình",
      tags: ["Bà bầu", "Dinh dưỡng", "Sức khỏe"],
      description: "Thực đơn được thiết kế đặc biệt cho mẹ bầu, bổ sung đầy đủ các chất dinh dưỡng cần thiết",
      meals: 42,
      rating: 4.8
    },
    {
      id: 5,
      title: "Thực đơn Keto 30 ngày",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
      duration: "30 ngày",
      servings: "1 người",
      budget: "1M/tuần",
      difficulty: "Khó",
      tags: ["Keto", "Giảm cân", "Low-carb"],
      description: "Thực đơn Keto hoàn chỉnh 30 ngày giúp giảm cân hiệu quả và cải thiện sức khỏe",
      meals: 90,
      rating: 4.6
    },
    {
      id: 6,
      title: "Ăn dặm cho bé 6-12 tháng",
      image: "https://images.unsplash.com/photo-1609501676725-7186f1aa9583?w=400&h=300&fit=crop",
      duration: "21 ngày",
      servings: "1 bé",
      budget: "300K/tuần",
      difficulty: "Trung bình",
      tags: ["Ăn dặm", "Trẻ em", "Dinh dưỡng"],
      description: "Thực đơn ăn dặm an toàn và dinh dưỡng cho bé từ 6-12 tháng tuổi",
      meals: 63,
      rating: 4.9
    }
  ];

  const categories = ["Tất cả", "Giảm cân", "Gia đình", "Tiết kiệm", "Đặc biệt", "Sức khỏe"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thực đơn mẫu
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Các thực đơn được thiết kế sẵn cho từng mục đích cụ thể, giúp bạn tiết kiệm thời gian lập kế hoạch
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 px-4 border-b bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={category === "Tất cả" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-600 hover:text-white px-4 py-2"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Meal Plans Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/meal-plans/${plan.id}`)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={plan.image} 
                      alt={plan.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        ⭐ {plan.rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-blue-600 text-white">
                        {plan.meals} món
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 hover:text-orange-600 transition-colors">
                      {plan.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{plan.servings}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{plan.budget}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{plan.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {plan.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/meal-plans/${plan.id}`);
                      }}
                    >
                      Sử dụng thực đơn
                    </Button>
                  </CardContent>
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

export default MealPlansPage;
