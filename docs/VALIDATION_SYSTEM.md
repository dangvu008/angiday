# Hệ Thống Validation Import

## Tổng quan

Hệ thống validation được thiết kế để kiểm tra và đánh giá chất lượng nội dung trước khi import, giúp ngăn chặn việc import các nội dung không phù hợp và đảm bảo chất lượng dữ liệu trong hệ thống.

## Quy trình Validation

### 1. Pre-Validation (Kiểm tra trước)
Được thực hiện trước khi trích xuất nội dung:

#### ✅ Kiểm tra URL
- **Tồn tại**: HEAD request để kiểm tra URL có tồn tại
- **Trạng thái HTTP**: 
  - 404: URL không tồn tại
  - 403: Có thể bị chặn truy cập
  - 5xx: Lỗi máy chủ
- **Content-Type**: Phải là `text/html`
- **Timeout**: 5 giây cho HEAD request

#### ⚠️ Kiểm tra Domain
- **Non-recipe domains**: YouTube, Facebook, Amazon, Wikipedia, etc.
- **Recipe keywords**: Tìm từ khóa liên quan nấu ăn trong URL
- **Cảnh báo**: Nếu không có từ khóa nấu ăn

### 2. Post-Extraction Validation (Kiểm tra sau trích xuất)
Được thực hiện sau khi trích xuất nội dung:

#### 📊 Scoring System (Hệ thống chấm điểm)
**Thang điểm: 0-100**

| Tiêu chí | Điểm tối đa | Điều kiện |
|----------|-------------|-----------|
| **Tiêu đề** | 30 điểm | Có tiêu đề hợp lệ (+20), chứa từ khóa nấu ăn (+10) |
| **Nguyên liệu** | 35 điểm | Có danh sách (+25), ≥3 items (+10) |
| **Hướng dẫn** | 35 điểm | Có hướng dẫn (+25), ≥2 bước (+10) |
| **Bonus** | Điểm cộng | Có đơn vị đo lường (+5), động từ nấu ăn (+10), thời gian (+5) |

#### 🎯 Phân loại chất lượng
- **Xuất sắc (70-100)**: ✅ Sẵn sàng import
- **Tốt (40-69)**: ⚠️ Có thể import với lưu ý
- **Kém (<40)**: ❌ Không nên import

### 3. Content Type Detection (Nhận diện loại nội dung)

#### 🔍 Phân loại tự động
- **Recipe**: Có nguyên liệu + hướng dẫn + từ khóa nấu ăn
- **News**: Có từ khóa tin tức, báo, article
- **Blog**: Có từ khóa blog, review, đánh giá
- **Product**: Có từ khóa mua, bán, giá
- **Unknown**: Không xác định được

## Các trường hợp được kiểm tra

### ❌ URL không tồn tại
```
Lỗi: "Trang web không tồn tại (404)"
Hành động: Chặn import
```

### ⚠️ Nội dung không phù hợp
```
Cảnh báo: "Nội dung này không phải công thức món ăn"
Hành động: Chặn import
```

### 📰 Trang tin tức/blog
```
Cảnh báo: "Đây có vẻ là bài báo/tin tức"
Hành động: Chặn import (nếu type = recipe)
```

### 🛒 Trang bán hàng
```
Cảnh báo: "Đây có vẻ là trang bán hàng"
Hành động: Chặn import
```

### 📺 Trang không phải nấu ăn
```
Cảnh báo: "URL không phải từ trang web nấu ăn"
Hành động: Cho phép nhưng cảnh báo
```

## Cảnh báo và Thông báo

### 🚨 Cảnh báo nghiêm trọng (Chặn import)
- Nội dung không phải công thức món ăn
- URL không tồn tại
- Loại nội dung không phù hợp
- Thiếu thông tin quan trọng

### ⚠️ Cảnh báo thông thường (Cho phép import)
- Chất lượng dữ liệu thấp
- Thiếu một số thông tin
- Domain không phải trang nấu ăn
- Ngôn ngữ không xác định

### ✅ Thông báo thành công
- Validation thành công
- Dữ liệu chất lượng cao
- Sẵn sàng import

## Giao diện Validation

### 📊 Hiển thị điểm số
```
Điểm: 85/100 (màu xanh)
Điểm: 55/100 (màu vàng)  
Điểm: 25/100 (màu đỏ)
```

### 🏷️ Badge loại nội dung
```
Loại: recipe (xanh)
Loại: news (cam)
Loại: unknown (xám)
```

### 📋 Danh sách cảnh báo
- Hiển thị tất cả warnings
- Phân biệt mức độ nghiêm trọng
- Gợi ý hành động

## API Validation

### ImportResult Interface
```typescript
interface ImportResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
  warnings?: string[];
  validationScore?: number;
  contentType?: 'recipe' | 'news' | 'blog' | 'product' | 'unknown';
}
```

### Validation Methods
```typescript
// Pre-validation
preValidateUrl(url: string): Promise<ValidationResult>

// Post-validation  
validateExtractedData(data: ExtractedData): ValidationResult

// Recipe-specific validation
validateRecipeData(data: ExtractedData): ValidationResult
```

## Test Cases

### 🧪 Trang demo validation: `/validation-test`

#### URL không tồn tại
- `https://nonexistent-website-12345.com/recipe`
- `https://httpstat.us/404`

#### Không phải trang nấu ăn
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://www.amazon.com/dp/B08N5WRWNW`
- `https://en.wikipedia.org/wiki/Cooking`

#### Trang tin tức/blog
- `https://www.bbc.com/news`
- `https://techcrunch.com`

#### Trang công thức tốt
- `https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/`
- `https://www.food.com/recipe/beef-stir-fry-15184`

## Cải tiến trong tương lai

### Đang phát triển
- 🔄 Machine Learning để cải thiện độ chính xác
- 🔄 Thêm nhiều pattern nhận diện nội dung
- 🔄 Validation cho video recipes
- 🔄 Kiểm tra chất lượng hình ảnh

### Kế hoạch
- 📋 User feedback để cải thiện scoring
- 📋 Whitelist/blacklist domains
- 📋 Custom validation rules
- 📋 Batch validation cho multiple URLs

## Troubleshooting

### Q: Tại sao trang công thức bị từ chối?
A: Kiểm tra xem trang có đủ nguyên liệu và hướng dẫn không. Một số trang chỉ có video mà không có text.

### Q: Làm sao để bypass validation?
A: Không khuyến khích. Thay vào đó, hãy tìm trang có cấu trúc tốt hơn hoặc chỉnh sửa thủ công sau khi import.

### Q: Validation score thấp nhưng nội dung tốt?
A: Có thể do trang web có cấu trúc đặc biệt. Hãy báo cáo để cải thiện algorithm.

## Kết luận

Hệ thống validation giúp đảm bảo chất lượng dữ liệu và ngăn chặn import nội dung không phù hợp. Với scoring system và content type detection, người dùng có thể đưa ra quyết định sáng suốt về việc có nên import hay không.

Validation không chỉ là rào cản mà còn là công cụ hỗ trợ người dùng tìm được nguồn dữ liệu chất lượng cao cho hệ thống.
