import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from './RatingStars';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  recipeId: string;
}

export const ReviewSection = ({ recipeId }: ReviewSectionProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Nguyễn Minh',
      rating: 5,
      comment: 'Công thức rất chi tiết và dễ hiểu. Món ăn ngon tuyệt vời!',
      date: '2024-01-15'
    },
    {
      id: '2',
      author: 'Trần Hoa',
      rating: 4,
      comment: 'Làm theo hướng dẫn và ra món rất ngon. Cám ơn tác giả!',
      date: '2024-01-10'
    }
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 0,
    comment: ''
  });

  const handleSubmitReview = () => {
    if (!newReview.author.trim() || !newReview.comment.trim() || newReview.rating === 0) {
      toast({
        description: "Vui lòng điền đầy đủ thông tin đánh giá",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ author: '', rating: 0, comment: '' });
    
    toast({
      description: "Cảm ơn bạn đã đánh giá!",
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Đánh giá
            <div className="flex items-center space-x-2">
              <RatingStars rating={averageRating} readonly />
              <span className="text-sm text-muted-foreground">
                ({reviews.length} đánh giá)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Add Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Viết đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên của bạn</label>
            <Input
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Đánh giá</label>
            <RatingStars
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Nhận xét</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Chia sẻ trải nghiệm của bạn về công thức này..."
              rows={4}
            />
          </div>
          
          <Button onClick={handleSubmitReview} className="w-full">
            Gửi đánh giá
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>
                    {review.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{review.author}</h4>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <RatingStars rating={review.rating} readonly size="sm" className="mb-2" />
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};