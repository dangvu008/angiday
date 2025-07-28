import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MealPlanDetailModal from '@/components/MealPlanDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  Clock,
  ChefHat,
  Heart,
  Eye,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Apple,
  ArrowUp
} from 'lucide-react';

const MealPlanningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMealTime, setSelectedMealTime] = useState('all');
  const [selectedMealPlan, setSelectedMealPlan] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Simple cleanup on mount
  useEffect(() => {
    // Force close any modals on mount
    setIsDetailModalOpen(false);
    setSelectedMealPlan(null);
  }, []);

  // Handle scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count meal plans for each meal type
  const getMealTypeCount = (mealType: string) => {
    if (mealType === 'all') return mealPlans.length;
    return mealPlans.filter(plan => {
      if (mealType === 'breakfast') return plan.breakfast.length > 0;
      if (mealType === 'lunch') return plan.lunch.length > 0;
      if (mealType === 'dinner') return plan.dinner.length > 0;
      return false;
    }).length;
  };

  // Get total dishes for each meal type
  const getMealTypeDishCount = (mealType: string) => {
    if (mealType === 'all') {
      return mealPlans.reduce((total, plan) =>
        total + plan.breakfast.length + plan.lunch.length + plan.dinner.length, 0
      );
    }
    return mealPlans.reduce((total, plan) => {
      if (mealType === 'breakfast') return total + plan.breakfast.length;
      if (mealType === 'lunch') return total + plan.lunch.length;
      if (mealType === 'dinner') return total + plan.dinner.length;
      return total;
    }, 0);
  };

  // Enhanced nutrition categories with proper icons and design
  const nutritionNeeds = [
    {
      id: 1,
      name: 'Giảm khối mỡ thừa',
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      hoverColor: 'hover:from-pink-600 hover:to-rose-600',
      icon: '🏃‍♀️',
      description: 'Thực đơn giảm cân'
    },
    {
      id: 2,
      name: 'Cân bằng dinh dưỡng',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      icon: '⚖️',
      description: 'Dinh dưỡng toàn diện'
    },
    {
      id: 3,
      name: 'Bổ máu',
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      hoverColor: 'hover:from-red-600 hover:to-pink-600',
      icon: '❤️',
      description: 'Tăng cường sức khỏe'
    },
    {
      id: 4,
      name: 'Tăng cường trí não',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
      icon: '🧠',
      description: 'Hỗ trợ trí não'
    },
    {
      id: 5,
      name: 'Hỗ trợ tiêu hóa',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      icon: '💚',
      description: 'Tốt cho dạ dày'
    },
    {
      id: 6,
      name: 'Xây dựng cơ bắp',
      color: 'bg-gradient-to-r from-orange-500 to-amber-500',
      hoverColor: 'hover:from-orange-600 hover:to-amber-600',
      icon: '💪',
      description: 'Tăng cường cơ bắp'
    }
  ];

  const mealPlans = [
    {
      id: 1,
      day: 'Thực đơn 1',
      breakfast: [
        {
          name: 'Bún ốc',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '45 phút',
          difficulty: 'Trung bình',
          description: 'Bún ốc đậm đà với nước dùng thơm ngon'
        }
      ],
      lunch: [
        {
          name: 'Canh chua tôm rau muống',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Dễ',
          description: 'Canh chua thanh mát với tôm tươi'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Salad bít tết',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          description: 'Salad tươi mát với bít tết bò thơm ngon'
        },
        {
          name: 'Bánh mì nướng',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
          time: '10 phút',
          difficulty: 'Dễ',
          description: 'Bánh mì nướng giòn tan'
        }
      ]
    },
    {
      id: 2,
      day: 'Thực đơn 2',
      breakfast: [
        {
          name: 'Hủ tiếu chay',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          description: 'Hủ tiếu chay thanh đạm với rau củ tươi ngon'
        }
      ],
      lunch: [
        {
          name: 'Đậu hũ hấp trứng',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Đậu hũ mềm mịn hấp với trứng thơm ngon'
        },
        {
          name: 'Rau muống xào tỏi',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '10 phút',
          difficulty: 'Dễ',
          description: 'Rau muống xanh giòn xào tỏi thơm'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Ức gà hấp cải thảo',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '35 phút',
          difficulty: 'Trung bình',
          description: 'Ức gà mềm ngọt hấp với cải thảo tươi'
        },
        {
          name: 'Canh rau ngót nấu tôm',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
          time: '15 phút',
          difficulty: 'Dễ',
          description: 'Canh rau ngót thanh mát với tôm tươi'
        }
      ]
    },
    {
      id: 3,
      day: 'Thực đơn 3',
      breakfast: [
        {
          name: 'Hủ tiếu mực',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '40 phút',
          difficulty: 'Trung bình',
          description: 'Hủ tiếu mực tươi ngon với nước dùng đậm đà'
        }
      ],
      lunch: [
        {
          name: 'Cá chép kho riềng',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '50 phút',
          difficulty: 'Khó',
          description: 'Cá chép kho riềng đậm đà, thơm ngon'
        },
        {
          name: 'Canh khổ qua nhồi thịt',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          description: 'Canh khổ qua nhồi thịt thanh mát'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Bún gạo xào thịt bò',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Trung bình',
          description: 'Bún gạo xào thịt bò thơm ngon'
        },
        {
          name: 'Chè đậu xanh',
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Dễ',
          description: 'Chè đậu xanh mát lạnh'
        }
      ]
    },
    {
      id: 4,
      day: 'Thực đơn 4',
      breakfast: [
        {
          name: 'Salad nui',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Salad nui tươi mát với rau củ đầy màu sắc'
        },
        {
          name: 'Bánh mì nướng bơ',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
          time: '5 phút',
          difficulty: 'Dễ',
          description: 'Bánh mì nướng giòn với bơ thơm'
        }
      ],
      lunch: [
        {
          name: 'Nghêu kho nước tương',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Trung bình',
          description: 'Nghêu kho nước tương đậm đà, thơm ngon'
        },
        {
          name: 'Rau cải luộc',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '10 phút',
          difficulty: 'Dễ',
          description: 'Rau cải xanh luộc chấm nước mắm'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Mì trộn xốt mayonnaise',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '15 phút',
          difficulty: 'Dễ',
          description: 'Mì trộn xốt mayonnaise béo ngậy'
        },
        {
          name: 'Trà đá chanh',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
          time: '5 phút',
          difficulty: 'Dễ',
          description: 'Trà đá chanh mát lạnh'
        }
      ]
    },
    {
      id: 5,
      day: 'Thực đơn 5',
      breakfast: [
        {
          name: 'Phở bò',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '90 phút',
          difficulty: 'Khó',
          description: 'Phở bò truyền thống với nước dùng trong vắt'
        }
      ],
      lunch: [
        {
          name: 'Cánh gà chiên lá quế',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          description: 'Cánh gà chiên giòn với lá quế thơm'
        },
        {
          name: 'Canh chua cá bông lau',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
          time: '25 phút',
          difficulty: 'Trung bình',
          description: 'Canh chua thanh mát với cá bông lau'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Bánh tráng nướng',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '15 phút',
          difficulty: 'Dễ',
          description: 'Bánh tráng nướng giòn với trứng'
        },
        {
          name: 'Trà đào cam sả',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
          time: '10 phút',
          difficulty: 'Dễ',
          description: 'Trà đào cam sả thơm mát'
        }
      ]
    },
    {
      id: 6,
      day: 'Thực đơn 6',
      breakfast: [
        {
          name: 'Bún thang',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '60 phút',
          difficulty: 'Khó',
          description: 'Bún thang Hà Nội truyền thống với nhiều loại thịt'
        }
      ],
      lunch: [
        {
          name: 'Thịt kho tàu',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '45 phút',
          difficulty: 'Trung bình',
          description: 'Thịt kho tàu đậm đà với trứng cút'
        },
        {
          name: 'Canh tôm bồ ngót',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Canh tôm bồ ngót thanh mát'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Nui xào hải sản',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '30 phút',
          difficulty: 'Trung bình',
          description: 'Nui xào hải sản thơm ngon'
        },
        {
          name: 'Sinh tố bơ',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
          time: '5 phút',
          difficulty: 'Dễ',
          description: 'Sinh tố bơ béo ngậy mát lạnh'
        }
      ]
    },
    {
      id: 7,
      day: 'Thực đơn 7',
      breakfast: [
        {
          name: 'Bún riêu cua',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
          time: '50 phút',
          difficulty: 'Trung bình',
          description: 'Bún riêu cua đồng thơm ngon đậm đà'
        }
      ],
      lunch: [
        {
          name: 'Tôm sú kho lá quế',
          image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop',
          time: '35 phút',
          difficulty: 'Trung bình',
          description: 'Tôm sú kho lá quế thơm nức mũi'
        },
        {
          name: 'Rau muống luộc',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          time: '10 phút',
          difficulty: 'Dễ',
          description: 'Rau muống luộc chấm tương'
        },
        {
          name: 'Cơm trắng',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Cơm trắng dẻo thơm'
        }
      ],
      dinner: [
        {
          name: 'Lẩu cháo chim cút hạt sen',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
          time: '60 phút',
          difficulty: 'Khó',
          description: 'Lẩu cháo chim cút hạt sen bổ dưỡng'
        },
        {
          name: 'Chè thái',
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
          time: '20 phút',
          difficulty: 'Dễ',
          description: 'Chè thái mát lạnh nhiều màu sắc'
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const MealSection = ({ meals, mealType }: { meals: any[], mealType: string }) => {
    const getMealIcon = () => {
      switch (mealType) {
        case 'breakfast': return <Coffee className="h-4 w-4" />;
        case 'lunch': return <Sun className="h-4 w-4" />;
        case 'dinner': return <Moon className="h-4 w-4" />;
        default: return <Utensils className="h-4 w-4" />;
      }
    };

    const getMealLabel = () => {
      switch (mealType) {
        case 'breakfast': return 'Sáng';
        case 'lunch': return 'Trưa';
        case 'dinner': return 'Tối';
        default: return 'Món ăn';
      }
    };

    const getMealColor = () => {
      switch (mealType) {
        case 'breakfast': return 'from-amber-400 to-orange-500';
        case 'lunch': return 'from-orange-400 to-red-500';
        case 'dinner': return 'from-purple-400 to-indigo-500';
        default: return 'from-gray-400 to-gray-500';
      }
    };

    const totalTime = meals.reduce((sum, meal) => sum + parseInt(meal.time), 0);

    return (
      <div className="space-y-3">
        {/* Meal Type Header */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getMealColor()} text-white text-sm font-medium shadow-sm`}>
            {getMealIcon()}
            <span>{getMealLabel()}</span>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {meals.length} món • {totalTime}p
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-2">
          {meals.map((meal, index) => (
            <div key={index} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 border border-transparent hover:border-orange-100">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm text-gray-800 line-clamp-1 mb-1 group-hover:text-orange-700 transition-colors">
                  {meal.name}
                </h5>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {meal.description}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{meal.time}</span>
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 ${getDifficultyColor(meal.difficulty)} border-0 font-medium`}>
                    {meal.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      <main className="container mx-auto px-4 pt-8 pb-12" style={{ minHeight: '100vh' }}>
        {/* Header Section */}
        <div className="text-center mb-12 relative z-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full mb-6">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-lg">Kế Hoạch Nấu Ăn</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thực Đơn <span className="text-orange-500">Chuyên Gia</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Được thiết kế bởi chuyên gia dinh dưỡng, mỗi thực đơn đảm bảo cân bằng
            <span className="font-semibold text-orange-600"> protein, carbs và vitamin</span> cần thiết cho cả gia đình
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="expert" className="mb-10 relative z-20">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-white shadow-lg border-0 p-1 rounded-full">
            <TabsTrigger
              value="expert"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300"
            >
              <ChefHat className="h-4 w-4" />
              <span className="font-medium">Chuyên gia</span>
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Tự tạo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expert">
            {/* Nutrition Needs Filter */}
            <div className="mb-10">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Chọn mục tiêu dinh dưỡng</h2>
                <p className="text-gray-600 text-sm">Thực đơn được tối ưu theo nhu cầu cụ thể của bạn</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
                {nutritionNeeds.map((need) => (
                  <div
                    key={need.id}
                    className={`relative group cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${need.color} ${need.hoverColor} text-white shadow-lg`}
                  >
                    {/* Icon */}
                    <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                      {need.icon}
                    </div>

                    {/* Label */}
                    <h4 className="font-bold text-sm mb-1 text-white">
                      {need.name}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-white/90">
                      {need.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Time Filter */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMealTime('all')}
                  className={`flex flex-col items-center gap-1 rounded-xl px-6 py-3 transition-all duration-200 ${
                    selectedMealTime === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    <span className="font-medium">Tất cả</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedMealTime === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getMealTypeCount('all')} thực đơn • {getMealTypeDishCount('all')} món
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMealTime('breakfast')}
                  className={`flex flex-col items-center gap-1 rounded-xl px-6 py-3 transition-all duration-200 ${
                    selectedMealTime === 'breakfast'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    <span className="font-medium">Sáng</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedMealTime === 'breakfast'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {getMealTypeDishCount('breakfast')} món sáng
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMealTime('lunch')}
                  className={`flex flex-col items-center gap-1 rounded-xl px-6 py-3 transition-all duration-200 ${
                    selectedMealTime === 'lunch'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span className="font-medium">Trưa</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedMealTime === 'lunch'
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {getMealTypeDishCount('lunch')} món trưa
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMealTime('dinner')}
                  className={`flex flex-col items-center gap-1 rounded-xl px-6 py-3 transition-all duration-200 ${
                    selectedMealTime === 'dinner'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="font-medium">Tối</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedMealTime === 'dinner'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {getMealTypeDishCount('dinner')} món tối
                  </span>
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <span className="font-semibold text-orange-600">
                  {selectedMealTime === 'all' ? 'Tất cả thực đơn' :
                   selectedMealTime === 'breakfast' ? 'Thực đơn có bữa sáng' :
                   selectedMealTime === 'lunch' ? 'Thực đơn có bữa trưa' :
                   'Thực đơn có bữa tối'}
                </span>
                <span className="text-sm text-gray-500">
                  ({getMealTypeCount(selectedMealTime)} kết quả)
                </span>
              </div>
            </div>

            {/* Meal Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {mealPlans.map((plan, index) => {
                // Filter logic based on selected meal time
                const shouldShowPlan = selectedMealTime === 'all' ||
                  (selectedMealTime === 'breakfast' && plan.breakfast.length > 0) ||
                  (selectedMealTime === 'lunch' && plan.lunch.length > 0) ||
                  (selectedMealTime === 'dinner' && plan.dinner.length > 0);

                if (!shouldShowPlan) return null;

                return (
                <Card
                  key={plan.id}
                  className="group overflow-hidden hover:shadow-xl transition-shadow duration-200 border-0 shadow-lg bg-white rounded-2xl h-full"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6 text-center rounded-t-2xl">
                    <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
                    <div className="relative flex items-center justify-center gap-2 mb-3">
                      <ChefHat className="h-6 w-6 text-white" />
                      <h3 className="text-white font-bold text-xl">{plan.day}</h3>
                    </div>
                    <div className="relative flex items-center justify-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <Utensils className="h-4 w-4" />
                        <span>{plan.breakfast.length + plan.lunch.length + plan.dinner.length} món</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {plan.breakfast.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0) +
                           plan.lunch.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0) +
                           plan.dinner.reduce((sum: number, meal: any) => sum + parseInt(meal.time), 0)}p
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      {/* Show only selected meal type or all */}
                      {(selectedMealTime === 'all' || selectedMealTime === 'breakfast') && (
                        <MealSection meals={plan.breakfast} mealType="breakfast" />
                      )}
                      {(selectedMealTime === 'all' || selectedMealTime === 'lunch') && (
                        <MealSection meals={plan.lunch} mealType="lunch" />
                      )}
                      {(selectedMealTime === 'all' || selectedMealTime === 'dinner') && (
                        <MealSection meals={plan.dinner} mealType="dinner" />
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => {
                          setSelectedMealPlan(plan);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết thực đơn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {/* Show message when no plans match filter */}
            {mealPlans.every(plan => {
              const shouldShowPlan = selectedMealTime === 'all' ||
                (selectedMealTime === 'breakfast' && plan.breakfast.length > 0) ||
                (selectedMealTime === 'lunch' && plan.lunch.length > 0) ||
                (selectedMealTime === 'dinner' && plan.dinner.length > 0);
              return !shouldShowPlan;
            }) && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {selectedMealTime === 'breakfast' && <Coffee className="h-10 w-10 text-gray-400" />}
                  {selectedMealTime === 'lunch' && <Sun className="h-10 w-10 text-gray-400" />}
                  {selectedMealTime === 'dinner' && <Moon className="h-10 w-10 text-gray-400" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy thực đơn phù hợp
                </h3>
                <p className="text-gray-600">
                  Hiện tại chưa có thực đơn nào cho bữa {
                    selectedMealTime === 'breakfast' ? 'sáng' :
                    selectedMealTime === 'lunch' ? 'trưa' : 'tối'
                  }. Vui lòng chọn bộ lọc khác.
                </p>
              </div>
            )}

            {/* Suggested Dishes Section - Slide View */}
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-8 mt-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4">
                  <Apple className="h-5 w-5" />
                  <span className="font-semibold">Món ăn gợi ý</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Thêm món vào thực đơn của bạn
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Khám phá các món ăn đa dạng để bổ sung vào thực đơn hiện có,
                  tạo nên bữa ăn phong phú và hấp dẫn hơn
                </p>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 -mx-4" style={{ scrollSnapType: 'x mandatory' }}>
                  {[
                    { id: 1, name: 'Óc xào khế', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ', rating: 4.5, reviews: 350, description: 'Óc heo xào khế chua ngọt' },
                    { id: 2, name: 'Lẩu vịt hầm sả', image: 'https://images.unsplash.com/photo-1569059078571-45b5e4b8e5b8?w=300&h=200&fit=crop', time: '35 phút', difficulty: 'Dễ', rating: 4.3, reviews: 316, description: 'Lẩu vịt hầm sả thơm lừng' },
                    { id: 3, name: 'Sườn chiên xốt mận', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', time: '35 phút', difficulty: 'Dễ', rating: 4.4, reviews: 311, description: 'Sườn chiên giòn với xốt mận chua ngọt' },
                    { id: 4, name: 'Canh sườn hạt sen', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '25 phút', difficulty: 'Dễ', rating: 4.2, reviews: 272, description: 'Canh sườn hạt sen thanh mát bổ dưỡng' },
                    { id: 5, name: 'Bánh cuốn tôm chấy', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', time: '45 phút', difficulty: 'Trung bình', rating: 4.6, reviews: 428, description: 'Bánh cuốn mỏng với tôm chấy thơm ngon' },
                    { id: 6, name: 'Cà ri gà', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop', time: '50 phút', difficulty: 'Trung bình', rating: 4.7, reviews: 523, description: 'Cà ri gà đậm đà với bánh mì hoặc cơm' },
                    { id: 7, name: 'Gỏi đu đủ', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', time: '15 phút', difficulty: 'Dễ', rating: 4.1, reviews: 189, description: 'Gỏi đu đủ chua cay giòn ngon' },
                    { id: 8, name: 'Bánh flan', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', time: '40 phút', difficulty: 'Trung bình', rating: 4.3, reviews: 267, description: 'Bánh flan mềm mịn với caramel thơm' }
                  ].map((dish) => (
                    <Card key={dish.id} className="group flex-shrink-0 w-72 overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white rounded-2xl hover:scale-105" style={{ scrollSnapAlign: 'start' }}>
                      <div className="relative overflow-hidden">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getDifficultyColor(dish.difficulty)} text-xs font-medium shadow-sm`}>
                            {dish.difficulty}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm">
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                          </Button>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-xs font-medium text-gray-700">{dish.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({dish.reviews})</span>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">
                          {dish.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs font-medium">{dish.time}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            4 Người
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-8 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => window.location.href = '/recipes'}
                >
                  Xem toàn bộ công thức
                  <ArrowUp className="h-4 w-4 ml-2 rotate-45" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-6">
                    <Calendar className="h-12 w-12 text-orange-500" />
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-8 -translate-y-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">!</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Sắp ra mắt!
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Chức năng <span className="font-semibold text-orange-600">tự tạo thực đơn</span> đang được phát triển.
                  Bạn sẽ có thể tạo kế hoạch nấu ăn cá nhân hóa theo:
                </p>

                <div className="grid grid-cols-1 gap-3 text-left max-w-xs mx-auto mb-8">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Sở thích cá nhân</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Nhu cầu dinh dưỡng</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Ngân sách gia đình</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Thời gian nấu nướng</span>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Đăng ký nhận thông báo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-in fade-in slide-in-from-bottom-4"
        >
          <ArrowUp className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}

      {/* Detail Modal */}
      {selectedMealPlan && isDetailModalOpen && (
        <MealPlanDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedMealPlan(null);
          }}
          mealPlan={selectedMealPlan}
        />
      )}
    </div>
  );
};

export default MealPlanningPage;
