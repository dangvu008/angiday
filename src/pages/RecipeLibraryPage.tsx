import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeLibrary from '@/components/RecipeLibrary';

const RecipeLibraryPage: React.FC = () => {
  const location = useLocation();
  const isMyRecipes = location.pathname === '/my-recipes';
  const pageTitle = isMyRecipes ? 'Công thức của tôi' : 'Tất cả công thức';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-orange-600">Trang chủ</a>
            <span>/</span>
            <span className="text-gray-900">{pageTitle}</span>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <RecipeLibrary />
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeLibraryPage;
