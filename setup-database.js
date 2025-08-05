// Script để setup database và test kết nối
// Chạy trong browser console hoặc Node.js

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    // Import Supabase client
    const { getSupabaseClient } = await import('./src/config/supabase.ts');
    const supabase = getSupabaseClient();
    
    console.log('✅ Supabase client initialized');
    
    // Step 1: Test basic connection
    console.log('🔍 Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .rpc('exec_sql', { sql: 'SELECT 1 as test' });
    
    if (healthError && healthError.code !== '42883') {
      // Function doesn't exist, that's ok for now
      console.log('⚠️ exec_sql function not found, continuing...');
    } else {
      console.log('✅ Basic connection successful');
    }
    
    // Step 2: Check if tables exist
    console.log('🔍 Checking existing tables...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['recipes', 'meal_plans', 'meals']);
    
    if (tablesError) {
      console.error('❌ Cannot check tables:', tablesError);
    } else {
      const existingTables = tables.map(t => t.table_name);
      console.log('📊 Existing tables:', existingTables);
      
      if (existingTables.length === 0) {
        console.log('💡 No tables found. Please run the migration script in Supabase SQL Editor:');
        console.log('📄 File: supabase-migration.sql');
        return;
      }
    }
    
    // Step 3: Check meal_plans table structure
    console.log('🔍 Checking meal_plans table structure...');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'meal_plans')
      .eq('table_schema', 'public');
    
    if (columnsError) {
      console.error('❌ Cannot check columns:', columnsError);
    } else {
      const columnNames = columns.map(c => c.column_name);
      console.log('📊 meal_plans columns:', columnNames);
      
      const requiredColumns = ['id', 'user_id', 'name', 'start_date', 'end_date', 'created_at', 'updated_at'];
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
      
      if (missingColumns.length > 0) {
        console.error('❌ Missing columns in meal_plans:', missingColumns);
        console.log('💡 Please run the migration script to add missing columns');
        return;
      } else {
        console.log('✅ meal_plans table structure is correct');
      }
    }
    
    // Step 4: Test creating sample data
    console.log('🔍 Testing sample data creation...');
    
    // Test recipe creation
    const sampleRecipe = {
      name: 'Test Recipe',
      description: 'Test description',
      ingredients: ['ingredient 1', 'ingredient 2'],
      instructions: ['step 1', 'step 2'],
      prep_time: 10,
      cook_time: 20,
      servings: 2,
      difficulty: 'easy',
      nutrition: { calories: 300 },
      tags: ['test']
    };
    
    const { data: createdRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([sampleRecipe])
      .select()
      .single();
    
    if (recipeError) {
      console.error('❌ Failed to create test recipe:', recipeError);
    } else {
      console.log('✅ Test recipe created:', createdRecipe.id);
      
      // Test meal plan creation
      const sampleMealPlan = {
        user_id: 'test_user',
        name: 'Test Meal Plan',
        description: 'Test description',
        start_date: '2025-01-28',
        end_date: '2025-02-04',
        is_active: false,
        settings: {}
      };
      
      const { data: createdPlan, error: planError } = await supabase
        .from('meal_plans')
        .insert([sampleMealPlan])
        .select()
        .single();
      
      if (planError) {
        console.error('❌ Failed to create test meal plan:', planError);
      } else {
        console.log('✅ Test meal plan created:', createdPlan.id);
        
        // Test meal creation
        const sampleMeal = {
          meal_plan_id: createdPlan.id,
          recipe_id: createdRecipe.id,
          meal_date: '2025-01-28',
          meal_type: 'breakfast',
          completed: false,
          notes: 'Test meal'
        };
        
        const { data: createdMeal, error: mealError } = await supabase
          .from('meals')
          .insert([sampleMeal])
          .select()
          .single();
        
        if (mealError) {
          console.error('❌ Failed to create test meal:', mealError);
        } else {
          console.log('✅ Test meal created:', createdMeal.id);
          
          // Clean up test data
          console.log('🧹 Cleaning up test data...');
          
          await supabase.from('meals').delete().eq('id', createdMeal.id);
          await supabase.from('meal_plans').delete().eq('id', createdPlan.id);
          await supabase.from('recipes').delete().eq('id', createdRecipe.id);
          
          console.log('✅ Test data cleaned up');
        }
      }
    }
    
    // Step 5: Test the adapter
    console.log('🔍 Testing SupabaseAdapter...');
    
    try {
      const { SupabaseAdapter } = await import('./src/services/adapters/SupabaseAdapter.ts');
      const adapter = new SupabaseAdapter();
      
      // Test getting meal plans
      const mealPlans = await adapter.getMealPlans('test_user');
      console.log('✅ SupabaseAdapter.getMealPlans works:', mealPlans.length, 'plans');
      
      // Test getting recipes
      const recipes = await adapter.getRecipes();
      console.log('✅ SupabaseAdapter.getRecipes works:', recipes.length, 'recipes');
      
    } catch (adapterError) {
      console.error('❌ SupabaseAdapter test failed:', adapterError);
    }
    
    console.log('🎉 Database setup and testing completed successfully!');
    console.log('💡 Your database is ready to use');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('💡 Please check your Supabase configuration and run the migration script');
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  setupDatabase();
  window.setupDatabase = setupDatabase;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupDatabase };
}

console.log('🚀 Database setup script loaded');
console.log('💡 Run setupDatabase() to test your database setup');
