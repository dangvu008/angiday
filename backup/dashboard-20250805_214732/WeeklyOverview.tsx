import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Flame,
  Target,
  CheckCircle,
  Clock
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

interface WeeklyOverviewProps {
  stats: WeeklyStats;
  currentPlan?: any;
}

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ stats, currentPlan }) => {
  const budgetPercentage = (stats.totalSpent / stats.budget) * 100;
  const caloriesPercentage = (stats.caloriesConsumed / stats.caloriesTarget) * 100;
  const mealsPercentage = (stats.mealsCompleted / stats.totalMeals) * 100;

  const getBudgetStatus = () => {
    if (budgetPercentage <= 70) return { color: 'text-green-600', bg: 'bg-green-100', status: 'Tốt' };
    if (budgetPercentage <= 90) return { color: 'text-yellow-600', bg: 'bg-yellow-100', status: 'Cảnh báo' };
    return { color: 'text-red-600', bg: 'bg-red-100', status: 'Vượt mức' };
  };

  const getCaloriesStatus = () => {
    if (caloriesPercentage >= 80 && caloriesPercentage <= 120) return { color: 'text-green-600', status: 'Đạt mục tiêu' };
    if (caloriesPercentage < 80) return { color: 'text-blue-600', status: 'Thiếu calo' };
    return { color: 'text-orange-600', status: 'Thừa calo' };
  };

  const budgetStatus = getBudgetStatus();
  const caloriesStatus = getCaloriesStatus();

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Tổng Quan Tuần Này
          </div>
          {currentPlan && (
            <Badge variant="outline" className="text-green-700 border-green-300">
              {currentPlan.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tiến độ kế hoạch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Tiến độ Kế hoạch</span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {stats.mealsCompleted}/{stats.totalMeals} bữa
            </span>
          </div>
          <Progress value={mealsPercentage} className="h-2" />
          <p className="text-xs text-gray-600">
            Bạn đã lên kế hoạch cho {stats.mealsCompleted} bữa trong tuần này
          </p>
        </div>

        {/* Ngân sách */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Ngân sách (Ước tính)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${budgetStatus.color} ${budgetStatus.bg} border-0`}>
                {budgetStatus.status}
              </Badge>
              <span className="text-sm font-semibold text-gray-900">
                {stats.totalSpent.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
          <p className="text-xs text-gray-600">
            Chi tiêu tuần này: {stats.totalSpent.toLocaleString('vi-VN')}đ / {stats.budget.toLocaleString('vi-VN')}đ
          </p>
        </div>

        {/* Dinh dưỡng */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Calo Trung bình/Ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${caloriesStatus.color} bg-gray-50 border-0`}>
                {caloriesStatus.status}
              </Badge>
              <span className="text-sm font-semibold text-gray-900">
                {stats.caloriesConsumed}/{stats.caloriesTarget} cal
              </span>
            </div>
          </div>
          <Progress value={Math.min(caloriesPercentage, 100)} className="h-2" />
          <p className="text-xs text-gray-600">
            Mục tiêu: {stats.caloriesTarget} calories/ngày
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-green-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{stats.daysRemaining}</div>
            <div className="text-xs text-gray-600">Ngày còn lại</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{Math.round(mealsPercentage)}%</div>
            <div className="text-xs text-gray-600">Hoàn thành</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(stats.caloriesConsumed / 7)}
            </div>
            <div className="text-xs text-gray-600">Cal/ngày TB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;
