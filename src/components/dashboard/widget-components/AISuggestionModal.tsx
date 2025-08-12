import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  X,
  Wand2,
  Clock,
  DollarSign,
  Users,
  ChefHat,
  Heart,
  Zap
} from 'lucide-react';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuggestions: (preferences: AISuggestionPreferences) => void;
}

interface AISuggestionPreferences {
  targetDate: string;
  budget: number;
  servings: number;
  cookingTime: 'quick' | 'medium' | 'long' | 'any';
  difficulty: 'easy' | 'medium' | 'hard' | 'any';
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  avoidIngredients: string[];
  specialRequests: string;
  mealTypes: string[];
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({
  isOpen,
  onClose,
  onGenerateSuggestions
}) => {
  const [preferences, setPreferences] = useState<AISuggestionPreferences>({
    targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    budget: 100000, // 100k VND
    servings: 2,
    cookingTime: 'any',
    difficulty: 'any',
    dietaryRestrictions: [],
    cuisinePreferences: [],
    avoidIngredients: [],
    specialRequests: '',
    mealTypes: ['breakfast', 'lunch', 'dinner']
  });

  // Helper function to toggle array items
  const handleArrayToggle = (currentArray: string[], item: string, updateFn: (newArray: string[]) => void) => {
    if (currentArray.includes(item)) {
      updateFn(currentArray.filter(i => i !== item));
    } else {
      updateFn([...currentArray, item]);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const dietaryOptions = [
    'Chay', 'Thuần chay', 'Không gluten', 'Ít đường', 'Ít muối', 
    'Keto', 'Paleo', 'Địa Trung Hải', 'Ít carb'
  ];

  const cuisineOptions = [
    'Việt Nam', 'Trung Hoa', 'Nhật Bản', 'Hàn Quốc', 'Thái Lan',
    'Ý', 'Pháp', 'Mỹ', 'Ấn Độ', 'Mexico'
  ];

  const mealTypeOptions = [
    { id: 'breakfast', label: 'Bữa sáng', icon: '☕' },
    { id: 'lunch', label: 'Bữa trưa', icon: '🍚' },
    { id: 'dinner', label: 'Bữa tối', icon: '🍽️' },
    { id: 'snack', label: 'Bữa phụ', icon: '🍎' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateSuggestions(preferences);
      onClose();
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Gợi Ý Thực Đơn Thông Minh
          </DialogTitle>
          <DialogDescription>
            Tạo gợi ý thực đơn thông minh dựa trên sở thích và yêu cầu của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 p-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetDate">Ngày cần gợi ý</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={preferences.targetDate}
                    onChange={(e) => setPreferences(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Số người ăn</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    max="10"
                    value={preferences.servings}
                    onChange={(e) => setPreferences(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="budget">Ngân sách (VND)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="10000"
                  value={preferences.budget}
                  onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cooking Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Sở thích nấu ăn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Thời gian nấu</Label>
                  <Select 
                    value={preferences.cookingTime} 
                    onValueChange={(value: any) => setPreferences(prev => ({ ...prev, cookingTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Bất kỳ</SelectItem>
                      <SelectItem value="quick">Nhanh (≤ 30 phút)</SelectItem>
                      <SelectItem value="medium">Trung bình (30-60 phút)</SelectItem>
                      <SelectItem value="long">Lâu (&gt; 60 phút)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Độ khó</Label>
                  <Select 
                    value={preferences.difficulty} 
                    onValueChange={(value: any) => setPreferences(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Bất kỳ</SelectItem>
                      <SelectItem value="easy">Dễ</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Các bữa ăn cần gợi ý</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {mealTypeOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={preferences.mealTypes.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences(prev => ({
                            ...prev,
                            mealTypes: [...prev.mealTypes, option.id]
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            mealTypes: prev.mealTypes.filter(type => type !== option.id)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={option.id} className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Chế độ ăn & Hạn chế
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Chế độ ăn đặc biệt</Label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map(option => (
                    <Badge
                      key={option}
                      variant={preferences.dietaryRestrictions.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => 
                        handleArrayToggle(
                          preferences.dietaryRestrictions, 
                          option, 
                          (newArray) => setPreferences(prev => ({ ...prev, dietaryRestrictions: newArray }))
                        )
                      }
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Ẩm thực yêu thích</Label>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map(option => (
                    <Badge
                      key={option}
                      variant={preferences.cuisinePreferences.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => 
                        handleArrayToggle(
                          preferences.cuisinePreferences, 
                          option, 
                          (newArray) => setPreferences(prev => ({ ...prev, cuisinePreferences: newArray }))
                        )
                      }
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Yêu cầu đặc biệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ví dụ: Tôi muốn món ăn có nhiều protein, tránh hành tây, hoặc có món canh..."
                value={preferences.specialRequests}
                onChange={(e) => setPreferences(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo gợi ý...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo gợi ý thông minh
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionModal;
