import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import RecipeModal from './RecipeModal';

interface Recipe {
  id?: number;
  title: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  ingredients?: string;
  instructions?: string;
  description?: string;
  image?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
}

const ValidationDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testScenario, setTestScenario] = useState<string>('');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: 'Phở Bò Truyền Thống',
      category: 'Món chính',
      difficulty: 'Khó',
      cookingTime: '3 giờ',
      servings: 4,
      author: 'Chef Nguyễn',
      status: 'published',
      ingredients: '500g thịt bò\n200g bánh phở\n1 củ hành tây',
      instructions: 'Bước 1: Chuẩn bị nguyên liệu\nBước 2: Nấu nước dùng\nBước 3: Luộc bánh phở',
      description: 'Món phở bò truyền thống với nước dùng đậm đà'
    }
  ]);

  const testScenarios = [
    {
      id: 'empty',
      name: 'Form trống',
      description: 'Test validation với tất cả các trường để trống',
      data: {
        title: '',
        category: 'Món chính',
        difficulty: 'Dễ' as const,
        cookingTime: '',
        servings: 0,
        author: '',
        status: 'draft' as const,
        ingredients: '',
        instructions: '',
        description: ''
      }
    },
    {
      id: 'duplicate_title',
      name: 'Tên trùng lặp',
      description: 'Test validation với tên món ăn đã tồn tại',
      data: {
        title: 'Phở Bò Truyền Thống',
        category: 'Món chính',
        difficulty: 'Dễ' as const,
        cookingTime: '30 phút',
        servings: 2,
        author: 'Test Chef',
        status: 'draft' as const,
        ingredients: 'Nguyên liệu test',
        instructions: 'Hướng dẫn test',
        description: 'Mô tả test'
      }
    },
    {
      id: 'too_long',
      name: 'Vượt quá giới hạn ký tự',
      description: 'Test validation với nội dung quá dài',
      data: {
        title: 'Tên món ăn này rất rất rất rất rất rất rất rất rất rất rất rất rất rất rất rất rất rất rất dài',
        category: 'Món chính',
        difficulty: 'Dễ' as const,
        cookingTime: '30 phút',
        servings: 2,
        author: 'Test Chef với tên rất rất rất rất rất rất rất rất rất rất dài',
        status: 'draft' as const,
        ingredients: 'A'.repeat(2500), // Vượt quá 2000 ký tự
        instructions: 'B'.repeat(6000), // Vượt quá 5000 ký tự
        description: 'C'.repeat(600) // Vượt quá 500 ký tự
      }
    },
    {
      id: 'too_short',
      name: 'Quá ngắn',
      description: 'Test validation với nội dung quá ngắn',
      data: {
        title: 'AB',
        category: 'Món chính',
        difficulty: 'Dễ' as const,
        cookingTime: 'A',
        servings: 2,
        author: 'A',
        status: 'draft' as const,
        ingredients: 'ABC',
        instructions: 'DEF',
        description: 'GHI'
      }
    },
    {
      id: 'invalid_values',
      name: 'Giá trị không hợp lệ',
      description: 'Test validation với các giá trị không hợp lệ',
      data: {
        title: 'Món ăn test',
        category: 'Món chính',
        difficulty: 'Dễ' as const,
        cookingTime: '30 phút',
        servings: 150, // Quá lớn
        author: 'Test Chef',
        status: 'draft' as const,
        ingredients: 'Nguyên liệu hợp lệ với độ dài phù hợp',
        instructions: 'Hướng dẫn hợp lệ với độ dài phù hợp',
        description: 'Mô tả hợp lệ',
        calories: 6000, // Quá lớn
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10', 'tag11'] // Quá nhiều tags
      }
    },
    {
      id: 'valid',
      name: 'Dữ liệu hợp lệ',
      description: 'Test với dữ liệu hoàn toàn hợp lệ',
      data: {
        title: 'Bánh Mì Thịt Nướng',
        category: 'Món chính',
        difficulty: 'Trung bình' as const,
        cookingTime: '45 phút',
        servings: 4,
        author: 'Chef Mai',
        status: 'draft' as const,
        ingredients: '300g thịt heo\n2 ổ bánh mì\n1 củ cà rốt\nRau sống\nĐồ chua',
        instructions: 'Bước 1: Ướp thịt với gia vị\nBước 2: Nướng thịt trên than hoa\nBước 3: Chuẩn bị rau sống\nBước 4: Lắp bánh mì',
        description: 'Bánh mì thịt nướng thơm ngon với thịt được ướp gia vị đậm đà',
        calories: 450,
        tags: ['bánh mì', 'thịt nướng', 'món việt']
      }
    }
  ];

  const handleTestScenario = (scenario: any) => {
    setTestScenario(scenario.id);
    setIsModalOpen(true);
  };

  const handleSave = (recipe: Recipe) => {
    const newRecipe = {
      ...recipe,
      id: Math.max(...savedRecipes.map(r => r.id || 0)) + 1
    };
    setSavedRecipes([...savedRecipes, newRecipe]);
  };

  const getSelectedScenario = () => {
    return testScenarios.find(s => s.id === testScenario);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Demo Validation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Trang này dùng để test hệ thống validation cho form chỉnh sửa công thức. 
              Chọn một scenario bên dưới để xem validation hoạt động như thế nào.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testScenarios.map((scenario) => (
              <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{scenario.name}</CardTitle>
                    <Badge variant={scenario.id === 'valid' ? 'default' : 'destructive'}>
                      {scenario.id === 'valid' ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                  <Button 
                    size="sm" 
                    onClick={() => handleTestScenario(scenario)}
                    className="w-full"
                  >
                    Test Scenario
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Recipes */}
      <Card>
        <CardHeader>
          <CardTitle>Công thức đã lưu ({savedRecipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">{recipe.title}</h4>
                  <p className="text-sm text-gray-600">{recipe.author} • {recipe.cookingTime}</p>
                </div>
                <Badge variant={recipe.status === 'published' ? 'default' : 'secondary'}>
                  {recipe.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        recipe={getSelectedScenario()?.data}
        mode="add"
        existingRecipes={savedRecipes}
      />
    </div>
  );
};

export default ValidationDemo;
