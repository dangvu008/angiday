import { useState } from 'react';
import { CalendarGrid } from '@/components/meal-planner/CalendarGrid';
import { MealPlanModal } from '@/components/meal-planner/MealPlanModal';
import { ShoppingList } from '@/components/meal-planner/ShoppingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ShoppingCart, Download } from 'lucide-react';

interface MealPlan {
  id: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeName: string;
  recipeId: string;
}

interface Recipe {
  id: string;
  title: string;
  cookTime: string;
  servings: number;
  image: string;
  difficulty: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  recipeNames: string[];
  checked: boolean;
}

export default function MealPlannerPage() {
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Thịt bò',
      amount: '500g',
      category: 'meat',
      recipeNames: ['Phở bò truyền thống'],
      checked: false
    },
    {
      id: '2',
      name: 'Hành tây',
      amount: '2 củ',
      category: 'vegetables',
      recipeNames: ['Phở bò truyền thống', 'Cơm rang dương châu'],
      checked: false
    },
    {
      id: '3',
      name: 'Gạo tẻ',
      amount: '1kg',
      category: 'grains',
      recipeNames: ['Cơm rang dương châu'],
      checked: true
    },
    {
      id: '4',
      name: 'Trứng gà',
      amount: '6 quả',
      category: 'dairy',
      recipeNames: ['Cơm rang dương châu'],
      checked: false
    },
    {
      id: '5',
      name: 'Hạt nêm',
      amount: '1 gói',
      category: 'spices',
      recipeNames: ['Phở bò truyền thống', 'Cơm rang dương châu'],
      checked: false
    }
  ]);

  const handleAddMeal = (date: Date, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setModalOpen(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      date: selectedDate,
      mealType: selectedMealType as any,
      recipeName: recipe.title,
      recipeId: recipe.id
    };

    setMealPlans([...mealPlans, newMealPlan]);
    toast({
      description: `Đã thêm "${recipe.title}" vào lịch thực đơn`,
    });
  };

  const handleRemoveMeal = (mealPlanId: string) => {
    const mealPlan = mealPlans.find(mp => mp.id === mealPlanId);
    setMealPlans(mealPlans.filter(mp => mp.id !== mealPlanId));
    
    if (mealPlan) {
      toast({
        description: `Đã xóa "${mealPlan.recipeName}" khỏi lịch thực đơn`,
      });
    }
  };

  const handleToggleShoppingItem = (itemId: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleExportShoppingList = () => {
    const uncheckedItems = shoppingItems.filter(item => !item.checked);
    const listText = uncheckedItems.map(item => 
      `- ${item.name}: ${item.amount} (${item.recipeNames.join(', ')})`
    ).join('\n');
    
    const blob = new Blob([`DANH SÁCH MUA HÀNG\n\n${listText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-mua-hang.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      description: "Đã xuất danh sách mua hàng thành công",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Lập kế hoạch thực đơn
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Tổ chức thực đơn hàng tuần của bạn một cách khoa học và tiết kiệm thời gian
          </p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Lịch thực đơn
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Danh sách mua hàng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarGrid
              mealPlans={mealPlans}
              onAddMeal={handleAddMeal}
              onRemoveMeal={handleRemoveMeal}
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-center text-blue-600">
                    {mealPlans.filter(mp => mp.mealType === 'breakfast').length}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Bữa sáng</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-center text-green-600">
                    {mealPlans.filter(mp => mp.mealType === 'lunch').length}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Bữa trưa</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-center text-purple-600">
                    {mealPlans.filter(mp => mp.mealType === 'dinner').length}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Bữa tối</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-center text-orange-600">
                    {mealPlans.filter(mp => mp.mealType === 'snack').length}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Bữa phụ</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shopping">
            <ShoppingList
              items={shoppingItems}
              onToggleItem={handleToggleShoppingItem}
              onExportList={handleExportShoppingList}
            />
          </TabsContent>
        </Tabs>

        <MealPlanModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          date={selectedDate}
          mealType={selectedMealType}
          onSelectRecipe={handleSelectRecipe}
        />
      </div>
    </div>
  );
}