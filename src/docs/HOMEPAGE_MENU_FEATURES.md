# Tính năng Hiển thị Thực đơn Hiện tại trên Trang chủ

## Tổng quan
Dự án đã được phát triển thêm các tính năng hiển thị thực đơn hiện tại trên trang chủ với quản lý trạng thái mua sắm và validation giá tiền VND.

## Các tính năng chính

### 1. Hiển thị Thực đơn Hiện tại (TodayMenuDisplay)
- **Vị trí**: `src/components/TodayMenuDisplay.tsx`
- **Chức năng**:
  - Hiển thị thực đơn cho ngày hiện tại
  - Slide ngang với bữa hiện tại nổi bật ở giữa
  - Tự động detect bữa ăn hiện tại dựa trên thời gian
  - Hiển thị tên món ăn, hình ảnh, thời gian chuẩn bị
  - Thông báo khi chưa có thực đơn

### 2. Quản lý Trạng thái Mua sắm (ShoppingStatusManager)
- **Vị trí**: `src/components/ShoppingStatusManager.tsx`
- **Chức năng**:
  - Theo dõi trạng thái mua sắm: "Chưa mua sắm", "Đã mua sắm", "Mua sắm một phần"
  - Hiển thị progress bar tiến độ mua sắm
  - Nút hành động tương ứng: "Đi chợ" hoặc "Bắt đầu nấu ăn"
  - Hiển thị chi phí ước tính và thực tế

### 3. Chức năng Đi chợ Nâng cao (EnhancedShoppingListModal)
- **Vị trí**: `src/components/EnhancedShoppingListModal.tsx`
- **Chức năng**:
  - Nhập giá từng món hoặc tổng giá
  - Validation giá tiền VND với gợi ý số 0
  - Tùy chọn ẩn/hiện giá chi tiết
  - Phân loại nguyên liệu theo danh mục
  - Tính toán tự động chi phí và chênh lệch

### 4. Thống kê Chi phí (ShoppingCostStatistics)
- **Vị trí**: `src/components/ShoppingCostStatistics.tsx`
- **Chức năng**:
  - Thống kê chi phí theo ngày/tuần/tháng/năm
  - Phân tích xu hướng chi phí
  - Phân bổ chi phí theo danh mục
  - Lịch sử chi phí chi tiết

## Database Schema

### Bảng mới được thêm:
1. **daily_menu_shopping_status**: Trạng thái mua sắm hàng ngày
2. **meal_shopping_items**: Chi tiết nguyên liệu từng bữa ăn
3. **shopping_cost_statistics**: Thống kê chi phí
4. **ingredient_price_suggestions**: Gợi ý giá nguyên liệu

### Schema file: `src/lib/shopping-status-schema.sql`

## API Endpoints mới

### KitchenService methods:
- `getTodayMenuStatus()`: Lấy trạng thái thực đơn hôm nay
- `createShoppingListFromTodayMenu()`: Tạo danh sách mua sắm từ thực đơn
- `updateShoppingItemPrice()`: Cập nhật giá nguyên liệu
- `getShoppingCostStatistics()`: Lấy thống kê chi phí
- `getDailyShoppingStatus()`: Lấy trạng thái mua sắm theo ngày

## Utilities

### VND Price Utils (`src/utils/vndPriceUtils.ts`)
- `validateVNDPrice()`: Validation giá tiền VND
- `formatVNDPrice()`: Format hiển thị giá VND
- `generatePriceSuggestions()`: Gợi ý giá với số 0
- `getCurrentMealTime()`: Detect bữa ăn hiện tại
- `calculateTotalCost()`: Tính tổng chi phí
- `calculateCategoryBreakdown()`: Phân tích theo danh mục

## Context Updates

### KitchenContext được cập nhật:
- Thêm `todayMenuStatus` và `dailyShoppingStatus`
- Thêm `refreshTodayMenuStatus()`
- Thêm `createTodayShoppingList()` và `updateShoppingItemPrice()`
- Cập nhật `todayMeals` sử dụng `TodayMeals` interface

## Tích hợp Trang chủ

