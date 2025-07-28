import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Calendar,
  ChefHat,
  Users,
  Clock,
  Heart,
  UserPlus,
  LogIn,
  Flame,
  Eye,
  Star,
  Coffee,
  Sun,
  Moon,
  Utensils,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Mic,
  MicOff,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample meal plans organized by meal time - Reference style from monngonmoingay.com
// IMPORTANT: Meal plan titles MUST be unique across all time periods to avoid user confusion
// Naming convention: "Bữa [Thời gian] [Đặc điểm chính]"
// Example: "Bữa Sáng Truyền Thống Việt Nam", "Bữa Trưa Hải Sản Tươi Ngon"
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
        },
        {
          name: 'Bún gạo xào thịt bò',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 4,
      title: 'Bữa Sáng Nhẹ Nhàng Healthy',
      difficulty: 'Dễ',
      calories: 290,
      people: 4,
      time: '18 Phút',
      views: 850,
      meals: [
        {
          name: 'Salad nui',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Nghêu kho nước tương',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 5,
      title: 'Bữa Sáng Phở Bò Đậm Đà',
      difficulty: 'Dễ',
      calories: 450,
      people: 4,
      time: '30 Phút',
      views: 1350,
      meals: [
        {
          name: 'Phở bò',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Cánh gà chiên lá quế',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 6,
      title: 'Bữa Sáng Bún Thang Hà Nội',
      difficulty: 'Trung bình',
      calories: 520,
      people: 4,
      time: '35 Phút',
      views: 1180,
      meals: [
        {
          name: 'Bún thang',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Canh tôm bồ ngót',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 7,
      title: 'Bữa Sáng Bún Riêu Cua Đồng',
      difficulty: 'Dễ',
      calories: 390,
      people: 4,
      time: '22 Phút',
      views: 920,
      meals: [
        {
          name: 'Bún riêu cua',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Tôm sú kho lá quế',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Lẩu cháo chim cút hạt sen',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
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
        },
        {
          name: 'Sườn non xốt giấm đỏ',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
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
        },
        {
          name: 'Mực xào sả ớt',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 10,
      title: 'Bữa Trưa Pancake Hoa Cúc Xinh',
      difficulty: 'Dễ',
      calories: 450,
      people: 4,
      time: '28 Phút',
      views: 980,
      meals: [
        {
          name: 'Pancake hoa cúc',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Bắp bò om gừng sả',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Ốc bươu xào tiêu xanh',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 11,
      title: 'Bữa Trưa Đậu Xanh Cốt Dừa',
      difficulty: 'Trung bình',
      calories: 520,
      people: 4,
      time: '32 Phút',
      views: 1250,
      meals: [
        {
          name: 'Pancake đậu xanh cốt dừa',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Sườn non xào chanh sả',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Tôm rim thịt thơm',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
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
        },
        {
          name: 'Mì bò cay xuyên tiêu',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
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
        },
        {
          name: 'Bò cuộn xúc xích chiên giòn',
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          logo: true
        }
      ]
    },
    {
      id: 14,
      title: 'Bữa Tối Phở Bò Bắp Hoa Đặc Biệt',
      difficulty: 'Trung bình',
      calories: 650,
      people: 4,
      time: '45 Phút',
      views: 1580,
      meals: [
        {
          name: 'Phở bò bắp hoa',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Canh sườn củ sen a-ti-sô',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          logo: true
        },
        {
          name: 'Súp gà mọc nấm hương',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
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

const MealPlanningGuestView: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('morning');
  const [selectedNutrition, setSelectedNutrition] = useState<string | null>(null);
  const [showSearchView, setShowSearchView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handlePlanSelect = (planId: number) => {
    // Chỉ cần đăng nhập cho tính năng cá nhân hóa, xem chi tiết thì không cần
    window.location.href = `/meal-plans/${planId}`;
  };

  const handlePersonalizedFeature = () => {
    alert('Vui lòng đăng nhập để sử dụng tính năng cá nhân hóa!');
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        handleSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói');
    }
  };

  // Handle search functionality
  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      // Combine all meal plans for search
      const allMealPlans = [
        ...mealPlansByTime.morning,
        ...mealPlansByTime.afternoon,
        ...mealPlansByTime.evening
      ];

      // Search in meal plans
      const results = allMealPlans.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.meals.some(meal => meal.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plan.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(results);
      setShowSearchView(true);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getMealIcon = (tab: string) => {
    switch (tab) {
      case 'morning': return <Coffee className="h-4 w-4" />;
      case 'afternoon': return <Sun className="h-4 w-4" />;
      case 'evening': return <Moon className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getCurrentMeals = () => {
    return mealPlansByTime[activeTab as keyof typeof mealPlansByTime] || [];
  };

  // Component for meal slider within each meal plan
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

      {/* Hero Header - Enhanced Reference Style */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Calendar className="h-6 w-6" />
              <span className="font-semibold text-lg">Kế Hoạch Nấu Ăn</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Thực Đơn <span className="text-yellow-200">Chuyên Gia</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
              Được thiết kế bởi chuyên gia dinh dưỡng, mỗi thực đơn đảm bảo cân bằng
              dinh dưỡng và phù hợp với khẩu vị Việt Nam
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-white focus-within:border-white transition-all duration-300" style={{ height: '64px' }}>
                {/* Search Icon */}
                <div className="absolute left-4 flex items-center justify-center" style={{ height: '64px' }}>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  placeholder={isListening ? "Đang nghe..." : "Tìm thực đơn theo món ăn, độ khó..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-full pl-14 pr-40 bg-transparent border-0 outline-none text-gray-700 placeholder:text-gray-500 text-lg rounded-full"
                />

                {/* Right Side Buttons */}
                <div className="absolute right-2 flex items-center gap-2" style={{ height: '64px' }}>
                  {/* Voice Search Button */}
                  <button
                    onClick={startVoiceSearch}
                    disabled={isListening}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      isListening
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'hover:bg-orange-50 hover:text-orange-600 text-gray-500'
                    }`}
                    title="Tìm kiếm bằng giọng nói"
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>

                  {/* Search Button */}
                  <button
                    onClick={() => handleSearch()}
                    className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 h-12 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Search Results View */}
        {showSearchView && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Kết quả tìm kiếm: "{searchQuery}"
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {searchResults.length} thực đơn
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <Button
                  variant="outline"
                  onClick={() => setShowSearchView(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </Button>
              </div>
            </div>

            {/* Search Results Grid/List */}
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {searchResults.map((plan) => (
                <Card key={plan.id} className={`group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <MealSlider meals={plan.meals} planTitle={plan.title} />
                  </div>
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{plan.title}</h3>
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
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy thực đơn nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử tìm kiếm với từ khóa khác hoặc xem tất cả thực đơn bên dưới
                </p>
                <Button
                  onClick={() => setShowSearchView(false)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Xem tất cả thực đơn
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Action Buttons - Enhanced Reference Style */}
        {!showSearchView && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => {
              // Scroll to meal plans section
              document.querySelector('[data-meal-plans]')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChefHat className="h-5 w-5 mr-2" />
            Thực Đơn Được Đề Xuất Bởi Chuyên Gia Dinh Dưỡng
          </Button>
          <Button
            variant="outline"
            className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            onClick={handlePersonalizedFeature}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Tự Lên Kế Hoạch Nấu Ăn
          </Button>
        </div>
        )}

        {/* Nutrition Needs Filter - Enhanced Reference Style */}
        {!showSearchView && (
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nhu cầu dinh dưỡng</h2>
            <p className="text-gray-600">Chọn mục tiêu dinh dưỡng phù hợp với bạn</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'weight-loss', name: 'Giảm khối mỡ thừa của cơ thể', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { id: 'balanced', name: 'Thực đơn cân bằng dinh dưỡng', color: 'bg-green-50 text-green-700 border-green-200' },
              { id: 'blood', name: 'Bổ máu', color: 'bg-red-50 text-red-700 border-red-200' },
              { id: 'brain', name: 'Giúp làm việc trí não hiệu quả', color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { id: 'digestive', name: 'Hỗ trợ hệ tiêu hóa - thận - tim mạch', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
              { id: 'muscle', name: 'Xây dựng khối cơ xương', color: 'bg-orange-50 text-orange-700 border-orange-200' }
            ].map((need) => (
              <button
                key={need.id}
                onClick={() => {
                  setSelectedNutrition(selectedNutrition === need.id ? null : need.id);
                  handlePersonalizedFeature();
                }}
                className={`px-4 py-2 text-sm font-medium border-2 rounded-full transition-all duration-200 hover:shadow-md ${
                  selectedNutrition === need.id
                    ? 'bg-orange-500 text-white border-orange-500'
                    : need.color + ' hover:scale-105'
                }`}
              >
                {need.name}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Meal Time Tabs - Enhanced Reference Style */}
        {!showSearchView && (
        <div className="mb-8" data-meal-plans>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Thực Đơn <span className="text-orange-500">Theo Thời Gian</span>
              </h2>
              <p className="text-gray-600">Khám phá thực đơn phù hợp cho từng bữa ăn</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
              onClick={() => window.location.href = '/meal-plans'}
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white border-2 border-gray-200 rounded-xl p-1 mb-8">
              <TabsTrigger
                value="morning"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg font-medium"
              >
                <Coffee className="h-4 w-4" />
                Sáng
              </TabsTrigger>
              <TabsTrigger
                value="afternoon"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg font-medium"
              >
                <Sun className="h-4 w-4" />
                Trưa
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg font-medium"
              >
                <Moon className="h-4 w-4" />
                Tối
              </TabsTrigger>
            </TabsList>

            {/* Meal Plans Content */}
            <TabsContent value="morning" className="mt-0">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {mealPlansByTime.morning.map((plan) => (
                    <CarouselItem key={plan.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{plan.title}</h3>
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

                          {/* Meal Slider */}
                          <MealSlider meals={plan.meals} planTitle={plan.title} />

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
                            onClick={() => handlePlanSelect(plan.id)}
                          >
                            Xem chi tiết
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
                <CarouselNext className="right-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
              </Carousel>
            </TabsContent>


            <TabsContent value="afternoon" className="mt-0">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {mealPlansByTime.afternoon.map((plan) => (
                    <CarouselItem key={plan.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{plan.title}</h3>
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

                          {/* Meal Slider */}
                          <MealSlider meals={plan.meals} planTitle={plan.title} />

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
                            onClick={() => handlePlanSelect(plan.id)}
                          >
                            Xem chi tiết
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
                <CarouselNext className="right-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
              </Carousel>
            </TabsContent>

            <TabsContent value="evening" className="mt-0">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {mealPlansByTime.evening.map((plan) => (
                    <CarouselItem key={plan.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{plan.title}</h3>
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

                          {/* Meal Slider */}
                          <MealSlider meals={plan.meals} planTitle={plan.title} />

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
                            onClick={() => handlePlanSelect(plan.id)}
                          >
                            Xem chi tiết
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
                <CarouselNext className="right-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>
        )}

        {/* Suggested Recipes Section - Horizontal Slider */}
        {!showSearchView && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Công Thức <span className="text-orange-500">Bạn Có Thể Thích</span>
              </h2>
              <p className="text-gray-600">Khám phá thêm những món ăn ngon được yêu thích nhất</p>
            </div>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl font-medium"
              onClick={() => window.location.href = '/recipes'}
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[
                { id: 1, name: 'Ốc xào khế', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=150&fit=crop', calories: 350, people: 4, difficulty: 'Dễ', time: '15 Phút', views: 1250 },
                { id: 2, name: 'Lẩu vịt hầm sả', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=150&fit=crop', calories: 316, people: 4, difficulty: 'Dễ', time: '35 Phút', views: 980 },
                { id: 3, name: 'Sườn chiên xốt mận', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=150&fit=crop', calories: 311, people: 4, difficulty: 'Dễ', time: '35 Phút', views: 1100 },
                { id: 4, name: 'Canh sườn hạt sen', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop', calories: 272, people: 4, difficulty: 'Dễ', time: '25 Phút', views: 850 },
                { id: 5, name: 'Trứng cút xào chua ngọt', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop', calories: 267, people: 4, difficulty: 'Dễ', time: '25 Phút', views: 1350 },
                { id: 6, name: 'Lẩu cá viên nấu sấu', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=150&fit=crop', calories: 216, people: 4, difficulty: 'Dễ', time: '30 Phút', views: 920 },
                { id: 7, name: 'Mực xào đậu Hà Lan', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop', calories: 164, people: 4, difficulty: 'Dễ', time: '5 Phút', views: 750 },
                { id: 8, name: 'Hủ tiếu mì xào', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=150&fit=crop', calories: 157, people: 4, difficulty: 'Dễ', time: '20 Phút', views: 680 },
                { id: 9, name: 'Bún gạo xào thịt bò', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=150&fit=crop', calories: 146, people: 4, difficulty: 'Dễ', time: '10 Phút', views: 1200 },
                { id: 10, name: 'Bắp cải tím trộn tôm', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop', calories: 144, people: 4, difficulty: 'Dễ', time: '25 Phút', views: 890 }
              ].map((recipe) => (
                <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <Card
                    className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1"
                    onClick={() => window.location.href = `/recipes/${recipe.id}`}
                  >
                    <div className="relative">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle favorite logic
                          }}
                        >
                          <Heart className="h-3 w-3 text-gray-600 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <div className="flex items-center gap-1 text-white text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Eye className="h-3 w-3" />
                          <span>{recipe.views}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                        {recipe.name}
                      </h3>
                      <div className="text-xs text-gray-600 space-y-1.5 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="font-medium">{recipe.calories}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-blue-500" />
                            <span>{recipe.people} Người</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <ChefHat className="h-3 w-3 text-green-500" />
                            <span>{recipe.difficulty}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-purple-500" />
                            <span>{recipe.time}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/recipes/${recipe.id}`;
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
            <CarouselNext className="right-4 h-10 w-10 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300" />
          </Carousel>
        </div>
        )}


        {/* Enhanced Login CTA */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-12 text-center text-white relative">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Tính năng Premium</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Muốn tạo kế hoạch nấu ăn cá nhân?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Đăng nhập để sử dụng đầy đủ tính năng drag & drop, theo dõi dinh dưỡng,
                và tạo thực đơn phù hợp với sở thích của bạn
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <ChefHat className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Thực đơn cá nhân</h4>
                  <p className="text-sm text-white/80">Tạo kế hoạch phù hợp với khẩu vị</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <Flame className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Theo dõi dinh dưỡng</h4>
                  <p className="text-sm text-white/80">Kiểm soát calories và chất dinh dưỡng</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Chia sẻ gia đình</h4>
                  <p className="text-sm text-white/80">Lên kế hoạch cho cả gia đình</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                  onClick={() => alert('Chức năng đăng ký sẽ được triển khai!')}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Đăng ký miễn phí
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200"
                  onClick={() => alert('Chức năng đăng nhập sẽ được triển khai!')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Đăng nhập
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/15 rounded-full blur-lg"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanningGuestView;
