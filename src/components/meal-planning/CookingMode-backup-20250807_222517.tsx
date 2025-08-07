import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Timer,
  Users,
  Utensils
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CookingSession,
  Recipe,
  AnyPlan
} from '@/types/meal-planning';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { toast } from 'sonner';

interface CookingModeProps {
  isOpen: boolean;
  onClose: () => void;
  plan: AnyPlan;
  cookingSession?: CookingSession;
}

const CookingMode: React.FC<CookingModeProps> = ({
  isOpen,
  onClose,
  plan,
  cookingSession: initialSession
}) => {
  const [session, setSession] = useState<CookingSession | null>(initialSession || null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !session) {
      initializeCookingSession();
    }
  }, [isOpen, plan]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast.success('Hết thời gian!', {
              description: 'Kiểm tra món ăn của bạn'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const initializeCookingSession = async () => {
    try {
      setLoading(true);
      const newSession = await inventoryManagementService.startCookingSession(plan);
      setSession(newSession);
      
      if (newSession.completedSteps) {
        const currentRecipeId = newSession.recipes[newSession.currentRecipeIndex]?.id;
        if (currentRecipeId && newSession.completedSteps[currentRecipeId]) {
          setCompletedSteps(new Set(newSession.completedSteps[currentRecipeId]));
        }
      }
    } catch (error) {
      console.error('Error initializing cooking session:', error);
      toast.error('Không thể khởi tạo phiên nấu ăn');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRecipe = (): Recipe | null => {
    if (!session || session.recipes.length === 0) return null;
    return session.recipes[session.currentRecipeIndex] || null;
  };

  const handleStepToggle = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const handleNextRecipe = () => {
    if (!session) return;
    
    if (session.currentRecipeIndex < session.recipes.length - 1) {
      const newIndex = session.currentRecipeIndex + 1;
      setSession(prev => prev ? { ...prev, currentRecipeIndex: newIndex } : null);
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      
      const newRecipeId = session.recipes[newIndex]?.id;
      if (newRecipeId && session.completedSteps?.[newRecipeId]) {
        setCompletedSteps(new Set(session.completedSteps[newRecipeId]));
      }
      
      toast.success(`Chuyển sang món: ${session.recipes[newIndex]?.title}`);
    } else {
      handleCompleteCooking();
    }
  };

  const handlePreviousRecipe = () => {
    if (!session) return;
    
    if (session.currentRecipeIndex > 0) {
      const newIndex = session.currentRecipeIndex - 1;
      setSession(prev => prev ? { ...prev, currentRecipeIndex: newIndex } : null);
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      
      const prevRecipeId = session.recipes[newIndex]?.id;
      if (prevRecipeId && session.completedSteps?.[prevRecipeId]) {
        setCompletedSteps(new Set(session.completedSteps[prevRecipeId]));
      }
      
      toast.success(`Quay lại món: ${session.recipes[newIndex]?.title}`);
    }
  };

  const handleCompleteCooking = () => {
    if (!session) return;
    
    setSession(prev => prev ? { 
      ...prev, 
      status: 'completed',
      endTime: new Date().toISOString(),
      actualCookingTime: Math.floor((Date.now() - new Date(prev.startTime).getTime()) / 60000)
    } : null);
    
    toast.success('Hoàn thành nấu ăn!', {
      description: 'Chúc bạn ngon miệng!'
    });
  };

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60);
    setIsTimerRunning(true);
    toast.info(`Đã đặt hẹn giờ ${minutes} phút`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2">Đang chuẩn bị chế độ nấu ăn...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lỗi</DialogTitle>
            <DialogDescription>
              Không thể khởi tạo phiên nấu ăn. Vui lòng thử lại.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Đóng</Button>
        </DialogContent>
      </Dialog>
    );
  }

  const currentRecipe = getCurrentRecipe();
  const recipeProgress = session.recipes.length > 0 ? 
    ((session.currentRecipeIndex + 1) / session.recipes.length) * 100 : 0;
  const stepProgress = currentRecipe ? 
    (completedSteps.size / currentRecipe.instructions.length) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
            <span className="truncate">Chế độ nấu ăn - {plan.name}</span>
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            {session.status === 'completed' ? 'Đã hoàn thành!' :
             session.recipes.length > 0 ?
             `Món ${session.currentRecipeIndex + 1}/${session.recipes.length}: ${currentRecipe?.title || 'Không có món nào'}` :
             'Không có công thức nấu ăn'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
            {/* Main Cooking Area */}
            <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
            {/* Recipe Progress */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-base md:text-lg">Tiến độ nấu ăn</CardTitle>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'} className="self-start sm:self-auto">
                    {session.status === 'completed' ? 'Hoàn thành' :
                     session.status === 'cooking' ? 'Đang nấu' :
                     session.status === 'paused' ? 'Tạm dừng' : 'Chuẩn bị'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Món ăn ({session.currentRecipeIndex + 1}/{session.recipes.length})</span>
                    <span>{Math.round(recipeProgress)}%</span>
                  </div>
                  <Progress value={recipeProgress} className="h-2" />
                </div>
                
                {currentRecipe && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Bước hiện tại ({completedSteps.size}/{currentRecipe.instructions.length})</span>
                      <span>{Math.round(stepProgress)}%</span>
                    </div>
                    <Progress value={stepProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Recipe or No Recipe Message */}
            {currentRecipe ? (
              <Card className="flex-1 overflow-hidden flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Utensils className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="truncate">{currentRecipe.title}</span>
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      {currentRecipe.cookingTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      {currentRecipe.servings} phần
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {currentRecipe.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                  {/* Ingredients */}
                  <div className="mb-4 flex-shrink-0">
                    <h4 className="font-medium mb-2 text-sm md:text-base">Nguyên liệu:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs md:text-sm">
                      {currentRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="truncate">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <h4 className="font-medium mb-2 text-sm md:text-base flex-shrink-0">Cách làm:</h4>
                    <ScrollArea className="flex-1 min-h-0">
                      <div className="space-y-3 pr-2 md:pr-4">
                        {currentRecipe.instructions.map((instruction, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 p-3 border rounded-lg transition-colors ${
                              completedSteps.has(index)
                                ? 'bg-green-50 border-green-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <Checkbox
                              checked={completedSteps.has(index)}
                              onCheckedChange={() => handleStepToggle(index)}
                              className="mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  Bước {index + 1}
                                </Badge>
                              </div>
                              <p className={`text-xs md:text-sm leading-relaxed ${
                                completedSteps.has(index) ? 'line-through text-gray-500' : ''
                              }`}>
                                {instruction}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không có công thức nấu ăn
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Kế hoạch này chưa có công thức chi tiết. Bạn có thể tự do sáng tạo món ăn theo ý thích!
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Thông tin kế hoạch:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Tên:</strong> {plan.name}</p>
                      <p><strong>Mô tả:</strong> {plan.description}</p>
                      <p><strong>Tổng calories:</strong> {plan.totalCalories}</p>
                      <p><strong>Chi phí:</strong> {plan.totalCost.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col space-y-4 overflow-hidden">
            {/* Timer */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Timer className="h-4 w-4 md:h-5 md:w-5" />
                  Hẹn giờ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-orange-600">
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={isTimerRunning ? "destructive" : "default"}
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      disabled={timer === 0}
                    >
                      {isTimerRunning ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTimer(0);
                        setIsTimerRunning(false);
                      }}
                    >
                      <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 30, 60].map(minutes => (
                    <Button
                      key={minutes}
                      size="sm"
                      variant="outline"
                      onClick={() => startTimer(minutes)}
                      className="text-xs"
                    >
                      {minutes}p
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Điều hướng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousRecipe}
                  disabled={session.currentRecipeIndex === 0 || session.recipes.length === 0}
                  className="w-full text-sm"
                >
                  <RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Món trước
                </Button>

                <Button
                  onClick={handleNextRecipe}
                  disabled={session.recipes.length === 0}
                  className="w-full text-sm"
                >
                  <SkipForward className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  <span className="truncate">
                    {session.recipes.length === 0 ? 'Không có món' :
                     session.currentRecipeIndex === session.recipes.length - 1 ? 'Hoàn thành' : 'Món tiếp'}
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Recipe List */}
            <Card className="flex-1 overflow-hidden flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-base md:text-lg">Danh sách món</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col">
                {session.recipes.length > 0 ? (
                  <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-2">
                      {session.recipes.map((recipe, index) => (
                        <div
                          key={recipe.id}
                          className={`p-2 md:p-3 border rounded text-xs md:text-sm cursor-pointer transition-colors ${
                            index === session.currentRecipeIndex
                              ? 'bg-orange-50 border-orange-200'
                              : index < session.currentRecipeIndex
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSession(prev => prev ? { ...prev, currentRecipeIndex: index } : null);
                            setCurrentStepIndex(0);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {index < session.currentRecipeIndex ? (
                              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                            ) : index === session.currentRecipeIndex ? (
                              <Clock className="h-3 w-3 md:h-4 md:w-4 text-orange-600 flex-shrink-0" />
                            ) : (
                              <div className="h-3 w-3 md:h-4 md:w-4 border rounded-full flex-shrink-0" />
                            )}
                            <span className="font-medium truncate">{recipe.title}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                            <span>{recipe.cookingTime}</span>
                            <span>•</span>
                            <span>{recipe.servings} phần</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4">
                    <ChefHat className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs md:text-sm text-gray-500">Chưa có món ăn nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookingMode;
