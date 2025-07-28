import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, BookOpen, Package, FileText, Info, Search, Heart, User, Clock, Users, ChefHat, Star } from 'lucide-react';

const KnorrSystemDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Demo */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Knorr Style */}
            <div className="flex items-center space-x-3 text-orange-600">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Angiday</span>
            </div>

            {/* Navigation Demo */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-1 text-gray-700 font-medium py-2">
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-600 font-medium py-2">
                <BookOpen className="h-4 w-4" />
                <span>Công thức</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 font-medium py-2">
                <Package className="h-4 w-4" />
                <span>Sản phẩm</span>
              </div>
            </nav>

            {/* Actions Demo */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          
          {/* Title */}
          <div className="text-center">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Knorr Design System</h1>
            <p className="text-xl text-gray-600">Hệ thống thiết kế hoàn chỉnh theo phong cách Knorr</p>
          </div>

          {/* Color Palette */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-full h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-4"></div>
                  <h3 className="font-bold text-gray-900">Primary</h3>
                  <p className="text-sm text-gray-600">Orange to Red</p>
                  <p className="text-xs text-gray-500 mt-2">#F97316 → #EF4444</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-full h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4"></div>
                  <h3 className="font-bold text-gray-900">Success</h3>
                  <p className="text-sm text-gray-600">Green</p>
                  <p className="text-xs text-gray-500 mt-2">#10B981</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4"></div>
                  <h3 className="font-bold text-gray-900">Info</h3>
                  <p className="text-sm text-gray-600">Blue</p>
                  <p className="text-xs text-gray-500 mt-2">#3B82F6</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-full h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl mb-4"></div>
                  <h3 className="font-bold text-gray-900">Neutral</h3>
                  <p className="text-sm text-gray-600">Gray</p>
                  <p className="text-xs text-gray-500 mt-2">#F3F4F6</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Typography</h2>
            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Hero Title</h1>
                  <p className="text-gray-600">text-4xl lg:text-5xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Section Title</h2>
                  <p className="text-gray-600">text-3xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Card Title</h3>
                  <p className="text-gray-600">text-2xl font-bold</p>
                </div>
                <div>
                  <p className="text-lg text-gray-700 mb-2">Body Large - Mô tả chính, lead text</p>
                  <p className="text-gray-600">text-lg text-gray-700</p>
                </div>
                <div>
                  <p className="text-base text-gray-700 mb-2">Body Regular - Nội dung chính, paragraph text</p>
                  <p className="text-gray-600">text-base text-gray-700</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Body Small - Thông tin phụ, captions</p>
                  <p className="text-gray-600">text-sm text-gray-600</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Buttons</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Primary Buttons</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                        Primary Button
                      </Button>
                      <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                        Large Button
                      </Button>
                      <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                        Small Button
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Outline Buttons</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300">
                        Outline Button
                      </Button>
                      <Button variant="outline" className="w-full border-2 border-gray-400 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-500 transition-all duration-300">
                        Neutral Outline
                      </Button>
                      <Button variant="outline" className="w-full rounded-full border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300">
                        Rounded Button
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Icon Buttons</h3>
                    <div className="space-y-3">
                      <Button variant="ghost" size="icon" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full">
                        <Search className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Recipe Card Demo */}
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
                      alt="Demo Recipe"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white border-0 shadow-md">
                      Món chính
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white text-gray-700 border-0 shadow-md w-10 h-10 rounded-full p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      Phở bò truyền thống
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      Công thức phở bò chuẩn vị với nước dùng trong vắt, thơm ngon
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                    <div className="text-center">
                      <Clock className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Thời gian</div>
                      <div className="text-sm font-semibold text-gray-900">3 giờ</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Khẩu phần</div>
                      <div className="text-sm font-semibold text-gray-900">4 người</div>
                    </div>
                    <div className="text-center">
                      <ChefHat className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Độ khó</div>
                      <div className="text-sm font-semibold text-gray-900">Vừa</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Xem công thức
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card Demo */}
              <Card className="text-center p-6 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">30 phút</h3>
                <p className="text-gray-600">Thời gian nấu trung bình</p>
              </Card>

              {/* Info Card Demo */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mr-4">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Bí quyết từ đầu bếp</h3>
                </div>
                <p className="text-green-700">
                  Ninh xương càng lâu nước dùng càng ngọt và trong
                </p>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Áp dụng Knorr Design System</h2>
            <p className="text-xl mb-8 opacity-90">
              Hệ thống thiết kế hoàn chỉnh cho website nấu ăn chuyên nghiệp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
                onClick={() => window.open('/', '_blank')}
              >
                Xem trang chủ
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3"
                onClick={() => window.open('/recipes', '_blank')}
              >
                Xem công thức
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default KnorrSystemDemo;
