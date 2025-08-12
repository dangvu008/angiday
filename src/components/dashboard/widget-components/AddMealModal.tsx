import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Clock,
  Users,
  Flame,
  ChefHat,
  Plus,
  X
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onAddMeal: (recipeId: string) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  mealType,
  onAddMeal
}) => {
  const { availableRecipes } = useMealPlanning();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Get meal type config
  const mealTypeLabels = {
    breakfast: 'Bữa Sáng',
    lunch: 'Bữa Trưa', 
    dinner: 'Bữa Tối',
    snack: 'Bữa Phụ'
  };

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = [...new Set(availableRecipes.map(recipe => recipe.category))];
    return cats;
  }, [availableRecipes]);

  const difficulties = useMemo(() => {
    const diffs = [...new Set(availableRecipes.map(recipe => recipe.difficulty))];
    return diffs;
  }, [availableRecipes]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return availableRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [availableRecipes, searchTerm, selectedCategory, selectedDifficulty]);

  const handleAddRecipe = (recipeId: string) => {
    console.log('🍽️ AddMealModal.handleAddRecipe:', recipeId);
    onAddMeal(recipeId);
    // Không tự động đóng modal ở đây, để parent component quyết định
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Thêm món cho {mealTypeLabels[mealType]}
          </DialogTitle>
          <DialogDescription>
            Chọn món ăn từ danh sách công thức có sẵn
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 py-4 border-b">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Tìm kiếm món ăn hoặc nguyên liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả độ khó</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipe Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Không tìm thấy món ăn phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredRecipes.map(recipe => (
                <Card key={recipe.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    {/* Recipe Image */}
                    <div className="relative mb-3">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                        }}
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddRecipe(recipe.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Recipe Info */}
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                      {recipe.title}
                    </h4>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                      {recipe.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          <span>{recipe.calories}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {recipe.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          recipe.difficulty === 'Dễ' ? 'border-green-300 text-green-700' :
                          recipe.difficulty === 'Trung bình' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }`}
                      >
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    {/* Add Button */}
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddRecipe(recipe.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm món
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealModal;
