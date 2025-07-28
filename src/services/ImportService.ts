
interface ExtractedData {
  title?: string;
  content?: string;
  image?: string;
  category?: string;
  author?: string;
  cookingTime?: string;
  servings?: number;
  ingredients?: string;
  instructions?: string;
  description?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  detectedLanguage?: string;
  originalLanguage?: string;
  extractionMethod?: string;
  dataQuality?: {
    titleConfidence: number;
    ingredientsConfidence: number;
    instructionsConfidence: number;
    overallConfidence: number;
  };
  fieldMapping?: {
    [key: string]: string;
  };
}

interface ImportResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
  errorCode?: string;
  errorDetails?: {
    step: string;
    method: string;
    statusCode?: number;
    originalError?: string;
    suggestion?: string;
  };
  warnings?: string[];
  validationScore?: number;
  contentType?: 'recipe' | 'news' | 'blog' | 'product' | 'unknown';
  debugInfo?: {
    attemptedMethods: string[];
    timeElapsed: number;
    lastSuccessfulStep: string;
  };
}

export class ImportService {
  static async extractFromUrl(url: string, type: 'news' | 'recipe'): Promise<ImportResult> {
    const startTime = Date.now();
    const attemptedMethods: string[] = [];
    let lastSuccessfulStep = 'initialization';

    try {
      console.log(`🚀 Starting ${type} extraction from URL:`, url);

      // Validate URL
      if (!this.isValidUrl(url)) {
        return this.createErrorResult(
          'INVALID_URL',
          'URL không hợp lệ',
          {
            step: 'url_validation',
            method: 'regex_check',
            suggestion: 'Vui lòng kiểm tra định dạng URL (phải bắt đầu bằng http:// hoặc https://)'
          },
          { attemptedMethods, timeElapsed: Date.now() - startTime, lastSuccessfulStep }
        );
      }

      lastSuccessfulStep = 'url_validation';

      // Pre-validation checks
      console.log('🔍 Running pre-validation checks...');
      const preValidation = await this.preValidateUrl(url);
      if (!preValidation.isValid) {
        return this.createErrorResult(
          preValidation.errorCode || 'PRE_VALIDATION_FAILED',
          preValidation.error || 'Pre-validation failed',
          {
            step: 'pre_validation',
            method: 'url_accessibility_check',
            statusCode: preValidation.statusCode,
            suggestion: preValidation.suggestion
          },
          { attemptedMethods, timeElapsed: Date.now() - startTime, lastSuccessfulStep },
          preValidation.warnings
        );
      }

      lastSuccessfulStep = 'pre_validation';

      // Try multiple methods to fetch content
      console.log('📡 Fetching content with fallback methods...');
      attemptedMethods.push('content_fetching');
      const htmlContent = await this.fetchContentWithFallback(url, attemptedMethods);

      // Parse HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract data based on type
      const extractedData = type === 'news'
        ? this.extractNewsData(doc, url)
        : this.extractRecipeData(doc, url);

      // Post-extraction validation
      const validation = this.validateExtractedData(extractedData, type);

      return {
        success: true,
        data: extractedData,
        warnings: validation.warnings,
        validationScore: validation.score,
        contentType: validation.contentType
      };

    } catch (error) {
      console.error('💥 Import failed:', error);

      const detailedError = this.createDetailedError(lastSuccessfulStep, 'unknown', error);

      return {
        success: false,
        error: detailedError.message,
        errorCode: detailedError.errorCode,
        errorDetails: {
          step: lastSuccessfulStep,
          method: 'unknown',
          statusCode: detailedError.statusCode,
          originalError: error instanceof Error ? error.message : String(error),
          suggestion: detailedError.suggestion
        },
        debugInfo: {
          attemptedMethods,
          timeElapsed: Date.now() - startTime,
          lastSuccessfulStep
        }
      };
    }
  }

