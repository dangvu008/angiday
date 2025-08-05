// VND Price Validation and Formatting Utilities
// Tiện ích validation và format giá tiền VND

import { VNDPriceValidation } from '@/services/kitchenService';

/**
 * Validate và format giá tiền VND
 * @param input - Input string từ user
 * @returns VNDPriceValidation object
 */
export function validateVNDPrice(input: string): VNDPriceValidation {
  // Remove all non-digit characters except decimal point
  const cleanInput = input.replace(/[^\d.]/g, '');
  
  if (!cleanInput || cleanInput === '.') {
    return {
      isValid: false,
      formattedPrice: '0 ₫',
      numericValue: 0,
      suggestions: ['1.000 ₫', '10.000 ₫', '100.000 ₫']
    };
  }

  const numericValue = parseFloat(cleanInput);
  
  if (isNaN(numericValue) || numericValue < 0) {
    return {
      isValid: false,
      formattedPrice: '0 ₫',
      numericValue: 0,
      suggestions: ['1.000 ₫', '10.000 ₫', '100.000 ₫']
    };
  }

  // Round to nearest 100 VND (common practice in Vietnam)
  const roundedValue = Math.round(numericValue / 100) * 100;
  
  return {
    isValid: true,
    formattedPrice: formatVNDPrice(roundedValue),
    numericValue: roundedValue,
    suggestions: generatePriceSuggestions(roundedValue)
  };
}

/**
 * Format số thành định dạng VND
 * @param amount - Số tiền
 * @returns Formatted string
 */
export function formatVNDPrice(amount: number): string {
  if (amount === 0) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generate price suggestions với số 0 đằng sau
 * @param baseAmount - Số tiền cơ sở
 * @returns Array of suggestion strings
 */
export function generatePriceSuggestions(baseAmount: number): string[] {
  if (baseAmount === 0) {
    return ['1.000 ₫', '10.000 ₫', '100.000 ₫'];
  }

  const suggestions: string[] = [];
  
  // Nếu số nhỏ hơn 1000, gợi ý thêm số 0
  if (baseAmount < 1000) {
    suggestions.push(formatVNDPrice(baseAmount * 10));
    suggestions.push(formatVNDPrice(baseAmount * 100));
    suggestions.push(formatVNDPrice(baseAmount * 1000));
  } else if (baseAmount < 10000) {
    suggestions.push(formatVNDPrice(baseAmount * 10));
    suggestions.push(formatVNDPrice(baseAmount * 100));
  } else if (baseAmount < 100000) {
    suggestions.push(formatVNDPrice(baseAmount * 10));
  }

  // Thêm một số gợi ý phổ biến
  const commonPrices = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];
  commonPrices.forEach(price => {
    if (price !== baseAmount && !suggestions.includes(formatVNDPrice(price))) {
      suggestions.push(formatVNDPrice(price));
    }
  });

  return suggestions.slice(0, 3); // Chỉ trả về 3 gợi ý đầu tiên
}

/**
 * Parse VND string thành số
 * @param vndString - String có format VND
 * @returns Numeric value
 */
export function parseVNDString(vndString: string): number {
  const cleanString = vndString.replace(/[^\d]/g, '');
  return parseInt(cleanString) || 0;
}

/**
 * Detect current meal time based on current hour
 * @returns Current meal time
 */
export function getCurrentMealTime(): 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'none' {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 10) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 14) {
    return 'lunch';
  } else if (hour >= 17 && hour < 21) {
    return 'dinner';
  } else if ((hour >= 14 && hour < 17) || (hour >= 21 && hour < 23)) {
    return 'snack';
  } else {
    return 'none';
  }
}

/**
 * Get meal time display name in Vietnamese
 * @param mealTime - Meal time
 * @returns Vietnamese display name
 */
export function getMealTimeDisplayName(mealTime: string): string {
  const mealNames: Record<string, string> = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa', 
    dinner: 'Bữa tối',
    snack: 'Bữa phụ',
    none: 'Không xác định'
  };
  
  return mealNames[mealTime] || 'Không xác định';
}

/**
 * Calculate total cost from shopping items
 * @param items - Array of shopping items
 * @param useActualPrice - Use actual price if available, otherwise estimated
 * @returns Total cost
 */
export function calculateTotalCost(
  items: Array<{ estimatedPrice?: number; actualPrice?: number }>,
  useActualPrice: boolean = false
): number {
  return items.reduce((total, item) => {
    const price = useActualPrice && item.actualPrice !== undefined 
      ? item.actualPrice 
      : (item.estimatedPrice || 0);
    return total + price;
  }, 0);
}

/**
 * Group shopping items by category and calculate costs
 * @param items - Array of shopping items
 * @returns Category breakdown
 */
export function calculateCategoryBreakdown(
  items: Array<{ 
    category: string; 
    estimatedPrice?: number; 
    actualPrice?: number; 
  }>,
  useActualPrice: boolean = false
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  items.forEach(item => {
    const price = useActualPrice && item.actualPrice !== undefined 
      ? item.actualPrice 
      : (item.estimatedPrice || 0);
    
    if (!breakdown[item.category]) {
      breakdown[item.category] = 0;
    }
    breakdown[item.category] += price;
  });
  
  return breakdown;
}

/**
 * Format period value for statistics
 * @param date - Date object
 * @param periodType - Type of period
 * @returns Formatted period value
 */
export function formatPeriodValue(date: Date, periodType: 'daily' | 'weekly' | 'monthly' | 'yearly'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (periodType) {
    case 'daily':
      return `${year}-${month}-${day}`;
    case 'weekly':
      // Get week number
      const weekNumber = getWeekNumber(date);
      return `${year}-W${String(weekNumber).padStart(2, '0')}`;
    case 'monthly':
      return `${year}-${month}`;
    case 'yearly':
      return String(year);
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Get week number of the year
 * @param date - Date object
 * @returns Week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
