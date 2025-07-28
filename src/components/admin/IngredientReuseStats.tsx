import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Recycle, 
  DollarSign,
  Package,
  AlertCircle
} from 'lucide-react';
import { 
  IngredientManagementService, 
  StandardIngredient, 
  DuplicateAnalysis 
} from '@/services/IngredientManagementService';

interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  category: string;
}

interface ReuseStats {
  totalIngredients: number;
  uniqueIngredients: number;
  reuseRate: number;
  topReusedIngredients: Array<{
    ingredient: StandardIngredient;
    usageCount: number;
    recipes: string[];
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  costSavings: {
    estimatedSavings: number;
    duplicatesCost: number;
    optimizedCost: number;
  };
}

interface IngredientReuseStatsProps {
  recipes: Recipe[];
}

const IngredientReuseStats: React.FC<IngredientReuseStatsProps> = ({ recipes }) => {
  const [stats, setStats] = useState<ReuseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, [recipes]);

  const calculateStats = async () => {
    setIsLoading(true);
    
    try {
      // Initialize service
      IngredientManagementService.initialize();
      
      // Parse all ingredients
      const allIngredients: Array<{ recipeId: string; ingredients: any[] }> = [];
      const ingredientUsage = new Map<string, { count: number; recipes: string[] }>();
      
      for (const recipe of recipes) {
        const parsed = IngredientManagementService.parseIngredientsFromText(recipe.ingredients);
        allIngredients.push({ recipeId: recipe.id, ingredients: parsed });
        
        // Count usage
        for (const ingredient of parsed) {
          if (!ingredientUsage.has(ingredient.ingredientId)) {
            ingredientUsage.set(ingredient.ingredientId, { count: 0, recipes: [] });
          }
          const usage = ingredientUsage.get(ingredient.ingredientId)!;
          usage.count++;
          if (!usage.recipes.includes(recipe.id)) {
            usage.recipes.push(recipe.id);
          }
        }
      }

      // Calculate basic stats
      const totalIngredientLines = allIngredients.reduce((sum, r) => sum + r.ingredients.length, 0);
      const uniqueIngredients = ingredientUsage.size;
      const reuseRate = uniqueIngredients > 0 ? ((totalIngredientLines - uniqueIngredients) / totalIngredientLines) * 100 : 0;

      // Top reused ingredients
      const topReused = Array.from(ingredientUsage.entries())
        .filter(([_, usage]) => usage.count > 1)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([ingredientId, usage]) => {
          const ingredient = IngredientManagementService.getIngredientsByCategory()
            .find(ing => ing.id === ingredientId);
          return {
            ingredient: ingredient || {
              id: ingredientId,
              name: ingredientId,
              category: 'khac' as any,
              aliases: [],
              baseUnit: 'phần',
              conversionRates: {}
            },
            usageCount: usage.count,
            recipes: usage.recipes
          };
        });

      // Category distribution
      const categoryCount = new Map<string, number>();
      for (const ingredient of IngredientManagementService.getIngredientsByCategory()) {
        const usage = ingredientUsage.get(ingredient.id);
        if (usage) {
          const category = getCategoryLabel(ingredient.category);
          categoryCount.set(category, (categoryCount.get(category) || 0) + usage.count);
        }
      }

      const categoryDistribution = Array.from(categoryCount.entries())
        .map(([category, count]) => ({
          category,
          count,
          percentage: (count / totalIngredientLines) * 100
        }))
        .sort((a, b) => b.count - a.count);

      // Cost savings estimation
      const estimatedSavings = calculateCostSavings(ingredientUsage);

      const calculatedStats: ReuseStats = {
        totalIngredients: totalIngredientLines,
        uniqueIngredients,
        reuseRate,
        topReusedIngredients: topReused,
        categoryDistribution,
        costSavings: estimatedSavings
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCostSavings = (ingredientUsage: Map<string, { count: number; recipes: string[] }>) => {
    let duplicatesCost = 0;
    let optimizedCost = 0;

    for (const [ingredientId, usage] of ingredientUsage) {
      const ingredient = IngredientManagementService.getIngredientsByCategory()
        .find(ing => ing.id === ingredientId);
      
      if (ingredient?.averagePrice) {
        // Cost if buying separately for each recipe
        duplicatesCost += ingredient.averagePrice * usage.count;
        // Cost if buying once and reusing
        optimizedCost += ingredient.averagePrice;
      }
    }

    return {
      estimatedSavings: duplicatesCost - optimizedCost,
      duplicatesCost,
      optimizedCost
    };
  };

  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
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

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Thịt & Hải sản': 'bg-red-100 text-red-800',
      'Rau củ quả': 'bg-green-100 text-green-800',
      'Gia vị & Bột': 'bg-yellow-100 text-yellow-800',
      'Sữa & Trứng': 'bg-blue-100 text-blue-800',
      'Hạt & Đậu': 'bg-purple-100 text-purple-800',
      'Bánh mì & Bột': 'bg-orange-100 text-orange-800',
      'Đồ uống': 'bg-cyan-100 text-cyan-800',
      'Dầu & Mỡ': 'bg-amber-100 text-amber-800',
      'Khác': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Khác'];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Không thể tính toán thống kê</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng nguyên liệu</p>
                <p className="text-2xl font-bold">{stats.totalIngredients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Nguyên liệu duy nhất</p>
                <p className="text-2xl font-bold">{stats.uniqueIngredients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ tái sử dụng</p>
                <p className="text-2xl font-bold">{stats.reuseRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Tiết kiệm ước tính</p>
                <p className="text-2xl font-bold">
                  {stats.costSavings.estimatedSavings.toLocaleString()}đ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reuse Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hiệu Quả Tái Sử Dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tỷ lệ tái sử dụng nguyên liệu</span>
                <span className="font-medium">{stats.reuseRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.reuseRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tổng dòng nguyên liệu:</span>
                <span className="font-medium ml-2">{stats.totalIngredients}</span>
              </div>
              <div>
                <span className="text-gray-600">Nguyên liệu duy nhất:</span>
                <span className="font-medium ml-2">{stats.uniqueIngredients}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Reused Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5" />
            Nguyên Liệu Được Tái Sử Dụng Nhiều Nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topReusedIngredients.map((item, index) => (
              <div key={item.ingredient.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.ingredient.name}</h4>
                    <p className="text-sm text-gray-600">
                      Sử dụng trong {item.recipes.length} công thức
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{item.usageCount}</div>
                  <div className="text-xs text-gray-500">lần sử dụng</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân Bố Theo Danh Mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.categoryDistribution.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(category.category)}>
                      {category.category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {category.count} lần sử dụng
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientReuseStats;
