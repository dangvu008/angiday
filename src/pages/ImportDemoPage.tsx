import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ImportDemo from '@/components/admin/ImportDemo';

const ImportDemoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Demo Import Công Thức</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <ImportDemo />
      </main>
    </div>
  );
};

export default ImportDemoPage;
