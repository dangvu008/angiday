import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, ChefHat, Users, Clock, Coffee, Sun, Moon, Heart, Apple, Eye, Star, Search, Filter, SlidersHorizontal, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const MealPlanningPageSimple = () => {
  const [selectedDuration, setSelectedDuration] = useState('daily');
  const [selectedMealTime, setSelectedMealTime] = useState('all');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Suggested dishes data
  const suggestedDishes = [
    {
      name: 'Ốc xào khế',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      time: '15 phút',
      difficulty: 'Dễ',
      rating: 4.5,
      views: 350,
      servings: 4
    },
    {
      name: 'Lẩu vịt hầm sả',
      image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop',
      time: '35 phút',
      difficulty: 'Dễ',
      rating: 4.3,
      views: 316,
      servings: 4
    },
    {
      name: 'Sườn chiên xốt mận',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
      time: '35 phút',
      difficulty: 'Dễ',
      rating: 4.4,
      views: 311,
      servings: 4
    },
    {
      name: 'Canh sườn hạt sen',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      time: '25 phút',
      difficulty: 'Dễ',
      rating: 4.2,
      views: 272,
      servings: 4
    },
    {
      name: 'Bánh cuốn tôm chấy',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      time: '45 phút',
      difficulty: 'Trung bình',
      rating: 4.6,
      views: 428,
      servings: 4
    },
    {
      name: 'Cà ri gà',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
      time: '50 phút',
      difficulty: 'Trung bình',
      rating: 4.7,
      views: 523,
      servings: 4
    }
  ];

  // Handle scroll to update current slide indicator
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const cardWidth = window.innerWidth < 640 ? 256 + 24 : 288 + 24; // w-64 + gap on mobile, w-72 + gap on desktop
    const scrollLeft = container.scrollLeft;
    const newSlide = Math.round(scrollLeft / cardWidth);
    setCurrentSlide(Math.min(Math.max(newSlide, 0), suggestedDishes.length - 1));
  };

  // Navigate to specific slide
  const goToSlide = (slideIndex: number) => {
    const container = document.getElementById('dishes-scroll-container');
    if (container) {
      const cardWidth = window.innerWidth < 640 ? 256 + 24 : 288 + 24; // w-64 + gap on mobile, w-72 + gap on desktop
      container.scrollTo({ left: slideIndex * cardWidth, behavior: 'smooth' });
      setCurrentSlide(slideIndex);
    }
  };

  // Navigate to previous slide
  const goToPrevSlide = () => {
    const newSlide = Math.max(currentSlide - 1, 0);
    goToSlide(newSlide);
  };

  // Navigate to next slide
  const goToNextSlide = () => {
    const newSlide = Math.min(currentSlide + 1, suggestedDishes.length - 1);
    goToSlide(newSlide);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < suggestedDishes.length - 1) {
      goToNextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      goToPrevSlide();
    }
  };

  // Duration categories (main tabs)
  const durationCategories = [
    {
      id: 'daily',
      name: 'Thực đơn ngày',
      icon: '📅',
      description: 'Thực đơn cho 1 ngày'
    },
    {
      id: 'weekly', 
      name: 'Thực đơn tuần',
      icon: '📆',
      description: 'Thực đơn cho 7 ngày'
    },
    {
      id: 'monthly',
      name: 'Thực đơn tháng', 
      icon: '🗓️',
      description: 'Thực đơn cho 30 ngày'
    },
    {
      id: 'special',
      name: 'Thực đơn lễ',
      icon: '🎉',
      description: 'Thực đơn sự kiện đặc biệt'
    }
  ];

  // Purpose categories for filtering
  const purposeCategories = [
    {
      id: 'all',
      name: 'Tất cả mục đích',
      icon: '🍽️',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      activeColor: 'bg-orange-500 text-white border-orange-500'
    },
    {
      id: 'weight-loss',
      name: 'Giảm cân',
      icon: '⚖️',
      color: 'bg-green-50 text-green-700 border-green-200',
      activeColor: 'bg-green-500 text-white border-green-500'
    },
    {
      id: 'muscle-gain',
      name: 'Tăng cơ',
      icon: '💪',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      activeColor: 'bg-blue-500 text-white border-blue-500'
    },
    {
      id: 'heart-healthy',
      name: 'Tim mạch',
      icon: '❤️',
      color: 'bg-red-50 text-red-700 border-red-200',
      activeColor: 'bg-red-500 text-white border-red-500'
    },
    {
      id: 'diabetes',
      name: 'Tiểu đường',
      icon: '🩺',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      activeColor: 'bg-purple-500 text-white border-purple-500'
    },
    {
      id: 'vegetarian',
      name: 'Ăn chay',
      icon: '🥬',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeColor: 'bg-emerald-500 text-white border-emerald-500'
    },
    {
      id: 'family',
      name: 'Gia đình',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      activeColor: 'bg-yellow-500 text-white border-yellow-500'
    }
  ];

  // Meal time categories for filtering
  const mealTimeCategories = [
    {
      id: 'all',
      name: 'Cả ngày',
      icon: '🍽️',
      description: 'Sáng + Trưa + Tối'
    },
    {
      id: 'breakfast',
      name: 'Sáng',
      icon: '☀️',
      description: 'Bữa sáng'
    },
    {
      id: 'lunch',
      name: 'Trưa',
      icon: '🌞',
      description: 'Bữa trưa'
    },
    {
      id: 'dinner',
      name: 'Tối',
      icon: '🌙',
      description: 'Bữa tối'
    }
  ];

  // Sample meal plans data with new structure
  const mealPlans = [
    {
      id: 1,
      title: 'Thực đơn giảm cân 1 ngày',
      duration: 'daily',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['weight-loss'],
      servings: 2,
      difficulty: 'easy',
      totalCalories: 1200,
      estimatedCost: 150000,
      meals: [
        {
          name: 'Bún ốc',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '45 phút',
          difficulty: 'Trung bình',
          rating: 4.5,
          views: 1250
        },
        {
          name: 'Canh chua tôm rau muống',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Dễ',
          rating: 4.2,
          views: 980
        },
        {
          name: 'Salad bít tết',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Trung bình',
          rating: 4.7,
          views: 1580
        }
      ]
    },
    {
      id: 2,
      title: 'Thực đơn tăng cơ 1 tuần',
      duration: 'weekly',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['muscle-gain'],
      servings: 4,
      difficulty: 'medium',
      totalCalories: 2500,
      estimatedCost: 800000,
      meals: [
        {
          name: 'Hủ tiếu chay',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '35 phút',
          difficulty: 'Dễ',
          rating: 4.3,
          views: 890
        },
        {
          name: 'Đậu hũ hấp trứng',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          rating: 4.1,
          views: 750
        },
        {
          name: 'Ức gà hấp cải thảo',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          rating: 4.4,
          views: 920
        }
      ]
    },
    {
      id: 3,
      title: 'Thực đơn gia đình 1 tháng',
      duration: 'monthly',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['family'],
      servings: 6,
      difficulty: 'easy',
      totalCalories: 2000,
      estimatedCost: 2000000,
      meals: [
        {
          name: 'Cơm tấm sườn nướng',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          time: '40 phút',
          difficulty: 'Trung bình',
          rating: 4.6,
          views: 1500
        },
        {
          name: 'Canh khổ qua nhồi thịt',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '35 phút',
          difficulty: 'Trung bình',
          rating: 4.3,
          views: 1200
        },
        {
          name: 'Gỏi cuốn tôm thịt',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          rating: 4.5,
          views: 1800
        }
      ]
    },
    {
      id: 4,
      title: 'Thực đơn Tết truyền thống',
      duration: 'special',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['family'],
      servings: 8,
      difficulty: 'hard',
      totalCalories: 3000,
      estimatedCost: 1500000,
      meals: [
        {
          name: 'Bánh chưng',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
          time: '8 giờ',
          difficulty: 'Khó',
          rating: 4.8,
          views: 2000
        },
        {
          name: 'Thịt kho tàu',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          time: '1.5 giờ',
          difficulty: 'Trung bình',
          rating: 4.7,
          views: 1800
        },
        {
          name: 'Dưa hành muối',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Dễ',
          rating: 4.2,
          views: 1200
        }
      ]
    },
    {
      id: 5,
      title: 'Thực đơn tim mạch 1 ngày',
      duration: 'daily',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['heart-healthy'],
      servings: 2,
      difficulty: 'easy',
      totalCalories: 1400,
      estimatedCost: 180000,
      meals: [
        {
          name: 'Cháo yến mạch',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          rating: 4.1,
          views: 800
        }
      ]
    },
    {
      id: 6,
      title: 'Thực đơn chay 1 tuần',
      duration: 'weekly',
      mealTimes: ['breakfast', 'lunch', 'dinner'],
      purposes: ['vegetarian'],
      servings: 3,
      difficulty: 'medium',
      totalCalories: 1800,
      estimatedCost: 600000,
      meals: [
        {
          name: 'Đậu hũ xào rau củ',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Dễ',
          rating: 4.4,
          views: 1100
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Calendar className="h-6 w-6" />
              <span className="font-semibold text-lg">Kế Hoạch Nấu Ăn Chuyên Nghiệp</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Thực Đơn <span className="text-yellow-300">Chuyên Gia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Lên kế hoạch nấu ăn thông minh với thực đơn được thiết kế bởi chuyên gia dinh dưỡng
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kế Hoạch <span className="text-orange-500">Nấu Ăn</span>
          </h1>
          <p className="text-gray-600">
            Thực đơn được đề xuất bởi chuyên gia dinh dưỡng
          </p>
        </div>

        {/* Nutrition Needs Filter */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-700">Nhu cầu dinh dưỡng:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {purposeCategories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedPurpose(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPurpose === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Time Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
              {mealTimeCategories.slice(1).map((mealTime) => (
                <button
                  key={mealTime.id}
                  onClick={() => setSelectedMealTime(mealTime.id)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedMealTime === mealTime.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mealTime.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Plans Grid - Inspired by reference design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {mealPlans
            .filter(plan => selectedPurpose === 'all' || plan.purposes.includes(selectedPurpose))
            .map((plan, index) => (
              <div key={plan.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Plan Header */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">Thực đơn: {index + 1}</h3>
                  <p className="text-sm text-gray-600">{plan.title}</p>
                </div>

                {/* Meals List */}
                <div className="p-4 space-y-3">
                  {plan.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{meal.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meal.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            {meal.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {meal.views}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(meal.difficulty)}`}>
                          {meal.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Plan Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-600">
                      <Users className="h-4 w-4 inline mr-1" />
                      {plan.servings} người
                    </span>
                    <span className="text-gray-600">
                      {plan.totalCalories} kcal
                    </span>
                    <span className="text-green-600 font-medium">
                      {plan.estimatedCost.toLocaleString()}đ
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {/* Suggested Dishes Section - Reference Style */}
        <div className="bg-white border-t border-gray-200 pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Công Thức <span className="text-orange-500">Bạn Có Thể Thích</span>
            </h3>
          </div>

          {/* Dishes Grid - Reference Style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {suggestedDishes.map((dish, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dish.difficulty)}`}>
                      {dish.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {dish.name}
                  </h4>

                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex items-center justify-between">
                      <span>{dish.views}</span>
                      <span>{dish.servings} Người</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {dish.rating}
                      </span>
                      <span>{dish.time}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanningPageSimple;
