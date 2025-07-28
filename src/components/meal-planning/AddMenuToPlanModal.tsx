import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, ChefHat, Plus } from 'lucide-react';
import { Menu, AnyPlan } from '@/types/meal-planning';
import { useAuth } from '@/hooks/useAuth';

interface AddMenuToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu | null;
  onAddToPlan: (planData: {
    menu: Menu;
    planType: 'meal' | 'day' | 'week';
    date: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
  }) => void;
}

const AddMenuToPlanModal = ({ isOpen, onClose, menu, onAddToPlan }: AddMenuToPlanModalProps) => {
  const { user } = useAuth();
  const [planType, setPlanType] = useState<'meal' | 'day' | 'week'>('day');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [planName, setPlanName] = useState('');

  if (!menu) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      menu,
      planType,
      date,
      mealType: planType === 'meal' ? mealType : undefined,
      name: planName || generatePlanName()
    };

    onAddToPlan(planData);
    onClose();
    
    // Reset form
    setPlanName('');
    setPlanType('day');
    setDate(new Date().toISOString().split('T')[0]);
    setMealType('lunch');
  };

  const generatePlanName = () => {
    const dateStr = new Date(date).toLocaleDateString('vi-VN');
    switch (planType) {
      case 'meal':
        const mealTypeLabels = {
          breakfast: 'Bữa sáng',
          lunch: 'Bữa trưa', 
          dinner: 'Bữa tối',
          snack: 'Ăn vặt'
        };
        return `${mealTypeLabels[mealType]} ${dateStr} - ${menu.name}`;
      case 'day':
        return `Kế hoạch ngày ${dateStr} - ${menu.name}`;
      case 'week':
        return `Kế hoạch tuần ${dateStr} - ${menu.name}`;
      default:
        return `Kế hoạch ${dateStr} - ${menu.name}`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'breakfast': { label: 'Ăn sáng', color: 'bg-yellow-100 text-yellow-800' },
      'lunch': { label: 'Ăn trưa', color: 'bg-orange-100 text-orange-800' },
      'dinner': { label: 'Ăn tối', color: 'bg-purple-100 text-purple-800' },
      'snack': { label: 'Ăn vặt', color: 'bg-pink-100 text-pink-800' },
      'full_day': { label: 'Cả ngày', color: 'bg-blue-100 text-blue-800' },
      'custom': { label: 'Tùy chỉnh', color: 'bg-gray-100 text-gray-800' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || typeMap.custom;
    return (
      <Badge className={typeInfo.color}>
        {typeInfo.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm thực đơn vào kế hoạch cá nhân
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Menu Preview */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {menu.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{menu.description}</p>
                
                <div className="flex items-center gap-2">
                  {getTypeBadge(menu.type)}
                  <Badge variant="outline">{menu.difficulty}</Badge>
                  <Badge variant="secondary">{menu.recipes.length} món</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{menu.totalCookingTime} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{menu.servings} người</span>
                  </div>
                  <div>
                    <span className="font-medium">{menu.totalCalories}</span>
                    <span className="text-gray-500"> cal</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">
                      {formatCurrency(menu.totalCost)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Tạo bởi: <span className="font-medium">{menu.createdByName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planType">Loại kế hoạch</Label>
              <Select value={planType} onValueChange={(value: any) => setPlanType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meal">Kế hoạch bữa ăn</SelectItem>
                  <SelectItem value="day">Kế hoạch ngày</SelectItem>
                  <SelectItem value="week">Kế hoạch tuần</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {planType === 'meal' && (
              <div className="space-y-2">
                <Label htmlFor="mealType">Bữa ăn</Label>
                <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Bữa sáng</SelectItem>
                    <SelectItem value="lunch">Bữa trưa</SelectItem>
                    <SelectItem value="dinner">Bữa tối</SelectItem>
                    <SelectItem value="snack">Ăn vặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">
                {planType === 'week' ? 'Ngày bắt đầu' : 'Ngày'}
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planName">Tên kế hoạch (tùy chọn)</Label>
              <Input
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder={generatePlanName()}
              />
              <p className="text-xs text-gray-500">
                Để trống để tự động tạo tên
              </p>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Xem trước kế hoạch</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên:</span>
                <span className="font-medium">{planName || generatePlanName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loại:</span>
                <span className="font-medium">
                  {planType === 'meal' ? 'Kế hoạch bữa ăn' : 
                   planType === 'day' ? 'Kế hoạch ngày' : 'Kế hoạch tuần'}
                </span>
              </div>
              {planType === 'meal' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bữa ăn:</span>
                  <span className="font-medium">
                    {mealType === 'breakfast' ? 'Bữa sáng' :
                     mealType === 'lunch' ? 'Bữa trưa' :
                     mealType === 'dinner' ? 'Bữa tối' : 'Ăn vặt'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày:</span>
                <span className="font-medium">
                  {new Date(date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thực đơn:</span>
                <span className="font-medium">{menu.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người tạo:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Thêm vào kế hoạch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuToPlanModal;
