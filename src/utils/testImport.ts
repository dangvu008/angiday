import { ImportService } from '@/services/ImportService';

// Test URLs for different types of recipe websites
const testUrls = [
  {
    name: 'AllRecipes (with JSON-LD)',
    url: 'https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/',
    expectedData: {
      hasTitle: true,
      hasIngredients: true,
      hasInstructions: true,
      hasImage: true
    }
  },
  {
    name: 'Food.com',
    url: 'https://www.food.com/recipe/beef-stir-fry-15184',
    expectedData: {
      hasTitle: true,
      hasIngredients: true,
      hasInstructions: true
    }
  },
  {
    name: 'BBC Good Food',
    url: 'https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe',
    expectedData: {
      hasTitle: true,
      hasIngredients: true,
      hasInstructions: true
    }
  }
];

export async function testImportFunction() {
  console.log('🧪 Bắt đầu test chức năng import...\n');

  for (const test of testUrls) {
    console.log(`📝 Testing: ${test.name}`);
    console.log(`🔗 URL: ${test.url}`);
    
    try {
      const startTime = Date.now();
      const result = await ImportService.extractFromUrl(test.url, 'recipe');
      const endTime = Date.now();
      
      console.log(`⏱️  Thời gian: ${endTime - startTime}ms`);
      
      if (result.success && result.data) {
        console.log('✅ Trích xuất thành công!');
        
        // Validate extracted data
        const data = result.data;
        const validations = [
          { check: test.expectedData.hasTitle, actual: !!data.title, field: 'title' },
          { check: test.expectedData.hasIngredients, actual: !!data.ingredients, field: 'ingredients' },
          { check: test.expectedData.hasInstructions, actual: !!data.instructions, field: 'instructions' },
          { check: test.expectedData.hasImage, actual: !!data.image, field: 'image' }
        ];

        validations.forEach(({ check, actual, field }) => {
          if (check) {
            console.log(`${actual ? '✅' : '❌'} ${field}: ${actual ? 'OK' : 'Missing'}`);
          }
        });

        // Log extracted data summary
        console.log('\n📊 Dữ liệu trích xuất:');
        console.log(`   Tên: ${data.title || 'N/A'}`);
        console.log(`   Danh mục: ${data.category || 'N/A'}`);
        console.log(`   Thời gian: ${data.cookingTime || 'N/A'}`);
        console.log(`   Khẩu phần: ${data.servings || 'N/A'}`);
        console.log(`   Độ khó: ${data.difficulty || 'N/A'}`);
        console.log(`   Nguyên liệu: ${data.ingredients ? `${data.ingredients.split('\n').length} items` : 'N/A'}`);
        console.log(`   Hướng dẫn: ${data.instructions ? `${data.instructions.split('\n\n').length} steps` : 'N/A'}`);
        console.log(`   Hình ảnh: ${data.image ? 'Có' : 'Không'}`);
        console.log(`   Calories: ${data.calories || 'N/A'}`);
        
      } else {
        console.log('❌ Trích xuất thất bại!');
        console.log(`   Lỗi: ${result.error}`);
      }
      
    } catch (error) {
      console.log('💥 Lỗi exception!');
      console.log(`   ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    console.log('\n' + '─'.repeat(50) + '\n');
  }
  
  console.log('🏁 Hoàn thành test!');
}

// Test individual URL
export async function testSingleUrl(url: string) {
  console.log(`🧪 Testing single URL: ${url}`);
  
  try {
    const result = await ImportService.extractFromUrl(url, 'recipe');
    
    if (result.success && result.data) {
      console.log('✅ Success!');
      console.log('📊 Extracted data:', result.data);
      return result.data;
    } else {
      console.log('❌ Failed!');
      console.log('Error:', result.error);
      return null;
    }
  } catch (error) {
    console.log('💥 Exception!');
    console.log('Error:', error);
    return null;
  }
}

// Validate extracted recipe data
export function validateRecipeData(data: any): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!data.title || data.title === 'Tiêu đề chưa xác định') {
    issues.push('Thiếu tiêu đề hợp lệ');
  }
  
  if (!data.ingredients || data.ingredients.trim().length < 10) {
    issues.push('Thiếu nguyên liệu hoặc nguyên liệu quá ngắn');
  }
  
  if (!data.instructions || data.instructions.trim().length < 20) {
    issues.push('Thiếu hướng dẫn hoặc hướng dẫn quá ngắn');
  }
  
  if (data.servings && (data.servings < 1 || data.servings > 50)) {
    issues.push('Số khẩu phần không hợp lý');
  }
  
  if (data.calories && (data.calories < 0 || data.calories > 5000)) {
    issues.push('Số calories không hợp lý');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Export for use in console
if (typeof window !== 'undefined') {
  (window as any).testImport = {
    testImportFunction,
    testSingleUrl,
    validateRecipeData
  };
}
