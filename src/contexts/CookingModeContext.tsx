import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  CookingModeState,
  CookingSession,
  CookingTimer,
  OptimizedStep,
  CookingModeSettings,
  DEFAULT_COOKING_MODE_SETTINGS,
  VIETNAMESE_VOICE_COMMANDS,
  CookingModeEvent
} from '@/types/cookingMode';

// Action types
type CookingModeAction =
  | { type: 'START_SESSION'; payload: CookingSession }
  | { type: 'END_SESSION' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'START_TIMER'; payload: CookingTimer }
  | { type: 'UPDATE_TIMER'; payload: { id: string; remainingTime: number } }
  | { type: 'COMPLETE_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'RESUME_TIMER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<CookingModeSettings> }
  | { type: 'COMPLETE_STEP'; payload: string }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'INIT_SPEECH_SYNTHESIS'; payload: { voices: SpeechSynthesisVoice[]; isSupported: boolean } };

// Initial state
const initialState: CookingModeState = {
  session: null,
  isActive: false,
  currentStep: null,
  settings: DEFAULT_COOKING_MODE_SETTINGS,
  timers: [],
  voiceCommands: VIETNAMESE_VOICE_COMMANDS,
  speechSynthesis: {
    isSupported: false,
    isEnabled: false,
    voices: [],
    currentVoice: null
  },
  gestureControl: {
    isSupported: false,
    isEnabled: false,
    sensitivity: 0.5
  }
};

// Reducer
function cookingModeReducer(state: CookingModeState, action: CookingModeAction): CookingModeState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: action.payload,
        isActive: true,
        currentStep: action.payload.timeline.optimizedSteps[0] || null,
        timers: []
      };

    case 'END_SESSION':
      return {
        ...state,
        session: null,
        isActive: false,
        currentStep: null,
        timers: []
      };

    case 'NEXT_STEP': {
      if (!state.session) return state;
      const nextIndex = Math.min(
        state.session.currentStepIndex + 1,
        state.session.timeline.optimizedSteps.length - 1
      );
      return {
        ...state,
        session: {
          ...state.session,
          currentStepIndex: nextIndex
        },
        currentStep: state.session.timeline.optimizedSteps[nextIndex] || null
      };
    }

    case 'PREVIOUS_STEP': {
      if (!state.session) return state;
      const prevIndex = Math.max(state.session.currentStepIndex - 1, 0);
      return {
        ...state,
        session: {
          ...state.session,
          currentStepIndex: prevIndex
        },
        currentStep: state.session.timeline.optimizedSteps[prevIndex] || null
      };
    }

    case 'GO_TO_STEP': {
      if (!state.session) return state;
      const stepIndex = Math.max(0, Math.min(action.payload, state.session.timeline.optimizedSteps.length - 1));
      return {
        ...state,
        session: {
          ...state.session,
          currentStepIndex: stepIndex
        },
        currentStep: state.session.timeline.optimizedSteps[stepIndex] || null
      };
    }

    case 'START_TIMER':
      return {
        ...state,
        timers: [...state.timers, { ...action.payload, isActive: true, startTime: Date.now() }]
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id
            ? { ...timer, remainingTime: action.payload.remainingTime }
            : timer
        )
      };

    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? { ...timer, isActive: false, remainingTime: 0 }
            : timer
        )
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? { ...timer, isActive: false }
            : timer
        )
      };

    case 'RESUME_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? { ...timer, isActive: true }
            : timer
        )
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'COMPLETE_STEP':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          completedSteps: [...state.session.completedSteps, action.payload]
        }
      };

    case 'PAUSE_SESSION':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, status: 'paused' }
      };

    case 'RESUME_SESSION':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, status: 'active' }
      };

    case 'INIT_SPEECH_SYNTHESIS':
      return {
        ...state,
        speechSynthesis: {
          ...state.speechSynthesis,
          isSupported: action.payload.isSupported,
          voices: action.payload.voices,
          currentVoice: action.payload.voices.find(voice => voice.lang === 'vi-VN') || action.payload.voices[0] || null
        }
      };

    default:
      return state;
  }
}

