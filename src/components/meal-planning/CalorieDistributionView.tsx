import React from 'react';
import { FamilyMember, MealSlot } from '@/types/meal-planning';
import { CalorieCalculatorService } from '@/services/calorie-calculator.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Utensils, TrendingUp, Target } from 'lucide-react';

interface CalorieDistributionViewProps {
  familyMembers: FamilyMember[];
  mealSlot?: MealSlot;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  totalMealCalories: number;
}

export const CalorieDistributionView: React.FC<CalorieDistributionViewProps> = ({
  familyMembers,
  mealSlot,
  mealType,
  totalMealCalories
}) => {
  const activeMembers = familyMembers.filter(member => member.isActive);
  const distribution = CalorieCalculatorService.distributeMealCalories(totalMealCalories, activeMembers);
  
  const mealTypeLabels = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa', 
    dinner: 'Bữa tối',
    snacks: 'Bữa phụ'
  };

  const getMealCalorieTarget = (member: FamilyMember, mealType: string): number => {
    const mealDistribution = CalorieCalculatorService.getMealCalorieDistribution(member.dailyCalorieNeeds);
    return mealDistribution[mealType as keyof typeof mealDistribution];
  };

  if (activeMembers.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
          <div className="text-center">
            <User className="h-8 w-8 mx-auto mb-2" />
            <p>Chưa có thành viên nào được kích hoạt</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Phân bổ calo - {mealTypeLabels[mealType]}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Tổng calo bữa ăn: <span className="font-semibold">{totalMealCalories.toLocaleString()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeMembers.map((member) => {
          const memberDistribution = distribution[member.id];
          const targetCalories = getMealCalorieTarget(member, mealType);
          const progressPercentage = Math.min((memberDistribution.calories / targetCalories) * 100, 100);
          const isOverTarget = memberDistribution.calories > targetCalories;
          
          return (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{member.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {member.age} tuổi
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {memberDistribution.calories} / {targetCalories} calo
                  </span>
                  <Badge 
                    variant={isOverTarget ? "destructive" : progressPercentage >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {memberDistribution.percentage}%
                  </Badge>
                </div>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className={`h-2 ${isOverTarget ? 'bg-red-100' : ''}`}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  BMR: {CalorieCalculatorService.calculateBMR(member).toFixed(0)} calo/ngày
                </span>
                <span className={isOverTarget ? 'text-red-600' : progressPercentage >= 80 ? 'text-green-600' : ''}>
                  {isOverTarget ? 'Vượt mục tiêu' : progressPercentage >= 80 ? 'Đạt mục tiêu' : 'Chưa đủ'}
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Mục tiêu trung bình:</span>
              <span className="font-medium">
                {Math.round(activeMembers.reduce((sum, member) => 
                  sum + getMealCalorieTarget(member, mealType), 0) / activeMembers.length
                ).toLocaleString()} calo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Thực tế trung bình:</span>
              <span className="font-medium">
                {Math.round(totalMealCalories / activeMembers.length).toLocaleString()} calo
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for daily calorie summary
export const DailyCalorieSummary: React.FC<{
  familyMembers: FamilyMember[];
  dayMeals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}> = ({ familyMembers, dayMeals }) => {
  const activeMembers = familyMembers.filter(member => member.isActive);
  const totalDayCalories = Object.values(dayMeals).reduce((sum, calories) => sum + calories, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tổng kết calo trong ngày
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeMembers.map((member) => {
            const memberDayDistribution = CalorieCalculatorService.distributeMealCalories(totalDayCalories, [member]);
            const memberCalories = memberDayDistribution[member.id]?.calories || 0;
            const targetCalories = member.dailyCalorieNeeds;
            const progressPercentage = Math.min((memberCalories / targetCalories) * 100, 100);
            const isOverTarget = memberCalories > targetCalories;
            
            return (
              <div key={member.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {memberCalories.toLocaleString()} / {targetCalories.toLocaleString()} calo
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isOverTarget ? '+' : ''}{(memberCalories - targetCalories).toLocaleString()} calo
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={progressPercentage} 
                  className={`h-3 ${isOverTarget ? 'bg-red-100' : ''}`}
                />
                
                <div className="text-xs text-muted-foreground text-right">
                  {isOverTarget ? 'Vượt mục tiêu' : progressPercentage >= 90 ? 'Đạt mục tiêu' : 'Chưa đủ calo'}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {totalDayCalories.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Tổng calo cả gia đình
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
