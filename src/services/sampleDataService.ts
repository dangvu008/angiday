import { DailyMenuPlan, Recipe } from '@/types/kitchen';

/**
 * Service để tạo và quản lý dữ liệu mẫu cho demo
 */
export class SampleDataService {
  
  /**
   * Tạo dữ liệu công thức mẫu
   */
  static createSampleRecipes(): Recipe[] {
    return [
      {
        id: 'vn_001',
        title: 'Canh Chua Cá Lóc',
        description: 'Món canh chua truyền thống miền Nam với cá lóc tươi ngon',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
        cookingTime: '45 phút',
        servings: 4,
        difficulty: 'Trung bình',
        calories: 280,
        ingredients: [
          '500g cá lóc',
          '200g dứa',
          '100g đậu bắp',
          '50g giá đỗ',
          '2 quả cà chua',
          'Me, đường, nước mắm',
          'Hành lá, ngò gai'
        ],
        instructions: [
          'Sơ chế cá lóc, cắt khúc vừa ăn',
          'Nấu nước dùng từ xương cá',
          'Cho dứa, cà chua vào nấu',
          'Thêm cá, đậu bắp',
          'Nêm nếm vừa ăn',
          'Cho giá đỗ, rau thơm'
        ],
        tags: ['canh', 'cá', 'miền nam', 'truyền thống'],
        nutrition: {
          calories: 280,
          protein: 25,
          carbs: 15,
          fat: 12,
          fiber: 3
        }
      },
      {
        id: 'vn_002',
        title: 'Thịt Kho Tàu',
        description: 'Món thịt kho đậm đà hương vị, thơm ngon với trứng cút',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        cookingTime: '60 phút',
        servings: 4,
        difficulty: 'Dễ',
        calories: 420,
        ingredients: [
          '500g thịt ba chỉ',
          '10 quả trứng cút',
          'Nước dừa tươi',
          'Đường phèn',
          'Nước mắm, tỏi',
          'Hành tím, ớt'
        ],
        instructions: [
          'Thái thịt miếng vừa ăn',
          'Luộc trứng cút, bóc vỏ',
          'Làm nước màu từ đường phèn',
          'Kho thịt với nước dừa',
          'Thêm trứng cút',
          'Kho đến thịt mềm, nước cạn'
        ],
        tags: ['thịt', 'kho', 'trứng cút', 'đậm đà'],
        nutrition: {
          calories: 420,
          protein: 28,
          carbs: 8,
          fat: 32,
          fiber: 1
        }
      },
      {
        id: 'vn_003',
        title: 'Gỏi Cuốn Tôm Thịt',
        description: 'Món gỏi cuốn tươi mát với tôm và thịt luộc',
        image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop',
        cookingTime: '30 phút',
        servings: 2,
        difficulty: 'Dễ',
        calories: 180,
        ingredients: [
          'Bánh tráng',
          '200g tôm sú',
          '200g thịt ba chỉ',
          'Bún tươi',
          'Rau sống: xà lách, húng quế',
          'Nước chấm'
        ],
        instructions: [
          'Luộc tôm, thịt chín tới',
          'Thái thịt mỏng',
          'Tôm bổ đôi',
          'Cuốn bánh tráng với nguyên liệu',
          'Ăn kèm nước chấm'
        ],
        tags: ['gỏi cuốn', 'tôm', 'tươi mát', 'healthy'],
        nutrition: {
          calories: 180,
          protein: 22,
          carbs: 18,
          fat: 4,
          fiber: 2
        }
      },
      {
        id: 'vn_004',
        title: 'Phở Gà',
        description: 'Phở gà thơm ngon với nước dùng trong vắt',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
        cookingTime: '90 phút',
        servings: 4,
        difficulty: 'Khó',
        calories: 380,
        ingredients: [
          '1 con gà ta',
          'Bánh phở',
          'Hành tây, gừng',
          'Quế, hồi, thảo quả',
          'Hành lá, ngò gai',
          'Giá đỗ'
        ],
        instructions: [
          'Nấu nước dùng từ gà và gia vị',
          'Luộc gà, xé thịt',
          'Trần bánh phở',
          'Bày bát với thịt gà',
          'Chan nước dùng nóng',
          'Ăn kèm rau thơm'
        ],
        tags: ['phở', 'gà', 'nước dùng', 'truyền thống'],
        nutrition: {
          calories: 380,
          protein: 30,
          carbs: 45,
          fat: 8,
          fiber: 2
        }
      },
      {
        id: 'vn_005',
        title: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm với sườn nướng thơm lừng',
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
        cookingTime: '45 phút',
        servings: 2,
        difficulty: 'Trung bình',
        calories: 520,
        ingredients: [
          'Cơm tấm',
          '400g sườn non',
          'Nước mắm, đường',
          'Tỏi, hành tím',
          'Dưa leo, cà chua',
          'Nước mắm pha'
        ],
        instructions: [
          'Ướp sườn với gia vị',
          'Nướng sườn trên than hoa',
          'Nấu cơm tấm',
          'Chuẩn bị rau sống',
          'Pha nước mắm chấm',
          'Bày đĩa và thưởng thức'
        ],
        tags: ['cơm tấm', 'sườn nướng', 'miền nam', 'nướng'],
        nutrition: {
          calories: 520,
          protein: 32,
          carbs: 55,
          fat: 18,
          fiber: 3
        }
      }
    ];
  }

