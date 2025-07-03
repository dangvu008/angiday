
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Heart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MealPlansPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mealPlans = [
    // Thực đơn lẻ (từng bữa)
    {
      id: 1,
      title: "Bữa sáng dinh dưỡng với trứng",
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop",
      duration: "30 phút",
      servings: "1 bữa ăn",
      budget: "50K",
      difficulty: "Dễ",
      type: "single",
      category: "Thực đơn lẻ",
      tags: ["Bữa sáng", "Protein", "Nhanh"],
      description: "Bữa sáng đầy đủ protein và vitamin để bắt đầu ngày mới",
      meals: 1,
      rating: 4.5
    },
    {
      id: 2,
      title: "Bữa trưa văn phòng tiện lợi",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      duration: "45 phút",
      servings: "1 bữa ăn",
      budget: "80K",
      difficulty: "Dễ",
      type: "single",
      category: "Thực đơn lẻ",
      tags: ["Bữa trưa", "Văn phòng", "Tiện lợi"],
      description: "Bữa trưa nhanh gọn phù hợp cho dân văn phòng bận rộn",
      meals: 1,
      rating: 4.3
    },
    {
      id: 3,
      title: "Bữa tối lãng mạn cho 2 người",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      duration: "1.5 giờ",
      servings: "1 bữa ăn",
      budget: "300K",
      difficulty: "Trung bình",
      type: "single",
      category: "Thực đơn lẻ",
      tags: ["Bữa tối", "Lãng mạn", "Cao cấp"],
      description: "Bữa tối đặc biệt cho những dịp kỷ niệm quan trọng",
      meals: 1,
      rating: 4.8
    },
    // Thực đơn ngày
    {
      id: 4,
      title: "Thực đơn 1 ngày gia đình hạnh phúc",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      duration: "1 ngày",
      servings: "4 người",
      budget: "200K/ngày",
      difficulty: "Trung bình",
      type: "daily",
      category: "Thực đơn ngày",
      tags: ["Gia đình", "Cân bằng", "Tiết kiệm"],
      description: "3 bữa ăn đầy đủ dinh dưỡng cho cả gia đình trong một ngày",
      meals: 3,
      rating: 4.6
    },
    {
      id: 5,
      title: "Ngày ăn chay thanh đạm",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      duration: "1 ngày",
      servings: "2-3 người",
      budget: "120K/ngày",
      difficulty: "Dễ",
      type: "daily",
      category: "Thực đơn ngày",
      tags: ["Chay", "Thanh đạm", "Healthy"],
      description: "Thực đơn chay đầy đủ dinh dưỡng cho 1 ngày",
      meals: 3,
      rating: 4.4
    },
    // Thực đơn tuần
    {
      id: 6,
      title: "Thực đơn 7 ngày cho bà bầu",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      duration: "7 ngày",
      servings: "1-2 người",
      budget: "800K/tuần",
      difficulty: "Trung bình",
      type: "weekly",
      category: "Thực đơn tuần",
      tags: ["Bà bầu", "Dinh dưỡng", "Sức khỏe"],
      description: "Thực đơn được thiết kế đặc biệt cho mẹ bầu, bổ sung đầy đủ các chất dinh dưỡng cần thiết",
      meals: 21,
      rating: 4.8
    },
    {
      id: 7,
      title: "Thực đơn giảm cân hiệu quả 7 ngày",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
      duration: "7 ngày",
      servings: "1 người",
      budget: "500K/tuần",
      difficulty: "Trung bình",
      type: "weekly",
      category: "Thực đơn tuần",
      tags: ["Giảm cân", "Low-carb", "Healthy"],
      description: "Thực đơn giảm cân khoa học và hiệu quả trong 7 ngày",
      meals: 21,
      rating: 4.7
    },
    {
      id: 8,
      title: "Tuần lễ tiệc tùng và ăn mừng",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      duration: "7 ngày",
      servings: "8-10 người",
      budget: "2M/tuần",
      difficulty: "Khó",
      type: "weekly",
      category: "Thực đơn tuần",
      tags: ["Tiệc", "Đặc biệt", "Cao cấp"],
      description: "Thực đơn đặc biệt cho những tuần lễ có nhiều sự kiện",
      meals: 21,
      rating: 4.9
    },
    // Thực đơn tháng
    {
      id: 9,
      title: "Thực đơn Keto 30 ngày",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
      duration: "30 ngày",
      servings: "1 người",
      budget: "3M/tháng",
      difficulty: "Khó",
      type: "monthly",
      category: "Thực đơn tháng",
      tags: ["Keto", "Giảm cân", "Low-carb"],
      description: "Thực đơn Keto hoàn chỉnh 30 ngày giúp giảm cân hiệu quả và cải thiện sức khỏe",
      meals: 90,
      rating: 4.6
    },
    {
      id: 10,
      title: "Thực đơn ăn dặm cho bé 1 tháng",
      image: "https://images.unsplash.com/photo-1609501676725-7186f1aa9583?w=400&h=300&fit=crop",
      duration: "30 ngày",
      servings: "1 bé",
      budget: "1.2M/tháng",
      difficulty: "Trung bình",
      type: "monthly",
      category: "Thực đơn tháng",
      tags: ["Ăn dặm", "Trẻ em", "Dinh dưỡng"],
      description: "Thực đơn ăn dặm an toàn và dinh dưỡng cho bé từ 6-12 tháng tuổi",
      meals: 90,
      rating: 4.9
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả', color: 'bg-gray-600' },
    { key: 'single', label: 'Thực đơn lẻ', color: 'bg-blue-600' },
    { key: 'daily', label: 'Thực đơn ngày', color: 'bg-green-600' },
    { key: 'weekly', label: 'Thực đơn tuần', color: 'bg-orange-600' },
    { key: 'monthly', label: 'Thực đơn tháng', color: 'bg-purple-600' }
  ];

  const filteredMealPlans = selectedCategory === 'all' 
    ? mealPlans 
    : mealPlans.filter(plan => plan.type === selectedCategory);

  const getCategoryIcon = (type: string) => {
    switch(type) {
      case 'single': return '🍽️';
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '🗓️';
      default: return '🍳';
    }
  };

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
              Các thực đơn được phân loại theo từng bữa ăn, ngày, tuần và tháng để phù hợp với nhu cầu của bạn
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 px-4 border-b bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge 
                  key={category.key} 
                  className={`cursor-pointer px-6 py-3 text-sm font-medium transition-all ${
                    selectedCategory === category.key 
                      ? `${category.color} text-white` 
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {getCategoryIcon(category.key)} {category.label}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Meal Plans Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'Tất cả thực đơn' : 
                 categories.find(cat => cat.key === selectedCategory)?.label}
              </h2>
              <p className="text-gray-600 mt-2">
                Tìm thấy {filteredMealPlans.length} thực đơn phù hợp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMealPlans.map((plan) => (
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
                    <div className="absolute top-2 left-2">
                      <Badge className={`text-white ${
                        plan.type === 'single' ? 'bg-blue-600' :
                        plan.type === 'daily' ? 'bg-green-600' :
                        plan.type === 'weekly' ? 'bg-orange-600' :
                        'bg-purple-600'
                      }`}>
                        {getCategoryIcon(plan.type)} {plan.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/70 text-white">
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
