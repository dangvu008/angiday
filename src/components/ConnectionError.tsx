import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  WifiOff, 
  RefreshCw, 
  Settings, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface ConnectionErrorProps {
  error?: string;
  onRetry?: () => void;
  onOpenDiagnostic?: () => void;
}

const ConnectionError: React.FC<ConnectionErrorProps> = ({
  error = "Không thể kết nối đến server",
  onRetry,
  onOpenDiagnostic
}) => {
  const handleOpenDiagnostic = () => {
    if (onOpenDiagnostic) {
      onOpenDiagnostic();
    } else {
      window.open('/connection-diagnostic', '_blank');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <WifiOff className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Lỗi kết nối</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Các bước khắc phục:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Kiểm tra kết nối internet</li>
              <li>• Đảm bảo server đang chạy</li>
              <li>• Xác minh cấu hình database</li>
              <li>• Thử tải lại trang</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleOpenDiagnostic}
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Kiểm tra chi tiết
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="w-full text-sm"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Mở Supabase Dashboard
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ kỹ thuật
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionError;
