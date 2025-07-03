import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const navigate = useNavigate();

  const featuredArticle = {
    id: 1,
    title: "5 Mẹo chọn rau củ tươi ngon tại chợ",
    excerpt: "Học cách nhận biết rau củ tươi ngon qua màu sắc, mùi vị và cảm giác khi chạm vào. Những bí quyết từ các bà mẹ dày dạn kinh nghiệm sẽ giúp bạn chọn được những nguyên liệu tốt nhất cho gia đình.",
    image: "/placeholder.svg",
    author: "Chef Minh",
    date: "2024-01-15",
    category: "Mẹo vặt",
    readTime: "3 phút đọc"
  };

  const otherArticles = [
    {
      id: 2,
      title: "Tìm hiểu về gia vị ẩm thực Thái Lan",
      excerpt: "Khám phá những loại gia vị đặc trưng tạo nên hương vị độc đáo của món ăn Thái...",
      image: "/placeholder.svg",
      author: "Chef Lan",
      date: "2024-01-12",
      category: "Tin tức",
      readTime: "5 phút đọc"
    },
    {
      id: 3,
      title: "Cách bảo quản thực phẩm đúng cách",
      excerpt: "Những nguyên tắc cơ bản để giữ thực phẩm tươi ngon lâu hơn và an toàn cho sức khỏe...",
      image: "/placeholder.svg",
      author: "Chef Hoa",
      date: "2024-01-10",
      category: "Mẹo vặt",
      readTime: "4 phút đọc"
    },
    {
      id: 4,
      title: "Bí quyết làm nước mắm chấm hoàn hảo",
      excerpt: "Cách pha chế nước mắm chấm cân bằng vị ngọt, chua, cay, mặn...",
      image: "/placeholder.svg",
      author: "Chef Tâm",
      date: "2024-01-08",
      category: "Mẹo vặt",
      readTime: "2 phút đọc"
    },
    {
      id: 5,
      title: "Xu hướng ẩm thực Việt hiện đại",
      excerpt: "Cách các chef Việt Nam hiện đại hóa món ăn truyền thống...",
      image: "/placeholder.svg",
      author: "Chef Dương",
      date: "2024-01-05",
      category: "Tin tức",
      readTime: "6 phút đọc"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tin tức & <span className="text-green-600">Mẹo vặt</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về ẩm thực và học hỏi các mẹo vặt hữu ích từ các chuyên gia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Left Side */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer h-full"
                  onClick={() => navigate(`/blog/${featuredArticle.id}`)}>
              <CardHeader className="p-0">
                <div className="aspect-[16/10] bg-gradient-to-br from-green-100 to-orange-100 relative overflow-hidden">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {featuredArticle.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-green-300 transition-colors">
                      {featuredArticle.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredArticle.date).toLocaleDateString('vi-VN')}
                      </span>
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-6">
                  <Button 
                    variant="ghost" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog/${featuredArticle.id}`);
                    }}
                  >
                    Đọc thêm →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Articles - Right Side Grid */}
          <div className="space-y-6">
            {otherArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/blog/${article.id}`)}>
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-orange-100 relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => navigate('/blog')}
          >
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
