// Mock authentication service
// Trong thực tế, đây sẽ tích hợp với hệ thống auth thực sự

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'chef';
  createdAt: string;
  preferences?: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  };
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Mock current user - trong thực tế sẽ load từ localStorage/sessionStorage
    this.currentUser = {
      id: 'user_123',
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=f97316&color=fff',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
      preferences: {
        dietaryRestrictions: ['vegetarian'],
        favoriteCategories: ['Món chính', 'Ăn chay'],
        skillLevel: 'intermediate'
      }
    };
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Kiểm tra có phải admin không
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Kiểm tra có phải chef không
  isChef(): boolean {
    return this.currentUser?.role === 'chef';
  }

  // Kiểm tra có quyền chỉnh sửa thực đơn không
  canEditMenu(menuCreatedBy: string): boolean {
    if (!this.currentUser) return false;
    
    // Admin có thể sửa tất cả
    if (this.isAdmin()) return true;
    
    // Chỉ có thể sửa thực đơn của chính mình
    return this.currentUser.id === menuCreatedBy;
  }

  // Kiểm tra có quyền xóa thực đơn không
  canDeleteMenu(menuCreatedBy: string): boolean {
    if (!this.currentUser) return false;
    
    // Admin có thể xóa tất cả
    if (this.isAdmin()) return true;
    
    // Chỉ có thể xóa thực đơn của chính mình
    return this.currentUser.id === menuCreatedBy;
  }

  // Kiểm tra có quyền thêm công thức vào thực đơn không
  canAddRecipeToMenu(menuCreatedBy: string): boolean {
    if (!this.currentUser) return false;
    
    // Admin có thể thêm vào tất cả
    if (this.isAdmin()) return true;
    
    // Chỉ có thể thêm vào thực đơn của chính mình
    return this.currentUser.id === menuCreatedBy;
  }

  // Kiểm tra có thể thêm thực đơn vào kế hoạch cá nhân không
  canAddMenuToPersonalPlan(): boolean {
    // Tất cả user đã đăng nhập đều có thể thêm vào kế hoạch cá nhân
    return this.isAuthenticated();
  }

  // Mock login
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Mock successful login
          const user: User = {
            id: `user_${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: email.includes('admin') ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          this.currentUser = user;
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  // Mock logout
  logout(): void {
    this.currentUser = null;
  }

  // Mock register
  register(userData: Partial<User>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: `user_${Date.now()}`,
          name: userData.name || 'New User',
          email: userData.email || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          ...userData
        };
        this.currentUser = user;
        resolve(user);
      }, 1000);
    });
  }

  // Lấy danh sách users (chỉ admin)
  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      if (!this.isAdmin()) {
        reject(new Error('Unauthorized'));
        return;
      }

      // Mock users data
      const users: User[] = [
        {
          id: 'user_123',
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'chef_456',
          name: 'Chef Minh',
          email: 'chef@example.com',
          role: 'chef',
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: 'admin_789',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: '2024-01-03T00:00:00Z'
        }
      ];

      setTimeout(() => resolve(users), 500);
    });
  }

  // Cập nhật thông tin user
  updateProfile(userData: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        reject(new Error('Not authenticated'));
        return;
      }

      setTimeout(() => {
        this.currentUser = { ...this.currentUser, ...userData };
        resolve(this.currentUser);
      }, 500);
    });
  }

  // Thay đổi mật khẩu
  changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        reject(new Error('Not authenticated'));
        return;
      }

      setTimeout(() => {
        // Mock password change
        if (oldPassword === 'wrongpassword') {
          reject(new Error('Incorrect old password'));
        } else {
          resolve();
        }
      }, 500);
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
