import React from 'react';
import DemoLayout from '@/components/layout/DemoLayout';
import ValidationDemo from '@/components/admin/ValidationDemo';

const ValidationTestPage = () => {
  return (
    <DemoLayout
      title="Demo Kiểm Tra Validation"
      description="Kiểm tra và demo các tính năng validation trong ứng dụng AnGiDay"
      mainClassName="py-6"
    >
      <ValidationDemo />
    </DemoLayout>
  );
};

export default ValidationTestPage;
