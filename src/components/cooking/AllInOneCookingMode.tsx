import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Circle,
  Clock,
  ChefHat,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCookingMode } from '@/contexts/CookingModeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AllInOneCookingModeProps {
  className?: string;
}

interface StepTimer {
  stepIndex: number;
  timeLeft: number;
  isActive: boolean;
  totalTime: number;
}

const AllInOneCookingMode: React.FC<AllInOneCookingModeProps> = ({ className }) => {
  const navigate = useNavigate();
  const {
    state,
    endSession,
    speakText,
    completeStep,
    isStepCompleted
  } = useCookingMode();

  const [stepTimers, setStepTimers] = useState<{ [key: number]: StepTimer }>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [cookingStartTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const { session, settings } = state;

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      setStepTimers(prev => {
        const updated = { ...prev };
        let hasActiveTimer = false;

        Object.keys(updated).forEach(key => {
          const stepIndex = parseInt(key);
          const timer = updated[stepIndex];
          
          if (timer.isActive && timer.timeLeft > 0) {
            timer.timeLeft -= 1;
            hasActiveTimer = true;
            
            // Play sound when timer ends
            if (timer.timeLeft === 0) {
              timer.isActive = false;
              playTimerSound();
              toast.success(`Timer cho bước ${stepIndex + 1} đã kết thúc!`);
            }
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playTimerSound = () => {
    try {
      // Create audio context for timer sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Play a sequence of beeps
      const playBeep = (frequency: number, duration: number, delay: number) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

          oscillator.start();
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Play alarm sequence: high-low-high pattern
      playBeep(1000, 0.3, 0);     // High beep
      playBeep(600, 0.3, 400);    // Low beep
      playBeep(1000, 0.3, 800);   // High beep
      playBeep(600, 0.3, 1200);   // Low beep
      playBeep(1000, 0.5, 1600);  // Final high beep (longer)

      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    } catch (error) {
      console.log('Audio not supported:', error);
      // Fallback: just vibrate
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }
  };

  const handleExit = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn thoát khỏi chế độ nấu ăn?')) {
      endSession();
      navigate('/');
    }
  }, [endSession, navigate]);

  const handleSpeakText = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startTimer = (stepIndex: number, minutes: number) => {
    const totalSeconds = minutes * 60;
    setStepTimers(prev => ({
      ...prev,
      [stepIndex]: {
        stepIndex,
        timeLeft: totalSeconds,
        isActive: true,
        totalTime: totalSeconds
      }
    }));
    toast.success(`Đã bắt đầu timer ${minutes} phút cho bước ${stepIndex + 1}`);
  };

  const pauseTimer = (stepIndex: number) => {
    setStepTimers(prev => ({
      ...prev,
      [stepIndex]: {
        ...prev[stepIndex],
        isActive: false
      }
    }));
  };

  const resumeTimer = (stepIndex: number) => {
    setStepTimers(prev => ({
      ...prev,
      [stepIndex]: {
        ...prev[stepIndex],
        isActive: true
      }
    }));
  };

  const resetTimer = (stepIndex: number) => {
    setStepTimers(prev => {
      const updated = { ...prev };
      delete updated[stepIndex];
      return updated;
    });
  };

  const toggleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      if (updated.has(stepIndex)) {
        updated.delete(stepIndex);
      } else {
        updated.add(stepIndex);

        // Auto scroll to next incomplete step
        setTimeout(() => {
          const nextIncompleteStep = steps.findIndex((_, index) =>
            index > stepIndex && !updated.has(index)
          );
          if (nextIncompleteStep !== -1) {
            const element = document.getElementById(`step-${nextIncompleteStep}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 500);
      }
      return updated;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải chế độ nấu ăn...</p>
        </div>
      </div>
    );
  }

  const steps = session.timeline.optimizedSteps;
  const ingredients = session.timeline.recipes.flatMap(recipe => recipe.ingredients);
  const uniqueIngredients = Array.from(new Set(ingredients));

  // Calculate cooking time
  const cookingDuration = Math.floor((currentTime.getTime() - cookingStartTime.getTime()) / 1000 / 60);
  const estimatedTotalTime = session.timeline.recipes.reduce((total, recipe) => total + recipe.totalTime, 0);

  return (
    <div 
      className={cn(
        "min-h-screen bg-gray-900 text-white",
        className
      )}
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="h-5 w-5 mr-2" />
            Thoát
          </Button>

          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-orange-400">
              {session.timeline.name}
            </h1>
            <div className="flex items-center justify-center space-x-4 mt-1 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{cookingDuration}p đã nấu</span>
              </div>
              {estimatedTotalTime > 0 && (
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>~{estimatedTotalTime}p tổng</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={cn(
              "transition-colors",
              voiceEnabled ? "text-blue-400 hover:text-blue-300" : "text-gray-400 hover:text-white"
            )}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Package className="h-5 w-5 mr-2" />
                  Nguyên liệu cần chuẩn bị
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uniqueIngredients.map((ingredient, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 bg-gray-700/50 rounded-lg text-sm"
                    >
                      <Circle className="h-4 w-4 mr-3 text-green-400" />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <Badge variant="secondary" className="w-full justify-center">
                    Tổng cộng: {uniqueIngredients.length} nguyên liệu
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Steps Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Các bước thực hiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const isCompleted = completedSteps.has(index);
                    const timer = stepTimers[index];
                    
                    return (
                      <div
                        key={step.id}
                        id={`step-${index}`}
                        className={cn(
                          "p-6 rounded-lg border transition-all",
                          isCompleted
                            ? "bg-green-900/20 border-green-600"
                            : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                        )}
                      >
                        {/* Step Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStepComplete(index)}
                              className={cn(
                                "mr-3 p-1",
                                isCompleted 
                                  ? "text-green-400 hover:text-green-300" 
                                  : "text-gray-400 hover:text-white"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <Circle className="h-6 w-6" />
                              )}
                            </Button>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                Bước {index + 1}
                              </h3>
                              {step.recipeName !== 'all' && (
                                <p className="text-sm text-gray-400">
                                  {step.recipeName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Voice Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSpeakText(step.instruction)}
                            disabled={!voiceEnabled}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Step Instruction */}
                        <div className={cn(
                          "text-lg leading-relaxed mb-4 p-4 rounded bg-gray-800/50",
                          isCompleted && "line-through text-gray-500"
                        )}>
                          {step.instruction}
                        </div>

                        {/* Timer Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {/* Timer Display */}
                            {timer && (
                              <div className={cn(
                                "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all",
                                timer.timeLeft === 0
                                  ? "bg-red-900/70 border-2 border-red-500 animate-pulse"
                                  : timer.timeLeft <= 60
                                  ? "bg-yellow-900/50 border border-yellow-600"
                                  : "bg-blue-900/50 border border-blue-600"
                              )}>
                                <Timer className={cn(
                                  "h-5 w-5",
                                  timer.timeLeft === 0 ? "text-red-400" : "text-blue-400"
                                )} />
                                <span className={cn(
                                  "font-mono text-xl font-bold",
                                  timer.timeLeft === 0 ? "text-red-400" : "text-white"
                                )}>
                                  {timer.timeLeft === 0 ? "⏰ HẾT GIỜ!" : formatTime(timer.timeLeft)}
                                </span>
                                
                                {/* Timer Controls */}
                                <div className="flex space-x-1">
                                  {timer.isActive ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => pauseTimer(index)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Pause className="h-3 w-3" />
                                    </Button>
                                  ) : timer.timeLeft > 0 ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => resumeTimer(index)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                  ) : null}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => resetTimer(index)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Timer Quick Start Buttons */}
                          {!timer && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-gray-400 mr-2">Bấm giờ:</span>
                              <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 5, 10, 15, 20, 30, 45, 60].map(minutes => (
                                  <Button
                                    key={minutes}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startTimer(index, minutes)}
                                    className={cn(
                                      "h-8 px-3 text-xs border-gray-600 hover:border-orange-500 hover:text-orange-400 transition-colors",
                                      minutes <= 5 && "border-green-600 text-green-400 hover:border-green-400",
                                      minutes > 5 && minutes <= 15 && "border-yellow-600 text-yellow-400 hover:border-yellow-400",
                                      minutes > 15 && "border-red-600 text-red-400 hover:border-red-400"
                                    )}
                                  >
                                    {minutes}p
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion Summary */}
                <div className="mt-8 p-4 bg-gray-700/50 rounded-lg text-center">
                  <div className="text-lg font-semibold text-white mb-2">
                    Tiến độ hoàn thành
                  </div>
                  <div className="text-3xl font-bold text-orange-400">
                    {completedSteps.size} / {steps.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    {completedSteps.size === steps.length ? '🎉 Hoàn thành!' : 'bước đã thực hiện'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInOneCookingMode;
