import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Clock, User, Star, Heart, Eye, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopularRecipes = () => {
  const navigate = useNavigate();

  const featuredRecipe = {
    id: 1,
    title: "Phở bò truyền thống Hà Nội",
    description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon. Bí quyết từ các bậc thầy nấu phở lâu năm tại Hà Nội.",
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

        {/* Featured Recipe - Hero Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-orange-500 mr-4">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-semibold">{featuredRecipe.rating}</span>
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium mr-2">
                    Nổi bật
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {featuredRecipe.difficulty}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredRecipe.title}
                </h3>
                
                <p className="text-gray-600 text-lg mb-6">
                  {featuredRecipe.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-orange-500" />
                    <span>{featuredRecipe.cookTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2 text-orange-500" />
                    <span>{featuredRecipe.servings}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                  <span>bởi <strong>{featuredRecipe.chef}</strong></span>
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
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-8">
                  <span>{featuredRecipe.ingredients} nguyên liệu</span>
                  <span>{featuredRecipe.steps} bước thực hiện</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
                  onClick={() => navigate(`/recipes/${featuredRecipe.id}`)}
                >
                  Xem công thức chi tiết
                </Button>
              </div>
              
              <div className="relative order-1 md:order-2">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 to-yellow-200 relative overflow-hidden">
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-800">
                          Độ khó: {featuredRecipe.difficulty}
                        </div>
                        <div className="text-sm text-gray-600">
                          {featuredRecipe.cookTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Recipes Carousel */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Công thức khác</h3>
            <Button 
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={() => navigate('/recipes')}
            >
              Khám phá thêm
            </Button>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {otherRecipes.map((recipe) => (
                <CarouselItem key={recipe.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full"
                        onClick={() => navigate(`/recipes/${recipe.id}`)}>
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1 text-orange-500" />
                            {recipe.rating}
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {recipe.cookTime}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {recipe.servings}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">bởi {recipe.chef}</span>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-red-500 flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {recipe.likes}
                          </span>
                          <span className="text-blue-500 flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {recipe.views}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recipes/${recipe.id}`);
                        }}
                      >
                        Xem công thức
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;
