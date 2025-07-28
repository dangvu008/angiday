import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Copy, Star, Clock, DollarSign, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MealTemplate, LibrarySearchFilters, LibrarySortOptions } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import MealTemplateEditor from './MealTemplateEditor';

interface MealTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: MealTemplate) => void;
  selectionMode?: boolean;
}

const MealTemplateManager: React.FC<MealTemplateManagerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  selectionMode = false
}) => {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MealTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LibrarySearchFilters>({});
  const [sortOption, setSortOption] = useState<LibrarySortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });

  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MealTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [templates, searchQuery, filters, sortOption]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateLibraryService.getMealTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Không thể tải danh sách templates');
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = async () => {
    try {
      const searchFilters: LibrarySearchFilters = {
        ...filters,
        query: searchQuery
      };

      const filtered = await templateLibraryService.searchMealTemplates(searchFilters, sortOption);
      setFilteredTemplates(filtered);
    } catch (error) {
      console.error('Error filtering templates:', error);
    }
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEdit = (template: MealTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = (template: MealTemplate) => {
    loadTemplates(); // Reload để cập nhật danh sách
  };

  const handleDelete = async (templateId: string) => {
    try {
      await templateLibraryService.deleteMealTemplate(templateId);
      toast.success('Đã xóa template');
      loadTemplates();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Không thể xóa template');
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicate = async (template: MealTemplate) => {
    const duplicated: MealTemplate = {
      ...template,
      id: `meal_template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    try {
      await templateLibraryService.saveMealTemplate(duplicated);
      toast.success('Đã tạo bản sao');
      loadTemplates();
    } catch (error) {
      toast.error('Không thể tạo bản sao');
      console.error('Error duplicating template:', error);
    }
  };

  const handleSelect = (template: MealTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      templateLibraryService.incrementUsageCount(template.id, 'meal');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  const getMealTypeText = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
      case 'snack': return 'Phụ';
      default: return type;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectionMode ? 'Chọn template bữa ăn' : 'Quản lý templates bữa ăn'}
            </DialogTitle>
          </DialogHeader>

          {/* Search và Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
              <Select value={filters.type || 'all'} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, type: value === 'all' ? undefined : value as any }))
              }>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="breakfast">Sáng</SelectItem>
                  <SelectItem value="lunch">Trưa</SelectItem>
                  <SelectItem value="dinner">Tối</SelectItem>
                  <SelectItem value="snack">Phụ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.difficulty || 'all'} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, difficulty: value === 'all' ? undefined : value as any }))
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
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="calories-asc">Calories thấp</SelectItem>
                  <SelectItem value="calories-desc">Calories cao</SelectItem>
                  <SelectItem value="cost-asc">Giá rẻ</SelectItem>
                  <SelectItem value="cost-desc">Giá cao</SelectItem>
                  <SelectItem value="rating-desc">Đánh giá cao</SelectItem>
                  <SelectItem value="usageCount-desc">Phổ biến</SelectItem>
                  <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                </SelectContent>
              </Select>

              {!selectionMode && (
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo mới
                </Button>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Không tìm thấy template nào</p>
                {!selectionMode && (
                  <Button onClick={handleCreateNew} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo template đầu tiên
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {getDifficultyText(template.difficulty)}
                        </Badge>
                        <Badge variant="outline">
                          {getMealTypeText(template.type)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
                      {template.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{template.totalCalories}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span>{(template.totalCost / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>{template.cookingTime}p</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Rating & Usage */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating.toFixed(1)}</span>
                        </div>
                        <span>Dùng {template.usageCount} lần</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {selectionMode ? (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleSelect(template)}
                          >
                            Chọn
                          </Button>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(template)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDuplicate(template)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setDeleteConfirm(template.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {selectionMode ? 'Hủy' : 'Đóng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Editor */}
      {showEditor && (
        <MealTemplateEditor
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          template={editingTemplate}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn xóa template này? Hành động này không thể hoàn tác.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MealTemplateManager;
