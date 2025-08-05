// Script để test kết nối Supabase trực tiếp
import { createClient } from '@supabase/supabase-js';

// Đọc environment variables
const supabaseUrl = 'https://exfwzughxzpwedtkfdwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Znd6dWdoeHpwd2VkdGtmZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDA1NjAsImV4cCI6MjA2OTc3NjU2MH0.VfXgZg1iPu934cGRYJ_O-IuxtTR2rK6k_HHNUhdMdng';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Tạo Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test 1: Kiểm tra kết nối cơ bản bằng cách truy vấn recipes table
    console.log('📋 Testing basic connection...');
    const { data, error } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "public.recipes" does not exist')) {
        console.log('✅ Connection successful! (recipes table not found is expected)');
        console.log('💡 Need to run database schema setup');
        return { success: true, needsSetup: true };
      } else if (error.message.includes('schema cache')) {
        console.log('✅ Connection successful! (schema cache issue is normal)');
        console.log('💡 Need to run database schema setup');
        return { success: true, needsSetup: true };
      } else {
        console.error('❌ Connection failed:', error.message);
        return { success: false, error: error.message };
      }
    } else {
      console.log('✅ Connection successful!');
      console.log(`📊 Found ${data?.length || 0} recipes`);
      return { success: true, needsSetup: false, recipeCount: data?.length || 0 };
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function setupDatabase() {
  console.log('🔧 Setting up database schema...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Kiểm tra xem function exec_sql có tồn tại không
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test' 
    });
    
    if (error) {
      console.error('❌ exec_sql function not found:', error.message);
      console.log('💡 Please run the supabase-schema.sql file manually in Supabase SQL Editor');
      return { success: false, message: 'exec_sql function not found. Please run supabase-schema.sql manually.' };
    }
    
    console.log('✅ exec_sql function is available');
    
    // Tạo bảng recipes
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        ingredients JSONB NOT NULL DEFAULT '[]',
        instructions JSONB NOT NULL DEFAULT '[]',
        prep_time INTEGER NOT NULL DEFAULT 0,
        cook_time INTEGER NOT NULL DEFAULT 0,
        servings INTEGER NOT NULL DEFAULT 1,
        difficulty VARCHAR(20) NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
        nutrition JSONB NOT NULL DEFAULT '{}',
        image_url TEXT,
        tags JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.error('❌ Failed to create recipes table:', createError.message);
      return { success: false, message: createError.message };
    }
    
    console.log('✅ Recipes table created successfully');
    
    // Enable RLS
    const rlsSQL = `
      ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow public access" ON recipes;
      CREATE POLICY "Allow public access" ON recipes FOR ALL USING (true);
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    
    if (rlsError) {
      console.warn('⚠️ RLS setup warning:', rlsError.message);
    } else {
      console.log('✅ RLS policies configured');
    }
    
    return { success: true, message: 'Database setup completed successfully!' };
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    return { success: false, message: error.message };
  }
}

// Chạy test
async function main() {
  console.log('🚀 Starting connection test...');
  
  const connectionResult = await testConnection();
  
  if (connectionResult.success) {
    if (connectionResult.needsSetup) {
      console.log('🔧 Database needs setup, attempting to create schema...');
      const setupResult = await setupDatabase();
      
      if (setupResult.success) {
        console.log('✅ Setup completed, testing connection again...');
        await testConnection();
      } else {
        console.log('❌ Setup failed:', setupResult.message);
      }
    }
  }
  
  console.log('🎉 Test completed!');
}

// Chạy nếu được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testConnection, setupDatabase };
