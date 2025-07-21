import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Users } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  note?: string;
}

interface ServingConverterProps {
  originalServings: number;
  ingredients: Ingredient[];
  onServingsChange?: (newServings: number, convertedIngredients: Ingredient[]) => void;
}

export const ServingConverter = ({ 
  originalServings, 
  ingredients, 
  onServingsChange 
}: ServingConverterProps) => {
  const [currentServings, setCurrentServings] = useState(originalServings);

  const convertAmount = (originalAmount: string, ratio: number): string => {
    // Tách số và đơn vị từ string amount
    const match = originalAmount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    
    if (match) {
      const number = parseFloat(match[1]);
      const unit = match[2];
      const convertedNumber = (number * ratio).toFixed(1);
      
      // Loại bỏ .0 nếu là số nguyên
      const cleanNumber = convertedNumber.endsWith('.0') 
        ? convertedNumber.slice(0, -2) 
        : convertedNumber;
      
      return unit ? `${cleanNumber} ${unit}` : cleanNumber;
    }
    
    return originalAmount; // Trả về nguyên bản nếu không parse được
  };

  const handleServingsChange = (newServings: number) => {
    if (newServings < 1) return;
    
    setCurrentServings(newServings);
    const ratio = newServings / originalServings;
    
    const convertedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      amount: convertAmount(ingredient.amount, ratio)
    }));
    
    onServingsChange?.(newServings, convertedIngredients);
  };

  const ratio = currentServings / originalServings;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Chuyển đổi khẩu phần
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleServingsChange(currentServings - 1)}
            disabled={currentServings <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <Input
              type="number"
              value={currentServings}
              onChange={(e) => handleServingsChange(parseInt(e.target.value) || 1)}
              className="w-20 text-center"
              min="1"
            />
            <div className="text-sm text-muted-foreground mt-1">người</div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleServingsChange(currentServings + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {ratio !== 1 && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Nguyên liệu đã được điều chỉnh cho <strong>{currentServings} người</strong>
              {ratio > 1 ? ` (tăng ${(ratio * 100 - 100).toFixed(0)}%)` : ` (giảm ${(100 - ratio * 100).toFixed(0)}%)`}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Nguyên liệu đã chuyển đổi:</h4>
          <ul className="space-y-2 text-sm">
            {ingredients.slice(0, 5).map((ingredient, index) => (
              <li key={index} className="flex justify-between">
                <span>{ingredient.name}</span>
                <span className="font-medium">
                  {convertAmount(ingredient.amount, ratio)}
                </span>
              </li>
            ))}
            {ingredients.length > 5 && (
              <li className="text-muted-foreground">
                ... và {ingredients.length - 5} nguyên liệu khác
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};