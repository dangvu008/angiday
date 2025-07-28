import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calculator, Zap, Activity, Wheat, Droplets } from 'lucide-react';
import SmartIngredientInput from '@/components/admin/SmartIngredientInput';
import NutritionDisplay from '@/components/admin/NutritionDisplay';
import { NutritionInfo } from '@/services/NutritionCalculatorService';

const NutritionCalculatorTestPage = () => {
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState(2);
  const [calculatedNutrition, setCalculatedNutrition] = useState<NutritionInfo | null>(null);

  const sampleRecipes = [
    {
      name: 'Phở Bò Truyền Thống',
      ingredients: `- 500g thịt bò nạm
- 200g bánh phở tươi
- 1 củ hành tây
- 50g gừng
- 1 thìa cà phê muối
- 2 thìa canh nước mắm
- 1 thìa canh đường
- 100g rau thơm`,
      servings: 4
    },
    {
      name: 'Salad Gà Healthy',
      ingredients: `- 200g ức gà
- 100g xà lách
- 50g cà chua cherry
- 30g dầu olive
- 1 thìa cà phê muối
- 20g hạt óc chó`,
      servings: 2
    },
    {
      name: 'Cơm Chiên Hải Sản',
      ingredients: `- 300g cơm nguội
- 150g tôm
- 100g mực
- 2 quả trứng
- 50g đậu Hà Lan
- 30ml dầu ăn
- 2 thìa canh nước mắm`,
      servings: 3
    }
  ];

  const loadSampleRecipe = (recipe: typeof sampleRecipes[0]) => {
    setIngredients(recipe.ingredients);
    setServings(recipe.servings);
  };

  const handleNutritionChange = (nutrition: NutritionInfo) => {
    setCalculatedNutrition(nutrition);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Test Tính Toán Dinh Dưỡng
                </h1>
                <p className="text-gray-600">
                  Tự động tính toán calo và thông tin dinh dưỡng từ nguyên liệu
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Info */}
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Hướng dẫn sử dụng:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Nhập nguyên liệu theo định dạng: "số lượng + đơn vị + tên nguyên liệu"</li>
                <li>Hệ thống sẽ tự động tính toán dinh dưỡng dựa trên database nguyên liệu</li>
                <li>Thay đổi số khẩu phần để xem dinh dưỡng per serving</li>
                <li>Sử dụng các mẫu công thức có sẵn để test nhanh</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Sample Recipes */}
          <Card>
            <CardHeader>
              <CardTitle>Mẫu Công Thức</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {sampleRecipes.map((recipe, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{recipe.name}</h4>
                      <Badge variant="outline">{recipe.servings} khẩu phần</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {recipe.ingredients.split('\n').length} nguyên liệu
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => loadSampleRecipe(recipe)}
                      className="w-full"
                    >
                      Tải mẫu
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nhập Nguyên Liệu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servings">Số khẩu phần</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="1"
                        max="20"
                        value={servings}
                        onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIngredients('');
                          setCalculatedNutrition(null);
                        }}
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                  </div>

                  <SmartIngredientInput
                    value={ingredients}
                    onChange={setIngredients}
                    servings={servings}
                    showNutrition={true}
                    onNutritionChange={handleNutritionChange}
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {calculatedNutrition && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Tóm Tắt Nhanh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-600">
                          {calculatedNutrition.calories}
                        </div>
                        <div className="text-sm text-yellow-700">Calories</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Protein</span>
                          </div>
                          <span className="font-medium">{calculatedNutrition.protein}g</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wheat className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Carbs</span>
                          </div>
                          <span className="font-medium">{calculatedNutrition.carbs}g</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Chất béo</span>
                          </div>
                          <span className="font-medium">{calculatedNutrition.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Nutrition Display */}
            <div>
              <NutritionDisplay
                ingredients={ingredients}
                servings={servings}
                showGoals={true}
                onNutritionChange={handleNutritionChange}
              />
            </div>
          </div>

          {/* Features Info */}
          <Card>
            <CardHeader>
              <CardTitle>Tính Năng Hệ Thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Tính Toán Tự Động</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Phân tích nguyên liệu từ text input</li>
                    <li>• Chuyển đổi đơn vị tự động (g, kg, thìa, củ, etc.)</li>
                    <li>• Tính toán dinh dưỡng dựa trên database chuẩn</li>
                    <li>• Ước tính khi thiếu dữ liệu chính xác</li>
                    <li>• Tính toán theo số khẩu phần</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Thông Tin Dinh Dưỡng</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Calories, Protein, Carbs, Fat</li>
                    <li>• Chất xơ, Đường, Natri</li>
                    <li>• Calcium, Iron, Vitamin C</li>
                    <li>• Phân tích macro distribution</li>
                    <li>• So sánh với Daily Values</li>
                    <li>• Health score và recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NutritionCalculatorTestPage;
