import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wifi, Database, Server, Globe } from 'lucide-react';
import { useConnectionStatus, useIsConnected, useConnectionError } from '@/hooks/useConnectionStatus';
import ConnectionWrapper from '@/components/ConnectionWrapper';
import ConnectionError from '@/components/ConnectionError';

const ConnectionTestPage = () => {
  const { status, isChecking, checkConnection, retryConnection } = useConnectionStatus();
  const isConnected = useIsConnected();
  const connectionError = useConnectionError();
  const [testMode, setTestMode] = useState<'normal' | 'offline' | 'error'>('normal');

  const TestComponent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Test Component</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Đây là component test được bảo vệ bởi ConnectionWrapper.</p>
        <p>Nó chỉ hiển thị khi có kết nối tốt.</p>
      </CardContent>
    </Card>
  );

  const renderTestMode = () => {
    switch (testMode) {
      case 'offline':
        return (
          <ConnectionError
            error="Mô phỏng lỗi mất kết nối internet"
            onRetry={() => setTestMode('normal')}
          />
        );
      
      case 'error':
        return (
          <ConnectionError
            error="Mô phỏng lỗi kết nối database"
            onRetry={() => setTestMode('normal')}
          />
        );
      
      default:
        return (
          <ConnectionWrapper requireDatabase={true}>
            <TestComponent />
          </ConnectionWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Test Kết Nối</h1>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Trang test các tính năng kiểm tra và xử lý lỗi kết nối
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái kết nối hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Internet:</span>
                  <Badge variant={status.isOnline ? "default" : "destructive"}>
                    {status.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span className="text-sm">Supabase:</span>
                  <Badge variant={status.isSupabaseConnected ? "default" : "destructive"}>
                    {status.isSupabaseConnected ? "Kết nối" : "Lỗi"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">Database:</span>
                  <Badge variant={status.isDatabaseReady ? "default" : "destructive"}>
                    {status.isDatabaseReady ? "Sẵn sàng" : "Chưa sẵn sàng"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">API:</span>
                  <Badge variant={status.isApiWorking ? "default" : "destructive"}>
                    {status.isApiWorking ? "Hoạt động" : "Lỗi"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Tổng thể: <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "Kết nối tốt" : "Có vấn đề"}
                    </Badge>
                  </p>
                  {connectionError && (
                    <p className="text-sm text-red-600 mt-1">Lỗi: {connectionError}</p>
                  )}
                  {status.lastChecked && (
                    <p className="text-xs text-gray-500 mt-1">
                      Kiểm tra lần cuối: {status.lastChecked.toLocaleTimeString('vi-VN')}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={checkConnection}
                    disabled={isChecking}
                  >
                    {isChecking ? "Đang kiểm tra..." : "Kiểm tra lại"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={retryConnection}
                    disabled={isChecking}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Điều khiển test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={testMode === 'normal' ? 'default' : 'outline'}
                  onClick={() => setTestMode('normal')}
                  size="sm"
                >
                  Bình thường
                </Button>
                <Button
                  variant={testMode === 'offline' ? 'default' : 'outline'}
                  onClick={() => setTestMode('offline')}
                  size="sm"
                >
                  Mô phỏng Offline
                </Button>
                <Button
                  variant={testMode === 'error' ? 'default' : 'outline'}
                  onClick={() => setTestMode('error')}
                  size="sm"
                >
                  Mô phỏng Lỗi DB
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Chọn chế độ test để xem cách ứng dụng xử lý các tình huống lỗi khác nhau
              </p>
            </CardContent>
          </Card>

          {/* Test Area */}
          <div>
            <h3 className="text-lg font-medium mb-4">Khu vực test</h3>
            {renderTestMode()}
          </div>

          {/* Hook Results */}
          <Card>
            <CardHeader>
              <CardTitle>Kết quả từ hooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>useIsConnected():</strong> {isConnected ? "true" : "false"}</p>
                <p><strong>useConnectionError():</strong> {connectionError || "null"}</p>
                <p><strong>isChecking:</strong> {isChecking ? "true" : "false"}</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default ConnectionTestPage;
