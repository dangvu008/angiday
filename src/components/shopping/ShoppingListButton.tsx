import React, { useState } from 'react';
import { ShoppingCart, Download, Share2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/types/kitchen';
import { MealSlot } from '@/contexts/MealPlanningContext';
import ShoppingListModal from './ShoppingListModal';
import { toast } from 'sonner';

interface ShoppingListButtonProps {
  recipe?: Recipe;
  recipes?: Recipe[];
  mealSlots?: MealSlot[];
  planId?: string;
  planName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showItemCount?: boolean;
}

const ShoppingListButton: React.FC<ShoppingListButtonProps> = ({
  recipe,
  recipes,
  mealSlots,
  planId,
  planName,
  variant = 'outline',
  size = 'default',
  className = '',
  showItemCount = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert single recipe to recipes array
  const recipesToProcess = recipe ? [recipe] : (recipes || []);
  
  // Convert recipes to meal slots if needed
  const mealSlotsToProcess = mealSlots || recipesToProcess.map((recipe, index) => ({
    id: `temp-${index}`,
    date: new Date().toISOString().split('T')[0],
    mealType: 'lunch' as const,
    recipe: {
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients
    }
  }));

  // Calculate total ingredients count
  const totalIngredients = React.useMemo(() => {
    const ingredientSet = new Set<string>();
    
    if (mealSlotsToProcess) {
      mealSlotsToProcess.forEach(slot => {
        if (slot.recipe?.ingredients) {
          slot.recipe.ingredients.forEach(ingredient => {
            ingredientSet.add(ingredient.toLowerCase().trim());
          });
        }
      });
    }
    
    return ingredientSet.size;
  }, [mealSlotsToProcess]);

  const displayName = planName || recipe?.title || `${recipesToProcess.length} món ăn`;

  const handleOpenShoppingList = () => {
    if (totalIngredients === 0) {
      toast.error('Không có nguyên liệu nào để tạo danh sách mua sắm');
      return;
    }
    
    setIsModalOpen(true);
    toast.success(`Tạo danh sách mua sắm cho ${displayName}`);
  };

  const handleQuickShare = async () => {
    if (totalIngredients === 0) {
      toast.error('Không có nguyên liệu nào để chia sẻ');
      return;
    }

    try {
      // Generate simple shopping list text
      const ingredientsList = Array.from(new Set(
        mealSlotsToProcess.flatMap(slot => 
          slot.recipe?.ingredients || []
        )
      ));

      const shoppingText = `🛒 Danh sách mua sắm cho ${displayName}\n\n` +
        ingredientsList.map((ingredient, index) => 
          `${index + 1}. ${ingredient}`
        ).join('\n') +
        `\n\n📱 Tạo từ ứng dụng AngiDay`;

      if (navigator.share) {
        await navigator.share({
          title: `Danh sách mua sắm - ${displayName}`,
          text: shoppingText
        });
        toast.success('Đã chia sẻ danh sách mua sắm');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shoppingText);
        toast.success('Đã sao chép danh sách mua sắm vào clipboard');
      }
    } catch (error) {
      console.error('Error sharing shopping list:', error);
      toast.error('Có lỗi xảy ra khi chia sẻ');
    }
  };

  const handleQuickDownload = () => {
    if (totalIngredients === 0) {
      toast.error('Không có nguyên liệu nào để tải xuống');
      return;
    }

    try {
      // Generate shopping list text
      const ingredientsList = Array.from(new Set(
        mealSlotsToProcess.flatMap(slot => 
          slot.recipe?.ingredients || []
        )
      ));

      const shoppingText = `Danh sách mua sắm cho ${displayName}\n` +
        `Tạo ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n` +
        ingredientsList.map((ingredient, index) => 
          `☐ ${ingredient}`
        ).join('\n') +
        `\n\nTổng cộng: ${ingredientsList.length} mục\n` +
        `Tạo từ ứng dụng AngiDay`;

      // Create and download file
      const blob = new Blob([shoppingText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `danh-sach-mua-sam-${displayName.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Đã tải xuống danh sách mua sắm');
    } catch (error) {
      console.error('Error downloading shopping list:', error);
      toast.error('Có lỗi xảy ra khi tải xuống');
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Main Shopping List Button */}
        <Button
          onClick={handleOpenShoppingList}
          variant={variant}
          size={size}
          className={className}
          disabled={totalIngredients === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Danh sách mua sắm
          {showItemCount && totalIngredients > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalIngredients} mục
            </Badge>
          )}
        </Button>

        {/* Quick Actions */}
        {totalIngredients > 0 && (
          <>
            <Button
              onClick={handleQuickShare}
              variant="ghost"
              size="sm"
              className="px-2"
              title="Chia sẻ nhanh"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleQuickDownload}
              variant="ghost"
              size="sm"
              className="px-2"
              title="Tải xuống"
            >
              <Download className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealSlots={mealSlotsToProcess}
        title={`Danh sách mua sắm cho ${displayName}`}
      />
    </>
  );
};

export default ShoppingListButton;
