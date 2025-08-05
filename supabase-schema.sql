-- Kitchen Command Center Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  servings INTEGER NOT NULL DEFAULT 1,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  nutrition JSONB NOT NULL DEFAULT '{}',
  tags JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  user_id VARCHAR(255), -- NULL for system recipes, user ID for user-created recipes
  is_public BOOLEAN DEFAULT true, -- Whether recipe is visible to other users
  source VARCHAR(50) DEFAULT 'user' CHECK (source IN ('user', 'system', 'imported')),
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Favorites table
CREATE TABLE user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Recipe Collections (for organizing recipes into groups)
CREATE TABLE recipe_collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Collection Items
CREATE TABLE recipe_collection_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES recipe_collections(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, recipe_id)
);

-- Meal Plans table
CREATE TABLE meal_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals table
CREATE TABLE meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Lists table
CREATE TABLE shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Items table
CREATE TABLE shopping_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit VARCHAR(50),
  category VARCHAR(100),
  completed BOOLEAN DEFAULT FALSE,
  estimated_price DECIMAL(10,2),
  actual_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(50),
  category VARCHAR(100),
  expiry_date DATE,
  purchase_date DATE,
  cost DECIMAL(10,2),
  location VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_meals_date ON meals(meal_date);
CREATE INDEX idx_meals_plan ON meals(meal_plan_id);
CREATE INDEX idx_meals_recipe ON meals(recipe_id);
CREATE INDEX idx_shopping_items_list ON shopping_items(shopping_list_id);
CREATE INDEX idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_user ON recipes(user_id);
CREATE INDEX idx_recipes_public ON recipes(is_public);
CREATE INDEX idx_recipes_rating ON recipes(rating);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe ON user_favorites(recipe_id);
CREATE INDEX idx_recipe_collections_user ON recipe_collections(user_id);
CREATE INDEX idx_recipe_collection_items_collection ON recipe_collection_items(collection_id);

-- RLS (Row Level Security) policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collection_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public access (for development)
CREATE POLICY "Allow public access" ON recipes FOR ALL USING (true);
CREATE POLICY "Allow public access" ON meal_plans FOR ALL USING (true);
CREATE POLICY "Allow public access" ON meals FOR ALL USING (true);
CREATE POLICY "Allow public access" ON shopping_lists FOR ALL USING (true);
CREATE POLICY "Allow public access" ON shopping_items FOR ALL USING (true);
CREATE POLICY "Allow public access" ON inventory FOR ALL USING (true);
CREATE POLICY "Allow public access" ON user_favorites FOR ALL USING (true);
CREATE POLICY "Allow public access" ON recipe_collections FOR ALL USING (true);
CREATE POLICY "Allow public access" ON recipe_collection_items FOR ALL USING (true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipe_collections_updated_at BEFORE UPDATE ON recipe_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper functions for app setup
CREATE OR REPLACE FUNCTION create_recipes_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This function is called by the app to ensure tables exist
  -- The actual table creation is handled above
  RAISE NOTICE 'Recipes table setup completed';
END;
$$ LANGUAGE plpgsql;

-- Helper function for SQL execution (if needed)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql;

-- Function to increment recipe views
CREATE OR REPLACE FUNCTION increment_recipe_views(recipe_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE recipes
  SET views = views + 1
  WHERE id = recipe_id;
END;
$$ LANGUAGE plpgsql;
