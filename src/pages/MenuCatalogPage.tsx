import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddMenuToPlanModal from '@/components/meal-planning/AddMenuToPlanModal';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, Clock, Users, Star, ChefHat, Heart, Eye } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddToPlanModal, setShowAddToPlanModal] = useState(false);
  const [selectedMenuForPlan, setSelectedMenuForPlan] = useState<any>(null);
  const { canAddMenuToPersonalPlan } = useAuth();

  // Set category from URL params
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // Mock data - giống như monngonmoingay.com
  const menuCategories = [
    { id: 'all', name: 'Tất cả', count: 156 },
    { id: 'an-chay', name: 'Ăn chay', count: 24 },
    { id: 'giam-can', name: 'Giảm cân', count: 18 },
    { id: 'gia-dinh', name: 'Gia đình', count: 45 },
    { id: 'tiet-kiem', name: 'Tiết kiệm', count: 32 },
    { id: 'cao-cap', name: 'Cao cấp', count: 15 },
    { id: 'an-sang', name: 'Ăn sáng', count: 28 },
    { id: 'an-trua', name: 'Ăn trưa', count: 38 },
    { id: 'an-toi', name: 'Ăn tối', count: 42 },
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
      calories: 1200,
      cost: 150000,
      rating: 4.8,
      reviews: 124,
      views: 2340,
      recipes: 6,
      tags: ['chay', 'healthy', 'thanh đạm'],
      author: 'Chef Minh',
      createdBy: 'chef_456',
      createdByName: 'Chef Minh',
      isPopular: true,
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
      views: 1890,
      recipes: 21,
      tags: ['giảm cân', 'low-carb', 'healthy'],
      author: 'Chuyên gia dinh dưỡng',
      createdBy: 'expert_123',
      createdByName: 'Chuyên gia dinh dưỡng',
      isPopular: true,
      isFeatured: false
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
      views: 3240,
      recipes: 8,
      tags: ['gia đình', 'cuối tuần', 'đầy đủ'],
      author: 'Chef Lan',
      isPopular: true,
      isFeatured: true
    },
    {
      id: 4,
      title: 'Thực đơn tiết kiệm cho sinh viên',
      description: 'Các món ăn ngon, bổ, rẻ phù hợp với túi tiền sinh viên',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'tiet-kiem',
      difficulty: 'Dễ',
      cookingTime: 30,
      servings: 2,
      calories: 1500,
      cost: 80000,
      rating: 4.4,
      reviews: 67,
      views: 1560,
      recipes: 5,
      tags: ['tiết kiệm', 'sinh viên', 'đơn giản'],
      author: 'Chef Hùng',
      isPopular: false,
      isFeatured: false
    },
    {
      id: 5,
      title: 'Thực đơn hải sản cao cấp',
      description: 'Bữa tiệc hải sản sang trọng cho những dịp đặc biệt',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
      category: 'cao-cap',
      difficulty: 'Khó',
      cookingTime: 120,
      servings: 8,
      calories: 2800,
      cost: 800000,
      rating: 4.7,
      reviews: 43,
      views: 980,
      recipes: 10,
      tags: ['hải sản', 'cao cấp', 'tiệc tùng'],
      author: 'Chef Đức',
      isPopular: false,
      isFeatured: true
    },
    {
      id: 6,
      title: 'Thực đơn ăn sáng năng lượng',
      description: 'Khởi đầu ngày mới với những món ăn sáng bổ dưỡng',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
      category: 'an-sang',
      difficulty: 'Dễ',
      cookingTime: 20,
      servings: 2,
      calories: 600,
      cost: 60000,
      rating: 4.5,
      reviews: 92,
      views: 2100,
      recipes: 4,
      tags: ['ăn sáng', 'năng lượng', 'nhanh gọn'],
      author: 'Chef Mai',
      isPopular: true,
      isFeatured: false
    }
  ];

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedMenus = [...filteredMenus].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'price-low':
        return a.cost - b.cost;
      case 'price-high':
        return b.cost - a.cost;
      default:
        return 0;
    }
  });

  const handleAddToPlan = (menu: any) => {
    if (canAddMenuToPersonalPlan()) {
      setSelectedMenuForPlan(menu);
      setShowAddToPlanModal(true);
    }
  };

  const handleAddToPlanConfirm = (planData: any) => {
    // TODO: Implement add to personal plan
    console.log('Adding menu to personal plan:', planData);
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thư viện thực đơn
          </h1>
          <p className="text-lg text-gray-600">
            Khám phá bộ sưu tập thực đơn đa dạng, từ ăn chay đến cao cấp
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm thực đơn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {menuCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="rating">Đánh giá cao</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {menuCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Hiển thị {sortedMenus.length} thực đơn
          </p>
        </div>

        {/* Menu Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }>
          {sortedMenus.map((menu) => (
            <Card key={menu.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {menu.isFeatured && (
                    <Badge className="bg-orange-500 text-white">Nổi bật</Badge>
                  )}
                  {menu.isPopular && (
                    <Badge className="bg-red-500 text-white">Phổ biến</Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                      {menu.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{menu.calories}</span>
                      <span>cal</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{menu.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">bởi {menu.author}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" asChild>
                      <Link to={`/thuc-don/detail/${menu.id}`}>
                        Xem chi tiết
                      </Link>
                    </Button>
                    {canAddMenuToPersonalPlan() && (
                      <Button
                        variant="outline"
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleAddToPlan(menu)}
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

        {/* Load More */}
        {sortedMenus.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm thực đơn
            </Button>
          </div>
        )}

        {/* No Results */}
        {sortedMenus.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy thực đơn
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* Add to Plan Modal */}
      <AddMenuToPlanModal
        isOpen={showAddToPlanModal}
        onClose={() => setShowAddToPlanModal(false)}
        menu={selectedMenuForPlan}
        onAddToPlan={handleAddToPlanConfirm}
      />
    </div>
  );
};

export default MenuCatalogPage;
