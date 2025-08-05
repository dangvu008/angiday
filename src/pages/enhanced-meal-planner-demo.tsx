import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import EnhancedMealPlannerDemo from '@/components/meal-planning/EnhancedMealPlannerDemo';

const EnhancedMealPlannerDemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Demo: Trang Kế Hoạch Nấu Ăn Cá Nhân Cải Tiến - Angiday</title>
        <meta 
          name="description" 
          content="Demo tính năng mới: Modal thêm món với 3 tab và chế độ chọn danh sách đi chợ linh hoạt" 
        />
      </Head>
      <EnhancedMealPlannerDemo />
    </>
  );
};

export default EnhancedMealPlannerDemoPage;
