
import { Button } from '@/components/ui/button';
import { ChefHat, Calendar, User } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-green-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bắt đầu hành trình ẩm thực của bạn
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Tham gia Angiday để truy cập đầy đủ các tính năng lập kế hoạch bữa ăn và quản lý công thức cá nhân
        </p>

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
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8">
            Đăng ký miễn phí
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
            Tìm hiểu thêm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
