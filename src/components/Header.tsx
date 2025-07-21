
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X, ChefHat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <ChefHat className="h-8 w-8" />
            <span className="text-xl font-bold">Angiday</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Trang chủ
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
              Tin tức & Mẹo vặt
            </Link>
            <Link to="/recipes" className="text-foreground hover:text-primary transition-colors font-medium">
              Công thức
            </Link>
            <Link to="/meal-plans" className="text-foreground hover:text-primary transition-colors font-medium">
              Thực đơn mẫu
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/my-favorites" className="text-foreground hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button asChild>
              <Link to="/register">
                Đăng ký
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium px-2">
                Trang chủ
              </Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium px-2">
                Tin tức & Mẹo vặt
              </Link>
              <Link to="/recipes" className="text-foreground hover:text-primary transition-colors font-medium px-2">
                Công thức
              </Link>
              <Link to="/meal-plans" className="text-foreground hover:text-primary transition-colors font-medium px-2">
                Thực đơn mẫu
              </Link>
              <Link to="/my-favorites" className="text-foreground hover:text-red-500 transition-colors font-medium px-2 flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Yêu thích
              </Link>
              <div className="flex flex-col space-y-2 px-2 pt-4 border-t">
                <Button variant="ghost" className="justify-start text-foreground hover:text-primary" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">
                    Đăng ký
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
