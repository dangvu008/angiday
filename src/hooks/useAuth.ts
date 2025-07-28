import { useState, useEffect } from 'react';
import { authService, User } from '@/services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const user = await authService.register(userData);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    isChef: authService.isChef(),
    login,
    logout,
    register,
    updateProfile,
    // Permission helpers
    canEditMenu: (menuCreatedBy: string) => authService.canEditMenu(menuCreatedBy),
    canDeleteMenu: (menuCreatedBy: string) => authService.canDeleteMenu(menuCreatedBy),
    canAddRecipeToMenu: (menuCreatedBy: string) => authService.canAddRecipeToMenu(menuCreatedBy),
    canAddMenuToPersonalPlan: () => authService.canAddMenuToPersonalPlan(),
  };
};
