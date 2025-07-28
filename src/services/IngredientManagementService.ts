// Định nghĩa cấu trúc dữ liệu nguyên liệu chuẩn hóa
export interface StandardIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  aliases: string[]; // Các tên gọi khác nhau
  baseUnit: string; // Đơn vị cơ bản (g, ml, cái, củ, etc.)
  conversionRates: { [unit: string]: number }; // Tỷ lệ chuyển đổi
  nutritionPer100g?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    calcium?: number;
    iron?: number;
    vitaminC?: number;
  };
  averagePrice?: number; // Giá trung bình (VND)
  seasonality?: string[]; // Mùa vụ
  storageInfo?: string;
  commonBrands?: string[];
}

export interface RecipeIngredient {
  ingredientId: string;
  amount: number;
  unit: string;
  note?: string;
  isOptional?: boolean;
  substitutes?: string[]; // ID của nguyên liệu thay thế
}

export type IngredientCategory = 
  | 'thit-hai-san' 
  | 'rau-cu-qua' 
  | 'gia-vi-bot' 
  | 'sua-trung' 
  | 'hat-dau' 
  | 'banh-mi-bot' 
  | 'do-uong' 
  | 'dau-mo' 
  | 'khac';

export interface DuplicateAnalysis {
  duplicateIngredients: {
    ingredientId: string;
    recipes: string[];
    totalUsage: number;
  }[];
  similarIngredients: {
    group: StandardIngredient[];
    suggestedMerge: string;
  }[];
  unusedIngredients: StandardIngredient[];
  optimizationSuggestions: string[];
}

export class IngredientManagementService {
  private static ingredients: Map<string, StandardIngredient> = new Map();
  private static recipeIngredients: Map<string, RecipeIngredient[]> = new Map();

