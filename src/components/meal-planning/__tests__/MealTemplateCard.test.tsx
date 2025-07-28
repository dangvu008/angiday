import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MealTemplateCard from '../MealTemplateCard';
import { MealTemplate } from '@/types/meal-planning';

// Mock the services
jest.mock('@/services/template-library.service', () => ({
  templateLibraryService: {
    incrementUsageCount: jest.fn()
  }
}));

// Mock the UI components
jest.mock('@/components/ui/animated-transitions', () => ({
  HoverAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BounceAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/components/ui/feedback', () => ({
  SuccessAnimation: () => <div data-testid="success-animation">Success!</div>
}));

const mockTemplate: MealTemplate = {
  id: 'test-template-1',
  name: 'Test Meal Template',
  description: 'A test meal template for testing purposes',
  type: 'lunch',
  dishes: [
    {
      id: 'dish-1',
      name: 'Test Dish',
      image: 'test-dish.jpg',
      calories: 300,
      cost: 50000,
      cookingTime: 30,
      servings: 2,
      difficulty: 'medium',
      cuisine: 'Vietnamese',
      category: 'main',
      tags: ['healthy', 'quick'],
      ingredients: [],
      instructions: [],
      nutrition: {
        protein: 20,
        carbs: 40,
        fat: 10,
        fiber: 5
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ],
  totalCalories: 300,
  totalCost: 50000,
  servings: 2,
  tags: ['healthy', 'quick', 'family'],
  difficulty: 'medium',
  cookingTime: 30,
  nutrition: {
    protein: 20,
    carbs: 40,
    fat: 10,
    fiber: 5
  },
  isPublic: false,
  createdBy: 'test-user',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  category: 'family',
  cuisine: 'Vietnamese',
  usageCount: 5,
  rating: 4.5,
  reviews: 10
};

const renderWithDnd = (component: React.ReactElement) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('MealTemplateCard', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Grid View', () => {
    it('renders template information correctly', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Meal Template')).toBeInTheDocument();
      expect(screen.getByText('A test meal template for testing purposes')).toBeInTheDocument();
      expect(screen.getByText('300 cal')).toBeInTheDocument();
      expect(screen.getByText('50k')).toBeInTheDocument();
      expect(screen.getByText('30p')).toBeInTheDocument();
      expect(screen.getByText('2 phần')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('Dùng 5 lần')).toBeInTheDocument();
    });

    it('displays difficulty badge correctly', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Trung bình')).toBeInTheDocument();
    });

    it('displays meal type badge correctly', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Trưa')).toBeInTheDocument();
    });

    it('displays tags correctly', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('healthy')).toBeInTheDocument();
      expect(screen.getByText('quick')).toBeInTheDocument();
      expect(screen.getByText('family')).toBeInTheDocument();
    });

    it('shows limited tags with overflow indicator', () => {
      const templateWithManyTags = {
        ...mockTemplate,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
      };

      renderWithDnd(
        <MealTemplateCard
          template={templateWithManyTags}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('handles selection in normal mode', async () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
          selectionMode={false}
        />
      );

      const useButton = screen.getByRole('button', { name: /dùng/i });
      fireEvent.click(useButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(mockTemplate);
      });
    });

    it('handles selection in selection mode', async () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
          selectionMode={true}
        />
      );

      const selectButton = screen.getByRole('button', { name: /chọn template/i });
      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(mockTemplate);
      });
    });

    it('shows success animation after selection', async () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      const useButton = screen.getByRole('button', { name: /dùng/i });
      fireEvent.click(useButton);

      await waitFor(() => {
        expect(screen.getByTestId('success-animation')).toBeInTheDocument();
      });
    });
  });

  describe('List View', () => {
    it('renders template information in list format', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="list"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Meal Template')).toBeInTheDocument();
      expect(screen.getByText('300 cal')).toBeInTheDocument();
      expect(screen.getByText('50k')).toBeInTheDocument();
      expect(screen.getByText('30 phút')).toBeInTheDocument();
      expect(screen.getByText('2 phần')).toBeInTheDocument();
    });

    it('displays all badges in list view', () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="list"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Trưa')).toBeInTheDocument();
      expect(screen.getByText('Trung bình')).toBeInTheDocument();
    });

    it('handles selection in list view', async () => {
      renderWithDnd(
        <MealTemplateCard
          template={mockTemplate}
          viewMode="list"
          onSelect={mockOnSelect}
          selectionMode={false}
        />
      );

      const buttons = screen.getAllByRole('button');
      const useButton = buttons.find(button => 
        button.querySelector('svg') && !button.querySelector('svg')?.classList.contains('lucide-eye')
      );
      
      if (useButton) {
        fireEvent.click(useButton);
        await waitFor(() => {
          expect(mockOnSelect).toHaveBeenCalledWith(mockTemplate);
        });
      }
    });
  });

  describe('Difficulty and Type Mapping', () => {
    it('maps difficulty levels correctly', () => {
      const easyTemplate = { ...mockTemplate, difficulty: 'easy' as const };
      const hardTemplate = { ...mockTemplate, difficulty: 'hard' as const };

      const { rerender } = renderWithDnd(
        <MealTemplateCard
          template={easyTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Dễ')).toBeInTheDocument();

      rerender(
        <DndProvider backend={HTML5Backend}>
          <MealTemplateCard
            template={hardTemplate}
            viewMode="grid"
            onSelect={mockOnSelect}
          />
        </DndProvider>
      );

      expect(screen.getByText('Khó')).toBeInTheDocument();
    });

    it('maps meal types correctly', () => {
      const breakfastTemplate = { ...mockTemplate, type: 'breakfast' as const };
      const dinnerTemplate = { ...mockTemplate, type: 'dinner' as const };
      const snackTemplate = { ...mockTemplate, type: 'snack' as const };

      const { rerender } = renderWithDnd(
        <MealTemplateCard
          template={breakfastTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Sáng')).toBeInTheDocument();

      rerender(
        <DndProvider backend={HTML5Backend}>
          <MealTemplateCard
            template={dinnerTemplate}
            viewMode="grid"
            onSelect={mockOnSelect}
          />
        </DndProvider>
      );

      expect(screen.getByText('Tối')).toBeInTheDocument();

      rerender(
        <DndProvider backend={HTML5Backend}>
          <MealTemplateCard
            template={snackTemplate}
            viewMode="grid"
            onSelect={mockOnSelect}
          />
        </DndProvider>
      );

      expect(screen.getByText('Phụ')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles template without description', () => {
      const templateWithoutDescription = {
        ...mockTemplate,
        description: ''
      };

      renderWithDnd(
        <MealTemplateCard
          template={templateWithoutDescription}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Meal Template')).toBeInTheDocument();
      expect(screen.queryByText('A test meal template for testing purposes')).not.toBeInTheDocument();
    });

    it('handles template without tags', () => {
      const templateWithoutTags = {
        ...mockTemplate,
        tags: []
      };

      renderWithDnd(
        <MealTemplateCard
          template={templateWithoutTags}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Meal Template')).toBeInTheDocument();
      expect(screen.queryByText('healthy')).not.toBeInTheDocument();
    });

    it('handles zero ratings and usage count', () => {
      const newTemplate = {
        ...mockTemplate,
        rating: 0,
        usageCount: 0,
        reviews: 0
      };

      renderWithDnd(
        <MealTemplateCard
          template={newTemplate}
          viewMode="grid"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('0.0')).toBeInTheDocument();
      expect(screen.getByText('Dùng 0 lần')).toBeInTheDocument();
    });
  });
});
