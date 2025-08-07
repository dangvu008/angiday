import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import KnorrStyleRecipeCard from '@/components/recipe/KnorrStyleRecipeCard';
import KnorrNutritionFacts from '@/components/recipe/KnorrNutritionFacts';

const KnorrStyleDemo = () => {
  // Mock recipe data
  const mockRecipe = {
    id: "1",
    title: "Phở bò truyền thống Hà Nội",
    description: "Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon được truyền từ đời này sang đời khác",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    category: "Món chính",
    cookTime: "3 giờ",
    servings: "4 người",
    difficulty: "Trung bình",
    rating: 4.8,
    likes: 1200,
    chef: "Chef Hương"
  };

  const mockNutrition = {
    calories: 420,
    protein: 28.5,
    carbs: 45.2,
    fat: 12.8,
    fiber: 3.2,
    sugar: 8.1
  };

  const recipes = [
    mockRecipe,
    {
      ...mockRecipe,
      id: "2",
      title: "Bún bò Huế",
      description: "Món bún bò Huế đậm đà với nước dùng cay nồng đặc trưng",
      image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=800&h=600&fit=crop",
      cookTime: "2 giờ",
      rating: 4.6,
      likes: 890
    },
    {
      ...mockRecipe,
      id: "3", 
      title: "Bánh mì thịt nướng",
      description: "Bánh mì Việt Nam với thịt nướng thơm lừng, rau sống tươi mát",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop",
      cookTime: "45 phút",
      difficulty: "Dễ",
      rating: 4.4,
      likes: 650
    }
  ];

  return (
    <DemoLayout
      title="Demo Knorr Style Components"
      description="Trình diễn các component UI theo phong cách Knorr với thiết kế hiện đại và tương tác mượt mà"
      mainClassName="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-12">
          
          {/* Recipe Cards Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Knorr Style Recipe Cards</h2>
              <p className="text-lg text-gray-600">Cards với thiết kế hiện đại, hover effects và visual hierarchy</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <KnorrStyleRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => window.open(`/recipes/${recipe.id}`, '_blank')}
                />
              ))}
            </div>
          </section>

          {/* Nutrition Facts Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Knorr Style Nutrition Facts</h2>
              <p className="text-lg text-gray-600">Thông tin dinh dưỡng chi tiết với health score và visual progress</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <KnorrNutritionFacts
                  nutrition={mockNutrition}
                  servings={4}
                />
              </div>
            </div>
          </section>

          {/* Features Showcase */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tính năng nổi bật</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🎨</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Visual Design</h3>
                <p className="text-sm text-gray-600">Gradients, shadows, rounded corners theo style Knorr</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Interactive</h3>
                <p className="text-sm text-gray-600">Hover effects, animations, progress tracking</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Data Rich</h3>
                <p className="text-sm text-gray-600">Health scores, nutrition analysis, smart tips</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📱</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Responsive</h3>
                <p className="text-sm text-gray-600">Mobile-first design, adaptive layouts</p>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Color Palette</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-full h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-3"></div>
                <h4 className="font-semibold text-gray-900">Orange</h4>
                <p className="text-sm text-gray-600">Primary brand</p>
              </div>
              
              <div className="text-center">
                <div className="w-full h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-3"></div>
                <h4 className="font-semibold text-gray-900">Green</h4>
                <p className="text-sm text-gray-600">Health & nutrition</p>
              </div>
              
              <div className="text-center">
                <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-3"></div>
                <h4 className="font-semibold text-gray-900">Blue</h4>
                <p className="text-sm text-gray-600">Information</p>
              </div>
              
              <div className="text-center">
                <div className="w-full h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-3"></div>
                <h4 className="font-semibold text-gray-900">Purple</h4>
                <p className="text-sm text-gray-600">Premium features</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Typography</h2>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Heading 1 - Hero Title</h1>
                <p className="text-gray-600">text-4xl font-bold</p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Heading 2 - Section Title</h2>
                <p className="text-gray-600">text-3xl font-bold</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Heading 3 - Card Title</h3>
                <p className="text-gray-600">text-2xl font-bold</p>
              </div>
              
              <div>
                <p className="text-lg text-gray-700 mb-2">Body Large - Description text with good readability</p>
                <p className="text-gray-600">text-lg text-gray-700</p>
              </div>
              
              <div>
                <p className="text-base text-gray-700 mb-2">Body Regular - Standard paragraph text for content</p>
                <p className="text-gray-600">text-base text-gray-700</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Body Small - Secondary information and captions</p>
                <p className="text-gray-600">text-sm text-gray-600</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Trải nghiệm thiết kế mới</h2>
            <p className="text-xl mb-8 opacity-90">
              Khám phá trang chi tiết công thức với thiết kế Knorr style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
                onClick={() => window.open('/recipes/1', '_blank')}
              >
                Xem trang chi tiết
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3"
                onClick={() => window.open('/recipes', '_blank')}
              >
                Danh sách công thức
              </Button>
            </div>
          </section>
        </div>
    </DemoLayout>
  );
};

export default KnorrStyleDemo;
