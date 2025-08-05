import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🚀 Applying migration to create meals table...');
    
    // Since we can't use exec_sql, let's try to create the table using a different approach
    // We'll use the apply_migration function from Supabase
    
    const migrationSql = `
-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_plan_id ON meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(meal_plan_id, meal_date);

-- Enable RLS (Row Level Security)
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meals
CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );
    `;
    
    console.log('📝 Migration SQL prepared');
    console.log('⚠️  Since Supabase doesn\'t allow direct SQL execution from client,');
    console.log('    please copy the following SQL and run it in Supabase SQL Editor:');
    console.log('🔗 https://supabase.com/dashboard/project/exfwzughxzpwedtkfdwo/sql');
    console.log('\n📋 SQL to execute:');
    console.log(migrationSql);
    
    // Test if we can at least check the table exists
    console.log('\n🧪 Testing current table status...');
    
    const { data: mealsTest, error: mealsError } = await supabase
      .from('meals')
      .select('id')
      .limit(1);
    
    if (mealsError) {
      if (mealsError.code === '42P01') {
        console.log('❌ meals table does not exist - please run the SQL above');
      } else {
        console.error('❌ Error testing meals table:', mealsError);
      }
    } else {
      console.log('✅ meals table exists and is accessible');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

applyMigration();
