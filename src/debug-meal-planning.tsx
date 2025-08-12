// Debug component để kiểm tra meal planning
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebugMealPlanning: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { 
    activePlan, 
    userMealPlans, 
    availableRecipes,
    createNewPlan,
    setActivePlan,
    addMealToSlot
  } = useMealPlanning();

  const handleCreateTestPlan = () => {
    console.log('🧪 Creating test plan...');
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const newPlan = createNewPlan(
      'Test Plan',
      today,
      nextWeek.toISOString().split('T')[0]
    );

    console.log('✅ Test plan created:', newPlan);
    setActivePlan(newPlan);
  };

  const handleAddTestMeal = () => {
    if (!activePlan) {
      alert('Vui lòng tạo plan trước');
      return;
    }

    if (availableRecipes.length === 0) {
      alert('Không có recipe nào');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const testRecipe = availableRecipes[0];

    console.log('🍽️ Adding test meal:', {
      planId: activePlan.id,
      date: today,
      mealType: 'lunch',
      recipe: testRecipe.title
    });

    try {
      addMealToSlot(activePlan.id, today, 'lunch', testRecipe);
      console.log('✅ Meal added successfully');
      alert('Thêm món thành công!');
    } catch (error) {
      console.error('❌ Error adding meal:', error);
      alert('Lỗi khi thêm món: ' + error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Meal Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Status */}
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Authentication Status:</h3>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>User: {user ? `${user.name} (${user.email})` : 'None'}</p>
            <p>User ID: {user?.id || 'None'}</p>
          </div>

          {/* Meal Planning Status */}
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Meal Planning Status:</h3>
            <p>Active Plan: {activePlan ? `${activePlan.title} (${activePlan.id})` : 'None'}</p>
            <p>User Meal Plans: {userMealPlans.length}</p>
            <p>Available Recipes: {availableRecipes.length}</p>
            {activePlan && (
              <p>Active Plan Meals: {activePlan.meals.length}</p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={handleCreateTestPlan} className="w-full">
              Tạo Test Plan
            </Button>
            <Button onClick={handleAddTestMeal} className="w-full" disabled={!activePlan}>
              Thêm Test Meal
            </Button>
          </div>

          {/* Plans List */}
          {userMealPlans.length > 0 && (
            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-semibold mb-2">User Meal Plans:</h3>
              {userMealPlans.map(plan => (
                <div key={plan.id} className="mb-2 p-2 bg-white rounded">
                  <p><strong>{plan.title}</strong></p>
                  <p>ID: {plan.id}</p>
                  <p>Meals: {plan.meals.length}</p>
                  <p>Period: {plan.startDate} to {plan.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recipes List */}
          {availableRecipes.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="font-semibold mb-2">Available Recipes (first 3):</h3>
              {availableRecipes.slice(0, 3).map(recipe => (
                <div key={recipe.id} className="mb-2 p-2 bg-white rounded">
                  <p><strong>{recipe.title}</strong></p>
                  <p>ID: {recipe.id}</p>
                  <p>Category: {recipe.category}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugMealPlanning;
