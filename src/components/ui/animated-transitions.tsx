import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Fade transition component
interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  show,
  children,
  duration = 300,
  className
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'transition-opacity',
        show ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Slide transition component
interface SlideTransitionProps {
  show: boolean;
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  show,
  children,
  direction = 'up',
  duration = 300,
  className
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const getTransformClasses = () => {
    const baseClasses = 'transition-all transform';
    
    if (show) {
      return `${baseClasses} translate-x-0 translate-y-0 opacity-100`;
    }

    switch (direction) {
      case 'up':
        return `${baseClasses} translate-y-4 opacity-0`;
      case 'down':
        return `${baseClasses} -translate-y-4 opacity-0`;
      case 'left':
        return `${baseClasses} translate-x-4 opacity-0`;
      case 'right':
        return `${baseClasses} -translate-x-4 opacity-0`;
      default:
        return `${baseClasses} translate-y-4 opacity-0`;
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(getTransformClasses(), className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Scale transition component
interface ScaleTransitionProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export const ScaleTransition: React.FC<ScaleTransitionProps> = ({
  show,
  children,
  duration = 300,
  className
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'transition-all transform',
        show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  className
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(children.length).fill(false)
  );

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * staggerDelay);
    });
  }, [children.length, staggerDelay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all duration-500 transform',
            visibleItems[index] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Hover animation wrapper
interface HoverAnimationProps {
  children: React.ReactNode;
  scale?: number;
  lift?: boolean;
  glow?: boolean;
  className?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  scale = 1.05,
  lift = false,
  glow = false,
  className
}) => {
  return (
    <div
      className={cn(
        'transition-all duration-200 transform cursor-pointer',
        lift && 'hover:shadow-lg hover:-translate-y-1',
        glow && 'hover:shadow-orange-200 hover:shadow-lg',
        className
      )}
      style={{
        '--tw-scale-x': scale,
        '--tw-scale-y': scale,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale}) ${lift ? 'translateY(-4px)' : ''}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
      }}
    >
      {children}
    </div>
  );
};

// Pulse animation for attention
interface PulseAnimationProps {
  children: React.ReactNode;
  color?: 'orange' | 'blue' | 'green' | 'red';
  intensity?: 'light' | 'medium' | 'strong';
  className?: string;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  color = 'orange',
  intensity = 'medium',
  className
}) => {
  const getColorClasses = () => {
    const intensityMap = {
      light: '10',
      medium: '20',
      strong: '30'
    };
    
    return `animate-pulse shadow-${color}-${intensityMap[intensity]}`;
  };

  return (
    <div className={cn(getColorClasses(), className)}>
      {children}
    </div>
  );
};

// Bounce animation for success states
interface BounceAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export const BounceAnimation: React.FC<BounceAnimationProps> = ({
  children,
  trigger = false,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={cn(
        'transition-transform',
        isAnimating && 'animate-bounce',
        className
      )}
    >
      {children}
    </div>
  );
};

// Shake animation for errors
interface ShakeAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export const ShakeAnimation: React.FC<ShakeAnimationProps> = ({
  children,
  trigger = false,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={cn(
        'transition-transform',
        isAnimating && 'animate-pulse', // Using pulse as shake alternative
        className
      )}
    >
      {children}
    </div>
  );
};

// Loading dots animation
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
    </div>
  );
};

// Typing animation
interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  className,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// Progress bar animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  duration?: number;
  className?: string;
  showValue?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  duration = 1000,
  className,
  showValue = false
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={cn('relative', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all ease-out"
          style={{
            width: `${animatedValue}%`,
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
      {showValue && (
        <div className="absolute right-0 top-0 -mt-6 text-sm font-medium">
          {Math.round(animatedValue)}%
        </div>
      )}
    </div>
  );
};
