// Test script để kiểm tra chức năng meal planning
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfwzughxzpwedtkfdwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Znd6dWdoeHpwd2VkdGtmZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDA1NjAsImV4cCI6MjA2OTc3NjU2MH0.VfXgZg1iPu934cGRYJ_O-IuxtTR2rK6k_HHNUhdMdng';

async function testMealPlanning() {
  console.log('🧪 Testing Meal Planning functionality...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test user ID (generate a valid UUID)
    const testUserId = '550e8400-e29b-41d4-a716-446655440000';
    const today = new Date().toISOString().split('T')[0];

    // 1. Test getting recipes
    console.log('📚 Testing recipe retrieval...');
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .limit(5);

    if (recipesError) {
      console.error('❌ Error getting recipes:', recipesError);
      return;
    }

    console.log(`✅ Found ${recipes?.length || 0} recipes`);

    if (!recipes || recipes.length === 0) {
      console.log('⚠️ No recipes found. Please add some recipes first.');
      return;
    }

    // 2. Test creating a meal plan
    console.log('🍽️ Testing meal plan creation...');
    const testRecipe = recipes[0];

    const { data: mealPlan, error: mealPlanError } = await supabase
      .from('meal_plans')
      .insert([{
        user_id: testUserId,
        title: `Test Meal - ${testRecipe.title}`,
        description: 'Test meal plan',
        date: today,
        meal_type: 'lunch',
        recipe_id: testRecipe.id,
        servings: 2,
        notes: 'Test notes'
      }])
      .select()
      .single();

    if (mealPlanError) {
      console.error('❌ Error creating meal plan:', mealPlanError);
      return;
    }

    console.log('✅ Meal plan created:', mealPlan.id);

    // 3. Test getting today's meals
    console.log('📅 Testing today\'s meals retrieval...');
    const { data: todayMeals, error: mealsError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', testUserId)
      .eq('date', today);

    if (mealsError) {
      console.error('❌ Error getting meals:', mealsError);
      return;
    }

    console.log(`✅ Found ${todayMeals?.length || 0} meals for today`);

    // 4. Test daily shopping status
    console.log('🛒 Testing daily shopping status...');
    const { data: shoppingStatus, error: statusError } = await supabase
      .from('daily_shopping_status')
      .select('*')
      .eq('user_id', testUserId)
      .eq('menu_date', today)
      .single();

    if (statusError && statusError.code !== 'PGRST116') {
      console.error('❌ Error getting shopping status:', statusError);
      return;
    }

    if (!shoppingStatus) {
      console.log('📝 Creating daily shopping status...');
      const { data: newStatus, error: createStatusError } = await supabase
        .from('daily_shopping_status')
        .insert([{
          user_id: testUserId,
          menu_date: today,
          status: 'not_purchased',
          total_estimated_cost: 0,
          total_actual_cost: 0
        }])
        .select()
        .single();

      if (createStatusError) {
        console.error('❌ Error creating shopping status:', createStatusError);
        return;
      }

      console.log('✅ Daily shopping status created:', newStatus.id);
    } else {
      console.log('✅ Daily shopping status exists:', shoppingStatus.id);
    }
    
    console.log('🎉 All tests passed! Meal planning functionality is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMealPlanning();
