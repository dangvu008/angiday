
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RecipeValidationService } from '@/services/RecipeValidationService';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import SmartIngredientInput from './SmartIngredientInput';
import ImageUpload from './ImageUpload';
import NutritionDisplay from './NutritionDisplay';
import { NutritionInfo } from '@/services/NutritionCalculatorService';

interface Recipe {
  id?: number;
  title: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  ingredients?: string;
  instructions?: string;
  description?: string;
  image?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  recipe?: Recipe | null;
  mode: 'add' | 'edit';
  existingRecipes?: Recipe[];
}

const RecipeModal = ({ isOpen, onClose, onSave, recipe, mode, existingRecipes = [] }: RecipeModalProps) => {
  const [formData, setFormData] = useState<Recipe>({
    title: '',
    category: 'Món chính',
    difficulty: 'Dễ',
    cookingTime: '',
    servings: 2,
    author: 'Admin',
    status: 'draft',
    ingredients: '',
    instructions: '',
    description: '',
    image: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    tags: []
  });

  const [tagsInput, setTagsInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: Array<{ field: string; message: string; type: 'error' | 'warning' }>;
    warnings: Array<{ field: string; message: string; type: 'error' | 'warning' }>;
  }>({ isValid: true, errors: [], warnings: [] });
  const [isValidating, setIsValidating] = useState(false);
  const [calculatedNutrition, setCalculatedNutrition] = useState<NutritionInfo | null>(null);

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
      setTagsInput(recipe.tags?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        category: 'Món chính',
        difficulty: 'Dễ',
        cookingTime: '',
        servings: 2,
        author: 'Admin',
        status: 'draft',
        ingredients: '',
        instructions: '',
        description: '',
        image: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        tags: []
      });
      setTagsInput('');
    }
    // Reset validation when recipe changes
    setValidationResult({ isValid: true, errors: [], warnings: [] });
  }, [recipe]);

  // Validate form data whenever it changes
  useEffect(() => {
    const validateData = async () => {
      setIsValidating(true);
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      const dataToValidate = { ...formData, tags };

      const result = RecipeValidationService.validateRecipe(dataToValidate, existingRecipes);
      setValidationResult(result);
      setIsValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(validateData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, tagsInput, existingRecipes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submit
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const dataToValidate = {
      ...formData,
      tags,
      // Include calculated nutrition if available
      ...(calculatedNutrition && {
        calories: calculatedNutrition.calories,
        protein: calculatedNutrition.protein,
        carbs: calculatedNutrition.carbs,
        fat: calculatedNutrition.fat
      })
    };
    const finalValidation = RecipeValidationService.validateRecipe(dataToValidate, existingRecipes);

    if (!finalValidation.isValid) {
      setValidationResult(finalValidation);
      return;
    }

    onSave(dataToValidate);
    onClose();
  };

  const handleNutritionChange = (nutrition: NutritionInfo) => {
    setCalculatedNutrition(nutrition);
  };

  // Helper function to get field errors
  const getFieldErrors = (fieldName: string) => {
    return validationResult.errors.filter(error => error.field === fieldName);
  };

  // Helper function to get field warnings
  const getFieldWarnings = (fieldName: string) => {
    return validationResult.warnings.filter(warning => warning.field === fieldName);
  };

  // Helper function to get character count display
  const getCharacterCountDisplay = (text: string, fieldName: string) => {
    const count = RecipeValidationService.getCharacterCount(text);
    const limits = RecipeValidationService.getCharacterLimit(fieldName);

    if (!limits) return null;

    const isOverLimit = count > limits.max;
    const isUnderMin = count < limits.min;

    return (
      <div className={`text-xs mt-1 ${isOverLimit ? 'text-red-500' : isUnderMin ? 'text-yellow-500' : 'text-gray-500'}`}>
        {count}/{limits.max} ký tự
        {isUnderMin && ` (tối thiểu ${limits.min})`}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm công thức mới' : 'Chỉnh sửa công thức'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Validation Summary */}
          {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
            <div className="space-y-2">
              {validationResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">Có {validationResult.errors.length} lỗi cần sửa:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index} className="text-sm">{error.message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.warnings.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">Có {validationResult.warnings.length} cảnh báo:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning.message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên món ăn</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Phở Bò Truyền Thống"
                required
                className={getFieldErrors('title').length > 0 ? 'border-red-500' : ''}
              />
              {getCharacterCountDisplay(formData.title, 'title')}
              {getFieldErrors('title').map((error, index) => (
                <div key={index} className="text-red-500 text-xs">{error.message}</div>
              ))}
              {getFieldWarnings('title').map((warning, index) => (
                <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
              ))}
            </div>
            <div className="space-y-2">
              <ImageUpload
                value={formData.image || ''}
                onChange={(value) => setFormData({ ...formData, image: value })}
                configType="RECIPE_CARD"
                label="Hình ảnh"
                placeholder="https://example.com/image.jpg hoặc upload file"
                className={getFieldErrors('image').length > 0 ? 'border-red-500' : ''}
              />
              {getFieldErrors('image').map((error, index) => (
                <div key={index} className="text-red-500 text-xs">{error.message}</div>
              ))}
              {getFieldWarnings('image').map((warning, index) => (
                <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Mô tả ngắn về món ăn..."
              className={getFieldErrors('description').length > 0 ? 'border-red-500' : ''}
            />
            {getCharacterCountDisplay(formData.description || '', 'description')}
            {getFieldErrors('description').map((error, index) => (
              <div key={index} className="text-red-500 text-xs">{error.message}</div>
            ))}
            {getFieldWarnings('description').map((warning, index) => (
              <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Món chính">Món chính</SelectItem>
                  <SelectItem value="Món phụ">Món phụ</SelectItem>
                  <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                  <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                  <SelectItem value="Món ăn sáng">Món ăn sáng</SelectItem>
                  <SelectItem value="Món ăn trưa">Món ăn trưa</SelectItem>
                  <SelectItem value="Món ăn tối">Món ăn tối</SelectItem>
                  <SelectItem value="Món chay">Món chay</SelectItem>
                  <SelectItem value="Đặc sản">Đặc sản</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={formData.difficulty} onValueChange={(value: 'Dễ' | 'Trung bình' | 'Khó') => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dễ">Dễ</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Khó">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Thời gian nấu</Label>
              <Input
                id="cookingTime"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                placeholder="VD: 30 phút"
                required
                className={getFieldErrors('cookingTime').length > 0 ? 'border-red-500' : ''}
              />
              {getCharacterCountDisplay(formData.cookingTime, 'cookingTime')}
              {getFieldErrors('cookingTime').map((error, index) => (
                <div key={index} className="text-red-500 text-xs">{error.message}</div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">Số khẩu phần</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 0 })}
                min="1"
                required
                className={getFieldErrors('servings').length > 0 ? 'border-red-500' : ''}
              />
              {getFieldErrors('servings').map((error, index) => (
                <div key={index} className="text-red-500 text-xs">{error.message}</div>
              ))}
              {getFieldWarnings('servings').map((warning, index) => (
                <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className={getFieldErrors('author').length > 0 ? 'border-red-500' : ''}
              />
              {getCharacterCountDisplay(formData.author, 'author')}
              {getFieldErrors('author').map((error, index) => (
                <div key={index} className="text-red-500 text-xs">{error.message}</div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: 'published' | 'draft') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein || ''}
                onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs || ''}
                onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.fat || ''}
                onChange={(e) => setFormData({ ...formData, fat: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: healthy, giảm cân, protein cao"
              className={getFieldErrors('tags').length > 0 ? 'border-red-500' : ''}
            />
            {getFieldErrors('tags').map((error, index) => (
              <div key={index} className="text-red-500 text-xs">{error.message}</div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Nguyên liệu</Label>
            <SmartIngredientInput
              value={formData.ingredients || ''}
              onChange={(value) => setFormData({ ...formData, ingredients: value })}
              existingRecipes={existingRecipes}
              servings={formData.servings}
              showNutrition={true}
              onNutritionChange={handleNutritionChange}
              className={getFieldErrors('ingredients').length > 0 ? 'border-red-500' : ''}
            />
            {getCharacterCountDisplay(formData.ingredients || '', 'ingredients')}
            {getFieldErrors('ingredients').map((error, index) => (
              <div key={index} className="text-red-500 text-xs">{error.message}</div>
            ))}
            {getFieldWarnings('ingredients').map((warning, index) => (
              <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Hướng dẫn nấu</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={6}
              className={getFieldErrors('instructions').length > 0 ? 'border-red-500' : ''}
              placeholder="Nhập từng bước thực hiện...&#10;VD:&#10;Bước 1: Chuẩn bị nguyên liệu&#10;Bước 2: Nấu nước dùng&#10;Bước 3: Luộc bánh phở"
            />
            {getCharacterCountDisplay(formData.instructions || '', 'instructions')}
            {getFieldErrors('instructions').map((error, index) => (
              <div key={index} className="text-red-500 text-xs">{error.message}</div>
            ))}
            {getFieldWarnings('instructions').map((warning, index) => (
              <div key={index} className="text-yellow-600 text-xs">{warning.message}</div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!validationResult.isValid || isValidating}
              className={!validationResult.isValid ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isValidating ? 'Đang kiểm tra...' : mode === 'add' ? 'Thêm' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
