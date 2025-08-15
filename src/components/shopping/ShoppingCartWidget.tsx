import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import ShoppingCartModal from './ShoppingCart';

interface ShoppingCartWidgetProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showBadge?: boolean;
}

const ShoppingCartWidget: React.FC<ShoppingCartWidgetProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showBadge = true
}) => {
  const { getTotalItems } = useShoppingCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const totalItems = getTotalItems();

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setIsCartOpen(true)}
          variant={variant}
          size={size}
          className={className}
        >
          <ShoppingCart className="h-4 w-4" />
          {size !== 'sm' && <span className="ml-2 hidden sm:inline">Giỏ hàng</span>}
        </Button>
        
        {showBadge && totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </div>

      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default ShoppingCartWidget;