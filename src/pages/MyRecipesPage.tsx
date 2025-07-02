
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, Users, Eye } from 'lucide-react';

const MyRecipesPage = () => {
  const myRecipes = [
    {
      id: 1,
      title: "Món canh chua cá lóc của mẹ",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      status: "Đã xuất bản",
      cookTime: "45 phút",
      servings: 4,
      views: 156,
      createdAt: "3 ngày trước",
      description: "Công thức canh chua truyền thống trong gia đình được truyền từ mẹ"
    },
    {
      id: 2,
      title: "Bánh tráng nướng Đà Lạt",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      status: "Bản nháp",
      cookTime: "20 phút",
      servings: 2,
      views: 0,
      createdAt: "1 tuần trước",
      description: "Món ăn vặt yêu thích từ thời sinh viên ở Đà Lạt"
    },
    {
      id: 3,
      title: "Chả cá Lã Vọng Hà Nội",
      image: "https://images.unsplash.com/photo-1559847844-d724dacb1828?w=400&h=300&fit=crop",
      status: "Đã xuất bản",
      cookTime: "1 giờ",
      servings: 6,
      views: 342,
      createdAt: "2 tuần trước",
      description: "Món chả cá truyền thống Hà Nội với hương vị đặc trưng"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Công thức của tôi
                </h1>
                <p className="text-xl text-gray-600 mb-6 md:mb-0">
                  Quản lý và chia sẻ những công thức nấu ăn yêu thích của bạn
                </p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Tạo công thức mới
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 px-4 border-b bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">3</div>
                <div className="text-gray-600">Công thức</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2</div>
                <div className="text-gray-600">Đã xuất bản</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">498</div>
                <div className="text-gray-600">Lượt xem</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-gray-600">Người theo dõi</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Management */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {myRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có công thức nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy tạo công thức đầu tiên của bạn để chia sẻ với cộng đồng
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Tạo công thức mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant={recipe.status === "Đã xuất bản" ? "default" : "secondary"}
                          className={recipe.status === "Đã xuất bản" ? "bg-green-600" : "bg-gray-500"}
                        >
                          {recipe.status}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2 flex space-x-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {recipe.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} người</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{recipe.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{recipe.createdAt}</span>
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyRecipesPage;
