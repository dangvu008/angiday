// @ts-nocheck
import { getSupabaseClient } from '@/config/supabase';

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tags: string[];
  image_url?: string;
  user_id?: string;
  is_public: boolean;
  source: 'user' | 'system' | 'imported';
  rating: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface RecipeCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeCollectionItem {
  id: string;
  collection_id: string;
  recipe_id: string;
  added_at: string;
}

export class RecipeManagementService {
  // Recipe CRUD operations
  async getRecipes(filters?: {
    user_id?: string;
    is_public?: boolean;
    source?: string;
    difficulty?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Recipe[]> {
    try {
      const supabase = getSupabaseClient();
      let query = supabase
        .from('recipes')
        .select('*');

      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters?.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      if (filters?.source) {
        query = query.eq('source', filters.source);
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecipes:', error);
      throw error;
    }
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getRecipe:', error);
      throw error;
    }
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();

      if (error) {
        console.error('Error creating recipe:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createRecipe:', error);
      throw error;
    }
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating recipe:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateRecipe:', error);
      throw error;
    }
  }

  async deleteRecipe(id: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recipe:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteRecipe:', error);
      throw error;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.rpc('increment_recipe_views', { recipe_id: id });

      if (error) {
        console.error('Error incrementing views:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in incrementViews:', error);
      throw error;
    }
  }

  // Favorites management
  async getUserFavorites(userId: string): Promise<Recipe[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          recipe_id,
          recipes (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user favorites:', error);
        throw error;
      }

      return data?.map(item => item.recipes).filter(Boolean) || [];
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      throw error;
    }
  }

  async addToFavorites(userId: string, recipeId: string): Promise<UserFavorite> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: userId, recipe_id: recipeId }])
        .select()
        .single();

      if (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addToFavorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId: string, recipeId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);

      if (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in removeFromFavorites:', error);
      throw error;
    }
  }

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking favorite status:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isFavorite:', error);
      throw error;
    }
  }

  // Recipe Collections
  async getUserCollections(userId: string): Promise<RecipeCollection[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipe_collections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user collections:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserCollections:', error);
      throw error;
    }
  }

  async createCollection(collection: Omit<RecipeCollection, 'id' | 'created_at' | 'updated_at'>): Promise<RecipeCollection> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipe_collections')
        .insert([collection])
        .select()
        .single();

      if (error) {
        console.error('Error creating collection:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCollection:', error);
      throw error;
    }
  }

  async getCollectionRecipes(collectionId: string): Promise<Recipe[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipe_collection_items')
        .select(`
          recipe_id,
          recipes (*)
        `)
        .eq('collection_id', collectionId)
        .order('added_at', { ascending: false });

      if (error) {
        console.error('Error fetching collection recipes:', error);
        throw error;
      }

      return data?.map(item => item.recipes).filter(Boolean) || [];
    } catch (error) {
      console.error('Error in getCollectionRecipes:', error);
      throw error;
    }
  }

  async addRecipeToCollection(collectionId: string, recipeId: string): Promise<RecipeCollectionItem> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('recipe_collection_items')
        .insert([{ collection_id: collectionId, recipe_id: recipeId }])
        .select()
        .single();

      if (error) {
        console.error('Error adding recipe to collection:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addRecipeToCollection:', error);
      throw error;
    }
  }

  async removeRecipeFromCollection(collectionId: string, recipeId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('recipe_collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('recipe_id', recipeId);

      if (error) {
        console.error('Error removing recipe from collection:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in removeRecipeFromCollection:', error);
      throw error;
    }
  }

  // Get recipes used in meal plans
  async getRecipesFromMealPlans(userId: string): Promise<Recipe[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('meals')
        .select(`
          recipe_id,
          recipes (*),
          meal_plans!inner (user_id)
        `)
        .eq('meal_plans.user_id', userId)
        .not('recipe_id', 'is', null);

      if (error) {
        console.error('Error fetching recipes from meal plans:', error);
        throw error;
      }

      // Remove duplicates and return unique recipes
      const uniqueRecipes = new Map();
      data?.forEach(item => {
        if (item.recipes && !uniqueRecipes.has(item.recipe_id)) {
          uniqueRecipes.set(item.recipe_id, item.recipes);
        }
      });

      return Array.from(uniqueRecipes.values());
    } catch (error) {
      console.error('Error in getRecipesFromMealPlans:', error);
      throw error;
    }
  }
}

export const recipeManagementService = new RecipeManagementService();
