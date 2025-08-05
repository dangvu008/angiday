
import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import HeroSection from '@/components/HeroSection';
import PopularRecipes from '@/components/PopularRecipes';
import EasyDinnerRecipes from '@/components/EasyDinnerRecipes';
import FeatureShowcase from '@/components/FeatureShowcase';
import FeaturedMealPackages from '@/components/FeaturedMealPackages';
import TodayMenuDisplay from '@/components/TodayMenuDisplay';
import ShoppingStatusManager from '@/components/ShoppingStatusManager';
import UnifiedShoppingListModal from '@/components/UnifiedShoppingListModal';
import WelcomeGuide from '@/components/WelcomeGuide';
import QuickMealPlanModal from '@/components/QuickMealPlanModal';
import { useAuth } from '@/contexts/AuthContext';
import { useKitchen } from '@/contexts/KitchenContext';
import { supabaseHelpers } from '@/config/supabase';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { todayMeals, dailyShoppingStatus } = useKitchen();
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showQuickMealPlanModal, setShowQuickMealPlanModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // Test Supabase connection on load
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection...');
        const result = await supabaseHelpers.testConnection();
        setConnectionStatus(result);
        console.log('Connection test result:', result);

        // If connection fails, try to setup database
        if (!result.success && result.details?.basicConnection) {
          console.log('🔧 Attempting to setup database...');
          const setupResult = await supabaseHelpers.setupDatabase();
          console.log('Database setup result:', setupResult);

          // Test connection again after setup
          if (setupResult.success) {
            const retestResult = await supabaseHelpers.testConnection();
            setConnectionStatus(retestResult);
          }
        }
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionStatus({ success: false, error: error.message });
      }
    };

    testConnection();
  }, []);

  const handleGoShopping = () => {
    setShowShoppingModal(true);
  };

  const handleStartCooking = () => {
    // Navigate to cooking mode or show cooking interface
    console.log('Starting cooking mode...');
  };

  const handleSetupDatabase = async () => {
    try {
      console.log('🔧 Manual database setup...');
      const setupResult = await supabaseHelpers.setupDatabase();
      console.log('Database setup result:', setupResult);

      // Test connection again after setup
      const retestResult = await supabaseHelpers.testConnection();
      setConnectionStatus(retestResult);
    } catch (error) {
      console.error('Database setup error:', error);
    }
  };

  return (
    <PublicLayout>
      <HeroSection />

      {/* Debug Connection Status - Only show if using Supabase */}
      {import.meta.env.VITE_DATABASE_ADAPTER === 'supabase' && connectionStatus && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">🔍 Debug: Supabase Connection Status</h3>
          <pre className="text-sm text-yellow-700 mt-2">
            {JSON.stringify(connectionStatus, null, 2)}
          </pre>
          {!connectionStatus.success && (
            <button
              onClick={handleSetupDatabase}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔧 Setup Database
            </button>
          )}
        </div>
      )}

      {/* Today's Menu Section - Only show for authenticated users */}
      {isAuthenticated && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Menu Display - Takes 2 columns */}
              <div className="lg:col-span-2">
                <TodayMenuDisplay />
              </div>

              {/* Shopping Status Manager - Takes 1 column */}
              <div>
                <ShoppingStatusManager
                  onGoShopping={handleGoShopping}
                  onStartCooking={handleStartCooking}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <FeaturedMealPackages />
      <EasyDinnerRecipes />
      <FeatureShowcase />

      {/* Unified Shopping List Modal */}
      <UnifiedShoppingListModal
        isOpen={showShoppingModal}
        onClose={() => setShowShoppingModal(false)}
        dailyShoppingStatusId={dailyShoppingStatus?.id || ''}
        mode="enhanced"
        enablePriceTracking={true}
        enableCategoryBreakdown={true}
        enableExport={true}
      />

      {/* Welcome Guide for new users */}
      <WelcomeGuide
        onStartQuickSetup={() => setShowQuickMealPlanModal(true)}
      />

      {/* Quick Meal Plan Modal */}
      <QuickMealPlanModal
        isOpen={showQuickMealPlanModal}
        onClose={() => setShowQuickMealPlanModal(false)}
        onApply={(planId) => {
          console.log('Applied meal plan from Index:', planId);
        }}
      />
    </PublicLayout>
  );
};

export default Index;
