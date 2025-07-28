import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Heart, Eye, Bookmark, ChefHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopularRecipesGrid = () => {
  const navigate = useNavigate();

  const featuredRecipe = {
    id: 1,
    title: "Phở bò truyền thống Hà Nội",
    description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon. Bí quyết từ các bậc thầy nấu phở lâu năm tại Hà Nội. Món ăn đặc trưng không thể thiếu trong ẩm thực Việt Nam.",
    image: "/placeholder.svg",
    cookTime: "3 giờ",
    servings: "4 người",
    difficulty: "Trung bình",
    chef: "Chef Hương",
    rating: 4.8,
    likes: 1200,
    views: 15000,
    saves: 890,
    tags: ["Món Việt", "Nước dùng", "Truyền thống", "Hà Nội"],
    ingredients: 12,
    steps: 8
  };

  const otherRecipes = [
    {
      id: 2,
      title: "Bánh mì Việt Nam",
      description: "Bánh mì giòn rụm với nhân thịt nguội, pate và rau thơm",
      image: "/placeholder.svg",
      cookTime: "45 phút",
      servings: "6 ổ",
      difficulty: "Dễ làm",
      chef: "Chef Minh",
      rating: 4.7,
      likes: 980,
      views: 8500
    },
    {
      id: 3,
      title: "Bún chả Hà Nội",
      description: "Món ăn đặc trưng với thịt nướng thơm lừng và bún tươi",
      image: "/placeholder.svg",
      cookTime: "1 giờ",
      servings: "4 người",
      difficulty: "Dễ làm",
      chef: "Chef Lan",
      rating: 4.9,
      likes: 1500,
      views: 12000
    },
    {
      id: 4,
      title: "Gỏi cuốn tôm thịt",
      description: "Món khai vị nhẹ nhàng, tươi mát với bánh tráng và rau sống",
      image: "/placeholder.svg",
      cookTime: "30 phút",
      servings: "6 cuốn",
      difficulty: "Dễ làm",
      chef: "Chef Hoa",
      rating: 4.6,
      likes: 750,
      views: 6800
    },
    {
      id: 5,
      title: "Chả cá Lã Vọng",
      description: "Món ăn đặc sản Hà Nội với cá chiên vàng và bún tươi",
      image: "/placeholder.svg",
      cookTime: "1.5 giờ",
      servings: "4 người",
      difficulty: "Trung bình",
      chef: "Chef Tùng",
      rating: 4.7,
      likes: 1100,
      views: 9200
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Công thức <span className="text-orange-600">phổ biến</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Những công thức được yêu thích nhất từ cộng đồng Angiday
            </p>
          </div>
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 rounded-full"
            onClick={() => navigate('/recipes')}
          >
            Xem thêm
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Recipe - Left Side */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white overflow-hidden cursor-pointer h-full rounded-2xl border-0 shadow-lg"
                  onClick={() => navigate(`/recipes/${featuredRecipe.id}`)}>
              <CardHeader className="p-0">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={featuredRecipe.image}
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
                      Nổi bật
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 hover:bg-white text-gray-700 border-0 shadow-md w-10 h-10 rounded-full p-0"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center shadow-md">
                      <Star className="h-4 w-4 mr-1 text-orange-500 fill-current" />
                      {featuredRecipe.rating}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-bold mb-2">
                      {featuredRecipe.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredRecipe.cookTime}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {featuredRecipe.servings}
                      </span>
                      <span>bởi {featuredRecipe.chef}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {featuredRecipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {featuredRecipe.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-xs text-gray-500">Thời gian</div>
                    <div className="text-sm font-semibold text-gray-900">{featuredRecipe.cookTime}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-xs text-gray-500">Khẩu phần</div>
                    <div className="text-sm font-semibold text-gray-900">{featuredRecipe.servings}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <ChefHat className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500">Độ khó</div>
                    <div className="text-sm font-semibold text-gray-900">{featuredRecipe.difficulty}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {featuredRecipe.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recipes/${featuredRecipe.id}`);
                  }}
                >
                  Xem công thức chi tiết
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Recipes - Right Side Grid */}
          <div className="space-y-6">
            {otherRecipes.map((recipe) => (
              <Card key={recipe.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-white overflow-hidden cursor-pointer rounded-2xl border-0 shadow-lg"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}>
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full relative overflow-hidden rounded-l-2xl">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                        {recipe.difficulty}
                      </Badge>
                      <div className="flex items-center text-xs text-orange-500">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {recipe.rating}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-orange-500" />
                        {recipe.cookTime}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        {recipe.likes}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      bởi {recipe.chef}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate('/recipes')}
          >
            Khám phá thêm công thức
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipesGrid;
