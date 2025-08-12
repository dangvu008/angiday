import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedUserDashboard from '@/components/dashboard/EnhancedUserDashboard';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EnhancedUserDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
