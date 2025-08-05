import React, { useEffect, useState } from 'react';
import { SampleDataService } from '@/services/sampleDataService';
import { kitchenService } from '@/services/kitchenService';

interface AutoDataInitializerProps {
  children: React.ReactNode;
}

/**
 * Component tự động khởi tạo dữ liệu mẫu khi app khởi động
 * Chỉ chạy một lần và không hiển thị UI
 */
const AutoDataInitializer: React.FC<AutoDataInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeBasicData();
  }, []);

  const initializeBasicData = async () => {
    try {
      // Kiểm tra xem đã có dữ liệu cơ bản chưa
      const existingRecipes = await kitchenService.getRecipes();
      const existingDailyMenus = kitchenService.getDailyMenuPlans();

      // Nếu chưa có dữ liệu cơ bản, tạo sample data
      if (existingRecipes.length === 0 || existingDailyMenus.length === 0) {
        console.log('🚀 Initializing basic sample data...');
        
        // Populate sample data vào localStorage
        const { recipes, dailyMenus } = SampleDataService.populateSampleData();

        // Tạo recipes trong service nếu chưa có
        if (existingRecipes.length === 0) {
          for (const recipe of recipes) {
            await kitchenService.createRecipe(recipe);
          }
          console.log(`✅ Created ${recipes.length} sample recipes`);
        }

        console.log(`✅ Initialized ${dailyMenus.length} daily menu templates`);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error initializing basic data:', error);
      // Vẫn cho phép app chạy ngay cả khi có lỗi
      setIsInitialized(true);
    }
  };

  // Render children ngay lập tức, không cần chờ initialization
  // Vì đây chỉ là dữ liệu cơ bản, không ảnh hưởng đến UI
  return <>{children}</>;
};

export default AutoDataInitializer;
