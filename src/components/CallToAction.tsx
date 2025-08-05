
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
            <p className="text-xl mb-6 opacity-90">
              Tham gia Angiday để truy cập đầy đủ các tính năng lập kế hoạch bữa ăn và quản lý công thức cá nhân
            </p>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-300 mr-2" />
                <span className="text-lg font-semibold">Người dùng nói gì về Angiday</span>
              </div>
              <blockquote className="text-lg italic mb-4 opacity-95">
                "Angiday đã thay đổi hoàn toàn việc bếp núc của gia đình mình. Giờ đây mình có nhiều thời gian hơn mà bữa ăn lại đa dạng, đủ chất. Đặc biệt là tính năng tạo danh sách đi chợ rất tiện lợi!"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold">LA</span>
                </div>
                <div>
                  <p className="font-semibold">Chị Lan Anh</p>
                  <p className="text-sm opacity-80">Hà Nội • Mẹ của 2 con</p>
                </div>
              </div>
            </div>
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
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
                <Link to="/register">
                  🚀 Đăng ký miễn phí - Trút bỏ gánh nặng bếp núc ngay!
                </Link>
              </Button>
              <Button size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-gray-900 px-8" asChild>
                <Link to="/login">
                  Đã có tài khoản? Đăng nhập
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
