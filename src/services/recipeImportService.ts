/**
 * Service for importing recipes from various sources
 */

export interface ImportedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  difficulty: string;
  category: string;
  image?: string;
  source?: string;
  sourceUrl?: string;
}

export interface ImportResult {
  success: boolean;
  recipe?: ImportedRecipe;
  error?: string;
}

class RecipeImportService {
  private readonly supportedDomains = [
    'cooky.vn',
    'foody.vn',
    'allrecipes.com',
    'food.com',
    'epicurious.com',
    'foodnetwork.com',
    'delish.com',
    'tasty.co'
  ];

  /**
   * Import recipe from URL
   */
  async importFromUrl(url: string): Promise<ImportResult> {
    try {
      const domain = this.extractDomain(url);
      
      if (!this.isSupportedDomain(domain)) {
        return {
          success: false,
          error: `Trang web ${domain} chưa được hỗ trợ`
        };
      }

      // In a real implementation, this would make an API call to a backend service
      // that handles web scraping and parsing
      const recipe = await this.parseUrlContent(url, domain);
      
      return {
        success: true,
        recipe
      };
    } catch (error) {
      return {
        success: false,
        error: 'Không thể tải công thức từ URL này'
      };
    }
  }

  /**
   * Import recipe from text content
   */
  importFromText(text: string): ImportResult {
    try {
      const recipe = this.parseTextContent(text);
      
      if (!recipe.title || recipe.ingredients.length === 0) {
        return {
          success: false,
          error: 'Không thể phân tích được công thức từ văn bản này'
        };
      }

      return {
        success: true,
        recipe
      };
    } catch (error) {
      return {
        success: false,
        error: 'Có lỗi khi phân tích văn bản'
      };
    }
  }

  /**
   * Import recipe from JSON format
   */
  importFromJson(jsonString: string): ImportResult {
    try {
      const data = JSON.parse(jsonString);
      const recipe = this.normalizeJsonRecipe(data);
      
      return {
        success: true,
        recipe
      };
    } catch (error) {
      return {
        success: false,
        error: 'Định dạng JSON không hợp lệ'
      };
    }
  }

  /**
   * Parse text content to extract recipe information
   */
  private parseTextContent(text: string): ImportedRecipe {
    const lines = text.split('\n').filter(line => line.trim());
    
    let title = '';
    let description = '';
    const ingredients: string[] = [];
    const instructions: string[] = [];
    
    let currentSection = '';
    let titleFound = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      const lowerLine = trimmedLine.toLowerCase();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Extract title (first non-empty line)
      if (!titleFound && trimmedLine) {
        title = trimmedLine;
        titleFound = true;
        continue;
      }
      
      // Detect sections
      if (this.isIngredientsSection(lowerLine)) {
        currentSection = 'ingredients';
        continue;
      }
      
      if (this.isInstructionsSection(lowerLine)) {
        currentSection = 'instructions';
        continue;
      }
      
      // Process content based on current section
      if (currentSection === 'ingredients') {
        const ingredient = this.cleanIngredientLine(trimmedLine);
        if (ingredient) {
          ingredients.push(ingredient);
        }
      } else if (currentSection === 'instructions') {
        const instruction = this.cleanInstructionLine(trimmedLine);
        if (instruction) {
          instructions.push(instruction);
        }
      } else if (!description && trimmedLine && currentSection === '') {
        // If no section detected yet, treat as description
        description = trimmedLine;
      }
    }

