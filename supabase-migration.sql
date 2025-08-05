-- Migration script to update existing database schema
-- Run this in Supabase SQL Editor to update existing tables

-- Add missing columns to meal_plans table
DO $$ 
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'meal_plans' AND column_name = 'user_id') THEN
        ALTER TABLE meal_plans ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'demo_user';
    END IF;
    
    -- Add settings column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'meal_plans' AND column_name = 'settings') THEN
        ALTER TABLE meal_plans ADD COLUMN settings JSONB DEFAULT '{}';
    END IF;
END $$;

-- Update existing meal plans to have proper user_id (for demo purposes)
UPDATE meal_plans SET user_id = 'demo_user' WHERE user_id = 'demo_user';

-- Add index for user_id
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);

-- Ensure all tables have proper structure
-- This will create tables if they don't exist (idempotent)

-- Recipes table (ensure it exists with proper structure)
CREATE TABLE IF NOT EXISTS recipes (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals table (ensure it exists with proper structure)
CREATE TABLE IF NOT EXISTS meals (
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

-- Shopping Lists table (ensure it exists)
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Items table (ensure it exists)
CREATE TABLE IF NOT EXISTS shopping_items (
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

-- Inventory table (ensure it exists)
CREATE TABLE IF NOT EXISTS inventory (
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_meals_plan ON meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meals_recipe ON meals(recipe_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_list ON shopping_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);

-- Enable RLS if not already enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    -- Recipes policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON recipes FOR ALL USING (true);
    END IF;
    
    -- Meal plans policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meal_plans' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON meal_plans FOR ALL USING (true);
    END IF;
    
    -- Meals policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meals' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON meals FOR ALL USING (true);
    END IF;
    
    -- Shopping lists policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_lists' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON shopping_lists FOR ALL USING (true);
    END IF;
    
    -- Shopping items policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_items' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON shopping_items FOR ALL USING (true);
    END IF;
    
    -- Inventory policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory' AND policyname = 'Allow public access') THEN
        CREATE POLICY "Allow public access" ON inventory FOR ALL USING (true);
    END IF;
END $$;

-- Create or replace functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (will replace if exists)
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meals_updated_at ON meals;
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data if tables are empty
DO $$
BEGIN
    -- Insert sample recipes if none exist
    IF NOT EXISTS (SELECT 1 FROM recipes LIMIT 1) THEN
        INSERT INTO recipes (id, name, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, nutrition, tags) VALUES
        ('vn_001', 'Canh Chua Cá Lóc', 'Món canh chua truyền thống miền Nam với cá lóc tươi ngon', 
         '["500g cá lóc", "200g dứa", "100g đậu bắp", "50g giá đỗ", "2 quả cà chua", "Me, đường, nước mắm", "Hành lá, ngò gai"]',
         '["Sơ chế cá lóc, cắt khúc vừa ăn", "Nấu nước dùng từ xương cá", "Cho dứa, cà chua vào nấu", "Thêm cá, đậu bắp", "Nêm nếm vừa ăn", "Cho giá đỗ, rau thơm"]',
         15, 30, 4, 'medium', '{"calories": 280, "protein": 25, "carbs": 15, "fat": 8}', '["vietnamese", "soup", "fish"]'),
        ('vn_002', 'Thịt Kho Tàu', 'Món thịt kho đậm đà hương vị truyền thống',
         '["500g thịt ba chỉ", "6 quả trứng", "2 củ hành tím", "Nước mắm", "Đường phèn", "Nước dừa"]',
         '["Thái thịt miếng vừa ăn", "Luộc trứng", "Kho thịt với nước dừa", "Thêm trứng vào kho cùng", "Nêm nếm vừa ăn"]',
         20, 45, 4, 'medium', '{"calories": 420, "protein": 28, "carbs": 12, "fat": 32}', '["vietnamese", "pork", "braised"]');
    END IF;
END $$;

RAISE NOTICE 'Migration completed successfully!';
