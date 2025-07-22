import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  CheckCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CookingStep {
  id: number;
  instruction: string;
  duration?: number; // thời gian tính bằng giây
  temperature?: string;
  note?: string;
}

interface CookingModeProps {
  steps: string[];
  recipeName: string;
  onClose: () => void;
}

export const CookingMode = ({ steps, recipeName, onClose }: CookingModeProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Chuyển đổi steps thành CookingStep với thời gian ước tính
  const cookingSteps: CookingStep[] = steps.map((step, index) => ({
    id: index,
    instruction: step,
    duration: extractDuration(step),
    temperature: extractTemperature(step)
  }));

  // Trích xuất thời gian từ text (ví dụ: "3 phút", "30 giây")
  function extractDuration(text: string): number | undefined {
    const timeMatch = text.match(/(\d+)\s*(phút|giây|tiếng)/i);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      switch (unit) {
        case 'giây': return value;
        case 'phút': return value * 60;
        case 'tiếng': return value * 3600;
        default: return undefined;
      }
    }
    return undefined;
  }

  // Trích xuất nhiệt độ từ text
  function extractTemperature(text: string): string | undefined {
    const tempMatch = text.match(/(\d+)\s*độ/i);
    return tempMatch ? `${tempMatch[1]}°C` : undefined;
  }

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Phát âm thanh hoặc thông báo
            toast({
              title: "Hoàn thành!",
              description: "Thời gian nấu đã kết thúc",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, toast]);

  // Voice synthesis
  const speakInstruction = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      speechSynthesis.speak(utterance);
    }
  };

  // Navigation
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < cookingSteps.length) {
      setCurrentStep(stepIndex);
      if (voiceEnabled) {
        speakInstruction(cookingSteps[stepIndex].instruction);
      }
    }
  };

  const markStepCompleted = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < cookingSteps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const startTimer = (duration: number) => {
    setTimer(duration);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentStep + 1) / cookingSteps.length) * 100;
  const current = cookingSteps[currentStep];

  // Prevent screen from sleeping (experimental)
  useEffect(() => {
    let wakeLock: any = null;
    
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLock = lock;
      }).catch((err) => {
        console.log('Wake lock failed:', err);
      });
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`}>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">
              🍳 Chế độ nấu ăn - {recipeName}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={voiceEnabled ? 'text-primary' : ''}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bước {currentStep + 1} / {cookingSteps.length}</span>
              <span>{Math.round(progress)}% hoàn thành</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="text-6xl font-bold text-primary mb-2">
                {currentStep + 1}
              </div>
              {completedSteps.includes(currentStep) && (
                <CheckCircle className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2 h-6 w-6 text-green-500" />
              )}
            </div>
            
            <div className="bg-muted rounded-lg p-6">
              <p className="text-lg leading-relaxed">{current.instruction}</p>
              
              {/* Step Meta Info */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {current.duration && (
                  <Badge variant="secondary" className="flex items-center">
                    <Timer className="h-3 w-3 mr-1" />
                    {current.duration >= 60 
                      ? `${Math.floor(current.duration / 60)} phút` 
                      : `${current.duration} giây`}
                  </Badge>
                )}
                {current.temperature && (
                  <Badge variant="secondary">
                    🌡️ {current.temperature}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Timer Section */}
          {current.duration && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-mono font-bold text-orange-600 mb-4">
                  {formatTime(timer)}
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => startTimer(current.duration!)}
                    disabled={isTimerRunning}
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Bắt đầu hẹn giờ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleTimer}
                    disabled={timer === 0}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Bước trước
            </Button>

            <Button
              onClick={markStepCompleted}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Hoàn thành bước
            </Button>

            <Button
              variant="outline"
              onClick={() => goToStep(currentStep + 1)}
              disabled={currentStep === cookingSteps.length - 1}
            >
              Bước tiếp
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Step Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cookingSteps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(index)}
                className={`relative ${
                  completedSteps.includes(index) ? 'bg-green-100 border-green-300' : ''
                }`}
              >
                {index + 1}
                {completedSteps.includes(index) && (
                  <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                )}
              </Button>
            ))}
          </div>

          {/* Completion Status */}
          {completedSteps.length === cookingSteps.length && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">
                  🎉 Chúc mừng! Bạn đã hoàn thành món ăn!
                </h3>
                <p className="text-green-600 mt-2">
                  Hãy thưởng thức thành quả của mình nhé!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};