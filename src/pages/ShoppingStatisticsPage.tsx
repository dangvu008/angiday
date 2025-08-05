import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCostStatistics from '@/components/ShoppingCostStatistics';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShoppingStatisticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thống kê chi phí mua sắm
          </h1>
          <p className="text-gray-600">
            Theo dõi và phân tích chi phí mua sắm nguyên liệu theo thời gian
          </p>
        </div>

        {/* Statistics Component */}
        <ShoppingCostStatistics />
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingStatisticsPage;
