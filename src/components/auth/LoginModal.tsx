import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: number | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, selectedPlanId }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (mode === 'register') {
      if (!formData.name) {
        setError('Vui lòng nhập họ tên');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      
      // Success - modal will close automatically due to auth state change
      onClose();
      
      // If user was trying to access a specific plan, redirect them
      if (selectedPlanId) {
        setTimeout(() => {
          window.location.href = '/meal-planning-advanced';
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setError('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Chào mừng bạn quay trở lại!' 
              : 'Tạo tài khoản để bắt đầu hành trình ăn uống khoa học'
            }
          </p>
          {selectedPlanId && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-orange-800">
                🎯 Đăng nhập để áp dụng thực đơn bạn đã chọn
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field for registration */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password field for registration */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}</span>
                </div>
              ) : (
                mode === 'login' ? 'Đăng nhập' : 'Đăng ký'
              )}
            </Button>

            {/* Switch mode */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
                  disabled={isLoading}
                >
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
