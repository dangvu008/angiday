# Khắc Phục Lỗi Supabase meal_plans Table

## Vấn đề
App gặp lỗi "meal_plans:1 of 400" khi sử dụng Supabase adapter do table `meal_plans` và `meals` chưa được tạo đúng cách.

## Nguyên nhân
1. Table `meal_plans` đã tồn tại nhưng table `meals` chưa có
2. Có thể thiếu RLS policies hoặc foreign key constraints
3. SupabaseAdapter đang query table `meal_plans` nhưng không thể truy cập được

## Giải pháp đã thực hiện

### 1. Tạm thời chuyển về localStorage
```env
VITE_DATABASE_ADAPTER=localStorage
```
- App hiện đang hoạt động bình thường với localStorage
- Không còn lỗi kết nối Supabase

### 2. Tạo scripts setup database
- `scripts/setup-meal-plans-table.sql` - SQL để tạo tables
- `scripts/setup-meal-plans.js` - Script kiểm tra và setup
- `scripts/apply-migration.js` - Script apply migration

### 3. Sửa lỗi import
- Sửa `src/utils/cleanupOldData.ts` để import đúng `getSupabaseClient`

## Cần làm tiếp để hoàn thành Supabase

### 1. Tạo table `meals` trong Supabase
Truy cập Supabase SQL Editor và chạy:
```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meals_plan_id ON meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date);

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meals.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );
```

### 2. Kiểm tra RLS policies cho meal_plans
Đảm bảo table `meal_plans` có RLS policies đúng:
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'meal_plans';

-- Create policy if needed
CREATE POLICY "Users can manage their own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Test kết nối
Chạy script test:
```bash
node scripts/setup-meal-plans.js --direct
```

### 4. Chuyển lại về Supabase
Khi tables đã sẵn sàng:
```env
VITE_DATABASE_ADAPTER=supabase
```

## Cấu trúc Tables cần thiết

### meal_plans
- ✅ Đã tồn tại
- Cần kiểm tra RLS policies

### meals  
- ❌ Chưa tồn tại
- Cần tạo với foreign key tới meal_plans và recipes

### recipes
- ✅ Đã tồn tại và hoạt động

## Lưu ý
- App hiện tại hoạt động tốt với localStorage
- Có thể tiếp tục phát triển features khác
- Supabase setup có thể làm sau khi có thời gian

## Commands hữu ích
```bash
# Test Supabase connection
node scripts/setup-meal-plans.js --direct

# Apply migration (manual)
# Copy SQL từ scripts/apply-migration.js và paste vào Supabase SQL Editor

# Switch adapter
# Edit .env: VITE_DATABASE_ADAPTER=supabase|localStorage
```
