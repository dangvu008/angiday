
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
}

interface ImportResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
}

export class ImportService {
  static async extractFromUrl(url: string, type: 'news' | 'recipe'): Promise<ImportResult> {
    try {
      console.log(`Extracting ${type} data from URL:`, url);
      
      // Validate URL
      if (!this.isValidUrl(url)) {
        throw new Error('URL không hợp lệ');
      }

      // Try to fetch the webpage content
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Không thể truy cập URL');
      }

      const data = await response.json();
      const htmlContent = data.contents;

      // Parse HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract data based on type
      const extractedData = type === 'news' 
        ? this.extractNewsData(doc, url)
        : this.extractRecipeData(doc, url);

      return {
        success: true,
        data: extractedData
      };

    } catch (error) {
      console.error('Error extracting data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
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
    // Extract title
    const title = this.extractTitle(doc);
    
    // Extract description
    const description = this.extractMetaDescription(doc);
    
    // Extract image
    const image = this.extractImage(doc, url);
    
    // Extract cooking time
    const cookingTime = this.extractCookingTime(doc);
    
    // Extract servings
    const servings = this.extractServings(doc);
    
    // Extract ingredients
    const ingredients = this.extractIngredients(doc);
    
    // Extract instructions
    const instructions = this.extractInstructions(doc);
    
    // Determine category
    const category = this.categorizeRecipe(title + ' ' + description);

    return {
      title,
      description,
      image,
      cookingTime: cookingTime || '30 phút',
      servings: servings || 2,
      ingredients,
      instructions,
      category,
      author: 'Admin'
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
    const selectors = [
      '[class*="author"]',
      '[rel="author"]',
      '.byline',
      '[class*="writer"]'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }

    return '';
  }

  private static extractMetaDescription(doc: Document): string {
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    return metaDesc || '';
  }

  private static extractCookingTime(doc: Document): string {
    const timeSelectors = [
      '[class*="time"]',
      '[class*="duration"]',
      '[class*="prep"]',
      '[class*="cook"]'
    ];

    for (const selector of timeSelectors) {
      const element = doc.querySelector(selector);
      const text = element?.textContent?.trim();
      if (text && /\d+\s*(phút|giờ|minute|hour)/i.test(text)) {
        return text;
      }
    }

    return '';
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
        const match = text.match(/\d+/);
        if (match) {
          return parseInt(match[0]);
        }
      }
    }

    return 0;
  }

  private static extractIngredients(doc: Document): string {
    const ingredientSelectors = [
      '[class*="ingredient"]',
      '.recipe-ingredients li',
      '.ingredients li',
      'ul li'
    ];

    for (const selector of ingredientSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        return Array.from(elements)
          .map(el => '- ' + el.textContent?.trim())
          .filter(text => text.length > 3)
          .join('\n');
      }
    }

    return '';
  }

  private static extractInstructions(doc: Document): string {
    const instructionSelectors = [
      '[class*="instruction"]',
      '[class*="method"]',
      '[class*="step"]',
      '.recipe-directions li',
      'ol li'
    ];

    for (const selector of instructionSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        return Array.from(elements)
          .map((el, index) => `Bước ${index + 1}: ${el.textContent?.trim()}`)
          .filter(text => text.length > 10)
          .join('\n\n');
      }
    }

    return '';
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
      'Món chính': ['thịt', 'cá', 'tôm', 'cơm', 'phở', 'bún', 'mì'],
      'Tráng miệng': ['bánh', 'kem', 'chè', 'trái cây', 'ngọt'],
      'Đồ uống': ['nước', 'sinh tố', 'trà', 'cà phê', 'cocktail'],
      'Món phụ': ['salad', 'canh', 'súp', 'khai vị']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return category;
      }
    }

    return 'Món chính';
  }

  private static resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }
}
