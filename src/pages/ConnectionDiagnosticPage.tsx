import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wifi, Wrench } from 'lucide-react';
import ConnectionDiagnostic from '@/components/ConnectionDiagnostic';
import ConnectionFixer from '@/components/ConnectionFixer';

const ConnectionDiagnosticPage = () => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'fixer'>('diagnostic');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Kiểm tra kết nối</h1>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Kiểm tra và khắc phục các vấn đề kết nối trong hệ thống
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'diagnostic' ? 'default' : 'outline'}
              onClick={() => setActiveTab('diagnostic')}
              size="sm"
            >
              <Wifi className="mr-2 h-4 w-4" />
              Kiểm tra
            </Button>
            <Button
              variant={activeTab === 'fixer' ? 'default' : 'outline'}
              onClick={() => setActiveTab('fixer')}
              size="sm"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Khắc phục
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'diagnostic' ? (
            <ConnectionDiagnostic />
          ) : (
            <ConnectionFixer />
          )}
        </div>
      </main>
    </div>
  );
};

export default ConnectionDiagnosticPage;
