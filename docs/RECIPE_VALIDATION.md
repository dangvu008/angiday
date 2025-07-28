# Hệ Thống Validation Công Thức

## Tổng Quan

Hệ thống validation cho form chỉnh sửa công thức được thiết kế để đảm bảo chất lượng dữ liệu và trải nghiệm người dùng tốt. Hệ thống bao gồm:

- ✅ Validation real-time khi người dùng nhập liệu
- ✅ Kiểm tra trùng lặp tên công thức
- ✅ Giới hạn ký tự cho các trường
- ✅ Validation nội dung (ingredients, instructions)
- ✅ Hiển thị lỗi và cảnh báo trực quan
- ✅ Ngăn submit khi có lỗi

## Cấu Trúc Files

```
src/
├── services/
│   └── RecipeValidationService.ts    # Service chính xử lý validation
├── components/admin/
│   ├── RecipeModal.tsx              # Form với validation tích hợp
│   └── ValidationDemo.tsx           # Demo component để test
└── pages/
    └── ValidationTestPage.tsx       # Trang test validation
```

## Các Loại Validation

### 1. Validation Bắt Buộc (Required Fields)
- **Tên món ăn**: Không được để trống
- **Thời gian nấu**: Không được để trống  
- **Tác giả**: Không được để trống
- **Số khẩu phần**: Phải > 0
- **Nguyên liệu**: Không được để trống
- **Hướng dẫn nấu**: Không được để trống

### 2. Giới Hạn Ký Tự

| Trường | Tối thiểu | Tối đa |
|--------|-----------|--------|
| Tên món ăn | 3 | 100 |
| Mô tả ngắn | 10 | 500 |
| Nguyên liệu | 10 | 2000 |
| Hướng dẫn nấu | 20 | 5000 |
| Tác giả | 2 | 50 |
| Thời gian nấu | 2 | 50 |

### 3. Validation Trùng Lặp
- **Tên công thức**: Kiểm tra trùng với các công thức hiện có
- **Nội dung tương tự**: Cảnh báo khi ingredients/instructions quá giống nhau (>80% similarity)

### 4. Validation Giá Trị
- **Số khẩu phần**: 1-100 (cảnh báo nếu >100)
- **Calories**: 0-5000 (cảnh báo nếu ngoài khoảng hợp lý)
- **Tags**: Tối đa 10 tags, mỗi tag tối đa 30 ký tự

## Cách Sử Dụng

### 1. Trong Component

```typescript
import { RecipeValidationService } from '@/services/RecipeValidationService';

// Validate toàn bộ recipe
const validationResult = RecipeValidationService.validateRecipe(recipe, existingRecipes);

// Kiểm tra kết quả
if (!validationResult.isValid) {
  console.log('Errors:', validationResult.errors);
  console.log('Warnings:', validationResult.warnings);
}

// Lấy giới hạn ký tự cho một trường
const limits = RecipeValidationService.getCharacterLimit('title');
console.log(`Title: ${limits.min}-${limits.max} characters`);
```

### 2. Trong RecipeModal

RecipeModal đã tích hợp sẵn validation với các tính năng:
- Real-time validation khi người dùng nhập
- Hiển thị số ký tự và giới hạn
- Highlight trường có lỗi (border đỏ)
- Hiển thị thông báo lỗi và cảnh báo
- Disable nút submit khi có lỗi

```typescript
<RecipeModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSave}
  recipe={selectedRecipe}
  mode={modalMode}
  existingRecipes={recipes} // Quan trọng: truyền danh sách để check duplicate
/>
```

## Test Scenarios

Truy cập `/validation-test` để test các scenario:

### 1. Form Trống
- Tất cả trường bắt buộc để trống
- Hiển thị lỗi validation cho các trường required

### 2. Tên Trùng Lặp  
- Nhập tên món ăn đã tồn tại
- Hiển thị lỗi duplicate title

### 3. Vượt Quá Giới Hạn Ký Tự
- Nhập nội dung quá dài cho các trường
- Hiển thị lỗi character limit

### 4. Nội Dung Quá Ngắn
- Nhập nội dung quá ngắn
- Hiển thị lỗi minimum length

### 5. Giá Trị Không Hợp Lệ
- Số khẩu phần quá lớn (>100)
- Calories không hợp lý (>5000)
- Quá nhiều tags (>10)

### 6. Dữ Liệu Hợp Lệ
- Tất cả trường đều hợp lệ
- Không có lỗi, có thể submit thành công

## Validation Rules Chi Tiết

### Tên Món Ăn (Title)
```typescript
// Lỗi
- Để trống
- < 3 ký tự
- > 100 ký tự  
- Trùng với công thức khác

// Cảnh báo
- Chứa "untitled", "chưa có tên", "tiêu đề chưa xác định"
```

