import React from 'react';
import { MealTemplate } from '@/types/meal-planning';

interface MealTemplatesProps {
  templates: MealTemplate[];
  onTemplateApply: (templateId: string, weekPlanId: string, date: string, mealType: string) => void;
}

const MealTemplates: React.FC<MealTemplatesProps> = ({ templates, onTemplateApply }) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Mẫu Thực Đơn</h3>
      <p className="text-gray-600">Tính năng đang được phát triển...</p>
    </div>
  );
};

export default MealTemplates;
