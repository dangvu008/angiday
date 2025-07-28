import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  Globe, 
  RefreshCw, 
  ExternalLink,
  Bug,
  Lightbulb,
  Activity
} from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  errorCode?: string;
  errorDetails?: {
    step: string;
    method: string;
    statusCode?: number;
    originalError?: string;
    suggestion?: string;
  };
  debugInfo?: {
    attemptedMethods: string[];
    timeElapsed: number;
    lastSuccessfulStep: string;
  };
  onRetry?: () => void;
  onReportBug?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorCode,
  errorDetails,
  debugInfo,
  onRetry,
  onReportBug
}) => {
  const getErrorIcon = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT_ERROR':
        return <Globe className="h-5 w-5 text-red-500" />;
      case 'CORS_BLOCKED':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'PAGE_NOT_FOUND':
      case 'ACCESS_FORBIDDEN':
        return <ExternalLink className="h-5 w-5 text-red-500" />;
      default:
        return <Bug className="h-5 w-5 text-red-500" />;
    }
  };

  const getErrorColor = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
      case 'PAGE_NOT_FOUND':
        return 'border-red-200 bg-red-50';
      case 'CORS_BLOCKED':
      case 'ACCESS_FORBIDDEN':
        return 'border-orange-200 bg-orange-50';
      case 'TIMEOUT_ERROR':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'AllOrigins':
        return 'bg-blue-100 text-blue-800';
      case 'CORS Anywhere':
        return 'bg-green-100 text-green-800';
      case 'Direct Fetch':
        return 'bg-purple-100 text-purple-800';
      case 'ThingProxy':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`border-2 ${getErrorColor(errorCode)}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          {getErrorIcon(errorCode)}
          Lỗi Import: {errorCode || 'UNKNOWN_ERROR'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Error Message */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Thông báo lỗi:</h4>
          <p className="text-gray-700">{error}</p>
        </div>

        {/* Error Details */}
        {errorDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Chi tiết lỗi
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bước lỗi:</span>
                  <Badge variant="outline">{errorDetails.step}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <Badge variant="outline">{errorDetails.method}</Badge>
                </div>
                {errorDetails.statusCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã lỗi HTTP:</span>
                    <Badge variant="destructive">{errorDetails.statusCode}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Debug Info */}
            {debugInfo && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Thông tin debug
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {debugInfo.timeElapsed}ms
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bước cuối:</span>
                    <Badge variant="outline">{debugInfo.lastSuccessfulStep}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attempted Methods */}
        {debugInfo?.attemptedMethods && debugInfo.attemptedMethods.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Phương thức đã thử:</h4>
            <div className="flex flex-wrap gap-2">
              {debugInfo.attemptedMethods.map((method, index) => (
                <Badge 
                  key={index} 
                  className={getMethodBadgeColor(method)}
                  variant="outline"
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Original Error */}
        {errorDetails?.originalError && (
          <details className="bg-gray-100 rounded-lg p-3">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Lỗi gốc (cho developer)
            </summary>
            <code className="text-xs text-gray-600 break-all">
              {errorDetails.originalError}
            </code>
          </details>
        )}

        {/* Suggestion */}
        {errorDetails?.suggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Gợi ý khắc phục
            </h4>
            <p className="text-blue-700 text-sm">{errorDetails.suggestion}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          )}
          
          {onReportBug && (
            <Button 
              onClick={onReportBug} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Báo lỗi
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://github.com/your-repo/issues', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Hỗ trợ
          </Button>
        </div>

        {/* Quick Fixes */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">💡 Thử ngay:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Kiểm tra URL có chính xác không</li>
            <li>• Thử với trang web khác (AllRecipes, Food.com)</li>
            <li>• Đợi 1-2 phút rồi thử lại</li>
            <li>• Kiểm tra kết nối internet</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
