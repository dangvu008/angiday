import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChefHat, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import MenuModal from './MenuModal';
import MenuDetailView from './MenuDetailView';
import { Menu } from '@/types/meal-planning';
import { useAuth } from '@/hooks/useAuth';

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();
  const { user, canEditMenu, canDeleteMenu } = useAuth();

  // Mock data - in real app this would come from API
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: '1',
      name: 'Thực đơn ăn chay',
      description: 'Tập hợp các món ăn chay bổ dưỡng và ngon miệng',
      type: 'full_day',
      recipes: [], // Will be populated with actual recipes
      totalCalories: 1800,
      totalCost: 150000,
      servings: 4,
      tags: ['chay', 'healthy', 'gia đình'],
      difficulty: 'Trung bình',
      totalCookingTime: 120,
      nutrition: {
        protein: 60,
        carbs: 250,
        fat: 50,
        fiber: 35
      },
      isPublic: true,
      createdBy: 'admin_789',
      createdByName: 'Admin',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      category: 'Ăn chay',
      cuisine: 'Việt Nam',
      targetAudience: ['family'],
      dietaryRestrictions: ['vegetarian'],
      usageCount: 45,
      rating: 4.5,
      reviews: 12
    },
    {
      id: '2',
      name: 'Thực đơn hải sản',
      description: 'Các món hải sản tươi ngon cho bữa tiệc',
      type: 'dinner',
      recipes: [],
      totalCalories: 2200,
      totalCost: 300000,
      servings: 6,
      tags: ['hải sản', 'tiệc tùng', 'cao cấp'],
      difficulty: 'Khó',
      totalCookingTime: 180,
      nutrition: {
        protein: 120,
        carbs: 180,
        fat: 80,
        fiber: 20
      },
      isPublic: true,
      createdBy: 'chef_456',
      createdByName: 'Chef Hải',
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      category: 'Hải sản',
      cuisine: 'Việt Nam',
      targetAudience: ['family', 'couple'],
      dietaryRestrictions: [],
      usageCount: 23,
      rating: 4.8,
      reviews: 8
    },
    {
      id: '3',
      name: 'Thực đơn ăn sáng nhanh',
      description: 'Các món ăn sáng đơn giản, nhanh gọn',
      type: 'breakfast',
      recipes: [],
      totalCalories: 450,
      totalCost: 50000,
      servings: 2,
      tags: ['ăn sáng', 'nhanh gọn', 'đơn giản'],
      difficulty: 'Dễ',
      totalCookingTime: 30,
      nutrition: {
        protein: 20,
        carbs: 60,
        fat: 15,
        fiber: 8
      },
      isPublic: false,
      createdBy: 'user_123', // Current user
      createdByName: 'Nguyễn Văn A',
      createdAt: '2024-01-18T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
      category: 'Ăn sáng',
      cuisine: 'Việt Nam',
      targetAudience: ['single', 'couple'],
      dietaryRestrictions: [],
      usageCount: 67,
      rating: 4.2,
      reviews: 15
    },
  ]);

  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedMenu(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleView = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDetailViewOpen(true);
  };

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thực đơn này?')) {
      setMenus(menus.filter(menu => menu.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa thực đơn thành công",
      });
    }
  };

  const handleUpdateMenu = (updatedMenu: Menu) => {
    setMenus(menus.map(menu =>
      menu.id === updatedMenu.id ? updatedMenu : menu
    ));
    toast({
      title: "Thành công",
      description: "Đã cập nhật thực đơn thành công",
    });
  };

  const handleDeleteFromDetail = (menuId: string) => {
    setMenus(menus.filter(menu => menu.id !== menuId));
    setIsDetailViewOpen(false);
    toast({
      title: "Thành công",
      description: "Đã xóa thực đơn thành công",
    });
  };

  const handleSave = (menuData: any) => {
    if (modalMode === 'add') {
      const newMenu: Menu = {
        ...menuData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        reviews: 0
      };
      setMenus([...menus, newMenu]);
      toast({
        title: "Thành công",
        description: "Đã thêm thực đơn mới thành công",
      });
    } else {
      setMenus(menus.map(menu => 
        menu.id === selectedMenu?.id ? { ...menu, ...menuData, updatedAt: new Date().toISOString() } : menu
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật thực đơn thành công",
      });
    }
    setIsModalOpen(false);
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'breakfast': { label: 'Ăn sáng', color: 'bg-yellow-100 text-yellow-800' },
      'lunch': { label: 'Ăn trưa', color: 'bg-orange-100 text-orange-800' },
      'dinner': { label: 'Ăn tối', color: 'bg-purple-100 text-purple-800' },
      'snack': { label: 'Ăn vặt', color: 'bg-pink-100 text-pink-800' },
      'full_day': { label: 'Cả ngày', color: 'bg-blue-100 text-blue-800' },
      'custom': { label: 'Tùy chỉnh', color: 'bg-gray-100 text-gray-800' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || typeMap.custom;
    return (
      <Badge className={typeInfo.color}>
        {typeInfo.label}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Dễ': 'bg-green-100 text-green-800',
      'Trung bình': 'bg-yellow-100 text-yellow-800',
      'Khó': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {difficulty}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Quản lý thực đơn
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Thực đơn là tập hợp các công thức nấu ăn được nhóm lại theo chủ đề
              </p>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo thực đơn mới
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

          {/* Menus Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thực đơn</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Độ khó</TableHead>
                <TableHead>Số món</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khẩu phần</TableHead>
                <TableHead>Chi phí</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{menu.name}</div>
                      <div className="text-sm text-muted-foreground">{menu.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(menu.type)}</TableCell>
                  <TableCell>{getDifficultyBadge(menu.difficulty)}</TableCell>
                  <TableCell>{menu.recipes.length} món</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {menu.totalCookingTime} phút
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {menu.servings} người
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(menu.totalCost)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>⭐ {menu.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({menu.reviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(menu)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEditMenu(menu.createdBy) && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(menu)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDeleteMenu(menu.createdBy) && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(menu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        menu={selectedMenu}
        mode={modalMode}
      />

      <MenuDetailView
        isOpen={isDetailViewOpen}
        onClose={() => setIsDetailViewOpen(false)}
        menu={selectedMenu}
        onUpdateMenu={handleUpdateMenu}
        onDeleteMenu={handleDeleteFromDetail}
      />
    </div>
  );
};

export default MenuManagement;
