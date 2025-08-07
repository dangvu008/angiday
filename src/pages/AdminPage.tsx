
import React, { useState } from 'react';
import { Users, BookOpen, Newspaper, BarChart3, Settings, Home, ChefHat, Activity, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StandardLayout from '@/components/layout/StandardLayout';
import UserManagement from '@/components/admin/UserManagement';
import MealPlanManagement from '@/components/admin/MealPlanManagement';
import MenuManagement from '@/components/admin/MenuManagement';
import NewsManagement from '@/components/admin/NewsManagement';
import RecipeManagement from '@/components/admin/RecipeManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'recipes', label: 'Quản lý công thức', icon: ChefHat },
    { id: 'menus', label: 'Quản lý thực đơn', icon: Menu },
    { id: 'meal-plans', label: 'Quản lý kế hoạch ăn', icon: BookOpen },
    { id: 'news', label: 'Quản lý tin tức', icon: Newspaper },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AdminAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'recipes':
        return <RecipeManagement />;
      case 'menus':
        return <MenuManagement />;
      case 'meal-plans':
        return <MealPlanManagement />;
      case 'news':
        return <NewsManagement />;
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Các tùy chọn cài đặt sẽ được phát triển sau.</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Công thức</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">324</div>
                  <p className="text-xs text-muted-foreground">+18% từ tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Thực đơn</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+8% từ tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bài viết</CardTitle>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
                </CardContent>
              </Card>
            </div>

            {/* New Feature Announcement */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  🎉 Hệ thống Import Thông minh với Error Handling Chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <p className="mb-4">
                  Hệ thống import đã được nâng cấp toàn diện với khả năng validation thông minh,
                  hỗ trợ đa ngôn ngữ và kiểm tra chất lượng nội dung tự động!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium mb-2">🧠 Smart Extraction:</p>
                    <ul className="text-xs space-y-1">
                      <li>• JSON-LD & Microdata</li>
                      <li>• CSS Selectors thông minh</li>
                      <li>• Fallback methods</li>
                      <li>• Anti-block technology</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">🛡️ Validation System:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Kiểm tra URL tồn tại</li>
                      <li>• Phát hiện nội dung sai</li>
                      <li>• Đánh giá chất lượng</li>
                      <li>• Cảnh báo thông minh</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">🐛 Error Handling:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Thông báo lỗi chi tiết</li>
                      <li>• Debug information</li>
                      <li>• Gợi ý khắc phục</li>
                      <li>• Retry mechanisms</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">🌐 Multi-language:</p>
                    <div className="flex flex-wrap gap-1">
                      {['🇺🇸', '🇨🇳', '🇯🇵', '🇰🇷', '🇹🇭', '🇫🇷'].map((flag) => (
                        <span key={flag} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('recipes')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Thử ngay
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/smart-extraction', '_blank')}
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    🧠 Smart Extraction
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/anti-block', '_blank')}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    🛡️ Anti-Block
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/error-handling', '_blank')}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    🐛 Error Handling
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/validation-test', '_blank')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    ⚠️ Validation
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/multilang-import', '_blank')}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    🌐 Đa Ngôn Ngữ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/import-demo', '_blank')}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Demo Cơ Bản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <StandardLayout className="bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </StandardLayout>
  );
};

export default AdminPage;
