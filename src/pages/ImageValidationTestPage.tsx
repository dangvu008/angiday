import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Image as ImageIcon, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { RecipeCardImage, RecipeHeroImage, AvatarImage } from '@/components/ui/ResponsiveImage';

const ImageValidationTestPage = () => {
  const [recipeCardImage, setRecipeCardImage] = useState('');
  const [recipeHeroImage, setRecipeHeroImage] = useState('');
  const [avatarImage, setAvatarImage] = useState('');

  const testImages = {
    valid: {
      recipeCard: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      recipeHero: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=1200&h=900&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    invalid: {
      tooLarge: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=4000&h=3000',
      wrongRatio: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&h=200',
      notImage: 'https://example.com/document.pdf'
    }
  };

  const loadTestImage = (type: 'recipeCard' | 'recipeHero' | 'avatar', imageType: 'valid' | 'invalid', subType?: string) => {
    let imageUrl = '';
    
    if (imageType === 'valid') {
      imageUrl = testImages.valid[type];
    } else {
      imageUrl = testImages.invalid[subType as keyof typeof testImages.invalid];
    }

    switch (type) {
      case 'recipeCard':
        setRecipeCardImage(imageUrl);
        break;
      case 'recipeHero':
        setRecipeHeroImage(imageUrl);
        break;
      case 'avatar':
        setAvatarImage(imageUrl);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Test Validation Hình Ảnh
                </h1>
                <p className="text-gray-600">
                  Kiểm tra hệ thống validation và tối ưu hóa hình ảnh
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Hướng dẫn test:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Recipe Card:</strong> Tỷ lệ 4:3, tối đa 5MB, 1920x1080px</li>
              <li><strong>Recipe Hero:</strong> Tỷ lệ 4:3 hoặc 16:9, tối đa 8MB, 2560x1440px</li>
              <li><strong>Avatar:</strong> Tỷ lệ 1:1 (vuông), tối đa 2MB, 512x512px</li>
              <li>Upload file từ máy tính hoặc dùng URL để test validation</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Test Cases */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recipe Card Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Recipe Card Image
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('recipeCard', 'valid')}
                >
                  Load Valid
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('recipeCard', 'invalid', 'tooLarge')}
                >
                  Load Invalid
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={recipeCardImage}
                onChange={setRecipeCardImage}
                configType="RECIPE_CARD"
                label="Recipe Card (4:3)"
              />
              
              {recipeCardImage && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <RecipeCardImage
                    src={recipeCardImage}
                    alt="Recipe Card Preview"
                    className="w-full max-w-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipe Hero Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Recipe Hero Image
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('recipeHero', 'valid')}
                >
                  Load Valid
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('recipeHero', 'invalid', 'wrongRatio')}
                >
                  Load Invalid
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={recipeHeroImage}
                onChange={setRecipeHeroImage}
                configType="RECIPE_HERO"
                label="Recipe Hero (4:3 or 16:9)"
              />
              
              {recipeHeroImage && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <RecipeHeroImage
                    src={recipeHeroImage}
                    alt="Recipe Hero Preview"
                    className="w-full max-w-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avatar Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Avatar Image
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('avatar', 'valid')}
                >
                  Load Valid
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadTestImage('avatar', 'invalid', 'notImage')}
                >
                  Load Invalid
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={avatarImage}
                onChange={setAvatarImage}
                configType="AVATAR"
                label="Avatar (1:1)"
              />
              
              {avatarImage && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <AvatarImage
                    src={avatarImage}
                    alt="Avatar Preview"
                    className="w-24 h-24"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Validation Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Quy Tắc Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Recipe Card</Badge>
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kích thước file: 10KB - 5MB</li>
                  <li>• Độ phân giải: 400x300 - 1920x1080px</li>
                  <li>• Tỷ lệ khuyến nghị: 4:3</li>
                  <li>• Định dạng: JPEG, PNG, WebP</li>
                  <li>• Chất lượng: 60-95%</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Recipe Hero</Badge>
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kích thước file: 50KB - 8MB</li>
                  <li>• Độ phân giải: 800x600 - 2560x1440px</li>
                  <li>• Tỷ lệ khuyến nghị: 4:3, 16:9</li>
                  <li>• Định dạng: JPEG, PNG, WebP</li>
                  <li>• Chất lượng: 70-90%</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800">Avatar</Badge>
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kích thước file: 5KB - 2MB</li>
                  <li>• Độ phân giải: 100x100 - 512x512px</li>
                  <li>• Tỷ lệ bắt buộc: 1:1 (vuông)</li>
                  <li>• Định dạng: JPEG, PNG, WebP</li>
                  <li>• Chất lượng: 70-90%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Tính Năng Hỗ Trợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Validation Tự Động
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kiểm tra kích thước file và độ phân giải</li>
                  <li>• Validate tỷ lệ khung hình</li>
                  <li>• Kiểm tra định dạng file</li>
                  <li>• Ước tính chất lượng ảnh</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Tối Ưu Hóa Thông Minh
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Tự động resize khi cần thiết</li>
                  <li>• Nén ảnh để giảm kích thước</li>
                  <li>• Chuyển đổi định dạng tối ưu</li>
                  <li>• Tạo thumbnail preview</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ImageValidationTestPage;
