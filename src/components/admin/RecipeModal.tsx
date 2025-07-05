
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recipe {
  id?: number;
  title: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  ingredients?: string;
  instructions?: string;
  description?: string;
  image?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  recipe?: Recipe | null;
  mode: 'add' | 'edit';
}

const RecipeModal = ({ isOpen, onClose, onSave, recipe, mode }: RecipeModalProps) => {
  const [formData, setFormData] = useState<Recipe>({
    title: '',
    category: 'Món chính',
    difficulty: 'Dễ',
    cookingTime: '',
    servings: 2,
    author: 'Admin',
    status: 'draft',
    ingredients: '',
    instructions: '',
    description: '',
    image: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    tags: []
  });

  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
      setTagsInput(recipe.tags?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        category: 'Món chính',
        difficulty: 'Dễ',
        cookingTime: '',
        servings: 2,
        author: 'Admin',
        status: 'draft',
        ingredients: '',
        instructions: '',
        description: '',
        image: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        tags: []
      });
      setTagsInput('');
    }
  }, [recipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ ...formData, tags });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm công thức mới' : 'Chỉnh sửa công thức'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên món ăn</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Phở Bò Truyền Thống"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh (URL)</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Mô tả ngắn về món ăn..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Món chính">Món chính</SelectItem>
                  <SelectItem value="Món phụ">Món phụ</SelectItem>
                  <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                  <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                  <SelectItem value="Món ăn sáng">Món ăn sáng</SelectItem>
                  <SelectItem value="Món ăn trưa">Món ăn trưa</SelectItem>
                  <SelectItem value="Món ăn tối">Món ăn tối</SelectItem>
                  <SelectItem value="Món chay">Món chay</SelectItem>
                  <SelectItem value="Đặc sản">Đặc sản</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={formData.difficulty} onValueChange={(value: 'Dễ' | 'Trung bình' | 'Khó') => setFormData({ ...formData, difficulty: value })}>
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
              <Label htmlFor="cookingTime">Thời gian nấu</Label>
              <Input
                id="cookingTime"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                placeholder="VD: 30 phút"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">Số khẩu phần</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 0 })}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: 'published' | 'draft') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein || ''}
                onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs || ''}
                onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.fat || ''}
                onChange={(e) => setFormData({ ...formData, fat: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: healthy, giảm cân, protein cao"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Nguyên liệu</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients || ''}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              rows={5}
              placeholder="Nhập từng nguyên liệu trên một dòng...&#10;VD:&#10;- 500g thịt bò&#10;- 200g bánh phở&#10;- 1 củ hành tây"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Hướng dẫn nấu</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={6}
              placeholder="Nhập từng bước thực hiện...&#10;VD:&#10;Bước 1: Chuẩn bị nguyên liệu&#10;Bước 2: Nấu nước dùng&#10;Bước 3: Luộc bánh phở"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Thêm' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
