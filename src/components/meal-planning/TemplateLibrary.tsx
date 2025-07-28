import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MealTemplate, DayPlanTemplate, LibrarySearchFilters, LibrarySortOptions } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import MealTemplateCard from './MealTemplateCard';
import DayPlanTemplateCard from './DayPlanTemplateCard';
import { TemplateLibraryLoading } from '@/components/ui/loading';
import { StaggeredList, FadeTransition } from '@/components/ui/animated-transitions';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMealTemplate?: (template: MealTemplate) => void;
  onSelectDayPlanTemplate?: (template: DayPlanTemplate) => void;
  mode?: 'selection' | 'browse';
  filterType?: 'meal' | 'day-plan' | 'all';
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onClose,
  onSelectMealTemplate,
  onSelectDayPlanTemplate,
  mode = 'browse',
  filterType = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'meal' | 'day-plan'>(
    filterType === 'day-plan' ? 'day-plan' : 'meal'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);
  const [dayPlanTemplates, setDayPlanTemplates] = useState<DayPlanTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LibrarySearchFilters>({});
  const [sortOption, setSortOption] = useState<LibrarySortOptions>({
    field: 'rating',
    direction: 'desc'
  });

  // Advanced filter states
  const [calorieRange, setCalorieRange] = useState([0, 3000]);
  const [costRange, setCostRange] = useState([0, 500000]);
  const [timeRange, setTimeRange] = useState([0, 180]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortOption, calorieRange, costRange, timeRange, selectedTags, selectedCategories]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'meal' || filterType === 'all') {
        const meals = await templateLibraryService.getMealTemplates();
        setMealTemplates(meals);
      }
      if (activeTab === 'day-plan' || filterType === 'all') {
        const dayPlans = await templateLibraryService.getDayPlanTemplates();
        setDayPlanTemplates(dayPlans);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const searchFilters: LibrarySearchFilters = {
      query: searchQuery,
      maxCalories: calorieRange[1],
      maxCost: costRange[1],
      maxCookingTime: timeRange[1],
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      ...filters
    };

    try {
      if (activeTab === 'meal') {
        const filtered = await templateLibraryService.searchMealTemplates(searchFilters, sortOption);
        setMealTemplates(filtered);
      } else {
        const filtered = await templateLibraryService.searchDayPlanTemplates(searchFilters, sortOption);
        setDayPlanTemplates(filtered);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleFilterChange = (key: keyof LibrarySearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [category] // Chỉ cho phép chọn 1 category
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCalorieRange([0, 3000]);
    setCostRange([0, 500000]);
    setTimeRange([0, 180]);
    setSelectedTags([]);
    setSelectedCategories([]);
  };

  const getAvailableTags = () => {
    const templates = activeTab === 'meal' ? mealTemplates : dayPlanTemplates;
    const allTags = templates.flatMap(t => t.tags);
    return [...new Set(allTags)].sort();
  };

  const getAvailableCategories = () => {
    const templates = activeTab === 'meal' ? mealTemplates : dayPlanTemplates;
    const allCategories = templates.map(t => t.category).filter(Boolean);
    return [...new Set(allCategories)].sort();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>Thư viện Templates</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bộ lọc nâng cao</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Calorie Range */}
                    <div>
                      <Label>Calories: {calorieRange[0]} - {calorieRange[1]}</Label>
                      <Slider
                        value={calorieRange}
                        onValueChange={setCalorieRange}
                        max={3000}
                        step={50}
                        className="mt-2"
                      />
                    </div>

                    {/* Cost Range */}
                    <div>
                      <Label>Chi phí: {(costRange[0]/1000).toFixed(0)}k - {(costRange[1]/1000).toFixed(0)}k VND</Label>
                      <Slider
                        value={costRange}
                        onValueChange={setCostRange}
                        max={500000}
                        step={10000}
                        className="mt-2"
                      />
                    </div>

                    {/* Time Range */}
                    <div>
                      <Label>Thời gian nấu: {timeRange[0]} - {timeRange[1]} phút</Label>
                      <Slider
                        value={timeRange}
                        onValueChange={setTimeRange}
                        max={180}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getAvailableTags().slice(0, 10).map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagToggle(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <Label>Danh mục</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getAvailableCategories().map(category => (
                          <Badge
                            key={category}
                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleCategoryToggle(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearFilters} className="flex-1">
                        Xóa bộ lọc
                      </Button>
                      <Button onClick={() => setShowFilters(false)} className="flex-1">
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Search và Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filters.difficulty || 'all'} onValueChange={(value) => 
              handleFilterChange('difficulty', value === 'all' ? undefined : value)
            }>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortOption.field}-${sortOption.direction}`} onValueChange={(value) => {
              const [field, direction] = value.split('-');
              setSortOption({ field: field as any, direction: direction as any });
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-desc">Đánh giá cao</SelectItem>
                <SelectItem value="usageCount-desc">Phổ biến</SelectItem>
                <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="calories-asc">Calories thấp</SelectItem>
                <SelectItem value="cost-asc">Giá rẻ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedTags.length > 0 || selectedCategories.length > 0 || searchQuery) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchQuery}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
              </Badge>
            ))}
            {selectedCategories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryToggle(category)} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Xóa tất cả
            </Button>
          </div>
        )}

        {/* Tabs */}
        {filterType === 'all' && (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="meal">Bữa ăn ({mealTemplates.length})</TabsTrigger>
              <TabsTrigger value="day-plan">Thực đơn ngày ({dayPlanTemplates.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="meal" className="flex-1 overflow-y-auto">
              <FadeTransition show={!loading}>
                {loading ? (
                  <TemplateLibraryLoading />
                ) : mealTemplates.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>Không tìm thấy template nào</p>
                  </div>
                ) : (
                  <StaggeredList
                    staggerDelay={50}
                    className={`grid gap-4 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}
                  >
                    {mealTemplates.map(template => (
                      <MealTemplateCard
                        key={template.id}
                        template={template}
                        viewMode={viewMode}
                        onSelect={onSelectMealTemplate}
                        selectionMode={mode === 'selection'}
                      />
                    ))}
                  </StaggeredList>
                )}
              </FadeTransition>
            </TabsContent>

            <TabsContent value="day-plan" className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Đang tải...</div>
                </div>
              ) : dayPlanTemplates.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>Không tìm thấy template nào</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {dayPlanTemplates.map(template => (
                    <DayPlanTemplateCard
                      key={template.id}
                      template={template}
                      viewMode={viewMode}
                      onSelect={onSelectDayPlanTemplate}
                      selectionMode={mode === 'selection'}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Single type display */}
        {filterType !== 'all' && (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filterType === 'meal' ? (
                  mealTemplates.map(template => (
                    <MealTemplateCard
                      key={template.id}
                      template={template}
                      viewMode={viewMode}
                      onSelect={onSelectMealTemplate}
                      selectionMode={mode === 'selection'}
                    />
                  ))
                ) : (
                  dayPlanTemplates.map(template => (
                    <DayPlanTemplateCard
                      key={template.id}
                      template={template}
                      viewMode={viewMode}
                      onSelect={onSelectDayPlanTemplate}
                      selectionMode={mode === 'selection'}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateLibrary;
