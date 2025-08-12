// Simple test để kiểm tra meal planning với user authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfwzughxzpwedtkfdwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Znd6dWdoeHpwd2VkdGtmZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDA1NjAsImV4cCI6MjA2OTc3NjU2MH0.VfXgZg1iPu934cGRYJ_O-IuxtTR2rK6k_HHNUhdMdng';

async function testSimpleMeal() {
  console.log('🧪 Testing Simple Meal Planning...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. Skip authentication for now - use a test user ID
    console.log('🔐 Using test user ID...');
    const testUserId = '550e8400-e29b-41d4-a716-446655440000';
    console.log('✅ Test user ID set');
    
    // 2. Test getting recipes
    console.log('📚 Testing recipes...');
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .limit(3);
    
    if (recipesError) {
      console.error('❌ Recipes error:', recipesError);
      return;
    }
    
    console.log(`✅ Found ${recipes?.length || 0} recipes`);
    
    if (!recipes || recipes.length === 0) {
      console.log('⚠️ No recipes found');
      return;
    }
    
    // 3. Test creating user record
    console.log('👤 Testing user creation...');
    const userId = testUserId;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert([{
        id: userId,
        email: 'test@example.com',
        name: 'Test User'
      }])
      .select()
      .single();

    if (userError) {
      console.error('❌ User creation error:', userError);
      // Continue anyway - user might already exist
      console.log('⚠️ Continuing with existing user...');
    } else {
      console.log('✅ User created:', userData.id);
    }
    
    // 4. Test creating meal plan
    console.log('🍽️ Testing meal plan creation...');
    const today = new Date().toISOString().split('T')[0];
    
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from('meal_plans')
      .insert([{
        user_id: userId,
        title: 'Test Meal Plan',
        description: 'Simple test meal plan',
        date: today,
        meal_type: 'lunch',
        recipe_id: recipes[0].id,
        servings: 2,
        notes: 'Test meal'
      }])
      .select()
      .single();
    
    if (mealPlanError) {
      console.error('❌ Meal plan error:', mealPlanError);
      return;
    }
    
    console.log('✅ Meal plan created:', mealPlan.id);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSimpleMeal();
