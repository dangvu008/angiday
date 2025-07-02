
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Search } from 'lucide-react';

const RecipesPage = () => {
  const recipes = [
    {
      id: 1,
      title: "Phở Bò Hà Nội",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "2 giờ",
      servings: 4,
      tags: ["Món chính", "Việt Nam", "Nước dùng"],
      rating: 4.8,
      description: "Công thức truyền thống để nấu tô phở bò thơm ngon đúng vị Hà Nội"
    },
    {
      id: 2,
      title: "Gỏi Cuốn Tôm Thịt",
      image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
      difficulty: "Dễ",
      cookTime: "30 phút", 
      servings: 2,
      tags: ["Khai vị", "Việt Nam", "Tươi mát"],
      rating: 4.6,
      description: "Gỏi cuốn tươi ngon với tôm và thịt heo, ăn kèm nước chấm đậm đà"
    },
    {
      id: 3,
      title: "Cơm Tấm Sườn Nướng",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "1 giờ",
      servings: 2,
      tags: ["Món chính", "Việt Nam", "Nướng"],
      rating: 4.7,
      description: "Cơm tấm thơm ngon với sườn nướng BBQ kiểu Sài Gòn"
    },
    {
      id: 4,
      title: "Bánh Mì Thịt Nướng",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      difficulty: "Dễ",
      cookTime: "45 phút",
      servings: 4,
      tags: ["Ăn sáng", "Việt Nam", "Nhanh gọn"],
      rating: 4.5,
      description: "Bánh mì Việt Nam với thịt nướng thơm lừng và rau củ tươi ngon"
    },
    {
      id: 5,
      title: "Bún Bò Huế",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      difficulty: "Khó",
      cookTime: "3 giờ",
      servings: 6,
      tags: ["Món chính", "Việt Nam", "Cay nồng"],
      rating: 4.9,
      description: "Bún bò Huế đậm đà với nước dùng cay nồng đặc trưng miền Trung"
    },
    {
      id: 6,
      title: "Chè Ba Màu",
      image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "1.5 giờ",
      servings: 4,
      tags: ["Tráng miệng", "Việt Nam", "Mát lạnh"],
      rating: 4.4,
      description: "Chè ba màu mát lành với đậu xanh, đậu đỏ và thạch"
    }
  ];

  const categories = ["Tất cả", "Món chính", "Khai vị", "Tráng miệng", "Ăn sáng", "Nước dùng"];
  const difficulties = ["Tất cả", "Dễ", "Trung bình", "Khó"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thư viện công thức
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Khám phá hàng trăm công thức nấu ăn từ dễ đến khó, phù hợp với mọi người
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm công thức..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 border-b bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Loại món:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge 
                      key={category} 
                      variant={category === "Tất cả" ? "default" : "outline"}
                      className="cursor-pointer hover:bg-orange-600 hover:text-white"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Độ khó:</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Badge 
                      key={difficulty} 
                      variant={difficulty === "Tất cả" ? "default" : "outline"}
                      className="cursor-pointer hover:bg-green-600 hover:text-white"
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        ⭐ {recipe.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 hover:text-orange-600 transition-colors">
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
                        <ChefHat className="h-4 w-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Xem công thức
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RecipesPage;
