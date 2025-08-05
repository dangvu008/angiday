import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Plus, 
  Edit, 
  CheckCircle, 
  Clock,
  ChefHat,
  X
} from 'lucide-react';
import { useMealPlanning } from '@/contexts/MealPlanningContext';

interface ActivityItem {
  id: string;
  type: 'meal_added' | 'plan_created' | 'meal_completed' | 'plan_updated';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  relatedId?: string;
  isRead?: boolean;
}

const NotificationBell = () => {
  const { currentPlan, userMealPlans } = useMealPlanning();
  const [notifications, setNotifications] = useState<ActivityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Tạo thông báo từ dữ liệu hiện có
  const generateNotifications = useCallback((): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Thêm hoạt động từ kế hoạch hiện tại
    if (currentPlan) {
      // Kế hoạch được tạo
      activities.push({
        id: `plan_created_${currentPlan.id}`,
        type: 'plan_created',
        title: 'Tạo kế hoạch mới',
        description: `Đã tạo kế hoạch "${currentPlan.name}"`,
        timestamp: currentPlan.createdAt,
        icon: Plus,
        color: 'text-green-600',
        relatedId: currentPlan.id,
        isRead: false
      });
      
      // Cập nhật kế hoạch
      if (currentPlan.updatedAt !== currentPlan.createdAt) {
        activities.push({
          id: `plan_updated_${currentPlan.id}`,
          type: 'plan_updated',
          title: 'Cập nhật kế hoạch',
          description: `Đã cập nhật kế hoạch "${currentPlan.name}"`,
          timestamp: currentPlan.updatedAt,
          icon: Edit,
          color: 'text-blue-600',
          relatedId: currentPlan.id,
          isRead: false
        });
      }
      
      // Thêm món ăn vào kế hoạch (chỉ lấy 3 món gần nhất)
      const recentMeals = currentPlan.meals
        .filter(meal => meal.recipe)
        .slice(-3);
        
      recentMeals.forEach(meal => {
        if (meal.recipe) {
          activities.push({
            id: `meal_added_${meal.id}`,
            type: 'meal_added',
            title: 'Thêm món ăn',
            description: `Đã thêm "${meal.recipe.title}" vào ${getMealTypeName(meal.mealType)}`,
            timestamp: currentPlan.updatedAt,
            icon: ChefHat,
            color: 'text-orange-600',
            relatedId: meal.recipe.id,
            isRead: false
          });
          
          // Hoàn thành bữa ăn (nếu đã qua ngày đó)
          const mealDate = new Date(meal.date);
          const today = new Date();
          if (mealDate < today) {
            activities.push({
              id: `meal_completed_${meal.id}`,
              type: 'meal_completed',
              title: 'Hoàn thành bữa ăn',
              description: `Đã hoàn thành "${meal.recipe.title}"`,
              timestamp: new Date(mealDate.getTime() + 12 * 60 * 60 * 1000).toISOString(),
              icon: CheckCircle,
              color: 'text-green-600',
              relatedId: meal.recipe.id,
              isRead: false
            });
          }
        }
      });
    }
    
    // Sắp xếp theo thời gian mới nhất và lấy 5 thông báo gần nhất
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [currentPlan]);

  const getMealTypeName = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bữa sáng';
      case 'lunch': return 'bữa trưa';
      case 'dinner': return 'bữa tối';
      case 'snack': return 'bữa phụ';
      default: return 'bữa ăn';
    }
  };
  
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return time.toLocaleDateString('vi-VN');
  };

  const getNotificationBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'meal_added':
        return <Badge variant="secondary" className="text-xs">Thêm món</Badge>;
      case 'plan_created':
        return <Badge variant="default" className="text-xs">Tạo mới</Badge>;
      case 'meal_completed':
        return <Badge variant="outline" className="text-xs border-green-500 text-green-700">Hoàn thành</Badge>;
      case 'plan_updated':
        return <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">Cập nhật</Badge>;
      default:
        return null;
    }
  };

  React.useEffect(() => {
    setNotifications(generateNotifications());
  }, [generateNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {unreadCount} thông báo chưa đọc
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100`}>
                        <IconComponent className={`h-4 w-4 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          {getNotificationBadge(notification.type)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button variant="ghost" size="sm" className="w-full text-sm">
              Xem tất cả thông báo
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
