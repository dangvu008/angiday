import React, { useState, useEffect } from 'react';
import { X, Search, Filter, Clock, Users, Flame, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (recipe: any) => void;
  selectedDate?: string;
  selectedMealType?: string;
}

const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  onAddDish,
  selectedDate,
  selectedMealType
}) => {
  const { availableRecipes } = useMealPlanning();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRecipes, setFilteredRecipes] = useState(availableRecipes);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  useEffect(() => {
    // Load favorites and recent from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_recipes') || '[]');
    const savedRecent = JSON.parse(localStorage.getItem('recent_recipes') || '[]');
    setFavoriteRecipes(savedFavorites);
    setRecentRecipes(savedRecent);
  }, []);

  useEffect(() => {
    let filtered = availableRecipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory, availableRecipes]);

  const categories = ['all', ...Array.from(new Set(availableRecipes.map(recipe => recipe.category)))];

  const getMealTypeLabel = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      case 'snack': return 'Bữa phụ';
      default: return 'Bữa ăn';
    }
  };

  const handleAddRecipe = (recipe: any) => {
    // Add to recent recipes
    const updatedRecent = [recipe, ...recentRecipes.filter(r => r.id !== recipe.id)].slice(0, 10);
    setRecentRecipes(updatedRecent);
    localStorage.setItem('recent_recipes', JSON.stringify(updatedRecent));

    onAddDish(recipe);
    onClose();
  };

  const toggleFavorite = (recipeId: string) => {
    const updatedFavorites = favoriteRecipes.includes(recipeId)
      ? favoriteRecipes.filter(id => id !== recipeId)
      : [...favoriteRecipes, recipeId];

    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favorite_recipes', JSON.stringify(updatedFavorites));
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Thêm món ăn</span>
            {selectedDate && selectedMealType && (
              <Badge variant="outline">
                {getMealTypeLabel(selectedMealType)} - {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả ({filteredRecipes.length})</TabsTrigger>
              <TabsTrigger value="favorites">Yêu thích</TabsTrigger>
              <TabsTrigger value="recent">Gần đây</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          {recipe.cookTime}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(recipe.id);
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              favoriteRecipes.includes(recipe.id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} người</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          <span>{recipe.calories || 'N/A'} kcal</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleAddRecipe(recipe)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Thêm
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không tìm thấy món ăn nào</p>
                  <p className="text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="flex-1 overflow-y-auto">
              {(() => {
                const favorites = availableRecipes.filter(recipe => favoriteRecipes.includes(recipe.id));

                if (favorites.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có món ăn yêu thích</p>
                      <p className="text-sm">Đánh dấu yêu thích các món ăn để xem ở đây</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                    {favorites.map((recipe) => (
                      <Card key={recipe.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90">
                              {recipe.cookTime}
                            </Badge>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Star className="h-4 w-4 text-red-500 fill-red-500" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{recipe.servings} người</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-4 w-4" />
                              <span>{recipe.calories || 'N/A'} kcal</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getDifficultyColor(recipe.difficulty)}>
                              {recipe.difficulty}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleAddRecipe(recipe)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Thêm
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="recent" className="flex-1 overflow-y-auto">
              {recentRecipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có món ăn gần đây</p>
                  <p className="text-sm">Các món ăn bạn đã thêm gần đây sẽ hiển thị ở đây</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                  {recentRecipes.map((recipe) => (
                    <Card key={recipe.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90">
                            {recipe.cookTime}
                          </Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(recipe.id);
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favoriteRecipes.includes(recipe.id)
                                  ? 'text-red-500 fill-red-500'
                                  : 'text-gray-400'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings} người</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            <span>{recipe.calories || 'N/A'} kcal</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(recipe.difficulty)}>
                            {recipe.difficulty}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleAddRecipe(recipe)}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Thêm
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishModal;
