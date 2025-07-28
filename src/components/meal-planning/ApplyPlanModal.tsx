import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, ChefHat, Copy, Star, Heart } from 'lucide-react';
import { AnyPlan } from '@/types/meal-planning';
import { useAuth } from '@/hooks/useAuth';

interface ApplyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: AnyPlan | null;
  onApplyPlan: (appliedPlan: {
    originalPlan: AnyPlan;
    newName: string;
    startDate: string;
    personalNotes: string;
  }) => void;
}

const ApplyPlanModal = ({ isOpen, onClose, plan, onApplyPlan }: ApplyPlanModalProps) => {
  const { user } = useAuth();
  const [newName, setNewName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [personalNotes, setPersonalNotes] = useState('');

  if (!plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appliedPlan = {
      originalPlan: plan,
      newName: newName || generateDefaultName(),
      startDate,
      personalNotes
    };

    onApplyPlan(appliedPlan);
    onClose();
    
    // Reset form
    setNewName('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setPersonalNotes('');
  };

  const generateDefaultName = () => {
    const dateStr = new Date(startDate).toLocaleDateString('vi-VN');
    return `${plan.name} - ${dateStr}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'meal': return 'Kế hoạch bữa ăn';
      case 'day': return 'Kế hoạch ngày';
      case 'week': return 'Kế hoạch tuần';
      case 'month': return 'Kế hoạch tháng';
      default: return 'Kế hoạch';
    }
  };

  const getMealTypeLabel = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      case 'snack': return 'Ăn vặt';
      default: return '';
    }
  };

  const calculateDuration = () => {
    switch (plan.type) {
      case 'meal': return '1 bữa ăn';
      case 'day': return '1 ngày';
      case 'week': return '7 ngày';
      case 'month': return '30 ngày';
      default: return 'Không xác định';
    }
  };

  const getEndDate = () => {
    const start = new Date(startDate);
    switch (plan.type) {
      case 'meal':
        return start.toLocaleDateString('vi-VN');
      case 'day':
        return start.toLocaleDateString('vi-VN');
      case 'week':
        const weekEnd = new Date(start);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return weekEnd.toLocaleDateString('vi-VN');
      case 'month':
        const monthEnd = new Date(start);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(monthEnd.getDate() - 1);
        return monthEnd.toLocaleDateString('vi-VN');
      default:
        return start.toLocaleDateString('vi-VN');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Áp dụng kế hoạch cho bản thân
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Original Plan Preview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                </div>
                {plan.isPublic && (
                  <Badge className="bg-green-100 text-green-800">
                    Công khai
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline">
                    {getPlanTypeLabel(plan.type)}
                  </Badge>
                  {'mealType' in plan && plan.mealType && (
                    <Badge variant="secondary">
                      {getMealTypeLabel(plan.mealType)}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>Template</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{plan.cookingTime} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{plan.servings} người</span>
                  </div>
                  <div>
                    <span className="font-medium">{plan.totalCalories}</span>
                    <span className="text-gray-500"> cal</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">
                      {formatCurrency(plan.totalCost)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {plan.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Tạo bởi: <span className="font-medium">{plan.createdByName}</span>
                  {' • '}
                  {new Date(plan.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newName">Tên kế hoạch cá nhân</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={generateDefaultName()}
              />
              <p className="text-xs text-gray-500">
                Để trống để sử dụng tên mặc định
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">
                {plan.type === 'week' ? 'Ngày bắt đầu' : 
                 plan.type === 'month' ? 'Tháng bắt đầu' : 'Ngày áp dụng'}
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalNotes">Ghi chú cá nhân (tùy chọn)</Label>
              <textarea
                id="personalNotes"
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Thêm ghi chú cá nhân, điều chỉnh, hoặc lời nhắc..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm"
              />
            </div>
          </div>

          {/* Preview Applied Plan */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Xem trước kế hoạch áp dụng</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên kế hoạch:</span>
                <span className="font-medium">{newName || generateDefaultName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loại:</span>
                <span className="font-medium">{getPlanTypeLabel(plan.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{calculateDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {plan.type === 'week' || plan.type === 'month' ? 'Từ ngày:' : 'Ngày:'}
                </span>
                <span className="font-medium">
                  {new Date(startDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {(plan.type === 'week' || plan.type === 'month') && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Đến ngày:</span>
                  <span className="font-medium">{getEndDate()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Chủ sở hữu:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="outline" className="text-xs">Riêng tư</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Copy className="h-4 w-4 mr-2" />
              Áp dụng kế hoạch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyPlanModal;
