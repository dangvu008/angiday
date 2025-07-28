interface Recipe {
  id?: number;
  title: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  ingredients?: string;
  instructions?: string;
  description?: string;
  image?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
}

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class RecipeValidationService {
  // Character limits
  private static readonly LIMITS = {
    TITLE_MIN: 3,
    TITLE_MAX: 100,
    DESCRIPTION_MIN: 10,
    DESCRIPTION_MAX: 500,
    INGREDIENTS_MIN: 10,
    INGREDIENTS_MAX: 2000,
    INSTRUCTIONS_MIN: 20,
    INSTRUCTIONS_MAX: 5000,
    AUTHOR_MIN: 2,
    AUTHOR_MAX: 50,
    COOKING_TIME_MIN: 2,
    COOKING_TIME_MAX: 50,
    TAGS_MAX: 10,
    TAG_MAX_LENGTH: 30
  };

  /**
   * Validate complete recipe data
   */
  static validateRecipe(recipe: Recipe, existingRecipes: Recipe[] = []): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate title
    const titleValidation = this.validateTitle(recipe.title, existingRecipes, recipe.id);
    errors.push(...titleValidation.errors);
    warnings.push(...titleValidation.warnings);

    // Validate description
    const descriptionValidation = this.validateDescription(recipe.description);
    errors.push(...descriptionValidation.errors);
    warnings.push(...descriptionValidation.warnings);

    // Validate ingredients
    const ingredientsValidation = this.validateIngredients(recipe.ingredients);
    errors.push(...ingredientsValidation.errors);
    warnings.push(...ingredientsValidation.warnings);

    // Validate instructions
    const instructionsValidation = this.validateInstructions(recipe.instructions);
    errors.push(...instructionsValidation.errors);
    warnings.push(...instructionsValidation.warnings);

    // Validate other fields
    const otherValidation = this.validateOtherFields(recipe);
    errors.push(...otherValidation.errors);
    warnings.push(...otherValidation.warnings);

    // Check for duplicate content
    const duplicateValidation = this.checkDuplicateContent(recipe, existingRecipes);
    errors.push(...duplicateValidation.errors);
    warnings.push(...duplicateValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate title field
   */
  private static validateTitle(title: string, existingRecipes: Recipe[], currentId?: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!title || !title.trim()) {
      errors.push({
        field: 'title',
        message: 'Tên món ăn không được để trống',
        type: 'error'
      });
      return { isValid: false, errors, warnings };
    }

    const trimmedTitle = title.trim();

    // Check length
    if (trimmedTitle.length < this.LIMITS.TITLE_MIN) {
      errors.push({
        field: 'title',
        message: `Tên món ăn phải có ít nhất ${this.LIMITS.TITLE_MIN} ký tự`,
        type: 'error'
      });
    }

    if (trimmedTitle.length > this.LIMITS.TITLE_MAX) {
      errors.push({
        field: 'title',
        message: `Tên món ăn không được vượt quá ${this.LIMITS.TITLE_MAX} ký tự`,
        type: 'error'
      });
    }

    // Check for duplicate title
    const duplicateTitle = existingRecipes.find(recipe => 
      recipe.id !== currentId && 
      recipe.title.toLowerCase().trim() === trimmedTitle.toLowerCase()
    );

    if (duplicateTitle) {
      errors.push({
        field: 'title',
        message: 'Tên món ăn này đã tồn tại. Vui lòng chọn tên khác.',
        type: 'error'
      });
    }

    // Check for suspicious patterns
    if (trimmedTitle.toLowerCase().includes('untitled') || 
        trimmedTitle.toLowerCase().includes('chưa có tên') ||
        trimmedTitle.toLowerCase().includes('tiêu đề chưa xác định')) {
      warnings.push({
        field: 'title',
        message: 'Tên món ăn có vẻ chưa được đặt tên cụ thể',
        type: 'warning'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate description field
   */
  private static validateDescription(description?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!description || !description.trim()) {
      warnings.push({
        field: 'description',
        message: 'Nên thêm mô tả ngắn để người dùng hiểu rõ hơn về món ăn',
        type: 'warning'
      });
      return { isValid: true, errors, warnings };
    }

    const trimmedDescription = description.trim();

    // Check length
    if (trimmedDescription.length < this.LIMITS.DESCRIPTION_MIN) {
      warnings.push({
        field: 'description',
        message: `Mô tả nên có ít nhất ${this.LIMITS.DESCRIPTION_MIN} ký tự để cung cấp thông tin hữu ích`,
        type: 'warning'
      });
    }

    if (trimmedDescription.length > this.LIMITS.DESCRIPTION_MAX) {
      errors.push({
        field: 'description',
        message: `Mô tả không được vượt quá ${this.LIMITS.DESCRIPTION_MAX} ký tự`,
        type: 'error'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate ingredients field
   */
  private static validateIngredients(ingredients?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!ingredients || !ingredients.trim()) {
      errors.push({
        field: 'ingredients',
        message: 'Danh sách nguyên liệu không được để trống',
        type: 'error'
      });
      return { isValid: false, errors, warnings };
    }

    const trimmedIngredients = ingredients.trim();

    // Check length
    if (trimmedIngredients.length < this.LIMITS.INGREDIENTS_MIN) {
      errors.push({
        field: 'ingredients',
        message: `Danh sách nguyên liệu phải có ít nhất ${this.LIMITS.INGREDIENTS_MIN} ký tự`,
        type: 'error'
      });
    }

    if (trimmedIngredients.length > this.LIMITS.INGREDIENTS_MAX) {
      errors.push({
        field: 'ingredients',
        message: `Danh sách nguyên liệu không được vượt quá ${this.LIMITS.INGREDIENTS_MAX} ký tự`,
        type: 'error'
      });
    }

    // Check for minimum number of ingredients
    const ingredientLines = trimmedIngredients.split('\n').filter(line => line.trim());
    if (ingredientLines.length < 2) {
      warnings.push({
        field: 'ingredients',
        message: 'Nên có ít nhất 2 nguyên liệu để tạo thành một món ăn hoàn chỉnh',
        type: 'warning'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate instructions field
   */
  private static validateInstructions(instructions?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!instructions || !instructions.trim()) {
      errors.push({
        field: 'instructions',
        message: 'Hướng dẫn nấu ăn không được để trống',
        type: 'error'
      });
      return { isValid: false, errors, warnings };
    }

    const trimmedInstructions = instructions.trim();

    // Check length
    if (trimmedInstructions.length < this.LIMITS.INSTRUCTIONS_MIN) {
      errors.push({
        field: 'instructions',
        message: `Hướng dẫn nấu ăn phải có ít nhất ${this.LIMITS.INSTRUCTIONS_MIN} ký tự`,
        type: 'error'
      });
    }

    if (trimmedInstructions.length > this.LIMITS.INSTRUCTIONS_MAX) {
      errors.push({
        field: 'instructions',
        message: `Hướng dẫn nấu ăn không được vượt quá ${this.LIMITS.INSTRUCTIONS_MAX} ký tự`,
        type: 'error'
      });
    }

    // Check for minimum number of steps
    const instructionSteps = trimmedInstructions.split('\n').filter(line => line.trim());
    if (instructionSteps.length < 2) {
      warnings.push({
        field: 'instructions',
        message: 'Nên có ít nhất 2 bước để tạo thành hướng dẫn chi tiết',
        type: 'warning'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate image field
   */
  private static validateImage(image?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!image || !image.trim()) {
      warnings.push({
        field: 'image',
        message: 'Nên thêm hình ảnh để công thức hấp dẫn hơn',
        type: 'warning'
      });
      return { isValid: true, errors, warnings };
    }

    const trimmedImage = image.trim();

    // Validate URL format
    if (trimmedImage.startsWith('http')) {
      try {
        new URL(trimmedImage);
      } catch {
        errors.push({
          field: 'image',
          message: 'URL hình ảnh không hợp lệ',
          type: 'error'
        });
      }

      // Check common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const hasImageExtension = imageExtensions.some(ext =>
        trimmedImage.toLowerCase().includes(ext)
      );

      if (!hasImageExtension) {
        warnings.push({
          field: 'image',
          message: 'URL có vẻ không phải là hình ảnh. Đảm bảo link dẫn đến file ảnh',
          type: 'warning'
        });
      }
    } else if (trimmedImage.startsWith('data:image/')) {
      // Validate base64 image
      const sizeMatch = trimmedImage.match(/data:image\/[^;]+;base64,(.+)/);
      if (sizeMatch) {
        const base64Data = sizeMatch[1];
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 5) {
          warnings.push({
            field: 'image',
            message: `Hình ảnh khá lớn (${sizeInMB.toFixed(1)}MB). Cân nhắc tối ưu hóa để tải nhanh hơn`,
            type: 'warning'
          });
        }
      }
    } else {
      warnings.push({
        field: 'image',
        message: 'Định dạng hình ảnh không được nhận diện. Sử dụng URL hoặc upload file',
        type: 'warning'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate other fields
   */
  private static validateOtherFields(recipe: Recipe): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate image
    const imageValidation = this.validateImage(recipe.image);
    errors.push(...imageValidation.errors);
    warnings.push(...imageValidation.warnings);

    // Validate author
    if (!recipe.author || !recipe.author.trim()) {
      errors.push({
        field: 'author',
        message: 'Tên tác giả không được để trống',
        type: 'error'
      });
    } else {
      const trimmedAuthor = recipe.author.trim();
      if (trimmedAuthor.length < this.LIMITS.AUTHOR_MIN) {
        errors.push({
          field: 'author',
          message: `Tên tác giả phải có ít nhất ${this.LIMITS.AUTHOR_MIN} ký tự`,
          type: 'error'
        });
      }
      if (trimmedAuthor.length > this.LIMITS.AUTHOR_MAX) {
        errors.push({
          field: 'author',
          message: `Tên tác giả không được vượt quá ${this.LIMITS.AUTHOR_MAX} ký tự`,
          type: 'error'
        });
      }
    }

    // Validate cooking time
    if (!recipe.cookingTime || !recipe.cookingTime.trim()) {
      errors.push({
        field: 'cookingTime',
        message: 'Thời gian nấu không được để trống',
        type: 'error'
      });
    } else {
      const trimmedTime = recipe.cookingTime.trim();
      if (trimmedTime.length < this.LIMITS.COOKING_TIME_MIN) {
        errors.push({
          field: 'cookingTime',
          message: `Thời gian nấu phải có ít nhất ${this.LIMITS.COOKING_TIME_MIN} ký tự`,
          type: 'error'
        });
      }
      if (trimmedTime.length > this.LIMITS.COOKING_TIME_MAX) {
        errors.push({
          field: 'cookingTime',
          message: `Thời gian nấu không được vượt quá ${this.LIMITS.COOKING_TIME_MAX} ký tự`,
          type: 'error'
        });
      }
    }

    // Validate servings
    if (!recipe.servings || recipe.servings < 1) {
      errors.push({
        field: 'servings',
        message: 'Số khẩu phần phải lớn hơn 0',
        type: 'error'
      });
    } else if (recipe.servings > 100) {
      warnings.push({
        field: 'servings',
        message: 'Số khẩu phần có vẻ quá lớn. Bạn có chắc chắn không?',
        type: 'warning'
      });
    }

    // Validate nutritional values
    if (recipe.calories && (recipe.calories < 0 || recipe.calories > 5000)) {
      warnings.push({
        field: 'calories',
        message: 'Số calories có vẻ không hợp lý',
        type: 'warning'
      });
    }

    // Validate tags
    if (recipe.tags && recipe.tags.length > this.LIMITS.TAGS_MAX) {
      errors.push({
        field: 'tags',
        message: `Không được có quá ${this.LIMITS.TAGS_MAX} tags`,
        type: 'error'
      });
    }

    if (recipe.tags) {
      recipe.tags.forEach((tag, index) => {
        if (tag.length > this.LIMITS.TAG_MAX_LENGTH) {
          errors.push({
            field: 'tags',
            message: `Tag "${tag}" quá dài (tối đa ${this.LIMITS.TAG_MAX_LENGTH} ký tự)`,
            type: 'error'
          });
        }
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Check for duplicate content
   */
  private static checkDuplicateContent(recipe: Recipe, existingRecipes: Recipe[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check for similar ingredients
    if (recipe.ingredients) {
      const similarRecipe = existingRecipes.find(existing => 
        existing.id !== recipe.id &&
        existing.ingredients &&
        this.calculateSimilarity(recipe.ingredients, existing.ingredients) > 0.8
      );

      if (similarRecipe) {
        warnings.push({
          field: 'ingredients',
          message: `Nguyên liệu tương tự với công thức "${similarRecipe.title}"`,
          type: 'warning'
        });
      }
    }

    // Check for similar instructions
    if (recipe.instructions) {
      const similarRecipe = existingRecipes.find(existing => 
        existing.id !== recipe.id &&
        existing.instructions &&
        this.calculateSimilarity(recipe.instructions, existing.instructions) > 0.8
      );

      if (similarRecipe) {
        warnings.push({
          field: 'instructions',
          message: `Hướng dẫn tương tự với công thức "${similarRecipe.title}"`,
          type: 'warning'
        });
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Calculate text similarity (simple implementation)
   */
  private static calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * Get character count for a field
   */
  static getCharacterCount(text: string): number {
    return text ? text.length : 0;
  }

  /**
   * Get character limit for a field
   */
  static getCharacterLimit(field: string): { min: number; max: number } | null {
    switch (field) {
      case 'title':
        return { min: this.LIMITS.TITLE_MIN, max: this.LIMITS.TITLE_MAX };
      case 'description':
        return { min: this.LIMITS.DESCRIPTION_MIN, max: this.LIMITS.DESCRIPTION_MAX };
      case 'ingredients':
        return { min: this.LIMITS.INGREDIENTS_MIN, max: this.LIMITS.INGREDIENTS_MAX };
      case 'instructions':
        return { min: this.LIMITS.INSTRUCTIONS_MIN, max: this.LIMITS.INSTRUCTIONS_MAX };
      case 'author':
        return { min: this.LIMITS.AUTHOR_MIN, max: this.LIMITS.AUTHOR_MAX };
      case 'cookingTime':
        return { min: this.LIMITS.COOKING_TIME_MIN, max: this.LIMITS.COOKING_TIME_MAX };
      default:
        return null;
    }
  }
}
