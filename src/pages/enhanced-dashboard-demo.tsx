import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import EnhancedDashboardDemo from '@/components/dashboard/EnhancedDashboardDemo';

const EnhancedDashboardDemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Demo: Trang Chủ Cá Nhân Cải Tiến - Angiday</title>
        <meta 
          name="description" 
          content="Demo dashboard mới: Từ 'trang báo cáo' thành 'bàn làm việc nhà bếp' với trọng tâm là hình ảnh món ăn và hành động thực tế" 
        />
      </Head>
      <EnhancedDashboardDemo />
    </>
  );
};

export default EnhancedDashboardDemoPage;
