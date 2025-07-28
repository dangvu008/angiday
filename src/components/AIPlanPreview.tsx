import React, { useState } from 'react';
import { AIGeneratedPlan, AIGeneratedMeal } from '@/services/aiMealPlanGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Calendar, 
  Clock, 
  Users, 
  Flame,
  ChefHat,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AIPlanPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (plan: AIGeneratedPlan) => void;
  onRegenerate: () => void;
  plan: AIGeneratedPlan | null;
  isLoading?: boolean;
}

const AIPlanPreview: React.FC<AIPlanPreviewProps> = ({
  isOpen,
  onClose,
  onApprove,
  onRegenerate,
  plan,
  isLoading = false
}) => {
  const [selectedMeal, setSelectedMeal] = useState<AIGeneratedMeal | null>(null);

  if (!plan) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      breakfast: 'Sáng',
      lunch: 'Trưa',
      dinner: 'Tối',
      snack: 'Phụ'
    };
    return labels[mealType as keyof typeof labels] || mealType;
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      lunch: 'bg-orange-50 border-orange-200 text-orange-800',
      dinner: 'bg-blue-50 border-blue-200 text-blue-800',
      snack: 'bg-green-50 border-green-200 text-green-800'
    };
    return colors[mealType as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 0.6) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  // Group meals by date
  const mealsByDate = plan.meals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, AIGeneratedMeal[]>);

  const handleApprove = () => {
    onApprove(plan);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center text-2xl">
              <Brain className="h-6 w-6 mr-3 text-purple-600" />
              Xem trước thực đơn AI
            </DialogTitle>
            <DialogDescription>
              AI đã tạo thực đơn dựa trên sở thích của bạn. Xem xét và phê duyệt để áp dụng.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="calendar">Lịch trình</TabsTrigger>
              <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
              <TabsTrigger value="reasoning">Lý do AI</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  {/* Plan Summary */}
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 ${getConfidenceColor(plan.confidence)}`}>
                            {getConfidenceIcon(plan.confidence)}
                            <span className="font-medium">{Math.round(plan.confidence * 100)}% tin cậy</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{plan.meals.length}</div>
                          <div className="text-sm text-gray-600">Bữa ăn</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{plan.nutritionSummary.avgCaloriesPerDay}</div>
                          <div className="text-sm text-gray-600">Calories/ngày</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">7</div>
                          <div className="text-sm text-gray-600">Ngày</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {new Set(plan.meals.map(m => m.matchedRecipeId)).size}
                          </div>
                          <div className="text-sm text-gray-600">Công thức</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Meal Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Món ăn nổi bật</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plan.meals.slice(0, 6).map((meal, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getMealTypeColor(meal.mealType)}`}
                            onClick={() => setSelectedMeal(meal)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {getMealTypeLabel(meal.mealType)}
                              </Badge>
                              <div className={`flex items-center space-x-1 text-xs ${getConfidenceColor(meal.confidence)}`}>
                                {getConfidenceIcon(meal.confidence)}
                                <span>{Math.round(meal.confidence * 100)}%</span>
                              </div>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{meal.suggestedRecipe.title}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {meal.suggestedRecipe.cookTime}
                              </div>
                              <div className="flex items-center">
                                <Flame className="h-3 w-3 mr-1" />
                                {meal.suggestedRecipe.calories} cal
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="calendar" className="flex-1">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {Object.entries(mealsByDate).map(([date, meals]) => (
                    <Card key={date}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                          <Calendar className="h-5 w-5 mr-2" />
                          {formatDate(date)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {meals.map((meal, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getMealTypeColor(meal.mealType)}`}
                              onClick={() => setSelectedMeal(meal)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {getMealTypeLabel(meal.mealType)}
                                </Badge>
                                <div className={`flex items-center space-x-1 text-xs ${getConfidenceColor(meal.confidence)}`}>
                                  {getConfidenceIcon(meal.confidence)}
                                </div>
                              </div>
                              <h4 className="font-medium text-sm mb-1">{meal.suggestedRecipe.title}</h4>
                              <div className="text-xs text-gray-600 mb-2">
                                {meal.suggestedRecipe.cookTime} • {meal.suggestedRecipe.calories} cal
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {meal.suggestedRecipe.reasoning}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="nutrition" className="flex-1">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Phân tích dinh dưỡng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {plan.nutritionSummary.totalCalories}
                          </div>
                          <div className="text-sm text-gray-600">Tổng calories</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {plan.nutritionSummary.avgCaloriesPerDay}
                          </div>
                          <div className="text-sm text-gray-600">Trung bình/ngày</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {plan.nutritionSummary.proteinPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">Protein</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {plan.nutritionSummary.carbsPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">Carbs</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Protein</span>
                            <span>{plan.nutritionSummary.proteinPercentage}%</span>
                          </div>
                          <Progress value={plan.nutritionSummary.proteinPercentage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Carbohydrates</span>
                            <span>{plan.nutritionSummary.carbsPercentage}%</span>
                          </div>
                          <Progress value={plan.nutritionSummary.carbsPercentage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Chất béo</span>
                            <span>{plan.nutritionSummary.fatPercentage}%</span>
                          </div>
                          <Progress value={plan.nutritionSummary.fatPercentage} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reasoning" className="flex-1">
              <ScrollArea className="h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Lý do AI chọn thực đơn này
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {plan.planReasoning}
                      </p>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Độ tin cậy: {Math.round(plan.confidence * 100)}%</h4>
                        <p className="text-blue-800 text-sm">
                          AI đánh giá thực đơn này có độ phù hợp cao với sở thích và yêu cầu của bạn.
                          Các món ăn được chọn dựa trên phân tích sâu về preferences và constraints.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="outline" onClick={onRegenerate} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tạo lại
            </Button>
            <Button onClick={handleApprove} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Download className="h-4 w-4 mr-2" />
              Áp dụng thực đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                {selectedMeal.suggestedRecipe.title}
              </DialogTitle>
              <DialogDescription>
                {getMealTypeLabel(selectedMeal.mealType)} • {formatDate(selectedMeal.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{selectedMeal.suggestedRecipe.cookTime}</div>
                  <div className="text-sm text-gray-600">Thời gian</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{selectedMeal.suggestedRecipe.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{selectedMeal.suggestedRecipe.difficulty}</div>
                  <div className="text-sm text-gray-600">Độ khó</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mô tả:</h4>
                <p className="text-gray-700">{selectedMeal.suggestedRecipe.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Lý do AI chọn:</h4>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedMeal.suggestedRecipe.reasoning}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Nguyên liệu:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedMeal.suggestedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {selectedMeal.suggestedRecipe.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className={`flex items-center space-x-1 ${getConfidenceColor(selectedMeal.confidence)}`}>
                  {getConfidenceIcon(selectedMeal.confidence)}
                  <span className="text-sm font-medium">{Math.round(selectedMeal.confidence * 100)}% tin cậy</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMeal(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AIPlanPreview;
