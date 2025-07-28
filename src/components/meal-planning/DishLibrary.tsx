import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dish, SearchFilters } from '@/types/meal-planning';
import DraggableDish from './DraggableDish';

interface DishLibraryProps {
  dishes: Dish[];
  onDishSelect: (dish: Dish) => void;
}

const DishLibrary: React.FC<DishLibraryProps> = ({
  dishes,
  onDishSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [maxCalories, setMaxCalories] = useState<number | null>(null);
  const [maxCookingTime, setMaxCookingTime] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from dishes
  const categories = useMemo(() => {
    const cats = Array.from(new Set(dishes.map(dish => dish.category)));
    return [
      { id: 'all', name: 'Tất cả', count: dishes.length },
      ...cats.map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: dishes.filter(dish => dish.category === cat).length
      }))
    ];
  }, [dishes]);

  // Filter dishes based on search and filters
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      // Search query
      if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !dish.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) &&
          !dish.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && dish.difficulty !== selectedDifficulty) {
        return false;
      }

      // Calories filter
      if (maxCalories && dish.calories > maxCalories) {
        return false;
      }

      // Cooking time filter
      if (maxCookingTime && dish.cookingTime > maxCookingTime) {
        return false;
      }

      return true;
    });
  }, [dishes, searchQuery, selectedCategory, selectedDifficulty, maxCalories, maxCookingTime]);

  const difficulties = [
    { id: 'all', name: 'Tất cả độ khó' },
    { id: 'easy', name: 'Dễ' },
    { id: 'medium', name: 'Trung bình' },
    { id: 'hard', name: 'Khó' }
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setMaxCalories(null);
    setMaxCookingTime(null);
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== 'all' ? selectedCategory : null,
    selectedDifficulty !== 'all' ? selectedDifficulty : null,
    maxCalories,
    maxCookingTime
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm món ăn, nguyên liệu, thẻ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Bộ lọc
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-orange-500 text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* View Mode Toggle */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bộ lọc nâng cao</CardTitle>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Độ khó
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>
                      {diff.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Calories Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tối đa calories
                </label>
                <Input
                  type="number"
                  placeholder="VD: 500"
                  value={maxCalories || ''}
                  onChange={(e) => setMaxCalories(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>

              {/* Max Cooking Time Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tối đa thời gian (phút)
                </label>
                <Input
                  type="number"
                  placeholder="VD: 30"
                  value={maxCookingTime || ''}
                  onChange={(e) => setMaxCookingTime(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 6).map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-sm">
              {category.name}
              <Badge variant="outline" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredDishes.length} trong tổng số {dishes.length} món ăn
        </p>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Xóa tất cả bộ lọc ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Dishes Grid/List */}
      {filteredDishes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy món ăn nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <Button onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredDishes.map((dish) => (
            <DraggableDish
              key={dish.id}
              dish={dish}
              onSelect={onDishSelect}
              showDetails={viewMode === 'grid'}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DishLibrary;
