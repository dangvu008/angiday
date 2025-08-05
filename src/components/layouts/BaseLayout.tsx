import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ui/theme-provider';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  background?: 'default' | 'secondary' | 'tertiary';
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  className,
  fullHeight = true,
  background = 'default'
}) => {
  const { designTokens } = useTheme();
  
  const backgroundClasses = {
    default: 'bg-white',
    secondary: 'bg-gray-50',
    tertiary: 'bg-gray-100'
  };

  return (
    <div 
      className={cn(
        'w-full',
        fullHeight && 'min-h-screen',
        backgroundClasses[background],
        className
      )}
      style={{
        fontFamily: designTokens.typography.fontFamily.sans.join(', ')
      }}
    >
      {children}
    </div>
  );
};

export default BaseLayout;
