import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StandardLayout from '@/components/layout/StandardLayout';
import AddMenuToPlanModal from '@/components/meal-planning/AddMenuToPlanModal';
import { useAuth } from '@/hooks/useAuth';
import { Search, Clock, Users, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MenuCatalogPage = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showAddToPlanModal, setShowAddToPlanModal] = useState(false);
  const [selectedMenuForPlan, setSelectedMenuForPlan] = useState<any>(null);
  const { canAddMenuToPersonalPlan } = useAuth();

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const menuCategories = [
    { id: 'all', name: 'Tất cả', count: 156 },
    { id: 'an-chay', name: 'Ăn chay', count: 24 },
    { id: 'giam-can', name: 'Giảm cân', count: 18 },
    { id: 'gia-dinh', name: 'Gia đình', count: 45 },
    { id: 'tiet-kiem', name: 'Tiết kiệm', count: 32 },
    { id: 'cao-cap', name: 'Cao cấp', count: 15 },
  ];

  const menus = [
    {
      id: 1,
      title: 'Thực đơn ăn chay thanh đạm',
      description: 'Bộ sưu tập các món ăn chay bổ dưỡng, thanh đạm cho sức khỏe',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      category: 'an-chay',
      difficulty: 'Dễ',
      cookingTime: 45,
      servings: 4,
      cost: 150000,
      rating: 4.8,
      reviews: 124,
      views: 2340,
      tags: ['Healthy', 'Vegetarian', 'Low-fat'],
      author: 'Chef Mai',
      isPublic: true,
      totalCalories: 1200,
      recipes: []
    },
    {
      id: 2,
      title: 'Thực đơn gia đình cuối tuần',
      description: 'Những món ăn ngon, dễ làm cho bữa ăn gia đình ấm cúng',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      category: 'gia-dinh',
      difficulty: 'Trung bình',
      cookingTime: 90,
      servings: 6,
      cost: 280000,
      rating: 4.6,
      reviews: 89,
      views: 1890,
      tags: ['Family', 'Weekend', 'Traditional'],
      author: 'Chef Hương',
      isPublic: true,
      totalCalories: 1800,
      recipes: []
    }
  ];

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToPlan = (menu: any) => {
    setSelectedMenuForPlan(menu);
    setShowAddToPlanModal(true);
  };

  const handleAddToPlanConfirm = (planData: any) => {
    console.log('Adding menu to plan:', planData);
    setShowAddToPlanModal(false);
    setSelectedMenuForPlan(null);
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
    <StandardLayout
      className="bg-gray-50"
      containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thư viện thực đơn
        </h1>
        <p className="text-lg text-gray-600">
          Khám phá bộ sưu tập thực đơn đa dạng, từ ăn chay đến cao cấp
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm thực đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {menuCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="cost-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="cost-high">Giá cao đến thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {menuCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="text-sm"
            >
              {cat.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Hiển thị {filteredMenus.length} thực đơn
          {selectedCategory !== 'all' && (
            <span> trong danh mục "{menuCategories.find(c => c.id === selectedCategory)?.name}"</span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMenus.map((menu) => (
          <Card key={menu.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={menu.image}
                alt={menu.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  <Link to={`/menu/${menu.id}`}>
                    {menu.title}
                  </Link>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {menu.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={getDifficultyColor(menu.difficulty)}>
                  {menu.difficulty}
                </Badge>
                {menu.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {menu.cookingTime} phút
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {menu.servings} người
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {menu.rating} ({menu.reviews})
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {menu.views}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-orange-600">
                  {menu.cost.toLocaleString('vi-VN')}₫
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/menu/${menu.id}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                  {canAddMenuToPersonalPlan && (
                    <Button 
                      size="sm"
                      onClick={() => handleAddToPlan(menu)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Thêm vào kế hoạch
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddMenuToPlanModal
        isOpen={showAddToPlanModal}
        onClose={() => setShowAddToPlanModal(false)}
        menu={selectedMenuForPlan}
        onAddToPlan={handleAddToPlanConfirm}
      />
    </StandardLayout>
  );
};

export default MenuCatalogPage;
