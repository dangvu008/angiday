import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  categories: string[];
  difficulties: string[];
  cookTimeMax: number;
  ratingMin: number;
  sortBy: string;
  tags: string[];
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export const AdvancedSearchFilters = ({ onFiltersChange, className }: AdvancedSearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    difficulties: [],
    cookTimeMax: 300, // 5 hours in minutes
    ratingMin: 0,
    sortBy: 'newest',
    tags: []
  });

  const categories = [
    'Món chính', 'Khai vị', 'Tráng miệng', 'Ăn sáng', 
    'Ăn nhẹ', 'Nước dùng', 'Salad', 'Đồ uống'
  ];

  const difficulties = ['Dễ', 'Trung bình', 'Khó'];

  const tags = [
    'Việt Nam', 'Châu Á', 'Âu Mỹ', 'Chay', 'Healthy', 
    'Nhanh gọn', 'Tiệc tùng', 'Gia đình', 'Romantic'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'rating', label: 'Đánh giá cao' },
    { value: 'cookTime', label: 'Thời gian nấu' },
    { value: 'difficulty', label: 'Độ khó' }
  ];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const toggleArrayFilter = (array: string[], value: string, key: keyof SearchFilters) => {
    const newArray = array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
    updateFilters({ [key]: newArray });
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      categories: [],
      difficulties: [],
      cookTimeMax: 300,
      ratingMin: 0,
      sortBy: 'newest',
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.difficulties.length + 
    filters.tags.length + 
    (filters.cookTimeMax < 300 ? 1 : 0) + 
    (filters.ratingMin > 0 ? 1 : 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm công thức, nguyên liệu..."
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle & Sort */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sắp xếp:</span>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Bộ lọc nâng cao</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Xóa tất cả
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Loại món</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter(filters.categories, category, 'categories')}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulties */}
            <div>
              <h4 className="font-medium mb-3">Độ khó</h4>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={filters.difficulties.includes(difficulty) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter(filters.difficulties, difficulty, 'difficulties')}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cook Time */}
            <div>
              <h4 className="font-medium mb-3">
                Thời gian nấu tối đa: {Math.floor(filters.cookTimeMax / 60)}h {filters.cookTimeMax % 60}p
              </h4>
              <Slider
                value={[filters.cookTimeMax]}
                onValueChange={([value]) => updateFilters({ cookTimeMax: value })}
                max={300}
                min={15}
                step={15}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium mb-3">
                Đánh giá tối thiểu: {filters.ratingMin > 0 ? `${filters.ratingMin} sao` : 'Tất cả'}
              </h4>
              <Slider
                value={[filters.ratingMin]}
                onValueChange={([value]) => updateFilters({ ratingMin: value })}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-3">Thẻ</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter(filters.tags, tag, 'tags')}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};