import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  X,
  Settings
} from 'lucide-react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

interface ConnectionStatusIndicatorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showDetails?: boolean;
  autoHide?: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  position = 'top-right',
  showDetails = false,
  autoHide = true
}) => {
  const { status, isChecking, checkConnection, retryConnection } = useConnectionStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Tự động ẩn khi kết nối tốt
  const shouldShow = !autoHide || !status.isOnline || !status.isSupabaseConnected || !status.isDatabaseReady || !status.isApiWorking;

  if (!isVisible || !shouldShow) {
    return null;
  }

  const getStatusColor = () => {
    if (!status.isOnline) return 'bg-red-500';
    if (!status.isSupabaseConnected || !status.isDatabaseReady) return 'bg-yellow-500';
    if (!status.isApiWorking) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-3 w-3 animate-spin text-white" />;
    if (!status.isOnline) return <WifiOff className="h-3 w-3 text-white" />;
    if (!status.isSupabaseConnected || !status.isDatabaseReady || !status.isApiWorking) {
      return <AlertTriangle className="h-3 w-3 text-white" />;
    }
    return <CheckCircle className="h-3 w-3 text-white" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Đang kiểm tra...';
    if (!status.isOnline) return 'Offline';
    if (!status.isSupabaseConnected) return 'Lỗi Supabase';
    if (!status.isDatabaseReady) return 'DB chưa sẵn sàng';
    if (!status.isApiWorking) return 'Lỗi API';
    return 'Kết nối tốt';
  };

  const getPositionClasses = () => {
    const base = 'fixed z-50';
    switch (position) {
      case 'top-left': return `${base} top-4 left-4`;
      case 'bottom-left': return `${base} bottom-4 left-4`;
      case 'bottom-right': return `${base} bottom-4 right-4`;
      default: return `${base} top-4 right-4`;
    }
  };

  const handleOpenDiagnostic = () => {
    window.open('/connection-diagnostic', '_blank');
  };

  return (
    <div className={getPositionClasses()}>
      {/* Compact indicator */}
      {!isExpanded && (
        <div 
          className={`${getStatusColor()} rounded-full p-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200`}
          onClick={() => setIsExpanded(true)}
          title={getStatusText()}
        >
          {getStatusIcon()}
        </div>
      )}

      {/* Expanded card */}
      {isExpanded && (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`${getStatusColor()} rounded-full p-1`}>
                  {getStatusIcon()}
                </div>
                <span className="font-medium text-sm">Trạng thái kết nối</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Status details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span>Internet:</span>
                <Badge variant={status.isOnline ? "default" : "destructive"} className="text-xs">
                  {status.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Supabase:</span>
                <Badge variant={status.isSupabaseConnected ? "default" : "destructive"} className="text-xs">
                  {status.isSupabaseConnected ? "OK" : "Lỗi"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Database:</span>
                <Badge variant={status.isDatabaseReady ? "default" : "destructive"} className="text-xs">
                  {status.isDatabaseReady ? "Sẵn sàng" : "Chưa sẵn sàng"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>API:</span>
                <Badge variant={status.isApiWorking ? "default" : "destructive"} className="text-xs">
                  {status.isApiWorking ? "OK" : "Lỗi"}
                </Badge>
              </div>
            </div>

            {/* Error message */}
            {status.error && (
              <div className="text-xs text-red-600 mb-3 p-2 bg-red-50 rounded">
                {status.error}
              </div>
            )}

            {/* Last checked */}
            {status.lastChecked && (
              <div className="text-xs text-gray-500 mb-3">
                Kiểm tra lần cuối: {status.lastChecked.toLocaleTimeString('vi-VN')}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={checkConnection}
                disabled={isChecking}
                className="flex-1 text-xs"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Kiểm tra...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Kiểm tra
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={retryConnection}
                disabled={isChecking}
                className="flex-1 text-xs"
              >
                Retry
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenDiagnostic}
                className="text-xs"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>

            {/* Hide option */}
            <div className="mt-3 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="w-full text-xs text-gray-500"
              >
                Ẩn thông báo này
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
