
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API
  const news = [
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
  ];

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button>
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default NewsManagement;
