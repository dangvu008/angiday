import { 
  MealTemplate, 
  DayPlanTemplate, 
  LibrarySearchFilters, 
  LibrarySortOptions,
  TemplateLibrary 
} from '@/types/meal-planning';

/**
 * Service quản lý thư viện templates với tính năng tìm kiếm và lọc
 */
class TemplateLibraryService {
  private readonly STORAGE_KEYS = {
    MEAL_TEMPLATES: 'template_library_meal_templates',
    DAY_PLAN_TEMPLATES: 'template_library_day_plan_templates',
    USER_TEMPLATES: 'template_library_user_templates'
  };

  // ===== MEAL TEMPLATES =====

  /**
   * Lấy tất cả meal templates
   */
  async getMealTemplates(): Promise<MealTemplate[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.MEAL_TEMPLATES);
    const userStored = localStorage.getItem(this.STORAGE_KEYS.USER_TEMPLATES);
    
    const publicTemplates = stored ? JSON.parse(stored) : this.getDefaultMealTemplates();
    const userTemplates = userStored ? JSON.parse(userStored).mealTemplates || [] : [];
    
    return [...publicTemplates, ...userTemplates];
  }

  /**
   * Tìm kiếm và lọc meal templates
   */
  async searchMealTemplates(filters: LibrarySearchFilters, sort?: LibrarySortOptions): Promise<MealTemplate[]> {
    let templates = await this.getMealTemplates();

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.type && filters.type !== 'day-plan') {
      templates = templates.filter(template => template.type === filters.type);
    }

    if (filters.difficulty) {
      templates = templates.filter(template => template.difficulty === filters.difficulty);
    }

    if (filters.maxCalories) {
      templates = templates.filter(template => template.totalCalories <= filters.maxCalories);
    }

    if (filters.maxCost) {
      templates = templates.filter(template => template.totalCost <= filters.maxCost);
    }

    if (filters.maxCookingTime) {
      templates = templates.filter(template => template.cookingTime <= filters.maxCookingTime);
    }

    if (filters.tags && filters.tags.length > 0) {
      templates = templates.filter(template => 
        filters.tags!.some(tag => template.tags.includes(tag))
      );
    }

    if (filters.category) {
      templates = templates.filter(template => template.category === filters.category);
    }

    if (filters.cuisine) {
      templates = templates.filter(template => template.cuisine === filters.cuisine);
    }

    if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      templates = templates.filter(template => 
        filters.dietaryRestrictions!.every(restriction => 
          template.tags.includes(restriction)
        )
      );
    }

    if (filters.rating) {
      templates = templates.filter(template => template.rating >= filters.rating!);
    }

    // Apply sorting
    if (sort) {
      templates.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sort.field) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'calories':
            aValue = a.totalCalories;
            bValue = b.totalCalories;
            break;
          case 'cost':
            aValue = a.totalCost;
            bValue = b.totalCost;
            break;
          case 'cookingTime':
            aValue = a.cookingTime;
            bValue = b.cookingTime;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'usageCount':
            aValue = a.usageCount;
            bValue = b.usageCount;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return templates;
  }

  /**
   * Lưu meal template mới
   */
  async saveMealTemplate(template: MealTemplate): Promise<void> {
    const userTemplates = await this.getUserTemplates();
    
    const existingIndex = userTemplates.mealTemplates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      userTemplates.mealTemplates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      userTemplates.mealTemplates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    localStorage.setItem(this.STORAGE_KEYS.USER_TEMPLATES, JSON.stringify(userTemplates));
  }

  /**
   * Xóa meal template
   */
  async deleteMealTemplate(templateId: string): Promise<void> {
    const userTemplates = await this.getUserTemplates();
    userTemplates.mealTemplates = userTemplates.mealTemplates.filter(t => t.id !== templateId);
    localStorage.setItem(this.STORAGE_KEYS.USER_TEMPLATES, JSON.stringify(userTemplates));
  }

  // ===== DAY PLAN TEMPLATES =====

  /**
   * Lấy tất cả day plan templates
   */
  async getDayPlanTemplates(): Promise<DayPlanTemplate[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.DAY_PLAN_TEMPLATES);
    const userStored = localStorage.getItem(this.STORAGE_KEYS.USER_TEMPLATES);
    
    const publicTemplates = stored ? JSON.parse(stored) : this.getDefaultDayPlanTemplates();
    const userTemplates = userStored ? JSON.parse(userStored).dayPlanTemplates || [] : [];
    
    return [...publicTemplates, ...userTemplates];
  }

  /**
   * Tìm kiếm day plan templates
   */
  async searchDayPlanTemplates(filters: LibrarySearchFilters, sort?: LibrarySortOptions): Promise<DayPlanTemplate[]> {
    let templates = await this.getDayPlanTemplates();

    // Apply similar filters as meal templates
    if (filters.query) {
      const query = filters.query.toLowerCase();
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.difficulty) {
      templates = templates.filter(template => template.difficulty === filters.difficulty);
    }

    if (filters.maxCalories) {
      templates = templates.filter(template => template.totalCalories <= filters.maxCalories);
    }

    if (filters.maxCost) {
      templates = templates.filter(template => template.totalCost <= filters.maxCost);
    }

    // Apply sorting similar to meal templates
    if (sort) {
      templates.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sort.field) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'calories':
            aValue = a.totalCalories;
            bValue = b.totalCalories;
            break;
          case 'cost':
            aValue = a.totalCost;
            bValue = b.totalCost;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'usageCount':
            aValue = a.usageCount;
            bValue = b.usageCount;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return templates;
  }

  /**
   * Lưu day plan template
   */
  async saveDayPlanTemplate(template: DayPlanTemplate): Promise<void> {
    const userTemplates = await this.getUserTemplates();
    
    const existingIndex = userTemplates.dayPlanTemplates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      userTemplates.dayPlanTemplates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      userTemplates.dayPlanTemplates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    localStorage.setItem(this.STORAGE_KEYS.USER_TEMPLATES, JSON.stringify(userTemplates));
  }

  // ===== HELPER METHODS =====

  private async getUserTemplates(): Promise<{ mealTemplates: MealTemplate[]; dayPlanTemplates: DayPlanTemplate[] }> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.USER_TEMPLATES);
    return stored ? JSON.parse(stored) : { mealTemplates: [], dayPlanTemplates: [] };
  }

  private getDefaultMealTemplates(): MealTemplate[] {
    // Return some default meal templates
    return [];
  }

  private getDefaultDayPlanTemplates(): DayPlanTemplate[] {
    // Return some default day plan templates
    return [];
  }

  /**
   * Tăng usage count khi template được sử dụng
   */
  async incrementUsageCount(templateId: string, type: 'meal' | 'day-plan'): Promise<void> {
    const userTemplates = await this.getUserTemplates();
    
    if (type === 'meal') {
      const template = userTemplates.mealTemplates.find(t => t.id === templateId);
      if (template) {
        template.usageCount = (template.usageCount || 0) + 1;
      }
    } else {
      const template = userTemplates.dayPlanTemplates.find(t => t.id === templateId);
      if (template) {
        template.usageCount = (template.usageCount || 0) + 1;
      }
    }

    localStorage.setItem(this.STORAGE_KEYS.USER_TEMPLATES, JSON.stringify(userTemplates));
  }
}

export const templateLibraryService = new TemplateLibraryService();
