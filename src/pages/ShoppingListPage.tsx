import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingListGenerator from '@/components/meal-planning/ShoppingListGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

const ShoppingListPage: React.FC = () => {
  const { activePlan } = useMealPlanning();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Danh Sách Mua Sắm
          </h1>
          <p className="text-gray-600">
            Chuẩn bị nguyên liệu cho kế hoạch ăn uống của bạn
          </p>
        </div>

        {/* Content */}
        {activePlan ? (
          <ShoppingListGenerator useActivePlan={true} />
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có kế hoạch đang áp dụng
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn cần có một kế hoạch ăn uống đang áp dụng để tạo danh sách mua sắm
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link to="/meal-planner">
                    Tạo kế hoạch mới
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    Quay lại Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingListPage;
