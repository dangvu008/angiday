import React from 'react';
import { Loader2, ChefHat, Utensils, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'cooking';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <Loader2 className={cn('animate-spin text-orange-500', sizeClasses[size])} />
        {text && (
          <p className={cn('text-gray-600 animate-pulse', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
        {text && (
          <p className={cn('text-gray-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className={cn('bg-orange-500 rounded-full animate-pulse', sizeClasses[size])}></div>
        {text && (
          <p className={cn('text-gray-600 animate-pulse', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'cooking') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className="relative">
          <ChefHat className={cn('text-orange-500 animate-bounce', sizeClasses[size])} />
          <div className="absolute -top-1 -right-1">
            <Utensils className="h-3 w-3 text-orange-400 animate-spin" />
          </div>
        </div>
        {text && (
          <p className={cn('text-gray-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// Skeleton Loading Components
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
};

export const MealTemplateCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
};

export const CalendarDaySkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-3 min-h-[200px]">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="mt-4 pt-2 border-t">
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

// Loading States for specific components
export const TemplateLibraryLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <MealTemplateCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const WeeklyCalendarLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <CalendarDaySkeleton key={index} />
      ))}
    </div>
  );
};

export const PlannerSidebarLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-2 w-full" />
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border rounded-lg">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="p-3 border rounded-lg">
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="p-3 border rounded-lg">
              <Skeleton className="h-6 w-14 mb-1" />
              <Skeleton className="h-3 w-18" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
