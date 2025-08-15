import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play,
  Timer,
  CheckCircle,
  Circle,
  MoreVertical,
  Smartphone,
  Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MobileCookingModeProps {
  className?: string;
}

const MobileCookingMode: React.FC<MobileCookingModeProps> = ({ className }) => {
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

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const { session, currentStep, settings, timers } = state;

  // Redirect if no active session
  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  // Keep screen on for mobile
  useEffect(() => {
    if (settings.keepScreenOn && 'wakeLock' in navigator) {
      let wakeLock: any = null;
      
      const requestWakeLock = async () => {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.log('Wake lock failed:', err);
        }
      };

      requestWakeLock();

      return () => {
        if (wakeLock) {
          wakeLock.release();
        }
      };
    }
  }, [settings.keepScreenOn]);

  // Enhanced touch gestures for one-handed use
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextStep();
      toast.success('Bước tiếp theo');
    }
    if (isRightSwipe) {
      previousStep();
      toast.success('Bước trước');
    }
  };

  // Double tap to complete step
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      if (currentStep) {
        completeStep(currentStep.id);
        toast.success('Đã hoàn thành bước này');
      }
    } else {
      setLastTap(now);
    }
  };

  const handleExit = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn thoát khỏi chế độ nấu ăn?')) {
      endSession();
      navigate('/');
    }
  }, [endSession, navigate]);

  const togglePause = () => {
    if (session?.status === 'active') {
      pauseSession();
      toast.info('Đã tạm dừng');
    } else {
      resumeSession();
      toast.success('Tiếp tục nấu ăn');
    }
  };

  const handleSpeakInstruction = () => {
    if (currentStep && settings.voiceEnabled) {
      speakText(currentStep.instruction);
    }
  };

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
        "min-h-screen bg-gray-900 text-white flex flex-col",
        "select-none", // Prevent text selection for better mobile experience
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Minimal Header - Optimized for one-handed use */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-3">
        <div className="flex items-center justify-between">
          {/* Left side - Exit button (easy thumb reach) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Center - Progress */}
          <div className="flex-1 mx-4">
            <div className="text-center mb-2">
              <span className="text-sm text-gray-400">
                {session.currentStepIndex + 1} / {session.timeline.optimizedSteps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Right side - Quick actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="text-gray-400 hover:text-white p-2"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Actions Panel */}
        {showQuickActions && (
          <div className="mt-3 flex justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePause}
              className="text-yellow-400 hover:text-yellow-300"
            >
              {session.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeakInstruction}
              className="text-blue-400 hover:text-blue-300"
              disabled={!settings.voiceEnabled}
            >
              {settings.voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Active Timers - Compact display */}
      {activeTimers.length > 0 && (
        <div className="bg-orange-900/20 border-b border-orange-700 p-3">
          <div className="flex items-center justify-center space-x-4">
            {activeTimers.slice(0, 2).map(timer => (
              <Badge key={timer.id} variant="outline" className="text-orange-300 border-orange-500">
                <Timer className="h-3 w-3 mr-1" />
                {Math.floor(timer.remainingTime / 60)}:{(timer.remainingTime % 60).toString().padStart(2, '0')}
              </Badge>
            ))}
            {activeTimers.length > 2 && (
              <Badge variant="outline" className="text-orange-300 border-orange-500">
                +{activeTimers.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Optimized for reading while cooking */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            {/* Recipe name */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-orange-400">
                {session.timeline.name}
              </h2>
              {currentStep.recipeName !== 'all' && (
                <p className="text-sm text-gray-400">
                  {currentStep.recipeName}
                </p>
              )}
            </div>

            {/* Step instruction - Large, readable text */}
            <div 
              className={cn(
                "text-center leading-relaxed mb-6 cursor-pointer",
                "text-xl", // Always large for mobile
                "px-4 py-6 rounded-lg bg-gray-700/50"
              )}
              onClick={handleDoubleTap}
            >
              {currentStep.instruction}
            </div>

            {/* Step completion indicator */}
            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                onClick={() => currentStep && completeStep(currentStep.id)}
                className={cn(
                  "text-lg p-4",
                  isCompleted 
                    ? "text-green-400 hover:text-green-300" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 mr-2" />
                ) : (
                  <Circle className="h-6 w-6 mr-2" />
                )}
                {isCompleted ? 'Đã hoàn thành' : 'Chạm để hoàn thành'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage hints */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Hand className="h-4 w-4 mr-1" />
              <span>Vuốt trái/phải để chuyển bước</span>
            </div>
          </div>
          <div>Chạm đôi vào hướng dẫn để hoàn thành bước</div>
        </div>
      </div>

      {/* Bottom Navigation - Large touch targets for one-handed use */}
      <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={previousStep}
            disabled={session.currentStepIndex === 0}
            className="flex-1 mr-2 h-14 text-lg border-gray-600 hover:bg-gray-800"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Trước
          </Button>

          {/* Voice button - Center for easy access */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleSpeakInstruction}
            disabled={!settings.voiceEnabled}
            className="mx-2 h-14 px-6 border-blue-600 text-blue-400 hover:bg-blue-900/20"
          >
            {settings.voiceEnabled ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={nextStep}
            disabled={session.currentStepIndex >= session.timeline.optimizedSteps.length - 1}
            className="flex-1 ml-2 h-14 text-lg border-gray-600 hover:bg-gray-800"
          >
            Tiếp
            <ChevronRight className="h-6 w-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileCookingMode;
