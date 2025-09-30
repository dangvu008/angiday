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
import { 
  Loader2, 
  Shield, 
  Globe, 
  Zap, 
  Archive,
  Search,
  Bot,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

const AntiBlockDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  interface ResultType {
    success: boolean;
    data?: unknown;
    error?: string;
    method?: string;
  }

  const [result, setResult] = useState<ResultType | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentMethod, setCurrentMethod] = useState('');
  const { toast } = useToast();

  // Test cases for blocked websites
  const blockedSites = [
    {
      category: '🛡️ Anti-Bot Protection',
      description: 'Trang web có Cloudflare, reCAPTCHA',
      sites: [
        { url: 'https://www.foodnetwork.com/recipes/alton-brown/baked-macaroni-and-cheese-recipe-1939524', name: 'Food Network (Cloudflare)' },
        { url: 'https://cooking.nytimes.com/recipes/1017089-chocolate-chip-cookies', name: 'NY Times Cooking (Paywall)' },
        { url: 'https://www.bonappetit.com/recipe/bas-best-chocolate-chip-cookies', name: 'Bon Appétit (Anti-bot)' }
      ]
    },
    {
      category: '🔒 CORS Blocked',
      description: 'Trang web chặn cross-origin requests',
      sites: [
        { url: 'https://www.seriouseats.com/recipes/2013/12/the-food-lab-best-chocolate-chip-cookie-recipe.html', name: 'Serious Eats' },
        { url: 'https://www.epicurious.com/recipes/food/views/perfect-chocolate-chip-cookies', name: 'Epicurious' },
        { url: 'https://www.tasteofhome.com/recipes/chocolate-chip-cookies/', name: 'Taste of Home' }
      ]
    },
    {
      category: '🏢 Corporate Security',
      description: 'Trang web có bảo mật cao',
      sites: [
        { url: 'https://www.williams-sonoma.com/recipes/', name: 'Williams Sonoma' },
        { url: 'https://www.foodandwine.com/recipes/', name: 'Food & Wine' },
        { url: 'https://www.marthastewart.com/recipes/', name: 'Martha Stewart' }
      ]
    },
    {
      category: '🌐 Geographic Restrictions',
      description: 'Trang web chặn theo vùng địa lý',
      sites: [
        { url: 'https://www.bbc.co.uk/food/recipes/', name: 'BBC Food (UK only)' },
        { url: 'https://www.channel4.com/programmes/come-dine-with-me/recipes', name: 'Channel 4 (UK)' },
        { url: 'https://www.rte.ie/lifestyle/food/', name: 'RTE Food (Ireland)' }
      ]
    }
  ];

  const handleTest = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL để test",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setProgress(0);
    setCurrentMethod('');

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const startTime = Date.now();
      
      // Mock method tracking
      const methods = ['AllOrigins', 'CORS Anywhere', 'Puppeteer Proxy', 'ScrapingBee', 'ProxyMesh', 'Archive.org', 'Google Cache'];
      let methodIndex = 0;
      
      const methodInterval = setInterval(() => {
        if (methodIndex < methods.length) {
          setCurrentMethod(`Đang thử: ${methods[methodIndex]}`);
          methodIndex++;
        }
      }, 2000);

      const importResult = await ImportService.extractFromUrl(url, 'recipe');
      const endTime = Date.now();

      clearInterval(methodInterval);
      setCurrentMethod('Hoàn thành');
      setProgress(100);

      setResult({
        ...importResult,
        testTime: endTime - startTime,
        methodsAttempted: methodIndex
      });

      if (importResult.success) {
        toast({
          title: "Bypass thành công! 🎉",
          description: `Đã vượt qua được bảo mật của trang web`,
        });
      } else {
        toast({
          title: "Không thể bypass",
          description: `Tất cả phương pháp đều thất bại: ${importResult.errorCode}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Anti-block test error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'ANTI_BLOCK_FAILED'
      });
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(100);
    }
  };

  const getMethodIcon = (method: string) => {
    if (method.includes('Puppeteer')) return <Bot className="h-4 w-4" />;
    if (method.includes('Archive')) return <Archive className="h-4 w-4" />;
    if (method.includes('Cache')) return <Search className="h-4 w-4" />;
    if (method.includes('Proxy')) return <Globe className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const getSecurityLevel = (url: string) => {
    if (url.includes('nytimes') || url.includes('bonappetit')) return { level: 'Cao', color: 'text-red-600', icon: <Lock className="h-4 w-4" /> };
    if (url.includes('foodnetwork') || url.includes('seriouseats')) return { level: 'Trung bình', color: 'text-yellow-600', icon: <Shield className="h-4 w-4" /> };
    return { level: 'Thấp', color: 'text-green-600', icon: <Unlock className="h-4 w-4" /> };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Demo Anti-Block Technology
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test khả năng vượt qua các hệ thống bảo mật và chặn truy cập của website
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL trang web bị chặn</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://blocked-website.com/recipe"
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
                    Bypassing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Bypass Block
                  </>
                )}
              </Button>
            </div>
            
            {url && (
              <div className="flex items-center gap-2 text-sm">
                <span>Mức độ bảo mật:</span>
                <div className="flex items-center gap-1">
                  {getSecurityLevel(url).icon}
                  <span className={getSecurityLevel(url).color}>
                    {getSecurityLevel(url).level}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentMethod || 'Đang khởi tạo...'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Blocked Sites Test Cases */}
          <div className="space-y-4">
            <Label>Trang web bị chặn để test:</Label>
            {blockedSites.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{category.category}</h4>
                  <span className="text-xs text-gray-500">- {category.description}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                  {category.sites.map((site, siteIndex) => (
                    <Button
                      key={siteIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => setUrl(site.url)}
                      className="text-xs justify-start flex items-center gap-2"
                    >
                      {getSecurityLevel(site.url).icon}
                      {site.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          {result && (
            <div className="border-t pt-6 space-y-4">
              {/* Test Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Kết quả</span>
                  </div>
                  <div className={`text-lg font-bold flex items-center gap-2 ${
                    result.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.success ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {result.success ? 'Bypassed' : 'Blocked'}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Thời gian</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {result.testTime}ms
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Methods</span>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {result.methodsAttempted || result.debugInfo?.attemptedMethods?.length || 0}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {result.success ? '100%' : '0%'}
                  </div>
                </Card>
              </div>

              {/* Methods Attempted */}
              {result.debugInfo?.attemptedMethods && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phương pháp đã thử</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.debugInfo.attemptedMethods.map((method: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="flex items-center gap-1"
                        >
                          {getMethodIcon(method)}
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success Details */}
              {result.success && result.data && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Unlock className="h-5 w-5" />
                      Bypass thành công!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Extraction Method:</span>
                        <p className="text-green-700">{result.data.extractionMethod}</p>
                      </div>
                      <div>
                        <span className="font-medium">Data Quality:</span>
                        <p className="text-green-700">{result.data.dataQuality?.overallConfidence}%</p>
                      </div>
                      <div>
                        <span className="font-medium">Tên món:</span>
                        <p className="text-green-700">{result.data.title || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Ngôn ngữ:</span>
                        <p className="text-green-700">{result.data.detectedLanguage || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Failure Details */}
              {!result.success && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Không thể bypass
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 mb-3">{result.error}</p>
                    <div className="text-sm text-red-600">
                      <p><strong>Error Code:</strong> {result.errorCode}</p>
                      {result.errorDetails?.suggestion && (
                        <p><strong>Gợi ý:</strong> {result.errorDetails.suggestion}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Anti-Block Methods Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">🛡️ Phương pháp Anti-Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-medium mb-2">Browser Automation:</h4>
                  <ul className="space-y-1">
                    <li>• Puppeteer Proxy (JavaScript rendering)</li>
                    <li>• ScrapingBee (Premium proxies)</li>
                    <li>• ProxyMesh (Rotating IPs)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Alternative Sources:</h4>
                  <ul className="space-y-1">
                    <li>• Archive.org (Wayback Machine)</li>
                    <li>• Google Cache (Cached versions)</li>
                    <li>• Multiple proxy chains</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AntiBlockDemo;
