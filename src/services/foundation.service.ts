// @ts-nocheck
// ============================================================================
// FOUNDATION SERVICE - Core business logic for meal planning system
// Implements: Menu/Plan separation, Event multiplier, Eating out, Filters
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
import type {
  MenuTemplate,
  AppliedMealPlan,
  MealEvent,
  CreateMealEventInput,
  FavoriteRestaurant,
  EatingOutMeal,
  UserDietaryProfile,
  FilterConstraints,
  RecommendationScore,
  RestaurantRandomizerOptions,
} from '@/types/foundation';

// ============================================================================
// 1. MENU TEMPLATES (Static Templates)
// ============================================================================

export class MenuTemplateService {
  /**
   * Get all public menu templates (for browsing)
   */
  static async getPublicMenuTemplates(filters?: {
    type?: string;
    difficulty?: string;
    maxCost?: number;
    tags?: string[];
  }): Promise<MenuTemplate[]> {
    let query = supabase
      .from('menu_templates')
      .select('*')
      .eq('is_public', true)
      .eq('is_template', true)
      .order('usage_count', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.maxCost) {
      query = query.lte('total_cost', filters.maxCost);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as MenuTemplate[];
  }

  /**
   * Get menu template by ID
   */
  static async getMenuTemplateById(id: string): Promise<MenuTemplate | null> {
    const { data, error } = await supabase
      .from('menu_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as MenuTemplate | null;
  }

  /**
   * Create new menu template
   */
  static async createMenuTemplate(
    template: Omit<MenuTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
  ): Promise<MenuTemplate> {
    const { data, error } = await supabase
      .from('menu_templates')
      .insert({
        ...template,
        is_template: true,
        usage_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as MenuTemplate;
  }

  /**
   * Search menu templates with hard constraints
   */
  static async searchMenuTemplates(
    query: string,
    constraints: FilterConstraints
  ): Promise<MenuTemplate[]> {
    // First, get all templates
    const { data, error } = await supabase
      .from('menu_templates')
      .select('*')
      .eq('is_public', true)
      .textSearch('name', query);

    if (error) throw error;

    // Apply hard constraints filtering
    return (data as MenuTemplate[]).filter(template => 
      this.passesHardConstraints(template, constraints.hard)
    );
  }

  /**
   * Check if menu passes hard constraints
   */
  private static passesHardConstraints(
    template: MenuTemplate,
    hard: FilterConstraints['hard']
  ): boolean {
    // Check allergies
    if (hard.allergies.length > 0) {
      const hasAllergen = template.allergens.some(allergen =>
        hard.allergies.includes(allergen)
      );
      if (hasAllergen) return false;
    }

    // Check dietary restrictions
    if (hard.dietary_restrictions.length > 0) {
      const matchesRestriction = hard.dietary_restrictions.every(restriction =>
        template.dietary_restrictions.includes(restriction)
      );
      if (!matchesRestriction) return false;
    }

    return true;
  }
}

// ============================================================================
// 2. APPLIED PLANS (Personal Calendar)
// ============================================================================

export class AppliedPlanService {
  /**
   * Apply menu template to personal calendar
   */
  static async applyMenuToCalendar(
    userId: string,
    menuId: string,
    applyDate: string,
    customServings?: number
  ): Promise<AppliedMealPlan> {
    // Get menu template
    const menu = await MenuTemplateService.getMenuTemplateById(menuId);
    if (!menu) throw new Error('Menu template not found');

    // Create applied plan
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        name: menu.name,
        description: menu.description,
        source_menu_id: menuId,
        applied_date: applyDate,
        start_date: applyDate,
        end_date: applyDate,
        base_serving_size: customServings || menu.base_serving_size,
        is_active: true,
        is_template: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment usage count
    await supabase.rpc('increment', {
      table_name: 'menu_templates',
      row_id: menuId,
      column_name: 'usage_count',
    });

    return data as AppliedMealPlan;
  }

  /**
   * Get active plan for today
   */
  static async getActivePlanForToday(userId: string): Promise<AppliedMealPlan | null> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .lte('start_date', today)
      .gte('end_date', today)
      .maybeSingle();

    if (error) throw error;
    return data as AppliedMealPlan | null;
  }

  /**
   * Get all plans for user
   */
  static async getUserPlans(userId: string): Promise<AppliedMealPlan[]> {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_template', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AppliedMealPlan[];
  }
}

// ============================================================================
// 3. EVENT MULTIPLIER SYSTEM
// ============================================================================

export class MealEventService {
  /**
   * Create meal event (party, gathering, etc.)
   * THE KEY FEATURE: Auto-calculates multiplier
   */
  static async createMealEvent(input: CreateMealEventInput): Promise<MealEvent> {
    const { data, error } = await supabase
      .from('meal_events')
      .insert({
        meal_plan_id: input.meal_plan_id,
        event_name: input.event_name,
        event_type: input.event_type,
        event_date: input.event_date,
        meal_type: input.meal_type,
        total_guests: input.total_guests,
        base_serving_size: input.base_serving_size,
        manual_multiplier: input.manual_multiplier,
        notes: input.notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Calculate estimated cost
    const estimatedCost = await this.calculateEventCost(data.id);
    
    // Update with cost
    const { data: updated, error: updateError } = await supabase
      .from('meal_events')
      .update({ estimated_total_cost: estimatedCost })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return updated as MealEvent;
  }

  /**
   * Calculate event cost using stored procedure
   */
  static async calculateEventCost(eventId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_event_cost', {
      event_id: eventId,
    });

    if (error) throw error;
    return data as number;
  }

  /**
   * Get event for meal
   */
  static async getEventForMeal(
    mealPlanId: string,
    mealDate: string,
    mealType: string
  ): Promise<MealEvent | null> {
    const { data, error } = await supabase
      .from('meal_events')
      .select('*')
      .eq('meal_plan_id', mealPlanId)
      .eq('event_date', mealDate)
      .eq('meal_type', mealType)
      .maybeSingle();

    if (error) throw error;
    return data as MealEvent | null;
  }

  /**
   * Update actual cost after shopping
   */
  static async updateActualCost(eventId: string, actualCost: number): Promise<void> {
    const { error } = await supabase
      .from('meal_events')
      .update({ actual_total_cost: actualCost })
      .eq('id', eventId);

    if (error) throw error;
  }
}

// ============================================================================
// 4. EATING OUT SYSTEM
// ============================================================================

export class EatingOutService {
  /**
   * Add favorite restaurant
   */
  static async addFavoriteRestaurant(
    userId: string,
    restaurant: Omit<FavoriteRestaurant, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'visit_count'>
  ): Promise<FavoriteRestaurant> {
    const { data, error } = await supabase
      .from('favorite_restaurants')
      .insert({
        user_id: userId,
        ...restaurant,
        visit_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as FavoriteRestaurant;
  }

  /**
   * Get all favorite restaurants for user
   */
  static async getFavoriteRestaurants(userId: string): Promise<FavoriteRestaurant[]> {
    const { data, error } = await supabase
      .from('favorite_restaurants')
      .select('*')
      .eq('user_id', userId)
      .order('personal_rating', { ascending: false });

    if (error) throw error;
    return data as FavoriteRestaurant[];
  }

  /**
   * Random restaurant picker (THE RANDOMIZER)
   */
  static async getRandomRestaurant(
    userId: string,
    options?: RestaurantRandomizerOptions
  ): Promise<FavoriteRestaurant | null> {
    let query = supabase
      .from('favorite_restaurants')
      .select('*')
      .eq('user_id', userId);

    // Apply filters
    if (options?.exclude_ids && options.exclude_ids.length > 0) {
      query = query.not('id', 'in', `(${options.exclude_ids.join(',')})`);
    }
    if (options?.cuisine_type) {
      query = query.eq('cuisine_type', options.cuisine_type);
    }
    if (options?.max_cost) {
      query = query.lte('avg_cost_per_person', options.max_cost);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Pick random
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex] as FavoriteRestaurant;
  }

  /**
   * Add eating out to meal plan
   */
  static async addEatingOutToMealPlan(
    mealPlanId: string,
    restaurantId: string | null,
    mealDate: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    numberOfPeople: number,
    restaurantName?: string
  ): Promise<EatingOutMeal> {
    // Get restaurant info if exists
    let estimatedCost = 0;
    let estimatedCalories = 0;

    if (restaurantId) {
      const { data } = await supabase
        .from('favorite_restaurants')
        .select('avg_cost_per_person, estimated_calories_per_meal')
        .eq('id', restaurantId)
        .single();

      if (data) {
        estimatedCost = (data.avg_cost_per_person || 0) * numberOfPeople;
        estimatedCalories = data.estimated_calories_per_meal || 0;
      }
    }

    const { data, error } = await supabase
      .from('eating_out_meals')
      .insert({
        meal_plan_id: mealPlanId,
        restaurant_id: restaurantId,
        meal_date: mealDate,
        meal_type: mealType,
        restaurant_name: restaurantName,
        number_of_people: numberOfPeople,
        estimated_cost: estimatedCost,
        estimated_calories: estimatedCalories,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment visit count if restaurant exists
    if (restaurantId) {
      await supabase.rpc('increment', {
        table_name: 'favorite_restaurants',
        row_id: restaurantId,
        column_name: 'visit_count',
      });
    }

    return data as EatingOutMeal;
  }

  /**
   * Update actual cost after eating out
   */
  static async updateEatingOutActualCost(
    eatingOutId: string,
    actualCost: number
  ): Promise<void> {
    const { error } = await supabase
      .from('eating_out_meals')
      .update({ actual_cost: actualCost })
      .eq('id', eatingOutId);

    if (error) throw error;
  }
}

// ============================================================================
// 5. USER DIETARY PROFILE & CONSTRAINTS
// ============================================================================

export class UserProfileService {
  /**
   * Get or create user dietary profile
   */
  static async getUserProfile(userId: string): Promise<UserDietaryProfile> {
    const { data, error } = await supabase
      .from('user_dietary_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    // Create default if doesn't exist
    if (!data) {
      return await this.createDefaultProfile(userId);
    }

    return data as UserDietaryProfile;
  }

  /**
   * Create default profile
   */
  private static async createDefaultProfile(userId: string): Promise<UserDietaryProfile> {
    const { data, error } = await supabase
      .from('user_dietary_profile')
      .insert({
        user_id: userId,
        allergies: [],
        religious_restrictions: [],
        health_restrictions: [],
        dietary_type: 'omnivore',
        disliked_ingredients: [],
        preferred_cuisines: [],
        family_size: 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserDietaryProfile;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserDietaryProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<UserDietaryProfile> {
    const { data, error } = await supabase
      .from('user_dietary_profile')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserDietaryProfile;
  }

  /**
   * Get filter constraints from user profile
   */
  static async getFilterConstraints(userId: string): Promise<FilterConstraints> {
    const profile = await this.getUserProfile(userId);

    return {
      hard: {
        allergies: profile.allergies,
        dietary_restrictions: profile.dietary_type === 'vegetarian' ? ['vegetarian'] : [],
        religious_restrictions: profile.religious_restrictions,
        health_restrictions: profile.health_restrictions,
      },
      soft: {
        max_cooking_time: profile.max_cooking_time,
        max_cost_per_meal: profile.daily_budget_limit ? profile.daily_budget_limit / 3 : undefined,
        preferred_cuisines: profile.preferred_cuisines,
        disliked_ingredients: profile.disliked_ingredients,
        target_calories: profile.daily_calorie_target,
      },
    };
  }
}

// ============================================================================
// EXPORT ALL SERVICES
// ============================================================================