  // Khởi tạo dữ liệu nguyên liệu cơ bản
  static initializeBaseIngredients() {
    const baseIngredients: StandardIngredient[] = [
      {
        id: 'thit-bo',
        name: 'Thịt bò',
        category: 'thit-hai-san',
        aliases: ['beef', 'thịt bò tươi', 'bò'],
        baseUnit: 'g',
        conversionRates: { 'kg': 1000, 'lạng': 100 },
        nutritionPer100g: { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sodium: 55, iron: 2.6, vitaminC: 0 },
        averagePrice: 300000
      },
      {
        id: 'hanh-tay',
        name: 'Hành tây',
        category: 'rau-cu-qua',
        aliases: ['onion', 'củ hành', 'hành tây tím'],
        baseUnit: 'củ',
        conversionRates: { 'g': 150, 'kg': 0.15 },
        nutritionPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4, vitaminC: 7.4 },
        averagePrice: 25000
      },
      {
        id: 'toi',
        name: 'Tỏi',
        category: 'rau-cu-qua',
        aliases: ['garlic', 'tỏi tây', 'tỏi ta'],
        baseUnit: 'củ',
        conversionRates: { 'g': 5, 'kg': 0.005 },
        nutritionPer100g: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
        averagePrice: 80000
      },
      {
        id: 'gung',
        name: 'Gừng',
        category: 'rau-cu-qua',
        aliases: ['ginger', 'gừng tươi', 'gừng già'],
        baseUnit: 'g',
        conversionRates: { 'kg': 1000, 'lạng': 100 },
        nutritionPer100g: { calories: 80, protein: 1.8, carbs: 18, fat: 0.8 },
        averagePrice: 50000
      },
      {
        id: 'muoi',
        name: 'Muối',
        category: 'gia-vi-bot',
        aliases: ['salt', 'muối biển', 'muối tinh'],
        baseUnit: 'g',
        conversionRates: { 'kg': 1000, 'thìa': 5, 'thìa cà phê': 2 },
        averagePrice: 15000
      },
      {
        id: 'duong',
        name: 'Đường',
        category: 'gia-vi-bot',
        aliases: ['sugar', 'đường cát', 'đường trắng'],
        baseUnit: 'g',
        conversionRates: { 'kg': 1000, 'thìa': 5, 'thìa cà phê': 2 },
        nutritionPer100g: { calories: 387, protein: 0, carbs: 100, fat: 0 },
        averagePrice: 20000
      },
      {
        id: 'nuoc-mam',
        name: 'Nước mắm',
        category: 'gia-vi-bot',
        aliases: ['fish sauce', 'nước mắm Phú Quốc', 'nước mắm cá cơm'],
        baseUnit: 'ml',
        conversionRates: { 'l': 1000, 'thìa': 15, 'thìa cà phê': 5 },
        averagePrice: 45000
      },
      {
        id: 'dau-an',
        name: 'Dầu ăn',
        category: 'dau-mo',
        aliases: ['cooking oil', 'dầu thực vật', 'dầu đậu nành'],
        baseUnit: 'ml',
        conversionRates: { 'l': 1000, 'thìa': 15, 'thìa cà phê': 5 },
        nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100 },
        averagePrice: 35000
      }
    ];

    baseIngredients.forEach(ingredient => {
      this.ingredients.set(ingredient.id, ingredient);
    });
  }

  // Phân tích và chuẩn hóa chuỗi nguyên liệu từ text
  static parseIngredientsFromText(ingredientsText: string): RecipeIngredient[] {
    const lines = ingredientsText.split('\n').filter(line => line.trim());
    const parsedIngredients: RecipeIngredient[] = [];

    for (const line of lines) {
      const parsed = this.parseIngredientLine(line.trim());
      if (parsed) {
        parsedIngredients.push(parsed);
      }
    }

    return parsedIngredients;
  }

  // Phân tích một dòng nguyên liệu
  private static parseIngredientLine(line: string): RecipeIngredient | null {
    // Loại bỏ dấu gạch đầu dòng
    line = line.replace(/^[-•*]\s*/, '');

    // Regex để tách số lượng, đơn vị và tên nguyên liệu
    const patterns = [
      /^(\d+(?:[.,]\d+)?)\s*([a-zA-ZÀ-ỹ\s]+?)\s+(.+)$/, // "500 gram thịt bò"
      /^(\d+(?:[.,]\d+)?)\s*([a-zA-ZÀ-ỹ]+)\s+(.+)$/, // "2 củ hành tây"
      /^(.+?)\s+(\d+(?:[.,]\d+)?)\s*([a-zA-ZÀ-ỹ\s]+)$/, // "thịt bò 500 gram"
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, amount, unit, name] = match;
        const standardIngredient = this.findOrCreateIngredient(name.trim());
        
        return {
          ingredientId: standardIngredient.id,
          amount: parseFloat(amount.replace(',', '.')),
          unit: unit.trim(),
          note: this.extractNote(line)
        };
      }
    }

    // Fallback: tạo nguyên liệu mới nếu không parse được
    const standardIngredient = this.findOrCreateIngredient(line);
    return {
      ingredientId: standardIngredient.id,
      amount: 1,
      unit: 'phần',
      note: 'Cần xác định lại số lượng và đơn vị'
    };
  }

  // Tìm hoặc tạo nguyên liệu chuẩn
  private static findOrCreateIngredient(name: string): StandardIngredient {
    const normalizedName = this.normalizeIngredientName(name);
    
    // Tìm trong danh sách hiện có
    for (const [id, ingredient] of this.ingredients) {
      if (ingredient.name.toLowerCase() === normalizedName ||
          ingredient.aliases.some(alias => alias.toLowerCase() === normalizedName)) {
        return ingredient;
      }
    }

    // Tạo mới nếu không tìm thấy
    const newId = this.generateIngredientId(normalizedName);
    const newIngredient: StandardIngredient = {
      id: newId,
      name: this.capitalizeWords(normalizedName),
      category: this.guessCategory(normalizedName),
      aliases: [normalizedName],
      baseUnit: this.guessBaseUnit(normalizedName),
      conversionRates: {}
    };

    this.ingredients.set(newId, newIngredient);
    return newIngredient;
  }

  // Chuẩn hóa tên nguyên liệu
  private static normalizeIngredientName(name: string): string {
    return name.toLowerCase()
      .replace(/[^\w\sÀ-ỹ]/g, '') // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
      .trim();
  }

  // Đoán category cho nguyên liệu
  private static guessCategory(name: string): IngredientCategory {
    const meatKeywords = ['thịt', 'bò', 'heo', 'gà', 'vịt', 'cá', 'tôm', 'cua', 'mực'];
    const vegetableKeywords = ['rau', 'củ', 'quả', 'hành', 'tỏi', 'gừng', 'cà'];
    const spiceKeywords = ['muối', 'đường', 'tiêu', 'gia vị', 'bột', 'nước mắm'];
    const dairyKeywords = ['sữa', 'trứng', 'phô mai', 'bơ'];

    if (meatKeywords.some(keyword => name.includes(keyword))) return 'thit-hai-san';
    if (vegetableKeywords.some(keyword => name.includes(keyword))) return 'rau-cu-qua';
    if (spiceKeywords.some(keyword => name.includes(keyword))) return 'gia-vi-bot';
    if (dairyKeywords.some(keyword => name.includes(keyword))) return 'sua-trung';

    return 'khac';
  }

  // Đoán đơn vị cơ bản
  private static guessBaseUnit(name: string): string {
    if (name.includes('hành') || name.includes('tỏi') || name.includes('củ')) return 'củ';
    if (name.includes('quả') || name.includes('trái')) return 'quả';
    if (name.includes('lá') || name.includes('rau')) return 'lá';
    if (name.includes('nước') || name.includes('dầu')) return 'ml';
    return 'g';
  }

  // Tạo ID cho nguyên liệu
  private static generateIngredientId(name: string): string {
    return name.replace(/\s+/g, '-').toLowerCase();
  }

  // Viết hoa chữ cái đầu
  private static capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  // Trích xuất ghi chú từ dòng nguyên liệu
  private static extractNote(line: string): string | undefined {
    const notePatterns = [
      /\(([^)]+)\)/, // Nội dung trong ngoặc đơn
      /,\s*(.+)$/, // Nội dung sau dấu phẩy cuối
    ];

    for (const pattern of notePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  // Chuyển đổi RecipeIngredient thành text để hiển thị
  static formatIngredientsToText(ingredients: RecipeIngredient[]): string {
    return ingredients.map(ingredient => {
      const standardIngredient = this.ingredients.get(ingredient.ingredientId);
      if (!standardIngredient) return '';

      let line = `- ${ingredient.amount} ${ingredient.unit} ${standardIngredient.name}`;
      if (ingredient.note) {
        line += ` (${ingredient.note})`;
      }
      if (ingredient.isOptional) {
        line += ' (tùy chọn)';
      }

      return line;
    }).filter(line => line).join('\n');
  }

  // Phân tích trùng lặp và đề xuất tối ưu hóa
  static analyzeDuplicates(recipes: Map<string, RecipeIngredient[]>): DuplicateAnalysis {
    const ingredientUsage = new Map<string, { recipes: string[], totalUsage: number }>();
    const allIngredients = new Set<string>();

    // Đếm usage của từng nguyên liệu
    for (const [recipeId, ingredients] of recipes) {
      for (const ingredient of ingredients) {
        allIngredients.add(ingredient.ingredientId);
        
        if (!ingredientUsage.has(ingredient.ingredientId)) {
          ingredientUsage.set(ingredient.ingredientId, { recipes: [], totalUsage: 0 });
        }
        
        const usage = ingredientUsage.get(ingredient.ingredientId)!;
        usage.recipes.push(recipeId);
        usage.totalUsage += ingredient.amount;
      }
    }

    // Tìm nguyên liệu trùng lặp (xuất hiện trong nhiều công thức)
    const duplicateIngredients = Array.from(ingredientUsage.entries())
      .filter(([_, usage]) => usage.recipes.length > 1)
      .map(([ingredientId, usage]) => ({
        ingredientId,
        recipes: usage.recipes,
        totalUsage: usage.totalUsage
      }))
      .sort((a, b) => b.recipes.length - a.recipes.length);

    // Tìm nguyên liệu tương tự (có thể merge)
    const similarIngredients = this.findSimilarIngredients();

    // Tìm nguyên liệu không sử dụng
    const usedIngredientIds = new Set(ingredientUsage.keys());
    const unusedIngredients = Array.from(this.ingredients.values())
      .filter(ingredient => !usedIngredientIds.has(ingredient.id));

    // Tạo đề xuất tối ưu hóa
    const optimizationSuggestions = this.generateOptimizationSuggestions(
      duplicateIngredients,
      similarIngredients,
      unusedIngredients
    );

    return {
      duplicateIngredients,
      similarIngredients,
      unusedIngredients,
      optimizationSuggestions
    };
  }

  // Tìm nguyên liệu tương tự
  private static findSimilarIngredients(): { group: StandardIngredient[], suggestedMerge: string }[] {
    const groups: { group: StandardIngredient[], suggestedMerge: string }[] = [];
    const processed = new Set<string>();

    for (const [id, ingredient] of this.ingredients) {
      if (processed.has(id)) continue;

      const similar = [ingredient];
      processed.add(id);

      // Tìm nguyên liệu tương tự
      for (const [otherId, otherIngredient] of this.ingredients) {
        if (processed.has(otherId)) continue;

        if (this.areSimilarIngredients(ingredient, otherIngredient)) {
          similar.push(otherIngredient);
          processed.add(otherId);
        }
      }

      if (similar.length > 1) {
        groups.push({
          group: similar,
          suggestedMerge: `Gộp thành "${similar[0].name}" với aliases: ${similar.map(s => s.name).join(', ')}`
        });
      }
    }

    return groups;
  }

  // Kiểm tra hai nguyên liệu có tương tự không
  private static areSimilarIngredients(a: StandardIngredient, b: StandardIngredient): boolean {
    // Kiểm tra tên tương tự
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (this.calculateStringSimilarity(nameA, nameB) > 0.8) return true;
    
    // Kiểm tra aliases
    for (const aliasA of a.aliases) {
      for (const aliasB of b.aliases) {
        if (this.calculateStringSimilarity(aliasA.toLowerCase(), aliasB.toLowerCase()) > 0.8) {
          return true;
        }
      }
    }

    return false;
  }

  // Tính độ tương tự giữa hai chuỗi
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Tạo đề xuất tối ưu hóa
  private static generateOptimizationSuggestions(
    duplicates: any[],
    similar: any[],
    unused: StandardIngredient[]
  ): string[] {
    const suggestions: string[] = [];

    if (duplicates.length > 0) {
      suggestions.push(`Có ${duplicates.length} nguyên liệu được sử dụng trong nhiều công thức. Cân nhắc tạo danh sách mua sắm chung.`);
    }

    if (similar.length > 0) {
      suggestions.push(`Tìm thấy ${similar.length} nhóm nguyên liệu tương tự có thể gộp lại để tránh trùng lặp.`);
    }

    if (unused.length > 0) {
      suggestions.push(`Có ${unused.length} nguyên liệu chưa được sử dụng trong công thức nào. Cân nhắc xóa hoặc tạo công thức mới.`);
    }

    if (duplicates.length > 10) {
      suggestions.push('Nên tạo hệ thống quản lý kho nguyên liệu để tối ưu hóa việc mua sắm.');
    }

    return suggestions;
  }

  // Lấy danh sách nguyên liệu theo category
  static getIngredientsByCategory(category?: IngredientCategory): StandardIngredient[] {
    const ingredients = Array.from(this.ingredients.values());
    return category ? ingredients.filter(ing => ing.category === category) : ingredients;
  }

  // Tìm kiếm nguyên liệu
  static searchIngredients(query: string): StandardIngredient[] {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.ingredients.values()).filter(ingredient =>
      ingredient.name.toLowerCase().includes(normalizedQuery) ||
      ingredient.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))
    );
  }

  // Lưu recipe ingredients
  static saveRecipeIngredients(recipeId: string, ingredients: RecipeIngredient[]) {
    this.recipeIngredients.set(recipeId, ingredients);
  }

  // Lấy recipe ingredients
  static getRecipeIngredients(recipeId: string): RecipeIngredient[] {
    return this.recipeIngredients.get(recipeId) || [];
  }

  // Khởi tạo service
  static initialize() {
    this.initializeBaseIngredients();
  }
}
