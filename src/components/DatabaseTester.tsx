import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, XCircle, Loader2, Settings } from 'lucide-react';
import { AdapterFactory, AdapterType } from '@/services/adapters/AdapterFactory';
import { kitchenService, vietnameseRecipes } from '@/services/kitchenService';
import { supabaseHelpers } from '@/config/supabase';

const DatabaseTester: React.FC = () => {
  const [currentAdapter, setCurrentAdapter] = useState<AdapterType>('localStorage');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const switchAdapter = async (adapterType: AdapterType) => {
    try {
      setIsLoading(true);
      addLog(`Switching to ${adapterType} adapter...`);
      
      const adapter = AdapterFactory.createAdapter(adapterType);
      kitchenService.setAdapter(adapter);
      setCurrentAdapter(adapterType);
      
      addLog(`Successfully switched to ${adapterType}`);
    } catch (error) {
      addLog(`Error switching to ${adapterType}: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setTestResults({});
      addLog('Testing database connection...');

      // Test Supabase connection if using Supabase
      if (currentAdapter === 'supabase') {
        try {
          const result = await supabaseHelpers.testConnection();
          setTestResults(prev => ({
            ...prev,
            supabaseConnection: result.success,
            basicConnection: result.details.basicConnection,
            tablesExist: result.details.tablesExist,
            canQuery: result.details.canQuery
          }));

          addLog(`🔍 Supabase Diagnostics:`);
          addLog(`  Basic Connection: ${result.details.basicConnection ? '✅' : '❌'}`);
          addLog(`  Tables Exist: ${result.details.tablesExist ? '✅' : '❌'}`);
          addLog(`  Can Query: ${result.details.canQuery ? '✅' : '❌'}`);

          if (result.details.error) {
            addLog(`  Error: ${result.details.error}`);
          }

          if (!result.details.tablesExist) {
            addLog(`⚠️ Tables not found. Click 'Setup Database' to create schema.`);
          }
        } catch (error) {
          setTestResults(prev => ({ ...prev, supabaseConnection: false }));
          addLog(`❌ Supabase connection error: ${error}`);
        }
      }

      // Test 1: Get recipes
      try {
        const recipes = await kitchenService.getRecipes();
        setTestResults(prev => ({ ...prev, getRecipes: true }));
        addLog(`✅ Get recipes: Found ${recipes.length} recipes`);
      } catch (error) {
        setTestResults(prev => ({ ...prev, getRecipes: false }));
        addLog(`❌ Get recipes failed: ${error}`);
      }

      // Test 2: Create recipe
      try {
        const testRecipe = {
          name: 'Test Recipe',
          description: 'Test description',
          ingredients: ['Test ingredient'],
          instructions: ['Test instruction'],
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          difficulty: 'easy' as const,
          nutrition: { calories: 100 },
          tags: ['test']
        };
        
        const created = await kitchenService.createRecipe(testRecipe);
        setTestResults(prev => ({ ...prev, createRecipe: true }));
        addLog(`✅ Create recipe: Created recipe with ID ${created.id}`);
        
        // Clean up
        await kitchenService.deleteRecipe(created.id);
        addLog(`🧹 Cleaned up test recipe`);
      } catch (error) {
        setTestResults(prev => ({ ...prev, createRecipe: false }));
        addLog(`❌ Create recipe failed: ${error}`);
      }

      addLog('Database connection test completed');
    } catch (error) {
      addLog(`❌ Connection test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setIsLoading(true);
      addLog('Seeding database with Vietnamese recipes...');

      const existingRecipes = await kitchenService.getRecipes();
      if (existingRecipes.length > 0) {
        addLog(`Database already has ${existingRecipes.length} recipes`);
        return;
      }

      let successCount = 0;
      for (const recipe of vietnameseRecipes) {
        try {
          await kitchenService.createRecipe(recipe);
          successCount++;
        } catch (error) {
          addLog(`❌ Failed to create recipe ${recipe.name}: ${error}`);
        }
      }

      addLog(`✅ Successfully seeded ${successCount}/${vietnameseRecipes.length} recipes`);
    } catch (error) {
      addLog(`❌ Seeding failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const setupDatabase = async () => {
    try {
      setIsLoading(true);
      addLog('🔧 Setting up database schema...');

      const result = await supabaseHelpers.setupDatabase();

      if (result.success) {
        addLog('✅ Database setup completed successfully');
        // Re-test connection after setup
        await testConnection();
      } else {
        addLog(`❌ Database setup failed: ${result.message}`);
      }
    } catch (error) {
      addLog(`❌ Database setup error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getAdapterStatus = (adapterType: AdapterType) => {
    if (adapterType === 'localStorage') return 'available';
    if (adapterType === 'supabase') {
      const hasCredentials = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      return hasCredentials ? 'available' : 'missing-config';
    }
    return 'not-implemented';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'missing-config': return 'bg-yellow-100 text-yellow-800';
      case 'not-implemented': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Sẵn sàng';
      case 'missing-config': return 'Thiếu config';
      case 'not-implemented': return 'Chưa triển khai';
      default: return 'Lỗi';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
          <Database className="h-8 w-8 text-blue-600" />
          Database Adapter Tester
        </div>
        <p className="text-gray-600">Test kết nối với các database backends khác nhau</p>
      </div>

      {/* Adapter Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chọn Database Adapter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['localStorage', 'supabase', 'firebase', 'pocketbase'] as AdapterType[]).map((adapter) => {
              const status = getAdapterStatus(adapter);
              const isActive = currentAdapter === adapter;
              
              return (
                <div key={adapter} className="space-y-2">
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className="w-full"
                    onClick={() => switchAdapter(adapter)}
                    disabled={isLoading || status === 'not-implemented'}
                  >
                    {adapter}
                  </Button>
                  <Badge className={getStatusColor(status)} variant="outline">
                    {getStatusText(status)}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Adapter hiện tại:</strong> {currentAdapter}
            </p>
            {currentAdapter === 'supabase' && (
              <div className="text-xs text-blue-600 mt-1 space-y-1">
                <p>✅ Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'}</p>
                <p>✅ Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}</p>
                <p>🔧 Environment: {import.meta.env.VITE_APP_ENV || 'development'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={testConnection}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              Test Connection
            </Button>

            {currentAdapter === 'supabase' && (
              <Button
                onClick={setupDatabase}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Setup Database
              </Button>
            )}

            <Button
              onClick={seedDatabase}
              disabled={isLoading}
              variant="outline"
            >
              Seed Database
            </Button>
            
            <Button 
              onClick={clearLogs}
              variant="outline"
              size="sm"
            >
              Clear Logs
            </Button>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Test Results:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(testResults).map(([test, success]) => (
                  <div key={test} className="flex items-center gap-2">
                    {success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">{test}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🔧 Hướng dẫn khắc phục lỗi Supabase</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Nếu Connection = "Disconnected":</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Kiểm tra credentials trong .env file</li>
              <li>Đảm bảo Supabase project đang active</li>
              <li>Click "Setup Database" để tạo schema tự động</li>
              <li>Hoặc chạy file supabase-schema.sql trong SQL Editor</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">📋 Setup từ đầu:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Tạo project miễn phí tại <a href="https://supabase.com" className="underline">supabase.com</a></li>
              <li>Copy Project URL và anon key từ Settings → API</li>
              <li>Tạo file .env và thêm:</li>
            </ol>
            <div className="bg-white p-3 rounded border font-mono text-xs mt-2">
              VITE_SUPABASE_URL=your_project_url<br/>
              VITE_SUPABASE_ANON_KEY=your_anon_key<br/>
              VITE_DATABASE_ADAPTER=supabase
            </div>
            <p className="text-sm mt-2">4. Restart dev server và click "Setup Database"</p>
            <p className="text-sm">5. Test connection để verify</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTester;
