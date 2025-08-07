# 💰 Expense Tracking - Tính năng theo dõi chi tiêu

## ✅ **Đã thêm các tính năng mới:**

### 1. **💵 Cập nhật tổng số tiền thực tế**
- **Nút "Cập nhật tổng"**: Nhập tổng chi phí thực tế sau khi mua sắm
- **So sánh**: Hiển thị cả dự kiến và thực tế
- **Tính tiết kiệm**: Tự động tính số tiền tiết kiệm được

### 2. **📅 Lưu thông tin ngày tháng**
- **Ngày mua sắm**: Tự động lưu ngày thực hiện mua sắm
- **Timestamp**: Thời gian tạo và cập nhật
- **Persistence**: Lưu vào localStorage để không mất dữ liệu

### 3. **📊 Thống kê chi tiêu**
- **Theo tháng**: Xem chi tiêu theo từng tháng
- **Theo danh mục**: Phân tích chi tiêu theo loại nguyên liệu
- **Lịch sử**: Xem tất cả lần mua sắm trước đó

### 4. **📈 Báo cáo chi tiêu**
- **Export monthly**: Xuất báo cáo chi tiêu theo tháng
- **Chi tiết**: Bao gồm tất cả thông tin thống kê
- **Format đẹp**: File .txt dễ đọc và phân tích

## 🎯 **Cách sử dụng:**

### **Bước 1: Tạo danh sách mua sắm**
1. Vào **Smart Meal Planning Demo**: http://localhost:8081/smart-meal-planning-demo
2. Click **"Mua sắm thông minh"**
3. Chọn thực đơn/kế hoạch
4. Click **"Tạo danh sách mua sắm"**

### **Bước 2: Cập nhật chi phí thực tế**
```
Header: Dự kiến: 150,000₫ • [💰 Cập nhật tổng]
```
1. Click **"Cập nhật tổng"**
2. Nhập số tiền thực tế đã chi (VD: 135,000)
3. Click ✓ để xác nhận
4. Hệ thống tự động tính tiết kiệm: 15,000₫

### **Bước 3: Xem thống kê**
```
[📊 Thống kê chi tiêu] [💰 Báo cáo chi tiêu]
```
- **Thống kê chi tiêu**: Xem dashboard chi tiết
- **Báo cáo chi tiêu**: Xuất file báo cáo tháng

## 📋 **Thông tin được lưu:**

### **ExpenseRecord:**
```typescript
{
  id: "expense-shopping-123-1704672000000",
  shoppingListId: "shopping-123",
  userId: "user-456",
  date: "2025-08-07",
  totalBudget: 150000,      // Dự kiến
  actualSpent: 135000,      // Thực tế
  savings: 15000,           // Tiết kiệm
  categories: [...],        // Chi tiết theo danh mục
  createdAt: "2025-08-07T14:00:00Z",
  updatedAt: "2025-08-07T14:30:00Z"
}
```

### **ExpenseCategory:**
```typescript
{
  category: "Thịt cá",
  budgetAmount: 80000,
  actualAmount: 75000,
  items: [...]
}
```

## 📊 **Dashboard thống kê:**

### **Summary Cards:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Tổng ngân   │ Chi tiêu    │ Tiết kiệm   │ Số lần mua  │
│ sách        │ thực tế     │             │             │
│ 450,000₫    │ 420,000₫    │ 30,000₫     │ 3           │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Chi tiêu theo danh mục:**
```
Thịt cá:     Dự kiến 240,000₫ | Thực tế 225,000₫ | +6.3%
Rau củ:      Dự kiến 120,000₫ | Thực tế 115,000₫ | +4.2%
Gia vị:      Dự kiến 90,000₫  | Thực tế 80,000₫  | +11.1%
```

### **Lịch sử mua sắm:**
```
📅 07/08/2025: 135,000₫ / 150,000₫ [Tiết kiệm: 15,000₫]
📅 05/08/2025: 180,000₫ / 170,000₫ [Vượt: 10,000₫]
📅 03/08/2025: 105,000₫ / 120,000₫ [Tiết kiệm: 15,000₫]
```

## 📄 **Format báo cáo xuất:**

