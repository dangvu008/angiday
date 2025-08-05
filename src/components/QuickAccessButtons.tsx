import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const QuickAccessButtons = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Thư viện công thức - Quick Access */}
      <Card className="group hover:shadow-lg transition-all duration-300 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>Thư viện công thức</span>
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </h3>
                <p className="text-sm text-gray-600">20 món ăn truyền thống Việt Nam</p>
              </div>
            </div>
            <Button 
              asChild 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-md group-hover:shadow-lg transition-all duration-300"
            >
              <Link to="/recipes-library" className="flex items-center space-x-1">
                <span>Khám phá</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thực đơn hàng ngày - Quick Access */}
      <Card className="group hover:shadow-lg transition-all duration-300 border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>Thực đơn hàng ngày</span>
                  <Sparkles className="h-4 w-4 text-green-500" />
                </h3>
                <p className="text-sm text-gray-600">20 thực đơn được thiết kế sẵn</p>
              </div>
            </div>
            <Button 
              asChild 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-white shadow-md group-hover:shadow-lg transition-all duration-300"
            >
              <Link to="/daily-menu" className="flex items-center space-x-1">
                <span>Xem thực đơn</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccessButtons;
