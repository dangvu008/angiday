import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Settings, 
  Pause, 
  Play,
  Timer,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCookingMode } from '@/contexts/CookingModeContext';
import CookingTimer from './CookingTimer';
import CookingSettings from './CookingSettings';
import IngredientsList from './IngredientsList';
import { cn } from '@/lib/utils';

interface CookingModeProps {
  className?: string;
}

const CookingMode: React.FC<CookingModeProps> = ({ className }) => {
  const navigate = useNavigate();
  const {
    state,
    nextStep,
    previousStep,
    endSession,
    pauseSession,
    resumeSession,
    speakText,
    completeStep,
    isStepCompleted
  } = useCookingMode();

  const [showSettings, setShowSettings] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const { session, currentStep, settings, timers } = state;

  // Redirect if no active session
  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  // Handle swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextStep();
    }
    if (isRightSwipe) {
      previousStep();
    }
  }, [touchStart, touchEnd, nextStep, previousStep]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousStep();
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'Escape') handleExit();
      if (e.key === ' ') {
        e.preventDefault();
        if (currentStep) {
          speakText(currentStep.instruction);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, nextStep, previousStep, speakText]);

  const handleExit = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn thoát khỏi chế độ nấu ăn?')) {
      endSession();
      navigate('/');
    }
  }, [endSession, navigate]);

  const handleSpeakInstruction = useCallback(() => {
    if (currentStep) {
      speakText(currentStep.instruction);
    }
  }, [currentStep, speakText]);

  const handleCompleteStep = useCallback(() => {
    if (currentStep) {
      completeStep(currentStep.id);
      // Auto advance if enabled
      if (settings.autoAdvanceSteps) {
        setTimeout(nextStep, 1000);
      }
    }
  }, [currentStep, completeStep, settings.autoAdvanceSteps, nextStep]);

  const togglePause = useCallback(() => {
    if (session?.status === 'active') {
      pauseSession();
    } else {
      resumeSession();
    }
  }, [session?.status, pauseSession, resumeSession]);

  if (!session || !currentStep) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải chế độ nấu ăn...</p>
        </div>
      </div>
    );
  }

  const progress = ((session.currentStepIndex + 1) / session.timeline.optimizedSteps.length) * 100;
  const isCompleted = isStepCompleted(currentStep.id);
  const activeTimers = timers.filter(timer => timer.isActive);

  return (
    <div 
      className={cn(
        "min-h-screen transition-colors duration-300",
        settings.darkMode 
          ? "bg-gray-900 text-white" 
          : "bg-white text-gray-900",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="h-5 w-5 mr-2" />
            Thoát
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePause}
              className="text-yellow-400 hover:text-yellow-300"
            >
              {session.status === 'active' ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-gray-300"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Bước {session.currentStepIndex + 1} / {session.timeline.optimizedSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Recipe Name */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-orange-400">
            {session.timeline.name}
          </h1>
          {currentStep.recipeName !== 'all' && (
            <p className="text-sm text-gray-400">
              {currentStep.recipeName}
            </p>
          )}
        </div>
      </div>

      {/* Active Timers */}
      {activeTimers.length > 0 && (
        <div className="px-4 py-2 bg-orange-900/20 border-b border-orange-700">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {activeTimers.map(timer => (
              <CookingTimer key={timer.id} timer={timer} compact />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Ingredients Panel (Collapsible) */}
        {currentStep.ingredients && currentStep.ingredients.length > 0 && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                onClick={() => setShowIngredients(!showIngredients)}
                className="w-full text-left text-green-400 hover:text-green-300"
              >
                <span className="font-medium">
                  Nguyên liệu cho bước này ({currentStep.ingredients.length})
                </span>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 ml-auto transition-transform",
                    showIngredients && "rotate-90"
                  )} 
                />
              </Button>
              
              {showIngredients && (
                <div className="mt-3 space-y-1">
                  {currentStep.ingredients.map((ingredient, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center">
                      <Circle className="h-3 w-3 mr-2 text-green-400" />
                      {ingredient}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Instruction Card */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-orange-400 mb-2">
                Bước {currentStep.stepNumber}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700">
                {currentStep.category === 'prep' && '🔪 Chuẩn bị'}
                {currentStep.category === 'cooking' && '🔥 Nấu nướng'}
                {currentStep.category === 'waiting' && '⏰ Chờ đợi'}
                {currentStep.category === 'finishing' && '✨ Hoàn thiện'}
              </div>
            </div>

            <div 
              className={cn(
                "text-center leading-relaxed mb-6",
                settings.fontSize === 'large' && "text-xl",
                settings.fontSize === 'extra-large' && "text-2xl",
                settings.fontSize === 'normal' && "text-lg"
              )}
            >
              {currentStep.instruction}
            </div>

            {/* Voice Control */}
            <div className="flex justify-center mb-4">
              <Button
                onClick={handleSpeakInstruction}
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                disabled={!settings.voiceEnabled}
              >
                {settings.voiceEnabled ? (
                  <Volume2 className="h-5 w-5 mr-2" />
                ) : (
                  <VolumeX className="h-5 w-5 mr-2" />
                )}
                Đọc hướng dẫn
              </Button>
            </div>

            {/* Step Completion */}
            <div className="flex justify-center">
              <Button
                onClick={handleCompleteStep}
                variant={isCompleted ? "default" : "outline"}
                size="lg"
                className={cn(
                  "transition-all duration-300",
                  isCompleted 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "border-green-600 text-green-400 hover:bg-green-900/20"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <Circle className="h-5 w-5 mr-2" />
                )}
                {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            onClick={previousStep}
            disabled={session.currentStepIndex === 0}
            size="lg"
            variant="outline"
            className="flex-1 mr-4 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Bước trước
          </Button>

          <Button
            onClick={nextStep}
            disabled={session.currentStepIndex === session.timeline.optimizedSteps.length - 1}
            size="lg"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Bước tiếp theo
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        <div className="text-center mt-2 text-xs text-gray-500">
          Vuốt trái/phải để chuyển bước • Nhấn Space để đọc hướng dẫn
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <CookingSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Ingredients Modal */}
      {showIngredients && session && (
        <IngredientsList
          isOpen={showIngredients}
          onClose={() => setShowIngredients(false)}
          recipes={session.timeline.recipes}
        />
      )}
    </div>
  );
};

export default CookingMode;
