import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DemoLayout from '@/components/layout/DemoLayout';

const RouteTestPage = () => {
  const routes = [
    // Main Pages
    { path: "/", name: "Trang chủ", category: "Chính" },
    
    // Authentication
    { path: "/login", name: "Đăng nhập", category: "Xác thực" },
    { path: "/register", name: "Đăng ký", category: "Xác thực" },
    { path: "/profile", name: "Hồ sơ", category: "Xác thực" },
    
    // Blog
    { path: "/blog", name: "Blog", category: "Blog" },
    { path: "/blog/1", name: "Chi tiết blog", category: "Blog" },
    
    // Recipes
    { path: "/recipes", name: "Công thức", category: "Công thức" },
    { path: "/recipes/1", name: "Chi tiết công thức", category: "Công thức" },
    { path: "/my-recipes", name: "Công thức của tôi", category: "Công thức" },
    { path: "/my-favorites", name: "Yêu thích", category: "Công thức" },
    
    // Meal Plans
    { path: "/meal-plans", name: "Kế hoạch bữa ăn", category: "Kế hoạch" },
    { path: "/meal-plans/1", name: "Chi tiết kế hoạch", category: "Kế hoạch" },
    { path: "/meal-planner", name: "Kế hoạch cá nhân", category: "Kế hoạch" },
    { path: "/ke-hoach-nau-an", name: "Kế hoạch nấu ăn (Tiếng Việt)", category: "Kế hoạch" },
    { path: "/meal/1", name: "Chi tiết bữa ăn", category: "Kế hoạch" },
    
    // Admin
    { path: "/admin", name: "Quản trị", category: "Quản trị" },
    
    // Demo and Test Pages
    { path: "/test", name: "Test", category: "Demo/Test" },
    { path: "/import-demo", name: "Demo Import", category: "Demo/Test" },
    { path: "/import-test-demo", name: "Demo Test Import", category: "Demo/Test" },
    { path: "/batch-import-demo", name: "Demo Batch Import", category: "Demo/Test" },
    { path: "/multi-language-import", name: "Import đa ngôn ngữ", category: "Demo/Test" },
    { path: "/meal-plan-importer", name: "Import kế hoạch", category: "Demo/Test" },
    { path: "/smart-extraction", name: "Trích xuất thông minh", category: "Demo/Test" },
    { path: "/anti-block", name: "Chống chặn", category: "Demo/Test" },
    { path: "/ingredient-optimization", name: "Tối ưu nguyên liệu", category: "Demo/Test" },
    { path: "/knorr-style-demo", name: "Demo Knorr Style", category: "Demo/Test" },
    { path: "/knorr-system-demo", name: "Demo Knorr System", category: "Demo/Test" },
    { path: "/image-validation-test", name: "Test xác thực ảnh", category: "Demo/Test" },
    { path: "/nutrition-calculator-test", name: "Test tính dinh dưỡng", category: "Demo/Test" },
    { path: "/validation-test", name: "Test xác thực", category: "Demo/Test" },
    { path: "/error-handling", name: "Xử lý lỗi", category: "Demo/Test" },
  ];

  const categories = [...new Set(routes.map(route => route.category))];

  return (
    <DemoLayout
      title="🎉 Tất cả các trang đã được khôi phục!"
      description="Test tất cả các routes và navigation trong ứng dụng"
      mainClassName="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Route Test - Navigation Check
          </h1>
          <p className="text-lg text-gray-600">
            Dưới đây là danh sách tất cả các trang có sẵn trong ứng dụng
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes
                .filter(route => route.category === category)
                .map(route => (
                  <Card key={route.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{route.name}</CardTitle>
                      <CardDescription>{route.path}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        to={route.path}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Truy cập →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </DemoLayout>
  );
};

export default RouteTestPage;
