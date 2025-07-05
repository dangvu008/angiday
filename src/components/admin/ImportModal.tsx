
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ImportService } from '@/services/ImportService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  type: 'news' | 'recipe';
}

const ImportModal = ({ isOpen, onClose, onImport, type }: ImportModalProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 200);

      const data = await ImportService.extractFromUrl(url, type);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (data.success) {
        setExtractedData(data.data);
        toast({
          title: "Thành công",
          description: "Đã trích xuất dữ liệu thành công",
        });
      } else {
        throw new Error(data.error || 'Không thể trích xuất dữ liệu');
      }
    } catch (error) {
      console.error('Error extracting data:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể trích xuất dữ liệu từ URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (extractedData) {
      onImport(extractedData);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setUrl('');
    setProgress(0);
    setExtractedData(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Import {type === 'news' ? 'Bài viết' : 'Công thức'} từ URL
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL trang web</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article-or-recipe"
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Label>Đang trích xuất dữ liệu...</Label>
              <Progress value={progress} />
            </div>
          )}

          {!extractedData && (
            <Button onClick={handleExtract} disabled={isLoading || !url.trim()}>
              {isLoading ? "Đang trích xuất..." : "Trích xuất dữ liệu"}
            </Button>
          )}

          {extractedData && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Dữ liệu đã trích xuất</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    value={extractedData.title || ''}
                    onChange={(e) => setExtractedData({...extractedData, title: e.target.value})}
                  />
                </div>
                
                {type === 'news' && (
                  <div className="space-y-2">
                    <Label>Danh mục</Label>
                    <Select 
                      value={extractedData.category || 'Sức khỏe'} 
                      onValueChange={(value) => setExtractedData({...extractedData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sức khỏe">Sức khỏe</SelectItem>
                        <SelectItem value="Nấu ăn">Nấu ăn</SelectItem>
                        <SelectItem value="Xu hướng">Xu hướng</SelectItem>
                        <SelectItem value="Dinh dưỡng">Dinh dưỡng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {type === 'recipe' && (
                  <>
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select 
                        value={extractedData.category || 'Món chính'} 
                        onValueChange={(value) => setExtractedData({...extractedData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Món chính">Món chính</SelectItem>
                          <SelectItem value="Món phụ">Món phụ</SelectItem>
                          <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                          <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Thời gian nấu</Label>
                      <Input
                        value={extractedData.cookingTime || ''}
                        onChange={(e) => setExtractedData({...extractedData, cookingTime: e.target.value})}
                        placeholder="30 phút"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label>Hình ảnh</Label>
                <Input
                  value={extractedData.image || ''}
                  onChange={(e) => setExtractedData({...extractedData, image: e.target.value})}
                  placeholder="URL hình ảnh"
                />
              </div>

              {type === 'news' && (
                <div className="space-y-2">
                  <Label>Nội dung</Label>
                  <Textarea
                    value={extractedData.content || ''}
                    onChange={(e) => setExtractedData({...extractedData, content: e.target.value})}
                    rows={6}
                  />
                </div>
              )}

              {type === 'recipe' && (
                <>
                  <div className="space-y-2">
                    <Label>Nguyên liệu</Label>
                    <Textarea
                      value={extractedData.ingredients || ''}
                      onChange={(e) => setExtractedData({...extractedData, ingredients: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hướng dẫn</Label>
                    <Textarea
                      value={extractedData.instructions || ''}
                      onChange={(e) => setExtractedData({...extractedData, instructions: e.target.value})}
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          {extractedData && (
            <Button onClick={handleImport}>
              Import dữ liệu
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
