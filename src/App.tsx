import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MealPlanningProvider } from "@/contexts/MealPlanningContext";

// Import all pages
import Index from "./pages/Index";
import AdminPage from "./pages/AdminPage";
import AntiBlockPage from "./pages/AntiBlockPage";
import BatchImportDemoPage from "./pages/BatchImportDemoPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ErrorHandlingPage from "./pages/ErrorHandlingPage";
import ImageValidationTestPage from "./pages/ImageValidationTestPage";
import ImportDemoPage from "./pages/ImportDemoPage";
import ImportTestDemoPage from "./pages/ImportTestDemoPage";
import IngredientOptimizationPage from "./pages/IngredientOptimizationPage";
import KnorrStyleDemo from "./pages/KnorrStyleDemo";
import KnorrSystemDemo from "./pages/KnorrSystemDemo";
import LoginPage from "./pages/LoginPage";
import MealDetailPage from "./pages/MealDetailPage";
import MealPlanDetailPage from "./pages/MealPlanDetailPage";
import MealPlanImporterPage from "./pages/MealPlanImporterPage";
import MealPlansPage from "./pages/MealPlansPage";
import MultiLanguageImportPage from "./pages/MultiLanguageImportPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import NotFound from "./pages/NotFound";
import NutritionCalculatorTestPage from "./pages/NutritionCalculatorTestPage";
import ProfilePage from "./pages/ProfilePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipesPage from "./pages/RecipesPage";
import RegisterPage from "./pages/RegisterPage";
import SmartExtractionPage from "./pages/SmartExtractionPage";
import TestPage from "./pages/TestPage";
import ValidationTestPage from "./pages/ValidationTestPage";
import RouteTestPage from "./pages/RouteTestPage";
import MealPlanningAdvanced from "./components/MealPlanningAdvanced";
import MealPlanningPage from "./pages/MealPlanningPage";
import PersonalMealPlanner from "./components/PersonalMealPlanner";
import MenuSystemDemo from "./components/MenuSystemDemo";
import MenuCatalogPage from "./pages/MenuCatalogPage";
import MenuDetailPage from "./pages/MenuDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MealPlanningProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Blog */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />

              {/* Recipes */}
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              <Route path="/my-recipes" element={<MyRecipesPage />} />
              <Route path="/my-favorites" element={<MyFavoritesPage />} />

              {/* Menus */}
              <Route path="/thuc-don" element={<MenuCatalogPage />} />
              <Route path="/thuc-don/category/:category" element={<MenuCatalogPage />} />
              <Route path="/thuc-don/detail/:id" element={<MenuDetailPage />} />

              {/* Meal Plans */}
              <Route path="/meal-plans" element={<MealPlansPage />} />
              <Route path="/meal-plans/:id" element={<MealPlanDetailPage />} />
              <Route path="/meal-planner" element={<MealPlanningAdvanced />} />
              <Route path="/ke-hoach-nau-an" element={<MealPlanningPage />} />
              <Route path="/meal/:id" element={<MealDetailPage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Demo and Test Pages */}
              <Route path="/test" element={<TestPage />} />
              <Route path="/route-test" element={<RouteTestPage />} />
              <Route path="/import-demo" element={<ImportDemoPage />} />
              <Route path="/import-test-demo" element={<ImportTestDemoPage />} />
              <Route path="/batch-import-demo" element={<BatchImportDemoPage />} />
              <Route path="/multi-language-import" element={<MultiLanguageImportPage />} />
              <Route path="/meal-plan-importer" element={<MealPlanImporterPage />} />
              <Route path="/smart-extraction" element={<SmartExtractionPage />} />
              <Route path="/anti-block" element={<AntiBlockPage />} />
              <Route path="/ingredient-optimization" element={<IngredientOptimizationPage />} />
              <Route path="/knorr-style-demo" element={<KnorrStyleDemo />} />
              <Route path="/knorr-system-demo" element={<KnorrSystemDemo />} />
              <Route path="/image-validation-test" element={<ImageValidationTestPage />} />
              <Route path="/nutrition-calculator-test" element={<NutritionCalculatorTestPage />} />
              <Route path="/validation-test" element={<ValidationTestPage />} />
              <Route path="/error-handling" element={<ErrorHandlingPage />} />
              <Route path="/menu-system-demo" element={<MenuSystemDemo />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MealPlanningProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
