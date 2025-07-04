
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MealPlanManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API
  const mealPlans = [
    {
      id: 1,
      title: 'Thực đơn 7 ngày cho bà bầu',
      type: 'Tuần',
      status: 'published',
      author: 'Admin',
      createdDate: '2024-01-15',
      views: 1250
    },
    {
      id: 2,
      title: 'Thực đơn giảm cân trong 30 ngày',
      type: 'Tháng',
      status: 'published',
      author: 'Chuyên gia dinh dưỡng',
      createdDate: '2024-01-10',
      views: 890
    },
    {
      id: 3,
      title: 'Thực đơn ăn sáng healthy',
      type: 'Lẻ',
      status: 'draft',
      author: 'Admin',
      createdDate: '2024-01-18',
      views: 0
    },
  ];

  const filteredMealPlans = mealPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'published' ? (
      <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'Lẻ': 'bg-blue-100 text-blue-800',
      'Ngày': 'bg-purple-100 text-purple-800',
      'Tuần': 'bg-orange-100 text-orange-800',
      'Tháng': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý thực đơn</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thực đơn
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm thực đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Meal Plans Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMealPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>{getTypeBadge(plan.type)}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>{plan.author}</TableCell>
                  <TableCell>{plan.createdDate}</TableCell>
                  <TableCell>{plan.views.toLocaleString()}</TableCell>
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

export default MealPlanManagement;
