# Kế hoạch chuẩn hóa Layout cho tất cả các trang

## 🎯 Mục tiêu
- Đồng bộ giao diện và chức năng trên tất cả các trang
- Tránh trùng lặp tính năng
- Đảm bảo tất cả trang đều có header và footer
- Sử dụng layout components chuẩn

## 📋 Phân loại trang

### 1. **Trang chính (StandardLayout)**
Sử dụng `StandardLayout` với Header và Footer đầy đủ:

#### ✅ Đã cập nhật:
- `src/pages/Index.tsx` - Trang chủ
- `src/pages/MealPlanningPage.tsx` - Kế hoạch bữa ăn

#### 🔄 Cần cập nhật:
- `src/pages/RecipesPage.tsx` - Danh sách công thức
- `src/pages/RecipeDetailPage.tsx` - Chi tiết công thức  
- `src/pages/MealPlansPage.tsx` - Danh sách thực đơn
- `src/pages/MealPlanDetailPage.tsx` - Chi tiết thực đơn
- `src/pages/MealDetailPage.tsx` - Chi tiết bữa ăn
- `src/pages/BlogPage.tsx` - Blog
- `src/pages/BlogDetailPage.tsx` - Chi tiết blog
- `src/pages/LoginPage.tsx` - Đăng nhập
- `src/pages/RegisterPage.tsx` - Đăng ký
- `src/pages/ProfilePage.tsx` - Hồ sơ
- `src/pages/MyRecipesPage.tsx` - Công thức của tôi
- `src/pages/MyFavoritesPage.tsx` - Yêu thích
- `src/pages/MenuCatalogPage.tsx` - Catalog thực đơn
- `src/pages/MenuDetailPage.tsx` - Chi tiết thực đơn

### 2. **Trang Demo (DemoLayout)**
Sử dụng `DemoLayout` với header đơn giản:

#### ✅ Đã cập nhật:
- `src/pages/SmartMealPlanningDemo.tsx` - Demo meal planning
- `src/pages/TestPage.tsx` - Test page
- `src/pages/KnorrStyleDemo.tsx` - Demo Knorr style

#### 🔄 Cần cập nhật:
- `src/pages/KnorrSystemDemo.tsx` - Demo hệ thống Knorr
- `src/pages/ImportDemoPage.tsx` - Demo import
- `src/pages/ImportTestDemoPage.tsx` - Test import
- `src/pages/BatchImportDemoPage.tsx` - Demo batch import
- `src/pages/MultiLanguageImportPage.tsx` - Import đa ngôn ngữ
- `src/pages/MealPlanImporterPage.tsx` - Import meal plan
- `src/pages/SmartExtractionPage.tsx` - Smart extraction
- `src/pages/AntiBlockPage.tsx` - Anti-block
- `src/pages/IngredientOptimizationPage.tsx` - Tối ưu nguyên liệu
- `src/pages/ValidationTestPage.tsx` - Test validation
- `src/pages/ErrorHandlingPage.tsx` - Error handling
- `src/pages/ImageValidationTestPage.tsx` - Test image validation
- `src/pages/NutritionCalculatorTestPage.tsx` - Test nutrition calculator
- `src/pages/RouteTestPage.tsx` - Test route

### 3. **Trang Admin (AdminLayout - cần tạo)**
Sử dụng layout riêng cho admin:
- `src/pages/AdminPage.tsx` - Admin panel

## 🛠️ Layout Components

### StandardLayout
```typescript
interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  mainClassName?: string;
}
```

### DemoLayout  
```typescript
interface DemoLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showFooter?: boolean;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  isDemoPage?: boolean;
}
```

## 🔧 Chuẩn hóa tính năng

### Loại bỏ trùng lặp:
1. **Header/Footer tự tạo** → Sử dụng components chuẩn
2. **Navigation buttons** → Sử dụng DemoLayout cho demo pages
3. **Container styling** → Sử dụng containerClassName prop
4. **Background patterns** → Chuẩn hóa className

### Đồng bộ chức năng:
1. **Search functionality** → Tập trung vào Header
2. **User authentication** → Xử lý trong Header
3. **Navigation menu** → Chuẩn hóa trong Header
4. **Footer links** → Cập nhật đồng bộ

## 📝 Template chuẩn

### Cho trang chính:
```typescript
import StandardLayout from '@/components/layout/StandardLayout';

const MyPage = () => {
  return (
    <StandardLayout
      containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Page content */}
    </StandardLayout>
  );
};
```

### Cho trang demo:
```typescript
import DemoLayout from '@/components/layout/DemoLayout';

const MyDemoPage = () => {
  return (
    <DemoLayout
      title="Demo Title"
      description="Demo description"
      mainClassName="py-8"
    >
      {/* Demo content */}
    </DemoLayout>
  );
};
```

## 🎨 Design System chuẩn

### Colors:
- **Primary**: Orange gradient (from-orange-500 to-red-500)
- **Secondary**: Gray scale
- **Success**: Green (green-600)
- **Warning**: Yellow (yellow-600)
- **Error**: Red (red-600)
- **Info**: Blue (blue-600)

### Typography:
- **Hero**: text-4xl font-bold
- **Section**: text-3xl font-bold  
- **Card**: text-2xl font-bold
- **Body Large**: text-lg
- **Body**: text-base
- **Small**: text-sm

### Spacing:
- **Container**: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Section**: py-8 or py-12
- **Card**: p-6 or p-8
- **Gap**: gap-4, gap-6, gap-8

### Shadows:
- **Card**: shadow-lg
- **Hover**: shadow-xl
- **Button**: shadow-md

## 🚀 Triển khai

### Bước 1: Tạo AdminLayout
```bash
src/components/layout/AdminLayout.tsx
```

### Bước 2: Cập nhật từng trang
1. Import layout component phù hợp
2. Thay thế div wrapper và Header/Footer
3. Sử dụng props để customize
4. Test responsive và functionality

### Bước 3: Cleanup
1. Xóa các header/footer tự tạo
2. Chuẩn hóa className và styling
3. Kiểm tra navigation và links
4. Test toàn bộ ứng dụng

### Bước 4: Documentation
1. Cập nhật component docs
2. Tạo style guide
3. Ví dụ sử dụng layout

## ✅ Checklist

### Cho mỗi trang:
- [ ] Import layout component đúng
- [ ] Thay thế wrapper div
- [ ] Xóa Header/Footer tự tạo  
- [ ] Sử dụng containerClassName
- [ ] Test responsive
- [ ] Test navigation
- [ ] Kiểm tra styling
- [ ] Verify functionality

### Tổng thể:
- [ ] Tất cả trang có header/footer
- [ ] Navigation consistent
- [ ] Styling đồng bộ
- [ ] No duplicate features
- [ ] Mobile responsive
- [ ] Performance optimized

## 🎯 Kết quả mong đợi

### Trước:
- Mỗi trang tự tạo header/footer
- Styling không đồng bộ
- Code trùng lặp
- Navigation inconsistent

### Sau:
- ✅ Layout components chuẩn
- ✅ Styling đồng bộ 100%
- ✅ Zero duplication
- ✅ Consistent navigation
- ✅ Better maintainability
- ✅ Responsive design
- ✅ Better UX

---

**🎉 Mục tiêu: Tất cả 40+ trang đều sử dụng layout chuẩn và đồng bộ hoàn toàn!**
