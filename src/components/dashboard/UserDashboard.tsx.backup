import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Flame, 
  Heart, 
  ChefHat, 
  TrendingUp,
  Lightbulb,
  Newspaper,
  ArrowRight,
  Star,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const todayMealPlan = {
    date: new Date().toLocaleDateString('vi-VN'),
    breakfast: {
      name: "Phở Gà",
      calories: 350,
      time: "07:00",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=200&fit=crop",
      status: "completed"
    },
    lunch: {
      name: "Cơm Tấm Sườn Nướng",
      calories: 650,
      time: "12:00", 
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop",
      status: "current"
    },
    dinner: {
      name: "Salad Tôm Nướng",
      calories: 420,
      time: "19:00",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
      status: "upcoming"
    }
  };

  const monthlyStats = {
    totalSpent: 2850000,
    budget: 3500000,
    caloriesTarget: 2000,
    caloriesConsumed: 1420,
    mealsCompleted: 23,
    totalMeals: 30
  };

  const recommendations = {
    recipes: [
      {
        id: 1,
        name: "Bún Bò Huế",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=150&fit=crop",
        rating: 4.8,
        cookTime: "45 phút",
        reason: "Phù hợp với khẩu vị cay nồng của bạn"
      },
      {
        id: 2,
        name: "Gỏi Cuốn Tôm Thịt",
        image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=200&h=150&fit=crop",
        rating: 4.6,
        cookTime: "20 phút",
        reason: "Món ăn nhẹ, ít calo"
      }
    ],
    menus: [
      {
        id: 1,
        name: "Thực đơn Eat Clean 7 ngày",
        meals: 21,
        calories: "1800-2000 cal/ngày",
        price: 450000,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=150&fit=crop"
      }
    ]
  };

  const tips = [
    {
      id: 1,
      title: "Cách bảo quản rau xanh tươi lâu",
      content: "Gói rau trong khăn giấy ẩm và bỏ vào túi nilon có lỗ thông hơi",
      category: "Mẹo vặt",
      readTime: "2 phút"
    },
    {
      id: 2,
      title: "Lợi ích của việc ăn sáng đầy đủ",
      content: "Ăn sáng giúp tăng cường trao đổi chất và cung cấp năng lượng cho cả ngày",
      category: "Dinh dưỡng",
      readTime: "3 phút"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'current': return 'bg-orange-100 text-orange-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'current': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp tới';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Today's Meal Plan */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-orange-600" />
              Thực đơn hôm nay - {todayMealPlan.date}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/meal-planner">
                Xem chi tiết
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].map((meal, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={meal.image} 
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(meal.status)}`}>
                    {getStatusText(meal.status)}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{meal.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {meal.time}
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      {meal.calories} cal
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Chi tiêu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {monthlyStats.totalSpent.toLocaleString('vi-VN')}đ
            </div>
            <Progress 
              value={(monthlyStats.totalSpent / monthlyStats.budget) * 100} 
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Còn lại: {(monthlyStats.budget - monthlyStats.totalSpent).toLocaleString('vi-VN')}đ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Flame className="h-4 w-4 mr-2" />
              Calo hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {monthlyStats.caloriesConsumed}/{monthlyStats.caloriesTarget}
            </div>
            <Progress 
              value={(monthlyStats.caloriesConsumed / monthlyStats.caloriesTarget) * 100} 
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Còn lại: {monthlyStats.caloriesTarget - monthlyStats.caloriesConsumed} cal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <ChefHat className="h-4 w-4 mr-2" />
              Bữa ăn hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {monthlyStats.mealsCompleted}/{monthlyStats.totalMeals}
            </div>
            <Progress 
              value={(monthlyStats.mealsCompleted / monthlyStats.totalMeals) * 100} 
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Tỷ lệ: {Math.round((monthlyStats.mealsCompleted / monthlyStats.totalMeals) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Xu hướng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">+12%</div>
            <p className="text-xs text-gray-600">
              Tăng so với tháng trước
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              Tích cực
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recipe Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Gợi ý công thức cho bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.recipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{recipe.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{recipe.reason}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                      {recipe.rating}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {recipe.cookTime}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/recipes/${recipe.id}`}>Xem</Link>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/recipes">
                Xem thêm công thức
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Menu Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
              Thực đơn đề xuất
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.menus.map((menu) => (
              <div key={menu.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{menu.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {menu.meals} bữa ăn
                      </div>
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-1" />
                        {menu.calories}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {menu.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm" asChild>
                  <Link to={`/thuc-don/detail/${menu.id}`}>Áp dụng thực đơn</Link>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/thuc-don">
                Khám phá thêm thực đơn
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips and News */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cooking Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Mẹo vặt hữu ích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.filter(tip => tip.category === 'Mẹo vặt').map((tip) => (
              <div key={tip.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {tip.readTime}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{tip.content}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/blog?category=tips">
                Xem thêm mẹo vặt
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Nutrition News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
              Tin tức dinh dưỡng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.filter(tip => tip.category === 'Dinh dưỡng').map((tip) => (
              <div key={tip.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {tip.readTime}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{tip.content}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/blog?category=nutrition">
                Xem thêm tin tức
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
