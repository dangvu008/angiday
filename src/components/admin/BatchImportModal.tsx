import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ImportService } from '@/services/ImportService';
import { IngredientManagementService } from '@/services/IngredientManagementService';
import SmartIngredientInput from './SmartIngredientInput';
import ErrorDisplay from './ErrorDisplay';
import RecipePreviewModal from './RecipePreviewModal';
import {
  Upload,
  FileText,
  Link,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckSquare,
  Square as SquareIcon
} from 'lucide-react';

// Interfaces
interface BatchImportItem {
  id: string;
  type: 'url' | 'data';
  source: string; // URL hoặc tên file
  status: 'pending' | 'processing' | 'success' | 'error' | 'skipped';
  progress: number;
  data?: any;
  error?: string;
  warnings?: string[];
  selected: boolean;
  isDuplicate?: boolean;
  duplicateOf?: string[];
  editMode?: boolean;
}

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: any[]) => void;
  type: 'news' | 'recipe';
  existingRecipes?: any[];
}

interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  current?: string;
  isRunning: boolean;
  isPaused: boolean;
}

const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  type,
  existingRecipes = []
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [items, setItems] = useState<BatchImportItem[]>([]);
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0,
    isRunning: false,
    isPaused: false
  });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [previewItem, setPreviewItem] = useState<BatchImportItem | null>(null);
  const [normalizeIngredients, setNormalizeIngredients] = useState(true);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Utility functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Initialize IngredientManagementService
  useEffect(() => {
    IngredientManagementService.initialize();
  }, []);

  // Normalize ingredients using SmartIngredientInput
  const normalizeRecipeIngredients = (recipe: any) => {
    if (!normalizeIngredients || !recipe.ingredients) return recipe;

    try {
      // Parse ingredients using IngredientManagementService
      const parsedIngredients = IngredientManagementService.parseIngredientsFromText(recipe.ingredients);

      // Format back to text with normalized format
      const normalizedText = IngredientManagementService.formatIngredientsToText(parsedIngredients);

      return {
        ...recipe,
        ingredients: normalizedText,
        _originalIngredients: recipe.ingredients, // Keep original for reference
        _normalizedIngredients: parsedIngredients // Keep structured data
      };
    } catch (error) {
      console.warn('Failed to normalize ingredients:', error);
      return recipe;
    }
  };

  const resetState = () => {
    setItems([]);
    setBatchProgress({
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      isRunning: false,
      isPaused: false
    });
    setSelectedItems(new Set());
    setUrlInput('');
    setShowPreview(false);
  };

  // URL parsing and validation
  const parseUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s\n]+/g;
    const urls = text.match(urlRegex) || [];
    
    // Also try line-by-line parsing for cases where URLs are on separate lines
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const lineUrls = lines.filter(line => {
      try {
        new URL(line);
        return true;
      } catch {
        return false;
      }
    });
    
    return [...new Set([...urls, ...lineUrls])];
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        handleJsonFile(content, file.name);
      } else if (file.name.endsWith('.csv')) {
        handleCsvFile(content, file.name);
      } else if (file.name.endsWith('.txt')) {
        handleTextFile(content, file.name);
      } else {
        toast({
          title: "Lỗi",
          description: "Định dạng file không được hỗ trợ. Chỉ hỗ trợ .json, .csv, .txt",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleJsonFile = (content: string, fileName: string) => {
    try {
      const data = JSON.parse(content);
      const recipes = Array.isArray(data) ? data : [data];
      
      const newItems: BatchImportItem[] = recipes.map((recipe, index) => ({
        id: generateId(),
        type: 'data',
        source: `${fileName} - Item ${index + 1}`,
        status: 'pending',
        progress: 0,
        data: recipe,
        selected: true
      }));
      
      setItems(prev => [...prev, ...newItems]);
      setSelectedItems(prev => new Set([...prev, ...newItems.map(item => item.id)]));
      
      toast({
        title: "Thành công",
        description: `Đã tải ${recipes.length} công thức từ file JSON`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đọc file JSON. Vui lòng kiểm tra định dạng file.",
        variant: "destructive",
      });
    }
  };

  const handleCsvFile = (content: string, fileName: string) => {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const recipes = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const recipe: any = {};
        
        headers.forEach((header, i) => {
          recipe[header] = values[i] || '';
        });
        
        return recipe;
      });
      
      const newItems: BatchImportItem[] = recipes.map((recipe, index) => ({
        id: generateId(),
        type: 'data',
        source: `${fileName} - Row ${index + 2}`,
        status: 'pending',
        progress: 0,
        data: recipe,
        selected: true
      }));
      
      setItems(prev => [...prev, ...newItems]);
      setSelectedItems(prev => new Set([...prev, ...newItems.map(item => item.id)]));
      
      toast({
        title: "Thành công",
        description: `Đã tải ${recipes.length} công thức từ file CSV`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đọc file CSV. Vui lòng kiểm tra định dạng file.",
        variant: "destructive",
      });
    }
  };

  const handleTextFile = (content: string, fileName: string) => {
    const urls = parseUrls(content);
    
    if (urls.length === 0) {
      toast({
        title: "Cảnh báo",
        description: "Không tìm thấy URL hợp lệ nào trong file",
        variant: "destructive",
      });
      return;
    }

    const newItems: BatchImportItem[] = urls.map(url => ({
      id: generateId(),
      type: 'url',
      source: url,
      status: 'pending',
      progress: 0,
      selected: true
    }));
    
    setItems(prev => [...prev, ...newItems]);
    setSelectedItems(prev => new Set([...prev, ...newItems.map(item => item.id)]));
    
    toast({
      title: "Thành công",
      description: `Đã tải ${urls.length} URL từ file ${fileName}`,
    });
  };

  // Add URLs from textarea
  const handleAddUrls = () => {
    if (!urlInput.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ít nhất một URL",
        variant: "destructive",
      });
      return;
    }

    const urls = parseUrls(urlInput);
    const validUrls = urls.filter(validateUrl);
    
    if (validUrls.length === 0) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy URL hợp lệ nào",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    const existingUrls = new Set(items.filter(item => item.type === 'url').map(item => item.source));
    const newUrls = validUrls.filter(url => !existingUrls.has(url));
    
    if (newUrls.length === 0) {
      toast({
        title: "Cảnh báo",
        description: "Tất cả URL đã tồn tại trong danh sách",
        variant: "destructive",
      });
      return;
    }

    const newItems: BatchImportItem[] = newUrls.map(url => ({
      id: generateId(),
      type: 'url',
      source: url,
      status: 'pending',
      progress: 0,
      selected: true
    }));
    
    setItems(prev => [...prev, ...newItems]);
    setSelectedItems(prev => new Set([...prev, ...newItems.map(item => item.id)]));
    setUrlInput('');
    
    toast({
      title: "Thành công",
      description: `Đã thêm ${newUrls.length} URL mới${validUrls.length > newUrls.length ? ` (${validUrls.length - newUrls.length} URL trùng lặp đã bỏ qua)` : ''}`,
    });
  };

  // Duplicate detection
  const detectDuplicates = useCallback(() => {
    if (!duplicateDetection) {
      // Clear duplicate flags if detection is disabled
      setItems(prev => prev.map(item => ({
        ...item,
        isDuplicate: false,
        duplicateOf: []
      })));
      return;
    }

    const updatedItems = items.map(item => {
      if (!item.data) return item;

      const duplicates: string[] = [];

      // Check against existing recipes
      for (const existingRecipe of existingRecipes) {
        const titleSimilarity = calculateSimilarity(
          item.data.title?.toLowerCase() || '',
          existingRecipe.title?.toLowerCase() || ''
        );

        const contentSimilarity = calculateSimilarity(
          (item.data.ingredients + ' ' + item.data.instructions)?.toLowerCase() || '',
          (existingRecipe.ingredients + ' ' + existingRecipe.instructions)?.toLowerCase() || ''
        );

        if (titleSimilarity > 0.8 || contentSimilarity > 0.7) {
          duplicates.push(existingRecipe.title);
        }
      }

      // Check against other items in batch
      for (const otherItem of items) {
        if (otherItem.id === item.id || !otherItem.data) continue;

        const titleSimilarity = calculateSimilarity(
          item.data.title?.toLowerCase() || '',
          otherItem.data.title?.toLowerCase() || ''
        );

        if (titleSimilarity > 0.8) {
          duplicates.push(otherItem.data.title);
        }
      }

      return {
        ...item,
        isDuplicate: duplicates.length > 0,
        duplicateOf: duplicates
      };
    });

    setItems(updatedItems);
  }, [items, existingRecipes, duplicateDetection]);

  // Auto-run duplicate detection when items change or detection is toggled
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectDuplicates();
    }, 500); // Debounce to avoid excessive calls

    return () => clearTimeout(timeoutId);
  }, [detectDuplicates]);

  // Simple similarity calculation (Jaccard similarity)
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (!str1 || !str2) return 0;

    const set1 = new Set(str1.split(' ').filter(word => word.length > 2));
    const set2 = new Set(str2.split(' ').filter(word => word.length > 2));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  };

  // Batch processing
  const processBatch = async () => {
    const selectedItemsList = items.filter(item => selectedItems.has(item.id) && item.status === 'pending');

    if (selectedItemsList.length === 0) {
      toast({
        title: "Cảnh báo",
        description: "Không có item nào được chọn để xử lý",
        variant: "destructive",
      });
      return;
    }

    setBatchProgress({
      total: selectedItemsList.length,
      completed: 0,
      failed: 0,
      skipped: 0,
      isRunning: true,
      isPaused: false
    });

    abortControllerRef.current = new AbortController();

    for (let i = 0; i < selectedItemsList.length; i++) {
      if (abortControllerRef.current?.signal.aborted) break;

      const item = selectedItemsList[i];

      // Update current processing item
      setBatchProgress(prev => ({ ...prev, current: item.source }));

      // Update item status to processing
      setItems(prev => prev.map(prevItem =>
        prevItem.id === item.id
          ? { ...prevItem, status: 'processing', progress: 0 }
          : prevItem
      ));

      try {
        let result;

        if (item.type === 'url') {
          // Process URL
          result = await ImportService.extractFromUrl(item.source, type);

          // Simulate progress updates
          for (let progress = 0; progress <= 100; progress += 20) {
            if (abortControllerRef.current?.signal.aborted) break;

            setItems(prev => prev.map(prevItem =>
              prevItem.id === item.id
                ? { ...prevItem, progress }
                : prevItem
            ));

            await new Promise(resolve => setTimeout(resolve, 100));
          }

          if (result.success && result.data) {
            // Normalize ingredients if enabled
            const processedData = normalizeRecipeIngredients(result.data);

            setItems(prev => prev.map(prevItem =>
              prevItem.id === item.id
                ? {
                    ...prevItem,
                    status: 'success',
                    progress: 100,
                    data: processedData,
                    warnings: result.warnings
                  }
                : prevItem
            ));

            setBatchProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        } else {
          // Process existing data (validate and normalize)
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

          // Normalize ingredients for existing data
          const processedData = normalizeRecipeIngredients(item.data);

          setItems(prev => prev.map(prevItem =>
            prevItem.id === item.id
              ? {
                  ...prevItem,
                  status: 'success',
                  progress: 100,
                  data: processedData
                }
              : prevItem
          ));

          setBatchProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
        }
      } catch (error) {
        setItems(prev => prev.map(prevItem =>
          prevItem.id === item.id
            ? {
                ...prevItem,
                status: 'error',
                progress: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            : prevItem
        ));

        setBatchProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    }

    setBatchProgress(prev => ({ ...prev, isRunning: false, current: undefined }));

    // Run duplicate detection after processing
    setTimeout(detectDuplicates, 500);
  };

  // Control functions
  const pauseProcessing = () => {
    setBatchProgress(prev => ({ ...prev, isPaused: true }));
  };

  const resumeProcessing = () => {
    setBatchProgress(prev => ({ ...prev, isPaused: false }));
  };

  const stopProcessing = () => {
    abortControllerRef.current?.abort();
    setBatchProgress(prev => ({ ...prev, isRunning: false, isPaused: false, current: undefined }));
  };

  const retryFailed = () => {
    setItems(prev => prev.map(item =>
      item.status === 'error'
        ? { ...item, status: 'pending', progress: 0, error: undefined }
        : item
    ));
  };

  // Selection functions
  const toggleSelectAll = () => {
    const allIds = items.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.has(id));

    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allIds));
    }
  };

  const selectByStatus = (status: BatchImportItem['status']) => {
    const statusIds = items.filter(item => item.status === status).map(item => item.id);
    setSelectedItems(new Set(statusIds));
  };

  const selectByType = (type: 'url' | 'data') => {
    const typeIds = items.filter(item => item.type === type).map(item => item.id);
    setSelectedItems(new Set(typeIds));
  };

  const selectNonDuplicates = () => {
    const nonDuplicateIds = items.filter(item => !item.isDuplicate).map(item => item.id);
    setSelectedItems(new Set(nonDuplicateIds));
  };

  const selectDuplicates = () => {
    const duplicateIds = items.filter(item => item.isDuplicate).map(item => item.id);
    setSelectedItems(new Set(duplicateIds));
  };

  const invertSelection = () => {
    const allIds = items.map(item => item.id);
    const newSelected = new Set(allIds.filter(id => !selectedItems.has(id)));
    setSelectedItems(newSelected);
  };

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(itemId);
      return newSelected;
    });
  };

  const clearAll = () => {
    setItems([]);
    setSelectedItems(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Batch Import {type === 'recipe' ? 'Công thức' : 'Tin tức'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {!showPreview ? (
            // Input Phase
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'file')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL Import
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Import
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">Nhập danh sách URL (mỗi URL trên một dòng)</Label>
                  <Textarea
                    id="url-input"
                    placeholder="https://example.com/recipe1&#10;https://example.com/recipe2&#10;https://example.com/recipe3"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {parseUrls(urlInput).length} URL được phát hiện
                    </span>
                    <Button onClick={handleAddUrls} disabled={!urlInput.trim()}>
                      <Link className="h-4 w-4 mr-2" />
                      Thêm URLs
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Kéo thả file hoặc click để chọn file
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Hỗ trợ: .json, .csv, .txt
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Chọn File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : null}

          {/* Items List */}
          {items.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col mt-4">
              {/* Controls */}
              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={items.length > 0 && items.every(item => selectedItems.has(item.id))}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      Chọn tất cả ({selectedItems.size}/{items.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={duplicateDetection}
                        onCheckedChange={setDuplicateDetection}
                      />
                      <span className="text-sm">Phát hiện trùng lặp</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={normalizeIngredients}
                        onCheckedChange={setNormalizeIngredients}
                      />
                      <span className="text-sm">Chuẩn hóa nguyên liệu</span>
                    </div>

                    {/* Bulk Selection Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => selectByStatus('success')}
                        title="Chọn tất cả thành công"
                        className="text-xs px-2"
                      >
                        ✓ Thành công
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => selectByStatus('error')}
                        title="Chọn tất cả lỗi"
                        className="text-xs px-2"
                      >
                        ✗ Lỗi
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={selectNonDuplicates}
                        title="Chọn không trùng lặp"
                        className="text-xs px-2"
                      >
                        Không trùng
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={invertSelection}
                        title="Đảo ngược lựa chọn"
                        className="text-xs px-2"
                      >
                        Đảo ngược
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {batchProgress.isRunning ? (
                    <>
                      {batchProgress.isPaused ? (
                        <Button size="sm" onClick={resumeProcessing}>
                          <Play className="h-4 w-4 mr-1" />
                          Tiếp tục
                        </Button>
                      ) : (
                        <Button size="sm" onClick={pauseProcessing}>
                          <Pause className="h-4 w-4 mr-1" />
                          Tạm dừng
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={stopProcessing}>
                        <Square className="h-4 w-4 mr-1" />
                        Dừng
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={processBatch}
                        disabled={selectedItems.size === 0}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Xử lý ({selectedItems.size})
                      </Button>
                      {items.some(item => item.status === 'error') && (
                        <Button size="sm" variant="outline" onClick={retryFailed}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Thử lại lỗi
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={clearAll}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa tất cả
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Summary */}
              {batchProgress.isRunning && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Đang xử lý: {batchProgress.current}
                    </span>
                    <span className="text-sm text-gray-600">
                      {batchProgress.completed + batchProgress.failed}/{batchProgress.total}
                    </span>
                  </div>
                  <Progress
                    value={(batchProgress.completed + batchProgress.failed) / batchProgress.total * 100}
                    className="mb-2"
                  />
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Thành công: {batchProgress.completed}
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-600" />
                      Lỗi: {batchProgress.failed}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      Bỏ qua: {batchProgress.skipped}
                    </span>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {items.map((item, index) => (
                  <Card key={item.id} className={`${item.isDuplicate ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Selection Checkbox */}
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          className="mt-1"
                        />

                        {/* Status Icon */}
                        <div className="mt-1">
                          {item.status === 'pending' && <SquareIcon className="h-4 w-4 text-gray-400" />}
                          {item.status === 'processing' && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
                          {item.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {item.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                          {item.status === 'skipped' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={item.type === 'url' ? 'default' : 'secondary'}>
                              {item.type === 'url' ? 'URL' : 'Data'}
                            </Badge>
                            {item.isDuplicate && (
                              <Badge variant="destructive" className="text-xs">
                                Trùng lặp
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm font-medium truncate" title={item.source}>
                            {item.source}
                          </p>

                          {item.data?.title && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {item.data.title}
                            </p>
                          )}

                          {/* Progress Bar */}
                          {item.status === 'processing' && (
                            <Progress value={item.progress} className="mt-2 h-1" />
                          )}

                          {/* Error Message */}
                          {item.error && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                              {item.error}
                            </div>
                          )}

                          {/* Warnings */}
                          {item.warnings && item.warnings.length > 0 && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                              {item.warnings.slice(0, 2).map((warning, i) => (
                                <div key={i}>• {warning}</div>
                              ))}
                              {item.warnings.length > 2 && (
                                <div>... và {item.warnings.length - 2} cảnh báo khác</div>
                              )}
                            </div>
                          )}

                          {/* Duplicate Info */}
                          {item.isDuplicate && item.duplicateOf && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                              <strong>Trùng lặp với:</strong>
                              <ul className="mt-1">
                                {item.duplicateOf.slice(0, 3).map((duplicate, i) => (
                                  <li key={i}>• {duplicate}</li>
                                ))}
                                {item.duplicateOf.length > 3 && (
                                  <li>... và {item.duplicateOf.length - 3} công thức khác</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {item.data && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewItem(item)}
                              title="Xem trước và chỉnh sửa"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {items.length > 0 && (
              <>
                <span>Tổng: {items.length} items</span>
                <span>•</span>
                <span>Đã chọn: {selectedItems.size}</span>
                <span>•</span>
                <span>Thành công: {items.filter(item => item.status === 'success').length}</span>
                <span>•</span>
                <span>Lỗi: {items.filter(item => item.status === 'error').length}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>

            {items.some(item => item.status === 'success' && selectedItems.has(item.id)) && (
              <Button
                onClick={() => {
                  const successItems = items.filter(item =>
                    item.status === 'success' && selectedItems.has(item.id)
                  );
                  onImport(successItems.map(item => item.data));
                  onClose();
                }}
              >
                Import {items.filter(item => item.status === 'success' && selectedItems.has(item.id)).length} công thức
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Preview Modal */}
      {previewItem && previewItem.data && (
        <RecipePreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          recipe={previewItem.data}
          existingRecipes={existingRecipes}
          onSave={(updatedRecipe) => {
            setItems(prev => prev.map(item =>
              item.id === previewItem.id
                ? { ...item, data: updatedRecipe }
                : item
            ));
            setPreviewItem(null);
          }}
        />
      )}
    </Dialog>
  );
};

export default BatchImportModal;
