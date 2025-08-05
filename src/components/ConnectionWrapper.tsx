import React from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import ConnectionError from './ConnectionError';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionWrapperProps {
  children: React.ReactNode;
  showOfflineAlert?: boolean;
  fallbackComponent?: React.ReactNode;
  requireDatabase?: boolean;
}

const ConnectionWrapper: React.FC<ConnectionWrapperProps> = ({
  children,
  showOfflineAlert = true,
  fallbackComponent,
  requireDatabase = true
}) => {
  const { status, isChecking, retryConnection } = useConnectionStatus();

  // Nếu đang kiểm tra lần đầu, hiển thị loading
  if (isChecking && !status.lastChecked) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra kết nối...</p>
        </div>
      </div>
    );
  }

  // Nếu không có internet
  if (!status.isOnline) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <ConnectionError
        error="Không có kết nối internet. Vui lòng kiểm tra kết nối mạng của bạn."
        onRetry={retryConnection}
      />
    );
  }

  // Nếu yêu cầu database nhưng không kết nối được
  if (requireDatabase && (!status.isSupabaseConnected || !status.isDatabaseReady)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    const errorMessage = !status.isSupabaseConnected 
      ? "Không thể kết nối đến Supabase. Vui lòng kiểm tra cấu hình."
      : "Database chưa sẵn sàng. Vui lòng thiết lập schema.";

    return (
      <ConnectionError
        error={errorMessage}
        onRetry={retryConnection}
      />
    );
  }

  // Hiển thị cảnh báo offline nếu cần
  const shouldShowAlert = showOfflineAlert && (
    !status.isOnline || 
    !status.isSupabaseConnected || 
    (requireDatabase && !status.isDatabaseReady) ||
    !status.isApiWorking
  );

  return (
    <>
      {shouldShowAlert && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {!status.isOnline && "Không có kết nối internet"}
            {status.isOnline && !status.isSupabaseConnected && "Lỗi kết nối Supabase"}
            {status.isOnline && status.isSupabaseConnected && !status.isDatabaseReady && "Database chưa sẵn sàng"}
            {status.isOnline && status.isSupabaseConnected && status.isDatabaseReady && !status.isApiWorking && "API không hoạt động"}
            {status.error && ` - ${status.error}`}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default ConnectionWrapper;
