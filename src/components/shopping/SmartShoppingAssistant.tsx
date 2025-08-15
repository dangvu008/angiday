import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  TrendingUp, 
  MapPin, 
  Clock,
  DollarSign,
  Lightbulb,
  Star,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  quantity: number;
  priority: 'low' | 'medium' | 'high';
}

interface SmartShoppingAssistantProps {
  items: ShoppingItem[];
  onOptimizeRoute?: (optimizedItems: ShoppingItem[]) => void;
  onPriceSuggestion?: (itemId: string, suggestedPrice: number) => void;
  className?: string;
}

const SmartShoppingAssistant: React.FC<SmartShoppingAssistantProps> = ({
  items,
  onOptimizeRoute,
  onPriceSuggestion,
  className = ''
}) => {
  const [budget, setBudget] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('');

  // Smart categorization and optimization
  const optimizedShopping = useMemo(() => {
    // Group by store sections for optimal route
    const storeLayout = {
      'Rau củ': { section: 'Khu rau tươi', order: 1 },
      'Trái cây': { section: 'Khu rau tươi', order: 1 },
      'Thịt': { section: 'Khu thịt tươi sống', order: 2 },
      'Hải sản': { section: 'Khu hải sản', order: 3 },
      'Sữa & Chế phẩm': { section: 'Khu lạnh', order: 4 },
      'Ngũ cốc': { section: 'Khu khô', order: 5 },
      'Gia vị': { section: 'Khu khô', order: 5 },
      'Khác': { section: 'Khu tổng hợp', order: 6 }
    };

    const grouped = items.reduce((acc, item) => {
      const section = storeLayout[item.category]?.section || 'Khu tổng hợp';
      const order = storeLayout[item.category]?.order || 6;
      
      if (!acc[section]) {
        acc[section] = { items: [], order };
      }
      acc[section].items.push(item);
      return acc;
    }, {} as { [section: string]: { items: ShoppingItem[], order: number } });

    // Sort sections by optimal shopping route
    return Object.entries(grouped)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([section, data]) => ({
        section,
        items: data.items.sort((a, b) => {
          // Sort by priority first, then by name
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority] || 
                 a.name.localeCompare(b.name);
        })
      }));
  }, [items]);

  // Budget analysis
  const budgetAnalysis = useMemo(() => {
    const totalCost = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
    const budgetAmount = parseFloat(budget) || 0;
    const isOverBudget = budgetAmount > 0 && totalCost > budgetAmount;
    const difference = budgetAmount - totalCost;

    return {
      totalCost,
      budgetAmount,
      isOverBudget,
      difference,
      percentage: budgetAmount > 0 ? (totalCost / budgetAmount) * 100 : 0
    };
  }, [items, budget]);

  // Price optimization suggestions
  const priceSuggestions = useMemo(() => {
    return items.map(item => {
      // Mock price suggestions based on category and season
      const suggestions = [];
      
      if (item.category === 'Rau củ' || item.category === 'Trái cây') {
        suggestions.push({
          type: 'seasonal',
          message: 'Mua theo mùa để tiết kiệm 20-30%',
          savings: item.estimatedPrice * 0.25
        });
      }
      
      if (item.quantity > 1) {
        suggestions.push({
          type: 'bulk',
          message: 'Mua số lượng lớn để được giảm giá',
          savings: item.estimatedPrice * item.quantity * 0.1
        });
      }

      return { ...item, suggestions };
    });
  }, [items]);

  // Smart shopping tips
  const getShoppingTips = () => {
    const tips = [];
    
    if (budgetAnalysis.isOverBudget) {
      tips.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: `Vượt ngân sách ${formatPrice(Math.abs(budgetAnalysis.difference))}. Hãy xem xét giảm bớt một số món.`
      });
    }

    if (items.filter(item => item.priority === 'high').length > 0) {
      tips.push({
        type: 'info',
        icon: <Star className="h-4 w-4" />,
        message: 'Ưu tiên mua các món có độ ưu tiên cao trước.'
      });
    }

    tips.push({
      type: 'tip',
      icon: <Lightbulb className="h-4 w-4" />,
      message: 'Mua rau củ và thịt tươi cuối cùng để giữ độ tươi ngon.'
    });

    return tips;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleOptimizeRoute = () => {
    if (onOptimizeRoute) {
      const optimizedItems = optimizedShopping.flatMap(section => section.items);
      onOptimizeRoute(optimizedItems);
    }
    toast.success('Đã tối ưu hóa lộ trình mua sắm');
  };

  const handlePriceTip = (itemId: string, suggestedPrice: number) => {
    if (onPriceSuggestion) {
      onPriceSuggestion(itemId, suggestedPrice);
    }
    toast.success('Đã áp dụng gợi ý giá');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Budget Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Quản lý ngân sách
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Nhập ngân sách (VND)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              type="number"
              className="flex-1"
            />
            <div className="text-right">
              <div className="text-sm text-gray-600">Tổng ước tính</div>
              <div className="text-lg font-semibold">
                {formatPrice(budgetAnalysis.totalCost)}
              </div>
            </div>
          </div>
          
          {budgetAnalysis.budgetAmount > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sử dụng ngân sách</span>
                <span>{budgetAnalysis.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    budgetAnalysis.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetAnalysis.percentage, 100)}%` }}
                />
              </div>
              <div className={`text-sm ${
                budgetAnalysis.isOverBudget ? 'text-red-600' : 'text-green-600'
              }`}>
                {budgetAnalysis.isOverBudget ? 'Vượt' : 'Còn lại'}: {formatPrice(Math.abs(budgetAnalysis.difference))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Shopping Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Gợi ý thông minh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getShoppingTips().map((tip, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                tip.type === 'warning' ? 'bg-red-50 border border-red-200' :
                tip.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className={`${
                  tip.type === 'warning' ? 'text-red-600' :
                  tip.type === 'info' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {tip.icon}
                </div>
                <p className="text-sm">{tip.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimized Shopping Route */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Lộ trình mua sắm tối ưu
            </div>
            <Button onClick={handleOptimizeRoute} size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tối ưu hóa
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizedShopping.map((section, index) => (
              <div key={section.section} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{index + 1}. {section.section}</h4>
                  <Badge variant="secondary">{section.items.length} món</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <span className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.priority === 'high' ? 'bg-red-500' :
                          item.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        {item.name}
                      </span>
                      <span className="text-gray-600">{formatPrice(item.estimatedPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartShoppingAssistant;
