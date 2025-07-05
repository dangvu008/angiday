
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import RecipeModal from './RecipeModal';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: number;
  title: string;
  category: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  cookingTime: string;
  servings: number;
  author: string;
  status: 'published' | 'draft';
  createdDate: string;
  views: number;
}

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: 'Phở Bò Truyền Thống',
      category: 'Món chính',
      difficulty: 'Khó',
      cookingTime: '3 giờ',
      servings: 4,
      author: 'Chef Nguyễn',
      status: 'published',
      createdDate: '2024-01-15',
      views: 2450
    },
    {
      id: 2,
      title: 'Salad Trái Cây Healthy',
      category: 'Tráng miệng',
      difficulty: 'Dễ',
      cookingTime: '15 phút',
      servings: 2,
      author: 'Admin',
      status: 'published',
      createdDate: '2024-01-12',
      views: 1230
    },
    {
      id: 3,
      title: 'Bánh Mì Sandwich',
      category: 'Món phụ',
      difficulty: 'Trung bình',
      cookingTime: '30 phút',
      servings: 2,
      author: 'Chef Mai',
      status: 'draft',
      createdDate: '2024-01-18',
      views: 0
    },
  ]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedRecipe(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa công thức thành công",
      });
    }
  };

  const handleSave = (recipeData: any) => {
    if (modalMode === 'add') {
      const newRecipe = {
        ...recipeData,
        id: Math.max(...recipes.map(r => r.id)) + 1,
        createdDate: new Date().toISOString().split('T')[0],
        views: 0
      };
      setRecipes([...recipes, newRecipe]);
      toast({
        title: "Thành công",
        description: "Đã thêm công thức mới thành công",
      });
    } else {
      setRecipes(recipes.map(recipe => 
        recipe.id === selectedRecipe?.id ? { ...recipe, ...recipeData } : recipe
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật công thức thành công",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' ? (
      <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Dễ': 'bg-green-100 text-green-800',
      'Trung bình': 'bg-yellow-100 text-yellow-800',
      'Khó': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {difficulty}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý công thức</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm công thức
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm công thức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Recipes Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên món</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Độ khó</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell>{recipe.category}</TableCell>
                  <TableCell>{getDifficultyBadge(recipe.difficulty)}</TableCell>
                  <TableCell>{recipe.cookingTime}</TableCell>
                  <TableCell>{getStatusBadge(recipe.status)}</TableCell>
                  <TableCell>{recipe.author}</TableCell>
                  <TableCell>{recipe.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(recipe)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        recipe={selectedRecipe}
        mode={modalMode}
      />
    </div>
  );
};

export default RecipeManagement;
