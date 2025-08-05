import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/config/supabase';
import { setupDatabase, insertSampleData } from '@/utils/setupDatabase';

const SimpleDbTester: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const testBasicConnection = async () => {
    setIsLoading(true);
    addLog('🔍 Testing basic Supabase connection...');

    // First check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    addLog(`Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    addLog(`Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);

    if (!supabaseUrl || !supabaseKey) {
      addLog('❌ Missing Supabase credentials in environment variables');
      setTestResults(prev => ({ ...prev, basicConnection: false, error: 'Missing credentials' }));
      setIsLoading(false);
      return false;
    }

    try {
      const supabase = getSupabaseClient();
      
      // Test 1: Basic connection - try to access recipes table
      addLog('Testing basic connection...');
      try {
        // Try to access recipes table - even if it fails, it means connection works
        const { error: testError } = await supabase.from('recipes').select('id').limit(1);

        if (testError && testError.message.includes('relation "public.recipes" does not exist')) {
          addLog('✅ Basic connection successful (recipes table not found is expected)');
          setTestResults(prev => ({ ...prev, basicConnection: true }));
        } else if (testError && testError.message.includes('schema cache')) {
          addLog('✅ Basic connection successful (schema cache issue is normal)');
          setTestResults(prev => ({ ...prev, basicConnection: true }));
        } else if (testError) {
          addLog(`❌ Basic connection failed: ${testError.message}`);
          setTestResults(prev => ({ ...prev, basicConnection: false, error: testError.message }));
          return false;
        } else {
          addLog('✅ Basic connection successful');
          setTestResults(prev => ({ ...prev, basicConnection: true }));
        }
      } catch (err: any) {
        addLog(`❌ Connection test failed: ${err.message}`);
        setTestResults(prev => ({ ...prev, basicConnection: false, error: err.message }));
        return false;
      }

      // Test 2: Check if recipes table exists
      addLog('Checking if recipes table exists...');
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('id')
        .limit(1);

      if (recipesError) {
        addLog(`❌ Recipes table not found: ${recipesError.message}`);
        setTestResults(prev => ({ ...prev, tablesExist: false }));
        return false;
      } else {
        addLog(`✅ Recipes table exists (found ${recipesData?.length || 0} records)`);
        setTestResults(prev => ({ ...prev, tablesExist: true, recipeCount: recipesData?.length || 0 }));
        return true;
      }

    } catch (error: any) {
      addLog(`❌ Connection test failed: ${error.message}`);
      setTestResults(prev => ({ ...prev, basicConnection: false, error: error.message }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    addLog('🔧 Starting database setup...');
    
    try {
      const result = await setupDatabase();
      
      if (result.success) {
        addLog('✅ Database setup completed!');
        setStatus('Database setup completed');
        
        // Test connection again
        await testBasicConnection();
      } else {
        addLog(`❌ Database setup failed: ${result.message}`);
        setStatus('Database setup failed');
      }
    } catch (error: any) {
      addLog(`❌ Database setup error: ${error.message}`);
      setStatus('Database setup error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertSampleData = async () => {
    setIsLoading(true);
    addLog('📝 Inserting sample data...');
    
    try {
      const result = await insertSampleData();
      
      if (result.success) {
        addLog('✅ Sample data inserted!');
        // Test connection again to see updated counts
        await testBasicConnection();
      } else {
        addLog(`❌ Sample data insertion failed: ${result.message}`);
      }
    } catch (error: any) {
      addLog(`❌ Sample data error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-test on component mount
  useEffect(() => {
    testBasicConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Simple Database Tester</CardTitle>
          <p className="text-sm text-gray-600">Status: {status}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={testBasicConnection} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? '⏳' : '🔍'} Test Connection
            </Button>
            <Button 
              onClick={handleSetupDatabase} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? '⏳' : '🔧'} Setup Database
            </Button>
            <Button 
              onClick={handleInsertSampleData} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? '⏳' : '📝'} Insert Sample Data
            </Button>
          </div>

          {/* Test Results */}
          {testResults && (
            <Card className={`${testResults.basicConnection ? 'border-green-200' : 'border-red-200'}`}>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Test Results:</h3>
                <ul className="space-y-1 text-sm">
                  <li>Basic Connection: {testResults.basicConnection ? '✅' : '❌'}</li>
                  <li>Tables Exist: {testResults.tablesExist ? '✅' : '❌'}</li>
                  {testResults.recipeCount !== undefined && (
                    <li>Recipe Count: {testResults.recipeCount}</li>
                  )}
                  {testResults.error && (
                    <li className="text-red-600">Error: {testResults.error}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Logs */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">Logs:</h3>
              <div className="bg-gray-100 p-3 rounded max-h-60 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No logs yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-bold text-blue-800 mb-2">📋 Instructions</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Click "Test Connection" to check if Supabase is accessible</li>
                <li>2. If tables don't exist, click "Setup Database" to create them</li>
                <li>3. Click "Insert Sample Data" to add test recipes</li>
                <li>4. If setup fails, you may need to run SQL manually in Supabase</li>
              </ol>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDbTester;
