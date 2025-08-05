import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMealPlansTable() {
  try {
    console.log('🚀 Setting up meal_plans table...');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-meal-plans-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      
      // Try alternative approach - execute statements one by one
      console.log('🔄 Trying alternative approach...');
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
          const { error: stmtError } = await supabase.rpc('exec_sql', { 
            sql_query: statement.trim() + ';' 
          });
          
          if (stmtError) {
            console.warn(`⚠️ Warning on statement: ${stmtError.message}`);
          }
        }
      }
    } else {
      console.log('✅ SQL executed successfully');
    }
    
    // Test the tables
    console.log('🧪 Testing meal_plans table...');
    const { data: mealPlansTest, error: mealPlansError } = await supabase
      .from('meal_plans')
      .select('*')
      .limit(1);
    
    if (mealPlansError) {
      console.error('❌ meal_plans table test failed:', mealPlansError);
    } else {
      console.log('✅ meal_plans table is working');
    }
    
    console.log('🧪 Testing meals table...');
    const { data: mealsTest, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .limit(1);
    
    if (mealsError) {
      console.error('❌ meals table test failed:', mealsError);
    } else {
      console.log('✅ meals table is working');
    }
    
    console.log('🎉 Setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Alternative function using direct table creation
async function setupWithDirectSQL() {
  try {
    console.log('🚀 Testing connection and checking existing tables...');

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return;
    }

    console.log('✅ Connection successful');

    // Check if meal_plans table exists by trying to query it
    console.log('🔍 Checking if meal_plans table exists...');
    const { data: mealPlansCheck, error: mealPlansCheckError } = await supabase
      .from('meal_plans')
      .select('id')
      .limit(1);

    if (mealPlansCheckError) {
      if (mealPlansCheckError.code === '42P01') {
        console.log('❌ meal_plans table does not exist');
        console.log('📝 Please create the table manually in Supabase SQL Editor');
        console.log('🔗 Go to: https://supabase.com/dashboard/project/exfwzughxzpwedtkfdwo/sql');
        console.log('\n📋 Copy and paste this SQL:');
        console.log(`
-- Create meal_plans table
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meals_plan_id ON meals(meal_plan_id);
CREATE INDEX idx_meals_date ON meals(meal_date);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- RLS policies for meal_plans
CREATE POLICY "Users can manage their own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for meals
CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meals.meal_plan_id
      AND meal_plans.user_id = auth.uid()
    )
  );
        `);
      } else {
        console.error('❌ Error checking meal_plans table:', mealPlansCheckError);
      }
    } else {
      console.log('✅ meal_plans table exists');
    }

    // Check meals table
    console.log('🔍 Checking if meals table exists...');
    const { data: mealsCheck, error: mealsCheckError } = await supabase
      .from('meals')
      .select('id')
      .limit(1);

    if (mealsCheckError) {
      if (mealsCheckError.code === '42P01') {
        console.log('❌ meals table does not exist');
      } else {
        console.error('❌ Error checking meals table:', mealsCheckError);
      }
    } else {
      console.log('✅ meals table exists');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run setup
if (process.argv.includes('--direct')) {
  setupWithDirectSQL();
} else {
  setupMealPlansTable();
}
