import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabaseHelpers } from '@/config/supabase';

const SupabaseStatus: React.FC = () => {
  interface StatusType {
    url: string;
    key: string;
    connected: boolean;
    error?: string;
  }

  const [status, setStatus] = useState<StatusType | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const statusInfo = supabaseHelpers.getStatus();
      setStatus({
        url: statusInfo.url || '',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : '',
        connected: statusInfo.isInitialized && statusInfo.hasClient
      });
      
      const connected = await supabaseHelpers.testConnection();
      setIsConnected(connected.success || false);
    } catch (error) {
      console.error('Error checking Supabase status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusColor = (connected: boolean | null) => {
    if (connected === null) return 'bg-gray-100 text-gray-800';
    return connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (connected: boolean | null) => {
    if (connected === null) return 'Checking...';
    return connected ? 'Connected' : 'Disconnected';
  };

  const maskCredential = (credential: string) => {
    if (!credential) return 'Not configured';
    if (credential.length <= 10) return '***';
    return credential.substring(0, 10) + '***';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-blue-600" />
          Supabase Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection:</span>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(isConnected)}>
              {isConnected ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {getStatusText(isConnected)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Configuration Status */}
        {status && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Database URL:</span>
              <Badge variant={status.url ? "default" : "secondary"}>
                {status.url ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>API Key:</span>
              <Badge variant={status.key ? "default" : "secondary"}>
                {status.key ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
          </div>
        )}

        {/* Credentials */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Credentials:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {showCredentials ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">URL:</span>
              <span className="font-mono">
                {showCredentials 
                  ? import.meta.env.VITE_SUPABASE_URL || 'Not set'
                  : maskCredential(import.meta.env.VITE_SUPABASE_URL)
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Anon Key:</span>
              <span className="font-mono">
                {showCredentials 
                  ? import.meta.env.VITE_SUPABASE_ANON_KEY || 'Not set'
                  : maskCredential(import.meta.env.VITE_SUPABASE_ANON_KEY)
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Adapter:</span>
              <span className="font-mono">
                {import.meta.env.VITE_DATABASE_ADAPTER || 'localStorage'}
              </span>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span>{import.meta.env.VITE_APP_ENV || 'development'}</span>
            </div>
            <div className="flex justify-between">
              <span>Dev Mode:</span>
              <span>{import.meta.env.VITE_DEV_MODE || 'true'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkStatus}
              disabled={isLoading}
              className="flex-1"
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => supabaseHelpers.reset()}
              className="flex-1"
            >
              Reset Client
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {isConnected === false && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Unable to connect to Supabase. Please check:
            </p>
            <ul className="text-xs text-red-700 mt-1 ml-4 list-disc">
              <li>Environment variables are set correctly</li>
              <li>Supabase project is active</li>
              <li>Network connection is stable</li>
              <li>Database schema is created</li>
            </ul>
          </div>
        )}

        {isConnected === true && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Successfully connected to Supabase!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseStatus;
