import { useState, useEffect, useCallback } from 'react';
import { supabaseHelpers } from '@/config/supabase';
import { kitchenService } from '@/services/kitchenService';

interface ConnectionStatus {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  isDatabaseReady: boolean;
  isApiWorking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

interface UseConnectionStatusReturn {
  status: ConnectionStatus;
  isChecking: boolean;
  checkConnection: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

export const useConnectionStatus = (autoCheck: boolean = true): UseConnectionStatusReturn => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isSupabaseConnected: false,
    isDatabaseReady: false,
    isApiWorking: false,
    lastChecked: null,
    error: null
  });
  
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setStatus(prev => ({ ...prev, error: null }));

    try {
      // 1. Kiểm tra online status
      const isOnline = navigator.onLine;
      
      // 2. Kiểm tra Supabase connection
      let isSupabaseConnected = false;
      let isDatabaseReady = false;
      
      try {
        const supabaseResult = await supabaseHelpers.testConnection();
        isSupabaseConnected = supabaseResult.success;
        isDatabaseReady = supabaseResult.details.tablesExist && supabaseResult.details.canQuery;
      } catch (error) {
        console.error('Supabase connection check failed:', error);
      }

      // 3. Kiểm tra API working
      let isApiWorking = false;
      try {
        await kitchenService.getRecipes();
        isApiWorking = true;
      } catch (error) {
        console.error('API check failed:', error);
      }

      setStatus({
        isOnline,
        isSupabaseConnected,
        isDatabaseReady,
        isApiWorking,
        lastChecked: new Date(),
        error: null
      });

    } catch (error) {
      console.error('Connection check error:', error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown connection error',
        lastChecked: new Date()
      }));
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  const retryConnection = useCallback(async () => {
    // Reset Supabase client trước khi retry
    try {
      supabaseHelpers.reset();
    } catch (error) {
      console.error('Error resetting Supabase client:', error);
    }
    
    await checkConnection();
  }, [checkConnection]);

  // Auto check on mount và khi online status thay đổi
  useEffect(() => {
    if (autoCheck) {
      checkConnection();
    }

    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      if (autoCheck) {
        checkConnection();
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        isOnline: false,
        error: 'Mất kết nối internet'
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoCheck, checkConnection]);

  // Periodic check (mỗi 30 giây)
  useEffect(() => {
    if (!autoCheck) return;

    const interval = setInterval(() => {
      if (!isChecking && navigator.onLine) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoCheck, isChecking, checkConnection]);

  return {
    status,
    isChecking,
    checkConnection,
    retryConnection
  };
};

// Helper function để kiểm tra xem có kết nối tốt không
export const useIsConnected = (): boolean => {
  const { status } = useConnectionStatus();
  return status.isOnline && status.isSupabaseConnected && status.isDatabaseReady && status.isApiWorking;
};

// Helper function để lấy thông báo lỗi
export const useConnectionError = (): string | null => {
  const { status } = useConnectionStatus();
  
  if (!status.isOnline) {
    return 'Không có kết nối internet';
  }
  
  if (!status.isSupabaseConnected) {
    return 'Không thể kết nối đến Supabase';
  }
  
  if (!status.isDatabaseReady) {
    return 'Database chưa sẵn sàng';
  }
  
  if (!status.isApiWorking) {
    return 'API không hoạt động';
  }
  
  return status.error;
};
