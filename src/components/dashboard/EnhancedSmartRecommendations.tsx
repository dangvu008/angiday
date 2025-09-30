// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  DollarSign,
  ArrowRight,
  Heart,
  Star,
  Flame,
  Leaf,
  Baby,
  Wallet,
  Calendar,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockRecipes, menuThemes, personalRecipes } from '@/data/mockRecipes';

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  servings: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  calories: number;
  cost: number;
  tags: string[];
  description: string;
  isPopular?: boolean;
  isFamilyFriendly?: boolean;
}

interface MenuTheme {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  recipes: Recipe[];
}

const EnhancedSmartRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'menus'>('dishes');

  // Sử dụng dữ liệu mẫu
  const familyFriendlyRecipes = mockRecipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    cookTime: recipe.cookingTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    calories: recipe.nutrition.calories,
    cost: recipe.cost,
    tags: recipe.tags,
    description: recipe.description,
    isPopular: recipe.isPopular,
    isFamilyFriendly: recipe.rating >= 4.5
  }));

  // Các thực đơn theo chủ đề sử dụng dữ liệu mẫu
  const menuThemesList: MenuTheme[] = [
    {
      id: 'budget',
      title: 'Thực Đơn Tiết Kiệm',
      description: 'Ngon bổ rẻ, phù hợp túi tiền',
      icon: <Wallet className="h-5 w-5" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      recipes: menuThemes.budget.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        image: r.image,
        cookTime: r.cookingTime,
        cost: r.cost
      }))
    },
    {
      id: 'quick',
      title: 'Thực Đơn Nhanh Gọn',
      description: 'Dưới 30 phút, phù hợp bận rộn',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      recipes: menuThemes.quick.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        image: r.image,
        cookTime: r.cookingTime,
        cost: r.cost
      }))
    },
    {
      id: 'healthy',
      title: 'Thực Đơn Healthy',
      description: 'Ít calo, nhiều rau xanh',
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      recipes: menuThemes.healthy.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        image: r.image,
        cookTime: r.cookingTime,
        cost: r.cost
      }))
    },
    {
      id: 'family',
      title: 'Thực Đơn Gia Đình',
      description: 'Món ngon mọi người đều thích',
      icon: <Users className="h-5 w-5" />,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      recipes: menuThemes.family.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        image: r.image,
        cookTime: r.cookingTime,
        cost: r.cost
      }))
    }
  ];

  const renderRecipeCard = (recipe: Recipe) => (
    <div 
      key={recipe.id}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {recipe.isPopular && (
            <Badge className="bg-red-500 text-white text-xs">
              <Star className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
          {recipe.isFamilyFriendly && (
            <Badge className="bg-blue-500 text-white text-xs">
              <Users className="h-3 w-3 mr-1" />
              Gia đình
            </Badge>
          )}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{recipe.title}</h4>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.cookTime}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {recipe.calories} kcal
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {recipe.cost.toLocaleString()}đ
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {recipe.difficulty}
          </Badge>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMenuTheme = (theme: MenuTheme) => (
    <Card key={theme.id} className={`${theme.borderColor} ${theme.bgColor} hover:shadow-md transition-all duration-200`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg flex items-center gap-2 ${theme.color}`}>
          {theme.icon}
          {theme.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{theme.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {theme.recipes.map(recipe => (
            <div key={recipe.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 text-sm">{recipe.title}</h5>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{recipe.cookTime}</span>
                  <span>•</span>
                  <span>{recipe.cost.toLocaleString()}đ</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
          Xem thực đơn đầy đủ
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Gợi ý món ăn thông minh */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              Gợi Ý Thông Minh Cho Bạn
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Làm mới
              </Button>
            </div>
          </div>
          <p className="text-gray-600">Các món ăn gia đình dễ làm, phù hợp với sở thích của bạn</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyFriendlyRecipes.slice(0, 6).map(renderRecipeCard)}
          </div>
          <div className="text-center mt-6">
            <Button asChild variant="outline">
              <Link to="/recipes">
                Xem thêm món ăn
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thực đơn phù hợp */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
            Thực Đơn Phù Hợp
          </CardTitle>
          <p className="text-gray-600">Các bộ thực đơn được thiết kế cho từng nhu cầu cụ thể</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuThemesList.map(renderMenuTheme)}
          </div>
          <div className="text-center mt-6">
            <Button asChild variant="outline">
              <Link to="/meal-templates">
                Khám phá thêm thực đơn
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSmartRecommendations;