### Index.tsx được cập nhật:
- Hiển thị `TodayMenuDisplay` và `ShoppingStatusManager` cho user đã đăng nhập
- Layout responsive: 2/3 cho thực đơn, 1/3 cho trạng thái mua sắm
- Tích hợp `EnhancedShoppingListModal`

## Cách sử dụng

### 1. Xem thực đơn hôm nay:
- Truy cập trang chủ khi đã đăng nhập
- Thực đơn sẽ hiển thị tự động với bữa hiện tại nổi bật
- Sử dụng nút điều hướng hoặc dots để xem các bữa khác

### 2. Mua sắm nguyên liệu:
- Click nút "Đi chợ mua nguyên liệu" trong ShoppingStatusManager
- Chọn tùy chọn hiển thị giá chi tiết
- Nhập giá cho từng món hoặc chỉ nhập tổng tiền
- Sử dụng gợi ý giá VND tự động

### 3. Xem thống kê chi phí:
- Truy cập trang thống kê (cần thêm route)
- Chọn khoảng thời gian: ngày/tuần/tháng/năm
- Xem phân tích xu hướng và phân bổ theo danh mục

## Performance Optimizations

### 1. Lazy Loading:
- Dynamic imports cho utils functions
- Conditional rendering cho authenticated users

### 2. Memoization:
- `useMemo` cho calculations phức tạp
- `useCallback` cho event handlers

### 3. Efficient State Management:
- Context optimization với selective updates
- Local state cho UI-only changes

## Testing Recommendations

### 1. Unit Tests:
- Test VND price validation functions
- Test meal time detection logic
- Test cost calculation utilities

### 2. Integration Tests:
- Test shopping list creation flow
- Test price update and statistics calculation
- Test context state updates

### 3. E2E Tests:
- Test complete shopping workflow
- Test menu display and navigation
- Test responsive design

## Future Enhancements

### 1. Tính năng bổ sung:
- Notification khi đến giờ mua sắm
- Tích hợp với calendar apps
- Sharing shopping lists
- Barcode scanning cho giá

### 2. Performance:
- Virtual scrolling cho danh sách dài
- Image optimization và lazy loading
- Offline support với service workers

### 3. Analytics:
- User behavior tracking
- Cost optimization suggestions
- Seasonal price trends

## Troubleshooting

### Common Issues:
1. **Thực đơn không hiển thị**: Kiểm tra user authentication và meal data
2. **Giá không validate**: Kiểm tra VND format và regex patterns
3. **Statistics không cập nhật**: Kiểm tra database triggers và calculations

### Debug Tools:
- Browser DevTools cho React components
- Network tab cho API calls
- Console logs trong development mode

## Files Created/Modified

### New Files:
- `src/components/TodayMenuDisplay.tsx`
- `src/components/ShoppingStatusManager.tsx`
- `src/components/EnhancedShoppingListModal.tsx`
- `src/components/ShoppingCostStatistics.tsx`
- `src/pages/ShoppingStatisticsPage.tsx`
- `src/utils/vndPriceUtils.ts`
- `src/lib/shopping-status-schema.sql`
- `src/docs/HOMEPAGE_MENU_FEATURES.md`

### Modified Files:
- `src/pages/Index.tsx` - Tích hợp components mới
- `src/contexts/KitchenContext.tsx` - Thêm shopping status state và methods
- `src/services/kitchenService.ts` - Thêm shopping status APIs
- `src/types/kitchen.ts` - Cập nhật interfaces (nếu cần)
- `src/types/meal-planning.ts` - Cập nhật ShoppingListItem interface

## Installation & Setup

### 1. Install dependencies (if any new ones needed):
```bash
npm install
# or
yarn install
```

### 2. Database setup:
- Run the SQL schema in `src/lib/shopping-status-schema.sql`
- Or the system will use localStorage for demo purposes

### 3. Start development server:
```bash
npm run dev
# or
yarn dev
```

## Deployment Notes

### Environment Variables:
- No new environment variables required
- Uses existing authentication and database configurations

### Build Process:
- Standard React build process
- All new components are properly typed with TypeScript
- No additional build steps required