// Context
interface CookingModeContextType {
  state: CookingModeState;
  startSession: (session: CookingSession) => void;
  endSession: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  startTimer: (timer: CookingTimer) => void;
  pauseTimer: (timerId: string) => void;
  resumeTimer: (timerId: string) => void;
  updateSettings: (settings: Partial<CookingModeSettings>) => void;
  completeStep: (stepId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  speakText: (text: string) => void;
  isStepCompleted: (stepId: string) => boolean;
}

const CookingModeContext = createContext<CookingModeContextType | undefined>(undefined);

// Provider component
export const CookingModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cookingModeReducer, initialState);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = speechSynthesis.getVoices();
        dispatch({
          type: 'INIT_SPEECH_SYNTHESIS',
          payload: { voices, isSupported: true }
        });
      };

      updateVoices();
      speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach(timer => {
        if (timer.isActive && timer.remainingTime > 0) {
          const newRemainingTime = timer.remainingTime - 1;
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { id: timer.id, remainingTime: newRemainingTime }
          });

          if (newRemainingTime <= 0) {
            dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
            
            // Play sound or vibrate
            if (state.settings.timerSounds) {
              // Play notification sound
              const audio = new Audio('/sounds/timer-complete.mp3');
              audio.play().catch(() => {
                // Fallback to system beep
                const context = new AudioContext();
                const oscillator = context.createOscillator();
                oscillator.frequency.value = 800;
                oscillator.connect(context.destination);
                oscillator.start();
                oscillator.stop(context.currentTime + 0.5);
              });
            }

            if (state.settings.vibrationAlerts && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timers, state.settings.timerSounds, state.settings.vibrationAlerts]);

  // Keep screen on
  useEffect(() => {
    if (state.isActive && state.settings.keepScreenOn) {
      // Request wake lock
      if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').catch(console.error);
      }
    }
  }, [state.isActive, state.settings.keepScreenOn]);

  // Context methods
  const startSession = useCallback((session: CookingSession) => {
    dispatch({ type: 'START_SESSION', payload: session });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: stepIndex });
  }, []);

  const startTimer = useCallback((timer: CookingTimer) => {
    dispatch({ type: 'START_TIMER', payload: timer });
  }, []);

  const pauseTimer = useCallback((timerId: string) => {
    dispatch({ type: 'PAUSE_TIMER', payload: timerId });
  }, []);

  const resumeTimer = useCallback((timerId: string) => {
    dispatch({ type: 'RESUME_TIMER', payload: timerId });
  }, []);

  const updateSettings = useCallback((settings: Partial<CookingModeSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const completeStep = useCallback((stepId: string) => {
    dispatch({ type: 'COMPLETE_STEP', payload: stepId });
  }, []);

  const pauseSession = useCallback(() => {
    dispatch({ type: 'PAUSE_SESSION' });
  }, []);

  const resumeSession = useCallback(() => {
    dispatch({ type: 'RESUME_SESSION' });
  }, []);

  const speakText = useCallback((text: string) => {
    if (state.speechSynthesis.isSupported && state.settings.voiceEnabled && state.speechSynthesis.currentVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = state.speechSynthesis.currentVoice;
      utterance.lang = state.settings.voiceLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, [state.speechSynthesis, state.settings.voiceEnabled, state.settings.voiceLanguage]);

  const isStepCompleted = useCallback((stepId: string) => {
    return state.session?.completedSteps.includes(stepId) || false;
  }, [state.session?.completedSteps]);

  const value: CookingModeContextType = {
    state,
    startSession,
    endSession,
    nextStep,
    previousStep,
    goToStep,
    startTimer,
    pauseTimer,
    resumeTimer,
    updateSettings,
    completeStep,
    pauseSession,
    resumeSession,
    speakText,
    isStepCompleted
  };

  return (
    <CookingModeContext.Provider value={value}>
      {children}
    </CookingModeContext.Provider>
  );
};

// Hook
export const useCookingMode = () => {
  const context = useContext(CookingModeContext);
  if (context === undefined) {
    throw new Error('useCookingMode must be used within a CookingModeProvider');
  }
  return context;
};
