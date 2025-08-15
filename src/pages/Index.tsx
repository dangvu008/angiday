
import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import HeroSection from '@/components/HeroSection';
import PopularRecipes from '@/components/PopularRecipes';
import EasyDinnerRecipes from '@/components/EasyDinnerRecipes';
import FeatureShowcase from '@/components/FeatureShowcase';
import FeaturedMealPackages from '@/components/FeaturedMealPackages';
import TodayMealPlanWidget from '@/components/dashboard/TodayMealPlanWidget';
import ShoppingStatusManager from '@/components/ShoppingStatusManager';
import UnifiedShoppingListModal from '@/components/UnifiedShoppingListModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import WelcomeGuide from '@/components/WelcomeGuide';
import QuickMealPlanModal from '@/components/QuickMealPlanModal';
import RecipeImportButton from '@/components/recipe/RecipeImportButton';

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

  const handleImportRecipe = (recipe: any) => {
    console.log('Imported recipe:', recipe);
    // In a real app, this would save to the database
    // For now, just show success message
    alert(`Đã nhập công thức: ${recipe.title}`);
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

      {/* Recipe Import Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Có công thức yêu thích?
              </h2>
              <p className="text-gray-600">
                Nhập công thức từ bất kỳ trang web, văn bản hoặc file nào
              </p>
            </div>
            <RecipeImportButton
              onImport={handleImportRecipe}
              variant="default"
              size="default"
              showDropdown={true}
            />
          </div>
        </div>
      </section>

      {/* Today's Meal Plan Widget - Only show for authenticated users */}
      {isAuthenticated && (
        <section className="py-12 bg-gradient-to-br from-orange-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TodayMealPlanWidget />
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
