import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Users, Star, ChefHat, Plus, Edit, Trash2, 
  ArrowLeft, Share2, Download, Eye, Utensils 
} from 'lucide-react';
import { Menu, Recipe } from '@/types/meal-planning';
import RecipeSelector from './RecipeSelector';
import AddMenuToPlanModal from '../meal-planning/AddMenuToPlanModal';
import { useAuth } from '@/hooks/useAuth';

interface MenuDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu | null;
  onUpdateMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: string) => void;
}

const MenuDetailView = ({ isOpen, onClose, menu, onUpdateMenu, onDeleteMenu }: MenuDetailViewProps) => {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [showAddToPlanModal, setShowAddToPlanModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, canEditMenu, canDeleteMenu: canDelete, canAddMenuToPersonalPlan } = useAuth();

  if (!menu) return null;

  // Check permissions
  const canEdit = canEditMenu(menu.createdBy);
  const canDeleteThis = canDelete(menu.createdBy);
  const canAddToPlan = canAddMenuToPersonalPlan();

  const handleAddRecipes = (selectedRecipes: Recipe[]) => {
    const updatedMenu = {
      ...menu,
      recipes: [...menu.recipes, ...selectedRecipes.filter(recipe => 
        !menu.recipes.some(existing => existing.id === recipe.id)
      )],
      updatedAt: new Date().toISOString()
    };

    // Recalculate totals
    updatedMenu.totalCalories = updatedMenu.recipes.reduce((sum, recipe) => sum + recipe.nutrition.calories, 0);
    updatedMenu.totalCookingTime = updatedMenu.recipes.reduce((sum, recipe) => {
      const time = parseInt(recipe.cookingTime.replace(/\D/g, '')) || 0;
      return sum + time;
    }, 0);
    updatedMenu.nutrition = updatedMenu.recipes.reduce((acc, recipe) => ({
      protein: acc.protein + recipe.nutrition.protein,
      carbs: acc.carbs + recipe.nutrition.carbs,
      fat: acc.fat + recipe.nutrition.fat,
      fiber: acc.fiber + recipe.nutrition.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    onUpdateMenu(updatedMenu);
  };

  const handleRemoveRecipe = (recipeId: string) => {
    if (!canEdit) return;

    const updatedMenu = {
      ...menu,
      recipes: menu.recipes.filter(recipe => recipe.id !== recipeId),
      updatedAt: new Date().toISOString()
    };

    // Recalculate totals
    updatedMenu.totalCalories = updatedMenu.recipes.reduce((sum, recipe) => sum + recipe.nutrition.calories, 0);
    updatedMenu.totalCookingTime = updatedMenu.recipes.reduce((sum, recipe) => {
      const time = parseInt(recipe.cookingTime.replace(/\D/g, '')) || 0;
      return sum + time;
    }, 0);
    updatedMenu.nutrition = updatedMenu.recipes.reduce((acc, recipe) => ({
      protein: acc.protein + recipe.nutrition.protein,
      carbs: acc.carbs + recipe.nutrition.carbs,
      fat: acc.fat + recipe.nutrition.fat,
      fiber: acc.fiber + recipe.nutrition.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    onUpdateMenu(updatedMenu);
  };

  const handleAddToPlan = (planData: any) => {
    // TODO: Implement add to personal plan
    console.log('Adding menu to personal plan:', planData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'breakfast': { label: 'Ăn sáng', color: 'bg-yellow-100 text-yellow-800' },
      'lunch': { label: 'Ăn trưa', color: 'bg-orange-100 text-orange-800' },
      'dinner': { label: 'Ăn tối', color: 'bg-purple-100 text-purple-800' },
      'snack': { label: 'Ăn vặt', color: 'bg-pink-100 text-pink-800' },
      'full_day': { label: 'Cả ngày', color: 'bg-blue-100 text-blue-800' },
      'custom': { label: 'Tùy chỉnh', color: 'bg-gray-100 text-gray-800' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || typeMap.custom;
    return (
      <Badge className={typeInfo.color}>
        {typeInfo.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-xl">{menu.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{menu.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canAddToPlan && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowAddToPlanModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vào kế hoạch
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất
              </Button>
              {canDeleteThis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteMenu(menu.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Menu Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{menu.recipes.length}</div>
                <div className="text-sm text-gray-600">Công thức</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{menu.totalCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{menu.totalCookingTime}</div>
                <div className="text-sm text-gray-600">Phút nấu</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(menu.totalCost)}</div>
                <div className="text-sm text-gray-600">Chi phí</div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Details */}
          <div className="flex items-center gap-4">
            {getTypeBadge(menu.type)}
            <Badge className={getDifficultyColor(menu.difficulty)}>
              {menu.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{menu.servings} người</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{menu.rating.toFixed(1)} ({menu.reviews} đánh giá)</span>
            </div>
          </div>

          {/* Tags */}
          {menu.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {menu.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="recipes">Công thức ({menu.recipes.length})</TabsTrigger>
              <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
              <TabsTrigger value="ingredients">Nguyên liệu</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{menu.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ẩm thực:</span>
                      <span className="font-medium">{menu.cuisine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tác giả:</span>
                      <span className="font-medium">{menu.createdByName || menu.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lượt sử dụng:</span>
                      <span className="font-medium">{menu.usageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant={menu.isPublic ? "default" : "secondary"}>
                        {menu.isPublic ? "Công khai" : "Riêng tư"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quyền:</span>
                      <div className="flex gap-1">
                        {canEdit && <Badge variant="outline" className="text-xs">Có thể sửa</Badge>}
                        {canAddToPlan && <Badge variant="outline" className="text-xs">Thêm vào kế hoạch</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phân tích dinh dưỡng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{menu.nutrition.protein}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{menu.nutrition.carbs}g</div>
                        <div className="text-xs text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{menu.nutrition.fat}g</div>
                        <div className="text-xs text-gray-600">Fat</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{menu.nutrition.fiber}g</div>
                        <div className="text-xs text-gray-600">Chất xơ</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recipes" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Danh sách công thức</CardTitle>
                    {canEdit && (
                      <Button onClick={() => setShowRecipeSelector(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm công thức
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {menu.recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menu.recipes.map((recipe) => (
                        <Card key={recipe.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{recipe.title}</h4>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{recipe.cookingTime}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{recipe.servings}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{recipe.nutrition.calories} cal</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={getDifficultyColor(recipe.difficulty)} size="sm">
                                    {recipe.difficulty}
                                  </Badge>
                                  <Badge variant="outline" size="sm">{recipe.category}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {canEdit && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveRecipe(recipe.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Utensils className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Chưa có công thức nào</h3>
                      <p className="text-sm mb-4">
                        {canEdit
                          ? "Thêm công thức để tạo thành thực đơn hoàn chỉnh"
                          : "Thực đơn này chưa có công thức nào"
                        }
                      </p>
                      {canEdit && (
                        <Button onClick={() => setShowRecipeSelector(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm công thức đầu tiên
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích dinh dưỡng chi tiết</CardTitle>
                  <p className="text-sm text-gray-600">Cho {menu.servings} khẩu phần</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{menu.nutrition.protein}g</div>
                      <div className="text-sm text-gray-600 mt-1">Protein</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((menu.nutrition.protein * 4 / menu.totalCalories) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{menu.nutrition.carbs}g</div>
                      <div className="text-sm text-gray-600 mt-1">Carbs</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((menu.nutrition.carbs * 4 / menu.totalCalories) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">{menu.nutrition.fat}g</div>
                      <div className="text-sm text-gray-600 mt-1">Fat</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((menu.nutrition.fat * 9 / menu.totalCalories) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{menu.nutrition.fiber}g</div>
                      <div className="text-sm text-gray-600 mt-1">Chất xơ</div>
                      <div className="text-xs text-gray-500 mt-1">Khuyến nghị</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách nguyên liệu tổng hợp</CardTitle>
                  <p className="text-sm text-gray-600">Từ tất cả công thức trong thực đơn</p>
                </CardHeader>
                <CardContent>
                  {menu.recipes.length > 0 ? (
                    <div className="space-y-4">
                      {menu.recipes.map((recipe, index) => (
                        <div key={recipe.id}>
                          <h4 className="font-medium text-gray-900 mb-2">{recipe.title}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            {recipe.ingredients.map((ingredient, idx) => (
                              <div key={idx} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                                <span>• {ingredient}</span>
                              </div>
                            ))}
                          </div>
                          {index < menu.recipes.length - 1 && <hr className="my-4" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Chưa có nguyên liệu nào</p>
                      <p className="text-sm">Thêm công thức để xem danh sách nguyên liệu</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recipe Selector Modal */}
        {canEdit && (
          <RecipeSelector
            isOpen={showRecipeSelector}
            onClose={() => setShowRecipeSelector(false)}
            onSelectRecipes={handleAddRecipes}
            selectedRecipeIds={menu.recipes.map(r => r.id)}
            multiSelect={true}
            title="Thêm công thức vào thực đơn"
          />
        )}

        {/* Add to Plan Modal */}
        <AddMenuToPlanModal
          isOpen={showAddToPlanModal}
          onClose={() => setShowAddToPlanModal(false)}
          menu={menu}
          onAddToPlan={handleAddToPlan}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MenuDetailView;
