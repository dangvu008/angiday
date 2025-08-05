import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CookingModeStarter from './CookingModeStarter';
import { Recipe } from '@/services/kitchenService';

const CookingModeDemo: React.FC = () => {
  // Sample Vietnamese recipes for demo
  const sampleRecipes: Recipe[] = [
    {
      id: 'pho-bo',
      name: 'Phở Bò Hà Nội',
      description: 'Món phở bò truyền thống với nước dùng trong vắt, thơm ngon',
      ingredients: [
        '500g thịt bò (nạm, gầu)',
        '200g bánh phở tươi',
        '1 củ hành tây',
        '3 tép tỏi',
        '2 muỗng canh nước mắm',
        '1 muỗng cà phê đường',
        'Hành lá, ngò gai, giá đỗ',
        'Chanh, ớt tươi'
      ],
      instructions: [
        'Thái thịt bò thành lát mỏng, ướp với một chút nước mắm và đường trong 15 phút',
        'Thái hành tây thành lát mỏng, băm nhỏ tỏi',
        'Đun sôi nước, cho bánh phở vào luộc 2-3 phút rồi vớt ra',
        'Phi thơm hành tây và tỏi trong chảo với một chút dầu ăn',
        'Cho thịt bò vào xào nhanh tay trong 3-4 phút',
        'Nêm nếm với nước mắm, đường vừa ăn',
        'Cho bánh phở vào tô, xếp thịt bò lên trên',
        'Rắc hành lá, ngò gai, giá đỗ. Ăn kèm chanh và ớt'
      ],
      prepTime: 20,
      cookTime: 30,
      servings: 2,
      difficulty: 'medium',
      tags: ['vietnamese', 'noodles', 'beef']
    },
    {
      id: 'canh-chua-ca',
      name: 'Canh Chua Cá Lóc',
      description: 'Món canh chua truyền thống miền Nam với cá lóc tươi ngon',
      ingredients: [
        '400g cá lóc',
        '200g dứa',
        '100g đậu bắp',
        '50g giá đỗ',
        '2 quả cà chua',
        '2 muỗng canh me',
        '1 muỗng canh đường',
        '2 muỗng canh nước mắm',
        'Hành lá, ngò gai'
      ],
      instructions: [
        'Sơ chế cá lóc, cắt khúc vừa ăn, ướp với chút muối trong 10 phút',
        'Thái dứa miếng vừa, cà chua múi cau, đậu bắp thái chéo',
        'Nấu nước dùng từ xương cá hoặc dùng nước lọc trong 15 phút',
        'Cho dứa và cà chua vào nấu 5 phút',
        'Thêm me, đường, nước mắm nêm nếm vừa ăn',
        'Cho cá vào nấu 8-10 phút',
        'Cuối cùng cho đậu bắp và giá đỗ vào nấu 2 phút',
        'Tắt bếp, rắc hành lá và ngò gai'
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'easy',
      tags: ['vietnamese', 'soup', 'fish']
    },
    {
      id: 'com-chien-duong-chau',
      name: 'Cơm Chiên Dương Châu',
      description: 'Món cơm chiên thập cẩm với tôm, xúc xích và trứng',
      ingredients: [
        '3 chén cơm nguội',
        '200g tôm',
        '2 quả trứng',
        '100g xúc xích',
        '50g đậu Hà Lan',
        '2 tép tỏi',
        '2 muỗng canh nước mắm',
        '1 muỗng cà phê đường',
        'Hành lá'
      ],
      instructions: [
        'Sơ chế tôm, bóc vỏ và rửa sạch',
        'Thái xúc xích thành hạt lựu, băm nhỏ tỏi',
        'Đánh tan trứng, chiên thành miếng nhỏ',
        'Phi thơm tỏi, cho tôm vào xào 2 phút',
        'Thêm xúc xích xào cùng 1 phút',
        'Cho cơm vào xào đều tay trong 3-4 phút',
        'Thêm đậu Hà Lan, trứng chiên, nêm nếm',
        'Xào thêm 2 phút, rắc hành lá và tắt bếp'
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 3,
      difficulty: 'easy',
      tags: ['vietnamese', 'rice', 'fried']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🍳 Demo Chế Độ Nấu Ăn
        </h1>
        <p className="text-lg text-gray-600">
          Trải nghiệm tính năng nấu ăn thông minh với các món ăn Việt Nam truyền thống
        </p>
      </div>

      {/* Single Recipe Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-orange-600">
            🥢 Nấu một món
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Chọn một món để trải nghiệm chế độ nấu ăn với hướng dẫn từng bước chi tiết.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {sampleRecipes.map((recipe) => (
              <CookingModeStarter
                key={recipe.id}
                recipes={[recipe]}
                mealName={recipe.name}
                className="h-full"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multiple Recipes Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-600">
            🍽️ Nấu cả bữa ăn (Nhiều món)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Nấu nhiều món cùng lúc với timeline được tối ưu hóa thông minh.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bữa trưa đơn giản */}
            <CookingModeStarter
              recipes={[sampleRecipes[0], sampleRecipes[1]]} // Phở + Canh chua
              mealName="Bữa trưa truyền thống"
              className="h-full"
            />
            
            {/* Bữa tối đầy đủ */}
            <CookingModeStarter
              recipes={sampleRecipes} // Tất cả 3 món
              mealName="Bữa tối gia đình"
              className="h-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">
            ✨ Tính năng nổi bật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-800">Thông minh & Tự động</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Timer tự động cho từng bước nấu</li>
                <li>• Tối ưu thứ tự nấu nhiều món</li>
                <li>• Giao diện tối ưu cho bếp</li>
                <li>• Giữ màn hình luôn sáng</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-800">Rảnh tay & Tiện lợi</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Đọc hướng dẫn bằng giọng nói</li>
                <li>• Điều khiển bằng cử chỉ vuốt</li>
                <li>• Font chữ lớn, dễ đọc</li>
                <li>• Chế độ tối cho bếp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">
            📝 Hướng dẫn sử dụng
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>Bước 1:</strong> Chọn món ăn hoặc bữa ăn bạn muốn nấu</p>
            <p><strong>Bước 2:</strong> Nhấn "Bắt đầu Nấu ăn" để vào chế độ nấu</p>
            <p><strong>Bước 3:</strong> Làm theo hướng dẫn từng bước</p>
            <p><strong>Mẹo:</strong> Vuốt trái/phải để chuyển bước, nhấn Space để nghe hướng dẫn</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookingModeDemo;
