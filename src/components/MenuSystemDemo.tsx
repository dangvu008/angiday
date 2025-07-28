import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Menu, Calendar, Plus, Clock, Users, Star } from 'lucide-react';
import MenuSelector from '@/components/meal-planning/MenuSelector';
import { Menu as MenuType } from '@/types/meal-planning';

const MenuSystemDemo = () => {
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<MenuType[]>([]);
  const [mealPlan, setMealPlan] = useState<{[key: string]: MenuType[]}>({
    '2024-01-22': [],
    '2024-01-23': [],
    '2024-01-24': [],
  });

  // Mock recipes data
  const sampleRecipes = [
    {
      id: '1',
      title: 'Phở Bò Truyền Thống',
      description: 'Món phở bò truyền thống Việt Nam',
      category: 'Món chính',
      difficulty: 'Khó' as const,
      cookingTime: '3 giờ',
      servings: 4,
      author: 'Chef Nguyễn',
      status: 'published' as const,
      createdDate: '2024-01-15',
      views: 2450,
      ingredients: ['Xương bò', 'Bánh phở', 'Hành tây'],
      instructions: ['Ninh xương', 'Luộc bánh phở'],
      nutrition: { calories: 450, protein: 25, carbs: 60, fat: 12, fiber: 3 },
      tags: ['phở', 'truyền thống'],
      cuisine: 'Việt Nam',
      rating: 4.5,
      reviews: 120
    },
    {
      id: '2',
      title: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi mát với tôm và thịt',
      category: 'Khai vị',
      difficulty: 'Dễ' as const,
      cookingTime: '30 phút',
      servings: 4,
      author: 'Chef Mai',
      status: 'published' as const,
      createdDate: '2024-01-12',
      views: 1230,
      ingredients: ['Bánh tráng', 'Tôm', 'Thịt ba chỉ'],
      instructions: ['Luộc tôm', 'Cuốn bánh tráng'],
      nutrition: { calories: 180, protein: 15, carbs: 20, fat: 5, fiber: 2 },
      tags: ['gỏi cuốn', 'healthy'],
      cuisine: 'Việt Nam',
      rating: 4.3,
      reviews: 85
    }
  ];

  // Mock menus data
  const sampleMenus: MenuType[] = [
    {
      id: '1',
      name: 'Thực đơn ăn chay',
      description: 'Tập hợp các món ăn chay bổ dưỡng và ngon miệng',
      type: 'full_day',
      recipes: sampleRecipes,
      totalCalories: 1800,
      totalCost: 150000,
      servings: 4,
      tags: ['chay', 'healthy', 'gia đình'],
      difficulty: 'Trung bình',
      totalCookingTime: 120,
      nutrition: { protein: 60, carbs: 250, fat: 50, fiber: 35 },
      isPublic: true,
      createdBy: 'Admin',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      category: 'Ăn chay',
      cuisine: 'Việt Nam',
      targetAudience: ['family'],
      dietaryRestrictions: ['vegetarian'],
      usageCount: 45,
      rating: 4.5,
      reviews: 12
    }
  ];

  const handleSelectMenu = (menu: MenuType) => {
    setSelectedMenus([...selectedMenus, menu]);
  };

  const addMenuToPlan = (date: string, menu: MenuType) => {
    setMealPlan({
      ...mealPlan,
      [date]: [...(mealPlan[date] || []), menu]
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo Hệ Thống Quản Lý Thực Đơn
          </h1>
          <p className="text-lg text-gray-600">
            Minh họa cách phân biệt và sử dụng <strong>Công thức</strong> và <strong>Thực đơn</strong>
          </p>
        </div>

        <Tabs defaultValue="concept" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="concept">Khái niệm</TabsTrigger>
            <TabsTrigger value="recipes">Công thức</TabsTrigger>
            <TabsTrigger value="menus">Thực đơn</TabsTrigger>
            <TabsTrigger value="planning">Kế hoạch ăn</TabsTrigger>
          </TabsList>

          <TabsContent value="concept">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-blue-600" />
                    Công thức (Recipe)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Công thức là hướng dẫn nấu một món ăn cụ thể
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>• Nguyên liệu chi tiết</li>
                    <li>• Cách thực hiện từng bước</li>
                    <li>• Thời gian nấu</li>
                    <li>• Khẩu phần</li>
                    <li>• Thông tin dinh dưỡng</li>
                  </ul>
                  <div className="mt-4">
                    <Badge variant="outline">Ví dụ: Phở Bò</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Menu className="h-5 w-5 text-green-600" />
                    Thực đơn (Menu)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Thực đơn là tập hợp các công thức được nhóm lại
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>• Nhiều công thức trong một bộ</li>
                    <li>• Có chủ đề cụ thể</li>
                    <li>• Tính toán tổng dinh dưỡng</li>
                    <li>• Ước tính chi phí</li>
                    <li>• Phù hợp với đối tượng</li>
                  </ul>
                  <div className="mt-4">
                    <Badge variant="outline">Ví dụ: Thực đơn ăn chay</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Kế hoạch ăn (Meal Plan)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Kế hoạch ăn sử dụng thực đơn theo thời gian
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>• Lên lịch theo ngày/tuần</li>
                    <li>• Sử dụng thực đơn có sẵn</li>
                    <li>• Tối ưu dinh dưỡng</li>
                    <li>• Quản lý ngân sách</li>
                    <li>• Tạo danh sách mua sắm</li>
                  </ul>
                  <div className="mt-4">
                    <Badge variant="outline">Ví dụ: Tuần ăn healthy</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>Thư viện công thức</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Các công thức nấu ăn cụ thể cho từng món
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleRecipes.map((recipe) => (
                    <Card key={recipe.id} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {recipe.cookingTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {recipe.servings} người
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{recipe.category}</Badge>
                            <Badge variant="outline">{recipe.difficulty}</Badge>
                          </div>
                          <div className="text-sm">
                            <strong>{recipe.nutrition.calories}</strong> calories
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menus">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Thư viện thực đơn</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Tập hợp các công thức được nhóm lại theo chủ đề
                      </p>
                    </div>
                    <Button onClick={() => setShowMenuSelector(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Chọn thực đơn
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {sampleMenus.map((menu) => (
                      <Card key={menu.id} className="border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{menu.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{menu.description}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{menu.rating}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">{menu.category}</Badge>
                              <Badge variant="outline">{menu.difficulty}</Badge>
                              {menu.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">{menu.recipes.length}</span>
                                <span className="text-muted-foreground"> món ăn</span>
                              </div>
                              <div>
                                <span className="font-medium">{menu.totalCalories}</span>
                                <span className="text-muted-foreground"> cal</span>
                              </div>
                              <div>
                                <span className="font-medium">{menu.totalCookingTime}</span>
                                <span className="text-muted-foreground"> phút</span>
                              </div>
                              <div>
                                <span className="font-medium">{formatCurrency(menu.totalCost)}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Công thức trong thực đơn:</h4>
                              <div className="space-y-1">
                                {menu.recipes.map((recipe) => (
                                  <div key={recipe.id} className="text-sm text-muted-foreground">
                                    • {recipe.title} ({recipe.nutrition.calories} cal)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle>Kế hoạch ăn uống</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sử dụng thực đơn để lập kế hoạch ăn uống theo ngày
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(mealPlan).map(([date, menus]) => (
                    <Card key={date} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {new Date(date).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'numeric'
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {menus.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Chưa có thực đơn</p>
                          ) : (
                            menus.map((menu, index) => (
                              <div key={index} className="p-2 border rounded text-sm">
                                <div className="font-medium">{menu.name}</div>
                                <div className="text-muted-foreground">
                                  {menu.recipes.length} món • {menu.totalCalories} cal
                                </div>
                              </div>
                            ))
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => sampleMenus.length > 0 && addMenuToPlan(date, sampleMenus[0])}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm thực đơn
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <MenuSelector
          isOpen={showMenuSelector}
          onClose={() => setShowMenuSelector(false)}
          onSelectMenu={handleSelectMenu}
        />
      </div>
    </div>
  );
};

export default MenuSystemDemo;
