import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Save, Eye, Calculator, Coffee, Sun, Moon, Snack } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MealTemplate, DayPlanTemplate, CalculationResult } from '@/types/meal-planning';
import { templateLibraryService } from '@/services/template-library.service';
import { autoCalculatorService } from '@/services/auto-calculator.service';
import TemplateLibrary from './TemplateLibrary';
import DayPlanMealSlot from './DayPlanMealSlot';

interface DayPlanComposerProps {
  isOpen: boolean;
  onClose: () => void;
  template?: DayPlanTemplate | null;
  onSave: (template: DayPlanTemplate) => void;
}

const DayPlanComposer: React.FC<DayPlanComposerProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<DayPlanTemplate>>({
    name: '',
    description: '',
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    },
    tags: [],
    difficulty: 'medium',
    category: '',
    targetAudience: [],
    dietaryRestrictions: [],
    isPublic: false
  });

  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [calculatedData, setCalculatedData] = useState<CalculationResult>({
    calories: 0,
    cost: 0,
    cookingTime: 0,
    nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
    breakdown: {}
  });

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({
        name: '',
        description: '',
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        tags: [],
        difficulty: 'medium',
        category: '',
        targetAudience: [],
        dietaryRestrictions: [],
        isPublic: false
      });
    }
  }, [template]);

  useEffect(() => {
    // Tự động tính toán khi meals thay đổi
    if (formData.meals) {
      const mockTemplate: DayPlanTemplate = {
        ...formData,
        id: template?.id || 'temp',
        totalCalories: 0,
        totalCost: 0,
        totalCookingTime: 0,
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        reviews: 0
      } as DayPlanTemplate;

      const result = autoCalculatorService.calculateDayPlan(mockTemplate);
      setCalculatedData(result);
    }
  }, [formData.meals]);

  const handleInputChange = (field: keyof DayPlanTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMealTemplate = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    setSelectedMealType(mealType);
    setShowLibrary(true);
  };

  const handleSelectMealTemplate = (mealTemplate: MealTemplate) => {
    setFormData(prev => ({
      ...prev,
      meals: {
        ...prev.meals!,
        [selectedMealType]: [...(prev.meals![selectedMealType] || []), mealTemplate]
      }
    }));
    setShowLibrary(false);
  };

  const handleRemoveMealTemplate = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', templateId: string) => {
    setFormData(prev => ({
      ...prev,
      meals: {
        ...prev.meals!,
        [mealType]: prev.meals![mealType].filter(t => t.id !== templateId)
      }
    }));
  };

  const handleMoveMealTemplate = (
    fromMealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    toMealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    templateId: string
  ) => {
    const template = formData.meals![fromMealType].find(t => t.id === templateId);
    if (!template) return;

    setFormData(prev => ({
      ...prev,
      meals: {
        ...prev.meals!,
        [fromMealType]: prev.meals![fromMealType].filter(t => t.id !== templateId),
        [toMealType]: [...prev.meals![toMealType], template]
      }
    }));
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Vui lòng nhập tên thực đơn ngày');
      return;
    }

    const totalMeals = Object.values(formData.meals || {}).reduce((sum, meals) => sum + meals.length, 0);
    if (totalMeals === 0) {
      toast.error('Vui lòng thêm ít nhất một bữa ăn');
      return;
    }

    try {
      const templateToSave: DayPlanTemplate = {
        id: template?.id || `day_plan_template_${Date.now()}`,
        name: formData.name!,
        description: formData.description || '',
        meals: formData.meals!,
        totalCalories: calculatedData.calories,
        totalCost: calculatedData.cost,
        totalCookingTime: calculatedData.cookingTime,
        nutrition: calculatedData.nutrition,
        tags: formData.tags || [],
        difficulty: formData.difficulty!,
        isPublic: formData.isPublic || false,
        createdBy: 'user',
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: formData.category || '',
        targetAudience: formData.targetAudience || [],
        dietaryRestrictions: formData.dietaryRestrictions || [],
        usageCount: template?.usageCount || 0,
        rating: template?.rating || 0,
        reviews: template?.reviews || 0
      };

      await templateLibraryService.saveDayPlanTemplate(templateToSave);
      onSave(templateToSave);
      onClose();
      toast.success(template ? 'Đã cập nhật thực đơn ngày' : 'Đã tạo thực đơn ngày mới');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thực đơn ngày');
      console.error('Error saving day plan template:', error);
    }
  };

  const mealSlots = [
    {
      key: 'breakfast' as const,
      label: 'Bữa sáng',
      icon: Coffee,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      key: 'lunch' as const,
      label: 'Bữa trưa',
      icon: Sun,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      key: 'dinner' as const,
      label: 'Bữa tối',
      icon: Moon,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      key: 'snacks' as const,
      label: 'Bữa phụ',
      icon: Snack,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {template ? 'Chỉnh sửa thực đơn ngày' : 'Tạo thực đơn ngày mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Form thông tin */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tên thực đơn *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="VD: Thực đơn gia đình"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả ngắn về thực đơn này..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Input
                      id="category"
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="VD: Gia đình"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin tính toán */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Tổng quan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {calculatedData.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600">
                        {(calculatedData.cost / 1000).toFixed(0)}k
                      </div>
                      <div className="text-sm text-gray-600">Chi phí (VND)</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {calculatedData.cookingTime}
                      </div>
                      <div className="text-sm text-gray-600">Phút nấu</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Dinh dưỡng:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>{calculatedData.nutrition.protein.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span>{calculatedData.nutrition.carbs.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span>{calculatedData.nutrition.fat.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span>{calculatedData.nutrition.fiber.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meal Slots */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealSlots.map((slot) => (
                  <DayPlanMealSlot
                    key={slot.key}
                    mealType={slot.key}
                    label={slot.label}
                    icon={slot.icon}
                    color={slot.color}
                    iconColor={slot.iconColor}
                    mealTemplates={formData.meals?.[slot.key] || []}
                    onAddTemplate={() => handleAddMealTemplate(slot.key)}
                    onRemoveTemplate={(templateId) => handleRemoveMealTemplate(slot.key, templateId)}
                    onMoveTemplate={(toMealType, templateId) => handleMoveMealTemplate(slot.key, toMealType, templateId)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {template ? 'Cập nhật' : 'Tạo thực đơn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Library */}
      {showLibrary && (
        <TemplateLibrary
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          onSelectMealTemplate={handleSelectMealTemplate}
          mode="selection"
          filterType="meal"
        />
      )}
    </DndProvider>
  );
};

export default DayPlanComposer;
