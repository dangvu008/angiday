import { getSupabaseClient } from '@/config/supabase';

export const setupDatabase = async () => {
  const supabase = getSupabaseClient();
  
  try {
    console.log('🔧 Starting database setup...');

    // Test if tables already exist by trying to query them
    console.log('1. Checking if tables exist...');
    
    try {
      const { data, error } = await supabase.from('recipes').select('id').limit(1);
      
      if (!error) {
        console.log('✅ Tables already exist and are accessible');
        return { success: true, message: 'Database is already set up and working!' };
      }
      
      if (error.message.includes('relation "public.recipes" does not exist')) {
        console.log('📝 Tables do not exist, need to create them manually');
        
        // Provide instructions for manual setup
        const instructions = `
🔧 Database Setup Required

The database tables do not exist yet. Please follow these steps:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of 'supabase-schema.sql' file
4. Run the SQL script
5. Come back and test the connection again

Alternatively, you can:
- Use the Database section in Supabase dashboard to create tables manually
- Import the schema from the project files
        `;
        
        return { 
          success: false, 
          message: instructions,
          needsManualSetup: true 
        };
      } else {
        throw error;
      }
    } catch (error: any) {
      console.error('Database check failed:', error);
      throw error;
    }

    console.log('✅ Database check completed successfully!');
    return { success: true, message: 'Database is accessible and working!' };

  } catch (error: any) {
    console.error('❌ Database setup failed:', error);
    
    let helpfulMessage = `Database setup failed: ${error.message}`;
    
    if (error.message?.includes('function exec_sql')) {
      helpfulMessage += '\n\n⚠️ The exec_sql function is missing. This means you need to run the SQL manually in Supabase SQL Editor.';
      helpfulMessage += '\n\n📋 Steps to fix:';
      helpfulMessage += '\n1. Go to your Supabase project dashboard';
      helpfulMessage += '\n2. Open SQL Editor';
      helpfulMessage += '\n3. Run the supabase-schema.sql file';
    }
    
    return { success: false, message: helpfulMessage };
  }
};

// Function to insert comprehensive sample data
export const insertSampleData = async () => {
  const supabase = getSupabaseClient();
  
  try {
    console.log('📝 Inserting sample data...');
    
    // Check if data already exists
    const { data: existingRecipes, error: checkError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingRecipes && existingRecipes.length > 0) {
      console.log('Sample data already exists');
      return { success: true, message: 'Sample data already exists in database!' };
    }

    // Insert multiple sample recipes
    const sampleRecipes = [
      {
        name: 'Phở Bò',
        description: 'Món phở bò truyền thống Việt Nam',
        ingredients: ['Bánh phở', 'Thịt bò', 'Hành tây', 'Ngò gai', 'Giá đỗ', 'Nước dùng xương'],
        instructions: ['Luộc xương bò 2-3 tiếng', 'Thái thịt bò mỏng', 'Trần bánh phở', 'Múc nước dùng nóng'],
        prep_time: 30,
        cook_time: 180,
        servings: 4,
        difficulty: 'medium',
        tags: ['vietnamese', 'soup', 'beef', 'traditional'],
        source: 'system'
      },
      {
        name: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm với sườn nướng thơm ngon',
        ingredients: ['Cơm tấm', 'Sườn heo', 'Nước mắm', 'Đường', 'Tỏi', 'Ớt'],
        instructions: ['Ướp sườn với gia vị', 'Nướng sườn trên than hoa', 'Chuẩn bị cơm tấm', 'Trình bày đẹp mắt'],
        prep_time: 20,
        cook_time: 25,
        servings: 2,
        difficulty: 'easy',
        tags: ['vietnamese', 'grilled', 'pork', 'rice'],
        source: 'system'
      },
      {
        name: 'Bánh Mì Thịt Nướng',
        description: 'Bánh mì Việt Nam với thịt nướng',
        ingredients: ['Bánh mì', 'Thịt heo', 'Pate', 'Rau thơm', 'Dưa chua', 'Tương ớt'],
        instructions: ['Nướng thịt thơm phức', 'Chuẩn bị rau sống', 'Phết pate lên bánh', 'Kẹp đầy đủ nguyên liệu'],
        prep_time: 15,
        cook_time: 20,
        servings: 1,
        difficulty: 'easy',
        tags: ['vietnamese', 'sandwich', 'pork', 'street-food'],
        source: 'system'
      }
    ];

    const { data: recipes, error: insertError } = await supabase
      .from('recipes')
      .insert(sampleRecipes)
      .select();

    if (insertError) {
      console.error('Sample recipe error:', insertError);
      throw insertError;
    }

    console.log(`✅ Inserted ${recipes?.length || 0} sample recipes successfully!`);
    return { 
      success: true, 
      message: `Sample data inserted successfully! Added ${recipes?.length || 0} recipes.`, 
      recipes 
    };

  } catch (error: any) {
    console.error('❌ Sample data insertion failed:', error);
    return { success: false, message: `Sample data insertion failed: ${error.message}` };
  }
};
