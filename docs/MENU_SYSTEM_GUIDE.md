# Hướng Dẫn Hệ Thống Quản Lý Thực Đơn

## Tổng Quan

Hệ thống quản lý thực đơn được thiết kế để phân biệt rõ ràng giữa ba khái niệm chính:

### 1. Công Thức (Recipe) 🍳
- **Định nghĩa**: Hướng dẫn nấu một món ăn cụ thể
- **Bao gồm**: 
  - Danh sách nguyên liệu chi tiết
  - Các bước thực hiện
  - Thời gian nấu
  - Khẩu phần
  - Thông tin dinh dưỡng
  - Độ khó
- **Ví dụ**: "Phở Bò Truyền Thống", "Gỏi Cuốn Tôm Thịt"

### 2. Thực Đơn (Menu) 🍽️
- **Định nghĩa**: Tập hợp các công thức được nhóm lại theo chủ đề
- **Bao gồm**:
  - Nhiều công thức trong một bộ
  - Chủ đề hoặc mục đích cụ thể
  - Tính toán tổng dinh dưỡng
  - Ước tính chi phí
  - Phù hợp với đối tượng mục tiêu
- **Ví dụ**: "Thực đơn ăn chay", "Thực đơn hải sản", "Thực đơn giảm cân"

### 3. Kế Hoạch Ăn (Meal Plan) 📅
- **Định nghĩa**: Sử dụng thực đơn để lập kế hoạch ăn uống theo thời gian
- **Bao gồm**:
  - Lên lịch theo ngày/tuần/tháng
  - Sử dụng thực đơn có sẵn
  - Tối ưu dinh dưỡng cho gia đình
  - Quản lý ngân sách
  - Tạo danh sách mua sắm
- **Ví dụ**: "Kế hoạch ăn tuần này", "Thực đơn tháng 1"

## Quy Trình Sử Dụng

### Bước 1: Tạo Công Thức
1. Vào **Admin > Quản lý công thức**
2. Nhấn **"Thêm công thức"**
3. Điền thông tin:
   - Tên món ăn
   - Nguyên liệu
   - Cách làm
   - Thời gian nấu
   - Khẩu phần
   - Thông tin dinh dưỡng

### Bước 2: Tạo Thực Đơn
1. Vào **Admin > Quản lý thực đơn**
2. Nhấn **"Tạo thực đơn mới"**
3. Chọn các công thức để thêm vào thực đơn
4. Đặt tên và mô tả cho thực đơn
5. Hệ thống sẽ tự động tính:
   - Tổng calories
   - Tổng thời gian nấu
   - Ước tính chi phí
   - Thông tin dinh dưỡng tổng hợp

### Bước 3: Lập Kế Hoạch Ăn
1. Vào **Meal Planning Advanced**
2. Chọn tab **"Thực đơn"**
3. Chọn thực đơn phù hợp
4. Thêm vào lịch kế hoạch ăn
5. Hệ thống sẽ:
   - Tính toán dinh dưỡng cho cả tuần
   - Tạo danh sách mua sắm
   - Theo dõi ngân sách

## Tính Năng Chính

### Quản Lý Công Thức
- ✅ Thêm/sửa/xóa công thức
- ✅ Import từ URL
- ✅ Batch import nhiều công thức
- ✅ Validation thông tin
- ✅ Tính toán dinh dưỡng tự động

### Quản Lý Thực Đơn
- ✅ Tạo thực đơn từ các công thức
- ✅ Phân loại theo chủ đề
- ✅ Tính toán tổng hợp dinh dưỡng
- ✅ Ước tính chi phí
- ✅ Đánh giá và review

### Kế Hoạch Ăn Uống
- ✅ Lịch tuần/tháng
- ✅ Drag & drop thực đơn
- ✅ Tối ưu dinh dưỡng gia đình
- ✅ Quản lý ngân sách
- ✅ Danh sách mua sắm tự động

## Demo và Test

### Truy Cập Demo
- **URL**: `/menu-system-demo`
- **Mô tả**: Demo đầy đủ các tính năng của hệ thống
- **Bao gồm**: 
  - Giải thích khái niệm
  - Ví dụ công thức
  - Ví dụ thực đơn
  - Mô phỏng kế hoạch ăn

### Các Trang Admin
- **Quản lý công thức**: `/admin` > Tab "Quản lý công thức"
- **Quản lý thực đơn**: `/admin` > Tab "Quản lý thực đơn"
- **Kế hoạch ăn**: `/meal-planning-advanced`

## Lợi Ích

### Cho Người Dùng
1. **Tổ chức tốt hơn**: Phân biệt rõ công thức và thực đơn
2. **Tiết kiệm thời gian**: Sử dụng lại thực đơn có sẵn
3. **Dinh dưỡng cân bằng**: Tính toán tự động
4. **Quản lý chi phí**: Ước tính và theo dõi ngân sách
5. **Mua sắm thông minh**: Danh sách tự động từ kế hoạch

### Cho Quản Trị Viên
1. **Quản lý dễ dàng**: Interface trực quan
2. **Tái sử dụng**: Công thức có thể dùng trong nhiều thực đơn
3. **Phân tích**: Thống kê sử dụng và đánh giá
4. **Mở rộng**: Dễ dàng thêm tính năng mới

## Kế Hoạch Phát Triển

### Phase 1 (Hiện tại)
- ✅ Cấu trúc dữ liệu cơ bản
- ✅ CRUD operations
- ✅ Demo system
- ✅ Admin interface

### Phase 2 (Tiếp theo)
- 🔄 Tích hợp AI để gợi ý thực đơn
- 🔄 Tối ưu hóa dinh dưỡng tự động
- 🔄 Chia sẻ thực đơn giữa người dùng
- 🔄 Mobile app

### Phase 3 (Tương lai)
- 📋 Tích hợp với grocery stores
- 📋 Meal prep planning
- 📋 Social features
- 📋 Advanced analytics

## Hỗ Trợ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng:
1. Xem demo tại `/menu-system-demo`
2. Kiểm tra tài liệu API
3. Liên hệ team phát triển

---

**Lưu ý**: Hệ thống này được thiết kế để mở rộng và có thể tùy chỉnh theo nhu cầu cụ thể của từng dự án.
