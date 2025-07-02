
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "5 Mẹo chọn rau củ tươi ngon tại chợ",
      excerpt: "Những bí quyết đơn giản giúp bạn chọn được rau củ tươi ngon nhất với giá cả hợp lý",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop",
      category: "Mẹo vặt",
      readTime: "5 phút",
      views: 1234,
      publishedAt: "2 ngày trước"
    },
    {
      id: 2,
      title: "Tìm hiểu về gia vị ẩm thực Thái Lan",
      excerpt: "Khám phá thế giới gia vị phong phú của ẩm thực Thái và cách sử dụng chúng trong nấu ăn",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=250&fit=crop",
      category: "Kiến thức",
      readTime: "8 phút",
      views: 892,
      publishedAt: "1 tuần trước"
    },
    {
      id: 3,
      title: "Cách bảo quản thực phẩm trong tủ lạnh",
      excerpt: "Hướng dẫn chi tiết cách sắp xếp và bảo quản thực phẩm để giữ được độ tươi ngon lâu nhất",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop",
      category: "Mẹo vặt",
      readTime: "6 phút",
      views: 2156,
      publishedAt: "3 ngày trước"
    },
    {
      id: 4,
      title: "Xu hướng ẩm thực Việt 2024",
      excerpt: "Những xu hướng mới nhất trong ẩm thực Việt Nam đang được yêu thích năm 2024",
      image: "https://images.unsplash.com/photo-1559847844-d724dacb1828?w=400&h=250&fit=crop",
      category: "Tin tức",
      readTime: "10 phút",
      views: 3421,
      publishedAt: "1 ngày trước"
    }
  ];

  const categories = ["Tất cả", "Mẹo vặt", "Kiến thức", "Tin tức", "Dinh dưỡng"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tin tức & Mẹo vặt
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Khám phá những kiến thức bổ ích và mẹo vặt hữu dụng cho việc nấu ăn hàng ngày
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={category === "Tất cả" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-600 hover:text-white px-4 py-2"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500">{post.publishedAt}</span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-orange-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
