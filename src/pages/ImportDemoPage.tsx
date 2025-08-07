import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import ImportDemo from '@/components/admin/ImportDemo';

const ImportDemoPage = () => {
  return (
    <DemoLayout
      title="Demo Import Công Thức"
      description="Demo tính năng import công thức từ các nguồn khác nhau"
      mainClassName="py-6"
    >
      <ImportDemo />
    </DemoLayout>
  );
};

export default ImportDemoPage;
