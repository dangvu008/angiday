import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Calendar,
  ChefHat,
  Users,
  Clock,
  Star,
  Eye,
  Heart,
  Lock,
  UserPlus,
  LogIn,
  ArrowRight,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MealPlanningAdvanced from '@/components/MealPlanningAdvanced';
import LoginModal from '@/components/auth/LoginModal';

// Sample meal plans for guest users - Reference style
const sampleMealPlans = [
  {
    id: 1,
    difficulty: 'Dễ',
    calories: '1200 kcal',
    meals: [
      { name: 'Bún ốc', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop' },
      { name: 'Canh chua tôm rau muống', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=100&fit=crop' },
      { name: 'Salad bít tết', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 2,
    difficulty: 'Trung bình',
    calories: '1400 kcal',
    meals: [
      { name: 'Hủ tiếu chay', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=100&fit=crop' },
      { name: 'Đậu hũ hấp trứng', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=100&fit=crop' },
      { name: 'Ức gà hấp cải thảo', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 3,
    difficulty: 'Dễ',
    calories: '1600 kcal',
    meals: [
      { name: 'Hủ tiếu mực', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop' },
      { name: 'Cá chép kho riềng', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=100&fit=crop' },
      { name: 'Bún gạo xào thịt bò', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 4,
    difficulty: 'Dễ',
    calories: '1300 kcal',
    meals: [
      { name: 'Salad nui', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=100&fit=crop' },
      { name: 'Nghêu kho nước tương', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=100&fit=crop' },
      { name: 'Mì trộn xốt mayonnaise', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 5,
    difficulty: 'Dễ',
    calories: '1500 kcal',
    meals: [
      { name: 'Phở bò', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop' },
      { name: 'Cánh gà chiên lá quế', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=150&h=100&fit=crop' },
      { name: 'Trà đào cam sả', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 6,
    difficulty: 'Trung bình',
    calories: '1700 kcal',
    meals: [
      { name: 'Bún thang', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop' },
      { name: 'Canh tôm bồ ngót', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=100&fit=crop' },
      { name: 'Nui xào hải sản', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=100&fit=crop' }
    ]
  }
];

const MealPlanningHub: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlanSelect = (planId: number) => {
    if (!isAuthenticated) {
      setSelectedPlan(planId);
      setShowLoginModal(true);
    } else {
      // Navigate to personalized meal planning
      window.location.href = '/meal-planner';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the advanced meal planning interface
  if (isAuthenticated) {
    return <MealPlanningAdvanced />;
  }

  // Guest user interface - Following reference design
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Simple Header - Reference Style */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Kế Hoạch <span className="text-orange-500">Nấu Ăn</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Thực Đơn Được Đề Xuất Bởi Chuyên Gia Dinh Dưỡng
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Action Buttons - Reference Style */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            onClick={() => setShowLoginModal(true)}
          >
            Thực Đơn Được Đề Xuất Bởi Chuyên Gia Dinh Dưỡng
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium"
            onClick={() => setShowLoginModal(true)}
          >
            Tự Lên Kế Hoạch Nấu Ăn
          </Button>
        </div>

        {/* Nutrition Needs Filter - Reference Style */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-700">Nhu cầu dinh dưỡng:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Giảm khối mỡ thừa của cơ thể',
              'Thực đơn cân bằng dinh dưỡng',
              'Bổ máu',
              'Giúp làm việc trí não hiệu quả',
              'Hỗ trợ hệ tiêu hóa - thận - tim mạch',
              'Xây dựng khối cơ xương'
            ].map((need, index) => (
              <button
                key={index}
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Time Tabs - Reference Style */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {['Sáng', 'Trưa', 'Tối'].map((time) => (
              <button
                key={time}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Plans Grid - Reference Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sampleMealPlans.map((plan) => (
            <Card key={plan.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Thực đơn: {plan.id}</h3>
                  <Badge className={`${getDifficultyColor(plan.difficulty)} text-xs`}>
                    {plan.difficulty}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {plan.meals.map((meal, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{meal.name}</p>
                      </div>
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>2 người</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    <span>{plan.calories}</span>
                  </div>
                </div>

                <div className="text-right mb-3">
                  <span className="text-lg font-bold text-orange-600">150,000đ</span>
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Suggested Recipes Section - Reference Style */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Công Thức <span className="text-orange-500">Bạn Có Thể Thích</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Ốc xào khế', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop', calories: 350, people: 4, difficulty: 'Dễ', time: '15 Phút' },
              { name: 'Lẩu vịt hầm sả', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=150&h=100&fit=crop', calories: 316, people: 4, difficulty: 'Dễ', time: '35 Phút' },
              { name: 'Sườn chiên xốt mận', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=100&fit=crop', calories: 311, people: 4, difficulty: 'Dễ', time: '35 Phút' },
              { name: 'Canh sườn hạt sen', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=100&fit=crop', calories: 272, people: 4, difficulty: 'Dễ', time: '25 Phút' },
              { name: 'Trứng cút xào chua ngọt', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=100&fit=crop', calories: 267, people: 4, difficulty: 'Dễ', time: '25 Phút' },
              { name: 'Lẩu cá viên nấu sấu', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&h=100&fit=crop', calories: 216, people: 4, difficulty: 'Dễ', time: '30 Phút' }
            ].map((recipe, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowLoginModal(true)}>
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {recipe.name}
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{recipe.calories}</span>
                      <span>{recipe.people} Người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <ChefHat className="h-3 w-3" />
                        <span>{recipe.difficulty}</span>
                      </div>
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLoginModal(true);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        <div className="text-center bg-orange-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Muốn tạo kế hoạch nấu ăn cá nhân?
          </h3>
          <p className="text-gray-600 mb-4">
            Đăng nhập để sử dụng đầy đủ tính năng drag & drop và theo dõi dinh dưỡng
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
              onClick={() => setShowLoginModal(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Đăng ký miễn phí
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-2"
              onClick={() => setShowLoginModal(true)}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập
            </Button>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setSelectedPlan(null);
        }}
        selectedPlanId={selectedPlan}
      />

      <Footer />
    </div>
  );
};

export default MealPlanningHub;
