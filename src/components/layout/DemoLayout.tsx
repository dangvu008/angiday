import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

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

const DemoLayout: React.FC<DemoLayoutProps> = ({
  children,
  title,
  description,
  showBackButton = true,
  showHomeButton = true,
  showFooter = true,
  className = '',
  headerClassName = '',
  mainClassName = '',
  isDemoPage = true
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50 flex flex-col", className)}>
      {/* Demo Header */}
      <header className={cn("bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50", headerClassName)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo và Title */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Angiday</span>
              </Link>
              
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>
                {isDemoPage && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Demo
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {showHomeButton && (
                <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Trang chủ
                  </Link>
                </Button>
              )}
              
              {showBackButton && (
                <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Quay lại</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Description */}
          {description && (
            <div className="pb-4">
              <p className="text-sm text-gray-600 max-w-3xl">{description}</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1", mainClassName)}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default DemoLayout;
