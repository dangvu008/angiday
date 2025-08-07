import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import SmartExtractionDemo from '@/components/admin/SmartExtractionDemo';

const SmartExtractionPage = () => {
  return (
    <DemoLayout
      title="Demo Smart Extraction"
      description="Demo tính năng trích xuất thông minh từ text và hình ảnh"
      mainClassName="py-6"
    >
      <SmartExtractionDemo />
    </DemoLayout>
  );
};

export default SmartExtractionPage;
