# Hướng Dẫn Thêm Công Thức Vào Thực Đơn

## Tổng Quan

Tính năng mới cho phép bạn thêm các công thức nấu ăn vào thực đơn một cách dễ dàng và trực quan. Hệ thống sẽ tự động tính toán lại thông tin dinh dưỡng, thời gian nấu và chi phí khi bạn thêm hoặc xóa công thức.

## Cách Thức Hoạt Động

### 🍳 Công Thức (Recipe)
- Là hướng dẫn nấu một món ăn cụ thể
- Chứa thông tin: nguyên liệu, cách làm, dinh dưỡng, thời gian
- Có thể được sử dụng trong nhiều thực đơn khác nhau

### 🍽️ Thực Đơn (Menu)
- Là tập hợp các công thức được nhóm lại
- Tự động tính toán tổng hợp từ các công thức
- Có thể chứa nhiều công thức từ các danh mục khác nhau

## Hướng Dẫn Sử Dụng

### Bước 1: Truy Cập Quản Lý Thực Đơn
1. Vào **Admin Dashboard** (`/admin`)
2. Chọn tab **"Quản lý thực đơn"**
3. Hoặc truy cập trực tiếp: Header > Admin > Quản lý thực đơn

### Bước 2: Tạo Thực Đơn Mới
1. Nhấn nút **"Tạo thực đơn mới"**
2. Điền thông tin cơ bản:
   - Tên thực đơn
   - Mô tả
   - Loại thực đơn (ăn sáng/trưa/tối/cả ngày)
   - Độ khó
   - Số khẩu phần

### Bước 3: Thêm Công Thức Vào Thực Đơn

#### Trong Modal Tạo/Sửa Thực Đơn:
1. Tìm phần **"Chọn công thức"**
2. Nhấn nút **"Chọn công thức"**
3. Cửa sổ Recipe Selector sẽ mở ra

#### Sử Dụng Recipe Selector:
1. **Tìm kiếm**: Nhập tên món ăn hoặc từ khóa
2. **Lọc theo danh mục**: Chọn loại món (Món chính, Khai vị, Tráng miệng...)
3. **Lọc theo độ khó**: Dễ, Trung bình, Khó
4. **Chọn công thức**: 
   - Tick vào checkbox để chọn nhiều món
   - Hoặc click vào card để chọn/bỏ chọn
5. **Xác nhận**: Nhấn nút **"Chọn"** để thêm vào thực đơn

#### Quản Lý Công Thức Đã Chọn:
- Xem danh sách công thức đã chọn
- Thông tin hiển thị: tên, mô tả, thời gian, calories, độ khó
- Nhấn nút **X** để xóa công thức khỏi thực đơn

### Bước 4: Xem Chi Tiết Thực Đơn
1. Trong danh sách thực đơn, nhấn nút **"Xem"** (biểu tượng mắt)
2. Cửa sổ chi tiết sẽ hiển thị với các tab:

#### Tab "Tổng quan":
- Thống kê tổng hợp: số công thức, calories, thời gian, chi phí
- Thông tin cơ bản: danh mục, ẩm thực, tác giả
- Phân tích dinh dưỡng cơ bản

#### Tab "Công thức":
- Danh sách tất cả công thức trong thực đơn
- Thông tin chi tiết từng món
- Nút **"Thêm công thức"** để bổ sung thêm
- Nút **"Xóa"** để loại bỏ công thức

#### Tab "Dinh dưỡng":
- Phân tích chi tiết dinh dưỡng
- Tỷ lệ % protein, carbs, fat
- So sánh với khuyến nghị hàng ngày

#### Tab "Nguyên liệu":
- Danh sách tổng hợp nguyên liệu từ tất cả công thức
- Nhóm theo từng món ăn
- Tiện lợi cho việc mua sắm

### Bước 5: Chỉnh Sửa Thực Đơn
1. Nhấn nút **"Sửa"** trong danh sách hoặc chi tiết
2. Modal chỉnh sửa sẽ mở với thông tin hiện tại
3. Có thể thêm/xóa công thức như khi tạo mới
4. Hệ thống tự động cập nhật thông tin tổng hợp

## Tính Năng Nổi Bật

### 🔄 Tự Động Tính Toán
- **Tổng calories**: Cộng dồn từ tất cả công thức
- **Thời gian nấu**: Tổng thời gian chuẩn bị tất cả món
- **Dinh dưỡng**: Protein, carbs, fat, chất xơ
- **Chi phí ước tính**: Dựa trên calories (có thể tùy chỉnh)

