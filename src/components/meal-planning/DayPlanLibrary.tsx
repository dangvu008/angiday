import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DayPlanTemplate } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import DayPlanTemplateCard from './DayPlanTemplateCard';

interface DayPlanLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DayPlanTemplate) => void;
  selectedDate: string;
}

const DayPlanLibrary: React.FC<DayPlanLibraryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  selectedDate
}) => {
  const [templates, setTemplates] = useState<DayPlanTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DayPlanTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateLibraryService.getDayPlanTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading day plan templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (template: DayPlanTemplate) => {
    onSelectTemplate(template);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Chọn thực đơn ngày
          </DialogTitle>
          {selectedDate && (
            <p className="text-sm text-gray-600">
              Cho ngày: {formatSelectedDate()}
            </p>
          )}
        </DialogHeader>

        {/* Search */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm thực đơn ngày..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <p>Không tìm thấy thực đơn ngày nào</p>
              {searchQuery && (
                <p className="text-sm mt-2">
                  Thử tìm kiếm với từ khóa khác
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <DayPlanTemplateCard
                  key={template.id}
                  template={template}
                  viewMode="grid"
                  onSelect={handleSelectTemplate}
                  selectionMode={true}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayPlanLibrary;
