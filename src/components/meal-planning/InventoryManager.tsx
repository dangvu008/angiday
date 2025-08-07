import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  MapPin,
  DollarSign,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Inventory, 
  InventoryItem 
} from '@/types/meal-planning';
import { inventoryManagementService } from '@/services/inventory-management.service';
import { IngredientManagementService } from '@/services/IngredientManagementService';
import { toast } from 'sonner';

interface InventoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);

  // Form state for adding/editing items
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: '',
    category: '',
    location: 'pantry' as 'fridge' | 'freezer' | 'pantry' | 'cabinet',
    cost: 0,
    expiryDate: '',
    minimumQuantity: 1,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadInventory();
    }
  }, [isOpen, userId]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const inv = await inventoryManagementService.getInventory(userId);
      setInventory(inv);
      
      // Load alerts
      const lowStock = await inventoryManagementService.getLowStockItems(userId);
      const expiring = await inventoryManagementService.getExpiringItems(userId);
      setLowStockItems(lowStock);
      setExpiringItems(expiring);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Không thể tải kho nguyên liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const newItem = await inventoryManagementService.addInventoryItem(userId, {
        ...formData,
        ingredientId: formData.name,
        purchaseDate: new Date().toISOString(),
        isLowStock: formData.quantity <= formData.minimumQuantity
      });
      
      await loadInventory();
      setShowAddDialog(false);
      resetForm();
      toast.success('Đã thêm nguyên liệu vào kho');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Không thể thêm nguyên liệu');
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    
    try {
      await inventoryManagementService.updateInventoryItem(userId, editingItem.id, formData);
      await loadInventory();
      setEditingItem(null);
      resetForm();
      toast.success('Đã cập nhật nguyên liệu');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Không thể cập nhật nguyên liệu');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await inventoryManagementService.removeInventoryItem(userId, itemId);
      await loadInventory();
      toast.success('Đã xóa nguyên liệu');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Không thể xóa nguyên liệu');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: '',
      category: '',
      location: 'pantry',
      cost: 0,
      expiryDate: '',
      minimumQuantity: 1,
      notes: ''
    });
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      location: item.location,
      cost: item.cost,
      expiryDate: item.expiryDate?.split('T')[0] || '',
      minimumQuantity: item.minimumQuantity,
      notes: item.notes || ''
    });
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'fridge': return '🧊';
      case 'freezer': return '❄️';
      case 'pantry': return '🏠';
      case 'cabinet': return '🗄️';
      default: return '📦';
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'fridge': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'freezer': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'pantry': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cabinet': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredItems = inventory?.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(inventory?.items.map(item => item.category) || [])];

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải kho nguyên liệu...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Quản lý kho nguyên liệu
          </DialogTitle>
          <DialogDescription>
            Theo dõi và quản lý nguyên liệu trong tủ lạnh, tủ đông và kho
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="inventory" className="h-[75vh]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">
              Kho nguyên liệu ({inventory?.items.length || 0})
            </TabsTrigger>
            <TabsTrigger value="alerts" className="relative">
              Cảnh báo
              {(lowStockItems.length + expiringItems.length) > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {lowStockItems.length + expiringItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stats">
              Thống kê
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm nguyên liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm nguyên liệu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm nguyên liệu mới</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên nguyên liệu</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ví dụ: Thịt bò"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Số lượng</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Đơn vị</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="kg, g, lít, cái..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Thịt, rau củ, gia vị..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Vị trí lưu trữ</Label>
                      <Select value={formData.location} onValueChange={(value: any) => setFormData(prev => ({ ...prev, location: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fridge">Tủ lạnh</SelectItem>
                          <SelectItem value="freezer">Tủ đông</SelectItem>
                          <SelectItem value="pantry">Kho</SelectItem>
                          <SelectItem value="cabinet">Tủ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cost">Giá (VND)</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minimumQuantity">Số lượng tối thiểu</Label>
                      <Input
                        id="minimumQuantity"
                        type="number"
                        value={formData.minimumQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumQuantity: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ghi chú thêm..."
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleAddItem}>
                      Thêm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Inventory Items */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <Card key={item.id} className={`${item.isLowStock ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          {item.quantity} {item.unit}
                        </span>
                        {item.isLowStock && (
                          <Badge variant="destructive" className="text-xs">
                            Sắp hết
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getLocationColor(item.location)}>
                          {getLocationIcon(item.location)} {item.location}
                        </Badge>
                        <Badge variant="outline">
                          {item.category}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {item.cost.toLocaleString('vi-VN')}₫
                        </div>
                        {item.expiryDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Mua: {new Date(item.purchaseDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <p className="text-xs text-gray-500 italic">
                          {item.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có nguyên liệu nào
                  </h3>
                  <p className="text-gray-600">
                    Thêm nguyên liệu vào kho để bắt đầu quản lý
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Nguyên liệu sắp hết ({lowStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lowStockItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{item.name}</span>
                        <Badge variant="destructive">
                          {item.quantity} {item.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expiring Items Alert */}
            {expiringItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Calendar className="h-5 w-5" />
                    Nguyên liệu sắp hết hạn ({expiringItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {expiringItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{item.name}</span>
                        <Badge variant="destructive">
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : 'Không rõ'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {lowStockItems.length === 0 && expiringItems.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tất cả đều ổn!
                </h3>
                <p className="text-gray-600">
                  Không có cảnh báo nào về nguyên liệu
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Tổng nguyên liệu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventory?.items.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Tổng giá trị</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(inventory?.totalValue || 0).toLocaleString('vi-VN')}₫
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tên nguyên liệu</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Số lượng</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Đơn vị</Label>
                  <Input
                    id="edit-unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Vị trí</Label>
                  <Select value={formData.location} onValueChange={(value: any) => setFormData(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fridge">Tủ lạnh</SelectItem>
                      <SelectItem value="freezer">Tủ đông</SelectItem>
                      <SelectItem value="pantry">Kho</SelectItem>
                      <SelectItem value="cabinet">Tủ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Giá (VND)</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Ngày hết hạn</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Hủy
                </Button>
                <Button onClick={handleEditItem}>
                  Cập nhật
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryManager;
