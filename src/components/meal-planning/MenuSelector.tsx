import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users, ChefHat, Star } from 'lucide-react';
import { Menu } from '@/types/meal-planning';

interface MenuSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: (menu: Menu) => void;
  selectedDate?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const MenuSelector = ({ isOpen, onClose, onSelectMenu, selectedDate, mealType }: MenuSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock menus data - in real app this would come from API
  const [menus] = useState<Menu[]>([
    {
      id: '1',
      name: 'Thực đơn ăn chay',
      description: 'Tập hợp các món ăn chay bổ dưỡng và ngon miệng',
      type: 'full_day',
      recipes: [
        {
          id: 'recipe-1',
          title: 'Phở chay nấm hương',
          description: 'Phở chay thơm ngon với nấm hương và rau củ',
          category: 'Ăn chay',
          difficulty: 'Trung bình',
          cookingTime: '45 phút',
          servings: 4,
          author: 'Chef Minh',
          status: 'published',
          createdDate: '2024-01-15',
          views: 150,
          ingredients: ['Bánh phở', 'Nấm hương', 'Hành tây', 'Gừng', 'Nước tương chay'],
          instructions: ['Nấu nước dashi chay', 'Xào nấm hương', 'Trụng bánh phở', 'Trang trí và thưởng thức'],
          nutrition: { calories: 350, protein: 12, carbs: 65, fat: 8, fiber: 6 },
          tags: ['chay', 'phở', 'nấm'],
          cuisine: 'Việt Nam',
          rating: 4.6,
          reviews: 25
        },
        {
          id: 'recipe-2',
          title: 'Gỏi cuốn chay',
          description: 'Gỏi cuốn tươi mát với rau củ và đậu hũ',
          category: 'Ăn chay',
          difficulty: 'Dễ',
          cookingTime: '20 phút',
          servings: 4,
          author: 'Chef Minh',
          status: 'published',
          createdDate: '2024-01-15',
          views: 120,
          ingredients: ['Bánh tráng', 'Đậu hũ', 'Rau sống', 'Bún tươi', 'Nước chấm chay'],
          instructions: ['Chuẩn bị rau sống', 'Chiên đậu hũ', 'Cuốn bánh tráng', 'Chấm nước mắm chay'],
          nutrition: { calories: 180, protein: 8, carbs: 25, fat: 6, fiber: 4 },
          tags: ['chay', 'gỏi cuốn', 'tươi mát'],
          cuisine: 'Việt Nam',
          rating: 4.4,
          reviews: 18
        },
        {
          id: 'recipe-3',
          title: 'Cơm âm phủ chay',
          description: 'Cơm âm phủ chay đầy đủ dinh dưỡng',
          category: 'Ăn chay',
          difficulty: 'Trung bình',
          cookingTime: '60 phút',
          servings: 4,
          author: 'Chef Minh',
          status: 'published',
          createdDate: '2024-01-15',
          views: 200,
          ingredients: ['Gạo tám', 'Nấm các loại', 'Rau củ', 'Đậu hũ', 'Gia vị chay'],
          instructions: ['Nấu cơm', 'Xào nấm và rau', 'Trộn đều', 'Trang trí đẹp mắt'],
          nutrition: { calories: 420, protein: 15, carbs: 70, fat: 12, fiber: 8 },
          tags: ['chay', 'cơm âm phủ', 'dinh dưỡng'],
          cuisine: 'Việt Nam',
          rating: 4.7,
          reviews: 32
        }
      ],
      totalCalories: 1800,
      totalCost: 150000,
      servings: 4,
      tags: ['chay', 'healthy', 'gia đình'],
      difficulty: 'Trung bình',
      totalCookingTime: 120,
      nutrition: {
        protein: 60,
        carbs: 250,
        fat: 50,
        fiber: 35
      },
      isPublic: true,
      createdBy: 'Admin',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      category: 'Ăn chay',
      cuisine: 'Việt Nam',
      targetAudience: ['family'],
      dietaryRestrictions: ['vegetarian'],
      usageCount: 45,
      rating: 4.5,
      reviews: 12
    },
    {
      id: '2',
      name: 'Thực đơn hải sản',
      description: 'Các món hải sản tươi ngon cho bữa tiệc',
      type: 'dinner',
      recipes: [
        {
          id: 'recipe-4',
          title: 'Tôm nướng muối ớt',
          description: 'Tôm tươi nướng với muối ớt thơm lừng',
          category: 'Hải sản',
          difficulty: 'Trung bình',
          cookingTime: '30 phút',
          servings: 6,
          author: 'Chef Hải',
          status: 'published',
          createdDate: '2024-01-12',
          views: 180,
          ingredients: ['Tôm sú', 'Muối', 'Ớt', 'Tỏi', 'Lá chanh'],
          instructions: ['Sơ chế tôm', 'Ướp gia vị', 'Nướng tôm', 'Trang trí'],
          nutrition: { calories: 250, protein: 35, carbs: 5, fat: 8, fiber: 1 },
          tags: ['hải sản', 'nướng', 'tôm'],
          cuisine: 'Việt Nam',
          rating: 4.8,
          reviews: 42
        },
        {
          id: 'recipe-5',
          title: 'Cua rang me',
          description: 'Cua biển rang me chua ngọt hấp dẫn',
          category: 'Hải sản',
          difficulty: 'Khó',
          cookingTime: '45 phút',
          servings: 6,
          author: 'Chef Hải',
          status: 'published',
          createdDate: '2024-01-12',
          views: 220,
          ingredients: ['Cua biển', 'Me', 'Đường', 'Nước mắm', 'Ớt'],
          instructions: ['Sơ chế cua', 'Nấu nước me', 'Rang cua', 'Trang trí đẹp mắt'],
          nutrition: { calories: 320, protein: 28, carbs: 15, fat: 18, fiber: 2 },
          tags: ['hải sản', 'cua', 'rang me'],
          cuisine: 'Việt Nam',
          rating: 4.9,
          reviews: 38
        },
        {
          id: 'recipe-6',
          title: 'Cá hấp xì dầu',
          description: 'Cá tươi hấp xì dầu thanh đạm',
          category: 'Hải sản',
          difficulty: 'Dễ',
          cookingTime: '25 phút',
          servings: 6,
          author: 'Chef Hải',
          status: 'published',
          createdDate: '2024-01-12',
          views: 160,
          ingredients: ['Cá tươi', 'Xì dầu', 'Gừng', 'Hành lá', 'Dầu ăn'],
          instructions: ['Sơ chế cá', 'Ướp gia vị', 'Hấp cá', 'Rưới nước sốt'],
          nutrition: { calories: 280, protein: 32, carbs: 8, fat: 12, fiber: 1 },
          tags: ['hải sản', 'cá', 'hấp'],
          cuisine: 'Việt Nam',
          rating: 4.6,
          reviews: 28
        }
      ],
      totalCalories: 2200,
      totalCost: 300000,
      servings: 6,
      tags: ['hải sản', 'tiệc tùng', 'cao cấp'],
      difficulty: 'Khó',
      totalCookingTime: 180,
      nutrition: {
        protein: 120,
        carbs: 180,
        fat: 80,
        fiber: 20
      },
      isPublic: true,
      createdBy: 'Chef Hải',
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      category: 'Hải sản',
      cuisine: 'Việt Nam',
      targetAudience: ['family', 'couple'],
      dietaryRestrictions: [],
      usageCount: 23,
      rating: 4.8,
      reviews: 8
    },
    {
      id: '3',
      name: 'Thực đơn ăn sáng nhanh',
      description: 'Các món ăn sáng đơn giản, nhanh gọn',
      type: 'breakfast',
      recipes: [],
      totalCalories: 450,
      totalCost: 50000,
      servings: 2,
      tags: ['ăn sáng', 'nhanh gọn', 'đơn giản'],
      difficulty: 'Dễ',
      totalCookingTime: 30,
      nutrition: {
        protein: 20,
        carbs: 60,
        fat: 15,
        fiber: 8
      },
      isPublic: false,
      createdBy: 'Admin',
      createdAt: '2024-01-18T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
      category: 'Ăn sáng',
      cuisine: 'Việt Nam',
      targetAudience: ['single', 'couple'],
      dietaryRestrictions: [],
      usageCount: 67,
      rating: 4.2,
      reviews: 15
    },
    {
      id: '4',
      name: 'Thực đơn giảm cân',
      description: 'Thực đơn low-carb giúp giảm cân hiệu quả',
      type: 'full_day',
      recipes: [],
      totalCalories: 1200,
      totalCost: 120000,
      servings: 1,
      tags: ['giảm cân', 'low-carb', 'healthy'],
      difficulty: 'Trung bình',
      totalCookingTime: 90,
      nutrition: {
        protein: 80,
        carbs: 100,
        fat: 40,
        fiber: 25
      },
      isPublic: true,
      createdBy: 'Chuyên gia dinh dưỡng',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      category: 'Giảm cân',
      cuisine: 'Quốc tế',
      targetAudience: ['single'],
      dietaryRestrictions: ['low-carb'],
      usageCount: 89,
      rating: 4.6,
      reviews: 25
    }
  ]);

  const categories = ['all', ...Array.from(new Set(menus.map(menu => menu.category)))];

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
    
    const matchesMealType = !mealType || menu.type === mealType || menu.type === 'full_day' || menu.type === 'custom';
    
    return matchesSearch && matchesCategory && matchesMealType;
  });

  const handleSelectMenu = (menu: Menu) => {
    onSelectMenu(menu);
    onClose();
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'breakfast': { label: 'Ăn sáng', color: 'bg-yellow-100 text-yellow-800' },
      'lunch': { label: 'Ăn trưa', color: 'bg-orange-100 text-orange-800' },
      'dinner': { label: 'Ăn tối', color: 'bg-purple-100 text-purple-800' },
      'snack': { label: 'Ăn vặt', color: 'bg-pink-100 text-pink-800' },
      'full_day': { label: 'Cả ngày', color: 'bg-blue-100 text-blue-800' },
      'custom': { label: 'Tùy chỉnh', color: 'bg-gray-100 text-gray-800' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || typeMap.custom;
    return (
      <Badge className={typeInfo.color}>
        {typeInfo.label}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Dễ': 'bg-green-100 text-green-800',
      'Trung bình': 'bg-yellow-100 text-yellow-800',
      'Khó': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {difficulty}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Chọn thực đơn
            {selectedDate && (
              <span className="text-sm font-normal text-muted-foreground">
                cho ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm thực đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {filteredMenus.map((menu) => (
              <Card key={menu.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{menu.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{menu.description}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{menu.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {getTypeBadge(menu.type)}
                      {getDifficultyBadge(menu.difficulty)}
                      <Badge variant="outline">{menu.category}</Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{menu.totalCookingTime} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{menu.servings} người</span>
                      </div>
                      <div>
                        <span className="font-medium">{menu.totalCalories}</span>
                        <span className="text-muted-foreground"> cal</span>
                      </div>
                      <div>
                        <span className="font-medium">{formatCurrency(menu.totalCost)}</span>
                      </div>
                    </div>

                    {/* Recipes List */}
                    {menu.recipes && menu.recipes.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ChefHat className="h-4 w-4" />
                          <span className="text-sm font-medium">Các món ăn ({menu.recipes.length}):</span>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {menu.recipes.map((recipe, index) => (
                            <div key={recipe.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                              <div className="flex-1">
                                <span className="font-medium">{recipe.title}</span>
                                <div className="text-gray-500 mt-1">
                                  {recipe.cookingTime} • {recipe.difficulty} • {recipe.nutrition.calories} cal
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {menu.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {menu.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{menu.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Select Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => handleSelectMenu(menu)}
                    >
                      Chọn thực đơn này
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMenus.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không tìm thấy thực đơn phù hợp</p>
              <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuSelector;
