// ============================================================================
// FOUNDATION TYPES - Core data structures for meal planning system
// Matches: supabase-foundation-migration.sql
// ============================================================================

// ============================================================================
// 1. UNIT STANDARDIZATION
// ============================================================================

export type StandardUnit = 'g' | 'kg' | 'ml' | 'l';
export type DisplayUnit = 'quả' | 'tép' | 'muỗng' | 'chai' | 'gói' | 'hộp' | 'củ' | 'bó' | 'cây';

export interface IngredientWithUnits {
  name: string;
  quantity: number;
  
  // Dual-unit system
  standardUnit: StandardUnit; // For calculations
  displayUnit?: DisplayUnit | string; // For display only
  isStandardized: boolean; // true if using standardUnit, false if display-only
  
  // Optional
  notes?: string;
}

// ============================================================================
// 2. RECIPE WITH BASE SERVING SIZE
// ============================================================================

export interface RecipeFoundation {
  id: string;
  title: string;
  description?: string;
  image?: string;
  
  // NEW: Base serving standardization
  base_serving_size: number; // Khẩu phần gốc (e.g., 4 người)
  serving_unit: string; // e.g., "người", "phần"
  use_standard_units: boolean;
  
  // Ingredients with dual-unit system
  ingredients: IngredientWithUnits[];
  instructions: string[];
  
  // Time
  prep_time: number; // minutes
  cook_time: number;
  
  // Basic info
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  cuisine?: string;
  
  // Nutrition (per base_serving_size)
  nutrition: {
    calories: number;
    protein: number; // grams
    carbs: number;
    fat: number;
    fiber: number;
  };
  
  // Cost (per base_serving_size)
  cost?: number; // VND
  
  // Metadata
  tags: string[];
  rating?: number;
  views?: number;
  
  // Permissions
  is_public: boolean;
  created_by?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 3. MENU TEMPLATES (Static, Reusable)
// ============================================================================

export interface MenuTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'full_day' | 'week' | 'custom';
  
  // Recipe composition
  recipe_ids: string[]; // Array of recipe UUIDs
  
  // Base metrics (calculated from recipes)
  base_serving_size: number; // Khẩu phần gốc của menu
  total_calories: number;
  total_cost: number;
  total_cooking_time: number; // minutes
  
  // Nutrition (auto-calculated from recipes)
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  
  // Metadata
  tags: string[];
  category?: string;
  cuisine?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  season?: string;
  target_audience: string[]; // ['family', 'single', 'couple', 'kids']
  
  // HARD CONSTRAINTS (must filter out)
  dietary_restrictions: string[]; // ['vegetarian', 'vegan', 'halal', 'kosher']
  allergens: string[]; // ['peanut', 'seafood', 'dairy']
  
  // Permissions
  is_public: boolean;
  is_template: boolean; // Always true
  created_by: string;
  created_by_name?: string;
  
  // Usage tracking
  usage_count: number;
  rating: number;
  reviews: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 4. APPLIED PLANS (Personal Calendar Instances)
// ============================================================================

export interface AppliedMealPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  
  // Link to template
  source_menu_id?: string; // Reference to MenuTemplate
  
  // Application details
  applied_date: string; // YYYY-MM-DD
  start_date: string;
  end_date: string;
  
  // Serving info (can be different from source template)
  base_serving_size: number;
  
  // Status
  is_active: boolean;
  is_template: boolean; // Always false for applied plans
  
  // Settings
  settings: Record<string, any>;
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 5. EVENT MULTIPLIER SYSTEM
// ============================================================================

export interface MealEvent {
  id: string;
  meal_plan_id: string;
  
  // Event details
  event_name: string;
  event_type: 'party' | 'gathering' | 'celebration' | 'normal';
  event_date: string; // YYYY-MM-DD
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  // THE KEY FEATURE: Auto-calculated multiplier
  total_guests: number; // e.g., 12 người
  base_serving_size: number; // e.g., 4 người (from recipe/menu)
  calculated_multiplier: number; // Auto: 12/4 = 3x
  
  // Optional manual override
  manual_multiplier?: number;
  effective_multiplier: number; // Uses manual if set, else calculated
  
  // Budget
  estimated_total_cost?: number;
  actual_total_cost?: number;
  
  // Notes
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Helper to create event
export interface CreateMealEventInput {
  meal_plan_id: string;
  event_name: string;
  event_type: 'party' | 'gathering' | 'celebration' | 'normal';
  event_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  total_guests: number; // User input: "Có bao nhiêu người ăn?"
  base_serving_size: number; // From recipe/menu
  manual_multiplier?: number; // Optional override
  notes?: string;
}

// ============================================================================
// 6. EATING OUT SYSTEM
// ============================================================================

export interface FavoriteRestaurant {
  id: string;
  user_id: string;
  
  // Restaurant info
  name: string;
  address?: string;
  phone?: string;
  cuisine_type?: string;
  
  // Estimated metrics (for budget/calorie continuity)
  avg_cost_per_person?: number; // VND
  estimated_calories_per_meal?: number;
  
