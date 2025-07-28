import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Merge,
  Trash2,
  ShoppingCart,
  Package
} from 'lucide-react';
import { 
  IngredientManagementService, 
  StandardIngredient, 
  DuplicateAnalysis,
  IngredientCategory 
} from '@/services/IngredientManagementService';

interface Recipe {
  id: string;
  title: string;
  ingredients: string;
}

interface IngredientOptimizationProps {
  recipes: Recipe[];
}

const IngredientOptimization: React.FC<IngredientOptimizationProps> = ({ recipes }) => {
  const [analysis, setAnalysis] = useState<DuplicateAnalysis | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Khởi tạo service
    IngredientManagementService.initialize();
    analyzeIngredients();
  }, [recipes]);

  const analyzeIngredients = async () => {
    setIsLoading(true);
    try {
      // Parse ingredients từ recipes
      const recipeIngredientsMap = new Map();
      
      for (const recipe of recipes) {
        const parsedIngredients = IngredientManagementService.parseIngredientsFromText(recipe.ingredients);
        recipeIngredientsMap.set(recipe.id, parsedIngredients);
        IngredientManagementService.saveRecipeIngredients(recipe.id, parsedIngredients);
      }

      // Phân tích trùng lặp
      const duplicateAnalysis = IngredientManagementService.analyzeDuplicates(recipeIngredientsMap);
      setAnalysis(duplicateAnalysis);
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIngredientsByCategory = () => {
    const ingredients = IngredientManagementService.getIngredientsByCategory(
      selectedCategory === 'all' ? undefined : selectedCategory
    );
    
    if (searchTerm) {
      return ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return ingredients;
  };

  const getCategoryLabel = (category: IngredientCategory): string => {
    const labels = {
      'thit-hai-san': 'Thịt & Hải sản',
      'rau-cu-qua': 'Rau củ quả',
      'gia-vi-bot': 'Gia vị & Bột',
      'sua-trung': 'Sữa & Trứng',
      'hat-dau': 'Hạt & Đậu',
      'banh-mi-bot': 'Bánh mì & Bột',
      'do-uong': 'Đồ uống',
      'dau-mo': 'Dầu & Mỡ',
      'khac': 'Khác'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: IngredientCategory): string => {
    const colors = {
      'thit-hai-san': 'bg-red-100 text-red-800',
      'rau-cu-qua': 'bg-green-100 text-green-800',
      'gia-vi-bot': 'bg-yellow-100 text-yellow-800',
      'sua-trung': 'bg-blue-100 text-blue-800',
      'hat-dau': 'bg-purple-100 text-purple-800',
      'banh-mi-bot': 'bg-orange-100 text-orange-800',
      'do-uong': 'bg-cyan-100 text-cyan-800',
      'dau-mo': 'bg-amber-100 text-amber-800',
      'khac': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['khac'];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Đang phân tích nguyên liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tối Ưu Hóa Nguyên Liệu</h2>
          <p className="text-gray-600">Phân tích và quản lý nguyên liệu để tránh trùng lặp</p>
        </div>
        <Button onClick={analyzeIngredients} disabled={isLoading}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Phân tích lại
        </Button>
      </div>

      {/* Summary Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Nguyên liệu trùng lặp</p>
                  <p className="text-2xl font-bold">{analysis.duplicateIngredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Merge className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Có thể gộp</p>
                  <p className="text-2xl font-bold">{analysis.similarIngredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Chưa sử dụng</p>
                  <p className="text-2xl font-bold">{analysis.unusedIngredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Tổng nguyên liệu</p>
                  <p className="text-2xl font-bold">
                    {IngredientManagementService.getIngredientsByCategory().length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimization Suggestions */}
      {analysis && analysis.optimizationSuggestions.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Đề xuất tối ưu hóa:</div>
            <ul className="list-disc list-inside space-y-1">
              {analysis.optimizationSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="duplicates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="duplicates">Nguyên liệu trùng lặp</TabsTrigger>
          <TabsTrigger value="similar">Có thể gộp</TabsTrigger>
          <TabsTrigger value="unused">Chưa sử dụng</TabsTrigger>
          <TabsTrigger value="all">Tất cả nguyên liệu</TabsTrigger>
        </TabsList>

        {/* Duplicate Ingredients */}
        <TabsContent value="duplicates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Nguyên liệu được sử dụng nhiều lần
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.duplicateIngredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Không có nguyên liệu trùng lặp</p>
              ) : (
                <div className="space-y-4">
                  {analysis?.duplicateIngredients.map((duplicate, index) => {
                    const ingredient = IngredientManagementService.getIngredientsByCategory()
                      .find(ing => ing.id === duplicate.ingredientId);
                    
                    if (!ingredient) return null;

                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{ingredient.name}</h4>
                            <Badge className={getCategoryColor(ingredient.category)}>
                              {getCategoryLabel(ingredient.category)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            Sử dụng trong {duplicate.recipes.length} công thức
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {duplicate.recipes.map(recipeId => {
                            const recipe = recipes.find(r => r.id === recipeId);
                            return recipe ? (
                              <Badge key={recipeId} variant="outline" className="text-xs">
                                {recipe.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Tổng lượng sử dụng: {duplicate.totalUsage} {ingredient.baseUnit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar Ingredients */}
        <TabsContent value="similar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Merge className="h-5 w-5" />
                Nguyên liệu tương tự có thể gộp
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.similarIngredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Không có nguyên liệu tương tự</p>
              ) : (
                <div className="space-y-4">
                  {analysis?.similarIngredients.map((group, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Nhóm {index + 1}</h4>
                        <Button size="sm" variant="outline">
                          <Merge className="mr-2 h-3 w-3" />
                          Gộp lại
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {group.group.map(ingredient => (
                          <Badge key={ingredient.id} className={getCategoryColor(ingredient.category)}>
                            {ingredient.name}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-600">{group.suggestedMerge}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unused Ingredients */}
        <TabsContent value="unused">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Nguyên liệu chưa sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.unusedIngredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tất cả nguyên liệu đều được sử dụng</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysis?.unusedIngredients.map(ingredient => (
                    <div key={ingredient.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{ingredient.name}</h4>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Badge className={getCategoryColor(ingredient.category)} size="sm">
                        {getCategoryLabel(ingredient.category)}
                      </Badge>
                      
                      {ingredient.aliases.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Tên khác: {ingredient.aliases.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Ingredients */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tất cả nguyên liệu
              </CardTitle>
              
              {/* Search and Filter */}
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="search">Tìm kiếm</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Tìm kiếm nguyên liệu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">Tất cả</option>
                    <option value="thit-hai-san">Thịt & Hải sản</option>
                    <option value="rau-cu-qua">Rau củ quả</option>
                    <option value="gia-vi-bot">Gia vị & Bột</option>
                    <option value="sua-trung">Sữa & Trứng</option>
                    <option value="hat-dau">Hạt & Đậu</option>
                    <option value="banh-mi-bot">Bánh mì & Bột</option>
                    <option value="do-uong">Đồ uống</option>
                    <option value="dau-mo">Dầu & Mỡ</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getIngredientsByCategory().map(ingredient => (
                  <div key={ingredient.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{ingredient.name}</h4>
                      <Badge className={getCategoryColor(ingredient.category)} size="sm">
                        {getCategoryLabel(ingredient.category)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      Đơn vị: {ingredient.baseUnit}
                    </div>
                    
                    {ingredient.aliases.length > 0 && (
                      <div className="text-xs text-gray-500 mb-2">
                        Tên khác: {ingredient.aliases.join(', ')}
                      </div>
                    )}
                    
                    {ingredient.averagePrice && (
                      <div className="text-xs text-green-600">
                        Giá TB: {ingredient.averagePrice.toLocaleString()}đ/{ingredient.baseUnit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IngredientOptimization;
