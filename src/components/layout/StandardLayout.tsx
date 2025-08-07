import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  mainClassName?: string;
}

const StandardLayout: React.FC<StandardLayoutProps> = ({
  children,
  className = '',
  showHeader = true,
  showFooter = true,
  containerClassName = '',
  headerClassName = '',
  footerClassName = '',
  mainClassName = ''
}) => {
  return (
    <div className={cn("min-h-screen bg-white flex flex-col", className)}>
      {showHeader && (
        <div className={headerClassName}>
          <Header />
        </div>
      )}
      
      <main className={cn("flex-1", mainClassName)}>
        {containerClassName ? (
          <div className={containerClassName}>
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      
      {showFooter && (
        <div className={footerClassName}>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default StandardLayout;
