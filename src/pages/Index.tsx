
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import PopularRecipes from '@/components/PopularRecipes';
import CallToAction from '@/components/CallToAction';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
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
            <PopularRecipes />
            <CallToAction />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
