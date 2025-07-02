
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopularRecipes = () => {
  const navigate = useNavigate();

  const recipes = [
    {
      id: 1,
      title: "Phở bò truyền thống Hà Nội",
      description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon",
      image: "/placeholder.svg",
      cookTime: "3 giờ",
      servings: "4 người",
      difficulty: "Trung bình",
      chef: "Chef Hương",
      rating: 4.8,
      likes: 1200
    },
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
      likes: 980
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
      likes: 1500
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
      likes: 750
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Công thức <span className="text-orange-600">phổ biến</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những công thức được yêu thích nhất từ cộng đồng Angiday
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <CardHeader className="p-0">
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                      ⭐ {recipe.rating}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">bởi {recipe.chef}</span>
                  <span className="text-xs text-red-500">❤️ {recipe.likes}</span>
                </div>

                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recipes/${recipe.id}`);
                  }}
                >
                  Xem công thức
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
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

export default PopularRecipes;