  /**
   * Tạo dữ liệu thực đơn hàng ngày mẫu
   */
  static createSampleDailyMenus(): DailyMenuPlan[] {
    const recipes = this.createSampleRecipes();
    
    return [
      {
        id: 'menu_001',
        name: 'Thực đơn gia đình truyền thống',
        description: 'Thực đơn đậm chất Việt Nam cho cả gia đình',
        difficulty: 'Trung bình',
        totalCalories: 1280,
        prepTime: '120 phút',
        servings: 4,
        meals: {
          breakfast: {
            id: 'breakfast_001',
            name: 'Phở Gà',
            recipe: recipes[3], // Phở Gà
            mealType: 'breakfast'
          },
          lunch: {
            id: 'lunch_001', 
            name: 'Cơm Tấm Sườn Nướng',
            recipe: recipes[4], // Cơm Tấm
            mealType: 'lunch'
          },
          dinner: {
            id: 'dinner_001',
            name: 'Canh Chua Cá Lóc + Thịt Kho',
            recipe: recipes[0], // Canh Chua
            mealType: 'dinner'
          }
        },
        tags: ['truyền thống', 'gia đình', 'đầy đủ dinh dưỡng']
      },
      {
        id: 'menu_002',
        name: 'Thực đơn healthy',
        description: 'Thực đơn nhẹ nhàng, tốt cho sức khỏe',
        difficulty: 'Dễ',
        totalCalories: 940,
        prepTime: '90 phút',
        servings: 2,
        meals: {
          breakfast: {
            id: 'breakfast_002',
            name: 'Gỏi Cuốn Tôm Thịt',
            recipe: recipes[2], // Gỏi Cuốn
            mealType: 'breakfast'
          },
          lunch: {
            id: 'lunch_002',
            name: 'Canh Chua Cá Lóc',
            recipe: recipes[0], // Canh Chua
            mealType: 'lunch'
          },
          dinner: {
            id: 'dinner_002',
            name: 'Phở Gà',
            recipe: recipes[3], // Phở Gà
            mealType: 'dinner'
          }
        },
        tags: ['healthy', 'ít calo', 'tươi mát']
      },
      {
        id: 'menu_003',
        name: 'Thực đơn cuối tuần',
        description: 'Thực đơn đặc biệt cho ngày nghỉ',
        difficulty: 'Khó',
        totalCalories: 1520,
        prepTime: '180 phút',
        servings: 4,
        meals: {
          breakfast: {
            id: 'breakfast_003',
            name: 'Phở Gà Đặc Biệt',
            recipe: recipes[3], // Phở Gà
            mealType: 'breakfast'
          },
          lunch: {
            id: 'lunch_003',
            name: 'Cơm Tấm Sườn Nướng',
            recipe: recipes[4], // Cơm Tấm
            mealType: 'lunch'
          },
          dinner: {
            id: 'dinner_003',
            name: 'Thịt Kho Tàu + Canh Chua',
            recipe: recipes[1], // Thịt Kho
            mealType: 'dinner'
          }
        },
        tags: ['cuối tuần', 'đặc biệt', 'thịnh soạn']
      }
    ];
  }

  /**
   * Populate dữ liệu mẫu vào localStorage
   */
  static populateSampleData() {
    const recipes = this.createSampleRecipes();
    const dailyMenus = this.createSampleDailyMenus();

    // Lưu vào localStorage
    localStorage.setItem('kitchen_recipes', JSON.stringify(recipes));
    localStorage.setItem('kitchen_daily_menus', JSON.stringify(dailyMenus));

    console.log('✅ Sample data populated successfully');
    return { recipes, dailyMenus };
  }

  /**
   * Xóa dữ liệu mẫu
   */
  static clearSampleData() {
    localStorage.removeItem('kitchen_recipes');
    localStorage.removeItem('kitchen_daily_menus');
    console.log('🗑️ Sample data cleared');
  }
}
