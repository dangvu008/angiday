import React, { useState } from 'react';
import { UserPreferences } from '@/services/aiMealPlanGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Clock, 
  ChefHat, 
  Heart, 
  DollarSign,
  Users,
  Target,
  X,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    cookingSkill: 'intermediate',
    timeConstraints: 'moderate',
    cuisinePreferences: [],
    servingSize: 2,
    budgetRange: 'medium',
    healthGoals: [],
    dislikedIngredients: [],
    preferredMealTypes: ['breakfast', 'lunch', 'dinner'],
    weeklyGoals: ''
  });

  const [newDislikedIngredient, setNewDislikedIngredient] = useState('');

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Chay', icon: '🌱' },
    { id: 'vegan', label: 'Thuần chay', icon: '🥬' },
    { id: 'gluten-free', label: 'Không gluten', icon: '🌾' },
    { id: 'dairy-free', label: 'Không sữa', icon: '🥛' },
    { id: 'low-carb', label: 'Ít carb', icon: '🥩' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'halal', label: 'Halal', icon: '☪️' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' }
  ];

  const cuisineOptions = [
    { id: 'vietnamese', label: 'Việt Nam', icon: '🇻🇳' },
    { id: 'asian', label: 'Châu Á', icon: '🥢' },
    { id: 'western', label: 'Phương Tây', icon: '🍝' },
    { id: 'japanese', label: 'Nhật Bản', icon: '🍣' },
    { id: 'korean', label: 'Hàn Quốc', icon: '🥘' },
    { id: 'thai', label: 'Thái Lan', icon: '🌶️' },
    { id: 'chinese', label: 'Trung Quốc', icon: '🥟' },
    { id: 'indian', label: 'Ấn Độ', icon: '🍛' }
  ];

  const healthGoalOptions = [
    { id: 'weight-loss', label: 'Giảm cân', icon: '⚖️' },
    { id: 'muscle-gain', label: 'Tăng cơ', icon: '💪' },
    { id: 'maintenance', label: 'Duy trì', icon: '⚖️' },
    { id: 'energy-boost', label: 'Tăng năng lượng', icon: '⚡' },
    { id: 'heart-health', label: 'Sức khỏe tim mạch', icon: '❤️' },
    { id: 'digestive-health', label: 'Tiêu hóa tốt', icon: '🌿' }
  ];

  const mealTypeOptions = [
    { id: 'breakfast', label: 'Bữa sáng', icon: '🌅' },
    { id: 'lunch', label: 'Bữa trưa', icon: '☀️' },
    { id: 'dinner', label: 'Bữa tối', icon: '🌙' },
    { id: 'snack', label: 'Ăn vặt', icon: '🍪' }
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleDietaryChange = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: toggleArrayItem(prev.dietaryRestrictions, restriction)
    }));
  };

  const handleCuisineChange = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisinePreferences: toggleArrayItem(prev.cuisinePreferences, cuisine)
    }));
  };

  const handleHealthGoalChange = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      healthGoals: toggleArrayItem(prev.healthGoals, goal)
    }));
  };

  const handleMealTypeChange = (mealType: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredMealTypes: toggleArrayItem(prev.preferredMealTypes, mealType)
    }));
  };

  const addDislikedIngredient = () => {
    if (newDislikedIngredient.trim()) {
      setPreferences(prev => ({
        ...prev,
        dislikedIngredients: [...prev.dislikedIngredients, newDislikedIngredient.trim()]
      }));
      setNewDislikedIngredient('');
    }
  };

  const removeDislikedIngredient = (ingredient: string) => {
    setPreferences(prev => ({
      ...prev,
      dislikedIngredients: prev.dislikedIngredients.filter(i => i !== ingredient)
    }));
  };

  const handleSubmit = () => {
    onSubmit(preferences);
  };

  const isFormValid = () => {
    return preferences.preferredMealTypes.length > 0 && preferences.servingSize > 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-2xl">
            <Brain className="h-6 w-6 mr-3 text-purple-600" />
            Tùy chỉnh sở thích cho AI
          </DialogTitle>
          <DialogDescription>
            Chia sẻ sở thích của bạn để AI tạo thực đơn phù hợp nhất
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Số người ăn: {preferences.servingSize}</Label>
                  <Slider
                    value={[preferences.servingSize]}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, servingSize: value[0] }))}
                    max={8}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Trình độ nấu ăn</Label>
                  <RadioGroup 
                    value={preferences.cookingSkill} 
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, cookingSkill: value as 'beginner' | 'intermediate' | 'advanced' }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Mới bắt đầu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Trung bình</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Thành thạo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Thời gian nấu ăn</Label>
                  <RadioGroup 
                    value={preferences.timeConstraints} 
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, timeConstraints: value as 'quick' | 'moderate' | 'flexible' }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick">Nhanh (&lt;30 phút)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Vừa phải (30-60 phút)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible">Linh hoạt (&gt;60 phút)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Ngân sách</Label>
                  <RadioGroup 
                    value={preferences.budgetRange} 
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, budgetRange: value as 'low' | 'medium' | 'high' }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Tiết kiệm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Trung bình</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">Cao cấp</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Dietary Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Chế độ ăn đặc biệt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dietaryOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        preferences.dietaryRestrictions.includes(option.id)
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleDietaryChange(option.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cuisine Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Sở thích ẩm thực
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cuisineOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        preferences.cuisinePreferences.includes(option.id)
                          ? 'bg-orange-50 border-orange-200 text-orange-800'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCuisineChange(option.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2" />
                  Mục tiêu sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthGoalOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        preferences.healthGoals.includes(option.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleHealthGoalChange(option.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meal Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Bữa ăn muốn lên kế hoạch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mealTypeOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        preferences.preferredMealTypes.includes(option.id)
                          ? 'bg-purple-50 border-purple-200 text-purple-800'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleMealTypeChange(option.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disliked Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Nguyên liệu không thích</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="VD: Hành tây, nấm..."
                    value={newDislikedIngredient}
                    onChange={(e) => setNewDislikedIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDislikedIngredient()}
                  />
                  <Button onClick={addDislikedIngredient}>Thêm</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.dislikedIngredients.map(ingredient => (
                    <Badge key={ingredient} variant="secondary" className="flex items-center space-x-1">
                      <span>{ingredient}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeDislikedIngredient(ingredient)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Mục tiêu tuần này (tùy chọn)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="VD: Muốn thử nhiều món mới, tập trung vào món Việt, cần món nhanh cho tuần bận rộn..."
                  value={preferences.weeklyGoals}
                  onChange={(e) => setPreferences(prev => ({ ...prev, weeklyGoals: e.target.value }))}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI đang tạo thực đơn...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo thực đơn với AI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPreferencesModal;
