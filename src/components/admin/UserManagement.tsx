
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UserModal from './UserModal';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'user' | 'premium';
  joinDate: string;
  lastLogin: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      email: 'mai.nguyen@email.com',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      email: 'nam.tran@email.com',
      status: 'active',
      role: 'premium',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19'
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      email: 'hoa.le@email.com',
      status: 'inactive',
      role: 'user',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-18'
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng thành công",
      });
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    const user = users.find(u => u.id === id);
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    toast({
      title: "Thành công",
      description: `Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`,
    });
  };

  const handleSave = (userData: any) => {
    if (modalMode === 'add') {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast({
        title: "Thành công",
        description: "Đã thêm người dùng mới thành công",
      });
    } else {
      setUsers(users.map(user => 
        user.id === selectedUser?.id ? { ...user, ...userData } : user
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin người dùng thành công",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return role === 'premium' ? (
      <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Thường</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý người dùng</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Loại tài khoản</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Lần cuối đăng nhập</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};

export default UserManagement;
