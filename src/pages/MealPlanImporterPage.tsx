import React from 'react';
import DemoLayout from '@/components/layout/DemoLayout';
import MealPlanImporter from '@/components/admin/MealPlanImporter';

const MealPlanImporterPage = () => {
  return (
    <DemoLayout
      title="Meal Plan Importer"
      description="Import và quản lý thực đơn từ các nguồn khác nhau"
      mainClassName="py-6"
    >
      <MealPlanImporter />
    </DemoLayout>
  );
};

export default MealPlanImporterPage;
