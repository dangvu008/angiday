import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Settings, Heart, BookOpen, Award } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Yêu thích nấu ăn và khám phá những món ăn mới',
    location: 'Hà Nội, Việt Nam'
  });

  const handleSave = () => {
    // In real app, this would update user profile via API
    toast.success('Cập nhật thông tin thành công!');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ProtectedRoute requireAuth={true} showLoginRequired={true}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full border-4 border-orange-200"
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                    <p className="text-gray-600 mb-4">{formData.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user?.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Tham gia từ {new Date(user?.createdAt || '').toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user?.subscription?.type === 'premium' ? 'default' : 'secondary'}>
                      {user?.subscription?.type === 'premium' ? 'Premium' : 'Free'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Settings */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Thông tin cá nhân
                    </CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Địa điểm</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Giới thiệu</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats & Actions */}
              <div className="space-y-6">
                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Thống kê
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-sm">Yêu thích</span>
                      </div>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm">Công thức đã tạo</span>
                      </div>
                      <Badge variant="secondary">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Kế hoạch bữa ăn</span>
                      </div>
                      <Badge variant="secondary">3</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hành động nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      Đổi mật khẩu
                    </Button>
                    <Button className="w-full" variant="outline">
                      Cài đặt thông báo
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn đăng xuất?')) {
                          logout();
                        }
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
