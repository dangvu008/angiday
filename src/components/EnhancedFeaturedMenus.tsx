import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Clock, 
  Users, 
  Star,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CompactShoppingStatus from '@/components/meal-planning/CompactShoppingStatus';
import SmartShoppingList from '@/components/meal-planning/SmartShoppingList';
import CookingMode from '@/components/meal-planning/CookingMode';
import { AnyPlan, Menu } from '@/types/meal-planning';

interface EnhancedFeaturedMenusProps {
  userId: string;
  className?: string;
}

const EnhancedFeaturedMenus: React.FC<EnhancedFeaturedMenusProps> = ({
  userId,
  className = ''
}) => {
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AnyPlan | null>(null);

  // Mock featured menus with plan conversion
  const featuredMenus = [
    {
      id: 'menu-1',
      name: 'Thực đơn gia đình cuối tuần',
      description: 'Thực đơn phong phú cho bữa ăn gia đình cuối tuần với các món Việt Nam truyền thống',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=250&fit=crop',
      totalCalories: 1200,
      totalCost: 350000,
      servings: 4,
      cookingTime: 120,
      difficulty: 'Trung bình',
      rating: 4.8,
      reviews: 156,
      tags: ['Gia đình', 'Cuối tuần', 'Việt Nam'],
      ingredients: [
        'Thịt bò', 'Bánh phở', 'Hành lá', 'Ngò gai',
        'Cơm tấm', 'Sườn heo', 'Nước mắm', 'Đường',
        'Cá basa', 'Me', 'Cà chua', 'Dứa'
      ]
    },
    {
      id: 'menu-2', 
      name: 'Thực đơn eat clean 7 ngày',
      description: 'Thực đơn healthy giảm cân với các món ăn ít calo, nhiều dinh dưỡng',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop',
      totalCalories: 1500,
      totalCost: 280000,
      servings: 2,
      cookingTime: 90,
      difficulty: 'Dễ',
      rating: 4.6,
      reviews: 89,
      tags: ['Healthy', 'Giảm cân', 'Clean eating'],
      ingredients: [
        'Salad', 'Tôm', 'Ức gà', 'Quinoa',
        'Brokoli', 'Cà rót', 'Dầu olive', 'Chanh'
      ]
    },
    {
      id: 'menu-3',
      name: 'Thực đơn tiết kiệm sinh viên',
      description: 'Thực đơn phù hợp túi tiền sinh viên với nguyên liệu dễ tìm, giá rẻ',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop',
      totalCalories: 1800,
      totalCost: 150000,
      servings: 2,
      cookingTime: 60,
      difficulty: 'Dễ',
      rating: 4.4,
      reviews: 234,
      tags: ['Tiết kiệm', 'Sinh viên', 'Đơn giản'],
      ingredients: [
        'Trứng', 'Mì tôm', 'Rau muống', 'Tỏi',
        'Cơm', 'Thịt băm', 'Hành tây', 'Cà chua'
      ]
    }
  ];

  // Convert menu to plan format
  const convertMenuToPlan = (menu: any): AnyPlan => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    type: 'day',
    createdBy: 'system',
    createdByName: 'AnGiDay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: menu.tags,
    isTemplate: true,
    isPublic: true,
    totalCalories: menu.totalCalories,
    totalCost: menu.totalCost,
    nutrition: {
      protein: menu.totalCalories * 0.20 / 4,
      carbs: menu.totalCalories * 0.50 / 4,
      fat: menu.totalCalories * 0.30 / 9,
      fiber: 25
    },
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: {
        id: `${menu.id}-breakfast`,
        dishes: [{
          id: `${menu.id}-dish-1`,
          name: 'Món sáng',
          image: menu.image,
          cookingTime: menu.cookingTime / 3,
          difficulty: 'easy' as const,
          rating: menu.rating,
          views: menu.reviews * 10,
          servings: menu.servings,
          calories: menu.totalCalories / 3,
          nutrition: {
            protein: menu.totalCalories * 0.20 / 12,
            carbs: menu.totalCalories * 0.50 / 12,
            fat: menu.totalCalories * 0.30 / 27,
            fiber: 8
          },
          ingredients: menu.ingredients.slice(0, 4),
          instructions: ['Chuẩn bị nguyên liệu', 'Chế biến theo hướng dẫn', 'Trang trí và thưởng thức'],
          tags: menu.tags,
          category: 'Món chính',
          cost: menu.totalCost / 3
        }],
        totalCalories: menu.totalCalories / 3,
        totalCost: menu.totalCost / 3,
        totalCookingTime: menu.cookingTime / 3,
        calorieDistribution: {}
      },
      lunch: {
        id: `${menu.id}-lunch`,
        dishes: [{
          id: `${menu.id}-dish-2`,
          name: 'Món trưa',
          image: menu.image,
          cookingTime: menu.cookingTime / 2,
          difficulty: 'medium' as const,
          rating: menu.rating,
          views: menu.reviews * 10,
          servings: menu.servings,
          calories: menu.totalCalories / 2,
          nutrition: {
            protein: menu.totalCalories * 0.20 / 8,
            carbs: menu.totalCalories * 0.50 / 8,
            fat: menu.totalCalories * 0.30 / 18,
            fiber: 12
          },
          ingredients: menu.ingredients.slice(4, 8),
          instructions: ['Chuẩn bị nguyên liệu', 'Chế biến theo hướng dẫn', 'Trang trí và thưởng thức'],
          tags: menu.tags,
          category: 'Món chính',
          cost: menu.totalCost / 2
        }],
        totalCalories: menu.totalCalories / 2,
        totalCost: menu.totalCost / 2,
        totalCookingTime: menu.cookingTime / 2,
        calorieDistribution: {}
      },
      dinner: {
        id: `${menu.id}-dinner`,
        dishes: [{
          id: `${menu.id}-dish-3`,
          name: 'Món tối',
          image: menu.image,
          cookingTime: menu.cookingTime / 4,
          difficulty: 'easy' as const,
          rating: menu.rating,
          views: menu.reviews * 10,
          servings: menu.servings,
          calories: menu.totalCalories / 6,
          nutrition: {
            protein: menu.totalCalories * 0.20 / 24,
            carbs: menu.totalCalories * 0.50 / 24,
            fat: menu.totalCalories * 0.30 / 54,
            fiber: 5
          },
          ingredients: menu.ingredients.slice(8),
          instructions: ['Chuẩn bị nguyên liệu', 'Chế biến theo hướng dẫn', 'Trang trí và thưởng thức'],
          tags: menu.tags,
          category: 'Món nhẹ',
          cost: menu.totalCost / 6
        }],
        totalCalories: menu.totalCalories / 6,
        totalCost: menu.totalCost / 6,
        totalCookingTime: menu.cookingTime / 4,
        calorieDistribution: {}
      },
      snacks: []
    },
    nutritionSummary: {
      protein: menu.totalCalories * 0.20 / 4,
      carbs: menu.totalCalories * 0.50 / 4,
      fat: menu.totalCalories * 0.30 / 9,
      fiber: 25
    }
  });

  const handleStartShopping = (shoppingListId: string) => {
    setShowShoppingList(true);
  };

  const handleStartCooking = (planId: string) => {
    const menu = featuredMenus.find(m => m.id === planId);
    if (menu) {
      setSelectedPlan(convertMenuToPlan(menu));
      setShowCookingMode(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Thực đơn <span className="text-orange-600">nổi bật</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Khám phá các thực đơn được yêu thích nhất với tính năng kiểm tra nguyên liệu thông minh
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredMenus.map((menu) => {
          const plan = convertMenuToPlan(menu);
          
          return (
            <Card key={menu.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 text-white">Nổi bật</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={getDifficultyColor(menu.difficulty)}>
                    {menu.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{menu.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{menu.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{menu.servings} người</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{menu.cookingTime}p</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{menu.rating} ({menu.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span>{(menu.totalCost / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {menu.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Shopping Status */}
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <CompactShoppingStatus
                    plan={plan}
                    userId={userId}
                    onStartShopping={handleStartShopping}
                    onStartCooking={handleStartCooking}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/thuc-don/detail/${menu.id}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Package className="h-4 w-4 mr-1" />
                    Thêm vào kế hoạch
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Button */}
      <div className="text-center mt-8">
        <Button 
          onClick={() => setShowShoppingList(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Mua sắm thông minh cho tất cả
        </Button>
      </div>

      {/* Modals */}
      <SmartShoppingList
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        availablePlans={featuredMenus.map(convertMenuToPlan)}
        availableMenus={[]}
        userId={userId}
      />

      {selectedPlan && (
        <CookingMode
          isOpen={showCookingMode}
          onClose={() => {
            setShowCookingMode(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default EnhancedFeaturedMenus;
