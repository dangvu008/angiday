import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  ChefHat, 
  Users, 
  Clock, 
  Heart,
  Flame,
  Eye,
  Star,
  Coffee,
  Sun,
  Moon,
  Filter,
  Grid,
  List,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import meal plans data (same as MealPlanningGuestView)
const mealPlansByTime = {
  morning: [
    {
      id: 1,
      title: 'Bữa Sáng Truyền Thống Việt Nam',
      difficulty: 'Dễ',
      calories: 350,
      people: 4,
      time: '15 Phút',
      views: 1250,
      meals: [
        {
          name: 'Bún ốc',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Canh chua tôm rau muống',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Salad bít tết',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 2,
      title: 'Bữa Sáng Chay Thanh Đạm',
      difficulty: 'Trung bình',
      calories: 420,
      people: 4,
      time: '25 Phút',
      views: 980,
      meals: [
        {
          name: 'Hủ tiếu chay',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Đậu hũ hấp trứng',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Ức gà hấp cải thảo',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 3,
      title: 'Bữa Sáng Hải Sản Tươi Ngon',
      difficulty: 'Dễ',
      calories: 380,
      people: 4,
      time: '20 Phút',
      views: 1100,
      meals: [
        {
          name: 'Hủ tiếu mực',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Cá chép kho riềng',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    }
  ],
  afternoon: [
    {
      id: 8,
      title: 'Bữa Trưa Mì Ý Fusion',
      difficulty: 'Dễ',
      calories: 480,
      people: 4,
      time: '25 Phút',
      views: 1420,
      meals: [
        {
          name: 'Mì căn xốt nấm',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Tàu hủ ky rim nấm',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 9,
      title: 'Bữa Trưa Pancake Đầy Màu Sắc',
      difficulty: 'Trung bình',
      calories: 520,
      people: 4,
      time: '30 Phút',
      views: 1150,
      meals: [
        {
          name: 'Pancake sắc màu',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Gà rim ngũ vị',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    }
  ],
  evening: [
    {
      id: 12,
      title: 'Bữa Tối Cháo Ngưu Bàng Hải Sản',
      difficulty: 'Trung bình',
      calories: 620,
      people: 4,
      time: '40 Phút',
      views: 1680,
      meals: [
        {
          name: 'Cháo ngưu bàng hải sản',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Canh sườn đậu phộng xá bấu',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 13,
      title: 'Bữa Tối Cháo Hạt Sen Thanh Mát',
      difficulty: 'Dễ',
      calories: 580,
      people: 4,
      time: '35 Phút',
      views: 1320,
      meals: [
        {
          name: 'Cháo hạt sen bạch quả',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Cơm chiên thịt bò và phô mai',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    }
  ]
};

// Validation function to check for duplicate meal plan titles
const validateMealPlanTitles = () => {
  const allMealPlans = [
    ...mealPlansByTime.morning,
    ...mealPlansByTime.afternoon,
    ...mealPlansByTime.evening
  ];

  const titles = allMealPlans.map(plan => plan.title);
  const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);

  if (duplicates.length > 0) {
    console.warn('⚠️ Phát hiện tên thực đơn trùng lặp:', [...new Set(duplicates)]);
    return false;
  }

  console.log('✅ Tất cả tên thực đơn đều độc đáo');
  return true;
};

const AllMealPlansView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Validate meal plan titles on component mount
  React.useEffect(() => {
    validateMealPlanTitles();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800 border-green-200';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Khó': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Combine all meal plans
  const allMealPlans = [
    ...mealPlansByTime.morning.map(plan => ({ ...plan, timeOfDay: 'morning', timeLabel: 'Sáng' })),
    ...mealPlansByTime.afternoon.map(plan => ({ ...plan, timeOfDay: 'afternoon', timeLabel: 'Trưa' })),
    ...mealPlansByTime.evening.map(plan => ({ ...plan, timeOfDay: 'evening', timeLabel: 'Tối' }))
  ];

  // Filter meal plans
  const filteredMealPlans = allMealPlans.filter(plan => {
    const matchesTime = !selectedTime || plan.timeOfDay === selectedTime;
    const matchesDifficulty = !selectedDifficulty || plan.difficulty === selectedDifficulty;
    const matchesSearch = !searchQuery || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.meals.some(meal => meal.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTime && matchesDifficulty && matchesSearch;
  });

  // Meal Slider Component
  const MealSlider = ({ meals, planTitle }: { meals: any[], planTitle: string }) => (
    <div className="mb-4">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {meals.map((meal, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
              <div className="relative group">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                    {meal.name}
                  </h4>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {meals.length > 1 && (
          <>
            <CarouselPrevious className="left-1 h-6 w-6 bg-white/90 border-0 shadow-md hover:bg-white" />
            <CarouselNext className="right-1 h-6 w-6 bg-white/90 border-0 shadow-md hover:bg-white" />
          </>
        )}
      </Carousel>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Calendar className="h-6 w-6" />
              <span className="font-semibold text-lg">Tất Cả Thực Đơn</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khám Phá <span className="text-yellow-200">Thực Đơn</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Tổng hợp tất cả thực đơn được thiết kế bởi chuyên gia dinh dưỡng
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thực đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Time Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Thời gian:</span>
              {[
                { value: null, label: 'Tất cả', icon: null },
                { value: 'morning', label: 'Sáng', icon: Coffee },
                { value: 'afternoon', label: 'Trưa', icon: Sun },
                { value: 'evening', label: 'Tối', icon: Moon }
              ].map((time) => (
                <button
                  key={time.value || 'all'}
                  onClick={() => setSelectedTime(time.value)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time.icon && <time.icon className="h-4 w-4" />}
                  {time.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Độ khó:</span>
              {[
                { value: null, label: 'Tất cả' },
                { value: 'Dễ', label: 'Dễ' },
                { value: 'Trung bình', label: 'Trung bình' },
                { value: 'Khó', label: 'Khó' }
              ].map((difficulty) => (
                <button
                  key={difficulty.value || 'all'}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị {filteredMealPlans.length} thực đơn
          </p>
        </div>

        {/* Meal Plans Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredMealPlans.map((plan) => (
            <Card key={`${plan.timeOfDay}-${plan.id}`} className={`group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            }`}>
              <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                <MealSlider meals={plan.meals} planTitle={plan.title} />
              </div>
              <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{plan.title}</h3>
                    <p className="text-sm text-gray-500">{plan.timeLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getDifficultyColor(plan.difficulty)} text-xs font-medium border`}>
                      <ChefHat className="h-3 w-3 mr-1" />
                      {plan.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs">{plan.views}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{plan.calories}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{plan.people} Người</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{plan.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">{plan.meals.length} món ăn</span>
                  <button className="w-8 h-8 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-colors">
                    <Heart className="h-4 w-4 text-orange-500 hover:text-red-500 transition-colors" />
                  </button>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => window.location.href = `/meal-plans/${plan.id}`}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMealPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy thực đơn nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button
              onClick={() => {
                setSelectedTime(null);
                setSelectedDifficulty(null);
                setSearchQuery('');
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllMealPlansView;
