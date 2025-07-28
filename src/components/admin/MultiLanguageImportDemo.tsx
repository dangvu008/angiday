import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImportService } from '@/services/ImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, ExternalLink, Globe, Languages } from 'lucide-react';

const MultiLanguageImportDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const { toast } = useToast();

  // Sample URLs for different languages
  const sampleUrls = [
    {
      language: 'English',
      flag: '🇺🇸',
      urls: [
        'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
        'https://www.food.com/recipe/beef-stir-fry-15184',
        'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe'
      ]
    },
    {
      language: 'Chinese',
      flag: '🇨🇳',
      urls: [
        'https://www.xiachufang.com/recipe/100000/',
        'https://www.meishij.net/zuofa/mapoduofu.html'
      ]
    },
    {
      language: 'Japanese',
      flag: '🇯🇵',
      urls: [
        'https://cookpad.com/recipe/1234567',
        'https://www.kyounoryouri.jp/recipe/1234'
      ]
    },
    {
      language: 'Korean',
      flag: '🇰🇷',
      urls: [
        'https://www.10000recipe.com/recipe/1234567',
        'https://wtable.co.kr/recipes/1234'
      ]
    },
    {
      language: 'Thai',
      flag: '🇹🇭',
      urls: [
        'https://www.sanook.com/food/recipe/1234567'
      ]
    }
  ];

  const getLanguageName = (langCode: string): string => {
    const languages: { [key: string]: string } = {
      'en': 'Tiếng Anh',
      'zh': 'Tiếng Trung',
      'ja': 'Tiếng Nhật',
      'ko': 'Tiếng Hàn',
      'th': 'Tiếng Thái',
      'fr': 'Tiếng Pháp',
      'de': 'Tiếng Đức',
      'es': 'Tiếng Tây Ban Nha',
      'it': 'Tiếng Ý',
      'vi': 'Tiếng Việt',
      'unknown': 'Không xác định'
    };
    return languages[langCode] || langCode.toUpperCase();
  };

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
          description: `Đã trích xuất và dịch từ ${getLanguageName(result.data.detectedLanguage || 'unknown')}`,
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Demo Import Đa Ngôn Ngữ
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test chức năng import và dịch tự động từ các trang web nấu ăn bằng nhiều ngôn ngữ khác nhau
          </p>
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
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Trích xuất & Dịch
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>URL mẫu theo ngôn ngữ:</Label>
            {sampleUrls.map((langGroup, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{langGroup.flag}</span>
                  <span className="font-medium">{langGroup.language}</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {langGroup.urls.map((sampleUrl, urlIndex) => (
                    <Button
                      key={urlIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => setUrl(sampleUrl)}
                      className="text-xs"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Mẫu {urlIndex + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {extractedData && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Kết quả trích xuất:</h3>
                <div className="flex items-center gap-2">
                  {extractedData.detectedLanguage && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {getLanguageName(extractedData.detectedLanguage)}
                    </Badge>
                  )}
                  {extractedData.originalLanguage && extractedData.originalLanguage !== 'vi' && (
                    <Badge className="bg-green-100 text-green-800">
                      ✅ Đã dịch sang tiếng Việt
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nguyên liệu (đã dịch)</Label>
                  <Textarea 
                    value={extractedData.ingredients || 'Không trích xuất được nguyên liệu'} 
                    readOnly 
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hướng dẫn (đã dịch)</Label>
                  <Textarea 
                    value={extractedData.instructions || 'Không trích xuất được hướng dẫn'} 
                    readOnly 
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {extractedData.image && (
                <div className="space-y-2">
                  <Label>Hình ảnh</Label>
                  <img 
                    src={extractedData.image} 
                    alt="Recipe" 
                    className="w-48 h-48 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiLanguageImportDemo;
