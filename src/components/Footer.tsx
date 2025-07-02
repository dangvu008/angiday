
import { Link } from 'react-router-dom';
import { ChefHat, User, Book } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo và mô tả */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-orange-600 mb-4">
              <ChefHat className="h-8 w-8" />
              <span className="text-xl font-bold">Angiday</span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Trung tâm ẩm thực Việt Nam - Nơi kết nối đam mê nấu ăn với những công thức và mẹo vặt hữu ích cho mọi gia đình.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Khám phá</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Tin tức & Mẹo vặt
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Công thức nấu ăn
                </Link>
              </li>
              <li>
                <Link to="/meal-plans" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Thực đơn mẫu
                </Link>
              </li>
            </ul>
          </div>

          {/* Tài khoản */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tài khoản</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link to="/my-recipes" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Công thức của tôi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 Angiday. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
