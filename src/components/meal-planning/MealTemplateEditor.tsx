import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Clock, DollarSign, Flame, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MealTemplate, Dish } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import { autoCalculatorService } from '@/services/auto-calculator.service';
// import DishSelector from './DishSelector'; // Sẽ tạo sau

interface MealTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  template?: MealTemplate | null;
  onSave: (template: MealTemplate) => void;
}

const MealTemplateEditor: React.FC<MealTemplateEditorProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<MealTemplate>>({
    name: '',
    description: '',
    type: 'lunch',
    dishes: [],
    tags: [],
    difficulty: 'medium',
    category: '',
    cuisine: '',
    servings: 4,
    isPublic: false
  });

  const [showDishSelector, setShowDishSelector] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [calculatedData, setCalculatedData] = useState({
    totalCalories: 0,
    totalCost: 0,
    cookingTime: 0,
    nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  });

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'lunch',
        dishes: [],
        tags: [],
        difficulty: 'medium',
        category: '',
        cuisine: '',
        servings: 4,
        isPublic: false
      });
    }
  }, [template]);

  useEffect(() => {
    // Tự động tính toán khi dishes thay đổi
    if (formData.dishes && formData.dishes.length > 0) {
      const mockTemplate: MealTemplate = {
        ...formData,
        id: template?.id || 'temp',
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        reviews: 0
      } as MealTemplate;

      const result = autoCalculatorService.calculateMealTemplate(mockTemplate);
      setCalculatedData({
        totalCalories: result.calories,
        totalCost: result.cost,
        cookingTime: result.cookingTime,
        nutrition: result.nutrition
      });
    } else {
      setCalculatedData({
        totalCalories: 0,
        totalCost: 0,
        cookingTime: 0,
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
      });
    }
  }, [formData.dishes]);

  const handleInputChange = (field: keyof MealTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDish = (dish: Dish) => {
    setFormData(prev => ({
      ...prev,
      dishes: [...(prev.dishes || []), dish]
    }));
    setShowDishSelector(false);
  };

  const handleRemoveDish = (dishId: string) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes?.filter(dish => dish.id !== dishId) || []
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Vui lòng nhập tên bữa ăn');
      return;
    }

    if (!formData.dishes || formData.dishes.length === 0) {
      toast.error('Vui lòng thêm ít nhất một món ăn');
      return;
    }

    try {
      const templateToSave: MealTemplate = {
        id: template?.id || `meal_template_${Date.now()}`,
        name: formData.name!,
        description: formData.description || '',
        type: formData.type!,
        dishes: formData.dishes,
        totalCalories: calculatedData.totalCalories,
        totalCost: calculatedData.totalCost,
        servings: formData.servings || 4,
        tags: formData.tags || [],
        difficulty: formData.difficulty!,
        cookingTime: calculatedData.cookingTime,
        nutrition: calculatedData.nutrition,
        isPublic: formData.isPublic || false,
        createdBy: 'user',
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: formData.category || '',
        cuisine: formData.cuisine || '',
        usageCount: template?.usageCount || 0,
        rating: template?.rating || 0,
        reviews: template?.reviews || 0
      };

      await templateLibraryService.saveMealTemplate(templateToSave);
      onSave(templateToSave);
      onClose();
      toast.success(template ? 'Đã cập nhật template' : 'Đã tạo template mới');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu template');
      console.error('Error saving template:', error);
    }
  };

  const mealTypeLabels = {
    breakfast: 'Sáng',
    lunch: 'Trưa', 
    dinner: 'Tối',
    snack: 'Phụ'
  };

  const difficultyLabels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó'
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {template ? 'Chỉnh sửa template bữa ăn' : 'Tạo template bữa ăn mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form chính */}
            <div className="lg:col-span-2 space-y-4">
              {/* Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tên bữa ăn *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="VD: Cơm trưa gia đình"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả ngắn về bữa ăn này..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Loại bữa ăn</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(mealTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Độ khó</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(difficultyLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="servings">Số phần ăn</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="1"
                        value={formData.servings || 4}
                        onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Danh mục</Label>
                      <Input
                        id="category"
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="VD: Gia đình"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cuisine">Ẩm thực</Label>
                      <Input
                        id="cuisine"
                        value={formData.cuisine || ''}
                        onChange={(e) => handleInputChange('cuisine', e.target.value)}
                        placeholder="VD: Việt Nam"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Món ăn */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Món ăn ({formData.dishes?.length || 0})</CardTitle>
                    <Button onClick={() => setShowDishSelector(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm món
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.dishes && formData.dishes.length > 0 ? (
                    <div className="space-y-3">
                      {formData.dishes.map((dish) => (
                        <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img src={dish.image} alt={dish.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <h4 className="font-medium">{dish.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Flame className="h-3 w-3" />
                                  {dish.calories} cal
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {dish.cost.toLocaleString()}đ
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {dish.cookingTime} phút
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDish(dish.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Chưa có món ăn nào</p>
                      <p className="text-sm">Nhấn "Thêm món" để bắt đầu</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Thêm tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Thông tin tính toán */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin dinh dưỡng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {calculatedData.totalCalories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {calculatedData.totalCost.toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-600">Chi phí</div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculatedData.cookingTime}
                    </div>
                    <div className="text-sm text-gray-600">Phút nấu</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Dinh dưỡng:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>{calculatedData.nutrition.protein.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span>{calculatedData.nutrition.carbs.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span>{calculatedData.nutrition.fat.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span>{calculatedData.nutrition.fiber.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {template ? 'Cập nhật' : 'Tạo template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dish Selector Modal - Sẽ implement sau */}
      {showDishSelector && (
        <div>Dish Selector sẽ được implement</div>
      )}
    </>
  );
};

export default MealTemplateEditor;
