
import React from 'react';
import StandardLayout from '@/components/layout/StandardLayout';
import HeroSection from '@/components/HeroSection';
import PopularRecipes from '@/components/PopularRecipes';
import CallToAction from '@/components/CallToAction';
import UserDashboard from '@/components/dashboard/UserDashboard';
import EnhancedFeaturedMenus from '@/components/EnhancedFeaturedMenus';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id || 'guest-user';

  return (
    <StandardLayout>
        {isAuthenticated ? (
          <>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <UserDashboard />
            </div>
          </>
        ) : (
          <>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <EnhancedFeaturedMenus userId={userId} />
            </div>
            <PopularRecipes />
            <CallToAction />
          </>
        )}
    </StandardLayout>
  );
};

export default Index;
