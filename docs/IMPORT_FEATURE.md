# Chức năng Import Công Thức Món Ăn

## Tổng quan

Chức năng import cho phép trích xuất tự động dữ liệu công thức món ăn từ các trang web bên ngoài và thêm vào hệ thống quản lý công thức.

## Cách sử dụng

### 1. Từ trang Admin

1. Truy cập trang Admin (`/admin`)
2. Chọn tab "Quản lý công thức"
3. Click nút "Import từ URL"
4. Nhập URL của trang web chứa công thức
5. Click "Trích xuất dữ liệu"
6. Kiểm tra và chỉnh sửa dữ liệu đã trích xuất
7. Click "Import dữ liệu" để lưu vào hệ thống

### 2. Trang Demo

Truy cập `/import-demo` để test chức năng import với giao diện đơn giản.

## Dữ liệu được trích xuất

### Thông tin cơ bản
- **Tên món ăn**: Từ thẻ `<h1>`, `title`, hoặc các class chứa "title"
- **Danh mục**: Tự động phân loại dựa trên nội dung (Món chính, Món phụ, Tráng miệng, Đồ uống)
- **Hình ảnh**: Từ Open Graph image, featured image, hoặc hình ảnh đầu tiên
- **Mô tả**: Từ meta description hoặc Open Graph description

### Thông tin nấu ăn
- **Thời gian nấu**: Tự động tìm trong các class chứa "time", "duration", "prep", "cook"
- **Số khẩu phần**: Từ các class chứa "serving", "portion", "yield"
- **Độ khó**: Tự động ước tính dựa trên số lượng nguyên liệu và bước làm

### Nguyên liệu
Hệ thống tìm nguyên liệu theo thứ tự ưu tiên:
1. **JSON-LD structured data**: `recipeIngredient`
2. **CSS selectors**: `.ingredient`, `.recipe-ingredients li`, etc.
3. **Fallback**: Tìm trong các danh sách có chứa từ khóa nguyên liệu

### Hướng dẫn nấu
Hệ thống tìm hướng dẫn theo thứ tự ưu tiên:
1. **JSON-LD structured data**: `recipeInstructions`
2. **CSS selectors**: `.instruction`, `.method`, `.step`, etc.
3. **Fallback**: Tìm trong các danh sách có thứ tự

### Thông tin dinh dưỡng (tùy chọn)
- **Calories**: Tìm trong text chứa "cal", "kcal", "calories"
- **Protein, Carbs, Fat**: Tìm theo pattern "protein: Xg", "carbs: Xg", etc.

## Các trang web được hỗ trợ tốt

### Trang web có structured data (JSON-LD)
- AllRecipes.com
- Food.com
- BBC Good Food
- Các trang sử dụng schema.org Recipe markup

### Trang web có CSS class chuẩn
- Các trang sử dụng class names như: `.ingredient`, `.instruction`, `.recipe-*`
- Trang có cấu trúc HTML rõ ràng với `<ul>`, `<ol>` cho nguyên liệu và hướng dẫn

## Xử lý lỗi

### Lỗi thường gặp
1. **URL không hợp lệ**: Kiểm tra định dạng URL
2. **Timeout**: Trang web phản hồi chậm (timeout 10s)
3. **CORS**: Sử dụng proxy allorigins.win để bypass CORS
4. **Không trích xuất được dữ liệu**: Trang web có cấu trúc phức tạp

### Giải pháp
- Thử lại với URL khác
- Kiểm tra trang web có thể truy cập được
- Chỉnh sửa thủ công dữ liệu sau khi trích xuất

## Cải tiến trong tương lai

### Đã triển khai
- ✅ Trích xuất từ JSON-LD structured data
- ✅ Fallback cho các trang không có structured data
- ✅ Tự động phân loại danh mục
- ✅ Ước tính độ khó
- ✅ Trích xuất thông tin dinh dưỡng cơ bản

### Kế hoạch
- 🔄 Hỗ trợ thêm nhiều định dạng structured data
- 🔄 AI để cải thiện độ chính xác trích xuất
- 🔄 Batch import từ nhiều URL
- 🔄 Import từ file (JSON, CSV)
- 🔄 Tích hợp với API của các trang nấu ăn lớn

## API Reference

### ImportService.extractFromUrl()

```typescript
static async extractFromUrl(
  url: string, 
  type: 'news' | 'recipe'
): Promise<ImportResult>
```

**Parameters:**
- `url`: URL của trang web cần trích xuất
- `type`: Loại nội dung ('recipe' cho công thức)

**Returns:**
```typescript
interface ImportResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
}

interface ExtractedData {
  title?: string;
  category?: string;
  cookingTime?: string;
  servings?: number;
  ingredients?: string;
  instructions?: string;
  description?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  author?: string;
}
```

## Troubleshooting

### Debug mode
Mở Developer Console để xem log chi tiết quá trình trích xuất.

### Test URLs
Sử dụng các URL mẫu trong trang demo để test:
- AllRecipes: https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/
- Food.com: https://www.food.com/recipe/beef-stir-fry-15184
- BBC Good Food: https://www.bbcgoodfood.com/recipes/spaghetti-bolognese-recipe
