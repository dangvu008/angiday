import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  X,
  CheckCircle,
  ShoppingCart
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string | null;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  isOpen,
  onClose,
  recipeId
}) => {
  const { availableRecipes } = useMealPlanning();
  
  const recipe = recipeId ? availableRecipes.find(r => r.id === recipeId) : null;

  if (!recipe) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Không tìm thấy công thức</DialogTitle>
            <DialogDescription>
              Công thức bạn đang tìm kiếm không tồn tại
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Công thức này không tồn tại hoặc đã bị xóa.</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const difficultyColors = {
    'Dễ': 'bg-green-100 text-green-800 border-green-300',
    'Trung bình': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Khó': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            {recipe.title}
          </DialogTitle>
          <DialogDescription>
            Chi tiết công thức nấu ăn và hướng dẫn thực hiện
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-4">
              {/* Recipe Image */}
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';
                  }}
                />
              </div>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin món ăn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm">
                        <strong>Thời gian:</strong> {recipe.cookTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm">
                        <strong>Khẩu phần:</strong> {recipe.servings} người
                      </span>
                    </div>
                    {recipe.calories && (
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm">
                          <strong>Calories:</strong> {recipe.calories} kcal
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-neutral-500" />
                      <Badge className={difficultyColors[recipe.difficulty]}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Category and Tags */}
                  <div>
                    <p className="text-sm font-medium mb-2">Danh mục:</p>
                    <Badge variant="secondary">{recipe.category}</Badge>
                  </div>

                  {recipe.tags && recipe.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Ingredients and Instructions */}
            <div className="space-y-4">
              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Nguyên liệu ({recipe.ingredients.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Cách làm ({recipe.instructions.length} bước)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed pt-0.5">
                          {instruction}
                        </p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
          <Button onClick={() => {
            // TODO: Add to shopping list functionality
            console.log('Add ingredients to shopping list');
          }}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm vào danh sách mua sắm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
