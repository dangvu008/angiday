import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Download,
  Calendar,
  ChefHat,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalRecipes: number;
  totalFavorites: number;
  viewsGrowth: number;
  usersGrowth: number;
}

export const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');

  // Mock data - trong thực tế sẽ fetch từ API
  const analyticsData: AnalyticsData = {
    totalViews: 15420,
    totalUsers: 3240,
    totalRecipes: 156,
    totalFavorites: 8730,
    viewsGrowth: 12.5,
    usersGrowth: 8.2
  };

  const viewsData = [
    { date: '2024-01-15', views: 1200, users: 320 },
    { date: '2024-01-16', views: 1350, users: 380 },
    { date: '2024-01-17', views: 1180, users: 290 },
    { date: '2024-01-18', views: 1420, users: 450 },
    { date: '2024-01-19', views: 1680, users: 520 },
    { date: '2024-01-20', views: 1590, users: 480 },
    { date: '2024-01-21', views: 1750, users: 580 }
  ];

  const topRecipes = [
    { name: 'Phở bò truyền thống', views: 2340, favorites: 890 },
    { name: 'Cơm rang dương châu', views: 1890, favorites: 670 },
    { name: 'Bánh mì thịt nướng', views: 1560, favorites: 520 },
    { name: 'Gỏi cuốn tôm thịt', views: 1340, favorites: 450 },
    { name: 'Bún bò Huế', views: 1120, favorites: 380 }
  ];

  const categoryData = [
    { name: 'Món chính', value: 45, color: '#8884d8' },
    { name: 'Món phụ', value: 25, color: '#82ca9d' },
    { name: 'Tráng miệng', value: 20, color: '#ffc658' },
    { name: 'Đồ uống', value: 10, color: '#ff7c7c' }
  ];

  const userEngagementData = [
    { time: '00:00', active: 45 },
    { time: '04:00', active: 23 },
    { time: '08:00', active: 189 },
    { time: '12:00', active: 312 },
    { time: '16:00', active: 278 },
    { time: '20:00', active: 421 },
    { time: '23:59', active: 156 }
  ];

  const exportData = () => {
    const data = {
      summary: analyticsData,
      topRecipes,
      viewsData,
      categoryData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất và xu hướng của website
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng lượt xem</p>
                <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.viewsGrowth}% so với tuần trước
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Người dùng</p>
                <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.usersGrowth}% so với tuần trước
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Công thức</p>
                <p className="text-2xl font-bold">{analyticsData.totalRecipes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Công thức đã đăng
                </p>
              </div>
              <ChefHat className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lượt yêu thích</p>
                <p className="text-2xl font-bold">{analyticsData.totalFavorites.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng lượt yêu thích
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-4">
        <TabsList>
          <TabsTrigger value="views">Lượt xem & Người dùng</TabsTrigger>
          <TabsTrigger value="recipes">Top công thức</TabsTrigger>
          <TabsTrigger value="categories">Phân loại</TabsTrigger>
          <TabsTrigger value="engagement">Tương tác</TabsTrigger>
        </TabsList>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng lượt xem và người dùng theo ngày</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Lượt xem"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Người dùng"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 công thức phổ biến nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topRecipes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" name="Lượt xem" />
                  <Bar dataKey="favorites" fill="#82ca9d" name="Yêu thích" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.value}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động người dùng theo giờ</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#ffc658" name="Người dùng hoạt động" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 phút trước', action: 'Người dùng mới đăng ký', user: 'nguyenvan@email.com' },
              { time: '5 phút trước', action: 'Công thức mới được yêu thích', recipe: 'Phở bò truyền thống' },
              { time: '10 phút trước', action: 'Bình luận mới', recipe: 'Cơm rang dương châu' },
              { time: '15 phút trước', action: 'Công thức được xem', recipe: 'Bánh mì thịt nướng' },
              { time: '20 phút trước', action: 'Người dùng mới đăng ký', user: 'tranmai@email.com' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  {activity.user && (
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  )}
                  {activity.recipe && (
                    <p className="text-sm text-muted-foreground">{activity.recipe}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};