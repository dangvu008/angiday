import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { kitchenService } from '@/services/kitchenService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export const SupabaseConnectionTest: React.FC = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: TestResult[] = [
      { name: 'User Authentication', status: 'pending', message: 'Checking user...' },
      { name: 'Create Meal Plan', status: 'pending', message: 'Testing meal plan creation...' },
      { name: 'Fetch Meal Plans', status: 'pending', message: 'Testing meal plan retrieval...' },
      { name: 'Create Recipe', status: 'pending', message: 'Testing recipe creation...' },
      { name: 'Fetch Recipes', status: 'pending', message: 'Testing recipe retrieval...' }
    ];

    setResults([...tests]);

    try {
      // Test 1: User Authentication
      if (user && user.id) {
        tests[0] = {
          name: 'User Authentication',
          status: 'success',
          message: `User authenticated with UUID: ${user.id}`,
          details: { userId: user.id, email: user.email }
        };
      } else {
        tests[0] = {
          name: 'User Authentication',
          status: 'error',
          message: 'No authenticated user found'
        };
      }
      setResults([...tests]);

      if (!user) return;

      // Test 2: Create Meal Plan
      try {
        const testPlan = await kitchenService.createMealPlan({
          userId: user.id,
          name: 'Test Plan - ' + new Date().toISOString(),
          description: 'Test meal plan for UUID validation',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        tests[1] = {
          name: 'Create Meal Plan',
          status: 'success',
          message: `Meal plan created successfully`,
          details: { planId: testPlan.id, userId: testPlan.userId }
        };
      } catch (error: any) {
        tests[1] = {
          name: 'Create Meal Plan',
          status: 'error',
          message: error.message || 'Failed to create meal plan',
          details: error
        };
      }
      setResults([...tests]);

      // Test 3: Fetch Meal Plans
      try {
        const plans = await kitchenService.getMealPlans(user.id);
        tests[2] = {
          name: 'Fetch Meal Plans',
          status: 'success',
          message: `Retrieved ${plans.length} meal plans`,
          details: { count: plans.length }
        };
      } catch (error: any) {
        tests[2] = {
          name: 'Fetch Meal Plans',
          status: 'error',
          message: error.message || 'Failed to fetch meal plans',
          details: error
        };
      }
      setResults([...tests]);

      // Test 4: Create Recipe
      try {
        const testRecipe = await kitchenService.createRecipe({
          id: 'test_' + Date.now(),
          title: 'Test Recipe - ' + new Date().toISOString(),
          description: 'Test recipe for validation',
          image: 'https://via.placeholder.com/400x300',
          cookingTime: '30 phút',
          servings: 4,
          difficulty: 'Dễ',
          calories: 300,
          ingredients: ['Test ingredient 1', 'Test ingredient 2'],
          instructions: ['Step 1', 'Step 2'],
          tags: ['test'],
          category: 'test'
        });

        tests[3] = {
          name: 'Create Recipe',
          status: 'success',
          message: `Recipe created successfully`,
          details: { recipeId: testRecipe.id }
        };
      } catch (error: any) {
        tests[3] = {
          name: 'Create Recipe',
          status: 'error',
          message: error.message || 'Failed to create recipe',
          details: error
        };
      }
      setResults([...tests]);

      // Test 5: Fetch Recipes
      try {
        const recipes = await kitchenService.getRecipes();
        tests[4] = {
          name: 'Fetch Recipes',
          status: 'success',
          message: `Retrieved ${recipes.length} recipes`,
          details: { count: recipes.length }
        };
      } catch (error: any) {
        tests[4] = {
          name: 'Fetch Recipes',
          status: 'error',
          message: error.message || 'Failed to fetch recipes',
          details: error
        };
      }
      setResults([...tests]);

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Supabase Connection Test
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="ml-4"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(result.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {result.name}
                  </h4>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {result.message}
                </p>
                {result.details && (
                  <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
