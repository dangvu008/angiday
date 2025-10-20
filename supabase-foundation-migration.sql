-- ============================================================================
-- FOUNDATION MIGRATION - Critical Path for Meal Planning System
-- Implements: Serving standardization, Menu/Plan separation, Event multiplier
-- ============================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CHUẨN HÓA KHẨU PHẦN & ĐƠN VỊ (Serving & Unit Standardization)
-- ============================================================================

-- Add base serving size to recipes
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS base_serving_size INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS serving_unit VARCHAR(50) DEFAULT 'người';

-- Add unit standardization columns
-- standard_unit: for calculations (gram, kg, ml, liter)
-- display_unit: for display only (quả, tép, muỗng, chai)
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS use_standard_units BOOLEAN DEFAULT true;

-- Update ingredients to support dual-unit system
COMMENT ON COLUMN recipes.ingredients IS 'JSONB array with format: [{name: string, quantity: number, standardUnit: string, displayUnit: string, isStandardized: boolean}]';

-- ============================================================================
-- 2. MENU TEMPLATES (Static, Reusable)
-- ============================================================================

CREATE TABLE IF NOT EXISTS menu_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack', 'full_day', 'week', 'custom')),
  
  -- Recipe composition
  recipe_ids UUID[] NOT NULL DEFAULT '{}', -- Array of recipe IDs
  
  -- Base metrics (calculated from recipes)
  base_serving_size INTEGER NOT NULL DEFAULT 4, -- Khẩu phần gốc
  total_calories INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  total_cooking_time INTEGER DEFAULT 0, -- minutes
  
  -- Nutrition (auto-calculated)
  nutrition JSONB DEFAULT '{"protein": 0, "carbs": 0, "fat": 0, "fiber": 0}',
  
  -- Metadata
  tags JSONB DEFAULT '[]',
  category VARCHAR(100),
  cuisine VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  season VARCHAR(50),
  target_audience JSONB DEFAULT '[]', -- ['family', 'single', 'couple', 'kids']
  
  -- Dietary restrictions (Hard Constraints)
  dietary_restrictions JSONB DEFAULT '[]', -- ['vegetarian', 'vegan', 'halal', 'kosher']
  allergens JSONB DEFAULT '[]', -- ['peanut', 'seafood', 'dairy']
  
  -- Permissions
  is_public BOOLEAN DEFAULT true,
  is_template BOOLEAN DEFAULT true, -- Always true for menu_templates
  created_by VARCHAR(255) NOT NULL,
  created_by_name VARCHAR(255),
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for menu_templates
CREATE INDEX IF NOT EXISTS idx_menu_templates_type ON menu_templates(type);
CREATE INDEX IF NOT EXISTS idx_menu_templates_public ON menu_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_menu_templates_tags ON menu_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_menu_templates_creator ON menu_templates(created_by);

-- ============================================================================
-- 3. APPLIED PLANS (Personal Calendar Instances)
-- ============================================================================

