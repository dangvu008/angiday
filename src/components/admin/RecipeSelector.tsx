import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Clock, Users, Star, ChefHat, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  createdDate: string;
  views: number;
  image?: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  cuisine: string;
  rating: number;
  reviews: number;
}

interface RecipeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipes: (recipes: Recipe[]) => void;
  selectedRecipeIds?: string[];
  multiSelect?: boolean;
  title?: string;
}

const RecipeSelector = ({ 
  isOpen, 
  onClose, 
  onSelectRecipes, 
  selectedRecipeIds = [], 
  multiSelect = true,
  title = "Chọn công thức"
}: RecipeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedRecipeIds);

  // Mock data - trong thực tế sẽ fetch từ API
  const [recipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Phở Bò Truyền Thống',
      description: 'Món phở bò truyền thống Việt Nam với nước dùng đậm đà',
      category: 'Món chính',
      difficulty: 'Khó',
      cookingTime: '3 giờ',
      servings: 4,
      author: 'Chef Nguyễn',
      status: 'published',
      createdDate: '2024-01-15',
      views: 2450,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      ingredients: ['Xương bò', 'Bánh phở', 'Hành tây', 'Gừng', 'Quế', 'Hoa hồi'],
      instructions: ['Ninh xương bò 3 tiếng', 'Chuẩn bị gia vị', 'Luộc bánh phở', 'Bày biện và thưởng thức'],
      nutrition: { calories: 450, protein: 25, carbs: 60, fat: 12, fiber: 3 },
      tags: ['phở', 'truyền thống', 'bò'],
      cuisine: 'Việt Nam',
      rating: 4.5,
      reviews: 120
    },
    {
      id: '2',
      title: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi mát với tôm và thịt ba chỉ',
      category: 'Khai vị',
      difficulty: 'Dễ',
      cookingTime: '30 phút',
      servings: 4,
      author: 'Chef Mai',
      status: 'published',
      createdDate: '2024-01-12',
      views: 1230,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      ingredients: ['Bánh tráng', 'Tôm', 'Thịt ba chỉ', 'Rau sống', 'Bún'],
      instructions: ['Luộc tôm và thịt', 'Chuẩn bị rau sống', 'Cuốn bánh tráng', 'Chấm với nước mắm'],
      nutrition: { calories: 180, protein: 15, carbs: 20, fat: 5, fiber: 2 },
      tags: ['gỏi cuốn', 'healthy', 'tôm'],
      cuisine: 'Việt Nam',
      rating: 4.3,
      reviews: 85
    },
    {
      id: '3',
      title: 'Salad Trái Cây Healthy',
      description: 'Salad trái cây tươi mát, bổ dưỡng cho sức khỏe',
      category: 'Tráng miệng',
      difficulty: 'Dễ',
      cookingTime: '15 phút',
      servings: 2,
      author: 'Admin',
      status: 'published',
      createdDate: '2024-01-10',
      views: 890,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      ingredients: ['Táo', 'Cam', 'Nho', 'Dâu tây', 'Sữa chua'],
      instructions: ['Rửa sạch trái cây', 'Cắt miếng vừa ăn', 'Trộn với sữa chua', 'Trang trí và thưởng thức'],
      nutrition: { calories: 120, protein: 2, carbs: 30, fat: 0.5, fiber: 5 },
      tags: ['healthy', 'trái cây', 'vitamin'],
      cuisine: 'Quốc tế',
      rating: 4.2,
      reviews: 65
    },
    {
      id: '4',
      title: 'Canh Chua Cá Basa',
      description: 'Canh chua truyền thống miền Nam với cá basa tươi ngon',
      category: 'Canh',
      difficulty: 'Trung bình',
      cookingTime: '45 phút',
      servings: 6,
      author: 'Chef Hương',
      status: 'published',
      createdDate: '2024-01-08',
      views: 1560,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      ingredients: ['Cá basa', 'Me', 'Cà chua', 'Dứa', 'Đậu bắp', 'Giá đỗ'],
      instructions: ['Sơ chế cá', 'Nấu nước dùng chua', 'Cho cá vào nấu', 'Nêm nếm và hoàn thành'],
      nutrition: { calories: 200, protein: 18, carbs: 15, fat: 8, fiber: 4 },
      tags: ['canh chua', 'cá', 'miền nam'],
      cuisine: 'Việt Nam',
      rating: 4.6,
      reviews: 95
    },
    {
      id: '5',
      title: 'Bánh Mì Thịt Nướng',
      description: 'Bánh mì Việt Nam với thịt nướng thơm ngon',
      category: 'Ăn sáng',
      difficulty: 'Trung bình',
      cookingTime: '1 giờ',
      servings: 4,
      author: 'Chef Tuấn',
      status: 'published',
      createdDate: '2024-01-05',
      views: 2100,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      ingredients: ['Bánh mì', 'Thịt heo', 'Pate', 'Rau sống', 'Nước mắm'],
      instructions: ['Ướp thịt', 'Nướng thịt', 'Chuẩn bị bánh mì', 'Kẹp và thưởng thức'],
      nutrition: { calories: 350, protein: 20, carbs: 35, fat: 15, fiber: 3 },
      tags: ['bánh mì', 'thịt nướng', 'ăn sáng'],
      cuisine: 'Việt Nam',
      rating: 4.4,
      reviews: 110
    }
  ]);

  const categories = ['all', ...Array.from(new Set(recipes.map(recipe => recipe.category)))];
  const difficulties = ['all', 'Dễ', 'Trung bình', 'Khó'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleRecipeToggle = (recipe: Recipe) => {
    if (multiSelect) {
      const isSelected = tempSelectedIds.includes(recipe.id);
      if (isSelected) {
        setTempSelectedIds(prev => prev.filter(id => id !== recipe.id));
        setSelectedRecipes(prev => prev.filter(r => r.id !== recipe.id));
      } else {
        setTempSelectedIds(prev => [...prev, recipe.id]);
        setSelectedRecipes(prev => [...prev, recipe]);
      }
    } else {
      setTempSelectedIds([recipe.id]);
      setSelectedRecipes([recipe]);
    }
  };

  const handleConfirm = () => {
    const recipesToReturn = recipes.filter(recipe => tempSelectedIds.includes(recipe.id));
    onSelectRecipes(recipesToReturn);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedRecipeIds);
    setSelectedRecipes([]);
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm công thức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Độ khó" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'Tất cả' : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Count */}
          {multiSelect && tempSelectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Đã chọn {tempSelectedIds.length} công thức
              </p>
            </div>
          )}

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  tempSelectedIds.includes(recipe.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleRecipeToggle(recipe)}
              >
                <div className="relative">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 left-2">
                    {multiSelect ? (
                      <Checkbox
                        checked={tempSelectedIds.includes(recipe.id)}
                        onChange={() => handleRecipeToggle(recipe)}
                        className="bg-white"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        tempSelectedIds.includes(recipe.id) 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white border-gray-300'
                      }`} />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(recipe.difficulty)} size="sm">
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="outline" size="sm">{recipe.category}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cookingTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings} người</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{recipe.rating}</span>
                      </div>
                      <div>
                        <span className="font-medium">{recipe.nutrition.calories}</span>
                        <span className="text-gray-500"> cal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredRecipes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không tìm thấy công thức phù hợp</p>
              <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={tempSelectedIds.length === 0}
            >
              Chọn {tempSelectedIds.length > 0 && `(${tempSelectedIds.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSelector;
