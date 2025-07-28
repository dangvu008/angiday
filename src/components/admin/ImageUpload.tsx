import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  AlertTriangle,
  Zap,
  Eye,
  Download,
  Crop,
  RotateCw
} from 'lucide-react';
import { 
  ImageValidationService, 
  ImageValidationResult,
  ImageOptimizationOptions 
} from '@/services/ImageValidationService';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  configType?: 'RECIPE_CARD' | 'RECIPE_HERO' | 'AVATAR';
  className?: string;
  label?: string;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  configType = 'RECIPE_CARD',
  className,
  label = 'Hình ảnh',
  placeholder = 'https://example.com/image.jpg hoặc upload file'
}) => {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsValidating(true);
    
    try {
      // Tạo preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Tạo thumbnail
      const thumbnailUrl = await ImageValidationService.createThumbnail(file);
      setThumbnail(thumbnailUrl);
      
      // Validate ảnh
      const validation = await ImageValidationService.validateImage(file, configType);
      setValidationResult(validation);
      
      // Nếu validation thành công, convert thành base64 hoặc upload
      if (validation.isValid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsValidating(false);
    }
  }, [configType, onChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleOptimize = async () => {
    if (!selectedFile || !validationResult) return;
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const config = ImageValidationService.CONFIGS[configType];
      const options: ImageOptimizationOptions = {
        targetWidth: Math.min(validationResult.imageInfo.width, config.maxWidth),
        targetHeight: Math.min(validationResult.imageInfo.height, config.maxHeight),
        quality: 80,
        format: 'jpeg',
        maintainAspectRatio: true
      };

      const optimized = await ImageValidationService.optimizeImage(selectedFile, options);
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      
      // Update với ảnh đã tối ưu
      await handleFileSelect(optimized.file);
      
      setTimeout(() => {
        setOptimizationProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error optimizing image:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setPreview('');
    setThumbnail('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;
    
    if (validationResult.isValid) {
      return <Check className="h-4 w-4 text-green-600" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getConfigInfo = () => {
    const config = ImageValidationService.CONFIGS[configType];
    return {
      maxSize: `${Math.round(config.maxFileSize / (1024 * 1024))}MB`,
      dimensions: `${config.maxWidth}x${config.maxHeight}px`,
      aspectRatios: config.aspectRatios.map(ar => ar.name).join(', '),
      formats: config.allowedFormats.map(f => f.split('/')[1]).join(', ')
    };
  };

  const configInfo = getConfigInfo();

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="flex items-center gap-2">
        {label}
        {getValidationIcon()}
      </Label>

      <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'url' | 'file')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="file">Upload File</TabsTrigger>
        </TabsList>

        {/* URL Tab */}
        <TabsContent value="url" className="space-y-4">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          
          {value && (
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
          )}
        </TabsContent>

        {/* File Upload Tab */}
        <TabsContent value="file" className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isValidating ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isValidating ? (
              <div className="space-y-2">
                <div className="animate-spin mx-auto">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-blue-600">Đang xử lý ảnh...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Kéo thả ảnh vào đây</p>
                  <p className="text-sm text-gray-500">hoặc</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Chọn file
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Định dạng: {configInfo.formats}</p>
                  <p>Kích thước tối đa: {configInfo.maxSize}</p>
                  <p>Độ phân giải tối đa: {configInfo.dimensions}</p>
                  <p>Tỷ lệ khuyến nghị: {configInfo.aspectRatios}</p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Optimization Progress */}
          {isOptimizing && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Đang tối ưu hóa ảnh...</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Preview and Validation */}
          {selectedFile && validationResult && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Preview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Preview</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={clearImage}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {preview && (
                    <div className="space-y-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <div className="text-xs text-gray-500">
                        {validationResult.imageInfo.width}x{validationResult.imageInfo.height}px •{' '}
                        {Math.round(validationResult.imageInfo.fileSize / 1024)}KB
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Validation Results */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Validation</h4>
                    <Badge variant={validationResult.isValid ? 'default' : 'destructive'}>
                      {validationResult.isValid ? 'Hợp lệ' : 'Có lỗi'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {/* Errors */}
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{error}</AlertDescription>
                      </Alert>
                    ))}

                    {/* Warnings */}
                    {validationResult.warnings.map((warning, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{warning}</AlertDescription>
                      </Alert>
                    ))}

                    {/* Suggestions */}
                    {validationResult.suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Đề xuất:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {validationResult.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optimization Button */}
                    {validationResult.optimizationNeeded && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="w-full mt-2"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Tối ưu hóa ảnh
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUpload;
