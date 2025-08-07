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
      
      // Initialize completed steps from session if available
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
      
      // Load completed steps for new recipe if available
      const newRecipeId = session.recipes[newIndex]?.id;
      if (newRecipeId && session.completedSteps?.[newRecipeId]) {
        setCompletedSteps(new Set(session.completedSteps[newRecipeId]));
      }
      
      toast.success(`Chuyển sang món: ${session.recipes[newIndex]?.title}`);
    } else {
      // Completed all recipes
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
      
      // Load completed steps for previous recipe if available
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

  // Debug info
  console.log('Cooking Session:', session);
  console.log('Current Recipe:', getCurrentRecipe());
  console.log('Plan:', plan);

  const currentRecipe = getCurrentRecipe();
  const recipeProgress = session.recipes.length > 0 ? 
    ((session.currentRecipeIndex + 1) / session.recipes.length) * 100 : 0;
  const stepProgress = currentRecipe ? 
    (completedSteps.size / currentRecipe.instructions.length) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-600" />
            Chế độ nấu ăn - {plan.name}
          </DialogTitle>
          <DialogDescription>
            {session.status === 'completed' ? 'Đã hoàn thành!' : 
             `Món ${session.currentRecipeIndex + 1}/${session.recipes.length}: ${currentRecipe?.title || 'Không có món nào'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Main Cooking Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Recipe Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Tiến độ nấu ăn</CardTitle>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                    {session.status === 'completed' ? 'Hoàn thành' : 
                     session.status === 'cooking' ? 'Đang nấu' : 
                     session.status === 'paused' ? 'Tạm dừng' : 'Chuẩn bị'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
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

            {/* Current Recipe */}
            {currentRecipe ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    {currentRecipe.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentRecipe.cookingTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {currentRecipe.servings} phần
                    </div>
                    <Badge variant="outline">
                      {currentRecipe.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Ingredients */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Nguyên liệu:</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {currentRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-medium mb-2">Cách làm:</h4>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
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
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  Bước {index + 1}
                                </Badge>
                              </div>
                              <p className={`text-sm ${
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
          <div className="space-y-4">
            {/* Timer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Hẹn giờ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-orange-600">
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={isTimerRunning ? "destructive" : "default"}
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      disabled={timer === 0}
                    >
                      {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTimer(0);
                        setIsTimerRunning(false);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Điều hướng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousRecipe}
                  disabled={session.currentRecipeIndex === 0 || session.recipes.length === 0}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Món trước
                </Button>

                <Button
                  onClick={handleNextRecipe}
                  disabled={session.recipes.length === 0}
                  className="w-full"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  {session.recipes.length === 0 ? 'Không có món' :
                   session.currentRecipeIndex === session.recipes.length - 1 ? 'Hoàn thành' : 'Món tiếp'}
                </Button>
              </CardContent>
            </Card>

            {/* Recipe List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Danh sách món</CardTitle>
              </CardHeader>
              <CardContent>
                {session.recipes.length > 0 ? (
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {session.recipes.map((recipe, index) => (
                        <div
                          key={recipe.id}
                          className={`p-2 border rounded text-sm ${
                            index === session.currentRecipeIndex
                              ? 'bg-orange-50 border-orange-200'
                              : index < session.currentRecipeIndex
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {index < session.currentRecipeIndex ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : index === session.currentRecipeIndex ? (
                              <Clock className="h-4 w-4 text-orange-600" />
                            ) : (
                              <div className="h-4 w-4 border rounded-full" />
                            )}
                            <span className="font-medium">{recipe.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4">
                    <ChefHat className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Chưa có món ăn nào</p>
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
