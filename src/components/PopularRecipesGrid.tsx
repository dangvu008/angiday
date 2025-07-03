import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, User, Star, Heart, Eye, Bookmark } from 'lucide-react';
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Công thức <span className="text-orange-600">phổ biến</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những công thức được yêu thích nhất từ cộng đồng Angiday
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Recipe - Left Side */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 overflow-hidden cursor-pointer h-full"
                  onClick={() => navigate(`/recipes/${featuredRecipe.id}`)}>
              <CardHeader className="p-0">
                <div className="aspect-[16/10] bg-gradient-to-br from-orange-200 to-yellow-200 relative overflow-hidden">
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Nổi bật
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 text-orange-500 fill-current" />
                      {featuredRecipe.rating}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-orange-300 transition-colors">
                      {featuredRecipe.title}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredRecipe.cookTime}
                      </span>
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredRecipe.servings}
                      </span>
                      <span>bởi {featuredRecipe.chef}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {featuredRecipe.description}
                </p>

                <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-500" />
                      {featuredRecipe.likes}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      {featuredRecipe.views}
                    </span>
                    <span className="flex items-center">
                      <Bookmark className="h-4 w-4 mr-1 text-green-500" />
                      {featuredRecipe.saves}
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {featuredRecipe.difficulty}
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {featuredRecipe.tags.map((tag, index) => (
                      <span key={index} className="bg-white text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3 w-full"
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
              <Card key={recipe.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}>
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {recipe.difficulty}
                      </span>
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
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.cookTime}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-400" />
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
