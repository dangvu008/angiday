// @ts-nocheck
/**
 * Utility functions for price formatting and calculations
 */

/**
 * Format price in Vietnamese Dong (VND)
 */
export const formatVNDPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Format price in compact format (e.g., 1.2M instead of 1,200,000)
 */
export const formatCompactPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
  return price.toString();
};

/**
 * Parse price string to number (handles VND format)
 */
export const parseVNDPrice = (priceString: string): number => {
  // Remove currency symbols and spaces
  const cleanString = priceString.replace(/[₫\s,]/g, '');
  return parseFloat(cleanString) || 0;
};

/**
 * Calculate percentage difference between two prices
 */
export const calculatePriceDifference = (originalPrice: number, newPrice: number): {
  difference: number;
  percentage: number;
  isIncrease: boolean;
} => {
  const difference = newPrice - originalPrice;
  const percentage = originalPrice > 0 ? (difference / originalPrice) * 100 : 0;
  
  return {
    difference,
    percentage: Math.abs(percentage),
    isIncrease: difference > 0
  };
};

/**
 * Estimate price based on ingredient category and market data
 */
export const estimateIngredientPrice = (ingredient: string, category: string): number => {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Base prices in VND per typical serving/portion
  const basePrices: { [key: string]: number } = {
    'Thịt': {
      'bò': 250000,
      'heo': 150000,
      'gà': 120000,
      'vịt': 180000,
      'default': 180000
    },
    'Hải sản': {
      'tôm': 200000,
      'cua': 300000,
      'cá': 100000,
      'mực': 150000,
      'default': 150000
    },
    'Rau củ': {
      'rau': 20000,
      'củ': 25000,
      'cà': 15000,
      'hành': 10000,
      'tỏi': 30000,
      'default': 20000
    },
    'Trái cây': {
      'táo': 40000,
      'cam': 30000,
      'chuối': 20000,
      'xoài': 50000,
      'default': 35000
    },
    'Sữa & Chế phẩm': {
      'sữa': 25000,
      'phô mai': 80000,
      'bơ': 60000,
      'kem': 45000,
      'default': 40000
    },
    'Ngũ cốc': {
      'gạo': 25000,
      'bún': 15000,
      'bánh': 20000,
      'mì': 18000,
      'default': 20000
    },
    'Gia vị': {
      'nước mắm': 25000,
      'tương': 20000,
      'dầu': 30000,
      'muối': 5000,
      'đường': 15000,
      'default': 15000
    }
  };

  const categoryPrices = basePrices[category];
  if (!categoryPrices) {
    return 30000; // Default price
  }

  // Find specific ingredient price
  for (const [key, price] of Object.entries(categoryPrices)) {
    if (key !== 'default' && lowerIngredient.includes(key)) {
      return price;
    }
  }

  return categoryPrices.default;
};

/**
 * Apply seasonal price adjustments
 */
export const applySeasonalAdjustment = (basePrice: number, ingredient: string, month: number): number => {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Seasonal adjustments (multipliers)
  const seasonalAdjustments: { [key: string]: { [month: number]: number } } = {
    'rau': {
      1: 1.2, 2: 1.2, 3: 0.9, 4: 0.8, 5: 0.8, 6: 0.9,
      7: 1.0, 8: 1.0, 9: 0.9, 10: 0.8, 11: 0.9, 12: 1.1
    },
    'trái': {
      1: 1.3, 2: 1.3, 3: 1.1, 4: 0.9, 5: 0.8, 6: 0.8,
      7: 0.9, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.2, 12: 1.3
    }
  };

  for (const [key, adjustments] of Object.entries(seasonalAdjustments)) {
    if (lowerIngredient.includes(key)) {
      const adjustment = adjustments[month] || 1.0;
      return Math.round(basePrice * adjustment);
    }
  }

  return basePrice;
};

/**
 * Calculate bulk discount
 */
export const calculateBulkDiscount = (basePrice: number, quantity: number): number => {
  if (quantity >= 5) {
    return basePrice * 0.85; // 15% discount for 5+ items
  } else if (quantity >= 3) {
    return basePrice * 0.9;  // 10% discount for 3+ items
  } else if (quantity >= 2) {
    return basePrice * 0.95; // 5% discount for 2+ items
  }
  
  return basePrice;
};

/**
 * Get price range for an ingredient
 */
export const getPriceRange = (ingredient: string, category: string): {
  min: number;
  max: number;
  average: number;
} => {
  const basePrice = estimateIngredientPrice(ingredient, category);
  
  return {
    min: Math.round(basePrice * 0.7),
    max: Math.round(basePrice * 1.3),
    average: basePrice
  };
};

/**
 * Format price difference with color coding
 */
export const formatPriceDifference = (difference: number): {
  text: string;
  color: string;
  isPositive: boolean;
} => {
  const isPositive = difference >= 0;
  const absValue = Math.abs(difference);
  
  return {
    text: `${isPositive ? '+' : '-'}${formatVNDPrice(absValue)}`,
    color: isPositive ? 'text-red-600' : 'text-green-600',
    isPositive
  };
};
