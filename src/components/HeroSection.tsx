
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-green-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Khám phá <span className="text-orange-600">ẩm thực</span><br />
          <span className="text-green-600">Việt Nam</span> mỗi ngày
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Từ những mẹo vặt nhà bếp đến thực đơn hoàn chỉnh, Angiday đồng hành cùng bạn trong hành trình khám phá ẩm thực
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm công thức, mẹo vặt..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
            Khám phá công thức
          </Button>
          <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8">
            Xem thực đơn mẫu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
