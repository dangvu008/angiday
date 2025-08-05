import React from 'react';
import BaseLayout from './BaseLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: any;
  footerProps?: any;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps = {}
}) => {
  return (
    <BaseLayout className={cn('flex flex-col', className)}>
      {showHeader && <Header {...headerProps} />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer {...footerProps} />}
    </BaseLayout>
  );
};

export default PublicLayout;
