import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Link, 
  FileText, 
  Camera,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2
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

interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (recipe: any) => void;
}

interface ParsedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  difficulty: string;
  category: string;
  image?: string;
}

const ImportRecipeModal: React.FC<ImportRecipeModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState('url');
  const [isLoading, setIsLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);

  // Parse recipe from URL
  const handleUrlImport = async () => {
    if (!importUrl.trim()) {
      toast.error('Vui lòng nhập URL công thức');
      return;
    }

    setIsLoading(true);
    try {
      // Mock URL parsing - in real app, this would call a backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecipe: ParsedRecipe = {
        title: 'Phở Bò Hà Nội',
        description: 'Món phở bò truyền thống của Hà Nội với nước dùng trong vắt, thơm ngon',
        ingredients: [
          '500g xương bò',
          '300g thịt bò',
          '200g bánh phở',
          '1 củ hành tây',
          '3 nhánh hành lá',
          'Gia vị: muối, đường, nước mắm',
          'Rau thơm: ngò gai, húng quế'
        ],
        instructions: [
          'Ninh xương bò trong 3-4 tiếng để có nước dùng trong',
          'Thái thịt bò mỏng, ướp gia vị',
          'Trần bánh phở qua nước sôi',
          'Bày bánh phở vào tô, cho thịt bò lên trên',
          'Chan nước dùng nóng, thêm rau thơm'
        ],
        cookTime: '4 giờ',
        servings: 4,
        difficulty: 'Khó',
        category: 'Món chính',
        image: 'https://example.com/pho-bo.jpg'
      };

      setParsedRecipe(mockRecipe);
      toast.success('Đã phân tích công thức từ URL');
    } catch (error) {
      toast.error('Không thể phân tích URL này');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse recipe from manual text
  const handleTextImport = () => {
    if (!manualText.trim()) {
      toast.error('Vui lòng nhập nội dung công thức');
      return;
    }

    setIsLoading(true);
    try {
      // Simple text parsing logic
      const lines = manualText.split('\n').filter(line => line.trim());
      
      let title = '';
      let description = '';
      const ingredients: string[] = [];
      const instructions: string[] = [];
      
      let currentSection = '';
      
      lines.forEach(line => {
        const lowerLine = line.toLowerCase().trim();
        
        if (!title && line.trim()) {
          title = line.trim();
          return;
        }
        
        if (lowerLine.includes('nguyên liệu') || lowerLine.includes('ingredients')) {
          currentSection = 'ingredients';
          return;
        }
        
        if (lowerLine.includes('cách làm') || lowerLine.includes('hướng dẫn') || 
            lowerLine.includes('instructions') || lowerLine.includes('steps')) {
          currentSection = 'instructions';
          return;
        }
        
        if (currentSection === 'ingredients' && line.trim()) {
          ingredients.push(line.trim().replace(/^[-•*]\s*/, ''));
        } else if (currentSection === 'instructions' && line.trim()) {
          instructions.push(line.trim().replace(/^\d+\.\s*/, ''));
        } else if (!description && line.trim() && currentSection === '') {
          description = line.trim();
        }
      });

      const parsed: ParsedRecipe = {
        title: title || 'Công thức mới',
        description: description || 'Công thức được nhập từ văn bản',
        ingredients,
        instructions,
        cookTime: '30 phút',
        servings: 2,
        difficulty: 'Trung bình',
        category: 'Món chính'
      };

      setParsedRecipe(parsed);
      toast.success('Đã phân tích công thức từ văn bản');
    } catch (error) {
      toast.error('Có lỗi khi phân tích văn bản');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // Handle image upload - OCR functionality
      toast.info('Tính năng OCR đang được phát triển');
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      // Handle text file
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setManualText(content);
        setActiveTab('text');
      };
      reader.readAsText(file);
    } else {
      toast.error('Chỉ hỗ trợ file ảnh hoặc file text');
    }
  };

  const handleImport = () => {
    if (!parsedRecipe) {
      toast.error('Chưa có công thức để nhập');
      return;
    }

    // Convert to the format expected by the app
    const recipe = {
      id: Date.now().toString(),
      title: parsedRecipe.title,
      description: parsedRecipe.description,
      ingredients: parsedRecipe.ingredients,
      instructions: parsedRecipe.instructions,
      cookTime: parsedRecipe.cookTime,
      servings: parsedRecipe.servings,
      difficulty: parsedRecipe.difficulty,
      category: parsedRecipe.category,
      image: parsedRecipe.image,
      calories: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onImport(recipe);
    toast.success('Đã nhập công thức thành công');
    handleClose();
  };

  const handleClose = () => {
    setImportUrl('');
    setManualText('');
    setParsedRecipe(null);
    setActiveTab('url');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-600" />
            Nhập công thức từ nhiều nguồn
          </DialogTitle>
          <DialogDescription>
            Nhập công thức từ URL, văn bản, hoặc file để thêm vào bộ sưu tập của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="url" className="flex items-center">
                <Link className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Văn bản
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                File
              </TabsTrigger>
              <TabsTrigger value="camera" className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 overflow-auto">
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL công thức</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="url"
                      placeholder="https://example.com/recipe"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUrlImport} 
                      disabled={isLoading}
                      className="min-w-[100px]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Phân tích'
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Hỗ trợ các trang web:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cooky.vn</li>
                    <li>Foody.vn</li>
                    <li>AllRecipes.com</li>
                    <li>Food.com</li>
                    <li>Và nhiều trang khác...</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-text">Nội dung công thức</Label>
                  <Textarea
                    id="manual-text"
                    placeholder="Dán hoặc nhập nội dung công thức ở đây...

Ví dụ:
Phở Bò Hà Nội

Nguyên liệu:
- 500g xương bò
- 300g thịt bò
- 200g bánh phở

Cách làm:
1. Ninh xương bò trong 3-4 tiếng
2. Thái thịt bò mỏng
3. Trần bánh phở"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                </div>
                <Button 
                  onClick={handleTextImport} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Phân tích văn bản
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Tải lên file công thức</p>
                    <p className="text-sm text-gray-600">
                      Hỗ trợ file .txt, .doc, .pdf hoặc ảnh chụp công thức
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mt-4">
                      Chọn file
                    </Button>
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="camera" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Chụp ảnh công thức</p>
                    <p className="text-sm text-gray-600">
                      Sử dụng camera để chụp công thức từ sách nấu ăn hoặc tạp chí
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4" disabled>
                    <Camera className="h-4 w-4 mr-2" />
                    Mở camera (Sắp có)
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Preview parsed recipe */}
        {parsedRecipe && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Xem trước công thức
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Tên:</strong> {parsedRecipe.title}</p>
                    <p><strong>Thời gian:</strong> {parsedRecipe.cookTime}</p>
                    <p><strong>Khẩu phần:</strong> {parsedRecipe.servings} người</p>
                    <p><strong>Độ khó:</strong> {parsedRecipe.difficulty}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Nguyên liệu ({parsedRecipe.ingredients.length})</h4>
                  <div className="text-sm max-h-20 overflow-y-auto">
                    {parsedRecipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <p key={index}>• {ingredient}</p>
                    ))}
                    {parsedRecipe.ingredients.length > 3 && (
                      <p className="text-gray-500">... và {parsedRecipe.ingredients.length - 3} nguyên liệu khác</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!parsedRecipe}
            className="min-w-[120px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Nhập công thức
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportRecipeModal;
