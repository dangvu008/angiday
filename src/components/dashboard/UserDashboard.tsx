import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Users,
  Utensils,
  CheckCircle,
  PlayCircle,
  Eye,
  Timer,
  ShoppingCart,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CompactShoppingStatus from '@/components/meal-planning/CompactShoppingStatus';
import SmartShoppingList from '@/components/meal-planning/SmartShoppingList';
import CookingMode from '@/components/meal-planning/CookingMode';
import { AnyPlan } from '@/types/meal-planning';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AnyPlan | null>(null);

  // Demo user ID - trong thực tế sẽ lấy từ auth context
  const userId = 'demo-user-123';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Trigger animation on mount
    setTimeout(() => setAnimateCards(true), 100);

    return () => clearInterval(timer);
  }, []);

  const getCurrentMealStatus = () => {
    const hour = currentTime.getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 15) return 'lunch';
    return 'dinner';
  };

  const currentMeal = getCurrentMealStatus();

  // Handlers for shopping and cooking
  const handleStartShopping = (shoppingListId: string) => {
    setShowShoppingList(true);
  };

  const handleStartCooking = (planId: string) => {
    if (selectedPlan) {
      setShowCookingMode(true);
    }
  };

  // Mock data - trong thực tế sẽ lấy từ API
  const todayMealPlan = {
    date: new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    breakfast: {
      mealType: "Sáng",
      time: "07:00",
      status: "completed",
      dishes: [
        {
          id: "1",
          name: "Phở Gà",
          calories: 350,
          image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=200&fit=crop",
          description: "Món phở truyền thống với nước dùng trong vắt, thịt gà mềm",
          cookTime: "45 phút"
        },
        {
          id: "2",
          name: "Bánh Mì Pate",
          calories: 280,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
          description: "Bánh mì giòn với pate thơm ngon",
          cookTime: "10 phút"
        }
      ]
    },
    lunch: {
      mealType: "Trưa",
      time: "12:00",
      status: "current",
      dishes: [
        {
          id: "3",
          name: "Cơm Tấm Sườn Nướng",
          calories: 450,
          image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop",
          description: "Cơm tấm thơm ngon với sườn nướng đậm đà",
          cookTime: "30 phút"
        },
        {
          id: "4",
          name: "Canh Chua Cá",
          calories: 120,
          image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
          description: "Canh chua thanh mát với cá tươi",
          cookTime: "25 phút"
        },
        {
          id: "5",
          name: "Rau Muống Xào Tỏi",
          calories: 80,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
          description: "Rau muống xanh giòn xào tỏi thơm",
          cookTime: "10 phút"
        }
      ]
    },
    dinner: {
      mealType: "Tối",
      time: "19:00",
      status: "upcoming",
      dishes: [
        {
          id: "6",
          name: "Salad Tôm Nướng",
          calories: 320,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
          description: "Salad tươi mát với tôm nướng giàu protein",
          cookTime: "20 phút"
        },
        {
          id: "7",
          name: "Súp Bí Đỏ",
          calories: 100,
          image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop",
          description: "Súp bí đỏ ngọt thanh, bổ dưỡng",
          cookTime: "30 phút"
        }
      ]
    }
  };

  // Convert todayMealPlan to AnyPlan format for shopping status
  const todayPlan: AnyPlan = {
    id: 'today-plan',
    name: 'Thực đơn hôm nay',
    description: 'Kế hoạch bữa ăn cho ngày hôm nay',
    type: 'day',
    createdBy: userId,
    createdByName: 'Bạn',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Hôm nay', 'Gia đình'],
    isTemplate: false,
    isPublic: false,
    totalCalories: 1420,
    totalCost: 250000,
    nutrition: {
      protein: 85,
      carbs: 180,
      fat: 45,
      fiber: 12
    },
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: {
        id: 'breakfast-today',
        dishes: todayMealPlan.breakfast.dishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          image: dish.image,
          cookingTime: parseInt(dish.cookTime) || 30,
          difficulty: 'easy' as const,
          rating: 4.5,
          views: 100,
          servings: 2,
          calories: dish.calories,
          nutrition: {
            protein: dish.calories * 0.15 / 4,
            carbs: dish.calories * 0.55 / 4,
            fat: dish.calories * 0.30 / 9,
            fiber: 3
          },
          ingredients: [
            'Thịt gà', 'Bánh phở', 'Hành lá', 'Ngò gai', 'Giá đỗ',
            'Bánh mì', 'Pate', 'Dưa leo', 'Cà chua'
          ],
          instructions: [
            'Chuẩn bị nguyên liệu',
            'Nấu nước dùng',
            'Trần bánh phở',
            'Bày món và thưởng thức'
          ],
          tags: ['Sáng', 'Việt Nam'],
          category: 'Món chính',
          cost: 50000
        })),
        totalCalories: 630,
        totalCost: 100000,
        totalCookingTime: 55,
        calorieDistribution: {}
      },
      lunch: {
        id: 'lunch-today',
        dishes: todayMealPlan.lunch.dishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          image: dish.image,
          cookingTime: parseInt(dish.cookTime) || 30,
          difficulty: 'medium' as const,
          rating: 4.7,
          views: 150,
          servings: 3,
          calories: dish.calories,
          nutrition: {
            protein: dish.calories * 0.20 / 4,
            carbs: dish.calories * 0.50 / 4,
            fat: dish.calories * 0.30 / 9,
            fiber: 4
          },
          ingredients: [
            'Cơm tấm', 'Sườn heo', 'Nước mắm', 'Đường', 'Tỏi',
            'Cá basa', 'Me', 'Cà chua', 'Dứa', 'Đậu bắp',
            'Rau muống', 'Tỏi', 'Dầu ăn', 'Nước mắm'
          ],
          instructions: [
            'Ướp sườn với gia vị',
            'Nướng sườn trên than',
            'Nấu canh chua',
            'Xào rau muống',
            'Bày món hoàn chỉnh'
          ],
          tags: ['Trưa', 'Việt Nam'],
          category: 'Món chính',
          cost: 80000
        })),
        totalCalories: 650,
        totalCost: 120000,
        totalCookingTime: 65,
        calorieDistribution: {}
      },
      dinner: {
        id: 'dinner-today',
        dishes: todayMealPlan.dinner.dishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          image: dish.image,
          cookingTime: parseInt(dish.cookTime) || 30,
          difficulty: 'easy' as const,
          rating: 4.3,
          views: 80,
          servings: 2,
          calories: dish.calories,
          nutrition: {
            protein: dish.calories * 0.25 / 4,
            carbs: dish.calories * 0.45 / 4,
            fat: dish.calories * 0.30 / 9,
            fiber: 5
          },
          ingredients: [
            'Tôm', 'Salad', 'Dầu olive', 'Chanh',
            'Bí đỏ', 'Hành tây', 'Tỏi', 'Kem tươi'
          ],
          instructions: [
            'Nướng tôm với gia vị',
            'Trộn salad tươi',
            'Nấu súp bí đỏ',
            'Trang trí và thưởng thức'
          ],
          tags: ['Tối', 'Healthy'],
          category: 'Món nhẹ',
          cost: 70000
        })),
        totalCalories: 420,
        totalCost: 90000,
        totalCookingTime: 50,
        calorieDistribution: {}
      },
      snacks: []
    },
    nutritionSummary: {
      protein: 85,
      carbs: 180,
      fat: 45,
      fiber: 12
    }
  };

  // Set selected plan for cooking mode
  useEffect(() => {
    setSelectedPlan(todayPlan);
  }, []);

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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'current': return <PlayCircle className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'Sáng': return '🌅';
      case 'Trưa': return '☀️';
      case 'Tối': return '🌙';
      default: return '🍽️';
    }
  };

  const getMotivationalMessage = () => {
    const hour = currentTime.getHours();
    const completedMeals = [todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(m => m.status === 'completed').length;

    if (hour < 10) {
      return {
        message: "Chào buổi sáng! Hãy bắt đầu ngày mới với bữa sáng bổ dưỡng nhé! 🌅",
        emoji: "🌅",
        color: "from-yellow-100 to-orange-100"
      };
    } else if (hour < 15) {
      if (completedMeals >= 1) {
        return {
          message: "Tuyệt vời! Đã đến giờ trưa rồi. Hãy thưởng thức bữa trưa ngon miệng! ☀️",
          emoji: "☀️",
          color: "from-blue-100 to-cyan-100"
        };
      } else {
        return {
          message: "Đừng quên ăn sáng nhé! Cơ thể cần năng lượng để hoạt động tốt! 💪",
          emoji: "💪",
          color: "from-red-100 to-pink-100"
        };
      }
    } else if (hour < 19) {
      return {
        message: "Buổi chiều vui vẻ! Chuẩn bị tinh thần cho bữa tối thôi nào! 🌆",
        emoji: "🌆",
        color: "from-purple-100 to-indigo-100"
      };
    } else {
      return {
        message: "Buổi tối an lành! Hãy kết thúc ngày với bữa tối ấm cúng! 🌙",
        emoji: "🌙",
        color: "from-indigo-100 to-purple-100"
      };
    }
  };

  const motivationalMessage = getMotivationalMessage();

  return (
    <div className="space-y-8">
      {/* Today's Meal Plan */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-200 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                <Calendar className="h-8 w-8 mr-3 text-orange-600" />
                Thực đơn hôm nay
              </CardTitle>
              <div className="flex items-center justify-between">
                <p className="text-lg text-gray-600 font-medium">{todayMealPlan.date}</p>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Bây giờ là</div>
                  <div className="text-lg font-bold text-orange-600">
                    {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Motivational message */}
              <div className={`mt-3 p-4 rounded-xl bg-gradient-to-r ${motivationalMessage.color} border border-white/50 shadow-sm animate-fade-in-scale`}>
                <p className="text-sm text-gray-700 font-medium flex items-center">
                  <span className="text-xl mr-3">{motivationalMessage.emoji}</span>
                  {motivationalMessage.message}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white" asChild>
              <Link to="/meal-planner">
                Xem chi tiết
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {[todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].map((meal, index) => {
              const isCurrentMeal = (index === 0 && currentMeal === 'breakfast') ||
                                   (index === 1 && currentMeal === 'lunch') ||
                                   (index === 2 && currentMeal === 'dinner');

              const totalCalories = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
              const mainDish = meal.dishes[0]; // Món chính để hiển thị ảnh

              return (
                <Card
                  key={index}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover-lift ${
                    animateCards ? 'animate-in' : ''
                  } ${isCurrentMeal ? 'ring-2 ring-orange-400 ring-offset-2 animate-pulse-glow' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header với ảnh món chính */}
                  <div className="aspect-video relative group">
                    <img
                      src={mainDish.image}
                      alt={mainDish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badge */}
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(meal.status)} font-medium shadow-lg border flex items-center gap-1`}>
                      {getStatusIcon(meal.status)}
                      {getStatusText(meal.status)}
                    </Badge>

                    {/* Meal Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <span className="text-lg">{getMealTypeIcon(meal.mealType)}</span>
                        {meal.mealType}
                      </span>
                    </div>

                    {/* Dishes count indicator */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {meal.dishes.length} món
                    </div>

                    {/* Current meal indicator */}
                    {isCurrentMeal && (
                      <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                        <Utensils className="h-3 w-3 inline mr-1" />
                        Bữa hiện tại
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    {/* Main dish title */}
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-orange-600 transition-colors">
                      {mainDish.name}
                      {meal.dishes.length > 1 && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          + {meal.dishes.length - 1} món khác
                        </span>
                      )}
                    </h3>

                    {/* All dishes list */}
                    <div className="mb-3 space-y-1 max-h-20 overflow-y-auto">
                      {meal.dishes.map((dish, dishIndex) => (
                        <div key={dish.id} className={`text-sm ${dishIndex === 0 ? 'text-gray-700 font-medium' : 'text-gray-600'} flex items-center justify-between hover:bg-gray-50 px-1 py-0.5 rounded transition-colors`}>
                          <span className="flex items-center">
                            {dishIndex === 0 ? (
                              <ChefHat className="h-3 w-3 mr-1 text-orange-500" />
                            ) : (
                              <span className="w-3 h-3 mr-1 flex items-center justify-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              </span>
                            )}
                            <span className="truncate">{dish.name}</span>
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{dish.calories} cal</span>
                        </div>
                      ))}
                      {meal.dishes.length > 3 && (
                        <div className="text-xs text-center text-gray-400 py-1">
                          Cuộn để xem thêm...
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center bg-blue-50 px-3 py-2 rounded-full shadow-sm">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="font-medium text-blue-700">{meal.time}</span>
                      </div>
                      <div className="flex items-center bg-orange-50 px-3 py-2 rounded-full shadow-sm">
                        <Flame className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="font-medium text-orange-700">{totalCalories} cal</span>
                      </div>
                    </div>

                    {/* Shopping Status */}
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                      <CompactShoppingStatus
                        plan={todayPlan}
                        userId={userId}
                        onStartShopping={handleStartShopping}
                        onStartCooking={handleStartCooking}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedMeal(meal)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="text-2xl">{getMealTypeIcon(meal.mealType)}</span>
                              Thực đơn {meal.mealType} - {meal.time}
                            </DialogTitle>
                            <DialogDescription>
                              Chi tiết các món ăn trong bữa {meal.mealType.toLowerCase()}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {meal.dishes.map((dish, dishIndex) => (
                              <Card key={dish.id} className="overflow-hidden">
                                <div className="flex">
                                  <div className="w-24 h-24 flex-shrink-0">
                                    <img
                                      src={dish.image}
                                      alt={dish.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <CardContent className="flex-1 p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                          {dishIndex === 0 && <ChefHat className="h-4 w-4 text-orange-500" />}
                                          {dish.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <span className="flex items-center gap-1">
                                            <Flame className="h-3 w-3 text-orange-500" />
                                            {dish.calories} cal
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Timer className="h-3 w-3 text-blue-500" />
                                            {dish.cookTime}
                                          </span>
                                        </div>
                                      </div>
                                      {dishIndex === 0 && (
                                        <Badge className="bg-orange-100 text-orange-800">
                                          Món chính
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                </div>
                              </Card>
                            ))}

                            {/* Summary */}
                            <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Tổng kết bữa ăn</h4>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-orange-600">
                                      {meal.dishes.reduce((sum, dish) => sum + dish.calories, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Tổng calo</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {meal.dishes.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Món ăn</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">
                                      {meal.time}
                                    </div>
                                    <div className="text-sm text-gray-600">Giờ ăn</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant={meal.status === 'completed' ? 'secondary' : 'default'}
                        className="flex-1"
                        disabled={meal.status === 'completed'}
                      >
                        {meal.status === 'completed' ? 'Hoàn thành' :
                         meal.status === 'current' ? 'Bắt đầu' : 'Chuẩn bị'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary stats */}
          <div className="mt-8 p-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
            <div className="flex items-center justify-center space-x-12 text-sm">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <div className="font-bold text-gray-900 text-xl mb-1">
                  {todayMealPlan.breakfast.dishes.reduce((sum, dish) => sum + dish.calories, 0) +
                   todayMealPlan.lunch.dishes.reduce((sum, dish) => sum + dish.calories, 0) +
                   todayMealPlan.dinner.dishes.reduce((sum, dish) => sum + dish.calories, 0)}
                </div>
                <div className="text-gray-600 font-medium">Tổng calo</div>
                <div className="text-xs text-gray-500 mt-1">Hôm nay</div>
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="h-8 w-8 text-blue-600" />
                </div>
                <div className="font-bold text-gray-900 text-xl mb-1">3</div>
                <div className="text-gray-600 font-medium">Bữa ăn</div>
                <div className="text-xs text-gray-500 mt-1">Đã lên kế hoạch</div>
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="font-bold text-green-600 text-xl mb-1">
                  {[todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(m => m.status === 'completed').length}/3
                </div>
                <div className="text-gray-600 font-medium">Hoàn thành</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(([todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(m => m.status === 'completed').length / 3) * 100)}% tiến độ
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-4 border-t border-white/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tiến độ hôm nay</span>
                <span className="text-sm text-gray-600">
                  {[todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(m => m.status === 'completed').length} / 3 bữa
                </span>
              </div>
              <Progress
                value={([todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(m => m.status === 'completed').length / 3) * 100}
                className="h-3 bg-white/50"
              />
            </div>
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
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
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

                    {/* Shopping Status for Menu */}
                    <div className="mb-3 p-2 bg-gray-50 rounded border">
                      <CompactShoppingStatus
                        plan={{
                          id: `menu-${menu.id}`,
                          name: menu.name,
                          description: `Thực đơn ${menu.meals} bữa ăn`,
                          type: 'week',
                          createdBy: 'system',
                          createdByName: 'AnGiDay',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          tags: ['Đề xuất', 'Thực đơn'],
                          isTemplate: true,
                          isPublic: true,
                          totalCalories: 1800,
                          totalCost: menu.price,
                          nutrition: { protein: 90, carbs: 200, fat: 60, fiber: 25 },
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          days: [],
                          averageCaloriesPerDay: 1800
                        }}
                        userId={userId}
                        onStartShopping={handleStartShopping}
                        onStartCooking={handleStartCooking}
                      />
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm" variant="outline" asChild>
                  <Link to={`/thuc-don/detail/${menu.id}`}>Xem chi tiết</Link>
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

      {/* Smart Shopping List Modal */}
      <SmartShoppingList
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        availablePlans={[todayPlan]}
        availableMenus={[]}
        userId={userId}
      />

      {/* Cooking Mode Modal */}
      {selectedPlan && (
        <CookingMode
          isOpen={showCookingMode}
          onClose={() => setShowCookingMode(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default UserDashboard;
