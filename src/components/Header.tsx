
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X, ChefHat, Heart, Home, BookOpen, FileText, Info, Calendar, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth as useNewAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { user: newUser, isAdmin, isChef } = useNewAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Knorr Style */}
          <Link to="/" className="flex items-center space-x-3 text-orange-600 hover:text-orange-700 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Angiday</span>
          </Link>

          {/* Navigation Menu - Redesigned */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-12">

              {/* Trang chủ */}
              <Link to="/" className="flex flex-col items-center group py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                <Home className="h-5 w-5 text-gray-600 group-hover:text-orange-600 mb-1" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Trang chủ</span>
              </Link>

              {/* Công thức */}
              <div className="relative group">
                <button className="flex flex-col items-center py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <BookOpen className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
                    <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Công thức</span>
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-6 space-y-3">
                    <Link to="/recipes" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-600"></div>
                      <span className="font-medium">Toàn bộ công thức</span>
                    </Link>
                    <Link to="/recipes/main-dishes" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:bg-red-600"></div>
                      <span className="font-medium">Món chính</span>
                    </Link>
                    <Link to="/recipes/appetizers" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-600"></div>
                      <span className="font-medium">Món khai vị</span>
                    </Link>
                    <Link to="/recipes/desserts" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-600"></div>
                      <span className="font-medium">Món tráng miệng</span>
                    </Link>
                    <Link to="/recipes/tips" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600"></div>
                      <span className="font-medium">Mẹo vặt</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Thực đơn */}
              <div className="relative group">
                <button className="flex flex-col items-center py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <ChefHat className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
                    <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Thực đơn</span>
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-6 space-y-3">
                    <Link to="/thuc-don" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-600"></div>
                      <span className="font-medium">Tất cả thực đơn</span>
                    </Link>
                    <Link to="/thuc-don/category/an-chay" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-600"></div>
                      <span className="font-medium">Thực đơn ăn chay</span>
                    </Link>
                    <Link to="/thuc-don/category/giam-can" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600"></div>
                      <span className="font-medium">Thực đơn giảm cân</span>
                    </Link>
                    <Link to="/thuc-don/category/gia-dinh" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-600"></div>
                      <span className="font-medium">Thực đơn gia đình</span>
                    </Link>
                    <Link to="/thuc-don/category/tiet-kiem" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:bg-red-600"></div>
                      <span className="font-medium">Thực đơn tiết kiệm</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Kế hoạch nấu ăn */}
              <div className="relative group">
                <button className="flex flex-col items-center py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
                    <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 text-center leading-tight">Kế hoạch<br/>nấu ăn</span>
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-6 space-y-3">
                    <Link to="/ke-hoach-nau-an" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-600"></div>
                      <span className="font-medium">Kế hoạch nấu ăn</span>
                    </Link>
                    <Link to="/meal-planner" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-600"></div>
                      <span className="font-medium">Kế hoạch cá nhân</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bài viết */}
              <Link to="/blog" className="flex flex-col items-center group py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                <FileText className="h-5 w-5 text-gray-600 group-hover:text-orange-600 mb-1" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Bài viết</span>
              </Link>

              {/* Về chúng tôi */}
              <Link to="/about" className="flex flex-col items-center group py-3 px-4 hover:bg-orange-50 rounded-xl transition-all duration-200">
                <Info className="h-5 w-5 text-gray-600 group-hover:text-orange-600 mb-1" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 text-center leading-tight">Về chúng<br/>tôi</span>
              </Link>

            </div>
          </nav>

          {/* User Actions - Knorr Style */}
          <div className="flex items-center space-x-4">

            {/* Favorites */}
            <Button variant="ghost" size="icon" asChild className="hidden md:flex text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full">
              <Link to="/my-favorites">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full p-2"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=f97316&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{user?.name}</span>
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{newUser?.name || user?.name}</div>
                        <div className="text-xs text-gray-500">{newUser?.email || user?.email}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {isAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              🛡️ Admin
                            </span>
                          )}
                          {isChef && !isAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              👨‍🍳 Chef
                            </span>
                          )}
                          {!isAdmin && !isChef && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              👤 User
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Cài đặt tài khoản
                      </Link>
                      <Link
                        to="/my-meal-plans"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Kế hoạch của tôi
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button variant="outline" className="text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-600" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" asChild>
                    <Link to="/register">
                      Đăng ký
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Knorr Style */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-6">

              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                <Link to="/" className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors font-medium py-2">
                  <Home className="h-5 w-5" />
                  <span>Trang chủ</span>
                </Link>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-gray-700 font-medium py-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Công thức</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <Link to="/recipes" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Toàn bộ món
                    </Link>
                    <Link to="/recipes/featured" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Món nổi bật
                    </Link>
                    <Link to="/recipes/tips" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Mẹo vặt
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-gray-700 font-medium py-2">
                    <ChefHat className="h-5 w-5" />
                    <span>Thực đơn</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <Link to="/thuc-don" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Tất cả thực đơn
                    </Link>
                    <Link to="/thuc-don/category/an-chay" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Thực đơn ăn chay
                    </Link>
                    <Link to="/thuc-don/category/giam-can" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Thực đơn giảm cân
                    </Link>
                    <Link to="/thuc-don/category/gia-dinh" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Thực đơn gia đình
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-gray-700 font-medium py-2">
                    <Calendar className="h-5 w-5" />
                    <span>Kế hoạch nấu ăn</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <Link to="/ke-hoach-nau-an" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Kế hoạch nấu ăn
                    </Link>
                    <Link to="/meal-planner" className="block text-gray-600 hover:text-orange-600 transition-colors py-1">
                      Kế hoạch cá nhân
                    </Link>
                  </div>
                </div>

                <Link to="/blog" className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors font-medium py-2">
                  <FileText className="h-5 w-5" />
                  <span>Bài viết</span>
                </Link>

                <Link to="/about" className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors font-medium py-2">
                  <Info className="h-5 w-5" />
                  <span>Về chúng tôi</span>
                </Link>

                <Link to="/my-favorites" className="flex items-center space-x-3 text-red-500 hover:text-red-600 transition-colors font-medium py-2">
                  <Heart className="h-5 w-5" />
                  <span>Yêu thích</span>
                </Link>
              </nav>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=f97316&color=fff`}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-300 hover:border-red-500 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-600" asChild>
                      <Link to="/login">
                        <User className="h-4 w-4 mr-2" />
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" asChild>
                      <Link to="/register">
                        Đăng ký
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
