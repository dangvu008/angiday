
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const BlogSection = () => {
  const articles = [
    {
      id: 1,
      title: "5 Mẹo chọn rau củ tươi ngon tại chợ",
      excerpt: "Học cách nhận biết rau củ tươi ngon qua màu sắc, mùi vị và cảm giác khi chạm vào...",
      image: "/placeholder.svg",
      author: "Chef Minh",
      date: "2024-01-15",
      category: "Mẹo vặt",
      readTime: "3 phút đọc"
    },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-orange-100 relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(article.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium"
                  >
                    Đọc thêm →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