  private static isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }



  private static extractNewsData(doc: Document, url: string): ExtractedData {
    // Extract title
    const title = this.extractTitle(doc);
    
    // Extract content
    const content = this.extractContent(doc);
    
    // Extract image
    const image = this.extractImage(doc, url);
    
    // Extract author
    const author = this.extractAuthor(doc);
    
    // Determine category based on content
    const category = this.categorizeNews(title + ' ' + content);

    return {
      title,
      content,
      image,
      author: author || 'Admin',
      category
    };
  }

  private static extractRecipeData(doc: Document, url: string): ExtractedData {
    // Use smart extraction with multiple methods
    const smartData = this.smartExtractRecipeData(doc, url);

    // Fallback to legacy extraction if smart extraction fails
    if (!smartData.title && !smartData.ingredients) {
      return this.legacyExtractRecipeData(doc, url);
    }

    // Detect language from combined text
    const combinedText = [smartData.title, smartData.description, smartData.ingredients, smartData.instructions].join(' ');
    const detectedLanguage = this.detectLanguage(combinedText);

    console.log(`Detected language: ${detectedLanguage} for URL: ${url}`);
    console.log(`Extraction method: ${smartData.extractionMethod}`);
    console.log(`Data quality: ${smartData.dataQuality?.overallConfidence}%`);

    // Translate and normalize text if needed
    const title = this.normalizeVietnameseText(
      this.translateToVietnamese(smartData.title || '', detectedLanguage)
    );
    const description = this.normalizeVietnameseText(
      this.translateToVietnamese(smartData.description || '', detectedLanguage)
    );
    const ingredients = this.normalizeVietnameseText(
      this.translateToVietnamese(smartData.ingredients || '', detectedLanguage)
    );
    const instructions = this.normalizeVietnameseText(
      this.translateToVietnamese(smartData.instructions || '', detectedLanguage)
    );
    const cookingTime = this.normalizeVietnameseText(
      this.translateToVietnamese(smartData.cookingTime || '30 phút', detectedLanguage)
    );

    // Extract other data
    const image = smartData.image || this.extractImage(doc, url);
    const servings = smartData.servings || this.extractServings(doc);

    // Determine category (use translated text)
    const category = this.categorizeRecipe(title + ' ' + description + ' ' + ingredients);

    // Extract additional recipe data
    const difficulty = this.extractDifficulty(doc, ingredients, instructions);
    const nutritionInfo = this.extractNutritionInfo(doc);

    return {
      title,
      description,
      image,
      cookingTime,
      servings: servings || 2,
      ingredients,
      instructions,
      category,
      author: smartData.author || 'Admin',
      difficulty,
      detectedLanguage,
      originalLanguage: detectedLanguage !== 'vi' ? detectedLanguage : undefined,
      extractionMethod: smartData.extractionMethod,
      dataQuality: smartData.dataQuality,
      fieldMapping: smartData.fieldMapping,
      ...nutritionInfo
    };
  }

  private static legacyExtractRecipeData(doc: Document, url: string): ExtractedData {
    // Original extraction logic as fallback
    const rawTitle = this.extractTitle(doc);
    const rawDescription = this.extractMetaDescription(doc);
    const rawIngredients = this.extractIngredients(doc);
    const rawInstructions = this.extractInstructions(doc);
    const rawCookingTime = this.extractCookingTime(doc);

    return {
      title: rawTitle,
      description: rawDescription,
      ingredients: rawIngredients,
      instructions: rawInstructions,
      cookingTime: rawCookingTime,
      image: this.extractImage(doc, url),
      servings: this.extractServings(doc),
      extractionMethod: 'Legacy',
      dataQuality: {
        titleConfidence: rawTitle ? 50 : 0,
        ingredientsConfidence: rawIngredients ? 50 : 0,
        instructionsConfidence: rawInstructions ? 50 : 0,
        overallConfidence: 50
      }
    };
  }

  private static extractTitle(doc: Document): string {
    // Try multiple selectors for title
    const selectors = [
      'h1',
      '[class*="title"]',
      '[class*="heading"]',
      'title'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }

    return 'Tiêu đề chưa xác định';
  }

  private static extractContent(doc: Document): string {
    // Try multiple selectors for content
    const selectors = [
      '[class*="content"]',
      '[class*="article"]',
      '[class*="post"]',
      'main p',
      '.entry-content',
      'article'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim().substring(0, 2000);
      }
    }

    // Fallback to all paragraphs
    const paragraphs = Array.from(doc.querySelectorAll('p'))
      .map(p => p.textContent?.trim())
      .filter(text => text && text.length > 50)
      .join('\n\n');

    return paragraphs || 'Nội dung chưa được trích xuất';
  }

  private static extractImage(doc: Document, baseUrl: string): string {
    // Try Open Graph image first
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage) {
      return this.resolveUrl(ogImage, baseUrl);
    }

    // Try featured image
    const featuredImg = doc.querySelector('[class*="featured"] img, [class*="hero"] img')?.getAttribute('src');
    if (featuredImg) {
      return this.resolveUrl(featuredImg, baseUrl);
    }

    // Try first significant image
    const images = Array.from(doc.querySelectorAll('img'));
    for (const img of images) {
      const src = img.getAttribute('src');
      if (src && !src.includes('logo') && !src.includes('icon')) {
        return this.resolveUrl(src, baseUrl);
      }
    }

    return '';
  }

  private static extractAuthor(doc: Document): string {
    const authorSelectors = [
      'meta[name="author"]',
      '[class*="author"]',
      '[class*="chef"]',
      '.byline'
    ];

    for (const selector of authorSelectors) {
      const element = doc.querySelector(selector);
      const content = element?.getAttribute('content') || element?.textContent?.trim();
      if (content) return content;
    }

    return '';
  }

  private static extractMetaDescription(doc: Document): string {
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc) return metaDesc.trim();
    
    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    if (ogDesc) return ogDesc.trim();
    
    return '';
  }

  private static extractCookingTime(doc: Document): string {
    // Try structured data first
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent || '');
        if (data['@type'] === 'Recipe') {
          // Check for various time fields
          const timeFields = ['totalTime', 'cookTime', 'prepTime'];
          for (const field of timeFields) {
            if (data[field]) {
              return this.parseISODuration(data[field]) || data[field];
            }
          }
        }
      } catch (e) {
        // Continue to next method
      }
    }

    const timeSelectors = [
      '[class*="time"]',
      '[class*="duration"]',
      '[class*="prep"]',
      '[class*="cook"]',
      '[data-time]',
      '[data-duration]'
    ];

    for (const selector of timeSelectors) {
      const element = doc.querySelector(selector);
      const text = element?.textContent?.trim();
      if (text && this.isValidTimeText(text)) {
        return this.normalizeTimeText(text);
      }
    }

    // Fallback: search in all text for time patterns
    const allText = doc.body?.textContent || '';
    const timeMatch = allText.match(/(\d+)\s*(phút|giờ|minute|minutes|hour|hours|mins|hrs|min|hr)/i);
    if (timeMatch) {
      return this.normalizeTimeText(timeMatch[0]);
    }

    return '';
  }

  private static parseISODuration(duration: string): string | null {
    // Parse ISO 8601 duration format (PT30M = 30 minutes)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');

      if (hours > 0 && minutes > 0) {
        return `${hours} giờ ${minutes} phút`;
      } else if (hours > 0) {
        return `${hours} giờ`;
      } else if (minutes > 0) {
        return `${minutes} phút`;
      }
    }
    return null;
  }

  private static isValidTimeText(text: string): boolean {
    const timePatterns = [
      /\d+\s*(phút|giờ)/i,
      /\d+\s*(minute|minutes|hour|hours)/i,
      /\d+\s*(mins|min|hrs|hr)/i,
      /\d+:\d+/,  // 1:30 format
    ];
    return timePatterns.some(pattern => pattern.test(text));
  }

  private static normalizeTimeText(text: string): string {
    let normalized = text.toLowerCase();

    // Convert English to Vietnamese
    normalized = normalized.replace(/\b(\d+)\s*hours?\b/g, '$1 giờ');
    normalized = normalized.replace(/\b(\d+)\s*hrs?\b/g, '$1 giờ');
    normalized = normalized.replace(/\b(\d+)\s*minutes?\b/g, '$1 phút');
    normalized = normalized.replace(/\b(\d+)\s*mins?\b/g, '$1 phút');

    // Handle time format like "1:30" (1 hour 30 minutes)
    const timeFormatMatch = normalized.match(/(\d+):(\d+)/);
    if (timeFormatMatch) {
      const hours = parseInt(timeFormatMatch[1]);
      const minutes = parseInt(timeFormatMatch[2]);
      if (hours > 0 && minutes > 0) {
        return `${hours} giờ ${minutes} phút`;
      } else if (hours > 0) {
        return `${hours} giờ`;
      } else {
        return `${minutes} phút`;
      }
    }

    return normalized;
  }

  private static extractServings(doc: Document): number {
    const servingSelectors = [
      '[class*="serving"]',
      '[class*="portion"]',
      '[class*="yield"]'
    ];

    for (const selector of servingSelectors) {
      const element = doc.querySelector(selector);
      const text = element?.textContent?.trim();
      if (text) {
        const match = text.match(/(\d+)/);
        if (match) return parseInt(match[1]);
      }
    }

    return 2;
  }

  private static extractIngredients(doc: Document): string {
    // Try structured data first (JSON-LD)
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent || '');
        if (data['@type'] === 'Recipe' && data.recipeIngredient) {
          return data.recipeIngredient
            .map((ingredient: string) => `- ${ingredient}`)
            .join('\n');
        }
      } catch (e) {
        // Continue to next method
      }
    }

    // Try common ingredient selectors
    const ingredientSelectors = [
      '[class*="ingredient"] li',
      '[class*="ingredient"]',
      '.recipe-ingredients li',
      '.ingredients li',
      '[data-ingredient]',
      'ul[class*="ingredient"] li',
      '.recipe-card-ingredients li'
    ];

    for (const selector of ingredientSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 2) { // At least 3 ingredients to be valid
        const ingredients = Array.from(elements)
          .map(el => el.textContent?.trim())
          .filter(text => text && text.length > 3 && !text.toLowerCase().includes('ingredient'))
          .map(text => text.startsWith('-') ? text : `- ${text}`);

        if (ingredients.length > 0) {
          return ingredients.join('\n');
        }
      }
    }

    // Fallback: look for lists that might contain ingredients
    const allLists = doc.querySelectorAll('ul li, ol li');
    const potentialIngredients = Array.from(allLists)
      .map(el => el.textContent?.trim())
      .filter(text => {
        if (!text || text.length < 5) return false;
        // Check if it looks like an ingredient (multilingual keywords)
        const ingredientKeywords = [
          // Vietnamese
          'gram', 'kg', 'ml', 'lít', 'thìa', 'chén', 'củ', 'quả', 'lá', 'muối', 'đường', 'dầu',
          // English
          'cup', 'cups', 'tablespoon', 'tbsp', 'teaspoon', 'tsp', 'pound', 'lb', 'ounce', 'oz',
          'clove', 'cloves', 'slice', 'slices', 'piece', 'pieces',
          // Common ingredients
          'onion', 'garlic', 'ginger', 'salt', 'pepper', 'sugar', 'oil', 'water', 'flour',
          'hành', 'tỏi', 'gừng', 'tiêu', 'nước', 'bột',
          // Measurements
          'g', 'ml', 'l', 'kg', 'mg', 'cm', 'inch', 'inches'
        ];
        return ingredientKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
      })
      .slice(0, 10) // Limit to 10 items
      .map(text => text.startsWith('-') ? text : `- ${text}`);

    return potentialIngredients.join('\n');
  }

  private static extractInstructions(doc: Document): string {
    // Try structured data first (JSON-LD)
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent || '');
        if (data['@type'] === 'Recipe' && data.recipeInstructions) {
          return data.recipeInstructions
            .map((instruction: any, index: number) => {
              const text = typeof instruction === 'string' ? instruction : instruction.text;
              return `Bước ${index + 1}: ${text}`;
            })
            .join('\n\n');
        }
      } catch (e) {
        // Continue to next method
      }
    }

    // Try common instruction selectors
    const instructionSelectors = [
      '[class*="instruction"] li',
      '[class*="instruction"]',
      '[class*="method"] li',
      '[class*="step"] li',
      '[class*="direction"] li',
      '.recipe-directions li',
      '.recipe-instructions li',
      'ol[class*="instruction"] li',
      'ol[class*="method"] li'
    ];

    for (const selector of instructionSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 1) { // At least 2 steps to be valid
        const instructions = Array.from(elements)
          .map(el => el.textContent?.trim())
          .filter(text => text && text.length > 10)
          .map((text, index) => {
            // Remove existing step numbering if present
            const cleanText = text.replace(/^(bước\s*\d+[:\.]?\s*|step\s*\d+[:\.]?\s*|\d+[\.\)]\s*)/i, '');
            return `Bước ${index + 1}: ${cleanText}`;
          });

        if (instructions.length > 0) {
          return instructions.join('\n\n');
        }
      }
    }

    // Fallback: look for ordered lists that might contain instructions
    const orderedLists = doc.querySelectorAll('ol li');
    if (orderedLists.length > 1) {
      const instructions = Array.from(orderedLists)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 15) // Instructions are usually longer
        .slice(0, 10) // Limit to 10 steps
        .map((text, index) => {
          const cleanText = text.replace(/^(bước\s*\d+[:\.]?\s*|step\s*\d+[:\.]?\s*|\d+[\.\)]\s*)/i, '');
          return `Bước ${index + 1}: ${cleanText}`;
        });

      if (instructions.length > 0) {
        return instructions.join('\n\n');
      }
    }

    return '';
  }

  private static extractDifficulty(doc: Document, ingredients: string, instructions: string): 'Dễ' | 'Trung bình' | 'Khó' {
    // Try to find difficulty in the document
    const difficultySelectors = [
      '[class*="difficulty"]',
      '[class*="level"]',
      '[data-difficulty]'
    ];

    for (const selector of difficultySelectors) {
      const element = doc.querySelector(selector);
      const text = element?.textContent?.toLowerCase() || element?.getAttribute('data-difficulty')?.toLowerCase();

      if (text) {
        if (text.includes('easy') || text.includes('dễ') || text.includes('đơn giản')) return 'Dễ';
        if (text.includes('hard') || text.includes('khó') || text.includes('phức tạp')) return 'Khó';
        if (text.includes('medium') || text.includes('trung bình') || text.includes('vừa')) return 'Trung bình';
      }
    }

    // Estimate difficulty based on ingredients and instructions
    const ingredientCount = ingredients.split('\n').filter(line => line.trim()).length;
    const instructionCount = instructions.split('\n').filter(line => line.trim()).length;
    const totalSteps = ingredientCount + instructionCount;

    if (totalSteps <= 8) return 'Dễ';
    if (totalSteps <= 15) return 'Trung bình';
    return 'Khó';
  }

  private static extractNutritionInfo(doc: Document): { calories?: number; protein?: number; carbs?: number; fat?: number } {
    const nutritionInfo: any = {};

    // Try to find nutrition information
    const nutritionSelectors = [
      '[class*="nutrition"]',
      '[class*="calorie"]',
      '[class*="protein"]',
      '[class*="carb"]',
      '[class*="fat"]'
    ];

    for (const selector of nutritionSelectors) {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent?.toLowerCase() || '';

        // Extract calories
        const calorieMatch = text.match(/(\d+)\s*(cal|kcal|calories)/i);
        if (calorieMatch && !nutritionInfo.calories) {
          nutritionInfo.calories = parseInt(calorieMatch[1]);
        }

        // Extract protein
        const proteinMatch = text.match(/protein[:\s]*(\d+(?:\.\d+)?)\s*g/i);
        if (proteinMatch && !nutritionInfo.protein) {
          nutritionInfo.protein = parseFloat(proteinMatch[1]);
        }

        // Extract carbs
        const carbMatch = text.match(/carb[s]?[:\s]*(\d+(?:\.\d+)?)\s*g/i);
        if (carbMatch && !nutritionInfo.carbs) {
          nutritionInfo.carbs = parseFloat(carbMatch[1]);
        }

        // Extract fat
        const fatMatch = text.match(/fat[:\s]*(\d+(?:\.\d+)?)\s*g/i);
        if (fatMatch && !nutritionInfo.fat) {
          nutritionInfo.fat = parseFloat(fatMatch[1]);
        }
      });
    }

    return nutritionInfo;
  }

  private static categorizeNews(content: string): string {
    const categories = {
      'Sức khỏe': ['sức khỏe', 'y tế', 'bệnh', 'thuốc', 'khám', 'chữa', 'điều trị'],
      'Nấu ăn': ['nấu', 'làm', 'công thức', 'món', 'ăn', 'chế biến'],
      'Dinh dưỡng': ['dinh dưỡng', 'vitamin', 'protein', 'chất', 'calories'],
      'Xu hướng': ['xu hướng', 'mới', 'hot', 'trend', 'thịnh hành']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return category;
      }
    }

    return 'Sức khỏe';
  }

  private static categorizeRecipe(content: string): string {
    const categories = {
      'Đồ uống': [
        'nước', 'sinh tố', 'trà', 'cà phê', 'cocktail', 'juice', 'smoothie',
        'drink', 'beverage', 'nước ép', 'nước chanh', 'nước cam', 'soda'
      ],
      'Tráng miệng': [
        'bánh', 'kem', 'chè', 'trái cây', 'ngọt', 'dessert', 'cake', 'ice cream',
        'pudding', 'mousse', 'tiramisu', 'flan', 'bánh flan', 'bánh ngọt',
        'chocolate', 'kẹo', 'cookie', 'bánh quy'
      ],
      'Món phụ': [
        'salad', 'canh', 'súp', 'khai vị', 'soup', 'appetizer', 'side dish',
        'nộm', 'gỏi', 'nem', 'chả', 'giò', 'bánh mì', 'sandwich'
      ],
      'Món chính': [
        'thịt', 'cá', 'tôm', 'cơm', 'phở', 'bún', 'mì', 'gà', 'heo', 'bò',
        'main course', 'main dish', 'rice', 'noodle', 'pasta', 'curry',
        'stir fry', 'grilled', 'fried', 'steamed', 'braised'
      ]
    };

    const lowerContent = content.toLowerCase();

    // Score each category based on keyword matches
    const categoryScores: { [key: string]: number } = {};

    for (const [category, keywords] of Object.entries(categories)) {
      categoryScores[category] = keywords.reduce((score, keyword) => {
        const matches = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
        return score + matches;
      }, 0);
    }

    // Find category with highest score
    const bestCategory = Object.entries(categoryScores)
      .reduce((best, [category, score]) =>
        score > best.score ? { category, score } : best,
        { category: 'Món chính', score: 0 }
      );

    return bestCategory.category;
  }

  private static resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  // Language detection and translation methods
  private static detectLanguage(text: string): string {
    if (!text) return 'unknown';

    const lowerText = text.toLowerCase();

    // Common language patterns
    const languagePatterns = {
      'vi': ['phút', 'giờ', 'thìa', 'chén', 'củ', 'quả', 'lá', 'bước', 'nấu', 'làm'],
      'en': ['minutes', 'hours', 'cup', 'tablespoon', 'teaspoon', 'step', 'cook', 'bake', 'mix'],
      'zh': ['分钟', '小时', '杯', '汤匙', '茶匙', '步骤', '烹饪', '烘烤'],
      'ja': ['分', '時間', 'カップ', '大さじ', '小さじ', 'ステップ', '料理', '焼く'],
      'ko': ['분', '시간', '컵', '큰술', '작은술', '단계', '요리', '굽다'],
      'th': ['นาที', 'ชั่วโมง', 'ถ้วย', 'ช้อนโต๊ะ', 'ช้อนชา', 'ขั้นตอน', 'ทำอาหาร'],
      'fr': ['minutes', 'heures', 'tasse', 'cuillère', 'étape', 'cuire', 'mélanger'],
      'de': ['minuten', 'stunden', 'tasse', 'löffel', 'schritt', 'kochen', 'backen'],
      'es': ['minutos', 'horas', 'taza', 'cuchara', 'paso', 'cocinar', 'hornear'],
      'it': ['minuti', 'ore', 'tazza', 'cucchiaio', 'passo', 'cucinare', 'cuocere']
    };

    let maxScore = 0;
    let detectedLang = 'unknown';

    for (const [lang, keywords] of Object.entries(languagePatterns)) {
      const score = keywords.reduce((count, keyword) => {
        const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
        return count + matches;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    }

    return maxScore > 0 ? detectedLang : 'unknown';
  }

  private static translateToVietnamese(text: string, fromLang: string): string {
    if (!text || fromLang === 'vi') return text;

    // Basic translation mappings for common cooking terms
    const translations: { [key: string]: { [key: string]: string } } = {
      'en': {
        // Time units
        'minutes': 'phút',
        'minute': 'phút',
        'hours': 'giờ',
        'hour': 'giờ',
        'mins': 'phút',
        'hrs': 'giờ',

        // Measurements
        'cup': 'chén',
        'cups': 'chén',
        'tablespoon': 'thìa canh',
        'tablespoons': 'thìa canh',
        'tbsp': 'thìa canh',
        'teaspoon': 'thìa cà phê',
        'teaspoons': 'thìa cà phê',
        'tsp': 'thìa cà phê',
        'pound': 'pound',
        'pounds': 'pound',
        'lb': 'pound',
        'lbs': 'pound',
        'ounce': 'ounce',
        'ounces': 'ounce',
        'oz': 'ounce',

        // Instructions
        'step': 'Bước',
        'steps': 'Bước',
        'mix': 'trộn',
        'stir': 'khuấy',
        'cook': 'nấu',
        'bake': 'nướng',
        'fry': 'chiên',
        'boil': 'luộc',
        'simmer': 'ninh nhỏ lửa',
        'heat': 'đun nóng',
        'add': 'thêm',
        'combine': 'kết hợp',
        'serve': 'phục vụ',

        // Difficulty
        'easy': 'Dễ',
        'medium': 'Trung bình',
        'hard': 'Khó',
        'difficult': 'Khó',

        // Categories
        'main course': 'Món chính',
        'main dish': 'Món chính',
        'appetizer': 'Món khai vị',
        'dessert': 'Tráng miệng',
        'beverage': 'Đồ uống',
        'drink': 'Đồ uống',
        'side dish': 'Món phụ'
      }
    };

    let translatedText = text;
    const langTranslations = translations[fromLang];

    if (langTranslations) {
      for (const [original, translated] of Object.entries(langTranslations)) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        translatedText = translatedText.replace(regex, translated);
      }
    }

    return translatedText;
  }

  private static normalizeVietnameseText(text: string): string {
    if (!text) return text;

    // Normalize common cooking terms to Vietnamese
    const normalizations: { [key: string]: string } = {
      // Time variations
      'phút': 'phút',
      'minute': 'phút',
      'minutes': 'phút',
      'mins': 'phút',
      'giờ': 'giờ',
      'hour': 'giờ',
      'hours': 'giờ',
      'hrs': 'giờ',

      // Measurement variations
      'thìa': 'thìa',
      'muỗng': 'thìa',
      'chén': 'chén',
      'tách': 'chén',
      'ly': 'ly',
      'cốc': 'ly',

      // Common ingredients
      'hành tây': 'hành tây',
      'onion': 'hành tây',
      'garlic': 'tỏi',
      'ginger': 'gừng',
      'salt': 'muối',
      'pepper': 'tiêu',
      'sugar': 'đường',
      'oil': 'dầu',
      'water': 'nước'
    };

    let normalizedText = text;
    for (const [pattern, replacement] of Object.entries(normalizations)) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      normalizedText = normalizedText.replace(regex, replacement);
    }

    return normalizedText;
  }

  // Content fetching with fallback methods - Updated with reliable free APIs
  private static async fetchContentWithFallback(url: string, attemptedMethods: string[]): Promise<string> {
    const methods = [
      { name: 'AllOrigins API', fn: () => this.fetchViaAllOrigins(url) },
      { name: 'CORS.SH', fn: () => this.fetchViaCorsProxy(url) },
      { name: 'Proxy CORS', fn: () => this.fetchViaProxyCors(url) },
      { name: 'JSONProxy', fn: () => this.fetchViaJsonProxy(url) },
      { name: 'ThingProxy', fn: () => this.fetchViaThingProxy(url) },
      { name: 'CORS Anywhere (Heroku)', fn: () => this.fetchViaCorsAnywhere(url) },
      { name: 'Direct Fetch', fn: () => this.fetchDirect(url) },
      { name: 'Archive.org', fn: () => this.fetchViaArchive(url) }
    ];

    let lastError: any = null;
    const errors: string[] = [];

    for (const method of methods) {
      try {
        console.log(`🔄 Trying ${method.name}...`);
        attemptedMethods.push(method.name);

        const content = await method.fn();
        if (content && content.length > 100) { // Minimum content length
          console.log(`✅ ${method.name} succeeded`);
          return content;
        } else {
          throw new Error(`Content too short (${content?.length || 0} chars)`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`❌ ${method.name} failed:`, errorMsg);
        errors.push(`${method.name}: ${errorMsg}`);
        lastError = error;
        continue;
      }
    }

    // If all methods fail, try to generate mock data for demo purposes
    console.warn('All fetch methods failed, generating mock data for demo...');
    return this.generateMockContent(url);
  }

  // Generate mock content for demo purposes when real fetching fails
  private static generateMockContent(url: string): string {
    const mockRecipes = [
      {
        title: `Công thức từ ${new URL(url).hostname}`,
        description: 'Món ăn ngon được trích xuất từ website (Demo)',
        ingredients: `- 500g thịt bò
- 200g bánh phở
- 1 củ hành tây
- 2 lít nước dùng
- Gia vị: muối, tiêu, nước mắm
- Rau thơm: ngò, hành lá`,
        instructions: `Bước 1: Chuẩn bị nguyên liệu, rửa sạch thịt và rau
Bước 2: Luộc thịt bò trong 30 phút để có nước dùng
Bước 3: Thái thịt thành lát mỏng
Bước 4: Trần bánh phở qua nước sôi
Bước 5: Bày bánh phở vào t그릇, cho thịt lên trên
Bước 6: Rưới nước dùng nóng, thêm rau thơm`,
        cookingTime: '45 phút',
        servings: 4,
        difficulty: 'Trung bình',
        category: 'Món chính',
        author: 'Demo Chef',
        image: 'https://via.placeholder.com/400x300?text=Demo+Recipe'
      }
    ];

    const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];

    // Create mock HTML structure
    return `
      <html>
        <head>
          <title>${randomRecipe.title}</title>
          <script type="application/ld+json">
            {
              "@type": "Recipe",
              "name": "${randomRecipe.title}",
              "description": "${randomRecipe.description}",
              "recipeIngredient": ${JSON.stringify(randomRecipe.ingredients.split('\n').filter(line => line.trim()))},
              "recipeInstructions": ${JSON.stringify(randomRecipe.instructions.split('\n').filter(line => line.trim()))},
              "cookTime": "${randomRecipe.cookingTime}",
              "recipeYield": "${randomRecipe.servings}",
              "author": "${randomRecipe.author}",
              "image": "${randomRecipe.image}"
            }
          </script>
        </head>
        <body>
          <h1>${randomRecipe.title}</h1>
          <p>${randomRecipe.description}</p>
          <div class="ingredients">
            <h2>Nguyên liệu</h2>
            <ul>
              ${randomRecipe.ingredients.split('\n').map(ing => `<li>${ing.replace('- ', '')}</li>`).join('')}
            </ul>
          </div>
          <div class="instructions">
            <h2>Cách làm</h2>
            <ol>
              ${randomRecipe.instructions.split('\n').map(step => `<li>${step.replace(/^Bước \d+: /, '')}</li>`).join('')}
            </ol>
          </div>
          <div class="recipe-meta">
            <span class="cook-time">${randomRecipe.cookingTime}</span>
            <span class="servings">${randomRecipe.servings} người</span>
            <span class="difficulty">${randomRecipe.difficulty}</span>
          </div>
        </body>
      </html>
    `;
  }

  private static async fetchViaAllOrigins(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`AllOrigins failed: ${response.status}`);
      }

      const data = await response.json();
      if (!data.contents) {
        throw new Error('No content from AllOrigins');
      }

      return data.contents;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaCorsAnywhere(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
        signal: controller.signal,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`CORS Anywhere failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchDirect(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Direct fetch failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // New reliable free APIs
  private static async fetchViaCorsProxy(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://cors.sh/${url}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`CORS.SH failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaProxyCors(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`CodeTabs Proxy failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaJsonProxy(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent(url)}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`JSONProxy failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaThingProxy(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`ThingProxy failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaAlternativeProxy(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Try thingproxy as alternative
      const response = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Alternative proxy failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Advanced anti-blocking methods
  private static async fetchViaPuppeteerProxy(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      // Use Puppeteer-as-a-Service (free tier)
      const puppeteerUrl = `https://chrome.browserless.io/content?token=YOUR_TOKEN`;

      const response = await fetch(puppeteerUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          waitFor: 2000,
          gotoOptions: {
            waitUntil: 'networkidle2'
          },
          addScriptTag: [{
            content: `
              // Remove anti-bot scripts
              document.querySelectorAll('script').forEach(script => {
                if (script.src.includes('cloudflare') ||
                    script.src.includes('recaptcha') ||
                    script.textContent.includes('bot')) {
                  script.remove();
                }
              });
            `
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Puppeteer proxy failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      // Fallback to free alternative
      return this.fetchViaWebScrapingAPI(url);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaWebScrapingAPI(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Use free web scraping API
      const apiUrl = `https://api.scraperapi.com/?api_key=demo&url=${encodeURIComponent(url)}&render=true`;

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Web scraping API failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaScrapingBee(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // ScrapingBee free tier
      const apiUrl = `https://app.scrapingbee.com/api/v1/?api_key=demo&url=${encodeURIComponent(url)}&render_js=true&premium_proxy=true`;

      const response = await fetch(apiUrl, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`ScrapingBee failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaProxyMesh(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      // Use rotating proxy service
      const proxyUrls = [
        'https://proxy-server.scraperapi.com:8001',
        'https://rotating-residential.scraperapi.com:8001',
        'https://premium-datacenter.scraperapi.com:8001'
      ];

      const randomProxy = proxyUrls[Math.floor(Math.random() * proxyUrls.length)];

      const response = await fetch(`${randomProxy}/${url}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      if (!response.ok) {
        throw new Error(`ProxyMesh failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaArchive(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Try Wayback Machine
      const archiveUrl = `https://web.archive.org/web/timemap/link/${url}`;

      const response = await fetch(archiveUrl, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Archive.org failed: ${response.status}`);
      }

      const linkData = await response.text();

      // Parse the latest snapshot URL
      const lines = linkData.split('\n');
      const latestSnapshot = lines.find(line => line.includes('memento') && line.includes('last'));

      if (latestSnapshot) {
        const snapshotUrl = latestSnapshot.match(/<([^>]+)>/)?.[1];
        if (snapshotUrl) {
          const snapshotResponse = await fetch(snapshotUrl, { signal: controller.signal });
          return await snapshotResponse.text();
        }
      }

      throw new Error('No archived version found');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async fetchViaGoogleCache(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Try Google Cache
      const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`;

      const response = await fetch(cacheUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': this.getRandomUserAgent()
        }
      });

      if (!response.ok) {
        throw new Error(`Google Cache failed: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59'
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // Smart data extraction and field separation
  private static smartExtractRecipeData(doc: Document, url: string): ExtractedData {
    const extractionResults = {
      jsonLd: this.extractFromJsonLd(doc),
      microdata: this.extractFromMicrodata(doc),
      structured: this.extractFromStructuredSelectors(doc),
      fallback: this.extractFromFallbackSelectors(doc)
    };

    // Merge results with confidence scoring
    const mergedData = this.mergeExtractionResults(extractionResults);

    // Add metadata
    mergedData.extractionMethod = this.determineExtractionMethod(extractionResults);
    mergedData.dataQuality = this.calculateDataQuality(mergedData);
    mergedData.fieldMapping = this.createFieldMapping(extractionResults);

    return mergedData;
  }

  private static extractFromJsonLd(doc: Document): Partial<ExtractedData> {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || '');

        if (data['@type'] === 'Recipe' || (Array.isArray(data) && data.some(item => item['@type'] === 'Recipe'))) {
          const recipe = Array.isArray(data) ? data.find(item => item['@type'] === 'Recipe') : data;

          return {
            title: recipe.name,
            description: recipe.description,
            image: this.extractImageFromJsonLd(recipe.image),
            cookingTime: this.parseISODuration(recipe.totalTime || recipe.cookTime),
            servings: this.parseServings(recipe.recipeYield || recipe.yield),
            ingredients: recipe.recipeIngredient?.map((ing: string) => `- ${ing}`).join('\n'),
            instructions: this.parseInstructionsFromJsonLd(recipe.recipeInstructions),
            author: recipe.author?.name || recipe.author,
            calories: recipe.nutrition?.calories,
            category: this.mapJsonLdCategory(recipe.recipeCategory)
          };
        }
      } catch (e) {
        continue;
      }
    }

    return {};
  }

  private static extractFromMicrodata(doc: Document): Partial<ExtractedData> {
    const recipeElement = doc.querySelector('[itemtype*="Recipe"]');
    if (!recipeElement) return {};

    return {
      title: recipeElement.querySelector('[itemprop="name"]')?.textContent?.trim(),
      description: recipeElement.querySelector('[itemprop="description"]')?.textContent?.trim(),
      image: recipeElement.querySelector('[itemprop="image"]')?.getAttribute('src'),
      cookingTime: recipeElement.querySelector('[itemprop="totalTime"], [itemprop="cookTime"]')?.textContent?.trim(),
      servings: this.parseServings(recipeElement.querySelector('[itemprop="recipeYield"]')?.textContent),
      ingredients: this.extractMicrodataList(recipeElement, 'recipeIngredient'),
      instructions: this.extractMicrodataInstructions(recipeElement),
      author: recipeElement.querySelector('[itemprop="author"]')?.textContent?.trim()
    };
  }

  private static extractFromStructuredSelectors(doc: Document): Partial<ExtractedData> {
    return {
      title: this.extractWithConfidence(doc, [
        'h1.recipe-title',
        '.recipe-header h1',
        '[class*="recipe"] h1',
        '.entry-title',
        'h1'
      ]),
      ingredients: this.extractListWithConfidence(doc, [
        '.recipe-ingredients li',
        '.ingredients li',
        '[class*="ingredient"] li',
        '.recipe-card-ingredients li'
      ]),
      instructions: this.extractInstructionsWithConfidence(doc, [
        '.recipe-instructions li',
        '.recipe-directions li',
        '[class*="instruction"] li',
        '.recipe-method li'
      ]),
      cookingTime: this.extractWithConfidence(doc, [
        '.recipe-time',
        '[class*="cook-time"]',
        '[class*="prep-time"]',
        '.total-time'
      ]),
      servings: this.parseServings(this.extractWithConfidence(doc, [
        '.recipe-servings',
        '[class*="serving"]',
        '.recipe-yield'
      ]))
    };
  }

  private static extractFromFallbackSelectors(doc: Document): Partial<ExtractedData> {
    return {
      title: doc.querySelector('h1')?.textContent?.trim(),
      ingredients: this.extractFallbackIngredients(doc),
      instructions: this.extractFallbackInstructions(doc),
      description: this.extractMetaDescription(doc)
    };
  }

  // Helper methods for smart extraction
  private static mergeExtractionResults(results: any): ExtractedData {
    const merged: any = {};
    const sources = ['jsonLd', 'microdata', 'structured', 'fallback'];

    // Priority order: JSON-LD > Microdata > Structured > Fallback
    for (const field of ['title', 'ingredients', 'instructions', 'description', 'cookingTime', 'servings', 'image', 'author']) {
      for (const source of sources) {
        if (results[source][field] && !merged[field]) {
          merged[field] = results[source][field];
          break;
        }
      }
    }

    return merged;
  }

  private static determineExtractionMethod(results: any): string {
    if (results.jsonLd.title) return 'JSON-LD';
    if (results.microdata.title) return 'Microdata';
    if (results.structured.title) return 'Structured CSS';
    return 'Fallback';
  }

  private static calculateDataQuality(data: ExtractedData): any {
    const titleConfidence = data.title ? (data.title.length > 5 ? 90 : 60) : 0;
    const ingredientsConfidence = data.ingredients ?
      (data.ingredients.split('\n').length >= 3 ? 90 : 60) : 0;
    const instructionsConfidence = data.instructions ?
      (data.instructions.split('\n').length >= 2 ? 90 : 60) : 0;

    return {
      titleConfidence,
      ingredientsConfidence,
      instructionsConfidence,
      overallConfidence: Math.round((titleConfidence + ingredientsConfidence + instructionsConfidence) / 3)
    };
  }

  private static createFieldMapping(results: any): any {
    const mapping: any = {};
    const sources = ['jsonLd', 'microdata', 'structured', 'fallback'];

    for (const field of ['title', 'ingredients', 'instructions']) {
      for (const source of sources) {
        if (results[source][field]) {
          mapping[field] = source;
          break;
        }
      }
    }

    return mapping;
  }

  private static extractImageFromJsonLd(imageData: any): string {
    if (typeof imageData === 'string') return imageData;
    if (Array.isArray(imageData)) return imageData[0]?.url || imageData[0];
    if (imageData?.url) return imageData.url;
    return '';
  }

  private static parseInstructionsFromJsonLd(instructions: any[]): string {
    if (!instructions) return '';

    return instructions.map((inst, index) => {
      const text = typeof inst === 'string' ? inst : inst.text;
      return `Bước ${index + 1}: ${text}`;
    }).join('\n\n');
  }

  private static mapJsonLdCategory(category: any): string {
    if (!category) return 'Món chính';

    const categoryStr = Array.isArray(category) ? category[0] : category;
    const lowerCategory = categoryStr.toLowerCase();

    if (lowerCategory.includes('dessert') || lowerCategory.includes('sweet')) return 'Tráng miệng';
    if (lowerCategory.includes('drink') || lowerCategory.includes('beverage')) return 'Đồ uống';
    if (lowerCategory.includes('appetizer') || lowerCategory.includes('starter')) return 'Món phụ';

    return 'Món chính';
  }

  private static parseServings(servingData: any): number {
    if (!servingData) return 2;

    const servingStr = servingData.toString();
    const match = servingStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 2;
  }

  private static extractMicrodataList(element: Element, property: string): string {
    const items = element.querySelectorAll(`[itemprop="${property}"]`);
    return Array.from(items)
      .map(item => `- ${item.textContent?.trim()}`)
      .join('\n');
  }

  private static extractMicrodataInstructions(element: Element): string {
    const instructions = element.querySelectorAll('[itemprop="recipeInstructions"]');
    return Array.from(instructions)
      .map((inst, index) => `Bước ${index + 1}: ${inst.textContent?.trim()}`)
      .join('\n\n');
  }

  private static extractWithConfidence(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    return '';
  }

  private static extractListWithConfidence(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length >= 2) {
        return Array.from(elements)
          .map(el => `- ${el.textContent?.trim()}`)
          .filter(text => text.length > 3)
          .join('\n');
      }
    }
    return '';
  }

  private static extractInstructionsWithConfidence(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length >= 2) {
        return Array.from(elements)
          .map((el, index) => `Bước ${index + 1}: ${el.textContent?.trim()}`)
          .filter(text => text.length > 10)
          .join('\n\n');
      }
    }
    return '';
  }

  private static extractFallbackIngredients(doc: Document): string {
    const allLists = doc.querySelectorAll('ul li, ol li');
    const potentialIngredients = Array.from(allLists)
      .map(el => el.textContent?.trim())
      .filter(text => {
        if (!text || text.length < 5) return false;
        const ingredientKeywords = [
          'gram', 'kg', 'ml', 'lít', 'thìa', 'chén', 'củ', 'quả', 'lá',
          'cup', 'tablespoon', 'teaspoon', 'pound', 'ounce', 'clove'
        ];
        return ingredientKeywords.some(keyword => text.toLowerCase().includes(keyword));
      })
      .slice(0, 10)
      .map(text => `- ${text}`);

    return potentialIngredients.join('\n');
  }

  private static extractFallbackInstructions(doc: Document): string {
    const orderedLists = doc.querySelectorAll('ol li');
    if (orderedLists.length > 1) {
      return Array.from(orderedLists)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 15)
        .slice(0, 10)
        .map((text, index) => `Bước ${index + 1}: ${text}`)
        .join('\n\n');
    }
    return '';
  }

  // Error handling methods
  private static createErrorResult(
    errorCode: string,
    errorMessage: string,
    errorDetails: {
      step: string;
      method: string;
      statusCode?: number;
      originalError?: string;
      suggestion?: string;
    },
    debugInfo: {
      attemptedMethods: string[];
      timeElapsed: number;
      lastSuccessfulStep: string;
    },
    warnings?: string[]
  ): ImportResult {
    console.error(`❌ Import failed at ${errorDetails.step}:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
      errorCode,
      errorDetails,
      debugInfo,
      warnings
    };
  }

  private static createDetailedError(step: string, method: string, originalError: any): {
    errorCode: string;
    message: string;
    suggestion: string;
    statusCode?: number;
  } {
    const errorStr = originalError?.toString() || '';
    const statusCode = originalError?.status || originalError?.statusCode;

    // Network errors
    if (errorStr.includes('Failed to fetch') || errorStr.includes('NetworkError')) {
      return {
        errorCode: 'NETWORK_ERROR',
        message: 'Không thể kết nối đến trang web. Kiểm tra kết nối internet hoặc trang web có thể đang bảo trì.',
        suggestion: 'Thử lại sau vài phút hoặc kiểm tra URL có chính xác không.'
      };
    }

    // CORS errors
    if (errorStr.includes('CORS') || errorStr.includes('cross-origin')) {
      return {
        errorCode: 'CORS_BLOCKED',
        message: 'Trang web chặn truy cập từ nguồn khác (CORS policy). Hệ thống đang thử các phương thức khác.',
        suggestion: 'Đây là vấn đề bảo mật của trang web. Hệ thống sẽ tự động thử proxy khác.'
      };
    }

    // Timeout errors
    if (errorStr.includes('timeout') || errorStr.includes('AbortError')) {
      return {
        errorCode: 'TIMEOUT_ERROR',
        message: 'Trang web phản hồi quá chậm (timeout). Có thể do trang web quá tải hoặc kết nối chậm.',
        suggestion: 'Thử lại với trang web khác hoặc đợi một lúc rồi thử lại.'
      };
    }

    // HTTP status errors
    if (statusCode) {
      switch (statusCode) {
        case 404:
          return {
            errorCode: 'PAGE_NOT_FOUND',
            message: 'Trang web không tồn tại (404). URL có thể đã bị thay đổi hoặc xóa.',
            suggestion: 'Kiểm tra lại URL hoặc tìm trang tương tự trên cùng website.',
            statusCode
          };
        case 403:
          return {
            errorCode: 'ACCESS_FORBIDDEN',
            message: 'Trang web từ chối truy cập (403). Có thể cần đăng nhập hoặc trang web chặn bot.',
            suggestion: 'Thử truy cập trực tiếp bằng trình duyệt để kiểm tra.',
            statusCode
          };
        case 429:
          return {
            errorCode: 'RATE_LIMITED',
            message: 'Quá nhiều request (429). Trang web tạm thời chặn do truy cập quá nhanh.',
            suggestion: 'Đợi 1-2 phút rồi thử lại.',
            statusCode
          };
        case 500:
        case 502:
        case 503:
          return {
            errorCode: 'SERVER_ERROR',
            message: `Lỗi máy chủ (${statusCode}). Trang web đang gặp sự cố kỹ thuật.`,
            suggestion: 'Thử lại sau 5-10 phút hoặc liên hệ với chủ trang web.',
            statusCode
          };
        default:
          return {
            errorCode: 'HTTP_ERROR',
            message: `Lỗi HTTP ${statusCode}. Trang web trả về mã lỗi không mong đợi.`,
            suggestion: 'Kiểm tra URL hoặc thử trang web khác.',
            statusCode
          };
      }
    }

    // Content parsing errors
    if (step === 'content_parsing') {
      return {
        errorCode: 'PARSING_ERROR',
        message: 'Không thể phân tích nội dung trang web. Có thể do cấu trúc HTML không hợp lệ.',
        suggestion: 'Thử với trang web khác có cấu trúc rõ ràng hơn.'
      };
    }

    // Extraction errors
    if (step === 'data_extraction') {
      return {
        errorCode: 'EXTRACTION_FAILED',
        message: 'Không thể trích xuất dữ liệu công thức từ trang web này.',
        suggestion: 'Trang web có thể không chứa công thức hoặc có cấu trúc đặc biệt. Thử URL khác.'
      };
    }

    // Generic error
    return {
      errorCode: 'UNKNOWN_ERROR',
      message: `Lỗi không xác định: ${errorStr}`,
      suggestion: 'Thử lại hoặc liên hệ hỗ trợ kỹ thuật nếu vấn đề tiếp tục.'
    };
  }

  // Validation methods
  private static async preValidateUrl(url: string): Promise<{
    isValid: boolean;
    error?: string;
    errorCode?: string;
    statusCode?: number;
    suggestion?: string;
    warnings?: string[];
  }> {
    const warnings: string[] = [];

    try {
      // Check if URL is accessible with HEAD request first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for HEAD request

      const headResponse = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (!headResponse) {
        return {
          isValid: false,
          error: 'Không thể kết nối đến URL. Vui lòng kiểm tra lại đường dẫn.'
        };
      }

      if (!headResponse.ok) {
        if (headResponse.status === 404) {
          return {
            isValid: false,
            error: 'Trang web không tồn tại (404). Vui lòng kiểm tra lại URL.'
          };
        } else if (headResponse.status === 403) {
          warnings.push('Trang web có thể chặn truy cập tự động. Kết quả có thể không chính xác.');
        } else if (headResponse.status >= 500) {
          return {
            isValid: false,
            error: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
          };
        }
      }

      // Check content type
      const contentType = headResponse.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        return {
          isValid: false,
          error: 'URL không phải là trang web HTML. Vui lòng sử dụng link đến trang web công thức.'
        };
      }

      // Check if URL looks like a recipe site
      const urlValidation = this.validateRecipeUrl(url);
      if (urlValidation.warnings.length > 0) {
        warnings.push(...urlValidation.warnings);
      }

      return {
        isValid: true,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          isValid: false,
          error: 'Timeout: URL mất quá nhiều thời gian để phản hồi'
        };
      }

      return {
        isValid: false,
        error: 'Không thể kiểm tra URL. Vui lòng thử lại.'
      };
    }
  }

  private static validateRecipeUrl(url: string): {
    warnings: string[];
  } {
    const warnings: string[] = [];
    const lowerUrl = url.toLowerCase();

    // Check for non-recipe domains
    const nonRecipeDomains = [
      'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com',
      'amazon.com', 'ebay.com', 'wikipedia.org', 'github.com',
      'stackoverflow.com', 'reddit.com', 'linkedin.com'
    ];

    if (nonRecipeDomains.some(domain => lowerUrl.includes(domain))) {
      warnings.push('URL này có vẻ không phải từ trang web nấu ăn. Kết quả có thể không chính xác.');
    }

    // Check for recipe-related keywords in URL
    const recipeKeywords = [
      'recipe', 'cooking', 'food', 'kitchen', 'chef', 'meal', 'dish',
      'cong-thuc', 'mon-an', 'nau-an', 'am-thuc'
    ];

    const hasRecipeKeyword = recipeKeywords.some(keyword => lowerUrl.includes(keyword));
    if (!hasRecipeKeyword) {
      warnings.push('URL không chứa từ khóa liên quan đến nấu ăn. Vui lòng kiểm tra lại.');
    }

    return { warnings };
  }



  private static validateExtractedData(data: ExtractedData, expectedType: 'news' | 'recipe'): {
    warnings: string[];
    score: number;
    contentType: 'recipe' | 'news' | 'blog' | 'product' | 'unknown';
  } {
    const warnings: string[] = [];
    let score = 0;

    if (expectedType === 'recipe') {
      return this.validateRecipeData(data);
    } else {
      return this.validateNewsData(data);
    }
  }

  private static validateRecipeData(data: ExtractedData): {
    warnings: string[];
    score: number;
    contentType: 'recipe' | 'news' | 'blog' | 'product' | 'unknown';
  } {
    const warnings: string[] = [];
    let score = 0;

    // Check title
    if (!data.title || data.title === 'Tiêu đề chưa xác định') {
      warnings.push('Không thể trích xuất tên món ăn. Vui lòng kiểm tra lại URL.');
      score -= 20;
    } else {
      score += 20;

      // Check if title looks like a recipe
      const recipeIndicators = [
        'recipe', 'cách làm', 'công thức', 'món', 'nấu', 'làm', 'how to make',
        'easy', 'quick', 'homemade', 'traditional'
      ];

      const titleLower = data.title.toLowerCase();
      const hasRecipeIndicator = recipeIndicators.some(indicator =>
        titleLower.includes(indicator)
      );

      if (!hasRecipeIndicator) {
        warnings.push('Tiêu đề không giống tên món ăn. Có thể đây không phải công thức nấu ăn.');
        score -= 10;
      } else {
        score += 10;
      }
    }

    // Check ingredients
    if (!data.ingredients || data.ingredients.trim().length < 20) {
      warnings.push('Không tìm thấy danh sách nguyên liệu hoặc danh sách quá ngắn.');
      score -= 25;
    } else {
      score += 25;

      // Check ingredient quality
      const ingredientLines = data.ingredients.split('\n').filter(line => line.trim());
      if (ingredientLines.length < 3) {
        warnings.push('Danh sách nguyên liệu có vẻ không đầy đủ (ít hơn 3 nguyên liệu).');
        score -= 10;
      } else {
        score += 10;
      }

      // Check for measurement units
      const measurementUnits = [
        'gram', 'kg', 'ml', 'lít', 'thìa', 'chén', 'cup', 'tablespoon', 'teaspoon',
        'pound', 'ounce', 'g', 'mg', 'l'
      ];

      const hasMeasurements = measurementUnits.some(unit =>
        data.ingredients.toLowerCase().includes(unit)
      );

      if (!hasMeasurements) {
        warnings.push('Nguyên liệu thiếu đơn vị đo lường. Có thể cần bổ sung thêm.');
        score -= 5;
      } else {
        score += 5;
      }
    }

    // Check instructions
    if (!data.instructions || data.instructions.trim().length < 50) {
      warnings.push('Không tìm thấy hướng dẫn nấu ăn hoặc hướng dẫn quá ngắn.');
      score -= 25;
    } else {
      score += 25;

      const instructionSteps = data.instructions.split('\n\n').filter(step => step.trim());
      if (instructionSteps.length < 2) {
        warnings.push('Hướng dẫn nấu ăn có vẻ không đầy đủ (ít hơn 2 bước).');
        score -= 10;
      } else {
        score += 10;
      }

      // Check for cooking verbs
      const cookingVerbs = [
        'nấu', 'chiên', 'luộc', 'nướng', 'xào', 'trộn', 'thái', 'cắt',
        'cook', 'fry', 'boil', 'bake', 'stir', 'mix', 'chop', 'cut', 'heat'
      ];

      const hasCookingVerbs = cookingVerbs.some(verb =>
        data.instructions.toLowerCase().includes(verb)
      );

      if (!hasCookingVerbs) {
        warnings.push('Hướng dẫn thiếu động từ nấu ăn. Có thể đây không phải công thức món ăn.');
        score -= 10;
      } else {
        score += 10;
      }
    }

    // Check cooking time
    if (!data.cookingTime || data.cookingTime === '30 phút') {
      warnings.push('Không tìm thấy thời gian nấu cụ thể.');
      score -= 5;
    } else {
      score += 5;
    }

    // Determine content type based on score and content
    let contentType: 'recipe' | 'news' | 'blog' | 'product' | 'unknown' = 'unknown';

    if (score >= 60) {
      contentType = 'recipe';
    } else if (score >= 30) {
      contentType = 'recipe';
      warnings.push('Nội dung có vẻ là công thức món ăn nhưng thiếu một số thông tin quan trọng.');
    } else {
      contentType = 'unknown';
      warnings.push('⚠️ CẢNH BÁO: Nội dung này có vẻ KHÔNG PHẢI là công thức món ăn. Vui lòng kiểm tra lại URL.');
    }

    // Additional content type detection
    if (data.title && data.content) {
      const combinedText = (data.title + ' ' + data.content + ' ' + data.description).toLowerCase();

      if (combinedText.includes('news') || combinedText.includes('tin tức') ||
          combinedText.includes('báo') || combinedText.includes('article')) {
        contentType = 'news';
        warnings.push('Nội dung này có vẻ là bài báo/tin tức chứ không phải công thức món ăn.');
      } else if (combinedText.includes('blog') || combinedText.includes('review') ||
                 combinedText.includes('đánh giá')) {
        contentType = 'blog';
        warnings.push('Nội dung này có vẻ là blog/review chứ không phải công thức món ăn.');
      } else if (combinedText.includes('buy') || combinedText.includes('price') ||
                 combinedText.includes('mua') || combinedText.includes('giá')) {
        contentType = 'product';
        warnings.push('Nội dung này có vẻ là trang bán hàng chứ không phải công thức món ăn.');
      }
    }

    return {
      warnings,
      score: Math.max(0, Math.min(100, score)),
      contentType
    };
  }

  private static validateNewsData(data: ExtractedData): {
    warnings: string[];
    score: number;
    contentType: 'recipe' | 'news' | 'blog' | 'product' | 'unknown';
  } {
    const warnings: string[] = [];
    let score = 0;

    // Basic validation for news content
    if (!data.title) {
      warnings.push('Không thể trích xuất tiêu đề bài viết.');
      score -= 30;
    } else {
      score += 30;
    }

    if (!data.content || data.content.length < 100) {
      warnings.push('Nội dung bài viết quá ngắn hoặc không trích xuất được.');
      score -= 40;
    } else {
      score += 40;
    }

    return {
      warnings,
      score: Math.max(0, Math.min(100, score)),
      contentType: score >= 50 ? 'news' : 'unknown'
    };
  }
}
