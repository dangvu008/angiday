# Hướng Dẫn Khắc Phục Lỗi Database

## Tóm Tắt Vấn Đề

Từ console log, tôi thấy các lỗi chính:

1. **Lỗi cột 'endDate'**: Database sử dụng `end_date` (snake_case) nhưng code sử dụng `endDate` (camelCase)
2. **Lỗi 400 Bad Request**: Thiếu cột `user_id` trong bảng `meal_plans`
3. **Lỗi 404 health check**: API endpoint không tồn tại

## Các Bước Khắc Phục

### Bước 1: Chạy Migration Script

1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Tạo query mới và paste nội dung từ file `supabase-migration.sql`
4. Chạy script này để:
   - Thêm cột `user_id` vào bảng `meal_plans`
   - Thêm cột `settings` vào bảng `meal_plans`
   - Tạo các bảng còn thiếu
   - Thêm indexes và policies
   - Insert dữ liệu mẫu

### Bước 2: Kiểm Tra Kết Nối

1. Mở browser console trên trang web của bạn
2. Chạy script test:
   ```javascript
   // Copy và paste nội dung từ file setup-database.js
   // Hoặc chạy trực tiếp:
   setupDatabase();
   ```

### Bước 3: Xác Minh Sửa Lỗi

Sau khi chạy migration, bạn sẽ thấy:

✅ **Đã sửa:**
- Lỗi mapping giữa snake_case và camelCase
- Thiếu cột `user_id` trong `meal_plans`
- Thiếu cột `settings` trong `meal_plans`
- Interface không khớp giữa `Meal` và `MealSlot`

✅ **Cải thiện:**
- Thêm conversion functions tự động
- Cập nhật SupabaseAdapter để xử lý đúng data types
- Thêm sample data để test

## Các File Đã Được Cập Nhật

### 1. `src/services/adapters/SupabaseAdapter.ts`
- Thêm helper functions: `toCamelCase`, `toSnakeCase`, `convertKeysToCamelCase`, `convertKeysToSnakeCase`
- Cập nhật tất cả methods để sử dụng conversion
- Sửa interface từ `Meal` thành `MealSlot`
- Thêm `userId` parameter cho `getMealPlans`

### 2. `supabase-schema.sql`
- Thêm cột `user_id` vào bảng `meal_plans`
- Thêm cột `settings` vào bảng `meal_plans`

### 3. `supabase-migration.sql` (Mới)
- Script migration an toàn để cập nhật database hiện tại
- Kiểm tra và thêm cột thiếu
- Tạo indexes và policies
- Insert sample data

### 4. `setup-database.js` (Mới)
- Script test kết nối và database structure
- Kiểm tra tất cả tables và columns
- Test CRUD operations
- Verify SupabaseAdapter hoạt động

## Cách Test Sau Khi Sửa

1. **Chạy migration script** trong Supabase SQL Editor
2. **Refresh trang web** của bạn
3. **Mở console** và kiểm tra:
   - Không còn lỗi "endDate column not found"
   - Không còn lỗi 400 Bad Request
   - Supabase client khởi tạo thành công
   - Demo accounts được tạo thành công

## Lưu Ý Quan Trọng

⚠️ **Backup đã được tạo**: `src_backup_20250803_163750/`

🔧 **Conversion tự động**: Code giờ sẽ tự động chuyển đổi giữa:
- `endDate` (TypeScript) ↔ `end_date` (Database)
- `startDate` (TypeScript) ↔ `start_date` (Database)
- `userId` (TypeScript) ↔ `user_id` (Database)
- `mealPlanId` (TypeScript) ↔ `meal_plan_id` (Database)

📊 **Sample data**: Migration script sẽ tạo sample recipes nếu database trống

## Nếu Vẫn Gặp Lỗi

1. Kiểm tra Supabase URL và API key trong `.env`
2. Verify RLS policies trong Supabase Dashboard
3. Chạy `setup-database.js` để debug chi tiết
4. Kiểm tra Network tab trong browser để xem API calls

## Liên Hệ

Nếu vẫn gặp vấn đề, hãy:
1. Chạy `setup-database.js` và gửi kết quả console log
2. Kiểm tra Supabase Dashboard → Settings → API
3. Verify database schema trong Supabase Dashboard → Table Editor
