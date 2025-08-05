import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ChefHat, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NewFeaturesNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen this notification before
    const hasSeenNotification = localStorage.getItem('hasSeenNewFeaturesNotification');
    
    if (!hasSeenNotification) {
      // Show notification after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenNewFeaturesNotification', 'true');
  };

  const handleExplore = () => {
    localStorage.setItem('hasSeenNewFeaturesNotification', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-lg">Chức năng mới!</h3>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                    <ChefHat className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thư viện công thức</p>
                    <p className="text-xs text-white/80">20 món ăn truyền thống</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thực đơn hàng ngày</p>
                    <p className="text-xs text-white/80">20 thực đơn thiết kế sẵn</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 flex-1"
                >
                  Để sau
                </Button>
                <Button
                  asChild
                  onClick={handleExplore}
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-white/90 flex-1 font-medium"
                >
                  <Link to="/recipes-library" className="flex items-center justify-center space-x-1">
                    <span>Khám phá</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewFeaturesNotification;
