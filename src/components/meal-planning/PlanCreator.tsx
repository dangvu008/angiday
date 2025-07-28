import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, ChefHat, CalendarDays, CalendarRange } from 'lucide-react';
import { AnyPlan, MealPlan, SingleDayPlan, WeekPlan, MonthPlan } from '@/types/meal-planning';

interface PlanCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: AnyPlan) => void;
  initialType?: 'meal' | 'day' | 'week' | 'month';
}

const PlanCreator = ({ isOpen, onClose, onCreatePlan, initialType = 'day' }: PlanCreatorProps) => {
  const [planType, setPlanType] = useState<'meal' | 'day' | 'week' | 'month'>(initialType);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    servings: 4,
    tags: [] as string[],
    isTemplate: false,
    isPublic: false
  });

  const [tagInput, setTagInput] = useState('');

  const planTypes = [
    {
      type: 'meal' as const,
      title: 'Kế hoạch bữa ăn',
      description: 'Tạo kế hoạch cho một bữa ăn cụ thể',
      icon: ChefHat,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      examples: ['Bữa sáng healthy', 'Bữa trưa văn phòng', 'Bữa tối gia đình']
    },
    {
      type: 'day' as const,
      title: 'Kế hoạch ngày',
      description: 'Lập kế hoạch ăn uống cho cả ngày',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      examples: ['Ngày ăn chay', 'Ngày giảm cân', 'Ngày cuối tuần']
    },
    {
      type: 'week' as const,
      title: 'Kế hoạch tuần',
      description: 'Lập kế hoạch ăn uống cho cả tuần',
      icon: CalendarDays,
      color: 'bg-green-100 text-green-800 border-green-200',
      examples: ['Tuần ăn healthy', 'Tuần tiết kiệm', 'Tuần ăn chay']
    },
    {
      type: 'month' as const,
      title: 'Kế hoạch tháng',
      description: 'Lập kế hoạch ăn uống cho cả tháng',
      icon: CalendarRange,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      examples: ['Tháng giảm cân', 'Tháng ăn healthy', 'Tháng tiết kiệm']
    }
  ];

  const generateEndDate = (startDate: string, type: string) => {
    const start = new Date(startDate);
    switch (type) {
      case 'day':
        return startDate;
      case 'week':
        const weekEnd = new Date(start);
        weekEnd.setDate(start.getDate() + 6);
        return weekEnd.toISOString().split('T')[0];
      case 'month':
        const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        return monthEnd.toISOString().split('T')[0];
      default:
        return startDate;
    }
  };

  const handleTypeChange = (type: 'meal' | 'day' | 'week' | 'month') => {
    setPlanType(type);
    if (type !== 'meal') {
      setFormData(prev => ({
        ...prev,
        endDate: generateEndDate(prev.startDate, type)
      }));
    }
  };

  const handleStartDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      startDate: date,
      endDate: planType !== 'meal' ? generateEndDate(date, planType) : prev.endDate
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const createEmptyMealSlot = () => ({
    id: `meal_${Date.now()}`,
    dishes: [],
    totalCalories: 0,
    totalCost: 0,
    totalCookingTime: 0,
    calorieDistribution: {}
  });

  const createEmptyDayMeals = () => ({
    breakfast: createEmptyMealSlot(),
    lunch: createEmptyMealSlot(),
    dinner: createEmptyMealSlot(),
    snacks: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseData = {
      id: `${planType}_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      createdBy: 'current_user', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags,
      isTemplate: formData.isTemplate,
      isPublic: formData.isPublic,
      totalCalories: 0,
      totalCost: 0,
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      }
    };

    let newPlan: AnyPlan;

    switch (planType) {
      case 'meal':
        newPlan = {
          ...baseData,
          type: 'meal',
          mealType: formData.mealType,
          date: formData.date,
          meal: createEmptyMealSlot(),
          servings: formData.servings,
          cookingTime: 0
        } as MealPlan;
        break;

      case 'day':
        newPlan = {
          ...baseData,
          type: 'day',
          date: formData.startDate,
          meals: createEmptyDayMeals(),
          nutritionSummary: {
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
          }
        } as SingleDayPlan;
        break;

      case 'week':
        const weekDays = [];
        const startDate = new Date(formData.startDate);
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          weekDays.push({
            date: currentDate.toISOString().split('T')[0],
            meals: createEmptyDayMeals(),
            totalCalories: 0,
            totalCost: 0,
            nutritionSummary: {
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0
            }
          });
        }
        
        newPlan = {
          ...baseData,
          type: 'week',
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: weekDays,
          averageCaloriesPerDay: 0
        } as WeekPlan;
        break;

      case 'month':
        const monthWeeks = [];
        const monthStart = new Date(formData.startDate);
        const monthEnd = new Date(formData.endDate);
        
        // Generate weeks for the month (simplified)
        let currentWeekStart = new Date(monthStart);
        while (currentWeekStart <= monthEnd) {
          const weekEnd = new Date(currentWeekStart);
          weekEnd.setDate(currentWeekStart.getDate() + 6);
          
          const weekDaysForMonth = [];
          for (let i = 0; i < 7; i++) {
            const dayDate = new Date(currentWeekStart);
            dayDate.setDate(currentWeekStart.getDate() + i);
            if (dayDate <= monthEnd) {
              weekDaysForMonth.push({
                date: dayDate.toISOString().split('T')[0],
                meals: createEmptyDayMeals(),
                totalCalories: 0,
                totalCost: 0,
                nutritionSummary: {
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  fiber: 0
                }
              });
            }
          }
          
          monthWeeks.push({
            ...baseData,
            type: 'week',
            startDate: currentWeekStart.toISOString().split('T')[0],
            endDate: Math.min(weekEnd.getTime(), monthEnd.getTime()) === weekEnd.getTime() 
              ? weekEnd.toISOString().split('T')[0] 
              : monthEnd.toISOString().split('T')[0],
            days: weekDaysForMonth,
            averageCaloriesPerDay: 0
          } as WeekPlan);
          
          currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }
        
        newPlan = {
          ...baseData,
          type: 'month',
          year: monthStart.getFullYear(),
          month: monthStart.getMonth() + 1,
          weeks: monthWeeks,
          averageCaloriesPerDay: 0,
          averageCaloriesPerWeek: 0
        } as MonthPlan;
        break;

      default:
        return;
    }

    onCreatePlan(newPlan);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      mealType: 'breakfast',
      servings: 4,
      tags: [],
      isTemplate: false,
      isPublic: false
    });
    setTagInput('');
  };

  const selectedPlanType = planTypes.find(p => p.type === planType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo kế hoạch ăn uống mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Chọn loại kế hoạch</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.type}
                    className={`cursor-pointer transition-all ${
                      planType === type.type
                        ? `ring-2 ring-orange-500 ${type.color}`
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => handleTypeChange(type.type)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">Ví dụ:</p>
                        {type.examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên kế hoạch *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`Ví dụ: ${selectedPlanType?.examples[0]}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả về kế hoạch này..."
                  rows={3}
                />
              </div>

              {/* Date/Time Selection */}
              {planType === 'meal' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Loại bữa ăn</Label>
                    <Select value={formData.mealType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, mealType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Bữa sáng</SelectItem>
                        <SelectItem value="lunch">Bữa trưa</SelectItem>
                        <SelectItem value="dinner">Bữa tối</SelectItem>
                        <SelectItem value="snack">Ăn vặt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Ngày (tùy chọn)</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servings">Số khẩu phần</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </>
              )}

              {planType === 'day' && (
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />
                </div>
              )}

              {(planType === 'week' || planType === 'month') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Nhập tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label>Tùy chọn</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isTemplate}
                      onChange={(e) => setFormData(prev => ({ ...prev, isTemplate: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Lưu làm template</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Công khai</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              <Card className="bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Xem trước</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Loại:</strong> {selectedPlanType?.title}</p>
                  <p><strong>Tên:</strong> {formData.name || 'Chưa đặt tên'}</p>
                  {planType === 'meal' && (
                    <>
                      <p><strong>Bữa ăn:</strong> {
                        formData.mealType === 'breakfast' ? 'Bữa sáng' :
                        formData.mealType === 'lunch' ? 'Bữa trưa' :
                        formData.mealType === 'dinner' ? 'Bữa tối' : 'Ăn vặt'
                      }</p>
                      <p><strong>Khẩu phần:</strong> {formData.servings} người</p>
                    </>
                  )}
                  {planType !== 'meal' && (
                    <p><strong>Thời gian:</strong> {formData.startDate} {formData.endDate && formData.endDate !== formData.startDate && `đến ${formData.endDate}`}</p>
                  )}
                  {formData.tags.length > 0 && (
                    <p><strong>Tags:</strong> {formData.tags.join(', ')}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              Tạo kế hoạch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanCreator;
