// Types và interfaces cho Cooking Mode

export interface CookingStep {
  id: string;
  stepNumber: number;
  instruction: string;
  ingredients?: string[]; // Nguyên liệu cần cho bước này
  timers?: CookingTimer[]; // Các timer trong bước này
  tips?: string; // Mẹo vặt cho bước này
  imageUrl?: string;
  estimatedTime?: number; // Thời gian ước tính (phút)
}

export interface CookingTimer {
  id: string;
  name: string;
  duration: number; // Thời gian tính bằng giây
  isActive: boolean;
  remainingTime: number;
  startTime?: number;
  endTime?: number;
  soundAlert?: boolean;
  vibrationAlert?: boolean;
}

export interface CookingRecipe {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  steps: CookingStep[];
  totalTime: number; // Tổng thời gian nấu (phút)
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  tags: string[];
}

export interface OptimizedCookingTimeline {
  id: string;
  name: string; // Tên bữa ăn, ví dụ: "Bữa trưa hôm nay"
  recipes: CookingRecipe[];
  optimizedSteps: OptimizedStep[];
  totalEstimatedTime: number;
  createdAt: Date;
}

export interface OptimizedStep {
  id: string;
  stepNumber: number;
  recipeId: string; // Món ăn nào
  recipeName: string;
  instruction: string;
  ingredients?: string[];
  timers?: CookingTimer[];
  isParallel?: boolean; // Có thể làm song song với bước khác không
  dependencies?: string[]; // Phụ thuộc vào các bước nào
  estimatedTime: number;
  category: 'prep' | 'cooking' | 'waiting' | 'finishing';
}

export interface CookingSession {
  id: string;
  timeline: OptimizedCookingTimeline;
  currentStepIndex: number;
  startTime: Date;
  activeTimers: CookingTimer[];
  completedSteps: string[];
  settings: CookingModeSettings;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface CookingModeSettings {
  keepScreenOn: boolean;
  darkMode: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  voiceEnabled: boolean;
  voiceLanguage: 'vi-VN' | 'en-US';
  gestureControlEnabled: boolean;
  autoAdvanceSteps: boolean;
  timerSounds: boolean;
  vibrationAlerts: boolean;
  layout: 'mobile' | 'tablet';
}

export interface VoiceCommand {
  command: string;
  aliases: string[];
  action: string;
  parameters?: Record<string, any>;
}

export interface CookingModeState {
  session: CookingSession | null;
  isActive: boolean;
  currentStep: OptimizedStep | null;
  settings: CookingModeSettings;
  timers: CookingTimer[];
  voiceCommands: VoiceCommand[];
  speechSynthesis: {
    isSupported: boolean;
    isEnabled: boolean;
    voices: SpeechSynthesisVoice[];
    currentVoice: SpeechSynthesisVoice | null;
  };
  gestureControl: {
    isSupported: boolean;
    isEnabled: boolean;
    sensitivity: number;
  };
}

// Utility types
export type CookingModeView = 'optimized' | 'individual' | 'ingredients';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed' | 'expired';
export type StepCategory = 'prep' | 'cooking' | 'waiting' | 'finishing';

// Event types
export interface CookingModeEvent {
  type: 'step_changed' | 'timer_started' | 'timer_completed' | 'voice_command' | 'gesture_detected';
  payload: any;
  timestamp: Date;
}

// Default settings
export const DEFAULT_COOKING_MODE_SETTINGS: CookingModeSettings = {
  keepScreenOn: true,
  darkMode: true,
  fontSize: 'large',
  voiceEnabled: false,
  voiceLanguage: 'vi-VN',
  gestureControlEnabled: false,
  autoAdvanceSteps: false,
  timerSounds: true,
  vibrationAlerts: true,
  layout: 'mobile'
};

// Voice commands in Vietnamese
export const VIETNAMESE_VOICE_COMMANDS: VoiceCommand[] = [
  {
    command: 'bước tiếp theo',
    aliases: ['next step', 'tiếp theo', 'bước sau'],
    action: 'next_step'
  },
  {
    command: 'quay lại',
    aliases: ['previous step', 'bước trước', 'lùi lại'],
    action: 'previous_step'
  },
  {
    command: 'nguyên liệu',
    aliases: ['ingredients', 'nguyên liệu là gì', 'cần gì'],
    action: 'read_ingredients'
  },
  {
    command: 'đọc hướng dẫn',
    aliases: ['read instruction', 'đọc lại', 'hướng dẫn'],
    action: 'read_instruction'
  },
  {
    command: 'bắt đầu đếm giờ',
    aliases: ['start timer', 'timer', 'đếm giờ'],
    action: 'start_timer'
  },
  {
    command: 'dừng đếm giờ',
    aliases: ['stop timer', 'tạm dừng', 'pause timer'],
    action: 'pause_timer'
  },
  {
    command: 'hoàn thành',
    aliases: ['done', 'xong', 'finish'],
    action: 'complete_step'
  }
];
