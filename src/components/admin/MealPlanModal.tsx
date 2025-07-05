
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MealPlan {
  id?: number;
  title: string;
  type: string;
  status: 'published' | 'draft';
  author: string;
  createdDate?: string;
  views?: number;
  description?: string;
  image?: string;
  duration?: string;
  targetGroup?: string;
  goals?: string[];
  totalCalories?: number;
  mealsPerDay?: number;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  price?: number;
}

interface MealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealPlan: MealPlan) => void;
  mealPlan?: MealPlan | null;
  mode: 'add' | 'edit';
}

const MealPlanModal = ({ isOpen, onClose, onSave, mealPlan, mode }: MealPlanModalProps) => {
  const [formData, setFormData] = useState<MealPlan>({
    title: '',
    type: 'Tuần',
    status: 'draft',
    author: 'Admin',
    description: '',
    image: '',
    duration: '',
    targetGroup: 'Người bình thường',
    goals: [],
    totalCalories: 0,
    mealsPerDay: 3,
    difficulty: 'Dễ',
    price: 0
  });

  const [goalsInput, setGoalsInput] = useState('');

  useEffect(() => {
    if (mealPlan) {
      setFormData(mealPlan);
      setGoalsInput(mealPlan.goals?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        type: 'Tuần',
        status: 'draft',
        author: 'Admin',
        description: '',
        image: '',
        duration: '',
        targetGroup: 'Người bình thường',
        goals: [],
        totalCalories: 0,
        mealsPerDay: 3,
        difficulty: 'Dễ',
        price: 0
      });
      setGoalsInput('');
    }
  }, [mealPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goals = goalsInput.split(',').map(goal => goal.trim()).filter(goal => goal);
    onSave({ ...formData, goals });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm thực đơn mới' : 'Chỉnh sửa thực đơn'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Thực đơn giảm cân 7 ngày"
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
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Mô tả chi tiết về thực đơn..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Loại thực đơn</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ngày">Ngày</SelectItem>
                  <SelectItem value="Tuần">Tuần</SelectItem>
                  <SelectItem value="Tháng">Tháng</SelectItem>
                  <SelectItem value="Gói đặc biệt">Gói đặc biệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian</Label>
              <Input
                id="duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="VD: 7 ngày, 4 tuần"
              />
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
              <Label htmlFor="targetGroup">Đối tượng mục tiêu</Label>
              <Select value={formData.targetGroup} onValueChange={(value) => setFormData({ ...formData, targetGroup: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Người bình thường">Người bình thường</SelectItem>
                  <SelectItem value="Người muốn giảm cân">Người muốn giảm cân</SelectItem>
                  <SelectItem value="Người muốn tăng cân">Người muốn tăng cân</SelectItem>
                  <SelectItem value="Phụ nữ mang thai">Phụ nữ mang thai</SelectItem>
                  <SelectItem value="Người tập gym">Người tập gym</SelectItem>
                  <SelectItem value="Người ăn chay">Người ăn chay</SelectItem>
                  <SelectItem value="Người cao tuổi">Người cao tuổi</SelectItem>
                  <SelectItem value="Trẻ em">Trẻ em</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCalories">Tổng Calories/ngày</Label>
              <Input
                id="totalCalories"
                type="number"
                value={formData.totalCalories || ''}
                onChange={(e) => setFormData({ ...formData, totalCalories: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealsPerDay">Số bữa/ngày</Label>
              <Input
                id="mealsPerDay"
                type="number"
                value={formData.mealsPerDay || 3}
                onChange={(e) => setFormData({ ...formData, mealsPerDay: parseInt(e.target.value) || 3 })}
                min="1"
                max="6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="0 = Miễn phí"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Mục tiêu (phân cách bằng dấu phẩy)</Label>
            <Input
              id="goals"
              value={goalsInput}
              onChange={(e) => setGoalsInput(e.target.value)}
              placeholder="VD: giảm cân, tăng cơ, detox, cân bằng dinh dưỡng"
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

export default MealPlanModal;
