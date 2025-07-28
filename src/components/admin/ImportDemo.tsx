import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImportService } from '@/services/ImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, ExternalLink } from 'lucide-react';

const ImportDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const { toast } = useToast();

  // Sample URLs for testing
  const sampleUrls = [
    'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
    'https://www.food.com/recipe/beef-stir-fry-15184',
    'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe'
  ];

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImportService.extractFromUrl(url, 'recipe');
      
      if (result.success && result.data) {
        setExtractedData(result.data);
        toast({
          title: "Thành công",
          description: "Đã trích xuất dữ liệu thành công",
        });
      } else {
        throw new Error(result.error || 'Không thể trích xuất dữ liệu');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể trích xuất dữ liệu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setExtractedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Demo Import Công Thức Món Ăn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL trang web công thức</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/recipe"
                className="flex-1"
              />
              <Button 
                onClick={handleExtract} 
                disabled={isLoading || !url.trim()}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Trích xuất'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>URL mẫu để test:</Label>
            <div className="flex flex-wrap gap-2">
              {sampleUrls.map((sampleUrl, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(sampleUrl)}
                  className="text-xs"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Mẫu {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {extractedData && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Dữ liệu đã trích xuất:</h3>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên món ăn</Label>
                  <Input value={extractedData.title || ''} readOnly />
                </div>
                
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Input value={extractedData.category || ''} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Thời gian nấu</Label>
                  <Input value={extractedData.cookingTime || ''} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Số khẩu phần</Label>
                  <Input value={extractedData.servings || ''} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Độ khó</Label>
                  <Input value={extractedData.difficulty || ''} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input value={extractedData.calories || 'Không có'} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hình ảnh</Label>
                <Input value={extractedData.image || 'Không có'} readOnly />
                {extractedData.image && (
                  <img 
                    src={extractedData.image} 
                    alt="Recipe" 
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea 
                  value={extractedData.description || 'Không có mô tả'} 
                  readOnly 
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Nguyên liệu</Label>
                <Textarea 
                  value={extractedData.ingredients || 'Không trích xuất được nguyên liệu'} 
                  readOnly 
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Hướng dẫn</Label>
                <Textarea 
                  value={extractedData.instructions || 'Không trích xuất được hướng dẫn'} 
                  readOnly 
                  rows={8}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportDemo;