### Mô Tả (Description)
```typescript
// Lỗi
- > 500 ký tự

// Cảnh báo  
- Để trống (không bắt buộc nhưng nên có)
- < 10 ký tự
```

### Nguyên Liệu (Ingredients)
```typescript
// Lỗi
- Để trống
- < 10 ký tự
- > 2000 ký tự

// Cảnh báo
- < 2 dòng (nên có ít nhất 2 nguyên liệu)
- Tương tự >80% với công thức khác
```

### Hướng Dẫn Nấu (Instructions)
```typescript
// Lỗi  
- Để trống
- < 20 ký tự
- > 5000 ký tự

// Cảnh báo
- < 2 bước (nên có ít nhất 2 bước)
- Tương tự >80% với công thức khác
- Không chứa động từ nấu ăn
```

## Tùy Chỉnh Validation

### Thay Đổi Giới Hạn Ký Tự

Chỉnh sửa trong `RecipeValidationService.ts`:

```typescript
private static readonly LIMITS = {
  TITLE_MIN: 3,        // Tối thiểu 3 ký tự
  TITLE_MAX: 100,      // Tối đa 100 ký tự
  DESCRIPTION_MAX: 500, // Tùy chỉnh theo nhu cầu
  // ...
};
```

### Thêm Validation Rule Mới

```typescript
// Trong validateOtherFields()
if (recipe.customField && recipe.customField.length > 50) {
  errors.push({
    field: 'customField',
    message: 'Custom field quá dài',
    type: 'error'
  });
}
```

## Lưu Ý Quan Trọng

1. **Performance**: Validation được debounce 500ms để tránh gọi quá nhiều lần
2. **UX**: Chỉ hiển thị lỗi sau khi người dùng nhập, không hiển thị ngay khi mở form
3. **Accessibility**: Sử dụng màu sắc và icon để phân biệt lỗi/cảnh báo
4. **Extensibility**: Dễ dàng thêm rule mới hoặc tùy chỉnh existing rules

## Hệ Thống Quản Lý Nguyên Liệu Thông Minh

### Tính Năng Mới
- ✅ **SmartIngredientInput**: Component nhập nguyên liệu thông minh
- ✅ **IngredientManagementService**: Service quản lý nguyên liệu chuẩn hóa
- ✅ **Phân tích trùng lặp**: Tự động phát hiện nguyên liệu trùng lặp
- ✅ **Đề xuất tối ưu hóa**: Gợi ý cách tối ưu hóa danh sách nguyên liệu
- ✅ **Trang quản lý**: `/ingredient-optimization` để quản lý tổng thể

### Cách Sử Dụng Hệ Thống Nguyên Liệu

#### 1. Trong RecipeModal
RecipeModal đã tích hợp SmartIngredientInput với 2 chế độ:
- **Chế độ văn bản**: Nhập như cũ (textarea)
- **Chế độ có cấu trúc**: Nhập từng nguyên liệu riêng biệt với tìm kiếm thông minh

#### 2. Truy cập trang tối ưu hóa
```
/ingredient-optimization
```

#### 3. Các tính năng chính:
- **Phân tích trùng lặp**: Hiển thị nguyên liệu được dùng trong nhiều công thức
- **Gộp nguyên liệu tương tự**: Đề xuất gộp các nguyên liệu có tên gần giống
- **Quản lý nguyên liệu chưa dùng**: Danh sách nguyên liệu trong hệ thống nhưng chưa được sử dụng
- **Tìm kiếm và phân loại**: Tìm kiếm nguyên liệu theo tên và danh mục

### Lợi Ích
1. **Tránh trùng lặp**: Giảm thiểu việc tạo nguyên liệu trùng lặp
2. **Chuẩn hóa dữ liệu**: Tên nguyên liệu được chuẩn hóa
3. **Tối ưu chi phí**: Ước tính giá và đề xuất nguyên liệu thay thế
4. **Quản lý dễ dàng**: Interface trực quan để quản lý nguyên liệu

## Troubleshooting

### Validation Không Hoạt Động
- Kiểm tra `existingRecipes` có được truyền vào RecipeModal không
- Kiểm tra console có lỗi JavaScript không

### Performance Issues
- Tăng debounce time từ 500ms lên 1000ms
- Tối ưu hóa `calculateSimilarity` function

### False Positives
- Điều chỉnh threshold similarity từ 0.8 xuống 0.7
- Cải thiện logic detect duplicate content

### Ingredient Management Issues
- Chạy `IngredientManagementService.initialize()` nếu không có dữ liệu
- Kiểm tra format dữ liệu ingredients trong recipes
- Xem console log để debug parsing issues
