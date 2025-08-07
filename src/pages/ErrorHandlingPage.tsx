import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import ErrorHandlingDemo from '@/components/admin/ErrorHandlingDemo';

const ErrorHandlingPage = () => {
  return (
    <DemoLayout
      title="Demo Error Handling"
      description="Demo xử lý lỗi và error boundaries trong ứng dụng"
      mainClassName="py-6"
    >
      <ErrorHandlingDemo />
    </DemoLayout>
  );
};

export default ErrorHandlingPage;
