# Hướng dẫn khắc phục lỗi kết nối

## Tổng quan

Ứng dụng Angiday Recipe Hub sử dụng Supabase làm backend database. Khi gặp lỗi kết nối, hãy làm theo các bước sau để khắc phục.

## Công cụ kiểm tra

### 1. Trang kiểm tra kết nối
- URL: `/connection-diagnostic`
- Chức năng: Kiểm tra chi tiết trạng thái kết nối và cung cấp công cụ khắc phục tự động

### 2. Trang test kết nối  
- URL: `/connection-test`
- Chức năng: Test các hook và component xử lý lỗi kết nối

## Các lỗi phổ biến và cách khắc phục

### 1. Lỗi "Không có kết nối internet"

**Triệu chứng:**
- Hiển thị thông báo "Không có kết nối internet"
- Tất cả các chức năng không hoạt động

**Cách khắc phục:**
1. Kiểm tra kết nối mạng
2. Thử truy cập các trang web khác
3. Khởi động lại router/modem
4. Liên hệ nhà cung cấp internet

### 2. Lỗi "Không thể kết nối đến Supabase"

**Triệu chứng:**
- Hiển thị thông báo lỗi Supabase
- Không thể tải dữ liệu từ database

**Cách khắc phục:**
1. **Kiểm tra file .env:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Xác minh Supabase project:**
   - Mở [Supabase Dashboard](https://supabase.com/dashboard)
   - Kiểm tra project có đang hoạt động
   - Xác minh URL và API key

3. **Reset kết nối:**
   - Sử dụng nút "Reset kết nối Supabase" trong trang kiểm tra
   - Hoặc tải lại trang

### 3. Lỗi "Database chưa sẵn sàng"

**Triệu chứng:**
- Kết nối Supabase OK nhưng không thể truy vấn dữ liệu
- Lỗi "relation does not exist"

**Cách khắc phục:**
1. **Thiết lập database schema:**
   - Mở Supabase SQL Editor
   - Chạy file `supabase-schema.sql`
   - Hoặc sử dụng nút "Thiết lập database schema" trong trang kiểm tra

2. **Kiểm tra quyền truy cập:**
   - Đảm bảo RLS (Row Level Security) được cấu hình đúng
   - Kiểm tra policies trong Supabase

### 4. Lỗi "API không hoạt động"

**Triệu chứng:**
- Database OK nhưng các chức năng CRUD không hoạt động
- Lỗi trong service layer

**Cách khắc phục:**
1. **Kiểm tra adapter configuration:**
   ```env
   VITE_DATABASE_ADAPTER=supabase
   ```

2. **Xóa cache:**
   - Sử dụng nút "Xóa cache trình duyệt"
   - Hoặc thủ công: F12 > Application > Clear Storage

3. **Khởi động lại ứng dụng:**
   - Tải lại trang
   - Hoặc restart development server

## Các bước khắc phục tự động

Sử dụng trang `/connection-diagnostic` và tab "Khắc phục":

1. **Xóa cache trình duyệt** - Xóa localStorage và cache
2. **Reset kết nối Supabase** - Khởi tạo lại client
3. **Thiết lập database schema** - Tạo các bảng cần thiết
4. **Kiểm tra biến môi trường** - Xác minh cấu hình
5. **Tải lại trang** - Làm mới toàn bộ ứng dụng

## Sử dụng hooks và components

### useConnectionStatus
```typescript
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

const { status, isChecking, checkConnection, retryConnection } = useConnectionStatus();
```

### ConnectionWrapper
```typescript
import ConnectionWrapper from '@/components/ConnectionWrapper';

<ConnectionWrapper requireDatabase={true}>
  <YourComponent />
</ConnectionWrapper>
```

### ConnectionError
```typescript
import ConnectionError from '@/components/ConnectionError';

<ConnectionError
  error="Custom error message"
  onRetry={handleRetry}
/>
```

## Cấu hình môi trường

### File .env cần thiết:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Database Adapter Selection
VITE_DATABASE_ADAPTER=supabase

# Security Configuration
VITE_ENCRYPTION_KEY=kitchen-command-center-2025
VITE_APP_ENV=development

# Development
VITE_DEV_MODE=true
```

### Lấy thông tin Supabase:
1. Đăng nhập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project
3. Vào Settings > API
4. Copy URL và anon key

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề sau khi thử các bước trên:

1. Mở trang `/connection-diagnostic`
2. Chụp ảnh màn hình kết quả kiểm tra
3. Gửi thông tin lỗi chi tiết
4. Bao gồm:
   - Trình duyệt đang sử dụng
   - Hệ điều hành
   - Thời gian xảy ra lỗi
   - Các bước đã thử

## Debug mode

Để bật debug mode:
1. Mở Developer Tools (F12)
2. Xem Console tab để theo dõi logs
3. Tìm các thông báo bắt đầu với:
   - `✅` - Thành công
   - `❌` - Lỗi
   - `⚠️` - Cảnh báo
   - `🔍` - Thông tin debug
