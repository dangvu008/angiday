import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Star, Clock, Users } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ShoppingCartWidget from './ShoppingCartWidget';

// Simple Recipe type for demo - avoiding type conflicts
interface DemoRecipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  difficulty: string;
  cookingTime: string;
  prepTime?: string;
  servings: number;
  ingredients: string[];
  instructions?: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Sample data for demo
const sampleRecipes: DemoRecipe[] = [
  {
    id: 'recipe-1',
    title: 'Phở Bò Truyền Thống',
    description: 'Món phở bò thơm ngon với nước dùng đậm đà, thịt bò tươi ngon',
    image: '/placeholder.svg',
    category: 'Món chính',
    difficulty: 'Trung bình',
    cookingTime: '45 phút',
    servings: 4,
    ingredients: [
      'Xương bò 1kg',
      'Thịt bò tái 200g',
      'Bánh phở 300g',
      'Hành tây 2 củ',
      'Gừng 1 khúc',
      'Quế 2 thanh',
      'Hoa hồi 3 cái',
      'Nước mắm 3 thìa canh',
      'Đường phèn 1 thìa canh',
      'Rau mùi, hành lá'
    ],
    prepTime: '30 phút',
    calories: 350,
    protein: 25,
    carbs: 45,
    fat: 8,
    rating: 4.8,
    reviews: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'recipe-2',
    title: 'Bún Chả Hà Nội',
    description: 'Bún chả thơm ngon với thịt nướng và nước chấm đặc biệt',
    image: '/placeholder.svg',
    category: 'Món chính',
    difficulty: 'Dễ',
    cookingTime: '30 phút',
    servings: 2,
    ingredients: [
      'Thịt heo ba chỉ 300g',
      'Bún tươi 200g',
      'Rau sống',
      'Nước mắm 2 thìa canh',
      'Giấm 1 thìa canh',
      'Đường 1 thìa canh',
      'Tỏi 2 tép',
      'Ớt 1 quả'
    ],
    prepTime: '20 phút',
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 12,
    rating: 4.6,
    reviews: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'recipe-3',
    title: 'Cơm Tấm Sườn Nướng',
    description: 'Cơm tấm với sườn nướng thơm lừng và nước mắm pha chua ngọt',
    image: '/placeholder.svg',
    category: 'Món chính',
    difficulty: 'Trung bình',
    cookingTime: '40 phút',
    servings: 3,
    ingredients: [
      'Sườn heo 500g',
      'Cơm tấm 3 chén',
      'Chả trứng',
      'Dưa leo',
      'Cà chua',
      'Nước mắm',
      'Đường',
      'Tỏi',
      'Sả'
    ],
    prepTime: '25 phút',
    calories: 420,
    protein: 28,
    carbs: 55,
    fat: 15,
    rating: 4.7,
    reviews: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const sampleMenus = [
  {
    id: 'menu-1',
    name: 'Bữa Sáng Việt Nam',
    recipes: [sampleRecipes[0], sampleRecipes[1]]
  },
  {
    id: 'menu-2', 
    name: 'Cơm Trưa Gia Đình',
    recipes: [sampleRecipes[1], sampleRecipes[2]]
  }
];

const sampleMeals = [
  {
    id: 'meal-1',
    name: 'Bữa trưa hôm nay',
    recipe: sampleRecipes[0],
    date: '2024-01-15',
    mealType: 'lunch'
  },
  {
    id: 'meal-2',
    name: 'Bữa tối cuối tuần',
    recipe: sampleRecipes[2],
    date: '2024-01-15',
    mealType: 'dinner'
  }
];

const ShoppingCartDemo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with Shopping Cart Widget */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demo Giỏ Hàng Mua Sắm</h1>
          <p className="text-muted-foreground">
            Thêm món ăn, thực đơn hoặc bữa ăn vào giỏ hàng để tạo danh sách mua sắm thống nhất
          </p>
        </div>
        <ShoppingCartWidget variant="default" size="lg" />
      </div>

      <Separator />

      {/* Recipes Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Món Ăn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{recipe.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {recipe.cookingTime}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {recipe.servings} người
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {recipe.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{recipe.category}</Badge>
                  <AddToCartButton recipe={recipe as any} variant="outline" size="sm" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Menus Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Thực Đơn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleMenus.map((menu) => (
            <Card key={menu.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {menu.name}
                  <Badge variant="outline">{menu.recipes.length} món</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {menu.recipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients.length} nguyên liệu
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {recipe.cookingTime}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-3">
                    <AddToCartButton menu={menu as any} variant="outline" className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Meals Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bữa Ăn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleMeals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {meal.name}
                  <Badge variant="outline">
                    {meal.mealType === 'breakfast' ? 'Sáng' : 
                     meal.mealType === 'lunch' ? 'Trưa' : 
                     meal.mealType === 'dinner' ? 'Tối' : 'Phụ'}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(meal.date).toLocaleDateString('vi-VN')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{meal.recipe.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {meal.recipe.ingredients.length} nguyên liệu • {meal.recipe.cookingTime}
                    </p>
                  </div>
                  <AddToCartButton meal={meal as any} variant="outline" className="w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">
              Cách sử dụng Giỏ hàng mua sắm
            </h3>
            <p className="text-blue-800 text-sm">
              1. Nhấn "Thêm món/Thêm thực đơn/Thêm bữa ăn" để thêm vào giỏ hàng<br/>
              2. Nhấn vào biểu tượng giỏ hàng ở góc trên để xem và quản lý<br/>
              3. Điều chỉnh số lượng phần ăn nếu cần<br/>
              4. Nhấn "Tạo danh sách mua sắm" để xem danh sách nguyên liệu đã tổng hợp
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingCartDemo;