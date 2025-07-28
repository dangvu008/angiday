import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ChefHat, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedMenusSection = () => {
  const featuredMenus = [
    {
      id: 1,
      title: 'Thực đơn ăn chay thanh đạm',
      description: 'Bộ sưu tập các món ăn chay bổ dưỡng, thanh đạm cho sức khỏe',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      category: 'an-chay',
      difficulty: 'Dễ',
      cookingTime: 45,
      servings: 4,
      calories: 1200,
      cost: 150000,
      rating: 4.8,
      reviews: 124,
      recipes: 6,
      tags: ['chay', 'healthy', 'thanh đạm'],
      author: 'Chef Minh',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Thực đơn giảm cân 7 ngày',
      description: 'Kế hoạch ăn uống khoa học giúp giảm cân hiệu quả trong 1 tuần',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      category: 'giam-can',
      difficulty: 'Trung bình',
      cookingTime: 60,
      servings: 1,
      calories: 1000,
      cost: 200000,
      rating: 4.6,
      reviews: 89,
      recipes: 21,
      tags: ['giảm cân', 'low-carb', 'healthy'],
      author: 'Chuyên gia dinh dưỡng',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Thực đơn gia đình cuối tuần',
      description: 'Những món ăn ngon, đầy đủ dinh dưỡng cho bữa cơm gia đình',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      category: 'gia-dinh',
      difficulty: 'Trung bình',
      cookingTime: 90,
      servings: 6,
      calories: 2200,
      cost: 350000,
      rating: 4.9,
      reviews: 156,
      recipes: 8,
      tags: ['gia đình', 'cuối tuần', 'đầy đủ'],
      author: 'Chef Lan',
      isFeatured: true
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Thực đơn nổi bật
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những thực đơn được yêu thích nhất, từ ăn chay đến gia đình
          </p>
        </div>

        {/* Featured Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredMenus.map((menu) => (
            <Card key={menu.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="relative">
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 text-white">Nổi bật</Badge>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                      {menu.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {menu.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(menu.difficulty)}>
                      {menu.difficulty}
                    </Badge>
                    <Badge variant="outline">{menu.recipes} món</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{menu.cookingTime} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{menu.servings} người</span>
                    </div>
                    <div>
                      <span className="font-medium">{menu.calories}</span>
                      <span className="text-gray-500"> cal</span>
                    </div>
                    <div>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(menu.cost)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{menu.rating}</span>
                        <span className="text-sm text-gray-500">({menu.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">bởi {menu.author}</p>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" 
                    asChild
                  >
                    <Link to={`/thuc-don/detail/${menu.id}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Khám phá thêm nhiều thực đơn hấp dẫn
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Từ thực đơn ăn chay thanh đạm đến những bữa tiệc cao cấp, 
              chúng tôi có đầy đủ các loại thực đơn phù hợp với mọi nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                asChild
              >
                <Link to="/thuc-don">
                  Xem tất cả thực đơn
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link to="/menu-system-demo">
                  Tìm hiểu cách hoạt động
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Danh mục thực đơn phổ biến
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ăn chay', icon: '🥗', count: 24, category: 'an-chay' },
              { name: 'Giảm cân', icon: '🏃‍♀️', count: 18, category: 'giam-can' },
              { name: 'Gia đình', icon: '👨‍👩‍👧‍👦', count: 45, category: 'gia-dinh' },
              { name: 'Tiết kiệm', icon: '💰', count: 32, category: 'tiet-kiem' }
            ].map((category) => (
              <Link
                key={category.category}
                to={`/thuc-don/category/${category.category}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {category.count} thực đơn
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenusSection;
