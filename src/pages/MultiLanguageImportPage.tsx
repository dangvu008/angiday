import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import MultiLanguageImportDemo from '@/components/admin/MultiLanguageImportDemo';

const MultiLanguageImportPage = () => {
  return (
    <DemoLayout
      title="Demo Import Đa Ngôn Ngữ"
      description="Demo import công thức đa ngôn ngữ với AI translation"
      mainClassName="py-6"
    >
      <MultiLanguageImportDemo />
    </DemoLayout>
  );
};

export default MultiLanguageImportPage;
