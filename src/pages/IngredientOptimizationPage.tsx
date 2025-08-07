import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, RefreshCw } from 'lucide-react';
import DemoLayout from '@/components/layout/DemoLayout';
import IngredientOptimization from '@/components/admin/IngredientOptimization';

interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  category: string;
  author: string;
}

const IngredientOptimizationPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - trong thực tế sẽ fetch từ API
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: 'Phở Bò Truyền Thống',
        category: 'Món chính',
        author: 'Chef Nguyễn',
        ingredients: `- 1kg xương bò
- 500g thịt bò nạm
- 400g bánh phở tươi
- 2 củ hành tây
- 100g gừng tươi
- 1 thìa cà phê muối
- 2 thìa canh nước mắm
- 1 thìa canh đường
- Rau thơm: hành lá, ngò gai, húng quế`
      },
      {
        id: '2',
        title: 'Bún Bò Huế',
        category: 'Món chính',
        author: 'Chef Mai',
        ingredients: `- 800g xương bò
- 300g thịt bò
- 200g chả cua
- 400g bún bò
- 2 củ hành tây
- 50g gừng
- 1 thìa cà phê muối
- 3 thìa canh nước mắm
- 2 thìa canh tương ớt
- Rau sống: xà lách, giá đỗ`
      },
      {
        id: '3',
        title: 'Canh Chua Cá Lóc',
        category: 'Canh',
        author: 'Chef Hương',
        ingredients: `- 500g cá lóc
- 200g thơm
- 100g đậu bắp
- 2 quả cà chua
- 100g giá đỗ
- 50g me
- 1 thìa cà phê muối
- 2 thìa canh nước mắm
- 1 thìa canh đường
- Rau thơm: ngò gai, húng cây`
      },
      {
        id: '4',
        title: 'Gỏi Cuốn Tôm Thịt',
        category: 'Khai vị',
        author: 'Admin',
        ingredients: `- 300g tôm sú
- 200g thịt heo ba chỉ
- 12 tờ bánh tráng
- 100g bún tươi
- Rau sống: xà lách, húng quế, kinh giới
- 2 củ hành tây nhỏ
- 1 thìa cà phê muối
- 2 thìa canh nước mắm
- 1 thìa canh đường
- 50g đậu phộng rang`
      },
      {
        id: '5',
        title: 'Bánh Xèo Miền Tây',
        category: 'Món chính',
        author: 'Chef Lan',
        ingredients: `- 300g bột gạo
- 100ml nước cốt dừa
- 300g tôm
- 200g thịt heo
- 200g giá đỗ
- 2 củ hành tây
- 1 thìa cà phê muối
- 2 thìa canh nước mắm
- 1 thìa canh đường
- Rau sống: xà lách, húng lủi, kinh giới`
      }
    ];

    setTimeout(() => {
      setRecipes(mockRecipes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExportData = () => {
    // Xuất dữ liệu phân tích
    const dataToExport = {
      recipes: recipes.length,
      timestamp: new Date().toISOString(),
      recipes_data: recipes
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingredient-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.recipes_data) {
              setRecipes(data.recipes_data);
            }
          } catch (error) {
            console.error('Error importing data:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <DemoLayout
      title="Tối Ưu Hóa Nguyên Liệu"
      description="Demo tối ưu hóa nguyên liệu và giảm lãng phí"
      mainClassName="py-6"
    >
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
                  Tối Ưu Hóa Nguyên Liệu
                </h1>
                <p className="text-gray-600">
                  Phân tích và quản lý nguyên liệu để tránh trùng lặp và tối ưu chi phí
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Làm mới
              </Button>
              <Button variant="outline" onClick={handleImportData}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{recipes.length}</div>
                <div className="text-sm text-gray-600">Tổng công thức</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {recipes.reduce((total, recipe) => {
                    return total + recipe.ingredients.split('\n').filter(line => line.trim()).length;
                  }, 0)}
                </div>
                <div className="text-sm text-gray-600">Tổng dòng nguyên liệu</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(recipes.map(r => r.category)).size}
                </div>
                <div className="text-sm text-gray-600">Danh mục món ăn</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(recipes.map(r => r.author)).size}
                </div>
                <div className="text-sm text-gray-600">Tác giả</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6">
          <AlertDescription>
            <div className="font-medium mb-2">Hướng dẫn sử dụng:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Nguyên liệu trùng lặp:</strong> Hiển thị các nguyên liệu được sử dụng trong nhiều công thức</li>
              <li><strong>Có thể gộp:</strong> Các nguyên liệu tương tự có thể được gộp lại để tránh trùng lặp</li>
              <li><strong>Chưa sử dụng:</strong> Nguyên liệu trong hệ thống nhưng chưa được dùng trong công thức nào</li>
              <li><strong>Tất cả nguyên liệu:</strong> Quản lý toàn bộ danh sách nguyên liệu chuẩn hóa</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Recipe Categories */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(recipes.map(r => r.category))).map(category => {
                const count = recipes.filter(r => r.category === category).length;
                return (
                  <Badge key={category} variant="outline" className="px-3 py-1">
                    {category} ({count})
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Optimization Component */}
        <IngredientOptimization recipes={recipes} />
    </DemoLayout>
  );
};

export default IngredientOptimizationPage;
