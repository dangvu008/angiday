import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  closable?: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className,
  showIcon = true,
  closable = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Entrance animation
    setIsAnimating(true);
    const animationTimer = setTimeout(() => setIsAnimating(false), 300);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => {
        clearTimeout(timer);
        clearTimeout(animationTimer);
      };
    }

    return () => clearTimeout(animationTimer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'border rounded-lg p-4 transition-all duration-300 transform',
        getStyles(),
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100',
        !isVisible && 'scale-95 opacity-0',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={cn('flex-shrink-0', getIconColor())}>
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
        </div>

        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast-like floating feedback
interface FloatingFeedbackProps extends FeedbackProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({
  position = 'top-right',
  ...props
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50';
      case 'top-left':
        return 'fixed top-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50';
    }
  };

  return (
    <div className={getPositionStyles()}>
      <Feedback {...props} className={cn('shadow-lg max-w-sm', props.className)} />
    </div>
  );
};

// Inline feedback for forms
interface InlineFeedbackProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  className?: string;
}

export const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  type,
  message,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
    }
  };

  return (
    <div className={cn('flex items-center gap-2 mt-1 animate-in slide-in-from-top-1', className)}>
      {getIcon()}
      <span className={cn('text-sm', getTextColor())}>{message}</span>
    </div>
  );
};

// Progress feedback with animation
interface ProgressFeedbackProps {
  steps: Array<{
    label: string;
    status: 'pending' | 'loading' | 'success' | 'error';
  }>;
  className?: string;
}

export const ProgressFeedback: React.FC<ProgressFeedbackProps> = ({
  steps,
  className
}) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
      case 'loading':
        return <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500';
      case 'loading':
        return 'text-orange-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          {getStepIcon(step.status)}
          <span className={cn('text-sm font-medium', getStepColor(step.status))}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Success animation component
export const SuccessAnimation: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        'relative rounded-full bg-green-100 flex items-center justify-center',
        'animate-in zoom-in-50 duration-500',
        sizeClasses[size]
      )}>
        <CheckCircle className={cn(
          'text-green-500 animate-in zoom-in-75 duration-700 delay-200',
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'
        )} />
        
        {/* Ripple effect */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20',
          sizeClasses[size]
        )} />
      </div>
    </div>
  );
};

// Error animation component
export const ErrorAnimation: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        'relative rounded-full bg-red-100 flex items-center justify-center',
        'animate-in zoom-in-50 duration-500',
        sizeClasses[size]
      )}>
        <XCircle className={cn(
          'text-red-500 animate-in zoom-in-75 duration-700 delay-200',
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'
        )} />
        
        {/* Shake effect */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-red-200 animate-pulse opacity-20',
          sizeClasses[size]
        )} />
      </div>
    </div>
  );
};

export default Feedback;
