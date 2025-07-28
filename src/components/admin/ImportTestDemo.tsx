import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ImportService } from '@/services/ImportService';
import {
  Link,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye
} from 'lucide-react';

const ImportTestDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample URLs for testing
  const sampleUrls = [
    'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
    'https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524',
    'https://www.tasteofhome.com/recipes/slow-cooker-chicken-and-dumplings/',
    'https://www.delish.com/cooking/recipe-ideas/a19636089/best-chocolate-chip-cookies-recipe/',
    'https://www.epicurious.com/recipes/food/views/simple-roast-chicken-51164760'
  ];

  const handleImport = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 300);

      console.log('🚀 Starting import from URL:', url);
      const importResult = await ImportService.extractFromUrl(url, 'recipe');
      
      clearInterval(progressInterval);
      setProgress(100);

      if (importResult.success && importResult.data) {
        setResult(importResult);
        toast({
          title: "Thành công",
          description: "Đã trích xuất công thức thành công!",
        });
      } else {
        throw new Error(importResult.error || 'Unknown error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleUrl = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Test Demo</h1>
        <p className="text-gray-600">
          Test tính năng import công thức từ URL với API miễn phí
        </p>
      </div>

      {/* Import Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Test Import từ URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url">URL công thức</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/recipe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Đang trích xuất dữ liệu...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={isLoading || !url.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Import Recipe
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Sample URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Sample URLs để test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {sampleUrls.map((sampleUrl, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1 text-sm font-mono truncate">{sampleUrl}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSampleUrl(sampleUrl)}
                  disabled={isLoading}
                >
                  Sử dụng
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Lỗi Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-700 text-sm whitespace-pre-wrap">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Result */}
      {result && result.success && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Import thành công!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Tên:</strong> {result.data.title || 'N/A'}</div>
                  <div><strong>Mô tả:</strong> {result.data.description || 'N/A'}</div>
                  <div><strong>Thời gian:</strong> {result.data.cookingTime || 'N/A'}</div>
                  <div><strong>Khẩu phần:</strong> {result.data.servings || 'N/A'}</div>
                  <div><strong>Độ khó:</strong> {result.data.difficulty || 'N/A'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Phương pháp:</strong> {result.data.extractionMethod || 'N/A'}</div>
                  <div><strong>Ngôn ngữ:</strong> {result.data.detectedLanguage || 'N/A'}</div>
                  {result.data.dataQuality && (
                    <div>
                      <strong>Chất lượng:</strong> 
                      <Badge className="ml-2">
                        {result.data.dataQuality.overallConfidence}%
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Nguyên liệu</h3>
                <div className="bg-white p-3 rounded border text-sm whitespace-pre-wrap">
                  {result.data.ingredients || 'Không có thông tin'}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cách làm</h3>
                <div className="bg-white p-3 rounded border text-sm whitespace-pre-wrap">
                  {result.data.instructions || 'Không có thông tin'}
                </div>
              </div>
            </div>

            {result.warnings && result.warnings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Cảnh báo
                </h3>
                <div className="space-y-1">
                  {result.warnings.map((warning: string, index: number) => (
                    <div key={index} className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* API Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Tính năng import sử dụng các API miễn phí để bypass CORS. 
            Nếu một API không hoạt động, hệ thống sẽ tự động thử các API khác hoặc tạo dữ liệu demo.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportTestDemo;
