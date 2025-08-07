import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  CheckCircle,
  Plus,
  Minus,
  Package,
  DollarSign,
  Clock,
  Download,
  Printer,
  Eye,
  EyeOff,
  Edit3,
  Check,
  X,
  Image,
  CheckSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ShoppingList,
  ShoppingListItem,
  AnyPlan,
  Menu,
  ExpenseRecord,
  ExpenseCategory,
  ExpenseItem
} from '@/types/meal-planning';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { expenseTrackingService } from '@/services/expense-tracking.service';
import ExpenseStatistics from './ExpenseStatistics';
import { toast } from 'sonner';

interface SmartShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
  availablePlans?: AnyPlan[];
  availableMenus?: Menu[];
  userId: string;
}

interface SelectedPlan {
  plan: AnyPlan;
  selected: boolean;
}

interface SelectedMenu {
  menu: Menu;
  selected: boolean;
}

const SmartShoppingList: React.FC<SmartShoppingListProps> = ({
  isOpen,
  onClose,
  availablePlans = [],
  availableMenus = [],
  userId
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'shopping'>('select');
  const [selectedPlans, setSelectedPlans] = useState<Map<string, boolean>>(new Map());
  const [selectedMenus, setSelectedMenus] = useState<Map<string, boolean>>(new Map());
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // New states for enhanced features
  const [showPrices, setShowPrices] = useState(true);
  const [editingPrices, setEditingPrices] = useState<Set<string>>(new Set());
  const [tempPrices, setTempPrices] = useState<Map<string, number>>(new Map());

  // Expense tracking states
  const [editingTotalCost, setEditingTotalCost] = useState(false);
  const [tempTotalCost, setTempTotalCost] = useState(0);
  const [expenseRecord, setExpenseRecord] = useState<ExpenseRecord | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('select');
      setSelectedPlans(new Map());
      setSelectedMenus(new Map());
      setShoppingList(null);
      setCheckedItems(new Set());
    }
  }, [isOpen]);

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => {
      const newMap = new Map(prev);
      newMap.set(planId, !newMap.get(planId));
      return newMap;
    });
  };

  const handleMenuToggle = (menuId: string) => {
    setSelectedMenus(prev => {
      const newMap = new Map(prev);
      newMap.set(menuId, !newMap.get(menuId));
      return newMap;
    });
  };

  const generateCombinedShoppingList = async () => {
    try {
      setLoading(true);
      
      const allIngredients: string[] = [];
      
      // Lấy nguyên liệu từ các plan đã chọn
      for (const plan of availablePlans) {
        if (selectedPlans.get(plan.id)) {
          const status = await inventoryManagementService.checkPlanShoppingStatus(plan, userId);
          allIngredients.push(...status.missingIngredients);
        }
      }
      
      // Lấy nguyên liệu từ các menu đã chọn
      for (const menu of availableMenus) {
        if (selectedMenus.get(menu.id)) {
          for (const recipe of menu.recipes) {
            allIngredients.push(...recipe.ingredients);
          }
        }
      }

      // Loại bỏ trùng lặp và tạo shopping list
      const uniqueIngredients = [...new Set(allIngredients)];
      
      if (uniqueIngredients.length === 0) {
        toast.warning('Không có nguyên liệu nào cần mua');
        return;
      }

      const combinedShoppingList = await inventoryManagementService.createShoppingListFromMissingIngredients(
        'combined-' + Date.now(),
        uniqueIngredients
      );

      setShoppingList(combinedShoppingList);
      setActiveTab('shopping');
      toast.success(`Đã tạo danh sách mua sắm với ${uniqueIngredients.length} mục`);
      
    } catch (error) {
      console.error('Error generating shopping list:', error);
      toast.error('Không thể tạo danh sách mua sắm');
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // New functions for enhanced features
  const handleSelectAll = () => {
    if (!shoppingList) return;
    const allItemIds = shoppingList.items.map(item => item.id);
    setCheckedItems(new Set(allItemIds));
  };

  const handleDeselectAll = () => {
    setCheckedItems(new Set());
  };

  const handlePriceEdit = (itemId: string, newPrice: number) => {
    if (!shoppingList) return;

    // Update the shopping list with new price
    const updatedItems = shoppingList.items.map(item =>
      item.id === itemId ? { ...item, estimatedCost: newPrice } : item
    );

    const newTotalCost = updatedItems.reduce((sum, item) => sum + item.estimatedCost, 0);

    setShoppingList({
      ...shoppingList,
      items: updatedItems,
      totalCost: newTotalCost
    });

    // Remove from editing state
    setEditingPrices(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });

    setTempPrices(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  };

  const startPriceEdit = (itemId: string, currentPrice: number) => {
    setEditingPrices(prev => new Set(prev).add(itemId));
    setTempPrices(prev => new Map(prev).set(itemId, currentPrice));
  };

  const cancelPriceEdit = (itemId: string) => {
    setEditingPrices(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setTempPrices(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  };

  // Expense tracking functions
  const updateTotalCost = async (newTotal: number) => {
    if (!shoppingList) return;

    const updatedShoppingList = {
      ...shoppingList,
      actualTotalCost: newTotal,
      updatedAt: new Date().toISOString()
    };

    setShoppingList(updatedShoppingList);

    // Create or update expense record using service
    const record = expenseTrackingService.createExpenseRecord(
      updatedShoppingList,
      userId,
      newTotal
    );

    // Update with existing ID if available
    if (expenseRecord?.id) {
      record.id = expenseRecord.id;
      record.createdAt = expenseRecord.createdAt;
    }

    setExpenseRecord(record);

    // Save using service
    await expenseTrackingService.saveExpenseRecord(record);

    toast.success(`Đã cập nhật tổng chi phí: ${newTotal.toLocaleString('vi-VN')}₫`);
  };

  // Load existing expense record when shopping list changes
  useEffect(() => {
    if (shoppingList) {
      // Try to load existing expense record
      const existingRecords = expenseTrackingService.getAllExpenseRecords();
      const existingRecord = existingRecords.find(r => r.shoppingListId === shoppingList.id);

      if (existingRecord) {
        setExpenseRecord(existingRecord);
        setTempTotalCost(existingRecord.actualSpent);
      } else {
        setExpenseRecord(null);
        setTempTotalCost(shoppingList.totalCost);
      }
    }
  }, [shoppingList]);

  const startTotalCostEdit = () => {
    setTempTotalCost(shoppingList?.actualTotalCost || shoppingList?.totalCost || 0);
    setEditingTotalCost(true);
  };

  const confirmTotalCostEdit = () => {
    updateTotalCost(tempTotalCost);
    setEditingTotalCost(false);
  };

  const cancelTotalCostEdit = () => {
    setEditingTotalCost(false);
    setTempTotalCost(0);
  };

  // Export expense statistics
  const exportExpenseStatistics = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyRecords = expenseTrackingService.getExpenseRecordsByMonth(currentYear, currentMonth);

    if (monthlyRecords.length === 0) {
      toast.warning('Chưa có dữ liệu chi tiêu nào trong tháng này');
      return;
    }

    const content = expenseTrackingService.exportExpenseData(monthlyRecords);

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-chi-tieu-${currentYear}-${currentMonth.toString().padStart(2, '0')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Đã xuất báo cáo chi tiêu tháng này');
  };

  const exportShoppingList = () => {
    if (!shoppingList) return;

    const checkedItemsList = shoppingList.items.filter(item => checkedItems.has(item.id));
    const uncheckedItemsList = shoppingList.items.filter(item => !checkedItems.has(item.id));

    const content = [
      'DANH SÁCH MUA SẮM THÔNG MINH',
      '============================',
      '',
      `Tạo lúc: ${new Date(shoppingList.createdAt).toLocaleString('vi-VN')}`,
      `Ngày mua sắm: ${new Date().toLocaleDateString('vi-VN')}`,
      `Tổng chi phí dự kiến: ${shoppingList.totalCost.toLocaleString('vi-VN')}₫`,
      ...(shoppingList.actualTotalCost ? [`Tổng chi phí thực tế: ${shoppingList.actualTotalCost.toLocaleString('vi-VN')}₫`] : []),
      ...(expenseRecord ? [`Tiết kiệm được: ${expenseRecord.savings.toLocaleString('vi-VN')}₫`] : []),
      `Tiến độ: ${checkedItemsList.length}/${shoppingList.items.length} mục đã mua`,
      '',
      '✅ ĐÃ MUA:',
      '----------',
      ...checkedItemsList.map((item, index) =>
        `${index + 1}. ✓ ${item.name} - ${item.quantity} ${item.unit}${showPrices ? ` (${item.estimatedCost.toLocaleString('vi-VN')}₫)` : ''}`
      ),
      '',
      '⏳ CẦN MUA:',
      '-----------',
      ...uncheckedItemsList.map((item, index) =>
        `${index + 1}. ☐ ${item.name} - ${item.quantity} ${item.unit}${showPrices ? ` (${item.estimatedCost.toLocaleString('vi-VN')}₫)` : ''}`
      ),
      '',
      '📊 THỐNG KÊ:',
      '------------',
      `Tổng số mục: ${shoppingList.items.length}`,
      `Đã mua: ${checkedItemsList.length}`,
      `Còn lại: ${uncheckedItemsList.length}`,
      `Chi phí đã mua: ${checkedItemsList.reduce((sum, item) => sum + item.estimatedCost, 0).toLocaleString('vi-VN')}₫`,
      `Chi phí còn lại: ${uncheckedItemsList.reduce((sum, item) => sum + item.estimatedCost, 0).toLocaleString('vi-VN')}₫`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mua-sam-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Đã xuất danh sách mua sắm');
  };

  const exportMenuAsImage = async () => {
    if (!shoppingList) return;

    try {
      // Create a canvas to draw the menu
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 1000;

      // Set background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font styles
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';

      // Title
      ctx.fillText('DANH SÁCH MUA SẮM', canvas.width / 2, 60);

      // Date
      ctx.font = '16px Arial';
      ctx.fillText(new Date().toLocaleDateString('vi-VN'), canvas.width / 2, 90);

      // Items
      ctx.textAlign = 'left';
      ctx.font = '18px Arial';
      let y = 140;

      shoppingList.items.forEach((item, index) => {
        const isChecked = checkedItems.has(item.id);
        const checkbox = isChecked ? '✅' : '☐';
        const text = `${checkbox} ${item.name} - ${item.quantity} ${item.unit}`;
        const priceText = showPrices ? ` (${item.estimatedCost.toLocaleString('vi-VN')}₫)` : '';

        ctx.fillStyle = isChecked ? '#6b7280' : '#1f2937';
        ctx.fillText(text + priceText, 50, y);
        y += 30;

        if (y > canvas.height - 100) {
          ctx.fillText('...và nhiều mục khác', 50, y);
          return;
        }
      });

      // Total
      if (showPrices) {
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#dc2626';
        ctx.fillText(`Tổng chi phí: ${shoppingList.totalCost.toLocaleString('vi-VN')}₫`, 50, y + 40);
      }

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thuc-don-mua-sam-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Đã xuất thực đơn dạng ảnh');
      }, 'image/png');

    } catch (error) {
      console.error('Error exporting menu as image:', error);
      toast.error('Không thể xuất ảnh thực đơn');
    }
  };

  const selectedPlanCount = Array.from(selectedPlans.values()).filter(Boolean).length;
  const selectedMenuCount = Array.from(selectedMenus.values()).filter(Boolean).length;
  const totalSelected = selectedPlanCount + selectedMenuCount;

  const checkedCount = checkedItems.size;
  const totalItems = shoppingList?.items.length || 0;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Danh sách mua sắm thông minh
          </DialogTitle>
          <DialogDescription>
            Chọn thực đơn và kế hoạch để tạo danh sách mua sắm tối ưu
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'select' | 'shopping')} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Chọn thực đơn ({totalSelected})
            </TabsTrigger>
            <TabsTrigger value="shopping" disabled={!shoppingList} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Mua sắm ({totalItems})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
              {/* Available Plans */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="text-lg">Kế hoạch bữa ăn</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pr-4">
                      {availablePlans.map(plan => (
                        <div
                          key={plan.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            checked={selectedPlans.get(plan.id) || false}
                            onCheckedChange={() => handlePlanToggle(plan.id)}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-gray-600">
                              {plan.type === 'day' ? 'Kế hoạch ngày' : 
                               plan.type === 'week' ? 'Kế hoạch tuần' : 
                               plan.type === 'month' ? 'Kế hoạch tháng' : 'Bữa ăn'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {plan.totalCalories} cal
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {plan.totalCost.toLocaleString('vi-VN')}₫
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      {availablePlans.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          Chưa có kế hoạch bữa ăn nào
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Available Menus */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="text-lg">Thực đơn có sẵn</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pr-4">
                      {availableMenus.map(menu => (
                        <div
                          key={menu.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            checked={selectedMenus.get(menu.id) || false}
                            onCheckedChange={() => handleMenuToggle(menu.id)}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{menu.name}</h4>
                            <p className="text-sm text-gray-600">{menu.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {menu.recipes.length} món
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {menu.totalCalories} cal
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {menu.totalCost.toLocaleString('vi-VN')}₫
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      {availableMenus.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          Chưa có thực đơn nào
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4 flex-shrink-0">
              <Button
                onClick={generateCombinedShoppingList}
                disabled={totalSelected === 0 || loading}
                size="lg"
                className="min-w-48"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {loading ? 'Đang tạo...' : `Tạo danh sách mua sắm (${totalSelected})`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="flex-1 overflow-hidden flex flex-col space-y-4">
            {shoppingList && (
              <>
                {/* Shopping List Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 flex-shrink-0 gap-3">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold">Danh sách mua sắm</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {checkedCount}/{totalItems} mục đã mua •
                      {showPrices && (
                        <>
                          Dự kiến: {shoppingList.totalCost.toLocaleString('vi-VN')}₫
                          {shoppingList.actualTotalCost && (
                            <> • Thực tế: {shoppingList.actualTotalCost.toLocaleString('vi-VN')}₫</>
                          )}
                        </>
                      )}
                    </p>
                    {expenseRecord && (
                      <p className="text-xs text-blue-600">
                        📊 Tiết kiệm: {expenseRecord.savings.toLocaleString('vi-VN')}₫ •
                        Ngày: {new Date(expenseRecord.date).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {/* Total Cost Update */}
                    {showPrices && (
                      <div className="flex items-center gap-2 mr-2">
                        {editingTotalCost ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempTotalCost}
                              onChange={(e) => setTempTotalCost(Number(e.target.value))}
                              className="w-32 h-8 text-sm"
                              placeholder="Tổng thực tế"
                              min="0"
                              step="1000"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={confirmTotalCostEdit}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelTotalCostEdit}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startTotalCostEdit}
                            className="flex items-center gap-2"
                          >
                            <DollarSign className="h-4 w-4" />
                            Cập nhật tổng
                          </Button>
                        )}
                      </div>
                    )}

                    <Button variant="outline" size="sm" onClick={exportShoppingList} className="text-xs md:text-sm">
                      <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Xuất danh sách</span>
                      <span className="sm:hidden">Xuất</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportMenuAsImage} className="text-xs md:text-sm">
                      <Image className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Xuất ảnh</span>
                      <span className="sm:hidden">Ảnh</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportExpenseStatistics} className="text-xs md:text-sm">
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Báo cáo chi tiêu</span>
                      <span className="sm:hidden">Báo cáo</span>
                    </Button>
                    <ExpenseStatistics userId={userId} />
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs md:text-sm">
                      <Printer className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">In</span>
                      <span className="sm:hidden">In</span>
                    </Button>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="flex flex-wrap gap-1 md:gap-2 mb-4 p-2 md:p-3 bg-gray-50 rounded-lg flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                  >
                    <CheckSquare className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Chọn hết</span>
                    <span className="sm:hidden">Chọn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                  >
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Bỏ chọn hết</span>
                    <span className="sm:hidden">Bỏ chọn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrices(!showPrices)}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                  >
                    {showPrices ? <EyeOff className="h-3 w-3 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 md:h-4 md:w-4" />}
                    {showPrices ? (
                      <>
                        <span className="hidden sm:inline">Ẩn giá</span>
                        <span className="sm:hidden">Ẩn</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Hiện giá</span>
                        <span className="sm:hidden">Giá</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress */}
                <div className="space-y-2 flex-shrink-0">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ mua sắm</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Expense Summary */}
                {expenseRecord && (
                  <Card className="mb-4 flex-shrink-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">📊 Thống kê chi tiêu</h4>
                        <Badge variant={expenseRecord.savings >= 0 ? "default" : "destructive"}>
                          {expenseRecord.savings >= 0 ? 'Tiết kiệm' : 'Vượt ngân sách'}: {Math.abs(expenseRecord.savings).toLocaleString('vi-VN')}₫
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Dự kiến</p>
                          <p className="font-semibold text-blue-600">{expenseRecord.totalBudget.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Thực tế</p>
                          <p className="font-semibold text-green-600">{expenseRecord.actualSpent.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Ngày mua</p>
                          <p className="font-semibold text-gray-900">{new Date(expenseRecord.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shopping Items */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h4 className="font-semibold mb-3 flex-shrink-0">Danh sách mua sắm</h4>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="space-y-2 pr-4">
                    {shoppingList.items.map(item => {
                      const isEditing = editingPrices.has(item.id);
                      const tempPrice = tempPrices.get(item.id) || item.estimatedCost;

                      return (
                        <div
                          key={item.id}
                          className={`group flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg transition-colors ${
                            checkedItems.has(item.id)
                              ? 'bg-green-50 border-green-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Checkbox
                            checked={checkedItems.has(item.id)}
                            onCheckedChange={() => handleItemToggle(item.id)}
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm md:text-base ${checkedItems.has(item.id) ? 'line-through text-gray-500' : ''}`}>
                              {item.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600">
                              {item.quantity} {item.unit} • {item.category}
                            </p>
                          </div>

                          {/* Price Section */}
                          {showPrices && (
                            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1 md:gap-2">
                                  <Input
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrices(prev =>
                                      new Map(prev).set(item.id, Number(e.target.value))
                                    )}
                                    className="w-16 md:w-20 h-8 text-xs md:text-sm"
                                    min="0"
                                    step="1000"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePriceEdit(item.id, tempPrice)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => cancelPriceEdit(item.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 md:gap-2">
                                  <div className="text-right">
                                    <p className="font-medium text-green-600 text-xs md:text-sm">
                                      {item.estimatedCost.toLocaleString('vi-VN')}₫
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startPriceEdit(item.id, item.estimatedCost)}
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit3 className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Complete Shopping Button */}
                {progress === 100 && (
                  <div className="flex justify-center pt-4 flex-shrink-0">
                    <Button size="lg" className="min-w-48">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Hoàn thành mua sắm
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SmartShoppingList;
