import React, { useState } from 'react';
import { MealPlan, Recipe, useMealPlanning } from '@/contexts/MealPlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Leaf, 
  Heart, 
  Zap, 
  Users, 
  Clock,
  Star,
  Download,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MealPlanTemplate {
  id: string;
  name: string;
  description: string;
  category: 'healthy' | 'vegetarian' | 'keto' | 'family' | 'quick';
  icon: React.ReactNode;
  color: string;
  duration: string;
  meals: Array<{
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId: string;
  }>;
  tags: string[];
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  totalCalories: number;
}

interface MealPlanTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MealPlanTemplate) => void;
}

const MealPlanTemplates: React.FC<MealPlanTemplatesProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const { availableRecipes } = useMealPlanning();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MealPlanTemplate | null>(null);

  // Mock templates data
  const templates: MealPlanTemplate[] = [
    {
      id: 'healthy-week',
      name: 'Tuần lành mạnh',
      description: 'Thực đơn cân bằng dinh dưỡng cho 7 ngày với nhiều rau xanh và protein',
      category: 'healthy',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      duration: '7 ngày',
      difficulty: 'Trung bình',
      totalCalories: 1800,
      tags: ['Cân bằng', 'Nhiều rau', 'Ít dầu mỡ'],
      meals: [
        { date: '2024-01-01', mealType: 'breakfast', recipeId: '3' },
        { date: '2024-01-01', mealType: 'lunch', recipeId: '1' },
        { date: '2024-01-01', mealType: 'dinner', recipeId: '2' },
      ]
    },
    {
      id: 'vegetarian-week',
      name: 'Tuần chay',
      description: 'Thực đơn hoàn toàn từ thực vật, giàu protein và vitamin',
      category: 'vegetarian',
      icon: <Leaf className="h-5 w-5" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      duration: '7 ngày',
      difficulty: 'Dễ',
      totalCalories: 1600,
      tags: ['Chay', 'Thực vật', 'Giàu chất xơ'],
      meals: [
        { date: '2024-01-01', mealType: 'breakfast', recipeId: '3' },
        { date: '2024-01-01', mealType: 'lunch', recipeId: '1' },
      ]
    },
    {
      id: 'keto-week',
      name: 'Tuần Keto',
      description: 'Chế độ ăn ít carb, nhiều chất béo tốt cho giảm cân',
      category: 'keto',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      duration: '7 ngày',
      difficulty: 'Khó',
      totalCalories: 1500,
      tags: ['Ít carb', 'Nhiều chất béo', 'Giảm cân'],
      meals: [
        { date: '2024-01-01', mealType: 'breakfast', recipeId: '2' },
        { date: '2024-01-01', mealType: 'dinner', recipeId: '1' },
      ]
    },
    {
      id: 'family-week',
      name: 'Tuần gia đình',
      description: 'Thực đơn phù hợp cho cả gia đình, dễ nấu và ngon miệng',
      category: 'family',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      duration: '7 ngày',
      difficulty: 'Dễ',
      totalCalories: 2000,
      tags: ['Gia đình', 'Dễ nấu', 'Ngon miệng'],
      meals: [
        { date: '2024-01-01', mealType: 'lunch', recipeId: '2' },
        { date: '2024-01-01', mealType: 'dinner', recipeId: '1' },
      ]
    },
    {
      id: 'quick-week',
      name: 'Tuần nhanh gọn',
      description: 'Các món ăn nhanh, tiện lợi cho người bận rộn',
      category: 'quick',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      duration: '7 ngày',
      difficulty: 'Dễ',
      totalCalories: 1700,
      tags: ['Nhanh', 'Tiện lợi', 'Ít thời gian'],
      meals: [
        { date: '2024-01-01', mealType: 'breakfast', recipeId: '3' },
        { date: '2024-01-01', mealType: 'lunch', recipeId: '3' },
      ]
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả', icon: <Star className="h-4 w-4" /> },
    { key: 'healthy', label: 'Lành mạnh', icon: <Heart className="h-4 w-4" /> },
    { key: 'vegetarian', label: 'Chay', icon: <Leaf className="h-4 w-4" /> },
    { key: 'keto', label: 'Keto', icon: <Zap className="h-4 w-4" /> },
    { key: 'family', label: 'Gia đình', icon: <Users className="h-4 w-4" /> },
    { key: 'quick', label: 'Nhanh gọn', icon: <Clock className="h-4 w-4" /> }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: MealPlanTemplate) => {
    onSelectTemplate(template);
    onClose();
    toast.success(`Đã chọn template: ${template.name}`);
  };

  const handlePreviewTemplate = (template: MealPlanTemplate) => {
    setPreviewTemplate(template);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl">Chọn template kế hoạch bữa ăn</DialogTitle>
            <DialogDescription>
              Bắt đầu nhanh với các template có sẵn phù hợp với nhu cầu của bạn
            </DialogDescription>
          </DialogHeader>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="flex items-center space-x-2"
              >
                {category.icon}
                <span>{category.label}</span>
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        {template.icon}
                      </div>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{template.duration}</span>
                      <span>{template.totalCalories} cal/ngày</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem trước
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Chọn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${previewTemplate.color}`}>
                  {previewTemplate.icon}
                </div>
                {previewTemplate.name}
              </DialogTitle>
              <DialogDescription>
                {previewTemplate.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{previewTemplate.duration}</div>
                  <div className="text-sm text-gray-600">Thời gian</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{previewTemplate.totalCalories}</div>
                  <div className="text-sm text-gray-600">Calories/ngày</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{previewTemplate.meals.length}</div>
                  <div className="text-sm text-gray-600">Bữa ăn mẫu</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Đặc điểm:</h4>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Món ăn mẫu:</h4>
                <div className="space-y-2">
                  {previewTemplate.meals.slice(0, 3).map((meal, index) => {
                    const recipe = availableRecipes.find(r => r.id === meal.recipeId);
                    const mealTypeLabels = {
                      breakfast: 'Sáng',
                      lunch: 'Trưa',
                      dinner: 'Tối',
                      snack: 'Phụ'
                    };
                    
                    return (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <Badge variant="outline" className="text-xs">
                          {mealTypeLabels[meal.mealType]}
                        </Badge>
                        <span className="text-sm">{recipe?.title || 'Món ăn mẫu'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Đóng
              </Button>
              <Button onClick={() => {
                handleSelectTemplate(previewTemplate);
                setPreviewTemplate(null);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Chọn template này
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MealPlanTemplates;
