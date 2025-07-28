import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    dietaryRestrictions: string[];
    allergies: string[];
    favoriteCategories: string[];
    nutritionGoals: {
      dailyCalories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  subscription?: {
    type: 'free' | 'premium';
    expiresAt?: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Seed demo accounts
const seedDemoAccounts = () => {
  const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  console.log('🌱 Seeding demo accounts. Current users:', existingUsers.length);

  if (existingUsers.length === 0) {
    const demoAccounts = [
      {
        email: 'demo@angiday.com',
        password: '123456',
        userData: {
          id: 'demo-1',
          email: 'demo@angiday.com',
          name: 'Demo User',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=f97316&color=fff',
          preferences: {
            dietaryRestrictions: [],
            allergies: [],
            favoriteCategories: ['vietnamese', 'healthy'],
            nutritionGoals: {
              dailyCalories: 2000,
              protein: 20,
              carbs: 50,
              fat: 30
            }
          },
          subscription: {
            type: 'free' as const
          },
          createdAt: new Date().toISOString()
        }
      },
      {
        email: 'admin@angiday.com',
        password: 'admin123',
        userData: {
          id: 'admin-1',
          email: 'admin@angiday.com',
          name: 'Admin User',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff',
          preferences: {
            dietaryRestrictions: [],
            allergies: [],
            favoriteCategories: ['all'],
            nutritionGoals: {
              dailyCalories: 2200,
              protein: 25,
              carbs: 45,
              fat: 30
            }
          },
          subscription: {
            type: 'premium' as const
          },
          createdAt: new Date().toISOString()
        }
      }
    ];

    localStorage.setItem('registered_users', JSON.stringify(demoAccounts));
    console.log('✅ Demo accounts created:', demoAccounts.map(acc => ({ email: acc.email, password: acc.password })));
  } else {
    console.log('📋 Demo accounts already exist:', existingUsers.map((u: any) => ({ email: u.email, password: u.password })));
  }
};

// Force recreate demo accounts (for debugging)
const forceRecreateDemoAccounts = () => {
  localStorage.removeItem('registered_users');
  seedDemoAccounts();
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force recreate demo accounts for debugging
    forceRecreateDemoAccounts();
    checkAuthStatus();

    // Auto-login demo user for testing
    const autoLoginDemo = async () => {
      const storedUser = localStorage.getItem('auth_user');
      if (!storedUser) {
        console.log('🔄 Auto-logging in demo user for testing...');
        try {
          await login('demo@angiday.com', '123456');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };

    setTimeout(autoLoginDemo, 1000); // Delay to ensure demo accounts are created
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        // In a real app, you would validate the token with your backend
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in "database" (localStorage)
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      console.log('🔍 Checking login for:', email);
      console.log('📋 Available users:', registeredUsers.map((u: any) => ({ email: u.email, password: u.password })));

      const existingUser = registeredUsers.find((u: any) => {
        console.log(`Comparing: "${u.email}" === "${email}" && "${u.password}" === "${password}"`);
        return u.email === email && u.password === password;
      });

      if (!existingUser) {
        console.error('❌ User not found or password mismatch');
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      console.log('✅ Login successful for:', existingUser.email);

      // Use stored user data
      const userData = existingUser.userData;

      // Store user data and token
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', 'mock_jwt_token_' + Date.now());

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (mock check)
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error('Email đã được sử dụng');
      }

      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
        preferences: {
          dietaryRestrictions: [],
          allergies: [],
          favoriteCategories: [],
          nutritionGoals: {
            dailyCalories: 2000,
            protein: 20,
            carbs: 50,
            fat: 30
          }
        },
        subscription: {
          type: 'free'
        },
        createdAt: new Date().toISOString()
      };

      // Store user in "database" (localStorage)
      existingUsers.push({ email, password, userData });
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      // Auto login after registration
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', 'mock_jwt_token_' + Date.now());
      
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Cập nhật thông tin thất bại');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
