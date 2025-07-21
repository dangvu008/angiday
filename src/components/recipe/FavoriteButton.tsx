import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'recipe' | 'meal-plan';
  className?: string;
  showText?: boolean;
}

export const FavoriteButton = ({ 
  itemId, 
  itemType, 
  className,
  showText = false 
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  // Load favorite status from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: any) => fav.id === itemId && fav.type === itemType));
  }, [itemId, itemType]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter((fav: any) => !(fav.id === itemId && fav.type === itemType));
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        description: "Đã xóa khỏi danh sách yêu thích",
      });
    } else {
      // Add to favorites
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
  };

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size={showText ? "default" : "icon"}
      onClick={toggleFavorite}
      className={cn(
        "transition-all duration-200",
        isFavorite && "bg-red-500 hover:bg-red-600 text-white",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform",
          isFavorite && "fill-current scale-110",
          showText && "mr-2"
        )}
      />
      {showText && (isFavorite ? "Đã yêu thích" : "Yêu thích")}
    </Button>
  );
};