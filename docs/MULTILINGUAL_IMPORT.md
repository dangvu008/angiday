# Chức năng Import Công Thức Đa Ngôn Ngữ

## Tổng quan

Hệ thống import đã được nâng cấp để hỗ trợ trích xuất và dịch tự động công thức món ăn từ các trang web bằng nhiều ngôn ngữ khác nhau. Tất cả nội dung sẽ được tự động dịch sang tiếng Việt để đồng nhất với hệ thống.

## Ngôn ngữ được hỗ trợ

### ✅ Đã triển khai
- **🇻🇳 Tiếng Việt** - Ngôn ngữ gốc của hệ thống
- **🇺🇸 Tiếng Anh** - Hỗ trợ đầy đủ với từ điển dịch thuật
- **🇨🇳 Tiếng Trung** - Nhận diện cơ bản
- **🇯🇵 Tiếng Nhật** - Nhận diện cơ bản  
- **🇰🇷 Tiếng Hàn** - Nhận diện cơ bản
- **🇹🇭 Tiếng Thái** - Nhận diện cơ bản
- **🇫🇷 Tiếng Pháp** - Nhận diện cơ bản
- **🇩🇪 Tiếng Đức** - Nhận diện cơ bản
- **🇪🇸 Tiếng Tây Ban Nha** - Nhận diện cơ bản
- **🇮🇹 Tiếng Ý** - Nhận diện cơ bản

## Quy trình xử lý

### 1. Nhận diện ngôn ngữ
Hệ thống tự động phân tích nội dung để xác định ngôn ngữ dựa trên:
- **Từ khóa nấu ăn đặc trưng** của từng ngôn ngữ
- **Đơn vị đo lường** (phút/minutes, chén/cup, thìa/spoon)
- **Thuật ngữ chế biến** (nấu/cook, chiên/fry, nướng/bake)

### 2. Dịch thuật tự động
- **Tiếng Anh → Tiếng Việt**: Dịch đầy đủ với từ điển chuyên ngành nấu ăn
- **Ngôn ngữ khác**: Chuẩn hóa thuật ngữ cơ bản

### 3. Chuẩn hóa nội dung
- Thống nhất đơn vị đo lường về tiếng Việt
- Chuẩn hóa cách viết bước nấu ("Bước 1:", "Bước 2:")
- Chuyển đổi thời gian về định dạng Việt Nam

## Từ điển dịch thuật

### Đơn vị thời gian
| English | Tiếng Việt |
|---------|------------|
| minutes, mins | phút |
| hours, hrs | giờ |
| 1:30 (format) | 1 giờ 30 phút |

### Đơn vị đo lường
| English | Tiếng Việt |
|---------|------------|
| cup, cups | chén |
| tablespoon, tbsp | thìa canh |
| teaspoon, tsp | thìa cà phê |
| pound, lb | pound |
| ounce, oz | ounce |

### Động từ chế biến
| English | Tiếng Việt |
|---------|------------|
| mix | trộn |
| stir | khuấy |
| cook | nấu |
| bake | nướng |
| fry | chiên |
| boil | luộc |
| simmer | ninh nhỏ lửa |
| heat | đun nóng |
| add | thêm |
| combine | kết hợp |
| serve | phục vụ |

### Độ khó
| English | Tiếng Việt |
|---------|------------|
| easy | Dễ |
| medium | Trung bình |
| hard, difficult | Khó |

### Danh mục món ăn
| English | Tiếng Việt |
|---------|------------|
| main course, main dish | Món chính |
| appetizer | Món khai vị |
| dessert | Tráng miệng |
| beverage, drink | Đồ uống |
| side dish | Món phụ |

## Cách sử dụng

### 1. Trang Demo Đa Ngôn Ngữ
- Truy cập: `/multilang-import`
- Chọn URL mẫu theo ngôn ngữ
- Xem quá trình nhận diện và dịch tự động

