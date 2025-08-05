-- Shopping Status Schema for AngiDay
-- Thiết kế database schema cho tính năng quản lý trạng thái mua sắm

-- Bảng trạng thái mua sắm cho thực đơn hàng ngày
CREATE TABLE daily_menu_shopping_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  menu_date DATE NOT NULL, -- Ngày áp dụng thực đơn (YYYY-MM-DD)
  daily_menu_id VARCHAR(255), -- ID của daily menu plan (có thể null nếu là custom menu)
  status VARCHAR(20) NOT NULL DEFAULT 'not_purchased' CHECK (status IN ('not_purchased', 'purchased', 'partially_purchased')),
  total_estimated_cost DECIMAL(12,2) DEFAULT 0, -- Tổng chi phí ước tính (VND)
  total_actual_cost DECIMAL(12,2) DEFAULT 0, -- Tổng chi phí thực tế (VND)
  shopping_completed_at TIMESTAMP WITH TIME ZONE, -- Thời điểm hoàn thành mua sắm
  notes TEXT, -- Ghi chú
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, menu_date) -- Mỗi user chỉ có 1 trạng thái mua sắm cho 1 ngày
);

-- Bảng chi tiết mua sắm theo từng bữa ăn
CREATE TABLE meal_shopping_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  daily_shopping_status_id UUID REFERENCES daily_menu_shopping_status(id) ON DELETE CASCADE,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id UUID, -- ID của recipe (có thể null nếu là custom meal)
  recipe_name VARCHAR(255) NOT NULL, -- Tên món ăn
  ingredient_name VARCHAR(255) NOT NULL, -- Tên nguyên liệu
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1, -- Số lượng
  unit VARCHAR(50) NOT NULL DEFAULT 'portion', -- Đơn vị (kg, gram, lít, etc.)
  category VARCHAR(100) NOT NULL DEFAULT 'other', -- Danh mục (rau củ, thịt, hải sản, etc.)
  estimated_price DECIMAL(10,2) DEFAULT 0, -- Giá ước tính (VND)
  actual_price DECIMAL(10,2), -- Giá thực tế (VND) - null nếu chưa mua
  is_purchased BOOLEAN DEFAULT false, -- Đã mua hay chưa
  purchased_at TIMESTAMP WITH TIME ZONE, -- Thời điểm mua
  notes TEXT, -- Ghi chú cho nguyên liệu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng thống kê chi phí mua sắm
CREATE TABLE shopping_cost_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  period_value VARCHAR(20) NOT NULL, -- YYYY-MM-DD cho daily, YYYY-WW cho weekly, YYYY-MM cho monthly, YYYY cho yearly
  total_cost DECIMAL(12,2) NOT NULL DEFAULT 0, -- Tổng chi phí (VND)
  meal_count INTEGER NOT NULL DEFAULT 0, -- Số bữa ăn
  avg_cost_per_meal DECIMAL(10,2) NOT NULL DEFAULT 0, -- Chi phí trung bình mỗi bữa
  category_breakdown JSONB DEFAULT '{}', -- Phân tích chi phí theo danh mục
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_type, period_value)
);

-- Bảng cấu hình giá nguyên liệu (để gợi ý giá)
CREATE TABLE ingredient_price_suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ingredient_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  avg_price DECIMAL(10,2) NOT NULL, -- Giá trung bình (VND)
  min_price DECIMAL(10,2), -- Giá thấp nhất
  max_price DECIMAL(10,2), -- Giá cao nhất
  region VARCHAR(100) DEFAULT 'vietnam', -- Khu vực
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sample_count INTEGER DEFAULT 1, -- Số lượng mẫu để tính giá trung bình
  UNIQUE(ingredient_name, category, unit, region)
);

-- Indexes để tối ưu performance
CREATE INDEX idx_daily_menu_shopping_user_date ON daily_menu_shopping_status(user_id, menu_date);
CREATE INDEX idx_meal_shopping_items_daily_status ON meal_shopping_items(daily_shopping_status_id);
CREATE INDEX idx_meal_shopping_items_meal_type ON meal_shopping_items(meal_type);
CREATE INDEX idx_shopping_cost_stats_user_period ON shopping_cost_statistics(user_id, period_type, period_value);
CREATE INDEX idx_ingredient_price_suggestions_name ON ingredient_price_suggestions(ingredient_name);

-- Triggers để tự động cập nhật thống kê
CREATE OR REPLACE FUNCTION update_shopping_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật thống kê khi có thay đổi về giá thực tế
  IF TG_OP = 'UPDATE' AND OLD.actual_price IS DISTINCT FROM NEW.actual_price THEN
    -- Logic cập nhật thống kê sẽ được implement trong application layer
    -- để tránh phức tạp trong database trigger
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shopping_statistics
  AFTER UPDATE ON meal_shopping_items
  FOR EACH ROW
  EXECUTE FUNCTION update_shopping_statistics();

-- Function để tính toán trạng thái mua sắm tổng thể
CREATE OR REPLACE FUNCTION calculate_daily_shopping_status(daily_status_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  total_items INTEGER;
  purchased_items INTEGER;
  result VARCHAR(20);
BEGIN
  SELECT COUNT(*), COUNT(CASE WHEN is_purchased THEN 1 END)
  INTO total_items, purchased_items
  FROM meal_shopping_items
  WHERE daily_shopping_status_id = daily_status_id;
  
  IF total_items = 0 THEN
    result := 'not_purchased';
  ELSIF purchased_items = 0 THEN
    result := 'not_purchased';
  ELSIF purchased_items = total_items THEN
    result := 'purchased';
  ELSE
    result := 'partially_purchased';
  END IF;
  
  -- Cập nhật trạng thái trong bảng chính
  UPDATE daily_menu_shopping_status 
  SET status = result, updated_at = NOW()
  WHERE id = daily_status_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
