import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  FileText,
  Link,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';

const BatchImportDemoSimple = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Sample data for testing
  const sampleUrls = `https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/
https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524
https://www.tasteofhome.com/recipes/slow-cooker-chicken-and-dumplings/`;

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
      }
    ]
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
        <h1 className="text-3xl font-bold mb-2">Batch Import Demo (Simple)</h1>
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
            onClick={() => {
              toast({
                title: "Demo",
                description: "Tính năng batch import sẽ được mở ở đây",
              });
            }}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <Upload className="mr-2 h-5 w-5" />
            Mở Batch Import (Demo)
          </Button>
        </CardContent>
      </Card>

      {/* Sample Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              rows={4}
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
              rows={4}
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

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Đây là phiên bản demo đơn giản. 
            Để test tính năng batch import đầy đủ, vui lòng truy cập trang Admin → Recipe Management → Batch Import.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchImportDemoSimple;
