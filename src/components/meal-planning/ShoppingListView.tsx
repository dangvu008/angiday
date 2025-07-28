import React from 'react';

interface ShoppingListViewProps {
  weekPlanId: string;
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ weekPlanId }) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Danh Sách Mua Sắm</h3>
      <p className="text-gray-600">Tính năng đang được phát triển...</p>
    </div>
  );
};

export default ShoppingListView;
