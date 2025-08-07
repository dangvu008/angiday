import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';

const TestPage = () => {
  return (
    <DemoLayout
      title="Test Page - Kiểm tra hoạt động"
      description="Trang kiểm tra các tính năng và components của ứng dụng AnGiDay"
      mainClassName="py-8"
    >
      <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">✅ Trang web đã hoạt động!</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">🎉 Vấn đề đã được khắc phục:</h3>
                <ul className="text-green-700 space-y-1">
                  <li>• Server đang chạy trên port 8083</li>
                  <li>• Route đúng là /recipes/:id (không phải /recipe/:id)</li>
                  <li>• RecipeDetailPage đã được tạo lại với code đơn giản</li>
                  <li>• Loại bỏ các dependency phức tạp gây lỗi</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">🔗 Links để test:</h3>
                <div className="space-y-2">
                  <div>
                    <a 
                      href="http://localhost:8083/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Trang chủ: http://localhost:8083/
                    </a>
                  </div>
                  <div>
                    <a 
                      href="http://localhost:8083/recipes/1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Chi tiết công thức: http://localhost:8083/recipes/1
                    </a>
                  </div>
                  <div>
                    <a 
                      href="http://localhost:8083/knorr-style-demo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Demo Knorr Style: http://localhost:8083/knorr-style-demo
                    </a>
                  </div>
                  <div>
                    <a 
                      href="http://localhost:8083/admin" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Admin Panel: http://localhost:8083/admin
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <h3 className="font-semibold text-orange-800 mb-2">🎨 Tính năng Knorr Style:</h3>
                <ul className="text-orange-700 space-y-1">
                  <li>• Hero section với layout 2 cột</li>
                  <li>• Stats cards với màu sắc đẹp</li>
                  <li>• Ingredients section với gradient background</li>
                  <li>• Instructions với step numbers gradient</li>
                  <li>• Chef tips với background đặc biệt</li>
                  <li>• Hover effects và transitions mượt mà</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h3 className="font-semibold text-purple-800 mb-2">🚀 Các component đã tạo:</h3>
                <ul className="text-purple-700 space-y-1">
                  <li>• KnorrStyleRecipeCard - Recipe cards với hover effects</li>
                  <li>• KnorrNutritionFacts - Nutrition info với health score</li>
                  <li>• KnorrIngredientsList - Interactive ingredients list</li>
                  <li>• ErrorDisplay - Chi tiết error handling</li>
                  <li>• AntiBlockDemo - Demo anti-block technology</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                onClick={() => window.open('/recipes/1', '_blank')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Xem trang chi tiết
              </Button>
              <Button 
                onClick={() => window.open('/knorr-style-demo', '_blank')}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Xem demo components
              </Button>
              <Button 
                onClick={() => window.open('/admin', '_blank')}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Admin Panel
              </Button>
            </div>
          </div>

          {/* Status Check */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 Status Check</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">✅ Hoạt động tốt:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Vite dev server (port 8083)
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    React Router navigation
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Tailwind CSS styling
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Component rendering
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">⚠️ Cần lưu ý:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Port 8083 thay vì 8080
                  </li>
                  <li className="flex items-center text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Route /recipes/:id (có 's')
                  </li>
                  <li className="flex items-center text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Một số components phức tạp đã tạm disable
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default TestPage;
