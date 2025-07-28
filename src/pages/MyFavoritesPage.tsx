import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { RatingStars } from '@/components/recipe/RatingStars';
import { Clock, Users, ChefHat, Heart } from 'lucide-react';

interface FavoriteItem {
  id: string;
  type: 'recipe' | 'meal-plan';
  addedAt: string;
}

const MyFavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Mock data for demo - in real app, this would come from API
  const mockRecipes = [
    {
      id: '1',
      title: "Phở Bò Hà Nội",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "2 giờ",
      servings: 4,
      rating: 4.8,
      description: "Công thức truyền thống để nấu tô phở bò thơm ngon đúng vị Hà Nội"
    },
    {
      id: '3',
      title: "Cơm Tấm Sườn Nướng",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "1 giờ",
      servings: 2,
      rating: 4.7,
      description: "Cơm tấm thơm ngon với sườn nướng BBQ kiểu Sài Gòn"
    }
  ];

  const mockMealPlans = [
    {
      id: '1',
      title: "Thực đơn 7 ngày healthy",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      duration: "7 ngày",
      meals: 21,
      rating: 4.6,
      description: "Thực đơn cân bằng dinh dưỡng cho cả tuần"
    }
  ];

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Filter items by type
  const favoriteRecipes = favorites
    .filter(fav => fav.type === 'recipe')
    .map(fav => mockRecipes.find(recipe => recipe.id === fav.id))
    .filter(Boolean);

  const favoriteMealPlans = favorites
    .filter(fav => fav.type === 'meal-plan')
    .map(fav => mockMealPlans.find(plan => plan.id === fav.id))
    .filter(Boolean);

  const refreshFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
        {/* Hero Section */}
        <section className="py-12 px-4 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Danh sách yêu thích
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Tất cả những công thức và thực đơn bạn đã lưu lại
            </p>
            {favorites.length > 0 && (
              <Badge variant="secondary" className="mt-4">
                {favorites.length} mục đã lưu
              </Badge>
            )}
          </div>
        </section>

        {favorites.length === 0 ? (
          // Empty State
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Chưa có mục yêu thích nào</h3>
              <p className="text-muted-foreground mb-8">
                Hãy khám phá những công thức tuyệt vời và thêm vào danh sách yêu thích của bạn
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link to="/recipes">Xem công thức</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/meal-plans">Xem thực đơn</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Favorite Recipes */}
              {favoriteRecipes.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <ChefHat className="h-6 w-6 mr-2" />
                    Công thức yêu thích ({favoriteRecipes.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.map((recipe) => (
                      <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video overflow-hidden relative">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <FavoriteButton 
                              itemId={recipe.id} 
                              itemType="recipe"
                              className="bg-white/80 hover:bg-white"
                            />
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            <Link 
                              to={`/recipes/${recipe.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {recipe.title}
                            </Link>
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {recipe.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                          <RatingStars rating={recipe.rating} readonly size="sm" className="mb-4" />
                          <Button asChild className="w-full">
                            <Link to={`/recipes/${recipe.id}`}>Xem công thức</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Favorite Meal Plans */}
              {favoriteMealPlans.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    Thực đơn yêu thích ({favoriteMealPlans.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteMealPlans.map((plan) => (
                      <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video overflow-hidden relative">
                          <img 
                            src={plan.image} 
                            alt={plan.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <FavoriteButton 
                              itemId={plan.id} 
                              itemType="meal-plan"
                              className="bg-white/80 hover:bg-white"
                            />
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            <Link 
                              to={`/meal-plans/${plan.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {plan.title}
                            </Link>
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {plan.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{plan.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{plan.meals} bữa</span>
                            </div>
                          </div>
                          <RatingStars rating={plan.rating} readonly size="sm" className="mb-4" />
                          <Button asChild className="w-full">
                            <Link to={`/meal-plans/${plan.id}`}>Xem thực đơn</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default MyFavoritesPage;