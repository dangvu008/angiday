import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  PieChart,
  BarChart3
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExpenseRecord } from '@/types/meal-planning';
import { expenseTrackingService } from '@/services/expense-tracking.service';
import { toast } from 'sonner';

interface ExpenseStatisticsProps {
  userId: string;
}

const ExpenseStatistics: React.FC<ExpenseStatisticsProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      loadExpenseRecords();
    }
  }, [isOpen, selectedMonth, selectedYear]);

  const loadExpenseRecords = () => {
    const records = expenseTrackingService.getExpenseRecordsByMonth(selectedYear, selectedMonth);
    setExpenseRecords(records);
  };

  const statistics = expenseTrackingService.getExpenseStatistics(expenseRecords);

  const exportMonthlyReport = () => {
    if (expenseRecords.length === 0) {
      toast.warning('Không có dữ liệu chi tiêu để xuất');
      return;
    }

    const content = expenseTrackingService.exportExpenseData(expenseRecords);
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-chi-tieu-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Đã xuất báo cáo chi tiêu');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Thống kê chi tiêu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Thống kê chi tiêu mua sắm
          </DialogTitle>
          <DialogDescription>
            Theo dõi và phân tích chi tiêu mua sắm theo thời gian
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Month/Year Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {Array.from({length: 3}, (_, i) => (
                  <option key={2024 + i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" onClick={exportMonthlyReport}>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>

          {expenseRecords.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-600">Tổng ngân sách</p>
                    <p className="text-lg font-bold text-blue-600">
                      {statistics.totalBudget.toLocaleString('vi-VN')}₫
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-gray-600">Chi tiêu thực tế</p>
                    <p className="text-lg font-bold text-green-600">
                      {statistics.totalActual.toLocaleString('vi-VN')}₫
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    {statistics.totalSavings >= 0 ? (
                      <TrendingDown className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    ) : (
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    )}
                    <p className="text-sm text-gray-600">
                      {statistics.totalSavings >= 0 ? 'Tiết kiệm' : 'Vượt ngân sách'}
                    </p>
                    <p className={`text-lg font-bold ${statistics.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(statistics.totalSavings).toLocaleString('vi-VN')}₫
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <PieChart className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm text-gray-600">Số lần mua</p>
                    <p className="text-lg font-bold text-purple-600">
                      {statistics.recordCount}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chi tiêu theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statistics.categoryStats.map(category => (
                      <div key={category.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-gray-600">{category.count} lần mua</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            Dự kiến: {category.budget.toLocaleString('vi-VN')}₫
                          </p>
                          <p className="text-sm">
                            Thực tế: {category.actual.toLocaleString('vi-VN')}₫
                          </p>
                          <Badge variant={category.savingsPercentage >= 0 ? "default" : "destructive"}>
                            {category.savingsPercentage >= 0 ? '+' : ''}{category.savingsPercentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lịch sử mua sắm</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {expenseRecords.map(record => (
                        <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {new Date(record.date).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {record.categories.length} danh mục
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              {record.actualSpent.toLocaleString('vi-VN')}₫ / {record.totalBudget.toLocaleString('vi-VN')}₫
                            </p>
                            <Badge variant={record.savings >= 0 ? "default" : "destructive"}>
                              {record.savings >= 0 ? 'Tiết kiệm' : 'Vượt'}: {Math.abs(record.savings).toLocaleString('vi-VN')}₫
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có dữ liệu chi tiêu
              </h3>
              <p className="text-gray-600">
                Tạo danh sách mua sắm và cập nhật chi phí thực tế để xem thống kê
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseStatistics;
