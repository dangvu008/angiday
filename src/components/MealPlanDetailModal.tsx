import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  ChefHat, 
  Users, 
  Coffee, 
  Sun, 
  Moon, 
  Heart,
  Share2,
  BookOpen,
  X
} from 'lucide-react';

interface MealPlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: {
    id: number;
    day: string;
    breakfast: Array<{
      name: string;
      image: string;
      time: string;
      difficulty: string;
      description: string;
    }>;
    lunch: Array<{
      name: string;
      image: string;
      time: string;
      difficulty: string;
      description: string;
    }>;
    dinner: Array<{
      name: string;
      image: string;
      time: string;
      difficulty: string;
      description: string;
    }>;
  };
}

const MealPlanDetailModal: React.FC<MealPlanDetailModalProps> = ({
  isOpen,
  onClose,
  mealPlan
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-5 w-5" />;
      case 'lunch': return <Sun className="h-5 w-5" />;
      case 'dinner': return <Moon className="h-5 w-5" />;
      default: return <Coffee className="h-5 w-5" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      default: return 'Bữa ăn';
    }
  };

  const MealDetailCard = ({ meals, mealType }: { meals: any[], mealType: string }) => {
    const totalTime = meals.reduce((sum, meal) => sum + parseInt(meal.time), 0);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/90 text-gray-800 flex items-center gap-1">
                {getMealIcon(mealType)}
                {getMealLabel(mealType)}
              </Badge>
              <span className="text-sm text-gray-600">
                {meals.length} món • {totalTime} phút
              </span>
            </div>
            <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Meals List */}
        <div className="p-4 space-y-3">
          {meals.map((meal, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{meal.name}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{meal.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meal.time}
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(meal.difficulty)}`}>
                    <ChefHat className="h-3 w-3 mr-1" />
                    {meal.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <BookOpen className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mealPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{mealPlan.day}</h2>
                <p className="text-sm text-gray-600">Thực đơn đầy đủ cho cả ngày</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Bữa ăn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mealPlan.breakfast.length + mealPlan.lunch.length + mealPlan.dinner.length}
              </div>
              <div className="text-sm text-gray-600">Tổng món</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mealPlan.breakfast.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0) +
                 mealPlan.lunch.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0) +
                 mealPlan.dinner.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0)}
              </div>
              <div className="text-sm text-gray-600">Phút nấu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2-4</div>
              <div className="text-sm text-gray-600">Người ăn</div>
            </div>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MealDetailCard meals={mealPlan.breakfast} mealType="breakfast" />
            <MealDetailCard meals={mealPlan.lunch} mealType="lunch" />
            <MealDetailCard meals={mealPlan.dinner} mealType="dinner" />
          </div>

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-lg mb-3 text-blue-900">💡 Mẹo thực hiện thực đơn</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Chuẩn bị nguyên liệu từ tối hôm trước để tiết kiệm thời gian</p>
              <p>• Có thể thay đổi thứ tự các món tùy theo sở thích gia đình</p>
              <p>• Nên chuẩn bị nước dùng từ sớm cho các món canh, phở</p>
              <p>• Có thể điều chỉnh khẩu phần theo số người ăn trong gia đình</p>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-100">
            <h3 className="font-semibold text-lg mb-3 text-green-900">🥗 Thông tin dinh dưỡng</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">~1800</div>
                <div className="text-green-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">~80g</div>
                <div className="text-green-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">~200g</div>
                <div className="text-green-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">~60g</div>
                <div className="text-green-600">Fat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Yêu thích
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Áp dụng thực đơn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanDetailModal;
