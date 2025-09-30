// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ImportService } from '@/services/ImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Brain, Shield, Globe, Zap } from 'lucide-react';

const SmartExtractionDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // Test cases for different extraction scenarios
  const testCases = [
    {
      category: '🔒 Trang bị chặn CORS',
      description: 'Test khả năng bypass restrictions',
      urls: [
        'https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524',
        'https://cooking.nytimes.com/recipes/1017089-chocolate-chip-cookies',
        'https://www.bonappetit.com/recipe/bas-best-chocolate-chip-cookies'
      ]
    },
    {
      category: '🧠 Structured Data (JSON-LD)',
      description: 'Trang có dữ liệu có cấu trúc tốt',
      urls: [
        'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
        'https://www.food.com/recipe/beef-stir-fry-15184',
        'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe'
      ]
    },
    {
      category: '🏗️ Microdata/Schema.org',
      description: 'Trang sử dụng microdata markup',
      urls: [
        'https://www.epicurious.com/recipes/food/views/perfect-chocolate-chip-cookies',
        'https://www.tasteofhome.com/recipes/chocolate-chip-cookies/'
      ]
    },
    {
      category: '🎯 CSS Selectors',
      description: 'Trang cần dùng CSS selectors',
      urls: [
        'https://www.delish.com/cooking/recipe-ideas/recipes/a58342/best-chocolate-chip-cookies-recipe/',
        'https://sallysbakingaddiction.com/chocolate-chip-cookies/'
      ]
    },
    {
      category: '🔄 Fallback Methods',
      description: 'Trang khó trích xuất, cần fallback',
      urls: [
        'https://www.recipetineats.com/chocolate-chip-cookies/',
        'https://www.kingarthurbaking.com/recipes/chocolate-chip-cookies-recipe'
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
      const startTime = Date.now();
      const importResult = await ImportService.extractFromUrl(url, 'recipe');
      const endTime = Date.now();

      setResult({
        ...importResult,
        extractionTime: endTime - startTime
      });

      if (importResult.success) {
        toast({
          title: "Trích xuất thành công",
          description: `Hoàn thành trong ${endTime - startTime}ms với phương thức ${importResult.data?.extractionMethod}`,
        });
      } else {
        toast({
          title: "Trích xuất thất bại",
          description: importResult.error,
          variant: "destructive",
        });
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'JSON-LD': return '🧠';
      case 'Microdata': return '🏗️';
      case 'Structured CSS': return '🎯';
      case 'Fallback': return '🔄';
      case 'Legacy': return '⚙️';
      default: return '❓';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'JSON-LD': return 'bg-green-100 text-green-800';
      case 'Microdata': return 'bg-blue-100 text-blue-800';
      case 'Structured CSS': return 'bg-purple-100 text-purple-800';
      case 'Fallback': return 'bg-yellow-100 text-yellow-800';
      case 'Legacy': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Demo Smart Extraction & Anti-Block
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test khả năng trích xuất thông minh với nhiều phương thức và bypass các trang web chặn truy cập
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL để test</Label>
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
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang trích xuất...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Smart Extract
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-4">
            <Label>Test cases theo phương thức trích xuất:</Label>
            {testCases.map((testCase, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{testCase.category}</h4>
                  <span className="text-xs text-gray-500">- {testCase.description}</span>
                </div>
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
            <div className="border-t pt-6 space-y-6">
              {/* Extraction Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Trạng thái</span>
                  </div>
                  <div className={`text-lg font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Thành công' : 'Thất bại'}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Thời gian</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {result.extractionTime}ms
                  </div>
                </Card>

                {result.data?.extractionMethod && (
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Phương thức</span>
                    </div>
                    <Badge className={getMethodColor(result.data.extractionMethod)}>
                      {getMethodIcon(result.data.extractionMethod)} {result.data.extractionMethod}
                    </Badge>
                  </Card>
                )}

                {result.data?.dataQuality && (
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Chất lượng</span>
                    </div>
                    <div className={`text-lg font-bold ${
                      result.data.dataQuality.overallConfidence >= 70 ? 'text-green-600' :
                      result.data.dataQuality.overallConfidence >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.data.dataQuality.overallConfidence}%
                    </div>
                  </Card>
                )}
              </div>

              {/* Data Quality Details */}
              {result.data?.dataQuality && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chi tiết chất lượng dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Tiêu đề</span>
                          <span className="text-sm font-medium">{result.data.dataQuality.titleConfidence}%</span>
                        </div>
                        <Progress value={result.data.dataQuality.titleConfidence} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Nguyên liệu</span>
                          <span className="text-sm font-medium">{result.data.dataQuality.ingredientsConfidence}%</span>
                        </div>
                        <Progress value={result.data.dataQuality.ingredientsConfidence} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Hướng dẫn</span>
                          <span className="text-sm font-medium">{result.data.dataQuality.instructionsConfidence}%</span>
                        </div>
                        <Progress value={result.data.dataQuality.instructionsConfidence} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Field Mapping */}
              {result.data?.fieldMapping && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nguồn dữ liệu từng trường</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(result.data.fieldMapping).map(([field, source]) => (
                        <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="font-medium capitalize">{field}</span>
                          <Badge variant="outline" className={getMethodColor(source as string)}>
                            {getMethodIcon(source as string)} {source}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Extracted Data Preview */}
              {result.success && result.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview dữ liệu trích xuất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tên món:</span>
                        <p className="text-gray-700 mt-1">{result.data.title || 'Không có'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Ngôn ngữ:</span>
                        <p className="text-gray-700 mt-1">{result.data.detectedLanguage || 'Không xác định'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Nguyên liệu:</span>
                        <p className="text-gray-700 mt-1">
                          {result.data.ingredients ? 
                            `${result.data.ingredients.split('\n').filter((l: string) => l.trim()).length} items` : 
                            'Không có'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Hướng dẫn:</span>
                        <p className="text-gray-700 mt-1">
                          {result.data.instructions ? 
                            `${result.data.instructions.split('\n\n').filter((s: string) => s.trim()).length} steps` : 
                            'Không có'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartExtractionDemo;
