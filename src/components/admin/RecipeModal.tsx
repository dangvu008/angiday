
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
    instructions: ''
  });

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
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
        instructions: ''
      });
    }
  }, [recipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm công thức mới' : 'Chỉnh sửa công thức'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tên món ăn</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="servings">Số khẩu phần</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <Label htmlFor="ingredients">Nguyên liệu</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients || ''}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              rows={4}
              placeholder="Nhập từng nguyên liệu trên một dòng..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Hướng dẫn nấu</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={5}
              placeholder="Nhập từng bước thực hiện..."
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
