import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ShoppingCart,
  ChefHat,
  Package,
  Plus,
  Sparkles
} from 'lucide-react';
import DemoLayout from '@/components/layout/DemoLayout';
import EnhancedMealPlanningHub from '@/components/meal-planning/EnhancedMealPlanningHub';
import { AnyPlan, Menu, Recipe } from '@/types/meal-planning';
import { toast } from 'sonner';

const SmartMealPlanningDemo: React.FC = () => {
  const [demoPlans, setDemoPlans] = useState<AnyPlan[]>([]);
  const [demoMenus, setDemoMenus] = useState<Menu[]>([]);
  const userId = 'demo-user-123';

  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Demo recipes
    const demoRecipes: Recipe[] = [
      {
        id: 'recipe-1',
        title: 'Phở bò',
        description: 'Món phở bò truyền thống Việt Nam',
        category: 'Món chính',
        difficulty: 'Trung bình',
        cookingTime: '120 phút',
        servings: 4,
        author: 'Chef Demo',
        status: 'published',
        createdDate: new Date().toISOString(),
        views: 150,
        ingredients: [
          'Xương bò',
          'Thịt bò',
          'Bánh phở',
          'Hành tây',
          'Gừng',
          'Quế',
          'Hoa hồi',
          'Nước mắm',
          'Đường phèn',
          'Hành lá',
          'Ngò gai',
          'Giá đỗ'
        ],
        instructions: [
          'Ninh xương bò trong 2-3 tiếng để có nước dùng trong',
          'Thái thịt bò mỏng, ướp với gia vị',
          'Nướng hành tây và gừng cho thơm',
          'Cho gia vị vào nước dùng, nêm nếm vừa ăn',
          'Trần bánh phở qua nước sôi',
          'Bày bánh phở vào tô, cho thịt bò lên trên',
          'Chan nước dùng nóng vào tô',
          'Rắc hành lá, ngò gai và ăn kèm giá đỗ'
        ],
        nutrition: {
          calories: 450,
          protein: 25,
          carbs: 55,
          fat: 12,
          fiber: 3
        },
        tags: ['Việt Nam', 'Món chính', 'Nóng'],
        cuisine: 'Việt Nam',
        rating: 4.8,
        reviews: 25
      },
      {
        id: 'recipe-2',
        title: 'Cơm tấm sườn nướng',
        description: 'Cơm tấm sườn nướng đặc trưng Sài Gòn',
        category: 'Món chính',
        difficulty: 'Dễ',
        cookingTime: '45 phút',
        servings: 2,
        author: 'Chef Demo',
        status: 'published',
        createdDate: new Date().toISOString(),
        views: 200,
        ingredients: [
          'Cơm tấm',
          'Sườn heo',
          'Nước mắm',
          'Đường',
          'Tỏi',
          'Ớt',
          'Dưa leo',
          'Cà chua',
          'Đồ chua',
          'Nước mắm pha'
        ],
        instructions: [
          'Ướp sườn với nước mắm, đường, tỏi băm trong 30 phút',
          'Nướng sườn trên than hoa hoặc lò nướng',
          'Nấu cơm tấm thơm dẻo',
          'Chuẩn bị rau sống: dưa leo, cà chua',
          'Pha nước mắm chua ngọt',
          'Bày cơm ra đĩa, xếp sườn nướng lên trên',
          'Ăn kèm rau sống và đồ chua'
        ],
        nutrition: {
          calories: 520,
          protein: 28,
          carbs: 65,
          fat: 15,
          fiber: 2
        },
        tags: ['Việt Nam', 'Nướng', 'Cơm'],
        cuisine: 'Việt Nam',
        rating: 4.6,
        reviews: 18
      },
      {
        id: 'recipe-3',
        title: 'Canh chua cá',
        description: 'Canh chua cá truyền thống miền Nam',
        category: 'Canh',
        difficulty: 'Dễ',
        cookingTime: '30 phút',
        servings: 4,
        author: 'Chef Demo',
        status: 'published',
        createdDate: new Date().toISOString(),
        views: 120,
        ingredients: [
          'Cá basa',
          'Me',
          'Cà chua',
          'Dứa',
          'Đậu bắp',
          'Giá đỗ',
          'Ngò gai',
          'Tỏi',
          'Ớt',
          'Nước mắm',
          'Đường'
        ],
        instructions: [
          'Làm sạch cá, cắt khúc vừa ăn',
          'Nấu nước me, lọc lấy nước',
          'Phi thơm tỏi, cho cà chua vào xào',
          'Đổ nước me vào, đun sôi',
          'Cho cá vào nấu chín',
          'Thêm dứa, đậu bắp, nêm nếm vừa ăn',
          'Cho giá đỗ và ngò gai vào cuối'
        ],
        nutrition: {
          calories: 180,
          protein: 20,
          carbs: 15,
          fat: 5,
          fiber: 4
        },
        tags: ['Việt Nam', 'Canh', 'Chua'],
        cuisine: 'Việt Nam',
        rating: 4.5,
        reviews: 12
      }
    ];

    // Demo menus
    const menus: Menu[] = [
      {
        id: 'menu-1',
        name: 'Thực đơn gia đình cuối tuần',
        description: 'Thực đơn phong phú cho bữa ăn gia đình cuối tuần',
        type: 'full_day',
        recipes: demoRecipes,
        totalCalories: 1150,
        totalCost: 350000,
        servings: 4,
        tags: ['Gia đình', 'Cuối tuần', 'Việt Nam'],
        difficulty: 'Trung bình',
        totalCookingTime: 195,
        nutrition: {
          protein: 73,
          carbs: 135,
          fat: 32,
          fiber: 9
        },
        isPublic: true,
        createdBy: 'demo-user',
        createdByName: 'Demo User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'Gia đình',
        cuisine: 'Việt Nam',
        targetAudience: ['family'],
        dietaryRestrictions: [],
        usageCount: 15,
        rating: 4.7,
        reviews: 8
      }
    ];

    // Demo plans
    const plans: AnyPlan[] = [
      {
        id: 'plan-1',
        name: 'Kế hoạch bữa trưa hôm nay',
        description: 'Bữa trưa ngon miệng với phở bò và cơm tấm',
        type: 'day',
        createdBy: 'demo-user',
        createdByName: 'Demo User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['Bữa trưa', 'Việt Nam'],
        isTemplate: false,
        isPublic: false,
        totalCalories: 970,
        totalCost: 280000,
        nutrition: {
          protein: 53,
          carbs: 120,
          fat: 27,
          fiber: 5
        },
        date: new Date().toISOString().split('T')[0],
        meals: {
          breakfast: {
            id: 'breakfast-1',
            dishes: [],
            totalCalories: 0,
            totalCost: 0,
            totalCookingTime: 0,
            calorieDistribution: {}
          },
          lunch: {
            id: 'lunch-1',
            dishes: [
              {
                id: 'dish-1',
                name: 'Phở bò',
                image: '/images/pho-bo.jpg',
                cookingTime: 120,
                difficulty: 'medium',
                rating: 4.8,
                views: 150,
                servings: 4,
                calories: 450,
                nutrition: {
                  protein: 25,
                  carbs: 55,
                  fat: 12,
                  fiber: 3
                },
                ingredients: demoRecipes[0].ingredients,
                instructions: demoRecipes[0].instructions,
                tags: ['Việt Nam', 'Món chính'],
                category: 'Món chính',
                cost: 150000
              },
              {
                id: 'dish-2',
                name: 'Cơm tấm sườn nướng',
                image: '/images/com-tam.jpg',
                cookingTime: 45,
                difficulty: 'easy',
                rating: 4.6,
                views: 200,
                servings: 2,
                calories: 520,
                nutrition: {
                  protein: 28,
                  carbs: 65,
                  fat: 15,
                  fiber: 2
                },
                ingredients: demoRecipes[1].ingredients,
                instructions: demoRecipes[1].instructions,
                tags: ['Việt Nam', 'Nướng'],
                category: 'Món chính',
                cost: 130000
              }
            ],
            totalCalories: 970,
            totalCost: 280000,
            totalCookingTime: 165,
            calorieDistribution: {}
          },
          dinner: {
            id: 'dinner-1',
            dishes: [],
            totalCalories: 0,
            totalCost: 0,
            totalCookingTime: 0,
            calorieDistribution: {}
          },
          snacks: []
        },
        nutritionSummary: {
          protein: 53,
          carbs: 120,
          fat: 27,
          fiber: 5
        }
      }
    ];

    setDemoMenus(menus);
    setDemoPlans(plans);
    
    toast.success('Đã tải dữ liệu demo thành công!');
  };

  const handleCreatePlan = () => {
    toast.info('Tính năng tạo kế hoạch sẽ được triển khai sau');
  };

  const handleCreateMenu = () => {
    toast.info('Tính năng tạo thực đơn sẽ được triển khai sau');
  };

  return (
    <DemoLayout
      title="Kế hoạch bữa ăn thông minh"
      description="Trải nghiệm tính năng quản lý thực đơn, theo dõi nguyên liệu và chế độ nấu ăn thông minh. Hệ thống sẽ tự động kiểm tra nguyên liệu có sẵn và đưa ra gợi ý đi chợ hoặc bắt đầu nấu ăn."
      mainClassName="py-8"
    >
      <div className="container mx-auto px-4">
        {/* Demo Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Demo: Kế hoạch bữa ăn thông minh
            </h1>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 mx-auto text-blue-500 mb-2" />
              <CardTitle>Trạng thái đi chợ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tự động kiểm tra nguyên liệu có sẵn và tạo danh sách mua sắm thông minh
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <CardTitle>Quản lý kho</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Theo dõi nguyên liệu trong tủ lạnh, tủ đông với cảnh báo hết hạn
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ChefHat className="h-12 w-12 mx-auto text-orange-500 mb-2" />
              <CardTitle>Chế độ nấu ăn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Hướng dẫn nấu ăn từng bước với timer và theo dõi tiến độ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Component */}
        <EnhancedMealPlanningHub
          userId={userId}
          availablePlans={demoPlans}
          availableMenus={demoMenus}
          onCreatePlan={handleCreatePlan}
          onCreateMenu={handleCreateMenu}
        />

        {/* Demo Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hướng dẫn sử dụng Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🛒 Thử tính năng đi chợ:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Nhấn vào "Đi chợ" trên kế hoạch bữa ăn</li>
                  <li>Xem danh sách nguyên liệu cần mua</li>
                  <li>Đánh dấu các mục đã mua</li>
                  <li>Hoàn thành mua sắm</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">👨‍🍳 Thử chế độ nấu ăn:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Nhấn "Quản lý kho" để thêm nguyên liệu</li>
                  <li>Quay lại và nhấn "Bắt đầu nấu"</li>
                  <li>Theo dõi từng bước nấu ăn</li>
                  <li>Sử dụng timer để hẹn giờ</li>
                </ol>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Mẹo:</strong> Thử nhấn "Mua sắm thông minh" để tạo danh sách mua sắm từ nhiều thực đơn cùng lúc!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoLayout>
  );
};

export default SmartMealPlanningDemo;
