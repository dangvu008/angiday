import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartIngredientInput from './SmartIngredientInput';
import { NutritionInfo } from '@/services/NutritionCalculatorService';
import {
  Eye,
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';

interface RecipePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: any;
  onSave: (updatedRecipe: any) => void;
  existingRecipes?: any[];
}

const RecipePreviewModal: React.FC<RecipePreviewModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onSave,
  existingRecipes = []
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    setEditedRecipe(recipe);
  }, [recipe]);

  const handleSave = () => {
    onSave(editedRecipe);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedRecipe(recipe);
    setEditMode(false);
  };

  const updateField = (field: string, value: any) => {
    setEditedRecipe((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getQualityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {editMode ? 'Chỉnh sửa công thức' : 'Xem trước công thức'}
            </div>
            <div className="flex items-center gap-2">
              {!editMode ? (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
              <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-y-auto space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {editedRecipe.image && (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={editedRecipe.image} 
                          alt={editedRecipe.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{editedRecipe.title}</CardTitle>
                      {editedRecipe.description && (
                        <p className="text-gray-600 mb-3">{editedRecipe.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {editedRecipe.cookingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {editedRecipe.cookingTime}
                          </div>
                        )}
                        {editedRecipe.servings && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {editedRecipe.servings} người
                          </div>
                        )}
                        {editedRecipe.difficulty && (
                          <Badge className={getDifficultyColor(editedRecipe.difficulty)}>
                            <ChefHat className="h-3 w-3 mr-1" />
                            {editedRecipe.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nguyên liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {editedRecipe.ingredients || 'Chưa có thông tin nguyên liệu'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cách làm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {editedRecipe.instructions || 'Chưa có hướng dẫn'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Nutrition Info */}
              {nutritionInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin dinh dưỡng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">{nutritionInfo.calories}</div>
                        <div className="text-gray-500">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{nutritionInfo.protein}g</div>
                        <div className="text-gray-500">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{nutritionInfo.carbs}g</div>
                        <div className="text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{nutritionInfo.fat}g</div>
                        <div className="text-gray-500">Fat</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="edit" className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tên món ăn</Label>
                    <Input
                      id="title"
                      value={editedRecipe.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Nhập tên món ăn..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={editedRecipe.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Mô tả ngắn về món ăn..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cookingTime">Thời gian nấu</Label>
                      <Input
                        id="cookingTime"
                        value={editedRecipe.cookingTime || ''}
                        onChange={(e) => updateField('cookingTime', e.target.value)}
                        placeholder="VD: 30 phút"
                      />
                    </div>

                    <div>
                      <Label htmlFor="servings">Số người ăn</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={editedRecipe.servings || ''}
                        onChange={(e) => updateField('servings', parseInt(e.target.value) || 1)}
                        placeholder="2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Độ khó</Label>
                      <Select
                        value={editedRecipe.difficulty || ''}
                        onValueChange={(value) => updateField('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ khó" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dễ">Dễ</SelectItem>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Khó">Khó</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Danh mục</Label>
                      <Input
                        id="category"
                        value={editedRecipe.category || ''}
                        onChange={(e) => updateField('category', e.target.value)}
                        placeholder="VD: Món chính"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">URL hình ảnh</Label>
                    <Input
                      id="image"
                      value={editedRecipe.image || ''}
                      onChange={(e) => updateField('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Nguyên liệu</Label>
                    <SmartIngredientInput
                      value={editedRecipe.ingredients || ''}
                      onChange={(value) => updateField('ingredients', value)}
                      existingRecipes={existingRecipes}
                      servings={editedRecipe.servings || 1}
                      showNutrition={true}
                      onNutritionChange={setNutritionInfo}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Cách làm</Label>
                    <Textarea
                      id="instructions"
                      value={editedRecipe.instructions || ''}
                      onChange={(e) => updateField('instructions', e.target.value)}
                      placeholder="Nhập từng bước thực hiện..."
                      rows={8}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin trích xuất</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {editedRecipe.extractionMethod && (
                      <div>
                        <Label className="text-sm font-medium">Phương pháp trích xuất:</Label>
                        <p className="text-sm text-gray-600">{editedRecipe.extractionMethod}</p>
                      </div>
                    )}
                    
                    {editedRecipe.detectedLanguage && (
                      <div>
                        <Label className="text-sm font-medium">Ngôn ngữ phát hiện:</Label>
                        <p className="text-sm text-gray-600">{editedRecipe.detectedLanguage}</p>
                      </div>
                    )}

                    {editedRecipe.dataQuality && (
                      <div>
                        <Label className="text-sm font-medium">Chất lượng dữ liệu:</Label>
                        <Badge className={getQualityColor(editedRecipe.dataQuality.overallConfidence)}>
                          {editedRecipe.dataQuality.overallConfidence}%
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cảnh báo & Lỗi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recipe.warnings && recipe.warnings.length > 0 ? (
                      <div className="space-y-2">
                        {recipe.warnings.map((warning: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-yellow-700">{warning}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Không có cảnh báo</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {editMode && (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Lưu thay đổi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipePreviewModal;
