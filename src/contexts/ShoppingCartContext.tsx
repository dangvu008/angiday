import React, { createContext, useContext, useState, useCallback } from 'react';
import { Recipe } from '@/types/kitchen';

export interface CartItem {
  id: string;
  type: 'recipe' | 'menu' | 'meal';
  name: string;
  ingredients: string[];
  servings?: number;
  metadata?: {
    category?: string;
    prepTime?: string;
    cookTime?: string;
    difficulty?: string;
    menuId?: string;
    mealDate?: string;
    mealType?: string;
  };
}

interface ShoppingCartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateServings: (itemId: string, servings: number) => void;
  getConsolidatedIngredients: () => { [category: string]: string[] };
  getTotalItems: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      // Add new item
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateServings = useCallback((itemId: string, servings: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, servings } : item
    ));
  }, []);

  const categorizeIngredient = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase();

    if (lowerIngredient.includes('thịt') || lowerIngredient.includes('bò') ||
        lowerIngredient.includes('heo') || lowerIngredient.includes('gà') ||
        lowerIngredient.includes('cá') || lowerIngredient.includes('tôm')) {
      return 'Thịt & Hải sản';
    }

    if (lowerIngredient.includes('rau') || lowerIngredient.includes('củ') ||
        lowerIngredient.includes('cà chua') || lowerIngredient.includes('hành')) {
      return 'Rau củ';
    }

    if (lowerIngredient.includes('sữa') || lowerIngredient.includes('trứng') ||
        lowerIngredient.includes('phô mai')) {
      return 'Sữa & Trứng';
    }

    if (lowerIngredient.includes('gạo') || lowerIngredient.includes('bún') ||
        lowerIngredient.includes('bánh') || lowerIngredient.includes('mì')) {
      return 'Ngũ cốc';
    }

    return 'Nguyên liệu khác';
  };

  const getConsolidatedIngredients = useCallback(() => {
    const ingredientMap: { [category: string]: Set<string> } = {};

    cartItems.forEach(item => {
      item.ingredients.forEach(ingredient => {
        const category = categorizeIngredient(ingredient);
        if (!ingredientMap[category]) {
          ingredientMap[category] = new Set();
        }
        ingredientMap[category].add(ingredient);
      });
    });

    // Convert Sets to Arrays
    const result: { [category: string]: string[] } = {};
    Object.entries(ingredientMap).forEach(([category, ingredientSet]) => {
      result[category] = Array.from(ingredientSet);
    });

    return result;
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateServings,
    getConsolidatedIngredients,
    getTotalItems
  };

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};