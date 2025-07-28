
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { RatingStars } from '@/components/recipe/RatingStars';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters';
import { Clock, Users, ChefHat, Filter, Star } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  image: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookTime: string;
  servings: number;
  tags: string[];
  rating: number;
  description: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  createdDate: string;
  views: number;
}

const RecipesPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Expanded recipe data with more Vietnamese dishes
  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Phở Bò Truyền Thống",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
      difficulty: "Khó",
      cookTime: "3 giờ",
      servings: 4,
      tags: ["Món chính", "Việt Nam", "Nước dùng"],
      rating: 4.8,
      description: "Công thức truyền thống để nấu tô phở bò thơm ngon đúng vị Hà Nội với nước dùng trong vắt",
      category: "Món chính",
      author: "Chef Nguyễn",
      status: "published",
      createdDate: "2024-01-15",
      views: 2450
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
      description: "Gỏi cuốn tươi ngon với tôm và thịt heo, ăn kèm nước chấm đậm đà",
      category: "Khai vị",
      author: "Chef Mai",
      status: "published",
      createdDate: "2024-01-12",
      views: 1230
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
      description: "Cơm tấm thơm ngon với sườn nướng BBQ kiểu Sài Gòn",
      category: "Món chính",
      author: "Admin",
      status: "published",
      createdDate: "2024-01-18",
      views: 1850
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
      description: "Bánh mì Việt Nam với thịt nướng thơm lừng và rau củ tươi ngon",
      category: "Ăn sáng",
      author: "Chef Linh",
      status: "published",
      createdDate: "2024-01-20",
      views: 980
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
      description: "Bún bò Huế đậm đà với nước dùng cay nồng đặc trưng miền Trung",
      category: "Món chính",
      author: "Chef Hương",
      status: "published",
      createdDate: "2024-01-10",
      views: 3200
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
      description: "Chè ba màu mát lành với đậu xanh, đậu đỏ và thạch",
      category: "Tráng miệng",
      author: "Chef An",
      status: "published",
      createdDate: "2024-01-08",
      views: 1560
    },
    {
      id: 7,
      title: "Salad Trái Cây Healthy",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      difficulty: "Dễ",
      cookTime: "15 phút",
      servings: 2,
      tags: ["Tráng miệng", "Healthy", "Tươi mát"],
      rating: 4.3,
      description: "Salad trái cây tươi ngon, bổ dưỡng và giàu vitamin",
      category: "Tráng miệng",
      author: "Admin",
      status: "published",
      createdDate: "2024-01-22",
      views: 750
    },
    {
      id: 8,
      title: "Bánh Xèo Miền Tây",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop",
      difficulty: "Trung bình",
      cookTime: "1 giờ",
      servings: 4,
      tags: ["Món chính", "Việt Nam", "Miền Tây"],
      rating: 4.6,
      description: "Bánh xèo giòn rụm với nhân tôm thịt, ăn kèm rau sống và nước chấm",
      category: "Món chính",
      author: "Chef Tâm",
      status: "published",
      createdDate: "2024-01-25",
      views: 1420
    }
  ];

  const categoryTabs = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Món chính', name: 'Món chính' },
    { id: 'Khai vị', name: 'Khai vị' },
    { id: 'Tráng miệng', name: 'Tráng miệng' },
    { id: 'Ăn sáng', name: 'Ăn sáng' }
  ];

  // Initialize filtered recipes
  useEffect(() => {
    setFilteredRecipes(recipes);
  }, []);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...recipes];
    setSearchQuery(filters.query || '');

    // Search query
    if (filters.query) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        recipe.tags.some((tag: string) => tag.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }

    // Categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.categories.some((cat: string) => recipe.category === cat || recipe.tags.includes(cat))
      );
    }

    // Difficulties
    if (filters.difficulties && filters.difficulties.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.difficulties.includes(recipe.difficulty)
      );
    }

    // Cook time (convert to minutes for comparison)
    if (filters.cookTimeMax && filters.cookTimeMax < 300) {
      filtered = filtered.filter(recipe => {
        const timeStr = recipe.cookTime;
        const hours = timeStr.includes('giờ') ? parseInt(timeStr) : 0;
        const minutes = timeStr.includes('phút') ? parseInt(timeStr.split(' ').find((s: string) => s.includes('phút'))?.replace('phút', '') || '0') : 0;
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes <= filters.cookTimeMax;
      });
    }

    // Rating
    if (filters.ratingMin && filters.ratingMin > 0) {
      filtered = filtered.filter(recipe => recipe.rating >= filters.ratingMin);
    }

    // Tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.tags.some((tag: string) => recipe.tags.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'cookTime':
        filtered.sort((a, b) => {
          const aTime = a.cookTime.includes('giờ') ? parseInt(a.cookTime) * 60 : parseInt(a.cookTime);
          const bTime = b.cookTime.includes('giờ') ? parseInt(b.cookTime) * 60 : parseInt(b.cookTime);
          return aTime - bTime;
        });
        break;
      case 'difficulty':
        const diffOrder = { 'Dễ': 1, 'Trung bình': 2, 'Khó': 3 };
        filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredRecipes(filtered);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    let filtered = [...recipes];

    if (categoryId !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === categoryId);
    }

    setFilteredRecipes(filtered);
  };

  // Handle search query from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      // Filter recipes based on search query
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchFromUrl.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchFromUrl.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchFromUrl.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section - Knorr Style */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thư viện công thức
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Khám phá hàng trăm công thức nấu ăn từ dễ đến khó, phù hợp với mọi người
            </p>

            <AdvancedSearchFilters
              onFiltersChange={handleFiltersChange}
              className="max-w-4xl mx-auto"
              initialQuery={searchQuery}
            />
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-6 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categoryTabs.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "border-orange-200 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipes Grid - Knorr Style */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` :
                   selectedCategory === 'all' ? 'Tất cả công thức' : categoryTabs.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Hiển thị {filteredRecipes.length} công thức
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredRecipes.length} kết quả
                </Badge>
              </div>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ChefHat className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy công thức nào
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <FavoriteButton itemId={recipe.id.toString()} itemType="recipe" />
                        <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {recipe.rating}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className={`${
                          recipe.difficulty === 'Dễ' ? 'bg-green-500' :
                          recipe.difficulty === 'Trung bình' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-2 hover:text-orange-600 transition-colors text-lg">
                        <Link to={`/recipes/${recipe.id}`}>
                          {recipe.title}
                        </Link>
                      </CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} người</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">{recipe.views.toLocaleString()} lượt xem</span>
                        </div>
                      </div>
                      <RatingStars rating={recipe.rating} readonly size="sm" className="mb-4" />
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">
                          Bởi {recipe.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(recipe.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <Link to={`/recipes/${recipe.id}`}>
                          Xem công thức
                        </Link>
                      </Button>
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

export default RecipesPage;
