# Hướng Dẫn Hệ Thống Phân Quyền

## Tổng Quan

Hệ thống phân quyền được thiết kế để đảm bảo người dùng chỉ có thể thực hiện các hành động phù hợp với vai trò và quyền sở hữu của mình. Điều này giúp bảo vệ dữ liệu và tạo ra trải nghiệm người dùng an toàn, có tổ chức.

## Cấu Trúc Phân Quyền

### 👤 Vai Trò Người Dùng

#### 1. **Admin (Quản trị viên)**
- **Quyền cao nhất** trong hệ thống
- Có thể thực hiện **tất cả** các hành động
- Quản lý toàn bộ nội dung và người dùng
- **Biểu tượng**: 🛡️ Shield icon
- **Màu sắc**: Đỏ (bg-red-100 text-red-800)

#### 2. **Chef (Đầu bếp)**
- Chuyên gia về ẩm thực
- Có thể tạo và quản lý công thức/thực đơn chất lượng cao
- Được ưu tiên hiển thị nội dung
- **Biểu tượng**: 👨‍🍳 ChefHat icon
- **Màu sắc**: Cam (bg-orange-100 text-orange-800)

#### 3. **User (Người dùng thường)**
- Người dùng cơ bản của hệ thống
- Có thể tạo nội dung cá nhân và sử dụng các tính năng cơ bản
- **Biểu tượng**: 👤 User icon
- **Màu sắc**: Xanh dương (bg-blue-100 text-blue-800)

### 🔐 Ma Trận Phân Quyền

| Hành động | Admin | Chef | User |
|-----------|-------|------|------|
| **Xem tất cả thực đơn** | ✅ | ✅ | ✅ |
| **Tạo thực đơn mới** | ✅ | ✅ | ✅ |
| **Sửa thực đơn của mình** | ✅ | ✅ | ✅ |
| **Sửa thực đơn của người khác** | ✅ | ❌ | ❌ |
| **Xóa thực đơn của mình** | ✅ | ✅ | ✅ |
| **Xóa thực đơn của người khác** | ✅ | ❌ | ❌ |
| **Thêm công thức vào thực đơn của mình** | ✅ | ✅ | ✅ |
| **Thêm công thức vào thực đơn người khác** | ✅ | ❌ | ❌ |
| **Thêm thực đơn vào kế hoạch cá nhân** | ✅ | ✅ | ✅ |
| **Quản lý người dùng** | ✅ | ❌ | ❌ |

## Cách Thức Hoạt Động

### 🔍 Kiểm Tra Quyền

#### 1. **Ownership Check (Kiểm tra quyền sở hữu)**
```typescript
// Chỉ có thể sửa/xóa thực đơn của chính mình
canEditMenu(menuCreatedBy: string): boolean {
  return currentUser.id === menuCreatedBy || isAdmin();
}
```

#### 2. **Role-based Check (Kiểm tra theo vai trò)**
```typescript
// Admin có thể làm tất cả
isAdmin(): boolean {
  return currentUser.role === 'admin';
}
```

#### 3. **Feature-based Check (Kiểm tra theo tính năng)**
```typescript
// Tất cả user đã đăng nhập đều có thể thêm vào kế hoạch cá nhân
canAddMenuToPersonalPlan(): boolean {
  return isAuthenticated();
}
```

### 🎯 Áp Dụng Phân Quyền

#### 1. **Trong Giao Diện**
- **Ẩn/hiện nút**: Chỉ hiển thị nút khi có quyền
- **Disable controls**: Vô hiệu hóa khi không có quyền
- **Visual indicators**: Badge, màu sắc để phân biệt quyền

#### 2. **Trong Logic**
- **Guard functions**: Kiểm tra quyền trước khi thực hiện
- **Error handling**: Thông báo lỗi khi không có quyền
- **Fallback actions**: Hành động thay thế khi bị từ chối

## Tính Năng Theo Quyền

### 📝 Quản Lý Thực Đơn

#### **Thực đơn của mình**:
- ✅ **Xem chi tiết**: Tất cả thông tin
- ✅ **Chỉnh sửa**: Thay đổi tên, mô tả, thêm/xóa công thức
- ✅ **Xóa**: Xóa hoàn toàn khỏi hệ thống
- ✅ **Chia sẻ**: Đặt công khai/riêng tư

#### **Thực đơn của người khác**:
- ✅ **Xem chi tiết**: Chỉ xem, không sửa
- ❌ **Chỉnh sửa**: Không thể thay đổi
- ❌ **Xóa**: Không thể xóa
- ✅ **Thêm vào kế hoạch**: Sử dụng trong kế hoạch cá nhân

### 🍽️ Sử Dụng Thực Đơn

#### **Tất cả người dùng có thể**:
- Xem danh sách thực đơn công khai
- Tìm kiếm và lọc thực đơn
- Xem chi tiết thực đơn
- Thêm thực đơn vào kế hoạch cá nhân
- Đánh giá và bình luận