    return {
      title: title || 'Công thức mới',
      description: description || 'Công thức được nhập từ văn bản',
      ingredients,
      instructions,
      cookTime: this.estimateCookTime(instructions),
      servings: this.estimateServings(ingredients),
      difficulty: this.estimateDifficulty(instructions),
      category: this.categorizeRecipe(title, ingredients),
      source: 'text_import'
    };
  }

  /**
   * Check if line indicates ingredients section
   */
  private isIngredientsSection(line: string): boolean {
    const indicators = [
      'nguyên liệu',
      'ingredients',
      'thành phần',
      'cần chuẩn bị',
      'materials'
    ];
    
    return indicators.some(indicator => line.includes(indicator));
  }

  /**
   * Check if line indicates instructions section
   */
  private isInstructionsSection(line: string): boolean {
    const indicators = [
      'cách làm',
      'hướng dẫn',
      'instructions',
      'steps',
      'quy trình',
      'thực hiện',
      'làm món'
    ];
    
    return indicators.some(indicator => line.includes(indicator));
  }

  /**
   * Clean ingredient line
   */
  private cleanIngredientLine(line: string): string {
    return line
      .replace(/^[-•*]\s*/, '') // Remove bullet points
      .replace(/^\d+\.\s*/, '') // Remove numbers
      .trim();
  }

  /**
   * Clean instruction line
   */
  private cleanInstructionLine(line: string): string {
    return line
      .replace(/^[-•*]\s*/, '') // Remove bullet points
      .replace(/^\d+\.\s*/, '') // Remove step numbers
      .replace(/^bước\s*\d+:?\s*/i, '') // Remove "Bước 1:"
      .trim();
  }

  /**
   * Estimate cooking time based on instructions
   */
  private estimateCookTime(instructions: string[]): string {
    const text = instructions.join(' ').toLowerCase();
    
    // Look for time mentions
    const timeMatches = text.match(/(\d+)\s*(phút|giờ|hour|minute)/g);
    if (timeMatches && timeMatches.length > 0) {
      // Return the longest time found
      let maxMinutes = 0;
      timeMatches.forEach(match => {
        const [, number, unit] = match.match(/(\d+)\s*(phút|giờ|hour|minute)/) || [];
        const minutes = unit.includes('giờ') || unit.includes('hour') 
          ? parseInt(number) * 60 
          : parseInt(number);
        maxMinutes = Math.max(maxMinutes, minutes);
      });
      
      if (maxMinutes >= 60) {
        return `${Math.floor(maxMinutes / 60)} giờ ${maxMinutes % 60 > 0 ? maxMinutes % 60 + ' phút' : ''}`.trim();
      } else {
        return `${maxMinutes} phút`;
      }
    }
    
    // Estimate based on complexity
    if (instructions.length > 8) return '2 giờ';
    if (instructions.length > 5) return '1 giờ';
    if (instructions.length > 3) return '45 phút';
    return '30 phút';
  }

  /**
   * Estimate servings based on ingredients
   */
  private estimateServings(ingredients: string[]): number {
    const text = ingredients.join(' ').toLowerCase();
    
    // Look for serving mentions
    const servingMatches = text.match(/(\d+)\s*(người|khẩu phần|serving)/);
    if (servingMatches) {
      return parseInt(servingMatches[1]);
    }
    
    // Estimate based on ingredient quantities
    if (ingredients.some(ing => ing.includes('kg') || ing.includes('kilogram'))) {
      return 6;
    }
    if (ingredients.some(ing => ing.includes('500g') || ing.includes('500 g'))) {
      return 4;
    }
    
    return 2; // Default
  }

  /**
   * Estimate difficulty based on instructions
   */
  private estimateDifficulty(instructions: string[]): string {
    const text = instructions.join(' ').toLowerCase();
    
    const hardKeywords = ['ủ', 'lên men', 'ninh', 'hầm', 'nướng lò', 'tempura', 'sous vide'];
    const mediumKeywords = ['xào', 'chiên', 'nướng', 'hấp', 'rim'];
    
    if (instructions.length > 10 || hardKeywords.some(keyword => text.includes(keyword))) {
      return 'Khó';
    }
    
    if (instructions.length > 5 || mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'Trung bình';
    }
    
    return 'Dễ';
  }

  /**
   * Categorize recipe based on title and ingredients
   */
  private categorizeRecipe(title: string, ingredients: string[]): string {
    const titleLower = title.toLowerCase();
    const ingredientsText = ingredients.join(' ').toLowerCase();
    
    if (titleLower.includes('phở') || titleLower.includes('bún') || titleLower.includes('mì')) {
      return 'Món nước';
    }
    
    if (titleLower.includes('bánh') || titleLower.includes('cake') || titleLower.includes('cookie')) {
      return 'Bánh kẹo';
    }
    
    if (titleLower.includes('salad') || titleLower.includes('gỏi')) {
      return 'Salad';
    }
    
    if (ingredientsText.includes('thịt') || ingredientsText.includes('gà') || ingredientsText.includes('heo')) {
      return 'Món chính';
    }
    
    if (ingredientsText.includes('rau') || ingredientsText.includes('củ')) {
      return 'Món chay';
    }
    
    return 'Món chính';
  }

  /**
   * Mock URL parsing (in real app, this would call backend API)
   */
  private async parseUrlContent(url: string, domain: string): Promise<ImportedRecipe> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response based on domain
    const mockRecipes: { [key: string]: ImportedRecipe } = {
      'cooky.vn': {
        title: 'Bún Bò Huế',
        description: 'Món bún bò Huế đậm đà hương vị miền Trung',
        ingredients: [
          '500g xương heo',
          '300g thịt bò',
          '200g bún bò',
          '2 củ hành tây',
          'Mắm ruốc',
          'Ớt sa tế'
        ],
        instructions: [
          'Ninh xương heo để lấy nước dùng',
          'Thái thịt bò thành miếng vừa ăn',
          'Nấu bún bò với nước dùng',
          'Nêm nếm gia vị cho vừa khẩu vị',
          'Bày bún ra tô, chan nước dùng'
        ],
        cookTime: '2 giờ',
        servings: 4,
        difficulty: 'Trung bình',
        category: 'Món nước',
        source: 'cooky.vn',
        sourceUrl: url
      },
      'default': {
        title: 'Công thức từ ' + domain,
        description: 'Công thức được nhập từ ' + domain,
        ingredients: ['Nguyên liệu 1', 'Nguyên liệu 2', 'Nguyên liệu 3'],
        instructions: ['Bước 1', 'Bước 2', 'Bước 3'],
        cookTime: '30 phút',
        servings: 2,
        difficulty: 'Dễ',
        category: 'Món chính',
        source: domain,
        sourceUrl: url
      }
    };
    
    return mockRecipes[domain] || mockRecipes['default'];
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  /**
   * Check if domain is supported
   */
  private isSupportedDomain(domain: string): boolean {
    return this.supportedDomains.includes(domain);
  }

  /**
   * Normalize JSON recipe data
   */
  private normalizeJsonRecipe(data: any): ImportedRecipe {
    return {
      title: data.title || data.name || 'Công thức mới',
      description: data.description || data.summary || '',
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      instructions: Array.isArray(data.instructions) ? data.instructions : 
                   Array.isArray(data.steps) ? data.steps : [],
      cookTime: data.cookTime || data.prepTime || '30 phút',
      servings: parseInt(data.servings) || parseInt(data.yield) || 2,
      difficulty: data.difficulty || 'Trung bình',
      category: data.category || data.type || 'Món chính',
      image: data.image || data.photo,
      source: 'json_import'
    };
  }

  /**
   * Get supported domains list
   */
  getSupportedDomains(): string[] {
    return [...this.supportedDomains];
  }
}

export const recipeImportService = new RecipeImportService();
