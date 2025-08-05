import React, { useEffect, useState } from 'react';
import { Timer, Pause, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { CookingTimer as CookingTimerType } from '@/types/cookingMode';
import { cn } from '@/lib/utils';

interface CookingTimerProps {
  timer: CookingTimerType;
  compact?: boolean;
  className?: string;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ 
  timer, 
  compact = false, 
  className 
}) => {
  const { pauseTimer, resumeTimer, startTimer } = useCookingMode();
  const [isExpired, setIsExpired] = useState(false);

  // Format time display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = ((timer.duration - timer.remainingTime) / timer.duration) * 100;

  // Check if timer expired
  useEffect(() => {
    setIsExpired(timer.remainingTime <= 0 && !timer.isActive);
  }, [timer.remainingTime, timer.isActive]);

  const handleToggleTimer = () => {
    if (timer.isActive) {
      pauseTimer(timer.id);
    } else if (timer.remainingTime > 0) {
      resumeTimer(timer.id);
    } else {
      // Reset and start timer
      const resetTimer = {
        ...timer,
        remainingTime: timer.duration,
        isActive: true
      };
      startTimer(resetTimer);
    }
  };

  const handleResetTimer = () => {
    const resetTimer = {
      ...timer,
      remainingTime: timer.duration,
      isActive: false
    };
    startTimer(resetTimer);
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-lg border",
        isExpired 
          ? "bg-red-900/30 border-red-700 text-red-300" 
          : timer.isActive 
            ? "bg-orange-900/30 border-orange-700 text-orange-300"
            : "bg-gray-800 border-gray-600 text-gray-300",
        className
      )}>
        <Timer className="h-4 w-4" />
        <span className="font-mono text-sm font-medium">
          {formatTime(timer.remainingTime)}
        </span>
        <Button
          onClick={handleToggleTimer}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
        >
          {timer.isActive ? (
            <Pause className="h-3 w-3" />
          ) : timer.remainingTime > 0 ? (
            <Play className="h-3 w-3" />
          ) : (
            <RotateCcw className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-300",
      isExpired 
        ? "bg-red-900/20 border-red-700" 
        : timer.isActive 
          ? "bg-orange-900/20 border-orange-700"
          : "bg-gray-800 border-gray-600",
      className
    )}>
      <CardContent className="p-4">
        <div className="text-center">
          {/* Timer Name */}
          <h3 className="font-medium text-sm mb-2 text-gray-300">
            {timer.name}
          </h3>

          {/* Time Display */}
          <div className={cn(
            "text-3xl font-mono font-bold mb-3",
            isExpired 
              ? "text-red-400" 
              : timer.isActive 
                ? "text-orange-400"
                : "text-gray-300"
          )}>
            {formatTime(timer.remainingTime)}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                isExpired && "bg-red-900",
                timer.isActive && "bg-orange-900"
              )}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              onClick={handleToggleTimer}
              size="sm"
              variant={timer.isActive ? "destructive" : "default"}
              className={cn(
                timer.isActive 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700"
              )}
            >
              {timer.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Tạm dừng
                </>
              ) : timer.remainingTime > 0 ? (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Tiếp tục
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Bắt đầu lại
                </>
              )}
            </Button>

            <Button
              onClick={handleResetTimer}
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Square className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          {/* Status */}
          {isExpired && (
            <div className="mt-3 text-sm text-red-400 font-medium animate-pulse">
              ⏰ Hết giờ!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CookingTimer;
