
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Mic, MicOff, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói');
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to recipes page with search query
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {isAuthenticated ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Chào mừng trở lại, <span className="text-orange-600">{user?.name}</span>!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Hôm nay bạn muốn nấu món gì? Khám phá công thức mới hoặc tạo kế hoạch bữa ăn cho tuần này
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Khám phá <span className="text-orange-600">ẩm thực</span><br />
              <span className="text-orange-600">Việt Nam</span> mỗi ngày
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Từ những mẹo vặt nhà bếp đến thực đơn hoàn chỉnh, Angiday đồng hành cùng bạn trong hành trình khám phá ẩm thực
            </p>
          </>
        )}

        {/* Search Bar - Improved with Voice Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-full border-2 border-gray-200 shadow-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-300" style={{ height: '64px' }}>
            {/* Search Icon */}
            <div className="absolute left-4 flex items-center justify-center" style={{ height: '64px' }}>
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder={isListening ? "Đang nghe..." : "Ăn gì hôm nay?"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-full pl-14 pr-40 bg-transparent border-0 outline-none text-gray-700 placeholder:text-gray-400 text-lg rounded-full"
            />

            {/* Right Side Buttons */}
            <div className="absolute right-2 flex items-center gap-2" style={{ height: '64px' }}>
              {/* Voice Search Button */}
              <button
                onClick={startVoiceSearch}
                disabled={isListening}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'hover:bg-orange-50 hover:text-orange-600 text-gray-500'
                }`}
                title="Tìm kiếm bằng giọng nói"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 h-12 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/meal-planner">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tạo kế hoạch bữa ăn
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold shadow-sm transition-all duration-300" asChild>
                <Link to="/recipes">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Khám phá công thức
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/recipes">
                  Khám phá công thức
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:border-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold shadow-sm transition-all duration-300" asChild>
                <Link to="/meal-planning">
                  Xem thực đơn mẫu
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
