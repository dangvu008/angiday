import React, { useState } from 'react';
import { X, Calendar, Clock, Users, ChefHat, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface QuickMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (planId: string) => void;
}

const QuickMealPlanModal: React.FC<QuickMealPlanModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);

  // Sample meal plans for quick selection
  const quickMealPlans = [
    {
      id: 'healthy-week',
      name: 'Thực đơn khỏe mạnh 7 ngày',
      description: 'Thực đơn cân bằng dinh dưỡng cho cả tuần',
      duration: '7 ngày',
      meals: 21,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
      tags: ['Khỏe mạnh', 'Cân bằng', 'Dễ làm']
    },
    {
      id: 'vietnamese-traditional',
      name: 'Thực đơn truyền thống Việt Nam',
      description: 'Các món ăn truyền thống quen thuộc',
      duration: '7 ngày',
      meals: 21,
      image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300&h=200&fit=crop',
      tags: ['Truyền thống', 'Việt Nam', 'Gia đình']
    },
    {
      id: 'quick-easy',
      name: 'Thực đơn nhanh gọn',
      description: 'Các món ăn đơn giản, nấu nhanh',
      duration: '5 ngày',
      meals: 15,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
      tags: ['Nhanh', 'Đơn giản', 'Tiện lợi']
    },
    {
      id: 'budget-friendly',
      name: 'Thực đơn tiết kiệm',
      description: 'Ngon bổ rẻ, phù hợp túi tiền',
      duration: '7 ngày',
      meals: 21,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
      tags: ['Tiết kiệm', 'Bổ dưỡng', 'Phổ biến']
    }
  ];

  const handleApply = async () => {
    if (!selectedPlan) return;

    setIsApplying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onApply) {
        onApply(selectedPlan);
      }
      
      // Show success message
      alert('Đã áp dụng thực đơn thành công! Trang sẽ được tải lại.');
      
      // Reload page to show new meal plan
      window.location.reload();
      
      onClose();
    } catch (error) {
      console.error('Error applying meal plan:', error);
      alert('Có lỗi xảy ra khi áp dụng thực đơn. Vui lòng thử lại.');
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Chọn thực đơn cho hôm nay
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isApplying}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Chọn một thực đơn mẫu để bắt đầu lên kế hoạch bữa ăn
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickMealPlans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md',
                  selectedPlan === plan.id && 'ring-2 ring-orange-500 ring-offset-2'
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-4">
                  {/* Image */}
                  <div className="aspect-video w-full mb-3 overflow-hidden rounded-lg">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {plan.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {plan.duration}
                      </div>
                      <div className="flex items-center">
                        <ChefHat className="h-3 w-3 mr-1" />
                        {plan.meals} món
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {plan.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Selection indicator */}
                    {selectedPlan === plan.id && (
                      <div className="mt-3 flex items-center text-orange-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Đã chọn</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Custom Plan Option */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-2">
                Muốn tạo thực đơn riêng?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Tạo thực đơn tùy chỉnh theo sở thích và nhu cầu của bạn
              </p>
              <Button variant="outline" asChild>
                <Link to="/meal-plans?tab=daily-menu">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo thực đơn tùy chỉnh
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isApplying}
            >
              Hủy
            </Button>
            
            <Button
              onClick={handleApply}
              disabled={!selectedPlan || isApplying}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang áp dụng...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Áp dụng thực đơn
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickMealPlanModal;
