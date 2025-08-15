import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Plus, 
  FileText, 
  Link,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ImportRecipeModal from './ImportRecipeModal';
import { toast } from 'sonner';

interface RecipeImportButtonProps {
  onImport: (recipe: any) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showDropdown?: boolean;
}

const RecipeImportButton: React.FC<RecipeImportButtonProps> = ({
  onImport,
  variant = 'default',
  size = 'default',
  className = '',
  showDropdown = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<'url' | 'text' | 'file'>('url');

  const handleImport = (recipe: any) => {
    onImport(recipe);
    setIsModalOpen(false);
  };

  const handleQuickImport = (mode: 'url' | 'text' | 'file') => {
    setImportMode(mode);
    setIsModalOpen(true);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.type === 'application/json') {
          // Handle JSON import
          const jsonData = JSON.parse(content);
          const recipe = {
            id: Date.now().toString(),
            title: jsonData.title || jsonData.name || 'Công thức mới',
            description: jsonData.description || '',
            ingredients: jsonData.ingredients || [],
            instructions: jsonData.instructions || jsonData.steps || [],
            cookTime: jsonData.cookTime || '30 phút',
            servings: jsonData.servings || 2,
            difficulty: jsonData.difficulty || 'Trung bình',
            category: jsonData.category || 'Món chính',
            image: jsonData.image,
            calories: jsonData.calories || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          onImport(recipe);
          toast.success('Đã nhập công thức từ file JSON');
        } else {
          // Handle text file
          setImportMode('text');
          setIsModalOpen(true);
        }
      } catch (error) {
        toast.error('Không thể đọc file này');
      }
    };
    
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      toast.error('Chỉ hỗ trợ file JSON hoặc text');
    }
    
    // Reset input
    event.target.value = '';
  };

  if (!showDropdown) {
    return (
      <>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant={variant}
          size={size}
          className={className}
        >
          <Download className="h-4 w-4 mr-2" />
          Nhập công thức
        </Button>
        
        <ImportRecipeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImport={handleImport}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Download className="h-4 w-4 mr-2" />
            Nhập công thức
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Nhập từ nguồn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleQuickImport('url')}>
            <Link className="h-4 w-4 mr-2" />
            Từ URL trang web
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleQuickImport('text')}>
            <FileText className="h-4 w-4 mr-2" />
            Từ văn bản
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Từ file
              <input
                type="file"
                accept=".json,.txt,.doc,.docx"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tất cả tùy chọn
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />
    </>
  );
};

export default RecipeImportButton;
