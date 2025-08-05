import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { recipeManagementService } from '@/services/recipeManagementService';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'recipe' | 'meal-plan';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton = ({
  itemId,
  itemType,
  className,
  showText = false,
  size = 'md',
  variant = 'ghost',
  onToggle
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load favorite status
  useEffect(() => {
    if (user && itemId && itemType === 'recipe') {
      checkFavoriteStatus();
    } else {
      // Fallback to localStorage for non-recipe items or when not logged in
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((fav: any) => fav.id === itemId && fav.type === itemType));
    }
  }, [itemId, itemType, user]);

  const checkFavoriteStatus = async () => {
    if (!user || itemType !== 'recipe') return;

    try {
      const favoriteStatus = await recipeManagementService.isFavorite(user.id, itemId);
      setIsFavorite(favoriteStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;

    // For recipes, use database if user is logged in
    if (user && itemType === 'recipe') {
      setIsLoading(true);
      try {
        if (isFavorite) {
          await recipeManagementService.removeFromFavorites(user.id, itemId);
          setIsFavorite(false);
          toast({
            description: "Đã xóa khỏi danh sách yêu thích",
          });
        } else {
          await recipeManagementService.addToFavorites(user.id, itemId);
          setIsFavorite(true);
          toast({
            description: "Đã thêm vào danh sách yêu thích",
          });
        }
        onToggle?.(!isFavorite);
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast({
          description: "Có lỗi xảy ra, vui lòng thử lại",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback to localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      if (isFavorite) {
        const newFavorites = favorites.filter((fav: any) => !(fav.id === itemId && fav.type === itemType));
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(false);
        toast({
          description: "Đã xóa khỏi danh sách yêu thích",
        });
      } else {
        const newFavorite = {
          id: itemId,
          type: itemType,
          addedAt: new Date().toISOString()
        };
        favorites.push(newFavorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
        toast({
          description: "Đã thêm vào danh sách yêu thích",
        });
      }
      onToggle?.(!isFavorite);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  return (
    <Button
      variant={variant === 'default' ? (isFavorite ? "default" : "outline") : variant}
      size={showText ? "default" : "icon"}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        !showText && getButtonSize(),
        isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500",
        variant === 'default' && isFavorite && "bg-red-500 hover:bg-red-600 text-white",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Heart
        className={cn(
          getIconSize(),
          "transition-transform",
          isFavorite && "fill-current scale-110",
          isLoading && "animate-pulse",
          showText && "mr-2"
        )}
      />
      {showText && (isFavorite ? "Đã yêu thích" : "Yêu thích")}
    </Button>
  );
};