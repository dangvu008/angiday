import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recipeManagementService } from '@/services/recipeManagementService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Clock, Users, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRecipeModalProps {
  trigger?: React.ReactNode;
  onRecipeCreated?: () => void;
}

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  trigger,
  onRecipeCreated
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prep_time: 15,
    cook_time: 30,
    servings: 4,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
    image_url: '',
    is_public: true
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để tạo công thức');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên công thức');
      return;
    }

    if (formData.ingredients.filter(ing => ing.trim()).length === 0) {
      toast.error('Vui lòng thêm ít nhất một nguyên liệu');
      return;
    }

    if (formData.instructions.filter(inst => inst.trim()).length === 0) {
      toast.error('Vui lòng thêm ít nhất một bước thực hiện');
      return;
    }

    setIsLoading(true);

    try {
      const recipeData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        instructions: formData.instructions.filter(inst => inst.trim()),
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        servings: formData.servings,
        difficulty: formData.difficulty,
        tags: formData.tags,
        image_url: formData.image_url.trim() || undefined,
        user_id: user.id,
        is_public: formData.is_public,
        source: 'user' as const,
        rating: 0,
        views: 0
      };

      await recipeManagementService.createRecipe(recipeData);
      
      toast.success('Tạo công thức thành công!');
      setIsOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        ingredients: [''],
        instructions: [''],
        prep_time: 15,
        cook_time: 30,
        servings: 4,
        difficulty: 'medium',
        tags: [],
        image_url: '',
        is_public: true
      });

      onRecipeCreated?.();
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Có lỗi xảy ra khi tạo công thức');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
      <Plus className="h-5 w-5 mr-2" />
      Tạo công thức mới
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Tạo công thức mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Tên công thức *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên công thức..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả về công thức này..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image_url">URL hình ảnh</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleInputChange('is_public', checked)}
              />
              <Label htmlFor="is_public">Công khai cho mọi người xem</Label>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="prep_time">Thời gian chuẩn bị (phút)</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  id="prep_time"
                  type="number"
                  min="0"
                  value={formData.prep_time}
                  onChange={(e) => handleInputChange('prep_time', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cook_time">Thời gian nấu (phút)</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  id="cook_time"
                  type="number"
                  min="0"
                  value={formData.cook_time}
                  onChange={(e) => handleInputChange('cook_time', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="servings">Số người ăn</Label>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <Label>Nguyên liệu *</Label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                    placeholder={`Nguyên liệu ${index + 1}...`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem('ingredients', index)}
                    disabled={formData.ingredients.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('ingredients')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm nguyên liệu
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <Label>Cách thực hiện *</Label>
            <div className="space-y-2">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                    placeholder={`Bước ${index + 1}...`}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem('instructions', index)}
                    disabled={formData.instructions.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('instructions')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm bước thực hiện
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Thẻ tag</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nhập tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo công thức'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeModal;
