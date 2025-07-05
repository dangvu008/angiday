
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
    type: 'Lẻ',
    status: 'draft',
    author: 'Admin',
    description: ''
  });

  useEffect(() => {
    if (mealPlan) {
      setFormData(mealPlan);
    } else {
      setFormData({
        title: '',
        type: 'Lẻ',
        status: 'draft',
        author: 'Admin',
        description: ''
      });
    }
  }, [mealPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm thực đơn mới' : 'Chỉnh sửa thực đơn'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Loại thực đơn</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lẻ">Lẻ</SelectItem>
                <SelectItem value="Ngày">Ngày</SelectItem>
                <SelectItem value="Tuần">Tuần</SelectItem>
                <SelectItem value="Tháng">Tháng</SelectItem>
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
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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

export default MealPlanModal;
