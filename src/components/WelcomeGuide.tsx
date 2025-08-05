import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChefHat, Calendar, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMealPlanning } from '@/contexts/MealPlanningContext';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeGuideProps {
  onClose?: () => void;
  onStartQuickSetup?: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({
  onClose,
  onStartQuickSetup
}) => {
  const { userMealPlans, activePlan } = useMealPlanning();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if user is new (no meal plans set up or no active plan for today)
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');

    // Only show guide if:
    // 1. User hasn't seen it before
    // 2. User is authenticated
    // 3. User has no meal plans OR no active plan for today
    const shouldShowGuide = !hasSeenGuide &&
                           isAuthenticated &&
                           (!userMealPlans || userMealPlans.length === 0 || !activePlan);

    if (shouldShowGuide) {
      setIsVisible(true);
    }
  }, [isAuthenticated, userMealPlans, activePlan]);

  const steps = [
    {
      icon: <ChefHat className="h-8 w-8 text-orange-500" />,
      title: "Chào mừng đến với Angiday! 👋",
      description: "Ứng dụng quản lý thực đơn thông minh giúp bạn lên kế hoạch bữa ăn hàng ngày",
      action: "Bắt đầu"
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "Tạo thực đơn đầu tiên 📅",
      description: "Chọn từ thư viện thực đơn mẫu hoặc tạo thực đơn riêng theo sở thích của bạn",
      action: "Tiếp tục"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-green-500" />,
      title: "Sẵn sàng bắt đầu! ✨",
      description: "Hãy chọn một thực đơn để xem các món ăn ngon cho hôm nay",
      action: "Chọn thực đơn ngay"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
    setIsVisible(false);
    if (onStartQuickSetup) {
      onStartQuickSetup();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentStep
                      ? 'bg-orange-500'
                      : index < currentStep
                      ? 'bg-orange-300'
                      : 'bg-gray-300'
                  )}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleNext}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <ChefHat className="h-4 w-4 mr-2" />
                    {currentStepData.action}
                  </>
                ) : (
                  <>
                    {currentStepData.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="w-full text-gray-500 hover:text-gray-700"
                >
                  Bỏ qua hướng dẫn
                </Button>
              )}
            </div>
          </div>

          {/* Tips for last step */}
          {currentStep === steps.length - 1 && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">
                    Mẹo nhỏ:
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Bắt đầu với "Thực đơn nhanh gọn" nếu bạn mới sử dụng</li>
                    <li>• Thực đơn sẽ tự động tạo danh sách mua sắm</li>
                    <li>• Bạn có thể thay đổi thực đơn bất cứ lúc nào</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeGuide;
