import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Search } from 'lucide-react';
import { Menu, Recipe } from '@/types/meal-planning';
import RecipeSelector from './RecipeSelector';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menu: Partial<Menu>) => void;
  menu?: Menu | null;
  mode: 'add' | 'edit';
}

const MenuModal = ({ isOpen, onClose, onSave, menu, mode }: MenuModalProps) => {
  const [formData, setFormData] = useState<Partial<Menu>>({
    name: '',
    description: '',
    type: 'full_day',
    recipes: [],
    servings: 4,
    tags: [],
    difficulty: 'Trung bình',
    isPublic: true,
    createdBy: 'Admin',
    category: '',
    cuisine: 'Việt Nam',
    targetAudience: [],
    dietaryRestrictions: []
  });

  const [tagInput, setTagInput] = useState('');
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  // Mock recipes data - in real app this would come from API
  const [availableRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Phở Bò Truyền Thống',
      description: 'Món phở bò truyền thống Việt Nam',
      category: 'Món chính',
      difficulty: 'Khó',
      cookingTime: '3 giờ',
      servings: 4,
      author: 'Chef Nguyễn',
      status: 'published',
      createdDate: '2024-01-15',
      views: 2450,
      ingredients: ['Xương bò', 'Bánh phở', 'Hành tây'],
      instructions: ['Ninh xương', 'Luộc bánh phở'],
      nutrition: {
        calories: 450,
        protein: 25,
        carbs: 60,
        fat: 12,
        fiber: 3
      },
      tags: ['phở', 'truyền thống'],
      cuisine: 'Việt Nam',
      rating: 4.5,
      reviews: 120
    },
    {
      id: '2',
      title: 'Salad Trái Cây Healthy',
      description: 'Salad trái cây tươi mát, bổ dưỡng',
      category: 'Tráng miệng',
      difficulty: 'Dễ',
      cookingTime: '15 phút',
      servings: 2,
      author: 'Admin',
      status: 'published',
      createdDate: '2024-01-12',
      views: 1230,
      ingredients: ['Táo', 'Cam', 'Nho'],
      instructions: ['Rửa sạch trái cây', 'Cắt miếng vừa ăn'],
      nutrition: {
        calories: 120,
        protein: 2,
        carbs: 30,
        fat: 0.5,
        fiber: 5
      },
      tags: ['healthy', 'trái cây'],
      cuisine: 'Quốc tế',
      rating: 4.2,
      reviews: 85
    }
  ]);

  useEffect(() => {
    if (menu) {
      setFormData(menu);
      setTagInput(menu.tags?.join(', ') || '');
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'full_day',
        recipes: [],
        servings: 4,
        tags: [],
        difficulty: 'Trung bình',
        isPublic: true,
        createdBy: 'Admin',
        category: '',
        cuisine: 'Việt Nam',
        targetAudience: [],
        dietaryRestrictions: []
      });
      setTagInput('');
    }
  }, [menu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Calculate totals from selected recipes
    const totalCalories = formData.recipes?.reduce((sum, recipe) => sum + recipe.nutrition.calories, 0) || 0;
    const totalCookingTime = formData.recipes?.reduce((sum, recipe) => {
      const time = parseInt(recipe.cookingTime.replace(/\D/g, '')) || 0;
      return sum + time;
    }, 0) || 0;
    
    const nutrition = formData.recipes?.reduce((acc, recipe) => ({
      protein: acc.protein + recipe.nutrition.protein,
      carbs: acc.carbs + recipe.nutrition.carbs,
      fat: acc.fat + recipe.nutrition.fat,
      fiber: acc.fiber + recipe.nutrition.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 }) || { protein: 0, carbs: 0, fat: 0, fiber: 0 };

    onSave({ 
      ...formData, 
      tags,
      totalCalories,
      totalCookingTime,
      nutrition,
      totalCost: totalCalories * 100 // Mock calculation
    });
    onClose();
  };

  const handleSelectRecipes = (selectedRecipes: Recipe[]) => {
    setFormData({
      ...formData,
      recipes: selectedRecipes
    });
  };

  const removeRecipeFromMenu = (recipeId: string) => {
    setFormData({
      ...formData,
      recipes: formData.recipes?.filter(r => r.id !== recipeId) || []
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData({
        ...formData,
        tags: [...new Set([...(formData.tags || []), ...newTags])]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Tạo thực đơn mới' : 'Chỉnh sửa thực đơn'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên thực đơn *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Thực đơn ăn chay"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại thực đơn</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Ăn sáng</SelectItem>
                  <SelectItem value="lunch">Ăn trưa</SelectItem>
                  <SelectItem value="dinner">Ăn tối</SelectItem>
                  <SelectItem value="snack">Ăn vặt</SelectItem>
                  <SelectItem value="full_day">Cả ngày</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về thực đơn này..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ví dụ: Ăn chay"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dễ">Dễ</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Khó">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Khẩu phần</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings || 4}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          {/* Recipe Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chọn công thức</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecipeSelector(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Chọn công thức
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Selected Recipes */}
              <div className="space-y-2">
                <Label>Công thức đã chọn ({formData.recipes?.length || 0})</Label>
                {formData.recipes && formData.recipes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {formData.recipes.map((recipe) => (
                      <Card key={recipe.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{recipe.title}</h4>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{recipe.cookingTime}</span>
                                <span>•</span>
                                <span>{recipe.servings} người</span>
                                <span>•</span>
                                <span>{recipe.nutrition.calories} cal</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {recipe.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecipeFromMenu(recipe.id)}
                              className="ml-2 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-sm">Chưa có công thức nào</p>
                    <p className="text-xs">Nhấn "Chọn công thức" để thêm món ăn vào thực đơn</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tags, cách nhau bằng dấu phẩy"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>Thêm</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Public/Private */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked as boolean })}
            />
            <Label htmlFor="isPublic">Công khai thực đơn</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Tạo thực đơn' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>

        {/* Recipe Selector Modal */}
        <RecipeSelector
          isOpen={showRecipeSelector}
          onClose={() => setShowRecipeSelector(false)}
          onSelectRecipes={handleSelectRecipes}
          selectedRecipeIds={formData.recipes?.map(r => r.id) || []}
          multiSelect={true}
          title="Chọn công thức cho thực đơn"
        />
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;