### 🔍 Tìm Kiếm Thông Minh
- Tìm theo tên món ăn
- Tìm theo mô tả
- Tìm theo tags (chay, healthy, protein...)
- Lọc theo danh mục và độ khó

### 📊 Hiển Thị Trực Quan
- Card view với hình ảnh món ăn
- Thông tin quan trọng hiển thị ngay
- Màu sắc phân biệt độ khó
- Rating và reviews từ cộng đồng

### 🎯 Multi-Select
- Chọn nhiều công thức cùng lúc
- Checkbox để đánh dấu đã chọn
- Đếm số lượng đã chọn
- Xem trước danh sách trước khi xác nhận

## Lợi Ích

### Cho Người Quản Lý
1. **Tiết kiệm thời gian**: Không cần nhập lại thông tin
2. **Chính xác**: Tự động tính toán, giảm sai sót
3. **Linh hoạt**: Dễ dàng thay đổi, cập nhật
4. **Tổng quan**: Nhìn thấy toàn bộ thực đơn một cách trực quan

### Cho Người Dùng
1. **Thông tin đầy đủ**: Biết chính xác sẽ nấu những gì
2. **Cân bằng dinh dưỡng**: Thấy được tổng hợp dinh dưỡng
3. **Lập kế hoạch**: Biết thời gian và chi phí cần thiết
4. **Mua sắm dễ dàng**: Danh sách nguyên liệu tổng hợp

## Mẹo Sử Dụng Hiệu Quả

### 🎨 Tạo Thực Đơn Cân Bằng
- Kết hợp các món từ nhiều danh mục khác nhau
- Cân bằng độ khó: có món dễ, có món khó
- Chú ý tổng thời gian nấu hợp lý
- Đảm bảo dinh dưỡng đa dạng

### 🔄 Tái Sử Dụng Công Thức
- Một công thức có thể dùng trong nhiều thực đơn
- Tạo thực đơn theo chủ đề: chay, giảm cân, gia đình
- Sao chép thực đơn thành công để tạo biến thể

### 📝 Quản Lý Hiệu Quả
- Đặt tên thực đơn rõ ràng, dễ tìm
- Sử dụng tags để phân loại
- Cập nhật thường xuyên dựa trên phản hồi
- Theo dõi thống kê sử dụng

## Ví Dụ Thực Tế

### Thực Đơn "Ăn Chay Thanh Đạm"
**Công thức bao gồm:**
- Canh chua chay (120 cal, 15 phút)
- Đậu hũ sốt cà chua (180 cal, 20 phút)
- Rau muống xào tỏi (80 cal, 10 phút)
- Cơm gạo lứt (200 cal, 30 phút)

**Tự động tính toán:**
- Tổng calories: 580 cal
- Tổng thời gian: 75 phút
- Dinh dưỡng: 24g protein, 92g carbs, 13g fat, 17g fiber

### Thực Đơn "Bữa Sáng Nhanh Gọn"
**Công thức bao gồm:**
- Bánh mì trứng (350 cal, 10 phút)
- Cà phê sữa (120 cal, 5 phút)
- Salad trái cây (80 cal, 5 phút)

**Tự động tính toán:**
- Tổng calories: 550 cal
- Tổng thời gian: 20 phút
- Phù hợp cho người bận rộn

## Kế Hoạch Phát Triển

### Phase 1 (Hiện tại) ✅
- Thêm/xóa công thức vào thực đơn
- Tự động tính toán thông tin tổng hợp
- Giao diện trực quan với Recipe Selector
- Xem chi tiết thực đơn với tabs

### Phase 2 (Đang phát triển) 🔄
- Tích hợp với hệ thống kế hoạch ăn uống
- Gợi ý công thức phù hợp cho thực đơn
- Import/Export thực đơn
- Chia sẻ thực đơn với cộng đồng

### Phase 3 (Tương lai) 📋
- AI gợi ý thực đơn cân bằng
- Tối ưu hóa chi phí và dinh dưỡng
- Tích hợp với grocery stores
- Mobile app

## Hỗ Trợ

### Truy Cập Nhanh
- **Quản lý thực đơn**: `/admin` > Tab "Quản lý thực đơn"
- **Xem thực đơn**: `/thuc-don`
- **Demo hệ thống**: `/menu-system-demo`

### Liên Hệ
- Nếu gặp lỗi hoặc có góp ý
- Liên hệ team phát triển
- Tham gia cộng đồng người dùng

---

**Lưu ý**: Tính năng này giúp tạo ra mối liên kết chặt chẽ giữa Công thức và Thực đơn, tạo nền tảng vững chắc cho hệ thống kế hoạch ăn uống thông minh!