### 2. Trong Admin
- Vào `/admin` → "Quản lý công thức" → "Import từ URL"
- Nhập URL bất kỳ ngôn ngữ nào
- Hệ thống tự động dịch và hiển thị thông báo ngôn ngữ được detect

### 3. Kiểm tra kết quả
- Badge hiển thị ngôn ngữ được nhận diện
- Thông báo "Đã dịch từ: [Ngôn ngữ]" nếu không phải tiếng Việt
- Nội dung đã được chuẩn hóa theo tiếng Việt

## Ví dụ thực tế

### Input (English)
```
Title: Beef Stir Fry
Cooking Time: 30 minutes
Ingredients:
- 1 lb beef
- 2 cups vegetables
- 1 tbsp oil

Instructions:
1. Heat oil in pan
2. Add beef and cook for 5 minutes
3. Add vegetables and stir fry
```

### Output (Vietnamese)
```
Tên: Beef Stir Fry
Thời gian: 30 phút
Nguyên liệu:
- 1 pound thịt bò
- 2 chén rau
- 1 thìa canh dầu

Hướng dẫn:
Bước 1: Đun nóng dầu trong chảo
Bước 2: Thêm thịt bò và nấu trong 5 phút
Bước 3: Thêm rau và chiên
```

## Xử lý trường hợp đặc biệt

### 1. Ngôn ngữ không nhận diện được
- Hiển thị "Không xác định"
- Vẫn trích xuất dữ liệu nhưng không dịch
- Người dùng có thể chỉnh sửa thủ công

### 2. Nội dung hỗn hợp ngôn ngữ
- Ưu tiên ngôn ngữ có nhiều từ khóa nhất
- Dịch theo ngôn ngữ chính được detect

### 3. Thuật ngữ chuyên ngành
- Giữ nguyên tên món ăn đặc trưng
- Dịch mô tả và hướng dẫn
- Chuẩn hóa đơn vị đo lường

## Cải tiến trong tương lai

### Đang phát triển
- 🔄 Tích hợp Google Translate API cho độ chính xác cao hơn
- 🔄 Mở rộng từ điển cho các ngôn ngữ châu Á
- 🔄 Nhận diện và dịch tên nguyên liệu địa phương
- 🔄 Hỗ trợ đơn vị đo lường theo từng quốc gia

### Kế hoạch
- 📋 Machine Learning để cải thiện độ chính xác nhận diện
- 📋 Crowdsourcing để bổ sung từ điển
- 📋 Hỗ trợ thêm 20+ ngôn ngữ
- 📋 Tự động detect và convert đơn vị đo lường

## Troubleshooting

### Vấn đề thường gặp

**Q: Tại sao ngôn ngữ bị nhận diện sai?**
A: Hệ thống dựa vào từ khóa nấu ăn. Nếu trang web có ít thuật ngữ chuyên ngành, có thể bị nhầm lẫn.

**Q: Dịch thuật không chính xác?**
A: Hiện tại chỉ hỗ trợ dịch cơ bản cho tiếng Anh. Các ngôn ngữ khác chỉ chuẩn hóa thuật ngữ.

**Q: Làm sao để cải thiện kết quả?**
A: Chọn trang web có cấu trúc rõ ràng và nhiều thuật ngữ nấu ăn chuyên ngành.

### Debug
```javascript
// Test trong console
await testImport.testSingleUrl('https://example.com/recipe');

// Kiểm tra ngôn ngữ được detect
console.log('Detected language:', result.data.detectedLanguage);
```

## Kết luận

Tính năng import đa ngôn ngữ giúp mở rộng nguồn công thức từ toàn thế giới, tự động dịch và chuẩn hóa về tiếng Việt để người dùng dễ sử dụng. Đây là bước đầu quan trọng để xây dựng một hệ thống nấu ăn toàn cầu nhưng vẫn giữ được bản sắc địa phương.
