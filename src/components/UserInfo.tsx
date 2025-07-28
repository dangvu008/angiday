import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Settings, LogOut, Shield, ChefHat, 
  Calendar, Heart, BookOpen, Menu as MenuIcon 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserInfo = () => {
  const { user, logout, isAdmin, isChef } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Chưa đăng nhập</p>
          <Button className="mt-4">Đăng nhập</Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        label: 'Quản trị viên',
        color: 'bg-red-100 text-red-800',
        icon: Shield
      };
    }
    if (isChef) {
      return {
        label: 'Đầu bếp',
        color: 'bg-orange-100 text-orange-800',
        icon: ChefHat
      };
    }
    return {
      label: 'Người dùng',
      color: 'bg-blue-100 text-blue-800',
      icon: User
    };
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <Badge className={roleInfo.color}>
            <RoleIcon className="h-3 w-3 mr-1" />
            {roleInfo.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            ID: {user.id}
          </Badge>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quyền hạn:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-green-600">
              <BookOpen className="h-3 w-3" />
              <span>Xem công thức</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <MenuIcon className="h-3 w-3" />
              <span>Xem thực đơn</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Calendar className="h-3 w-3" />
              <span>Tạo kế hoạch</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Heart className="h-3 w-3" />
              <span>Yêu thích</span>
            </div>
            {isAdmin && (
              <>
                <div className="flex items-center gap-1 text-red-600">
                  <Shield className="h-3 w-3" />
                  <span>Quản trị</span>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <Settings className="h-3 w-3" />
                  <span>Cấu hình</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Thực đơn</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">5</div>
            <div className="text-xs text-gray-600">Kế hoạch</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-600">Yêu thích</div>
          </div>
        </div>

        {/* Preferences */}
        {user.preferences && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Sở thích:</h4>
            <div className="space-y-1">
              <div className="text-xs">
                <span className="text-gray-600">Trình độ:</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {user.preferences.skillLevel === 'beginner' ? 'Mới bắt đầu' :
                   user.preferences.skillLevel === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                </Badge>
              </div>
              {user.preferences.dietaryRestrictions.length > 0 && (
                <div className="text-xs">
                  <span className="text-gray-600">Chế độ ăn:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.preferences.dietaryRestrictions.map((restriction, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex-1 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>

        {/* Toggle Details */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-xs"
        >
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </Button>

        {/* Detailed Info */}
        {showDetails && (
          <div className="space-y-2 pt-3 border-t text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Ngày tham gia:</span>
              <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Vai trò:</span>
              <span>{roleInfo.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <Badge variant="outline" className="text-xs">Hoạt động</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInfo;
