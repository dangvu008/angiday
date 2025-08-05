import {
  CookingRecipe,
  CookingStep,
  OptimizedCookingTimeline,
  OptimizedStep,
  CookingTimer
} from '@/types/cookingMode';

// Utility để tối ưu hóa thứ tự nấu nhiều món
export class CookingOptimizer {
  
  /**
   * Tạo timeline tối ưu cho nhiều món ăn
   */
  static createOptimizedTimeline(recipes: CookingRecipe[], mealName: string): OptimizedCookingTimeline {
    const optimizedSteps: OptimizedStep[] = [];
    let stepCounter = 1;

    // Phân tích tất cả các bước và thời gian
    const recipeAnalysis = recipes.map(recipe => ({
      recipe,
      totalTime: recipe.totalTime,
      prepSteps: recipe.steps.filter(step => this.isPreparationStep(step.instruction)),
      cookingSteps: recipe.steps.filter(step => this.isCookingStep(step.instruction)),
      waitingSteps: recipe.steps.filter(step => this.isWaitingStep(step.instruction)),
      finishingSteps: recipe.steps.filter(step => this.isFinishingStep(step.instruction))
    }));

    // Sắp xếp theo thời gian nấu (món lâu nhất trước)
    const sortedRecipes = recipeAnalysis.sort((a, b) => b.totalTime - a.totalTime);

    // Bước 1: Tổng hợp tất cả công việc chuẩn bị
    const allPrepWork = this.consolidatePreparationSteps(sortedRecipes);
    if (allPrepWork.length > 0) {
      optimizedSteps.push({
        id: `prep-consolidated`,
        stepNumber: stepCounter++,
        recipeId: 'all',
        recipeName: 'Chuẩn bị chung',
        instruction: allPrepWork.join(' '),
        ingredients: this.getAllIngredients(recipes),
        category: 'prep',
        estimatedTime: 15,
        isParallel: false
      });
    }

    // Bước 2: Bắt đầu với món cần thời gian lâu nhất
    const longestRecipe = sortedRecipes[0];
    const longestCookingSteps = this.convertToOptimizedSteps(
      longestRecipe.recipe,
      longestRecipe.cookingSteps,
      stepCounter
    );
    optimizedSteps.push(...longestCookingSteps);
    stepCounter += longestCookingSteps.length;

    // Bước 3: Xen kẽ các món khác trong thời gian chờ
    for (let i = 1; i < sortedRecipes.length; i++) {
      const recipe = sortedRecipes[i];
      const insertionPoint = this.findOptimalInsertionPoint(optimizedSteps, recipe.totalTime);
      
      const recipeSteps = this.convertToOptimizedSteps(
        recipe.recipe,
        recipe.cookingSteps,
        stepCounter,
        true // Đánh dấu là có thể làm song song
      );
      
      // Chèn các bước vào vị trí tối ưu
      optimizedSteps.splice(insertionPoint, 0, ...recipeSteps);
      stepCounter += recipeSteps.length;
    }

    // Bước 4: Thêm các bước hoàn thiện cuối cùng
    const finishingSteps = this.createFinishingSteps(sortedRecipes, stepCounter);
    optimizedSteps.push(...finishingSteps);

    // Tính tổng thời gian ước tính
    const totalEstimatedTime = optimizedSteps.reduce((total, step) => total + step.estimatedTime, 0);

    return {
      id: `timeline-${Date.now()}`,
      name: mealName,
      recipes,
      optimizedSteps: this.renumberSteps(optimizedSteps),
      totalEstimatedTime,
      createdAt: new Date()
    };
  }

  /**
   * Chuyển đổi recipe thành single cooking timeline
   */
  static createSingleRecipeTimeline(recipe: CookingRecipe): OptimizedCookingTimeline {
    const optimizedSteps: OptimizedStep[] = recipe.steps.map((step, index) => ({
      id: `${recipe.id}-step-${index + 1}`,
      stepNumber: index + 1,
      recipeId: recipe.id,
      recipeName: recipe.name,
      instruction: step.instruction,
      ingredients: step.ingredients,
      timers: step.timers,
      category: this.categorizeStep(step.instruction),
      estimatedTime: step.estimatedTime || 5,
      isParallel: false
    }));

    return {
      id: `single-${recipe.id}-${Date.now()}`,
      name: recipe.name,
      recipes: [recipe],
      optimizedSteps,
      totalEstimatedTime: recipe.totalTime,
      createdAt: new Date()
    };
  }

  // Helper methods
  private static isPreparationStep(instruction: string): boolean {
    const prepKeywords = ['thái', 'cắt', 'rửa', 'gọt', 'băm', 'ướp', 'chuẩn bị', 'sơ chế'];
    return prepKeywords.some(keyword => instruction.toLowerCase().includes(keyword));
  }

  private static isCookingStep(instruction: string): boolean {
    const cookingKeywords = ['nấu', 'xào', 'chiên', 'luộc', 'hầm', 'kho', 'nướng', 'phi'];
    return cookingKeywords.some(keyword => instruction.toLowerCase().includes(keyword));
  }

  private static isWaitingStep(instruction: string): boolean {
    const waitingKeywords = ['chờ', 'để', 'ủ', 'nghỉ', 'phút', 'giờ'];
    return waitingKeywords.some(keyword => instruction.toLowerCase().includes(keyword));
  }

