import React from 'react';
import { UserPreferences } from '@/types/meal-planning';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Cài Đặt Người Dùng</h3>
        <p className="text-gray-600 mb-4">Tính năng đang được phát triển...</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesModal;
