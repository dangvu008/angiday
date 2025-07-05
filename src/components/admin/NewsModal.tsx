
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsItem {
  id?: number;
  title: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  publishDate?: string;
  views?: number;
  content?: string;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: NewsItem) => void;
  news?: NewsItem | null;
  mode: 'add' | 'edit';
}

const NewsModal = ({ isOpen, onClose, onSave, news, mode }: NewsModalProps) => {
  const [formData, setFormData] = useState<NewsItem>({
    title: '',
    category: 'Sức khỏe',
    status: 'draft',
    author: 'Admin',
    content: ''
  });

  useEffect(() => {
    if (news) {
      setFormData(news);
    } else {
      setFormData({
        title: '',
        category: 'Sức khỏe',
        status: 'draft',
        author: 'Admin',
        content: ''
      });
    }
  }, [news]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
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
            <Label htmlFor="category">Danh mục</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sức khỏe">Sức khỏe</SelectItem>
                <SelectItem value="Nấu ăn">Nấu ăn</SelectItem>
                <SelectItem value="Xu hướng">Xu hướng</SelectItem>
                <SelectItem value="Dinh dưỡng">Dinh dưỡng</SelectItem>
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
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
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

export default NewsModal;