### **Báo cáo tháng (.txt):**
```
BÁO CÁO CHI TIÊU MUA SẮM
========================

Thời gian xuất: 07/08/2025, 22:10:30
Số lần mua sắm: 3
Tổng ngân sách: 450,000₫
Tổng chi tiêu: 420,000₫
Tổng tiết kiệm: 30,000₫ (6.7%)

CHI TIẾT THEO DANH MỤC:
----------------------
Thịt cá: Dự kiến 240,000₫ | Thực tế 225,000₫ | Tiết kiệm 6.3%
Rau củ: Dự kiến 120,000₫ | Thực tế 115,000₫ | Tiết kiệm 4.2%
Gia vị: Dự kiến 90,000₫ | Thực tế 80,000₫ | Tiết kiệm 11.1%

CHI TIẾT TỪNG LẦN MUA:
---------------------
📅 07/08/2025:
   Dự kiến: 150,000₫
   Thực tế: 135,000₫
   Tiết kiệm: 15,000₫

📅 05/08/2025:
   Dự kiến: 170,000₫
   Thực tế: 180,000₫
   Tiết kiệm: -10,000₫

📅 03/08/2025:
   Dự kiến: 120,000₫
   Thực tế: 105,000₫
   Tiết kiệm: 15,000₫
```

## 🔧 **Technical Implementation:**

### **New Types:**
- `ExpenseRecord`: Bản ghi chi tiêu chính
- `ExpenseCategory`: Chi tiêu theo danh mục
- `ExpenseItem`: Chi tiết từng mục
- `ShoppingList.actualTotalCost`: Tổng chi phí thực tế

### **New Service:**
- `ExpenseTrackingService`: Quản lý expense records
- `localStorage`: Persistence data
- `Statistics`: Tính toán thống kê

### **New Components:**
- `ExpenseStatistics`: Dashboard thống kê
- `Total Cost Editor`: Inline editing tổng chi phí
- `Expense Summary Card`: Hiển thị thống kê ngắn

## 🎨 **UI/UX Features:**

### **Visual Indicators:**
- **Green badges**: Tiết kiệm được
- **Red badges**: Vượt ngân sách
- **Progress tracking**: % tiết kiệm
- **Color coding**: Dễ phân biệt trạng thái

### **User Experience:**
- **One-click update**: Cập nhật tổng nhanh chóng
- **Auto-save**: Tự động lưu vào localStorage
- **Real-time stats**: Thống kê cập nhật ngay lập tức
- **Export options**: Nhiều format xuất dữ liệu

## 🚀 **Benefits:**

### **Cho người dùng:**
1. **Quản lý ngân sách**: Theo dõi chi tiêu vs dự kiến
2. **Phân tích xu hướng**: Xem pattern chi tiêu theo thời gian
3. **Tối ưu hóa**: Biết danh mục nào tiết kiệm/tốn kém nhất
4. **Báo cáo**: Export data để phân tích sâu hơn
5. **Lịch sử**: Không mất dữ liệu chi tiêu

### **Cho ứng dụng:**
1. **Data-driven**: Cung cấp insights từ dữ liệu thực
2. **User retention**: Tính năng hữu ích giữ chân user
3. **Competitive advantage**: Tính năng độc đáo
4. **Analytics ready**: Dữ liệu sẵn sàng cho phân tích

## 📱 **Demo Flow:**

### **Test Complete Flow:**
1. **Tạo danh sách**: Chọn thực đơn → Tạo shopping list
2. **Mua sắm**: Check items khi mua
3. **Cập nhật tổng**: Nhập chi phí thực tế
4. **Xem thống kê**: Click "Thống kê chi tiêu"
5. **Export báo cáo**: Download file phân tích

### **Expected Results:**
- ✅ Hiển thị cả dự kiến và thực tế
- ✅ Tính toán tiết kiệm chính xác
- ✅ Lưu dữ liệu persistent
- ✅ Dashboard thống kê đầy đủ
- ✅ Export báo cáo professional

---

## 🎯 **Summary:**

**Đã thêm thành công hệ thống theo dõi chi tiêu hoàn chỉnh:**

1. ✅ **Cập nhật tổng số tiền** - Real-time cost tracking
2. ✅ **Lưu ngày tháng** - Date-based expense records  
3. ✅ **Thống kê chi tiêu** - Comprehensive analytics
4. ✅ **Báo cáo xuất** - Professional reports
5. ✅ **Persistence** - Data không bị mất

**Status: 🟢 COMPLETED - Ready for expense tracking!**

**Test URL**: http://localhost:8081/smart-meal-planning-demo → "Mua sắm thông minh"
