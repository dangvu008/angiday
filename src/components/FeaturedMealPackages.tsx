import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Users, Heart, Leaf, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MealPackage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  servings: string;
  rating: number;
  reviews: number;
  tags: string[];
  preview: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  highlights: string[];
  sampleMeals: string[];
}

const mealPackages: MealPackage[] = [
  {
    id: 'family-7-days',
    title: 'Thực Đơn 7 Ngày Cho Cả Nhà',
    subtitle: 'Chỉ 100k/bữa',
    description: 'Đa dạng món ăn, cân bằng dinh dưỡng, dễ nấu và phù hợp với ngân sách của bạn.',
    image: '/images/family-meal.jpg',
    price: '100.000đ/bữa',
    duration: '7 ngày',
    servings: '4 người',
    rating: 4.8,
    reviews: 1247,
    tags: ['Gia đình', 'Tiết kiệm', 'Đa dạng'],
    preview: {
      monday: ['Thịt kho tàu', 'Canh chua cá basa', 'Rau muống xào tỏi', 'Cơm trắng'],
      tuesday: ['Gà rang gừng', 'Canh bí đỏ tôm khô', 'Đậu phụ sốt cà chua', 'Cơm trắng'],
      wednesday: ['Cá thu sốt cà chua', 'Canh rau ngót nấu tôm', 'Thịt ba chỉ luộc', 'Cơm trắng'],
      thursday: ['Sườn xào chua ngọt', 'Canh khổ qua nhồi thịt', 'Rau cải luộc', 'Cơm trắng'],
      friday: ['Tôm rang me', 'Canh chua cá lóc', 'Trứng chiên', 'Cơm trắng'],
      saturday: ['Thịt nướng lá lốt', 'Canh bầu nấu tôm', 'Rau muống luộc', 'Cơm trắng'],
      sunday: ['Gà nướng mật ong', 'Canh chua đầu cá', 'Đậu que xào', 'Cơm trắng']
    },
    highlights: ['Tiết kiệm 30% chi phí', 'Thời gian nấu dưới 45 phút', 'Nguyên liệu dễ tìm'],
    sampleMeals: [
      'Thứ 2: Thịt kho tàu, Canh chua cá basa',
      'Thứ 3: Gà rang gừng, Canh bí đỏ tôm khô',
      'Thứ 4: Cá thu sốt cà chua, Canh rau ngót',
      '... và hơn thế nữa'
    ]
  },
  {
    id: 'pregnancy-nutrition',
    title: 'Thực Đơn 7 Ngày Dinh Dưỡng Vàng Cho Mẹ Bầu',
    subtitle: 'Khoa học & An toàn',
    description: 'Cung cấp đầy đủ Sắt, Canxi, Axit Folic... giúp mẹ khỏe, bé thông minh.',
    image: '/images/pregnancy-meal.jpg',
    price: '150.000đ/bữa',
    duration: '7 ngày',
    servings: '2 người',
    rating: 4.9,
    reviews: 892,
    tags: ['Mẹ bầu', 'Dinh dưỡng', 'An toàn'],
    preview: {
      monday: ['Cháo tôm rau ngót', 'Thịt bò xào rau củ', 'Sữa chua trái cây', 'Bánh mì ngũ cốc'],
      tuesday: ['Cháo cá hồi rau xanh', 'Gà hấp lá chanh', 'Sinh tố bơ sữa', 'Bánh quy yến mạch'],
      wednesday: ['Cháo thịt bằm rau cải', 'Cá thu nướng giấy bạc', 'Nước ép cam tươi', 'Bánh mì đen'],
      thursday: ['Cháo tôm bí đỏ', 'Thịt heo luộc rau sống', 'Sữa đậu nành', 'Bánh crackers'],
      friday: ['Cháo gà rau ngót', 'Cá điêu hồng hấp', 'Sinh tố dâu tây', 'Bánh mì sandwich'],
      saturday: ['Cháo bò rau cải', 'Tôm hấp bia', 'Nước ép táo', 'Bánh quy bơ'],
      sunday: ['Cháo cá hồi bí ngô', 'Gà nướng mật ong', 'Sữa chua Hy Lạp', 'Bánh mì nướng']
    },
    highlights: ['Đầy đủ vitamin thiết yếu', 'Tư vấn dinh dưỡng miễn phí', 'Theo dõi sức khỏe'],
    sampleMeals: [
      'Thứ 2: Bò hầm tiêu xanh, Canh bí đỏ nấu tôm',
      'Thứ 3: Cá hồi áp chảo, Salad bơ và rau xanh',
      'Thứ 4: Cháo chim bồ câu hạt sen, Sinh tố bơ',
      '... và hơn thế nữa'
    ]
  },
  {
    id: 'vegetarian-diverse',
    title: 'Thực Đơn Chay Đủ Chất, Không Nhàm Chán',
    subtitle: 'Đa dạng & Hấp dẫn',
    description: 'Gợi ý các món chay từ khắp nơi trên thế giới, dễ thực hiện tại nhà.',
    image: '/images/vegetarian-meal.jpg',
    price: '80.000đ/bữa',
    duration: '7 ngày',
    servings: '3 người',
    rating: 4.7,
    reviews: 634,
    tags: ['Chay', 'Đa dạng', 'Quốc tế'],
    preview: {
      monday: ['Cơm âm phủ', 'Canh chua chay', 'Đậu hũ sốt nấm', 'Rau muống luộc'],
      tuesday: ['Mì Quảng chay', 'Gỏi cuốn chay', 'Chả cá chay', 'Nước mắm chay'],
      wednesday: ['Cơm chiên Dương Châu chay', 'Canh bí đỏ', 'Thịt nướng chay', 'Dưa chua'],
      thursday: ['Phở chay', 'Nem nướng chay', 'Chả lụa chay', 'Rau thơm'],
      friday: ['Cơm tấm chay', 'Canh chua chay', 'Sườn nướng chay', 'Đồ chua'],
      saturday: ['Bún bò Huế chay', 'Chả cá Lã Vọng chay', 'Giò thủ chay', 'Rau sống'],
      sunday: ['Cơm gà chay', 'Canh khổ qua nhồi thịt chay', 'Tôm rang me chay', 'Dưa leo']
    },
    highlights: ['100% thực vật', 'Protein đầy đủ', 'Hương vị đặc sắc'],
    sampleMeals: [
      'Thứ 2: Cơm âm phủ, Canh chua chay',
      'Thứ 3: Mì Quảng chay, Gỏi cuốn chay',
      'Thứ 4: Cơm chiên Dương Châu chay, Canh bí đỏ',
      '... và hơn thế nữa'
    ]
  }
];

const FeaturedMealPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<MealPackage | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewPreview = (pkg: MealPackage) => {
    setSelectedPackage(pkg);
  };

  const handleSignUpForPackage = (packageId: string) => {
    // Close modal first
    setSelectedPackage(null);
    // Navigate to registration with package info
    navigate(`/register?package=${packageId}`);
  };

  const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
      monday: 'Thứ Hai',
      tuesday: 'Thứ Ba', 
      wednesday: 'Thứ Tư',
      thursday: 'Thứ Năm',
      friday: 'Thứ Sáu',
      saturday: 'Thứ Bảy',
      sunday: 'Chủ Nhật'
    };
    return dayNames[day] || day;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Angiday Có Sẵn Giải Pháp Cho Gia Đình Bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Không cần tự mình lên kế hoạch phức tạp. Chúng tôi đã chuẩn bị sẵn những thực đơn hoàn hảo cho mọi nhu cầu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mealPackages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                index === 0 ? 'md:scale-105 border-2 border-orange-200' : ''
              }`}
            >
              {index === 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 font-semibold">
                  🔥 Phổ biến nhất
                </div>
              )}
              
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <div className="text-6xl">
                    {index === 0 ? '👨‍👩‍👧‍👦' : index === 1 ? '🤱' : '🌱'}
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-xs text-gray-500">({pkg.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <p className="text-lg font-semibold text-orange-600 mb-2">{pkg.subtitle}</p>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <div className="font-medium">{pkg.price}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <div className="font-medium">{pkg.duration}</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <div className="font-medium">{pkg.servings}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">🍽️ Thực đơn mẫu:</h4>
                  {pkg.sampleMeals.map((meal, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{meal}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleViewPreview(pkg)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Xem Toàn Bộ Thực Đơn Tuần
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Angiday không chỉ gợi ý, mà còn là trợ thủ đắc lực với các công cụ: <br />
            <span className="font-semibold">Lên Kế Hoạch Thông Minh</span> và <span className="font-semibold">Đi Chợ Không Lo Thiếu</span>
          </p>
          {user ? (
            // Hiển thị khi đã đăng nhập
            <Button
              size="lg"
              onClick={() => navigate('/meal-planning')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Bắt đầu lên kế hoạch bữa ăn ngay! 🍽️
            </Button>
          ) : (
            // Hiển thị khi chưa đăng nhập
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Đăng ký miễn phí để trút bỏ gánh nặng bếp núc ngay hôm nay! 🎉
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-4">
                  {selectedPackage.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-4">{selectedPackage.description}</p>
                  <div className="flex justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{selectedPackage.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{selectedPackage.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{selectedPackage.servings}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(selectedPackage.preview).map(([day, meals]) => (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{getDayName(day)}</h4>
                      <ul className="space-y-2">
                        {meals.map((meal, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            {meal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-800 mb-3">🎯 Lợi ích đặc biệt</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedPackage.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Heart className="h-4 w-4 text-red-500" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Bạn thích thực đơn này? 
                  </p>
                  <p className="text-gray-600">
                    Đăng ký ngay để nhận công thức chi tiết, danh sách mua sắm và nhiều tiện ích khác!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => handleSignUpForPackage(selectedPackage.id)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Đăng ký ngay - Miễn phí! 🚀
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedPackage(null)}
                      className="px-8 py-3 rounded-full"
                    >
                      Xem thêm gói khác
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedMealPackages;
