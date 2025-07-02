
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Eye, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogDetailPage = () => {
  const { id } = useParams();

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const article = {
    id: id,
    title: "5 Mẹo chọn rau củ tươi ngon tại chợ",
    excerpt: "Những bí quyết đơn giản giúp bạn chọn được rau củ tươi ngon nhất với giá cả hợp lý",
    content: `
      <p>Việc chọn mua rau củ tươi ngon là một kỹ năng quan trọng mà mọi người nội trợ cần biết. Không chỉ giúp tiết kiệm chi phí, việc chọn được rau củ chất lượng còn đảm bảo dinh dưỡng và an toàn cho gia đình.</p>

      <h2>1. Quan sát màu sắc tự nhiên</h2>
      <p>Rau củ tươi thường có màu sắc tự nhiên, bóng mượt. Tránh những loại có màu quá đậm hoặc quá nhạt so với bình thường, có thể đã được xử lý hóa chất.</p>

      <h2>2. Kiểm tra độ cứng và độ đàn hồi</h2>
      <p>Rau củ tươi khi bấm nhẹ sẽ có độ đàn hồi tốt, không bị dập nát. Đặc biệt với các loại như cà chua, cam, quýt - khi ấn nhẹ nên có cảm giác chắc nịch.</p>

      <h2>3. Ngửi mùi tự nhiên</h2>
      <p>Rau củ tươi thường có mùi thơm tự nhiên, không có mùi khó chịu hay mùi hóa chất. Nếu ngửi thấy mùi lạ, hãy tránh mua loại đó.</p>

      <h2>4. Chọn thời điểm mua sắm phù hợp</h2>
      <p>Nên mua rau củ vào buổi sáng sớm khi hàng hóa mới về, còn tươi ngon. Tránh mua vào buổi chiều muộn khi rau đã héo úa.</p>

      <h2>5. Tìm hiểu nguồn gốc xuất xứ</h2>
      <p>Ưu tiên chọn rau củ có nguồn gốc rõ ràng, được trồng tại các vùng an toàn. Không ngại hỏi người bán về nguồn gốc sản phẩm.</p>

      <h2>Lời khuyên thêm</h2>
      <p>Hãy mang theo túi vải khi đi chợ để bảo vệ môi trường. Đồng thời, nên mua đủ dùng trong vài ngày để đảm bảo độ tươi ngon của thực phẩm.</p>
    `,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
    category: "Mẹo vặt",
    readTime: "5 phút",
    views: 1234,
    publishedAt: "2024-01-15",
    author: {
      name: "Chef Minh",
      avatar: "/placeholder.svg",
      bio: "Chuyên gia ẩm thực với 15 năm kinh nghiệm"
    },
    tags: ["mẹo vặt", "mua sắm", "rau củ", "chợ"]
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Cách bảo quản thực phẩm trong tủ lạnh",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
      readTime: "6 phút"
    },
    {
      id: 3,
      title: "Tìm hiểu về gia vị ẩm thực Thái Lan",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop",
      readTime: "8 phút"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 pb-8 text-white">
              <Badge className="mb-4 bg-green-600 hover:bg-green-700">
                {article.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {article.title}
              </h1>
              <p className="text-xl mb-6 max-w-2xl opacity-90">
                {article.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Article Meta */}
        <section className="py-6 px-4 border-b bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="md:col-span-3">
                <article className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    className="text-gray-700 leading-relaxed"
                  />
                </article>

                {/* Tags */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-4">Thẻ liên quan:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1">
                {/* Author Info */}
                <Card className="mb-6">
                  <CardContent className="p-6 text-center">
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <h3 className="font-semibold mb-2">{article.author.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{article.author.bio}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem thêm bài viết
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Bài viết liên quan</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related) => (
                        <div key={related.id} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <img 
                            src={related.image} 
                            alt={related.title}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {related.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{related.readTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
