
import { Button } from '@/components/ui/button';
import { ChefHat, Calendar, User, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-green-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        {isAuthenticated ? (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chào mừng trở lại, {user?.name}!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Khám phá thêm nhiều công thức mới và tạo kế hoạch bữa ăn cho tuần này
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu hành trình ẩm thực của bạn
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia Angiday để truy cập đầy đủ các tính năng lập kế hoạch bữa ăn và quản lý công thức cá nhân
            </p>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <ChefHat className="h-12 w-12 mb-4" />
            <h3 className="font-semibold mb-2">Công thức cá nhân</h3>
            <p className="text-sm opacity-90 text-center">
              Lưu trữ và quản lý các công thức yêu thích của bạn
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <Calendar className="h-12 w-12 mb-4" />
            <h3 className="font-semibold mb-2">Lập kế hoạch bữa ăn</h3>
            <p className="text-sm opacity-90 text-center">
              Tạo thực đơn tuần và danh sách đi chợ tự động
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <User className="h-12 w-12 mb-4" />
            <h3 className="font-semibold mb-2">Cộng đồng</h3>
            <p className="text-sm opacity-90 text-center">
              Chia sẻ công thức và học hỏi từ những người khác
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8" asChild>
                <Link to="/meal-planner">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tạo kế hoạch bữa ăn
                </Link>
              </Button>
              <Button size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-gray-900 px-8" asChild>
                <Link to="/recipes">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Khám phá công thức
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8" asChild>
                <Link to="/register">
                  Đăng ký miễn phí
                </Link>
              </Button>
              <Button size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-gray-900 px-8" asChild>
                <Link to="/login">
                  Tìm hiểu thêm
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
