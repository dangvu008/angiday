import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ImportService } from '@/services/ImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bug, AlertTriangle } from 'lucide-react';
import ErrorDisplay from './ErrorDisplay';

const ErrorHandlingDemo = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // Test cases for different error scenarios
  const errorTestCases = [
    {
      category: '🌐 Network Errors',
      description: 'Test các lỗi kết nối mạng',
      urls: [
        { url: 'https://nonexistent-domain-12345.com/recipe', name: 'Domain không tồn tại' },
        { url: 'https://httpstat.us/500', name: 'Server Error (500)' },
        { url: 'https://httpstat.us/404', name: 'Page Not Found (404)' },
        { url: 'https://httpstat.us/403', name: 'Access Forbidden (403)' },
        { url: 'https://httpstat.us/429', name: 'Rate Limited (429)' }
      ]
    },
    {
      category: '🔒 CORS & Security',
      description: 'Test các lỗi bảo mật và CORS',
      urls: [
        { url: 'https://www.google.com', name: 'Google (CORS blocked)' },
        { url: 'https://www.facebook.com', name: 'Facebook (Security)' },
        { url: 'https://www.amazon.com', name: 'Amazon (Anti-bot)' }
      ]
    },
    {
      category: '📄 Content Issues',
      description: 'Test các vấn đề về nội dung',
      urls: [
        { url: 'https://example.com', name: 'Không có recipe data' },
        { url: 'https://httpbin.org/html', name: 'HTML không có cấu trúc' },
        { url: 'https://httpbin.org/json', name: 'JSON thay vì HTML' }
      ]
    },
    {
      category: '⏱️ Timeout & Performance',
      description: 'Test timeout và performance issues',
      urls: [
        { url: 'https://httpbin.org/delay/15', name: 'Slow response (15s)' },
        { url: 'https://httpbin.org/delay/30', name: 'Very slow (30s)' }
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

    try {
      const startTime = Date.now();
      const importResult = await ImportService.extractFromUrl(url, 'recipe');
      const endTime = Date.now();

      setResult({
        ...importResult,
        testTime: endTime - startTime
      });

      if (importResult.success) {
        toast({
          title: "Test thành công",
          description: "Không có lỗi xảy ra",
        });
      } else {
        toast({
          title: "Test lỗi thành công",
          description: `Đã bắt được lỗi: ${importResult.errorCode}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'UNEXPECTED_ERROR',
        testTime: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleTest();
  };

  const handleReportBug = () => {
    const bugReport = {
      url,
      result,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    console.log('🐛 Bug Report:', bugReport);
    
    toast({
      title: "Bug Report",
      description: "Thông tin lỗi đã được ghi vào console",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Demo Error Handling System
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test hệ thống xử lý lỗi chi tiết với các trường hợp lỗi khác nhau
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL để test lỗi</Label>
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
                    Testing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Test Error
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Test Cases */}
          <div className="space-y-4">
            <Label>Test cases theo loại lỗi:</Label>
            {errorTestCases.map((testCase, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{testCase.category}</h4>
                  <span className="text-xs text-gray-500">- {testCase.description}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                  {testCase.urls.map((testUrl, urlIndex) => (
                    <Button
                      key={urlIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => setUrl(testUrl.url)}
                      className="text-xs justify-start"
                    >
                      {testUrl.name}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Kết quả</span>
                  </div>
                  <div className={`text-lg font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Thành công' : 'Có lỗi'}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Error Code</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {result.errorCode || 'N/A'}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Thời gian</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {result.testTime}ms
                  </div>
                </Card>
              </div>

              {/* Error Display */}
              {!result.success && (
                <ErrorDisplay
                  error={result.error}
                  errorCode={result.errorCode}
                  errorDetails={result.errorDetails}
                  debugInfo={result.debugInfo}
                  onRetry={handleRetry}
                  onReportBug={handleReportBug}
                />
              )}

              {/* Success Info */}
              {result.success && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-800 mb-2">✅ Test thành công!</h4>
                    <p className="text-green-700 text-sm">
                      URL này không gây ra lỗi. Dữ liệu đã được trích xuất thành công.
                    </p>
                    {result.data && (
                      <div className="mt-3 text-sm text-green-600">
                        <p>Tên món: {result.data.title || 'N/A'}</p>
                        <p>Extraction method: {result.data.extractionMethod || 'N/A'}</p>
                        <p>Data quality: {result.data.dataQuality?.overallConfidence || 'N/A'}%</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tips để test:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Mở DevTools (F12) để xem console logs chi tiết</li>
                <li>• Test với các URL khác nhau để thấy error messages khác nhau</li>
                <li>• Chú ý đến error codes và suggestions</li>
                <li>• Thử retry để test fallback mechanisms</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorHandlingDemo;