#### **Chỉ chủ sở hữu có thể**:
- Chỉnh sửa nội dung thực đơn
- Thêm/xóa công thức
- Thay đổi trạng thái công khai/riêng tư
- Xóa thực đơn

## Giao Diện Phân Quyền

### 🎨 Visual Indicators

#### **Badges và Icons**
- **Có thể sửa**: Badge "Có thể sửa" màu xanh
- **Chỉ xem**: Badge "Chỉ xem" màu xám
- **Thêm vào kế hoạch**: Badge "Thêm vào kế hoạch" màu xanh lá

#### **Button States**
- **Enabled**: Nút bình thường khi có quyền
- **Hidden**: Ẩn hoàn toàn khi không có quyền
- **Disabled**: Vô hiệu hóa với tooltip giải thích

#### **Color Coding**
- **Xanh lá**: Hành động được phép
- **Đỏ**: Hành động nguy hiểm (xóa)
- **Xám**: Không có quyền
- **Cam**: Cảnh báo hoặc chờ xác nhận

### 📱 Responsive Permissions

#### **Desktop**
- Hiển thị đầy đủ thông tin quyền
- Tooltip chi tiết khi hover
- Menu dropdown với các hành động

#### **Mobile**
- Rút gọn thông tin quyền
- Bottom sheet cho hành động
- Swipe gestures cho quick actions

## Workflow Người Dùng

### 🔄 Quy Trình Sử Dụng

#### **Scenario 1: User tạo thực đơn mới**
1. User đăng nhập → Có quyền tạo thực đơn
2. Tạo thực đơn → Trở thành chủ sở hữu
3. Có thể sửa/xóa/thêm công thức
4. Có thể chia sẻ công khai

#### **Scenario 2: User xem thực đơn của người khác**
1. User xem danh sách thực đơn công khai
2. Click xem chi tiết → Chỉ có quyền xem
3. Không thấy nút "Sửa" hoặc "Xóa"
4. Có nút "Thêm vào kế hoạch cá nhân"

#### **Scenario 3: Admin quản lý**
1. Admin có quyền với tất cả thực đơn
2. Có thể sửa/xóa thực đơn của bất kỳ ai
3. Có thể quản lý người dùng
4. Có dashboard quản trị riêng

### ⚠️ Error Handling

#### **Khi không có quyền**:
- **Toast notification**: "Bạn không có quyền thực hiện hành động này"
- **Redirect**: Chuyển về trang phù hợp
- **Alternative action**: Đề xuất hành động thay thế

#### **Khi session hết hạn**:
- **Auto logout**: Tự động đăng xuất
- **Redirect to login**: Chuyển về trang đăng nhập
- **Preserve state**: Lưu trạng thái để khôi phục

## Bảo Mật

### 🔒 Client-side Security

#### **UI Protection**
- Ẩn/hiện elements dựa trên quyền
- Disable actions không được phép
- Validate input trước khi gửi

#### **State Management**
- Lưu trữ thông tin user an toàn
- Clear sensitive data khi logout
- Encrypt local storage nếu cần

### 🛡️ Server-side Security (Future)

#### **API Protection**
- JWT token authentication
- Role-based middleware
- Resource ownership validation

#### **Database Security**
- Row-level security
- Audit logging
- Data encryption

## Mở Rộng Tương Lai

### 📈 Advanced Permissions

#### **Fine-grained Permissions**
- Permission per feature
- Time-based permissions
- Location-based restrictions

#### **Team Collaboration**
- Shared ownership
- Team roles
- Collaborative editing

#### **Enterprise Features**
- Organization management
- Department-level permissions
- Approval workflows

## Hỗ Trợ và Troubleshooting

### 🆘 Các Vấn Đề Thường Gặp

#### **"Không thấy nút Sửa"**
- **Nguyên nhân**: Không phải chủ sở hữu thực đơn
- **Giải pháp**: Chỉ có thể sửa thực đơn của mình

#### **"Không thể thêm công thức"**
- **Nguyên nhân**: Thực đơn của người khác
- **Giải pháp**: Tạo thực đơn mới hoặc copy thực đơn này

#### **"Mất quyền đột ngột"**
- **Nguyên nhân**: Session hết hạn hoặc role bị thay đổi
- **Giải pháp**: Đăng nhập lại hoặc liên hệ admin

### 📞 Liên Hệ Hỗ Trợ

- **Bug report**: Báo lỗi về permissions
- **Feature request**: Đề xuất tính năng mới
- **Account issues**: Vấn đề về tài khoản

---

**Lưu ý**: Hệ thống phân quyền được thiết kế để cân bằng giữa bảo mật và trải nghiệm người dùng. Mọi thay đổi đều được cân nhắc kỹ lưỡng để đảm bảo tính nhất quán và dễ sử dụng.
