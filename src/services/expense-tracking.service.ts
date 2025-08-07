import { ExpenseRecord, ExpenseCategory, ExpenseItem, ShoppingList } from '@/types/meal-planning';

export class ExpenseTrackingService {
  private static instance: ExpenseTrackingService;
  private readonly STORAGE_KEY = 'expense-records';

  static getInstance(): ExpenseTrackingService {
    if (!ExpenseTrackingService.instance) {
      ExpenseTrackingService.instance = new ExpenseTrackingService();
    }
    return ExpenseTrackingService.instance;
  }

  // Save expense record
  async saveExpenseRecord(record: ExpenseRecord): Promise<void> {
    try {
      const existingRecords = this.getAllExpenseRecords();
      const updatedRecords = existingRecords.filter(r => r.id !== record.id);
      updatedRecords.push(record);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Error saving expense record:', error);
      throw new Error('Không thể lưu bản ghi chi tiêu');
    }
  }

  // Get all expense records
  getAllExpenseRecords(): ExpenseRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading expense records:', error);
      return [];
    }
  }

  // Get expense records by date range
  getExpenseRecordsByDateRange(startDate: string, endDate: string): ExpenseRecord[] {
    const allRecords = this.getAllExpenseRecords();
    return allRecords.filter(record => 
      record.date >= startDate && record.date <= endDate
    );
  }

  // Get expense records by month
  getExpenseRecordsByMonth(year: number, month: number): ExpenseRecord[] {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    return this.getExpenseRecordsByDateRange(startDate, endDate);
  }

  // Get expense statistics
  getExpenseStatistics(records: ExpenseRecord[]) {
    const totalBudget = records.reduce((sum, record) => sum + record.totalBudget, 0);
    const totalActual = records.reduce((sum, record) => sum + record.actualSpent, 0);
    const totalSavings = records.reduce((sum, record) => sum + record.savings, 0);
    
    const categoryStats = new Map<string, { budget: number; actual: number; count: number }>();
    
    records.forEach(record => {
      record.categories.forEach(category => {
        const existing = categoryStats.get(category.category) || { budget: 0, actual: 0, count: 0 };
        categoryStats.set(category.category, {
          budget: existing.budget + category.budgetAmount,
          actual: existing.actual + category.actualAmount,
          count: existing.count + 1
        });
      });
    });

    return {
      totalBudget,
      totalActual,
      totalSavings,
      savingsPercentage: totalBudget > 0 ? (totalSavings / totalBudget) * 100 : 0,
      recordCount: records.length,
      categoryStats: Array.from(categoryStats.entries()).map(([category, stats]) => ({
        category,
        ...stats,
        savingsPercentage: stats.budget > 0 ? ((stats.budget - stats.actual) / stats.budget) * 100 : 0
      }))
    };
  }

  // Create expense record from shopping list
  createExpenseRecord(
    shoppingList: ShoppingList, 
    userId: string, 
    actualTotalCost?: number
  ): ExpenseRecord {
    const categories = this.generateExpenseCategories(shoppingList, actualTotalCost);
    const actualSpent = actualTotalCost || shoppingList.totalCost;
    
    return {
      id: `expense-${shoppingList.id}-${Date.now()}`,
      shoppingListId: shoppingList.id,
      userId,
      date: new Date().toISOString().split('T')[0],
      totalBudget: shoppingList.totalCost,
      actualSpent,
      savings: shoppingList.totalCost - actualSpent,
      categories,
      notes: `Tạo từ danh sách mua sắm lúc ${new Date().toLocaleString('vi-VN')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private generateExpenseCategories(shoppingList: ShoppingList, actualTotalCost?: number): ExpenseCategory[] {
    const categoryMap = new Map<string, ExpenseItem[]>();
    
    shoppingList.items.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      
      const expenseItem: ExpenseItem = {
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        estimatedCost: item.estimatedCost,
        actualCost: item.estimatedCost, // Will be proportionally adjusted if actualTotalCost provided
      };
      
      categoryMap.get(item.category)!.push(expenseItem);
    });

    // If actualTotalCost is provided, proportionally adjust item costs
    if (actualTotalCost && actualTotalCost !== shoppingList.totalCost) {
      const ratio = actualTotalCost / shoppingList.totalCost;
      categoryMap.forEach(items => {
        items.forEach(item => {
          item.actualCost = Math.round(item.estimatedCost * ratio);
        });
      });
    }
    
    return Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      budgetAmount: items.reduce((sum, item) => sum + item.estimatedCost, 0),
      actualAmount: items.reduce((sum, item) => sum + item.actualCost, 0),
      items
    }));
  }

  // Export expense data for external analysis
  exportExpenseData(records: ExpenseRecord[]): string {
    const stats = this.getExpenseStatistics(records);
    
    const content = [
      'BÁO CÁO CHI TIÊU MUA SẮM',
      '========================',
      '',
      `Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`,
      `Số lần mua sắm: ${stats.recordCount}`,
      `Tổng ngân sách: ${stats.totalBudget.toLocaleString('vi-VN')}₫`,
      `Tổng chi tiêu: ${stats.totalActual.toLocaleString('vi-VN')}₫`,
      `Tổng tiết kiệm: ${stats.totalSavings.toLocaleString('vi-VN')}₫ (${stats.savingsPercentage.toFixed(1)}%)`,
      '',
      'CHI TIẾT THEO DANH MỤC:',
      '----------------------',
      ...stats.categoryStats.map(cat => 
        `${cat.category}: Dự kiến ${cat.budget.toLocaleString('vi-VN')}₫ | Thực tế ${cat.actual.toLocaleString('vi-VN')}₫ | Tiết kiệm ${cat.savingsPercentage.toFixed(1)}%`
      ),
      '',
      'CHI TIẾT TỪNG LẦN MUA:',
      '---------------------',
      ...records.map(record => [
        `📅 ${new Date(record.date).toLocaleDateString('vi-VN')}:`,
        `   Dự kiến: ${record.totalBudget.toLocaleString('vi-VN')}₫`,
        `   Thực tế: ${record.actualSpent.toLocaleString('vi-VN')}₫`,
        `   Tiết kiệm: ${record.savings.toLocaleString('vi-VN')}₫`,
        ''
      ]).flat()
    ].join('\n');

    return content;
  }

  // Delete expense record
  async deleteExpenseRecord(recordId: string): Promise<void> {
    try {
      const existingRecords = this.getAllExpenseRecords();
      const updatedRecords = existingRecords.filter(r => r.id !== recordId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Error deleting expense record:', error);
      throw new Error('Không thể xóa bản ghi chi tiêu');
    }
  }
}

export const expenseTrackingService = ExpenseTrackingService.getInstance();
