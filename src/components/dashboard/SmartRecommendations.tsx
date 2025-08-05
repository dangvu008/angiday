import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Heart, 
  ChefHat, 
  Clock, 
  Star, 
  ArrowRight,
  Flame,
  Users,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

const SmartRecommendations = () => {
  const { currentPlan, availableRecipes } = useMealPlanning();
  
  // Phân tích sở thích của người dùng dựa trên thực đơn hiện tại
  const analyzeUserPreferences = () => {
    if (!currentPlan || currentPlan.meals.length === 0) {
      return {
        preferredCategories: [],
        preferredDifficulty: [],
        averageCalories: 0,
        preferredTags: []
      };
    }
    
    const categories: { [key: string]: number } = {};
    const difficulties: { [key: string]: number } = {};
    const tags: { [key: string]: number } = {};
    let totalCalories = 0;
    let mealCount = 0;
    
    currentPlan.meals.forEach(meal => {
      if (meal.recipe) {
        // Đếm categories
        if (meal.recipe.category) {
          categories[meal.recipe.category] = (categories[meal.recipe.category] || 0) + 1;
        }
        
        // Đếm difficulty
        if (meal.recipe.difficulty) {
          difficulties[meal.recipe.difficulty] = (difficulties[meal.recipe.difficulty] || 0) + 1;
        }
        
        // Đếm tags
        meal.recipe.tags?.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
        
        // Tính calories
        totalCalories += meal.recipe.calories || 0;
        mealCount++;
      }
    });
    
    return {
      preferredCategories: Object.entries(categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category),
      preferredDifficulty: Object.entries(difficulties)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([difficulty]) => difficulty),
      averageCalories: mealCount > 0 ? Math.round(totalCalories / mealCount) : 0,
      preferredTags: Object.entries(tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag)
    };
  };
  
  // Tạo gợi ý thông minh
  const generateSmartRecommendations = () => {
    const preferences = analyzeUserPreferences();
    
    // Lọc recipes dựa trên sở thích
    const recommendedRecipes = availableRecipes
      .filter(recipe => {
        // Loại bỏ các recipe đã có trong kế hoạch hiện tại
        const isAlreadyInPlan = currentPlan?.meals.some(meal => 
          meal.recipe?.id === recipe.id
        );
        if (isAlreadyInPlan) return false;
        
        // Ưu tiên recipes phù hợp với sở thích
        const categoryMatch = preferences.preferredCategories.includes(recipe.category);
        const difficultyMatch = preferences.preferredDifficulty.includes(recipe.difficulty);
        const tagMatch = recipe.tags?.some(tag => preferences.preferredTags.includes(tag));
        const calorieMatch = preferences.averageCalories > 0 ? 
          Math.abs((recipe.calories || 0) - preferences.averageCalories) < 200 : true;
        
        return categoryMatch || difficultyMatch || tagMatch || calorieMatch;
      })
      .slice(0, 4);
    
    // Nếu không đủ gợi ý, thêm recipes phổ biến
    if (recommendedRecipes.length < 4) {
      const popularRecipes = availableRecipes
        .filter(recipe => !recommendedRecipes.some(r => r.id === recipe.id))
        .filter(recipe => !currentPlan?.meals.some(meal => meal.recipe?.id === recipe.id))
        .slice(0, 4 - recommendedRecipes.length);
      
      recommendedRecipes.push(...popularRecipes);
    }
    
    return recommendedRecipes;
  };
  
  // Tạo gợi ý thực đơn mẫu
  const generateMenuSuggestions = () => {
    const preferences = analyzeUserPreferences();

    return [
      {
        id: 1,
        name: "Thực đơn Gia Đình Việt Nam",
        description: "Món ăn quen thuộc, dễ nấu cho cả nhà",
        meals: 21,
        calories: "1800-2000 cal/ngày",
        price: 350000,
        image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=200&h=150&fit=crop",
        tags: ["gia-dinh", "viet-nam", "de-nau"],
        matchReason: preferences.preferredCategories.includes("Món Việt") ?
          "Phù hợp với sở thích món Việt của bạn" : "Món ăn gia đình quen thuộc, dễ nấu"
      },
      {
        id: 2,
        name: "Thực đơn Tiết Kiệm & Dinh Dưỡng",
        description: "Ngon bổ rẻ, phù hợp ngân sách",
        meals: 21,
        calories: "1900-2100 cal/ngày",
        price: 280000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop",
        tags: ["tiet-kiem", "dinh-duong", "gia-re"],
        matchReason: "Tối ưu chi phí mà vẫn đảm bảo dinh dưỡng"
      },
      {
        id: 3,
        name: "Thực đơn Nhanh Gọn Cho Người Bận",
        description: "Các món nấu nhanh dưới 30 phút",
        meals: 21,
        calories: "1700-1900 cal/ngày",
        price: 420000,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=150&fit=crop",
        tags: ["nhanh-gon", "don-gian", "it-thoi-gian"],
        matchReason: "Phù hợp với lối sống bận rộn"
      }
    ];
  };
  
  const recommendedRecipes = generateSmartRecommendations();
  const menuSuggestions = generateMenuSuggestions();
  const preferences = analyzeUserPreferences();
  
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Gợi ý công thức thông minh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            Gợi ý thông minh cho bạn
          </CardTitle>
          {preferences.preferredCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {preferences.preferredCategories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedRecipes.length > 0 ? (
            <>
              {recommendedRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{recipe.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Phù hợp với sở thích của bạn
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                        4.5
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center">
                        <Flame className="h-3 w-3 mr-1" />
                        {recipe.calories || 0} cal
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/recipes/${recipe.id}`}>Xem</Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/recipes">
                  Khám phá thêm công thức
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">
                Tạo thêm kế hoạch ăn uống để nhận gợi ý phù hợp
              </p>
              <Button asChild>
                <Link to="/recipes">Khám phá công thức</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gợi ý thực đơn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
            Thực đơn phù hợp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuSuggestions.map((menu) => (
            <div key={menu.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{menu.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{menu.matchReason}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {menu.meals} bữa ăn
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1" />
                      {menu.calories}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {menu.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-3" size="sm" asChild>
                <Link to={`/thuc-don/detail/${menu.id}`}>Áp dụng thực đơn</Link>
              </Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/thuc-don">
              Khám phá thêm thực đơn
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendations;
