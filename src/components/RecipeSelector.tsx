import React, { useState, useMemo } from 'react';
import { Recipe, useMealPlanning } from '@/contexts/MealPlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Clock, 
  Users, 
  ChefHat, 
  Plus, 
  Filter,
  Star,
  Flame
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RecipeSelectorProps {
  onSelectRecipe: (recipe: Recipe) => void;
  selectedDate?: string;
  selectedMealType?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  onSelectRecipe,
  selectedDate,
  selectedMealType,
  isOpen,
  onClose
}) => {
  const { availableRecipes } = useMealPlanning();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(availableRecipes.map(r => r.category)));
    return ['all', ...cats];
  }, [availableRecipes]);

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let filtered = availableRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'time':
          return parseInt(a.cookTime) - parseInt(b.cookTime);
        case 'difficulty':
          const difficultyOrder = { 'Dễ': 1, 'Trung bình': 2, 'Khó': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'calories':
          return (a.calories || 0) - (b.calories || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableRecipes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelectRecipe(recipe);
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

  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa', 
      dinner: 'Bữa tối',
      snack: 'Ăn vặt'
    };
    return labels[mealType as keyof typeof labels] || mealType;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Chọn công thức</CardTitle>
              {selectedDate && selectedMealType && (
                <p className="text-sm text-gray-600 mt-1">
                  Cho {getMealTypeLabel(selectedMealType)} - {new Date(selectedDate).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm công thức hoặc nguyên liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Tất cả danh mục' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Độ khó" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả độ khó</SelectItem>
                  <SelectItem value="Dễ">Dễ</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Khó">Khó</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="time">Thời gian nấu</SelectItem>
                  <SelectItem value="difficulty">Độ khó</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map(recipe => (
                <Card 
                  key={recipe.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.servings} người
                      </div>
                      {recipe.calories && (
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1" />
                          {recipe.calories} cal
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Chọn công thức
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy công thức
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeSelector;
