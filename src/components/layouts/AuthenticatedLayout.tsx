import React from 'react';
import BaseLayout from './BaseLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  requireAuth = true,
  redirectTo = '/login',
  maxWidth = '7xl',
  padding = true
}) => {
  const { isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <BaseLayout className={cn('flex flex-col', className)}>
      {showHeader && <Header />}
      
      <main className="flex-1">
        <div className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth],
          padding && 'px-4 sm:px-6 lg:px-8 py-8'
        )}>
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </BaseLayout>
  );
};

export default AuthenticatedLayout;
