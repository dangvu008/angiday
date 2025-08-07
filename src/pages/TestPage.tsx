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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">✅ Layout đã được chuẩn hóa!</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Chúc mừng! Hệ thống layout đã được chuẩn hóa thành công:
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="font-semibold text-green-900">Layout Status: </span>
                <span className="text-green-600 font-bold">STANDARDIZED</span>
              </div>
              <div className="mt-2 text-sm text-green-800">
                <p>✅ StandardLayout và DemoLayout đã hoạt động</p>
                <p>✅ 8/40+ trang đã được chuẩn hóa (20%)</p>
                <p>✅ Design system thống nhất</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Thành tựu đã đạt được</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Layout Components</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  StandardLayout - Trang chính
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  DemoLayout - Trang demo
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Header/Footer tự động
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Responsive design
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Trang đã chuẩn hóa</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Index, MealPlanning
                </li>
                <li className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Recipes, MenuCatalog
                </li>
                <li className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Demo pages (4 trang)
                </li>
                <li className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Test & Validation
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Tiến độ hoàn thành</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Layout Components</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">100%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Main Pages (4/15)</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">27%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-800">Demo Pages (4/25+)</span>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">16%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <span className="font-medium text-orange-800">Tổng tiến độ (8/40+)</span>
              <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">20%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🚀 Kế hoạch tiếp theo</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Ưu tiên cao:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Cập nhật RecipeDetailPage, LoginPage, RegisterPage</li>
                <li>• Cập nhật ProfilePage, MealPlansPage</li>
                <li>• Cập nhật BlogPage và các trang content</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Ưu tiên trung bình:</h4>
              <ul className="space-y-1 text-yellow-700">
                <li>• Cập nhật các demo pages còn lại</li>
                <li>• Import/Export demos</li>
                <li>• System test pages</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button 
            onClick={() => window.open('/', '_blank')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Xem trang chủ
          </Button>
          <Button 
            onClick={() => window.open('/smart-meal-planning-demo', '_blank')}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Demo meal planning
          </Button>
          <Button 
            onClick={() => window.open('/knorr-style-demo', '_blank')}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Knorr style demo
          </Button>
        </div>
      </div>
    </DemoLayout>
  );
};

export default TestPage;
