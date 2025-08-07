import React from 'react';
import { Button } from '@/components/ui/button';
import DemoLayout from '@/components/layout/DemoLayout';
import AntiBlockDemo from '@/components/admin/AntiBlockDemo';

const AntiBlockPage = () => {
  return (
    <DemoLayout
      title="Demo Anti-Block Technology"
      description="Demo tính năng chống block và rate limiting"
      mainClassName="py-6"
    >
      <AntiBlockDemo />
    </DemoLayout>
  );
};

export default AntiBlockPage;
