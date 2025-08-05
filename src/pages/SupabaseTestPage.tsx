import React from 'react';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';
import { DataCleanupService } from '@/utils/cleanupOldData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw } from 'lucide-react';

const SupabaseTestPage: React.FC = () => {
  const handleCleanup = async () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu cũ? Hành động này không thể hoàn tác.')) {
      await DataCleanupService.fullReset();
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm('Bạn có chắc muốn xóa localStorage? Bạn sẽ cần đăng nhập lại.')) {
      DataCleanupService.clearLocalStorage();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Connection Test
          </h1>
          <p className="text-gray-600">
            Test kết nối và chức năng Supabase với UUID mới
          </p>
        </div>

        {/* Cleanup Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Data Cleanup Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleClearLocalStorage}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear LocalStorage
              </Button>
              <Button 
                onClick={handleCleanup}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Full Reset (LocalStorage + Supabase)
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Sử dụng các công cụ này để xóa dữ liệu cũ với UUID không hợp lệ
            </p>
          </CardContent>
        </Card>

        {/* Connection Test */}
        <SupabaseConnectionTest />

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Database Adapter:</strong> {import.meta.env.VITE_DATABASE_ADAPTER || 'localStorage'}
              </div>
              <div>
                <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
              </div>
              <div>
                <strong>Environment:</strong> {import.meta.env.VITE_APP_ENV || 'development'}
              </div>
              <div>
                <strong>Dev Mode:</strong> {import.meta.env.VITE_DEV_MODE || 'false'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseTestPage;
