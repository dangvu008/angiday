import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Server,
  Globe,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';
import { supabaseHelpers } from '@/config/supabase';
import { useToast } from '@/hooks/use-toast';

interface FixAction {
  id: string;
  title: string;
  description: string;
  category: 'database' | 'network' | 'config' | 'cache';
  severity: 'low' | 'medium' | 'high';
  autoFix: boolean;
  action: () => Promise<boolean>;
}

const ConnectionFixer: React.FC = () => {
  const [isFixing, setIsFixing] = useState<string | null>(null);
  const [fixResults, setFixResults] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Các hành động khắc phục
  const fixActions: FixAction[] = [
    {
      id: 'clear-cache',
      title: 'Xóa cache trình duyệt',
      description: 'Xóa cache và localStorage để làm mới kết nối',
      category: 'cache',
      severity: 'low',
      autoFix: true,
      action: async () => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }
          return true;
        } catch (error) {
          console.error('Clear cache error:', error);
          return false;
        }
      }
    },
    {
      id: 'reset-supabase',
      title: 'Reset kết nối Supabase',
      description: 'Khởi tạo lại client Supabase và test kết nối',
      category: 'database',
      severity: 'medium',
      autoFix: true,
      action: async () => {
        try {
          supabaseHelpers.reset();
          const result = await supabaseHelpers.testConnection();
          return result.success;
        } catch (error) {
          console.error('Reset Supabase error:', error);
          return false;
        }
      }
    },
    {
      id: 'setup-database',
      title: 'Thiết lập database schema',
      description: 'Tạo các bảng cần thiết trong Supabase',
      category: 'database',
      severity: 'high',
      autoFix: true,
      action: async () => {
        try {
          const result = await supabaseHelpers.setupDatabase();
          return result.success;
        } catch (error) {
          console.error('Setup database error:', error);
          return false;
        }
      }
    },
    {
      id: 'check-env',
      title: 'Kiểm tra biến môi trường',
      description: 'Xác minh VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY',
      category: 'config',
      severity: 'high',
      autoFix: false,
      action: async () => {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        return !!(url && key && url.includes('supabase.co') && key.length > 100);
      }
    },
    {
      id: 'reload-page',
      title: 'Tải lại trang',
      description: 'Làm mới toàn bộ ứng dụng',
      category: 'cache',
      severity: 'low',
      autoFix: true,
      action: async () => {
        window.location.reload();
        return true;
      }
    }
  ];

  const handleFix = async (action: FixAction) => {
    setIsFixing(action.id);
    
    try {
      const success = await action.action();
      setFixResults(prev => ({ ...prev, [action.id]: success }));
      
      toast({
        title: success ? "Khắc phục thành công" : "Khắc phục thất bại",
        description: `${action.title}: ${success ? "Hoàn thành" : "Có lỗi xảy ra"}`,
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      console.error(`Fix action ${action.id} error:`, error);
      setFixResults(prev => ({ ...prev, [action.id]: false }));
      
      toast({
        title: "Lỗi khắc phục",
        description: `Không thể thực hiện: ${action.title}`,
        variant: "destructive"
      });
    } finally {
      setIsFixing(null);
    }
  };

  const handleFixAll = async () => {
    const autoFixActions = fixActions.filter(action => action.autoFix);
    
    for (const action of autoFixActions) {
      await handleFix(action);
      // Delay between fixes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'network': return <Globe className="h-4 w-4" />;
      case 'config': return <Settings className="h-4 w-4" />;
      case 'cache': return <RefreshCw className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity === 'low' ? 'Thấp' : severity === 'medium' ? 'Trung bình' : 'Cao'}
      </Badge>
    );
  };

  const getResultIcon = (actionId: string) => {
    const result = fixResults[actionId];
    if (result === undefined) return null;
    
    return result ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const copyEnvTemplate = () => {
    const template = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Database Adapter Selection
VITE_DATABASE_ADAPTER=supabase

# Security Configuration
VITE_ENCRYPTION_KEY=kitchen-command-center-2025
VITE_APP_ENV=development

# Development
VITE_DEV_MODE=true`;

    navigator.clipboard.writeText(template);
    toast({
      title: "Đã copy",
      description: "Template .env đã được copy vào clipboard"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Công cụ khắc phục lỗi kết nối
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFixAll} disabled={!!isFixing}>
              {isFixing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang khắc phục...
                </>
              ) : (
                <>
                  <Wrench className="mr-2 h-4 w-4" />
                  Tự động khắc phục
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={copyEnvTemplate}>
              <Copy className="mr-2 h-4 w-4" />
              Copy template .env
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Mở Supabase Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fix Actions */}
      <div className="grid gap-4">
        {fixActions.map((action) => (
          <Card key={action.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getCategoryIcon(action.category)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{action.title}</h3>
                      {getSeverityBadge(action.severity)}
                      {!action.autoFix && (
                        <Badge variant="outline" className="text-xs">
                          Thủ công
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getResultIcon(action.id)}
                  <Button
                    size="sm"
                    onClick={() => handleFix(action)}
                    disabled={isFixing === action.id}
                  >
                    {isFixing === action.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      'Khắc phục'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manual Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn khắc phục thủ công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">1. Kiểm tra file .env</h4>
              <p className="text-sm text-blue-800 mb-2">
                Đảm bảo file .env có các biến sau:
              </p>
              <code className="text-xs bg-white p-2 rounded block">
                VITE_SUPABASE_URL=https://your-project.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=your-anon-key
              </code>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">2. Thiết lập Supabase</h4>
              <p className="text-sm text-green-800">
                Chạy file supabase-schema.sql trong Supabase SQL Editor để tạo các bảng cần thiết.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">3. Kiểm tra mạng</h4>
              <p className="text-sm text-yellow-800">
                Đảm bảo kết nối internet ổn định và không bị chặn bởi firewall.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionFixer;
