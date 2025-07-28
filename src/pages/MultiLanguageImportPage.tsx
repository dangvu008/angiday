import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MultiLanguageImportDemo from '@/components/admin/MultiLanguageImportDemo';

const MultiLanguageImportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Demo Import Đa Ngôn Ngữ</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <MultiLanguageImportDemo />
      </main>
    </div>
  );
};

export default MultiLanguageImportPage;
