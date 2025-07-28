import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, ArrowRight } from 'lucide-react';

interface LoginRequiredProps {
  title?: string;
  message?: string;
  redirectPath?: string;
}

const LoginRequired: React.FC<LoginRequiredProps> = ({
  title = "Yêu cầu đăng nhập",
  message = "Bạn cần đăng nhập để truy cập trang này",
  redirectPath = "/"
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {message}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/register">
                Tạo tài khoản mới
              </Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>
          
          <Button variant="ghost" asChild className="w-full">
            <Link to={redirectPath}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Quay về trang chủ
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRequired;
