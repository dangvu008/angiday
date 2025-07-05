
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import NewsModal from './NewsModal';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  publishDate: string;
  views: number;
}

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: '10 Thực phẩm tốt nhất cho sức khỏe tim mạch',
      category: 'Sức khỏe',
      status: 'published',
      author: 'Bác sĩ Phạm Thị Lan',
      publishDate: '2024-01-15',
      views: 2150
    },
    {
      id: 2,
      title: 'Cách chế biến món ăn healthy cho cả gia đình',
      category: 'Nấu ăn',
      status: 'published',
      author: 'Chef Nguyễn Văn A',
      publishDate: '2024-01-12',
      views: 1890
    },
    {
      id: 3,
      title: 'Xu hướng ăn uống 2024: Plant-based diet',
      category: 'Xu hướng',
      status: 'draft',
      author: 'Admin',
      publishDate: '2024-01-18',
      views: 0
    },
  ]);

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedNews(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setNews(news.filter(item => item.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết thành công",
      });
    }
  };

  const handleSave = (newsData: any) => {
    if (modalMode === 'add') {
      const newNews = {
        ...newsData,
        id: Math.max(...news.map(n => n.id)) + 1,
        publishDate: new Date().toISOString().split('T')[0],
        views: 0
      };
      setNews([...news, newNews]);
      toast({
        title: "Thành công",
        description: "Đã thêm bài viết mới thành công",
      });
    } else {
      setNews(news.map(item => 
        item.id === selectedNews?.id ? { ...item, ...newsData } : item
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật bài viết thành công",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' ? (
      <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Sức khỏe': 'bg-blue-100 text-blue-800',
      'Nấu ăn': 'bg-orange-100 text-orange-800',
      'Xu hướng': 'bg-purple-100 text-purple-800',
      'Dinh dưỡng': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý tin tức</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm bài viết
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* News Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày xuất bản</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.publishDate}</TableCell>
                  <TableCell>{item.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        news={selectedNews}
        mode={modalMode}
      />
    </div>
  );
};

export default NewsManagement;
