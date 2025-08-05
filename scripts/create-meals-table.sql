-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_plan_id ON meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(meal_plan_id, meal_date);

-- Enable RLS (Row Level Security)
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meals
CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );
