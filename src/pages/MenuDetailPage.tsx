import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Clock, Users, Star, ChefHat, Heart, Share2, Download, 
  Play, ArrowLeft, Plus, Check, ShoppingCart, Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MenuDetailPage = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(0);

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const menu = {
    id: 1,
    title: 'Thực đơn ăn chay thanh đạm',
    description: 'Bộ sưu tập các món ăn chay bổ dưỡng, thanh đạm cho sức khỏe. Thực đơn này được thiết kế đặc biệt cho những ai muốn có một chế độ ăn uống lành mạnh, giàu chất xơ và vitamin.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    category: 'an-chay',
    difficulty: 'Dễ',
    cookingTime: 45,
    servings: 4,
    calories: 1200,
    cost: 150000,
    rating: 4.8,
    reviews: 124,
    views: 2340,
    author: {
      name: 'Chef Minh',
      avatar: 'https://ui-avatars.com/api/?name=Chef+Minh&background=f97316&color=fff',
      bio: 'Chuyên gia ẩm thực chay với 10 năm kinh nghiệm'
    },
    tags: ['chay', 'healthy', 'thanh đạm', 'gia đình'],
    nutrition: {
      protein: 45,
      carbs: 180,
      fat: 25,
      fiber: 35,
      sugar: 20,
      sodium: 800
    },
    recipes: [
      {
        id: '1',
        title: 'Canh chua chay',
        description: 'Canh chua thanh mát với rau củ tươi ngon',
        category: 'Canh',
        difficulty: 'Dễ',
        cookingTime: '15 phút',
        servings: 4,
        author: 'Chef Minh',
        status: 'published',
        createdDate: '2024-01-15',
        views: 1200,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
        ingredients: ['Cà chua', 'Dứa', 'Đậu bắp', 'Giá đỗ', 'Me'],
        instructions: ['Nấu nước dùng chua', 'Cho rau củ vào nấu', 'Nêm nếm vừa ăn'],
        nutrition: { calories: 120, protein: 3, carbs: 25, fat: 1, fiber: 4 },
        tags: ['chay', 'canh', 'healthy'],
        cuisine: 'Việt Nam',
        rating: 4.3,
        reviews: 45
      },
      {
        id: '2',
        title: 'Đậu hũ sốt cà chua',
        description: 'Đậu hũ mềm mịn với sốt cà chua đậm đà',
        category: 'Món chính',
        difficulty: 'Dễ',
        cookingTime: '20 phút',
        servings: 4,
        author: 'Chef Minh',
        status: 'published',
        createdDate: '2024-01-15',
        views: 980,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        ingredients: ['Đậu hũ', 'Cà chua', 'Hành tây', 'Tỏi'],
        instructions: ['Chiên đậu hũ', 'Làm sốt cà chua', 'Trộn đều và thưởng thức'],
        nutrition: { calories: 180, protein: 12, carbs: 15, fat: 8, fiber: 3 },
        tags: ['chay', 'đậu hũ', 'protein'],
        cuisine: 'Việt Nam',
        rating: 4.5,
        reviews: 67
      },
      {
        id: '3',
        title: 'Rau muống xào tỏi',
        description: 'Rau muống tươi xanh xào với tỏi thơm',
        category: 'Rau xanh',
        difficulty: 'Dễ',
        cookingTime: '10 phút',
        servings: 4,
        author: 'Chef Minh',
        status: 'published',
        createdDate: '2024-01-15',
        views: 750,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
        ingredients: ['Rau muống', 'Tỏi', 'Dầu ăn', 'Nước mắm'],
        instructions: ['Nhặt rau muống', 'Xào tỏi thơm', 'Cho rau vào xào nhanh'],
        nutrition: { calories: 80, protein: 4, carbs: 12, fat: 2, fiber: 6 },
        tags: ['chay', 'rau xanh', 'vitamin'],
        cuisine: 'Việt Nam',
        rating: 4.1,
        reviews: 32
      },
      {
        id: '4',
        title: 'Cơm gạo lứt',
        description: 'Cơm gạo lứt bổ dưỡng, giàu chất xơ',
        category: 'Tinh bột',
        difficulty: 'Dễ',
        cookingTime: '30 phút',
        servings: 4,
        author: 'Chef Minh',
        status: 'published',
        createdDate: '2024-01-15',
        views: 650,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
        ingredients: ['Gạo lứt', 'Nước'],
        instructions: ['Vo gạo sạch', 'Ngâm 2 tiếng', 'Nấu cơm bình thường'],
        nutrition: { calories: 200, protein: 5, carbs: 40, fat: 2, fiber: 4 },
        tags: ['chay', 'healthy', 'chất xơ'],
        cuisine: 'Việt Nam',
        rating: 4.0,
        reviews: 28
      }
    ],
    ingredients: [
      { name: 'Đậu hũ', quantity: '2 miếng', category: 'Protein' },
      { name: 'Rau muống', quantity: '300g', category: 'Rau xanh' },
      { name: 'Cà chua', quantity: '3 quả', category: 'Rau củ' },
      { name: 'Gạo lứt', quantity: '2 chén', category: 'Tinh bột' },
      { name: 'Tỏi', quantity: '3 tép', category: 'Gia vị' },
      { name: 'Hành lá', quantity: '2 cây', category: 'Rau thơm' }
    ],
    instructions: [
      'Chuẩn bị tất cả nguyên liệu, rửa sạch rau củ',
      'Nấu cơm gạo lứt trước khoảng 30 phút',
      'Làm canh chua chay với rau củ tươi',
      'Xào đậu hũ với sốt cà chua',
      'Xào rau muống với tỏi',
      'Bày biện và thưởng thức'
    ],
    tips: [
      'Chọn đậu hũ tươi, không bị vỡ',
      'Rau muống nên chọn loại non, lá xanh',
      'Cà chua chín đỏ sẽ cho vị ngọt tự nhiên',
      'Gạo lứt nên ngâm trước 2-3 tiếng'
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-600">Trang chủ</Link>
          <span>/</span>
          <Link to="/thuc-don" className="hover:text-orange-600">Thực đơn</Link>
          <span>/</span>
          <span className="text-gray-900">{menu.title}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/thuc-don">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white text-gray-900">
                        {menu.recipes.length} món ăn
                      </Badge>
                      <Badge className={getDifficultyColor(menu.difficulty)}>
                        {menu.difficulty}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{menu.title}</h1>
                    <p className="text-lg opacity-90">{menu.description}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-semibold">{menu.cookingTime} phút</p>
              </Card>
              <Card className="text-center p-4">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Khẩu phần</p>
                <p className="font-semibold">{menu.servings} người</p>
              </Card>
              <Card className="text-center p-4">
                <span className="text-2xl mx-auto mb-2 block">🔥</span>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="font-semibold">{menu.calories} cal</p>
              </Card>
              <Card className="text-center p-4">
                <span className="text-2xl mx-auto mb-2 block">💰</span>
                <p className="text-sm text-gray-600">Chi phí</p>
                <p className="font-semibold">{formatCurrency(menu.cost)}</p>
              </Card>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="recipes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recipes">Công thức</TabsTrigger>
                <TabsTrigger value="ingredients">Nguyên liệu</TabsTrigger>
                <TabsTrigger value="instructions">Cách làm</TabsTrigger>
                <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
              </TabsList>

              <TabsContent value="recipes">
                <Card>
                  <CardHeader>
                    <CardTitle>Các món trong thực đơn ({menu.recipes.length} món)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menu.recipes.map((recipe, index) => (
                        <Card
                          key={recipe.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            activeRecipe === index ? 'ring-2 ring-orange-500' : ''
                          }`}
                          onClick={() => setActiveRecipe(index)}
                        >
                          <div className="flex">
                            {recipe.image && (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-24 h-24 object-cover rounded-l-lg"
                              />
                            )}
                            <div className="p-4 flex-1">
                              <h4 className="font-medium mb-1">{recipe.title}</h4>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {recipe.cookingTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {recipe.servings}
                                </span>
                                <span>{recipe.nutrition.calories} cal</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getDifficultyColor(recipe.difficulty)} size="sm">
                                  {recipe.difficulty}
                                </Badge>
                                <Badge variant="outline" size="sm">
                                  {recipe.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{recipe.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ingredients">
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách nguyên liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        menu.ingredients.reduce((acc, ingredient) => {
                          if (!acc[ingredient.category]) {
                            acc[ingredient.category] = [];
                          }
                          acc[ingredient.category].push(ingredient);
                          return acc;
                        }, {} as Record<string, typeof menu.ingredients>)
                      ).map(([category, ingredients]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="space-y-2">
                            {ingredients.map((ingredient, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span>{ingredient.name}</span>
                                <span className="font-medium">{ingredient.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructions">
                <Card>
                  <CardHeader>
                    <CardTitle>Hướng dẫn thực hiện</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menu.instructions.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                    
                    {menu.tips.length > 0 && (
                      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">💡 Mẹo hay</h4>
                        <ul className="space-y-1 text-sm text-yellow-700">
                          {menu.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nutrition">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin dinh dưỡng</CardTitle>
                    <p className="text-sm text-gray-600">Cho {menu.servings} khẩu phần</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{menu.nutrition.protein}g</p>
                        <p className="text-sm text-gray-600">Protein</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{menu.nutrition.carbs}g</p>
                        <p className="text-sm text-gray-600">Carbs</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{menu.nutrition.fat}g</p>
                        <p className="text-sm text-gray-600">Fat</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{menu.nutrition.fiber}g</p>
                        <p className="text-sm text-gray-600">Chất xơ</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{menu.nutrition.sugar}g</p>
                        <p className="text-sm text-gray-600">Đường</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-600">{menu.nutrition.sodium}mg</p>
                        <p className="text-sm text-gray-600">Natri</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={menu.author.avatar}
                    alt={menu.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{menu.author.name}</h3>
                    <p className="text-sm text-gray-600">{menu.author.bio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{menu.rating}</span>
                  <span className="text-sm text-gray-600">({menu.reviews} đánh giá)</span>
                </div>
                <div className="text-sm text-gray-600">
                  {menu.views.toLocaleString()} lượt xem
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => setIsFavorited(!isFavorited)}
                  variant={isFavorited ? "default" : "outline"}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Thêm vào kế hoạch
                </Button>
                
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tạo danh sách mua sắm
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Tải về
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {menu.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenuDetailPage;
