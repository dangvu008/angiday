import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import BatchImportModal from './BatchImportModal';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  FileText,
  Link,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Copy
} from 'lucide-react';

const BatchImportDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importedRecipes, setImportedRecipes] = useState<any[]>([]);
  const { toast } = useToast();

  // Sample data for testing
  const sampleUrls = `https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/
https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524
https://www.tasteofhome.com/recipes/slow-cooker-chicken-and-dumplings/
https://www.delish.com/cooking/recipe-ideas/a19636089/best-chocolate-chip-cookies-recipe/
https://www.epicurious.com/recipes/food/views/simple-roast-chicken-51164760`;

  const sampleJsonData = {
    recipes: [
      {
        title: "Bánh mì thịt nướng",
        description: "Bánh mì Việt Nam truyền thống với thịt nướng thơm ngon",
        ingredients: "- 1 ổ bánh mì\n- 200g thịt heo\n- 1 củ cà rót\n- 1 củ đại con\n- Rau thơm\n- Tương ớt",
        instructions: "Bước 1: Ướp thịt với gia vị\nBước 2: Nướng thịt\nBước 3: Chuẩn bị rau\nBước 4: Lắp bánh mì",
        cookingTime: "30 phút",
        servings: 2,
        difficulty: "Dễ",
        category: "Món chính"
      },
      {
        title: "Phở gà",
        description: "Phở gà thanh đạm, thơm ngon",
        ingredients: "- 1 con gà\n- 500g bánh phở\n- Hành tây\n- Gừng\n- Gia vị phở",
        instructions: "Bước 1: Luộc gà\nBước 2: Nấu nước dùng\nBước 3: Chuẩn bị bánh phở\nBước 4: Trình bày",
        cookingTime: "2 giờ",
        servings: 4,
        difficulty: "Trung bình",
        category: "Món chính"
      }
    ]
  };

  const sampleCsvData = `title,description,ingredients,instructions,cookingTime,servings,difficulty,category
"Cơm tấm sườn nướng","Cơm tấm truyền thống với sườn nướng","- 2 chén cơm tấm\n- 300g sườn heo\n- Nước mắm\n- Đường","Bước 1: Ướp sườn\nBước 2: Nướng sườn\nBước 3: Nấu cơm","45 phút",2,"Dễ","Món chính"
"Bún bò Huế","Bún bò Huế cay nồng đặc trưng","- 500g bún\n- 300g thịt bò\n- Mắm ruốc\n- Ớt","Bước 1: Nấu nước dùng\nBước 2: Chuẩn bị thịt\nBước 3: Trình bày","1.5 giờ",4,"Khó","Món chính"`;

  const handleImport = (recipes: any[]) => {
    setImportedRecipes(recipes);
    toast({
      title: "Thành công",
      description: `Đã import ${recipes.length} công thức thành công`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
    });
  };

  const downloadSampleFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Batch Import Demo</h1>
        <p className="text-gray-600">
          Demo tính năng batch import cho phép nhập hàng loạt công thức món ăn
        </p>
      </div>

      {/* Main Action */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardContent className="p-8 text-center">
          <Upload className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">Bắt đầu Batch Import</h2>
          <p className="text-gray-600 mb-4">
            Nhập hàng loạt công thức từ URL hoặc file dữ liệu
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <Upload className="mr-2 h-5 w-5" />
            Mở Batch Import
          </Button>
        </CardContent>
      </Card>

      {/* Sample Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Sample URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={sampleUrls}
              readOnly
              rows={6}
              className="font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(sampleUrls)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadSampleFile(sampleUrls, 'sample-urls.txt', 'text/plain')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sample JSON
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={JSON.stringify(sampleJsonData, null, 2)}
              readOnly
              rows={6}
              className="font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(JSON.stringify(sampleJsonData, null, 2))}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadSampleFile(
                  JSON.stringify(sampleJsonData, null, 2), 
                  'sample-recipes.json', 
                  'application/json'
                )}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sample CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={sampleCsvData}
              readOnly
              rows={6}
              className="font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(sampleCsvData)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadSampleFile(sampleCsvData, 'sample-recipes.csv', 'text/csv')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Tính năng Batch Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Batch URL Import</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">File Import (JSON/CSV/TXT)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Error Handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Preview & Review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Duplicate Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Bulk Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Smart Ingredient Input</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {importedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Import ({importedRecipes.length} công thức)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importedRecipes.map((recipe, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{recipe.title}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Thành công
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ {recipe.cookingTime}</span>
                    <span>👥 {recipe.servings} người</span>
                    <span>📊 {recipe.difficulty}</span>
                    <span>🏷️ {recipe.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <BatchImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
        type="recipe"
        existingRecipes={importedRecipes}
      />
    </div>
  );
};

export default BatchImportDemo;
