import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MealPlanningProvider } from "@/contexts/MealPlanningContext";
import { KitchenProvider } from "@/contexts/KitchenContext";
import { CookingModeProvider } from "@/contexts/CookingModeContext";

// Import cơ bản trước
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Import trang chủ và một số trang cơ bản
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import RecipeDetailPage from "./pages/RecipeDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import AdminPage from "./pages/AdminPage";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";
import KitchenCommandCenter from "./components/KitchenCommandCenter";
import RecipeLibraryPage from "./pages/RecipeLibraryPage";
import MyRecipesPageNew from "./pages/MyRecipesPageNew";
import MealPlansPage from "./pages/MealPlansPage";
import DashboardPage from "./pages/DashboardPage";
import DatabaseTester from "./components/DatabaseTester";
import SimpleDbTester from "./components/SimpleDbTester";
import ConnectionDiagnosticPage from "./pages/ConnectionDiagnosticPage";
import CookingMode from "./components/cooking/CookingMode";
import CookingModeDemo from "./components/cooking/CookingModeDemo";
import MealPlanManager from "./components/meal-planning/MealPlanManager";
import ImprovedMealPlannerPage from "./components/meal-planning/ImprovedMealPlannerPage";
import EnhancedMealPlannerMain from "./components/meal-planning/EnhancedMealPlannerMain";
import ConnectionTestPage from "./pages/ConnectionTestPage";
import SupabaseTestPage from "./pages/SupabaseTestPage";
import AutoDataInitializer from "./components/AutoDataInitializer";
import ConnectionStatusIndicator from "./components/ConnectionStatusIndicator";
import MobileCookingMode from "./components/cooking/MobileCookingMode";
import AllInOneCookingMode from "./components/cooking/AllInOneCookingMode";

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffe6e6',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#d00', fontSize: '24px', marginBottom: '20px' }}>
            ❌ Có lỗi xảy ra
          </h1>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
            Lỗi: {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

// Simple test pages first
const TestHomePage = () => {
  console.log('🏠 Home page rendering...');
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
        🎉 Angiday Recipe Hub - Đang khôi phục...
      </h1>
      <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
        Trang chủ đang được khôi phục từng bước. Vui lòng chờ...
      </p>
      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>
          Tiến độ khôi phục:
        </h2>
        <ul style={{ color: '#666', fontSize: '14px' }}>
          <li>✅ React hoạt động bình thường</li>
          <li>✅ Routing hoạt động</li>
          <li>✅ QueryClient đã load</li>
          <li>✅ AuthContext đã load</li>
          <li>✅ MealPlanningContext đã load</li>
          <li>🔄 Đang load trang chủ...</li>
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  console.log('🎯 App component rendering...');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="angiday-theme">
          <AuthProvider>
              <MealPlanningProvider>
                <KitchenProvider>
                  <CookingModeProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <ConnectionStatusIndicator position="top-right" autoHide={true} />
                      <BrowserRouter>
                        <Routes>
                          {/* Main Pages */}
                          <Route path="/" element={<Index />} />

                          {/* Authentication */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/profile" element={<ProfilePage />} />

                          {/* Dashboard */}
                          <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Blog */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />

                  {/* Recipes */}
                  <Route path="/recipes" element={<RecipeLibraryPage />} />
                  <Route path="/my-recipes" element={<MyRecipesPageNew />} />
                  <Route path="/recipes-library" element={<Navigate to="/recipes" replace />} />
                  <Route path="/recipes/:id" element={<RecipeDetailPage />} />

                  {/* Admin */}
                  <Route path="/admin" element={<AdminPage />} />

                  {/* Kitchen Command Center */}
                  <Route path="/kitchen" element={<KitchenCommandCenter />} />
                  <Route path="/daily-menu" element={<Navigate to="/meal-plans" replace />} />
                  <Route path="/meal-plans" element={<MealPlansPage />} />
                  <Route path="/thuc-don" element={<Navigate to="/meal-plans" replace />} />

                  {/* Cooking routes */}
                  <Route path="/cooking-mode" element={<CookingMode />} />
                  <Route path="/mobile-cooking" element={<MobileCookingMode />} />
                  <Route path="/all-in-one-cooking" element={<AllInOneCookingMode />} />
                  <Route path="/cooking-demo" element={<CookingModeDemo />} />

                  <Route path="/meal-planning" element={<MealPlanManager />} />
                  <Route path="/database-tester" element={<DatabaseTester />} />
                  <Route path="/connection-diagnostic" element={<ConnectionDiagnosticPage />} />
                  <Route path="/connection-test" element={<ConnectionTestPage />} />
                  <Route path="/supabase-test" element={<SupabaseTestPage />} />
                  <Route path="/debug-db" element={<SimpleDbTester />} />

                  {/* Test */}
                  <Route path="/test" element={<TestPage />} />

                  {/* Debug page */}
                  <Route path="/meal-planner-test" element={<ImprovedMealPlannerPage />} />
                  <Route path="/enhanced-planner" element={<EnhancedMealPlannerMain />} />

                          {/* 404 Page */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </TooltipProvider>
                  </CookingModeProvider>
                </KitchenProvider>
              </MealPlanningProvider>
            </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
