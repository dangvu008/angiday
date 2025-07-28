import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Heart, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeMessage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-green-50 border-orange-200 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-orange-200"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Chào mừng trở lại, {user.name}! 👋
              </h3>
              <p className="text-gray-600">
                Sẵn sàng khám phá những công thức mới hôm nay?
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex items-center justify-center space-x-2 h-12" asChild>
            <Link to="/meal-planner">
              <Calendar className="h-4 w-4" />
              <span>Kế hoạch cá nhân</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center space-x-2 h-12" asChild>
            <Link to="/recipes">
              <BookOpen className="h-4 w-4" />
              <span>Khám phá công thức</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center space-x-2 h-12" asChild>
            <Link to="/my-favorites">
              <Heart className="h-4 w-4" />
              <span>Yêu thích</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center space-x-2 h-12" asChild>
            <Link to="/profile">
              <Settings className="h-4 w-4" />
              <span>Cài đặt</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;
