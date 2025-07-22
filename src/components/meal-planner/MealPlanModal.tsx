import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  cookTime: string;
  servings: number;
  image: string;
  difficulty: string;
}

interface MealPlanModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  mealType: string;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const MealPlanModal = ({ 
  open, 
  onClose, 
  date, 
  mealType, 
  onSelectRecipe 
}: MealPlanModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - trong thực tế sẽ fetch từ API
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Phở bò truyền thống',
      cookTime: '45 phút',
      servings: 2,
      image: '/placeholder.svg',
      difficulty: 'Trung bình'
    },
    {
      id: '2',
      title: 'Cơm rang dương châu',
      cookTime: '20 phút',
      servings: 4,
      image: '/placeholder.svg',
      difficulty: 'Dễ'
    },
    {
      id: '3',
      title: 'Bánh mì thịt nướng',
      cookTime: '30 phút',
      servings: 2,
      image: '/placeholder.svg',
      difficulty: 'Dễ'
    },
    {
      id: '4',
      title: 'Gỏi cuốn tôm thịt',
      cookTime: '25 phút',
      servings: 3,
      image: '/placeholder.svg',
      difficulty: 'Dễ'
    },
    {
      id: '5',
      title: 'Bún bò Huế',
      cookTime: '60 phút',
      servings: 4,
      image: '/placeholder.svg',
      difficulty: 'Khó'
    },
    {
      id: '6',
      title: 'Chè ba màu',
      cookTime: '40 phút',
      servings: 4,
      image: '/placeholder.svg',
      difficulty: 'Trung bình'
    }
  ];

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối',
      snack: 'Bữa phụ'
    };
    return labels[type] || type;
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Chọn món cho {getMealTypeLabel(mealType)} - {date.toLocaleDateString('vi-VN')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công thức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectRecipe(recipe)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h4 className="font-medium mb-2 line-clamp-2">{recipe.title}</h4>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {recipe.servings} người
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      recipe.difficulty === 'Dễ' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy công thức nào phù hợp
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};