  // Dietary info (for filtering)
  dietary_tags: string[]; // ['vegetarian', 'halal', 'seafood']
  allergen_warnings: string[];
  
  // Personal
  notes?: string;
  is_favorite: boolean;
  last_visited?: string;
  visit_count: number;
  personal_rating?: number; // 0-5
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface EatingOutMeal {
  id: string;
  meal_plan_id: string;
  restaurant_id?: string; // Reference to FavoriteRestaurant
  
  // Meal details
  meal_date: string; // YYYY-MM-DD
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  // If ad-hoc (no restaurant_id)
  restaurant_name?: string;
  
  // Estimated tracking (to keep budget/nutrition accurate)
  estimated_cost?: number;
  actual_cost?: number;
  estimated_calories?: number;
  
  // Number of people
  number_of_people: number;
  
  // Notes
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Helper for randomizer
export interface RestaurantRandomizerOptions {
  exclude_ids?: string[]; // Don't show these
  cuisine_type?: string; // Filter by cuisine
  max_cost?: number; // Budget filter
  dietary_tags?: string[]; // Must match user constraints
}

// ============================================================================
// 7. HARD/SOFT CONSTRAINTS (User Dietary Profile)
// ============================================================================

export interface UserDietaryProfile {
  id: string;
  user_id: string;
  
  // HARD CONSTRAINTS (MUST filter out)
  allergies: string[]; // ['peanut', 'seafood', 'dairy', 'gluten']
  religious_restrictions: string[]; // ['halal', 'kosher']
  health_restrictions: string[]; // ['pregnancy', 'diabetes', 'heart_disease']
  dietary_type: 'vegetarian' | 'vegan' | 'pescatarian' | 'omnivore';
  
  // SOFT CONSTRAINTS (for ranking/sorting)
  disliked_ingredients: string[];
  preferred_cuisines: string[];
  max_cooking_time?: number; // minutes
  daily_budget_limit?: number; // VND per day
  
  // Nutrition Goals (Soft)
  daily_calorie_target?: number;
  protein_target?: number; // grams
  carbs_target?: number;
  fat_target?: number;
  fiber_target?: number;
  
  // Family
  family_size: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 8. FILTERING & RECOMMENDATION SYSTEM
// ============================================================================

export interface FilterConstraints {
  hard: {
    allergies: string[];
    dietary_restrictions: string[];
    religious_restrictions: string[];
    health_restrictions: string[];
  };
  soft: {
    max_cooking_time?: number;
    max_cost_per_meal?: number;
    preferred_cuisines?: string[];
    disliked_ingredients?: string[];
    target_calories?: number;
  };
}

export interface RecommendationScore {
  recipe_id: string;
  total_score: number;
  passes_hard_constraints: boolean;
  soft_constraint_scores: {
    cooking_time: number; // 0-1
    cost: number; // 0-1
    cuisine_match: number; // 0-1
    nutrition_match: number; // 0-1
  };
}

// ============================================================================
// 9. SHOPPING LIST WITH MULTIPLIER SUPPORT
// ============================================================================

export interface ShoppingListItem {
  id: string;
  ingredient_name: string;
  
  // Quantities
  base_quantity: number; // Original quantity
  multiplier: number; // From event if applicable
  final_quantity: number; // base_quantity * multiplier
  
  // Units
  standard_unit: StandardUnit;
  display_unit?: string;
  
  // Grouping
  category: string;
  recipe_name: string;
  meal_type: string;
  
  // Cost
  estimated_price?: number;
  
  // Status
  is_purchased: boolean;
  
  // Metadata
  meal_date: string;
  notes?: string;
}

export interface AggregatedShoppingList {
  items: ShoppingListItem[];
  
  // Aggregated by category
  by_category: Record<string, ShoppingListItem[]>;
  
  // Budget
  total_estimated_cost: number;
  actual_total_cost?: number; // User input at the end
  
  // Date range
  start_date: string;
  end_date: string;
  
  // Status
  is_completed: boolean;
}

// ============================================================================
// 10. COOKING MODE ENHANCEMENTS
// ============================================================================

export interface CookingStep {
  step_number: number;
  instruction: string;
  estimated_time?: number; // minutes
  temperature?: string;
  tools_needed?: string[];
  ingredients_used?: string[]; // References to ingredients
  tips?: string;
  image?: string;
}

export interface CookingModeSession {
  id: string;
  recipe_id: string;
  recipe_title: string;
  
  // Multiplier support
  base_serving_size: number;
  target_servings: number;
  multiplier: number; // target_servings / base_serving_size
  
  // Steps
  steps: CookingStep[];
  current_step: number;
  
  // Ingredients (with multiplied quantities)
  ingredients: IngredientWithUnits[];
  
  // Settings
  keep_screen_awake: boolean;
  voice_enabled: boolean;
  font_size: 'normal' | 'large' | 'extra-large';
  
  // Progress
  completed_steps: number[];
  started_at: string;
  completed_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EXPORT ALL
// ============================================================================