  private static isFinishingStep(instruction: string): boolean {
    const finishingKeywords = ['múc', 'dọn', 'trang trí', 'rắc', 'hoàn thành'];
    return finishingKeywords.some(keyword => instruction.toLowerCase().includes(keyword));
  }

  private static categorizeStep(instruction: string): 'prep' | 'cooking' | 'waiting' | 'finishing' {
    if (this.isPreparationStep(instruction)) return 'prep';
    if (this.isCookingStep(instruction)) return 'cooking';
    if (this.isWaitingStep(instruction)) return 'waiting';
    if (this.isFinishingStep(instruction)) return 'finishing';
    return 'cooking'; // Default
  }

  private static consolidatePreparationSteps(recipeAnalysis: any[]): string[] {
    const prepInstructions: string[] = [];
    
    recipeAnalysis.forEach(({ recipe, prepSteps }) => {
      if (prepSteps.length > 0) {
        prepInstructions.push(`${recipe.name}: ${prepSteps.map(s => s.instruction).join(', ')}.`);
      }
    });

    if (prepInstructions.length > 0) {
      prepInstructions.unshift('Chuẩn bị tất cả nguyên liệu:');
    }

    return prepInstructions;
  }

  private static getAllIngredients(recipes: CookingRecipe[]): string[] {
    const allIngredients = new Set<string>();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient));
    });
    return Array.from(allIngredients);
  }

  private static convertToOptimizedSteps(
    recipe: CookingRecipe,
    steps: CookingStep[],
    startingStepNumber: number,
    isParallel: boolean = false
  ): OptimizedStep[] {
    return steps.map((step, index) => ({
      id: `${recipe.id}-step-${step.stepNumber}`,
      stepNumber: startingStepNumber + index,
      recipeId: recipe.id,
      recipeName: recipe.name,
      instruction: step.instruction,
      ingredients: step.ingredients,
      timers: step.timers,
      category: this.categorizeStep(step.instruction),
      estimatedTime: step.estimatedTime || 5,
      isParallel
    }));
  }

  private static findOptimalInsertionPoint(existingSteps: OptimizedStep[], recipeTime: number): number {
    // Tìm vị trí tốt nhất để chèn món mới (thường là sau các bước chờ đợi)
    for (let i = 0; i < existingSteps.length; i++) {
      if (existingSteps[i].category === 'waiting') {
        return i + 1;
      }
    }
    return Math.floor(existingSteps.length / 2); // Fallback: chèn vào giữa
  }

  private static createFinishingSteps(recipeAnalysis: any[], startingStepNumber: number): OptimizedStep[] {
    const finishingSteps: OptimizedStep[] = [];
    let stepNumber = startingStepNumber;

    recipeAnalysis.forEach(({ recipe, finishingSteps: steps }) => {
      if (steps.length > 0) {
        const optimizedSteps = this.convertToOptimizedSteps(recipe, steps, stepNumber);
        finishingSteps.push(...optimizedSteps);
        stepNumber += optimizedSteps.length;
      }
    });

    // Thêm bước hoàn thành chung
    finishingSteps.push({
      id: 'final-completion',
      stepNumber: stepNumber,
      recipeId: 'all',
      recipeName: 'Hoàn thành',
      instruction: 'Kiểm tra tất cả các món, nêm nếm lần cuối và dọn ra đĩa. Chúc bạn ngon miệng! 🍽️',
      category: 'finishing',
      estimatedTime: 5,
      isParallel: false
    });

    return finishingSteps;
  }

  private static renumberSteps(steps: OptimizedStep[]): OptimizedStep[] {
    return steps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
  }

  /**
   * Tạo timer từ instruction text
   */
  static extractTimersFromInstruction(instruction: string, stepId: string): CookingTimer[] {
    const timers: CookingTimer[] = [];
    
    // Regex để tìm thời gian trong instruction
    const timeRegex = /(\d+)\s*(phút|giờ|minute|hour)/gi;
    let match;
    let timerIndex = 0;

    while ((match = timeRegex.exec(instruction)) !== null) {
      const duration = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      const durationInSeconds = unit.includes('giờ') || unit.includes('hour') 
        ? duration * 3600 
        : duration * 60;

      timers.push({
        id: `${stepId}-timer-${timerIndex++}`,
        name: `Timer ${duration} ${unit}`,
        duration: durationInSeconds,
        remainingTime: durationInSeconds,
        isActive: false,
        soundAlert: true,
        vibrationAlert: true
      });
    }

    return timers;
  }

  /**
   * Tạo instruction với timer buttons
   */
  static enhanceInstructionWithTimers(instruction: string, stepId: string): { 
    enhancedInstruction: string; 
    timers: CookingTimer[] 
  } {
    const timers = this.extractTimersFromInstruction(instruction, stepId);
    let enhancedInstruction = instruction;

    timers.forEach((timer, index) => {
      const timeRegex = new RegExp(`(\\d+)\\s*(phút|giờ)`, 'i');
      enhancedInstruction = enhancedInstruction.replace(timeRegex, `[TIMER:${timer.id}:$1 $2]`);
    });

    return { enhancedInstruction, timers };
  }
}
