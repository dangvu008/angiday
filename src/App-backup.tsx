// Backup of current App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MealPlanningProvider } from "@/contexts/MealPlanningContext";
import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import MealPlansPage from "./pages/MealPlansPage";
import MealPlanDetailPage from "./pages/MealPlanDetailPage";
import MealDetailPage from "./pages/MealDetailPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import MealPlanningHub from "./components/MealPlanningHub";
import MealPlanningPageSimple from "./components/MealPlanningPageSimple";
import MealPlanningAdvanced from "./components/MealPlanningAdvanced";
import MealPlanningGuestView from "./components/MealPlanningGuestView";
import AllMealPlansView from "./components/AllMealPlansView";
import PersonalMealPlanner from "./components/PersonalMealPlanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple test with routing
const TestPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Angiday Recipe Hub
      </h1>
      <p className="text-lg text-gray-600">
        Ứng dụng đang chạy thành công! 🎉
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MealPlanningProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={
                <div className="min-h-screen bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                    <p className="text-lg text-gray-600">Các bài viết về nấu ăn và dinh dưỡng...</p>
                  </div>
                </div>
              } />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              
              {/* Recipe Routes */}
              <Route path="/recipes" element={
                <div className="min-h-screen bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Công thức nấu ăn</h1>
                    <p className="text-lg text-gray-600">Trang công thức đang được phát triển...</p>
                  </div>
                </div>
              } />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MealPlanningProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