-- Rename existing meal_plans to applied_meal_plans for clarity
-- But keep the same table to preserve data
ALTER TABLE meal_plans 
ADD COLUMN IF NOT EXISTS source_menu_id UUID REFERENCES menu_templates(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS applied_date DATE,
ADD COLUMN IF NOT EXISTS base_serving_size INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;

COMMENT ON TABLE meal_plans IS 'Personal calendar instances - NOT templates. These are applied from menu_templates';
COMMENT ON COLUMN meal_plans.source_menu_id IS 'Reference to the menu template this plan was created from';
COMMENT ON COLUMN meal_plans.is_template IS 'Should always be FALSE for applied plans';

-- ============================================================================
-- 4. EVENT MULTIPLIER SYSTEM (Sự kiện & Khẩu phần)
-- ============================================================================

CREATE TABLE IF NOT EXISTS meal_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  
  -- Event details
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('party', 'gathering', 'celebration', 'normal')),
  event_date DATE NOT NULL,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  
  -- Serving multiplier (THE KEY FEATURE)
  total_guests INTEGER NOT NULL, -- Tổng số người ăn
  base_serving_size INTEGER NOT NULL, -- Khẩu phần gốc từ recipe/menu
  calculated_multiplier DECIMAL(5,2) GENERATED ALWAYS AS (
    CAST(total_guests AS DECIMAL) / NULLIF(base_serving_size, 0)
  ) STORED, -- Auto-calculated: 12 guests / 4 base = 3x
  
  -- Override multiplier (if user wants manual control)
  manual_multiplier DECIMAL(5,2),
  effective_multiplier DECIMAL(5,2) GENERATED ALWAYS AS (
    COALESCE(manual_multiplier, CAST(total_guests AS DECIMAL) / NULLIF(base_serving_size, 0))
  ) STORED,
  
  -- Budget
  estimated_total_cost DECIMAL(10,2),
  actual_total_cost DECIMAL(10,2),
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for meal_events
CREATE INDEX IF NOT EXISTS idx_meal_events_plan ON meal_events(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_events_date ON meal_events(event_date);
CREATE INDEX IF NOT EXISTS idx_meal_events_type ON meal_events(event_type);

-- ============================================================================
-- 5. EATING OUT SYSTEM (Ăn ngoài)
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorite_restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  
  -- Restaurant info
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  cuisine_type VARCHAR(100),
  
  -- Estimated metrics (for budget/calorie tracking)
  avg_cost_per_person DECIMAL(10,2),
  estimated_calories_per_meal INTEGER,
  
  -- Dietary info (for filtering)
  dietary_tags JSONB DEFAULT '[]', -- ['vegetarian', 'halal', 'seafood']
  allergen_warnings JSONB DEFAULT '[]',
  
  -- Personal notes
  notes TEXT,
  is_favorite BOOLEAN DEFAULT true,
  last_visited DATE,
  visit_count INTEGER DEFAULT 0,
  
  -- Rating
  personal_rating DECIMAL(2,1) CHECK (personal_rating >= 0 AND personal_rating <= 5),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name) -- Prevent duplicates per user
);

-- Table for tracking eating out in meal plan
CREATE TABLE IF NOT EXISTS eating_out_meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES favorite_restaurants(id) ON DELETE SET NULL,
  
  -- Meal details
  meal_date DATE NOT NULL,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  
  -- If no restaurant_id (ad-hoc eating out)
  restaurant_name VARCHAR(255),
  
  -- Estimated tracking (for budget/nutrition continuity)
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  estimated_calories INTEGER,
  
  -- Number of people
  number_of_people INTEGER DEFAULT 1,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for eating out
CREATE INDEX IF NOT EXISTS idx_favorite_restaurants_user ON favorite_restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_eating_out_meals_plan ON eating_out_meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_eating_out_meals_date ON eating_out_meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_eating_out_meals_restaurant ON eating_out_meals(restaurant_id);

