import React from 'react';
import DemoLayout from '@/components/layout/DemoLayout';
import ImportTestDemo from '@/components/admin/ImportTestDemo';

const ImportTestDemoPage = () => {
  return (
    <DemoLayout
      title="Demo Import Test"
      description="Test tính năng import và validation dữ liệu"
      mainClassName="py-6"
    >
      <ImportTestDemo />
    </DemoLayout>
  );
};

export default ImportTestDemoPage;
