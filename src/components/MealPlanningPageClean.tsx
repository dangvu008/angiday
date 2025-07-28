import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, ChefHat, Users, Clock, Eye, Heart, Plus, ArrowRight, Coffee, Sun, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MealPlanningPageClean = () => {
  // Sample meal plans data
  const sampleMealPlans = [
    {
      id: 1,
      day: 'Thứ Hai',
      title: 'Thực đơn gia đình',
      description: 'Thực đơn cân bằng dinh dưỡng cho cả gia đình',
      totalTime: 180,
      totalDishes: 8,
      breakfast: [
        { name: 'Phở bò', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Trung bình' },
        { name: 'Bánh mì pate', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' }
      ],
      lunch: [
        { name: 'Cơm tấm sườn nướng', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '60 phút', difficulty: 'Trung bình' },
        { name: 'Canh chua cá', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Dễ' },
        { name: 'Rau muống xào tỏi', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Gà nướng mật ong', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '50 phút', difficulty: 'Trung bình' },
        { name: 'Salad rau củ', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' },
        { name: 'Chè đậu xanh', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Dễ' }
      ]
    },
    {
      id: 2,
      day: 'Thứ Ba',
      title: 'Thực đơn healthy',
      description: 'Thực đơn ít dầu mỡ, nhiều rau xanh',
      totalTime: 150,
      totalDishes: 7,
      breakfast: [
        { name: 'Cháo yến mạch', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ' },
        { name: 'Sinh tố bơ', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' }
      ],
      lunch: [
        { name: 'Salad gà nướng', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Dễ' },
        { name: 'Súp bí đỏ', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop', time: '35 phút', difficulty: 'Dễ' },
        { name: 'Bánh mì nguyên cám', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '5 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Cá hồi nướng', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Trung bình' },
        { name: 'Rau củ hấp', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ' }
      ]
    },
    {
      id: 3,
      day: 'Thứ Tư',
      title: 'Thực đơn truyền thống',
      description: 'Các món ăn truyền thống Việt Nam',
      totalTime: 200,
      totalDishes: 9,
      breakfast: [
        { name: 'Bún bò Huế', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', time: '60 phút', difficulty: 'Khó' },
        { name: 'Bánh cuốn', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình' }
      ],
      lunch: [
        { name: 'Bún chả Hà Nội', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Trung bình' },
        { name: 'Nem rán', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Trung bình' },
        { name: 'Nước mắm chấm', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Thịt kho tàu', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '50 phút', difficulty: 'Trung bình' },
        { name: 'Canh khổ qua nhồi thịt', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình' },
        { name: 'Dưa chua', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '5 phút', difficulty: 'Dễ' },
        { name: 'Cơm trắng', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ' }
      ]
    }
  ];

  // Continue with more meal plans...
  const allMealPlans = [
    ...sampleMealPlans,
    {
      id: 4,
      day: 'Thứ Năm',
      title: 'Thực đơn Á Đông',
      description: 'Hương vị châu Á đa dạng',
      totalTime: 170,
      totalDishes: 8,
      breakfast: [
        { name: 'Dimsum hấp', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Trung bình' },
        { name: 'Trà sữa', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' }
      ],
      lunch: [
        { name: 'Pad Thai', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Trung bình' },
        { name: 'Tom Yum', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Trung bình' },
        { name: 'Gỏi cuốn', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Sushi cá hồi', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Khó' },
        { name: 'Miso soup', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' },
        { name: 'Tempura rau củ', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Trung bình' }
      ]
    },
    {
      id: 5,
      day: 'Thứ Sáu',
      title: 'Thực đơn cuối tuần',
      description: 'Thực đơn đặc biệt cho ngày cuối tuần',
      totalTime: 220,
      totalDishes: 10,
      breakfast: [
        { name: 'Pancake', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Dễ' },
        { name: 'Trứng Benedict', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Trung bình' }
      ],
      lunch: [
        { name: 'Pizza margherita', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', time: '60 phút', difficulty: 'Trung bình' },
        { name: 'Caesar salad', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' },
        { name: 'Garlic bread', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Bò bít tết', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình' },
        { name: 'Khoai tây nghiền', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Dễ' },
        { name: 'Rượu vang đỏ', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '5 phút', difficulty: 'Dễ' },
        { name: 'Tiramisu', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Trung bình' },
        { name: 'Espresso', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '5 phút', difficulty: 'Dễ' }
      ]
    },
    {
      id: 6,
      day: 'Chủ Nhật',
      title: 'Thực đơn gia đình',
      description: 'Bữa ăn sum họp gia đình ấm cúng',
      totalTime: 240,
      totalDishes: 11,
      breakfast: [
        { name: 'Bánh xèo', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Trung bình' },
        { name: 'Nước dừa tươi', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '5 phút', difficulty: 'Dễ' }
      ],
      lunch: [
        { name: 'Lẩu thái', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop', time: '60 phút', difficulty: 'Trung bình' },
        { name: 'Bánh tráng nướng', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ' },
        { name: 'Rau sống', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' },
        { name: 'Bún tươi', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ' }
      ],
      dinner: [
        { name: 'Gà luộc', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '50 phút', difficulty: 'Dễ' },
        { name: 'Xôi gấc', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình' },
        { name: 'Chả cá Lã Vọng', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop', time: '35 phút', difficulty: 'Khó' },
        { name: 'Bánh chưng', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '120 phút', difficulty: 'Khó' },
        { name: 'Trà sen', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', time: '10 phút', difficulty: 'Dễ' }
      ]
    }
  ];

  // Suggested dishes that users can add to their meal plans
  const suggestedDishes = [
    { id: 1, name: 'Bánh mì thịt nướng', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '20 phút', difficulty: 'Dễ', category: 'Sáng', description: 'Bánh mì giòn với thịt nướng thơm lừng' },
    { id: 2, name: 'Cơm gà Hải Nam', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '60 phút', difficulty: 'Trung bình', category: 'Trưa', description: 'Cơm gà truyền thống với nước chấm đặc biệt' },
    { id: 3, name: 'Tôm rang me', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Dễ', category: 'Tối', description: 'Tôm tươi rang me chua ngọt hấp dẫn' },
    { id: 4, name: 'Chè ba màu', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '30 phút', difficulty: 'Dễ', category: 'Tráng miệng', description: 'Chè ba màu mát lạnh, ngọt ngào' },
    { id: 5, name: 'Bánh cuốn tôm chấy', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Trung bình', category: 'Sáng', description: 'Bánh cuốn mỏng với tôm chấy thơm ngon' },
    { id: 6, name: 'Cà ri gà', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '50 phút', difficulty: 'Trung bình', category: 'Trưa', description: 'Cà ri gà đậm đà với bánh mì hoặc cơm' },
    { id: 7, name: 'Gỏi đu đủ', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ', category: 'Khai vị', description: 'Gỏi đu đủ chua cay giòn ngon' },
    { id: 8, name: 'Bánh flan', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình', category: 'Tráng miệng', description: 'Bánh flan mềm mịn với caramel thơm' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'lunch': return <Sun className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      default: return <ChefHat className="h-4 w-4" />;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full mb-6">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-lg">Kế Hoạch Nấu Ăn</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thực Đơn <span className="text-orange-500">Chuyên Gia</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Được thiết kế bởi chuyên gia dinh dưỡng, mỗi thực đơn đảm bảo cân bằng
            <span className="font-semibold text-orange-600"> protein, carbs và vitamin</span> cần thiết cho cả gia đình
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="expert" className="mb-10">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-white shadow-lg border-0 p-1 rounded-full">
            <TabsTrigger
              value="expert"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300"
            >
              <ChefHat className="h-4 w-4" />
              <span className="font-medium">Chuyên gia</span>
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Tự tạo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expert">
            {/* Nutrition Needs Filter */}
            <div className="mb-10">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Chọn mục tiêu dinh dưỡng</h2>
                <p className="text-gray-600 text-sm">Thực đơn được tối ưu theo nhu cầu cụ thể của bạn</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Giảm khối mỡ thừa của cơ thể</span>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Thực đơn cân bằng dinh dưỡng</span>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Đỏ máu</span>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Giúp làm việc tỉ mỉ hiệu quả</span>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Hỗ trợ hệ tiêu hóa - thận - tim mạch</span>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 hover:opacity-90 hover:scale-105 transition-all duration-200 py-3 px-4 text-sm font-medium rounded-xl shadow-sm hover:shadow-md flex items-center justify-center">
                  <span className="text-center">Xây dựng khối cơ xương</span>
                </div>
              </div>
            </div>

            {/* Featured Meal Plans - Show 6 */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Thực đơn tiêu biểu
                </h3>
                <p className="text-gray-600 mb-8">
                  6 thực đơn được yêu thích nhất, được thiết kế bởi chuyên gia dinh dưỡng
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                {sampleMealPlans.map((plan, index) => (
                  <Card key={plan.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white rounded-2xl hover:-translate-y-2">
                    <CardHeader className="p-0">
                      <div className={`h-48 bg-gradient-to-br ${
                        index === 0 ? 'from-orange-400 to-red-500' :
                        index === 1 ? 'from-green-400 to-blue-500' :
                        'from-purple-400 to-pink-500'
                      } flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10 text-center text-white">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-90" />
                          <h4 className="text-xl font-bold">{plan.day}</h4>
                          <p className="text-sm opacity-90">{plan.title}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h5 className="font-bold text-lg text-gray-900 mb-2">{plan.title}</h5>
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{plan.totalTime} phút</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ChefHat className="h-4 w-4" />
                            <span>{plan.totalDishes} món</span>
                          </div>
                        </div>
                      </div>

                      {/* Meal breakdown */}
                      <div className="space-y-3 mb-6">
                        {/* Breakfast */}
                        <div className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Sáng</span>
                          </div>
                          <span className="text-xs text-amber-600">{plan.breakfast.length} món</span>
                        </div>

                        {/* Lunch */}
                        <div className="flex items-center justify-between py-2 px-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Trưa</span>
                          </div>
                          <span className="text-xs text-orange-600">{plan.lunch.length} món</span>
                        </div>

                        {/* Dinner */}
                        <div className="flex items-center justify-between py-2 px-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Tối</span>
                          </div>
                          <span className="text-xs text-purple-600">{plan.dinner.length} món</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        <Button variant="outline" size="icon" className="border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link to="/meal-plans">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Xem tất cả {allMealPlans.length} thực đơn
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Suggested Dishes Section */}
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-8 mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4">
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">Món ăn gợi ý</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Thêm món vào thực đơn của bạn
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Khám phá các món ăn đa dạng để bổ sung vào thực đơn hiện có,
                  tạo nên bữa ăn phong phú và hấp dẫn hơn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {suggestedDishes.map((dish) => (
                  <Card key={dish.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white rounded-xl hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getDifficultyColor(dish.difficulty)} text-xs font-medium`}>
                          {dish.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-700 text-xs font-medium">
                          {dish.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {dish.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{dish.time}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-50">
                          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Thêm vào thực đơn
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link to="/recipes">
                  <Button variant="outline" className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
                    Xem thêm món ăn
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sắp ra mắt!
              </h2>
              <p className="text-gray-600">
                Chức năng tự tạo thực đơn đang được phát triển
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanningPageClean;