-- ============================================================================
-- 6. HARD/SOFT CONSTRAINTS (Bộ lọc)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_dietary_profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  
  -- Hard Constraints (MUST filter out)
  allergies JSONB DEFAULT '[]', -- ['peanut', 'seafood', 'dairy', 'gluten']
  religious_restrictions JSONB DEFAULT '[]', -- ['halal', 'kosher']
  health_restrictions JSONB DEFAULT '[]', -- ['pregnancy', 'diabetes', 'heart_disease']
  dietary_type VARCHAR(50), -- 'vegetarian', 'vegan', 'pescatarian', 'omnivore'
  
  -- Soft Constraints (for ranking/sorting)
  disliked_ingredients JSONB DEFAULT '[]',
  preferred_cuisines JSONB DEFAULT '[]',
  max_cooking_time INTEGER, -- minutes
  daily_budget_limit DECIMAL(10,2), -- VND per day
  
  -- Nutrition Goals (Soft)
  daily_calorie_target INTEGER,
  protein_target INTEGER, -- grams
  carbs_target INTEGER,
  fat_target INTEGER,
  fiber_target INTEGER,
  
  -- Family settings
  family_size INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_dietary_profile_user ON user_dietary_profile(user_id);

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate menu total cost
CREATE OR REPLACE FUNCTION calculate_menu_cost(menu_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_cost DECIMAL(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(r.cost), 0) INTO total_cost
  FROM menu_templates m
  CROSS JOIN UNNEST(m.recipe_ids) AS recipe_id
  JOIN recipes r ON r.id = recipe_id
  WHERE m.id = menu_id;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate event total cost with multiplier
CREATE OR REPLACE FUNCTION calculate_event_cost(event_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  event_record meal_events%ROWTYPE;
  base_cost DECIMAL(10,2);
  final_cost DECIMAL(10,2);
BEGIN
  SELECT * INTO event_record FROM meal_events WHERE id = event_id;
  
  -- Get base cost from meal plan
  SELECT COALESCE(SUM(r.cost), 0) INTO base_cost
  FROM meals m
  JOIN recipes r ON r.id = m.recipe_id
  WHERE m.meal_plan_id = event_record.meal_plan_id
    AND m.meal_date = event_record.event_date
    AND m.meal_type = event_record.meal_type;
  
  -- Apply multiplier
  final_cost := base_cost * event_record.effective_multiplier;
  
  RETURN final_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to check if recipe passes hard constraints
CREATE OR REPLACE FUNCTION passes_hard_constraints(
  recipe_id UUID,
  user_id_param VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
  user_profile user_dietary_profile%ROWTYPE;
  recipe_allergens JSONB;
  recipe_tags JSONB;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM user_dietary_profile WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    RETURN true; -- No restrictions
  END IF;
  
  -- Get recipe data
  SELECT tags INTO recipe_tags FROM recipes WHERE id = recipe_id;
  
  -- Check allergies (if recipe contains allergen, fail)
  IF user_profile.allergies IS NOT NULL THEN
    -- This is simplified - in practice you'd need proper allergen tracking
    IF recipe_tags ?| ARRAY(SELECT jsonb_array_elements_text(user_profile.allergies)) THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Check dietary type
  IF user_profile.dietary_type = 'vegetarian' THEN
    IF recipe_tags ? 'meat' OR recipe_tags ? 'seafood' THEN
      RETURN false;
    END IF;
  END IF;
  
  IF user_profile.dietary_type = 'vegan' THEN
    IF recipe_tags ? 'meat' OR recipe_tags ? 'seafood' OR recipe_tags ? 'dairy' OR recipe_tags ? 'eggs' THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE menu_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE eating_out_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dietary_profile ENABLE ROW LEVEL SECURITY;

-- Public access for development (CHANGE IN PRODUCTION)
CREATE POLICY "Allow public access" ON menu_templates FOR ALL USING (true);
CREATE POLICY "Allow public access" ON meal_events FOR ALL USING (true);
CREATE POLICY "Allow public access" ON favorite_restaurants FOR ALL USING (true);
CREATE POLICY "Allow public access" ON eating_out_meals FOR ALL USING (true);
CREATE POLICY "Allow public access" ON user_dietary_profile FOR ALL USING (true);

-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================

-- Trigger to update updated_at
CREATE TRIGGER update_menu_templates_updated_at 
  BEFORE UPDATE ON menu_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_events_updated_at 
  BEFORE UPDATE ON meal_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorite_restaurants_updated_at 
  BEFORE UPDATE ON favorite_restaurants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eating_out_meals_updated_at 
  BEFORE UPDATE ON eating_out_meals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_dietary_profile_updated_at 
  BEFORE UPDATE ON user_dietary_profile 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample dietary profile
INSERT INTO user_dietary_profile (user_id, allergies, dietary_type, daily_calorie_target, daily_budget_limit, family_size)
VALUES ('demo_user', '["peanut"]', 'omnivore', 2000, 200000, 4)
ON CONFLICT (user_id) DO NOTHING;

-- Sample restaurant
INSERT INTO favorite_restaurants (user_id, name, cuisine_type, avg_cost_per_person, estimated_calories_per_meal, personal_rating)
VALUES 
  ('demo_user', 'Phở 24', 'Vietnamese', 50000, 500, 4.5),
  ('demo_user', 'Cơm Tấm Mộc', 'Vietnamese', 40000, 650, 4.0)
ON CONFLICT (user_id, name) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Foundation migration completed successfully!';
  RAISE NOTICE '📊 New tables: menu_templates, meal_events, favorite_restaurants, eating_out_meals, user_dietary_profile';
  RAISE NOTICE '🔧 Enhanced: recipes (base_serving_size), meal_plans (source_menu_id)';
  RAISE NOTICE '⚙️ Functions: calculate_menu_cost, calculate_event_cost, passes_hard_constraints';
END $$;
