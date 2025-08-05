import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FeaturedFunctions = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khám Phá Chức Năng Mới
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hai tính năng đặc biệt được thiết kế để giúp bạn nấu ăn ngon hơn và lập kế hoạch bữa ăn hiệu quả hơn
          </p>
        </div>

        {/* Featured Functions Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Thư viện công thức */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <ChefHat className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="h-4 w-4" />
                      <span>Mới</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Thư viện công thức
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    20 món ăn truyền thống Việt Nam được tuyển chọn kỹ lưỡng, 
                    từ những món quen thuộc đến các đặc sản vùng miền.
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>20 công thức</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>15-60 phút</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>2-6 người</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/recipes-library" className="flex items-center justify-center space-x-2">
                      <span className="font-medium">Khám phá ngay</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thực đơn hàng ngày */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="h-4 w-4" />
                      <span>Mới</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Thực đơn hàng ngày
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    20 thực đơn được thiết kế sẵn cho mọi dịp, từ bữa ăn gia đình 
                    đến tiệc tùng, giúp bạn tiết kiệm thời gian lập kế hoạch.
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>20 thực đơn</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Sẵn sàng dùng</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Mọi dịp</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/daily-menu" className="flex items-center justify-center space-x-2">
                      <span className="font-medium">Xem thực đơn</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Bắt đầu hành trình nấu ăn của bạn ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              asChild 
              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
            >
              <Link to="/recipes">
                Xem tất cả công thức
              </Link>
            </Button>
            <Button 
              asChild 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            >
              <Link to="/kitchen">
                Trung tâm điều khiển bếp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFunctions;
