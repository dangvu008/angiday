// Lazy loading utilities for performance optimization
import { lazy } from 'react';

// Main Pages - High Priority (loaded immediately)
export const Index = lazy(() => import('@/pages/Index'));

// Authentication Pages - Medium Priority
export const LoginPage = lazy(() => import('@/pages/LoginPage'));
export const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
export const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// Recipe Pages - Medium Priority
export const RecipeDetailPage = lazy(() => import('@/pages/RecipeDetailPage'));
export const RecipeLibraryPage = lazy(() => import('@/pages/RecipeLibraryPage'));
export const MyRecipesPageNew = lazy(() => import('@/pages/MyRecipesPageNew'));

// Meal Planning Pages - Medium Priority
export const MealPlansPage = lazy(() => import('@/pages/MealPlansPage'));

// Kitchen Pages - Medium Priority
export const KitchenCommandCenter = lazy(() => import('@/components/KitchenCommandCenter'));

// Blog Pages - Low Priority
export const BlogPage = lazy(() => import('@/pages/BlogPage'));
export const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));

// Admin Pages - Low Priority (admin-only)
export const AdminPage = lazy(() => import('@/pages/AdminPage'));

// Demo & Test Pages - Very Low Priority (development only)
export const TestPage = lazy(() => import('@/pages/TestPage'));
export const ConnectionDiagnosticPage = lazy(() => import('@/pages/ConnectionDiagnosticPage'));
export const ConnectionTestPage = lazy(() => import('@/pages/ConnectionTestPage'));

// Error Pages
export const NotFound = lazy(() => import('@/pages/NotFound'));

// Preload functions for critical routes
export const preloadCriticalRoutes = () => {
  // Preload authentication pages as they're commonly accessed
  import('@/pages/LoginPage');
  import('@/pages/RegisterPage');
  
  // Preload main kitchen functionality
  import('@/pages/MealPlansPage');
  import('@/components/KitchenCommandCenter');
};

// Preload functions for user-specific routes
export const preloadUserRoutes = () => {
  // Preload user-specific pages after authentication
  import('@/pages/ProfilePage');
  import('@/pages/RecipeLibraryPage');
  import('@/pages/MyRecipesPageNew');
};

// Preload functions for admin routes
export const preloadAdminRoutes = () => {
  import('@/pages/AdminPage');
};

// Route-based code splitting configuration
export const routeConfig = {
  // Critical routes - loaded immediately
  critical: [
    '/',
  ],
  
  // High priority routes - preloaded on idle
  highPriority: [
    '/login',
    '/register',
    '/meal-plans',
    '/kitchen'
  ],
  
  // Medium priority routes - loaded on demand
  mediumPriority: [
    '/profile',
    '/recipes',
    '/my-recipes',
    '/recipe/:id',
    '/meal-plan/:id'
  ],
  
  // Low priority routes - loaded on demand
  lowPriority: [
    '/blog',
    '/blog/:id',
    '/cooking-mode',
    '/cooking-demo',
    '/shopping-statistics'
  ],
  
  // Admin routes - loaded on demand for admin users only
  admin: [
    '/admin'
  ],
  
  // Development routes - only in development mode
  development: [
    '/test',
    '/connection-diagnostic',
    '/connection-test'
  ]
};

// Bundle splitting configuration
export const bundleConfig = {
  // Vendor chunks
  vendor: {
    react: ['react', 'react-dom'],
    router: ['react-router-dom'],
    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    query: ['@tanstack/react-query'],
    utils: ['date-fns', 'clsx', 'tailwind-merge']
  },
  
  // Feature chunks
  features: {
    auth: ['@/contexts/AuthContext', '@/hooks/useAuth'],
    kitchen: ['@/contexts/KitchenContext', '@/services/kitchenService'],
    mealPlanning: ['@/contexts/MealPlanningContext'],
    cooking: ['@/contexts/CookingModeContext'],
    shopping: ['@/components/UnifiedShoppingListModal', '@/utils/vndPriceUtils']
  }
};

// Performance monitoring utilities
export const performanceConfig = {
  // Core Web Vitals thresholds
  thresholds: {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1   // Cumulative Layout Shift
  },
  
  // Resource hints
  resourceHints: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://images.unsplash.com'
    ],
    prefetch: [
      '/api/recipes',
      '/api/meal-plans'
    ]
  }
};

// Tree shaking optimization
export const optimizationConfig = {
  // Modules to exclude from bundle
  exclude: [
    'lodash', // Use lodash-es instead
    'moment', // Use date-fns instead
    'jquery'  // Not needed in React
  ],
  
  // Modules to include only specific functions
  partialImports: {
    'date-fns': ['format', 'parseISO', 'addDays', 'subDays'],
    'lucide-react': ['ChefHat', 'Calendar', 'ShoppingCart', 'Clock', 'Users']
  }
};
