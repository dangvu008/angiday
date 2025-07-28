import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ImportService } from '@/services/ImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const ValidationTestDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // Test cases for different scenarios
  const testCases = [
    {
      category: '❌ URL không tồn tại',
      urls: [
        'https://nonexistent-website-12345.com/recipe',
        'https://example.com/404-page',
        'https://httpstat.us/404'
      ]
    },
    {
      category: '⚠️ Không phải trang nấu ăn',
      urls: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.facebook.com',
        'https://www.amazon.com/dp/B08N5WRWNW',
        'https://en.wikipedia.org/wiki/Cooking'
      ]
    },
    {
      category: '📰 Trang tin tức/blog',
      urls: [
        'https://www.bbc.com/news',
        'https://techcrunch.com',
        'https://medium.com/@example/article'
      ]
    },
    {
      category: '✅ Trang công thức tốt',
      urls: [
        'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
        'https://www.food.com/recipe/beef-stir-fry-15184',
        'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe'
      ]
    }
  ];

  const handleTest = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const importResult = await ImportService.extractFromUrl(url, 'recipe');
      setResult(importResult);

      // Show appropriate toast
      if (!importResult.success) {
        toast({
          title: "Validation Failed",
          description: importResult.error,
          variant: "destructive",
        });
      } else {
        const hasWarnings = importResult.warnings && importResult.warnings.length > 0;
        const hasCritical = importResult.warnings?.some(w => w.includes('⚠️ CẢNH BÁO'));
        
        toast({
          title: hasCritical ? "Có vấn đề nghiêm trọng" : hasWarnings ? "Có cảnh báo" : "Validation thành công",
          description: hasCritical 
            ? "Nội dung không phù hợp để import"
            : hasWarnings 
            ? "Có một số vấn đề cần lưu ý"
            : "Dữ liệu hợp lệ và sẵn sàng import",
          variant: hasCritical ? "destructive" : "default",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể kiểm tra URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean, warnings?: string[], score?: number) => {
    if (!success) return <XCircle className="h-5 w-5 text-red-500" />;
    
    const hasCritical = warnings?.some(w => w.includes('⚠️ CẢNH BÁO'));
    if (hasCritical) return <XCircle className="h-5 w-5 text-red-500" />;
    
    if (score !== undefined) {
      if (score >= 70) return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (score >= 40) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Demo Kiểm Tra Validation
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test các trường hợp validation: URL không tồn tại, nội dung không phù hợp, chất lượng dữ liệu
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL để kiểm tra</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/recipe"
                className="flex-1"
              />
              <Button 
                onClick={handleTest} 
                disabled={isLoading || !url.trim()}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Kiểm tra
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-4">
            <Label>URL mẫu để test:</Label>
            {testCases.map((testCase, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-sm">{testCase.category}</h4>
                <div className="flex flex-wrap gap-2 ml-4">
                  {testCase.urls.map((testUrl, urlIndex) => (
                    <Button
                      key={urlIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => setUrl(testUrl)}
                      className="text-xs"
                    >
                      Test {urlIndex + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          {result && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.success, result.warnings, result.validationScore)}
                <h3 className="text-lg font-semibold">
                  Kết quả kiểm tra
                </h3>
                {result.validationScore !== undefined && (
                  <Badge className={getScoreColor(result.validationScore)}>
                    Điểm: {result.validationScore}/100
                  </Badge>
                )}
                {result.contentType && (
                  <Badge variant="outline">
                    Loại: {result.contentType}
                  </Badge>
                )}
              </div>

              {/* Error */}
              {!result.success && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Lỗi
                  </h4>
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Cảnh báo ({result.warnings.length})
                  </h4>
                  <ul className="space-y-1">
                    {result.warnings.map((warning: string, index: number) => (
                      <li key={index} className={`text-sm flex items-start gap-2 ${
                        warning.includes('⚠️ CẢNH BÁO') ? 'text-red-700 font-medium' : 'text-yellow-700'
                      }`}>
                        <span className="mt-0.5">•</span>
                        <span>{warning.replace('⚠️ CẢNH BÁO: ', '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Info */}
              {result.success && result.data && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Dữ liệu trích xuất được
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tiêu đề:</span>
                      <p className="text-green-700">{result.data.title || 'Không có'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Ngôn ngữ:</span>
                      <p className="text-green-700">{result.data.detectedLanguage || 'Không xác định'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Nguyên liệu:</span>
                      <p className="text-green-700">
                        {result.data.ingredients ? 
                          `${result.data.ingredients.split('\n').filter((l: string) => l.trim()).length} items` : 
                          'Không có'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Hướng dẫn:</span>
                      <p className="text-green-700">
                        {result.data.instructions ? 
                          `${result.data.instructions.split('\n\n').filter((s: string) => s.trim()).length} steps` : 
                          'Không có'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Decision */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Quyết định Import</h4>
                {!result.success ? (
                  <p className="text-red-700">❌ Không thể import - URL không hợp lệ</p>
                ) : result.warnings?.some((w: string) => w.includes('⚠️ CẢNH BÁO')) ? (
                  <p className="text-red-700">❌ Không nên import - Nội dung không phù hợp</p>
                ) : result.validationScore && result.validationScore < 30 ? (
                  <p className="text-yellow-700">⚠️ Cân nhắc import - Chất lượng dữ liệu thấp</p>
                ) : (
                  <p className="text-green-700">✅ Có thể import - Dữ liệu hợp lệ</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationTestDemo;
