import React from 'react';
import DemoLayout from '@/components/layout/DemoLayout';

const BatchImportDemoPage = () => {
  return (
    <DemoLayout
      title="Demo Batch Import"
      description="Demo import hàng loạt công thức và thực đơn"
      mainClassName="py-8"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Batch Import Demo
            </h1>
            <p className="text-xl text-gray-600">
              Tính năng batch import đã được tích hợp thành công!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">✅ Trang demo đã hoạt động!</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Route <code className="bg-gray-100 px-2 py-1 rounded">/batch-import-demo</code> đã được cấu hình thành công.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Để test tính năng Batch Import:</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Truy cập trang <strong>Admin</strong> tại <code>http://localhost:8080/admin</code></li>
                  <li>Chọn tab <strong>"Recipe Management"</strong></li>
                  <li>Click nút <strong>"Batch Import"</strong> (màu gradient xanh-tím)</li>
                  <li>Test các tính năng: URL import, File import, Preview, Duplicate detection, v.v.</li>
                </ol>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-semibold text-green-800 mb-2">🎯 Tính năng đã hoàn thành:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-green-700">
                  <div>✅ Batch URL Import</div>
                  <div>✅ File Import (JSON/CSV/TXT)</div>
                  <div>✅ Progress Tracking</div>
                  <div>✅ Error Handling</div>
                  <div>✅ Preview & Review</div>
                  <div>✅ Duplicate Detection</div>
                  <div>✅ Bulk Actions</div>
                  <div>✅ Smart Ingredient Input</div>
                </div>
              </div>

              <div className="text-center space-x-4 space-y-2">
                <div className="space-x-4">
                  <a
                    href="/admin"
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    🎮 Đi đến Admin Panel để test
                  </a>
                  <a
                    href="/import-test-demo"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all"
                  >
                    🧪 Test Import API
                  </a>
                </div>
                <div className="space-x-4">
                  <a
                    href="/meal-plan-importer"
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                  >
                    📥 Import từ MonNgonMoiNgay
                  </a>
                  <a
                    href="/ke-hoach-nau-an"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                  >
                    📅 Kế hoạch nấu ăn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default BatchImportDemoPage;
