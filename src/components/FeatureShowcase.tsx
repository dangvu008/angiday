import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShoppingCart, ChefHat, Clock, Users, DollarSign, CheckCircle } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Angiday Làm Việc Như Thế Nào?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá cách Angiday giúp bạn tiết kiệm thời gian và tạo ra những bữa ăn ngon mỗi ngày
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature 1: Lên Kế Hoạch Thông Minh */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Lên Kế Hoạch Thông Minh</h3>
                  <p className="text-gray-600">Tạo thực đơn tuần chỉ trong vài phút</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Giao diện tập trung vào từng ngày</p>
                    <p className="text-sm text-gray-600">Không còn bối rối với quá nhiều thông tin cùng lúc</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Thêm/thay thế món ăn dễ dàng</p>
                    <p className="text-sm text-gray-600">Chỉ cần click và chọn, không cần nhập liệu phức tạp</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phân tích dinh dưỡng tự động</p>
                    <p className="text-sm text-gray-600">Theo dõi calories và chi phí theo thời gian thực</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* Mockup Meal Planner */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">Hôm nay: Thứ Sáu, 06/06</h4>
                  <Badge className="bg-green-100 text-green-700">Đã lên kế hoạch</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                        ☕
                      </div>
                      <span className="font-medium">Bữa Sáng</span>
                    </div>
                    <div className="bg-white rounded p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">🍚</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Xôi gấc</p>
                        <p className="text-xs text-gray-500">300 kcal • 15.000đ</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        🍚
                      </div>
                      <span className="font-medium">Bữa Trưa</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white rounded p-2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center text-xs">🥩</div>
                        <span className="text-sm">Thịt rang cháy cạnh</span>
                      </div>
                      <div className="bg-white rounded p-2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-xs">🥬</div>
                        <span className="text-sm">Rau muống luộc</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        🌙
                      </div>
                      <span className="font-medium">Bữa Tối</span>
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-dashed border-gray-300 text-center">
                      <span className="text-sm text-gray-500">+ Thêm món cho bữa tối</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          {/* Feature 2: Đi Chợ Thảnh Thơi */}
          <div>
            {/* Mockup Shopping List */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">Danh sách đi chợ</h4>
                  <Badge className="bg-blue-100 text-blue-700">Tuần này</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Thịt cá (3 món)</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">500g thịt ba chỉ</span>
                        <span className="text-xs text-gray-500 ml-auto">~80.000đ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked className="rounded" />
                        <span className="text-sm line-through text-gray-500">300g cá thu</span>
                        <span className="text-xs text-gray-400 ml-auto">~60.000đ</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🥬</span>
                      <span className="font-medium text-sm">Rau củ (5 món)</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">1 bó rau muống</span>
                        <span className="text-xs text-gray-500 ml-auto">~8.000đ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">2 quả cà chua</span>
                        <span className="text-xs text-gray-500 ml-auto">~12.000đ</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tổng ước tính:</span>
                      <span className="font-bold text-blue-600">~285.000đ</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Tiết kiệm 15% so với tuần trước
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Đi Chợ Thảnh Thơi</h3>
                  <p className="text-gray-600">Danh sách mua sắm thông minh, gom nhóm tự động</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Tự động gom nhóm nguyên liệu</p>
                    <p className="text-sm text-gray-600">Thịt cá, rau củ, gia vị được phân loại rõ ràng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Ước tính chi phí chính xác</p>
                    <p className="text-sm text-gray-600">Biết trước sẽ tốn bao nhiều tiền, không lo vượt ngân sách</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Tick hoàn thành khi mua xong</p>
                    <p className="text-sm text-gray-600">Không bao giờ quên mua gì hay mua thừa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sẵn sàng trải nghiệm?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Hàng ngàn gia đình đã tin tưởng Angiday để quản lý bữa ăn hàng ngày
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Tiết kiệm 2 giờ/tuần</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Giảm 20% chi phí</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>10.000+ người dùng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
