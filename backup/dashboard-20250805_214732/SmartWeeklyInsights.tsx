import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Flame,
  Target,
  CheckCircle,
  Clock,
  Leaf,
  AlertTriangle,
  ThumbsUp,
  Fish,
  Carrot,
  Heart,
  Brain,
  Zap,
  Award
} from 'lucide-react';

interface WeeklyStats {
  totalSpent: number;
  budget: number;
  caloriesTarget: number;
  caloriesConsumed: number;
  mealsCompleted: number;
  totalMeals: number;
  weeklyProgress: number;
  daysRemaining: number;
}

interface SmartWeeklyInsightsProps {
  stats: WeeklyStats;
  currentPlan?: any;
}

const SmartWeeklyInsights: React.FC<SmartWeeklyInsightsProps> = ({ stats, currentPlan }) => {
  const budgetPercentage = (stats.totalSpent / stats.budget) * 100;
  const mealsPercentage = (stats.mealsCompleted / stats.totalMeals) * 100;

  // Tạo các insight thông minh
  const generateInsights = () => {
    const insights = [];

    // Insight về tiến độ
    if (mealsPercentage >= 80) {
      insights.push({
        type: 'success',
        icon: <Award className="h-4 w-4" />,
        title: 'Xuất sắc!',
        message: 'Bạn đã lên kế hoạch cho hầu hết các bữa ăn trong tuần.',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      });
    } else if (mealsPercentage >= 50) {
      insights.push({
        type: 'progress',
        icon: <Target className="h-4 w-4" />,
        title: 'Đang tiến bộ tốt',
        message: `Bạn đã hoàn thành ${Math.round(mealsPercentage)}% kế hoạch tuần. Tiếp tục phát huy!`,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      });
    } else {
      insights.push({
        type: 'suggestion',
        icon: <Clock className="h-4 w-4" />,
        title: 'Cần thêm chút nỗ lực',
        message: `Còn ${stats.daysRemaining} ngày để hoàn thiện kế hoạch tuần này.`,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200'
      });
    }

    // Insight về ngân sách
    if (budgetPercentage <= 60) {
      insights.push({
        type: 'budget-good',
        icon: <ThumbsUp className="h-4 w-4" />,
        title: 'Tiết kiệm tốt',
        message: `Chi tiêu chỉ ${Math.round(budgetPercentage)}% ngân sách. Bạn có thể thêm vài món đặc biệt!`,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      });
    } else if (budgetPercentage <= 90) {
      insights.push({
        type: 'budget-ok',
        icon: <DollarSign className="h-4 w-4" />,
        title: 'Ngân sách hợp lý',
        message: `Chi tiêu ${Math.round(budgetPercentage)}% ngân sách tuần. Vẫn còn dư địa.`,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      });
    } else {
      insights.push({
        type: 'budget-warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Cần chú ý ngân sách',
        message: 'Thử thay thế một vài món bằng các lựa chọn tiết kiệm hơn.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200'
      });
    }

    // Insight về dinh dưỡng (giả lập)
    const nutritionInsights = [
      {
        type: 'nutrition',
        icon: <Leaf className="h-4 w-4" />,
        title: 'Cân bằng dinh dưỡng',
        message: 'Kế hoạch tuần này khá cân bằng về rau xanh và protein.',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      },
      {
        type: 'nutrition',
        icon: <Fish className="h-4 w-4" />,
        title: 'Thiếu cá trong tuần',
        message: 'Thử thêm cá hồi hoặc cá thu vào cuối tuần nhé!',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      },
      {
        type: 'nutrition',
        icon: <Carrot className="h-4 w-4" />,
        title: 'Đa dạng rau củ',
        message: 'Tuyệt vời! Bạn có nhiều loại rau củ khác nhau trong tuần.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200'
      }
    ];

    // Chọn ngẫu nhiên 1 insight dinh dưỡng
    insights.push(nutritionInsights[Math.floor(Math.random() * nutritionInsights.length)]);

    return insights.slice(0, 3); // Chỉ hiển thị tối đa 3 insights
  };

  const insights = generateInsights();

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-green-600" />
            Tổng Quan Thông Minh
          </div>
          {currentPlan && (
            <Badge variant="outline" className="text-green-700 border-green-300 bg-white">
              {currentPlan.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tiến độ tổng quan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Tiến độ tuần này</span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {stats.mealsCompleted}/{stats.totalMeals} bữa
            </span>
          </div>
          <Progress value={mealsPercentage} className="h-3" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Đã lên kế hoạch: {Math.round(mealsPercentage)}%</span>
            <span>Còn {stats.daysRemaining} ngày</span>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Nhận xét thông minh
          </h4>
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${insight.border} ${insight.bg}`}
            >
              <div className="flex items-start gap-3">
                <div className={`${insight.color} mt-0.5`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h5 className={`font-medium ${insight.color} mb-1`}>
                    {insight.title}
                  </h5>
                  <p className="text-sm text-gray-700">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(budgetPercentage)}%
            </div>
            <div className="text-xs text-gray-600">Ngân sách</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalSpent.toLocaleString('vi-VN')}đ
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">~1,850</div>
            <div className="text-xs text-gray-600">Kcal/ngày</div>
            <div className="text-xs text-gray-500 mt-1">Ước tính</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">8.5/10</div>
            <div className="text-xs text-gray-600">Cân bằng</div>
            <div className="text-xs text-gray-500 mt-1">Dinh dưỡng</div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-green-700 border-green-300 hover:bg-green-100"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Xem phân tích chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartWeeklyInsights;
