
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ImportService } from '@/services/ImportService';
import ErrorDisplay from './ErrorDisplay';

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
  const [isImporting] = useState(false);
  const [importError, setImportError] = useState<any>(null);
  const { toast } = useToast();

  const getLanguageName = (langCode: string): string => {
    const languages: { [key: string]: string } = {
      'en': 'Tiếng Anh',
      'zh': 'Tiếng Trung',
      'ja': 'Tiếng Nhật',
      'ko': 'Tiếng Hàn',
      'th': 'Tiếng Thái',
      'fr': 'Tiếng Pháp',
      'de': 'Tiếng Đức',
      'es': 'Tiếng Tây Ban Nha',
      'it': 'Tiếng Ý',
      'vi': 'Tiếng Việt'
    };
    return languages[langCode] || langCode.toUpperCase();
  };

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hợp lệ",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast({
        title: "Lỗi",
        description: "URL không đúng định dạng",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setExtractedData(null);
    setImportError(null);
    setProgress(0);
    
    try {
      // Simulate realistic progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 300);

      const data = await ImportService.extractFromUrl(url, type);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (data.success && data.data) {
        setExtractedData({
          ...data.data,
          warnings: data.warnings,
          validationScore: data.validationScore,
          contentType: data.contentType
        });

        // Show appropriate toast based on validation
        if (data.warnings && data.warnings.length > 0) {
          const hasError = data.warnings.some(w => w.includes('⚠️ CẢNH BÁO'));

          toast({
            title: hasError ? "Cảnh báo" : "Thành công với lưu ý",
            description: hasError
              ? "Đã trích xuất dữ liệu nhưng có vấn đề nghiêm trọng. Vui lòng kiểm tra kỹ."
              : "Đã trích xuất dữ liệu thành công với một số lưu ý.",
            variant: hasError ? "destructive" : "default",
          });
        } else {
          toast({
            title: "Thành công",
            description: "Đã trích xuất dữ liệu thành công",
          });
        }
      } else {
        // Set detailed error information
        setImportError({
          error: data.error || 'Không thể trích xuất dữ liệu',
          errorCode: data.errorCode,
          errorDetails: data.errorDetails,
          debugInfo: data.debugInfo
        });

        toast({
          title: "Trích xuất thất bại",
          description: data.errorDetails?.suggestion || data.error || 'Không thể trích xuất dữ liệu',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error extracting data:', error);

      // Set generic error for unexpected errors
      setImportError({
        error: error instanceof Error ? error.message : "Lỗi không xác định",
        errorCode: 'UNEXPECTED_ERROR',
        errorDetails: {
          step: 'unknown',
          method: 'unknown',
          originalError: error instanceof Error ? error.message : String(error),
          suggestion: 'Vui lòng thử lại hoặc liên hệ hỗ trợ kỹ thuật.'
        }
      });

      toast({
        title: "Lỗi không xác định",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không mong đợi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateImportData = (data: any): boolean => {
    if (!data.title?.trim()) {
      toast({
        title: "Lỗi",
        description: "Tiêu đề không được để trống",
        variant: "destructive",
      });
      return false;
    }

    // Check for critical warnings
    if (data.warnings) {
      const hasCriticalWarning = data.warnings.some((warning: string) =>
        warning.includes('⚠️ CẢNH BÁO')
      );

      if (hasCriticalWarning) {
        toast({
          title: "Không thể import",
          description: "Nội dung này không phải là công thức món ăn. Vui lòng sử dụng URL khác.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Check validation score
    if (data.validationScore !== undefined && data.validationScore < 30) {
      toast({
        title: "Chất lượng dữ liệu thấp",
        description: "Dữ liệu trích xuất có chất lượng thấp. Bạn có chắc muốn tiếp tục?",
        variant: "destructive",
      });
      // Still allow import but warn user
    }

    // Check content type
    if (data.contentType && !['recipe', 'unknown'].includes(data.contentType)) {
      toast({
        title: "Loại nội dung không phù hợp",
        description: `Đây có vẻ là ${data.contentType}, không phải công thức món ăn.`,
        variant: "destructive",
      });
      return false;
    }

    if (type === 'recipe') {
      if (!data.ingredients?.trim() && !data.instructions?.trim()) {
        toast({
          title: "Thiếu thông tin quan trọng",
          description: "Công thức phải có ít nhất nguyên liệu hoặc hướng dẫn",
          variant: "destructive",
        });
        return false;
      }
    }

    if (type === 'news' && !data.content?.trim()) {
      toast({
        title: "Thiếu nội dung",
        description: "Bài viết phải có nội dung",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleImport = () => {
    if (extractedData && validateImportData(extractedData)) {
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

          {/* Error Display */}
          {importError && !isLoading && (
            <ErrorDisplay
              error={importError.error}
              errorCode={importError.errorCode}
              errorDetails={importError.errorDetails}
              debugInfo={importError.debugInfo}
              onRetry={() => handleExtract()}
              onReportBug={() => {
                const bugReport = {
                  url,
                  error: importError.error,
                  errorCode: importError.errorCode,
                  debugInfo: importError.debugInfo,
                  timestamp: new Date().toISOString()
                };
                console.log('Bug report:', bugReport);
                // TODO: Send to bug tracking system
              }}
            />
          )}

          {!extractedData && (
            <Button onClick={handleExtract} disabled={isLoading || !url.trim()}>
              {isLoading ? "Đang trích xuất..." : "Trích xuất dữ liệu"}
            </Button>
          )}

          {extractedData && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Dữ liệu đã trích xuất</h3>
                <div className="flex items-center gap-2">
                  {extractedData.detectedLanguage && extractedData.detectedLanguage !== 'vi' && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <span>🌐</span>
                      <span>Đã dịch từ: {getLanguageName(extractedData.detectedLanguage)}</span>
                    </div>
                  )}
                  {extractedData.validationScore !== undefined && (
                    <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                      extractedData.validationScore >= 70 ? 'bg-green-50 text-green-700' :
                      extractedData.validationScore >= 40 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      <span>📊</span>
                      <span>Điểm: {extractedData.validationScore}/100</span>
                    </div>
                  )}
                  {extractedData.contentType && extractedData.contentType !== 'recipe' && (
                    <div className="flex items-center gap-1 text-sm bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      <span>⚠️</span>
                      <span>Loại: {extractedData.contentType}</span>
                    </div>
                  )}
                  {extractedData.extractionMethod && (
                    <div className="flex items-center gap-1 text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      <span>🔧</span>
                      <span>Phương thức: {extractedData.extractionMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Quality Section */}
              {extractedData.dataQuality && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    Chất lượng dữ liệu trích xuất
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {extractedData.dataQuality.titleConfidence}%
                      </div>
                      <div className="text-xs text-gray-600">Tiêu đề</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {extractedData.dataQuality.ingredientsConfidence}%
                      </div>
                      <div className="text-xs text-gray-600">Nguyên liệu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {extractedData.dataQuality.instructionsConfidence}%
                      </div>
                      <div className="text-xs text-gray-600">Hướng dẫn</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        extractedData.dataQuality.overallConfidence >= 70 ? 'text-green-600' :
                        extractedData.dataQuality.overallConfidence >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {extractedData.dataQuality.overallConfidence}%
                      </div>
                      <div className="text-xs text-gray-600">Tổng thể</div>
                    </div>
                  </div>

                  {extractedData.fieldMapping && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-2">Nguồn dữ liệu:</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(extractedData.fieldMapping).map(([field, source]) => (
                          <span key={field} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {field}: {source as string}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Warnings Section */}
              {extractedData.warnings && extractedData.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    Cảnh báo và lưu ý
                  </h4>
                  <ul className="space-y-1">
                    {extractedData.warnings.map((warning: string, index: number) => (
                      <li key={index} className={`text-sm flex items-start gap-2 ${
                        warning.includes('⚠️ CẢNH BÁO') ? 'text-red-700 font-medium' : 'text-yellow-700'
                      }`}>
                        <span className="mt-0.5">•</span>
                        <span>{warning.replace('⚠️ CẢNH BÁO: ', '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              {type === 'recipe' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Độ khó</Label>
                    <Select
                      value={extractedData.difficulty || 'Dễ'}
                      onValueChange={(value: 'Dễ' | 'Trung bình' | 'Khó') => setExtractedData({...extractedData, difficulty: value})}
                    >
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
                    <Label>Số khẩu phần</Label>
                    <Input
                      type="number"
                      value={extractedData.servings || 2}
                      onChange={(e) => setExtractedData({...extractedData, servings: parseInt(e.target.value) || 2})}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calories (tùy chọn)</Label>
                    <Input
                      type="number"
                      value={extractedData.calories || ''}
                      onChange={(e) => setExtractedData({...extractedData, calories: parseInt(e.target.value) || undefined})}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={extractedData.description || ''}
                  onChange={(e) => setExtractedData({...extractedData, description: e.target.value})}
                  rows={3}
                  placeholder="Mô tả ngắn về món ăn..."
                />
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
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? "Đang import..." : "Import dữ liệu"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
