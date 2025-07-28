import React from 'react';

interface NutritionStatsProps {
  weekPlanId: string;
}

const NutritionStats: React.FC<NutritionStatsProps> = ({ weekPlanId }) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Thống Kê Dinh Dưỡng</h3>
      <p className="text-gray-600">Tính năng đang được phát triển...</p>
    </div>
  );
};

export default NutritionStats;
