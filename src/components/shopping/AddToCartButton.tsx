import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useShoppingCart, CartItem } from '@/contexts/ShoppingCartContext';
import { Recipe } from '@/types/kitchen';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  recipe?: Recipe;
  menu?: {
    id: string;
    name: string;
    recipes: Recipe[];
  };
  meal?: {
    id: string;
    name: string;
    recipe: Recipe;
    date?: string;
    mealType?: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  recipe,
  menu,
  meal,
  variant = 'outline',
  size = 'sm',
  className = '',
  showIcon = true
}) => {
  const { addToCart, cartItems } = useShoppingCart();

  // Check if item is already in cart
  const isInCart = React.useMemo(() => {
    if (recipe) {
      return cartItems.some(item => item.id === recipe.id && item.type === 'recipe');
    }
    if (menu) {
      return cartItems.some(item => item.id === menu.id && item.type === 'menu');
    }
    if (meal) {
      return cartItems.some(item => item.id === meal.id && item.type === 'meal');
    }
    return false;
  }, [cartItems, recipe, menu, meal]);

  const handleAddToCart = () => {
    let cartItem: CartItem;

    if (recipe) {
      cartItem = {
        id: recipe.id,
        type: 'recipe',
        name: recipe.title,
        ingredients: recipe.ingredients || [],
        servings: 1,
        metadata: {
          category: recipe.category,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookingTime,
          difficulty: recipe.difficulty
        }
      };
    } else if (menu) {
      // Consolidate all ingredients from menu recipes
      const allIngredients = menu.recipes.flatMap(r => r.ingredients || []);
      cartItem = {
        id: menu.id,
        type: 'menu',
        name: menu.name,
        ingredients: allIngredients,
        servings: 1,
        metadata: {
          menuId: menu.id
        }
      };
    } else if (meal) {
      cartItem = {
        id: meal.id,
        type: 'meal',
        name: meal.name,
        ingredients: meal.recipe.ingredients || [],
        servings: 1,
        metadata: {
          category: meal.recipe.category,
          prepTime: meal.recipe.prepTime,
          cookTime: meal.recipe.cookingTime,
          difficulty: meal.recipe.difficulty,
          mealDate: meal.date,
          mealType: meal.mealType
        }
      };
    } else {
      return;
    }

    addToCart(cartItem);
    
    const itemType = recipe ? 'món ăn' : menu ? 'thực đơn' : 'bữa ăn';
    toast.success(`Đã thêm ${cartItem.name} (${itemType}) vào giỏ hàng`);
  };

  const getButtonText = () => {
    if (isInCart) {
      return 'Đã thêm';
    }
    
    if (recipe) return 'Thêm món';
    if (menu) return 'Thêm thực đơn';
    if (meal) return 'Thêm bữa ăn';
    return 'Thêm vào giỏ';
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={isInCart ? 'default' : variant}
      size={size}
      className={className}
      disabled={isInCart}
    >
      {showIcon && (
        isInCart ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )
      )}
      {getButtonText()}
    </Button>
  );
};

export default AddToCartButton;