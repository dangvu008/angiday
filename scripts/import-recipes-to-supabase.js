// Script để import recipes từ mockRecipes.ts vào Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = 'https://exfwzughxzpwedtkfdwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Znd6dWdoeHpwd2VkdGtmZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDA1NjAsImV4cCI6MjA2OTc3NjU2MH0.VfXgZg1iPu934cGRYJ_O-IuxtTR2rK6k_HHNUhdMdng';

const supabase = createClient(supabaseUrl, supabaseKey);

// Danh sách 17 món ăn còn lại (đã có 3 món rồi)
const remainingRecipes = [
  {
    title: 'Cà ri gà',
    description: 'Cà ri gà đậm đà với nước cốt dừa thơm béo',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
    category: 'Món chính',
    difficulty: 'Trung bình',
    cooking_time: '50 phút',
    servings: 5,
    author: 'Chị Lan',
    status: 'published',
    created_date: '2024-02-04',
    views: 980,
    ingredients: ['1 con gà ta', '400ml nước cốt dừa', '2 thìa canh bột cà ri', '2 củ khoai tây', '1 củ cà rốt', 'Sả, gừng, tỏi', 'Nước mắm, đường'],
    instructions: ['Gà chặt miếng, ướp gia vị', 'Phi thơm sả, gừng, tỏi', 'Cho bột cà ri vào rang thơm', 'Cho gà vào xào đều', 'Đổ nước cốt dừa, om 30 phút', 'Cho rau củ vào nấu thêm 15 phút'],
    nutrition: { calories: 320, protein: 26, carbs: 20, fat: 16, fiber: 3 },
    tags: ['Cà ri', 'Nước cốt dừa', 'Đậm đà', 'Ấm áp'],
    cuisine: 'Việt Nam',
    rating: 4.6,
    reviews: 123,
    cost: 75000
  },
  {
    title: 'Bánh xèo',
    description: 'Bánh xèo giòn rụm với nhân tôm thịt và giá đỗ',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop',
    category: 'Món chính',
    difficulty: 'Trung bình',
    cooking_time: '35 phút',
    servings: 4,
    author: 'Cô Sáu',
    status: 'published',
    created_date: '2024-02-05',
    views: 1150,
    ingredients: ['300g bột bánh xèo', '200g tôm', '200g thịt heo', '200g giá đỗ', 'Nước cốt dừa', 'Nghệ, hành lá', 'Rau sống, bánh tráng'],
    instructions: ['Pha bột bánh xèo với nước cốt dừa', 'Tôm bóc vỏ, thịt thái mỏng', 'Đun chảo nóng, quết dầu', 'Đổ bột tạo lớp mỏng', 'Cho nhân vào, đậy nắp', 'Gấp đôi khi bánh chín vàng'],
    nutrition: { calories: 290, protein: 18, carbs: 32, fat: 12, fiber: 3 },
    tags: ['Bánh', 'Giòn', 'Miền Nam', 'Tôm thịt'],
    cuisine: 'Việt Nam',
    rating: 4.5,
    reviews: 167,
    cost: 65000
  },
  {
    title: 'Bún bò Huế',
    description: 'Bún bò Huế cay nồng với hương vị đặc trưng xứ Huế',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    category: 'Món chính',
    difficulty: 'Khó',
    cooking_time: '2 giờ',
    servings: 6,
    author: 'Thầy Tám Huế',
    status: 'published',
    created_date: '2024-02-06',
    views: 1680,
    ingredients: ['500g xương heo', '300g thịt bò', '200g chả cua', '300g bún bò', 'Sả, gừng, hành tím', 'Mắm ruốc, tôm khô', 'Ớt, tiêu, muối'],
    instructions: ['Ninh xương heo 2 tiếng', 'Phi thơm sả, gừng, hành tím', 'Cho mắm ruốc, tôm khô vào xào', 'Đổ nước dùng vào nấu', 'Luộc thịt bò, chả cua', 'Trần bún, múc vào tô'],
    nutrition: { calories: 360, protein: 24, carbs: 38, fat: 12, fiber: 4 },
    tags: ['Bún', 'Cay', 'Huế', 'Đặc sản'],
    cuisine: 'Việt Nam',
    rating: 4.8,
    reviews: 234,
    cost: 70000,
    is_popular: true
  },
  {
    title: 'Gỏi cuốn',
    description: 'Gỏi cuốn tươi mát với tôm thịt và rau thơm',
    image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop',
    category: 'Khai vị',
    difficulty: 'Dễ',
    cooking_time: '25 phút',
    servings: 4,
    author: 'Chị Hoa',
    status: 'published',
    created_date: '2024-02-07',
    views: 890,
    ingredients: ['12 tờ bánh tráng', '200g tôm', '200g thịt heo luộc', '100g bún tươi', 'Rau xà lách, húng quế', 'Chấm tương đậu phộng'],
    instructions: ['Luộc tôm, thịt heo chín', 'Trần bún qua nước sôi', 'Rửa sạch rau thơm', 'Bánh tráng qua nước ấm', 'Cuốn tôm thịt với rau và bún', 'Ăn kèm với tương đậu phộng'],
    nutrition: { calories: 180, protein: 15, carbs: 20, fat: 6, fiber: 3 },
    tags: ['Gỏi cuốn', 'Tươi mát', 'Healthy', 'Khai vị'],
    cuisine: 'Việt Nam',
    rating: 4.4,
    reviews: 145,
    cost: 45000
  },
  {
    title: 'Cháo lòng',
    description: 'Cháo lòng đậm đà, bổ dưỡng cho bữa sáng',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    category: 'Bữa sáng',
    difficulty: 'Trung bình',
    cooking_time: '1 giờ',
    servings: 4,
    author: 'Cô Tư',
    status: 'published',
    created_date: '2024-02-08',
    views: 750,
    ingredients: ['200g gạo tẻ', '300g lòng heo', '100g thịt heo xay', 'Hành tím, gừng', 'Nước mắm, tiêu', 'Hành lá, ngò rí'],
    instructions: ['Vo gạo, nấu cháo nhừ', 'Lòng heo rửa sạch, luộc chín', 'Thịt xay nặn viên nhỏ', 'Cho lòng, thịt viên vào cháo', 'Nêm gia vị vừa ăn', 'Rắc hành lá, ngò rí'],
    nutrition: { calories: 280, protein: 18, carbs: 35, fat: 8, fiber: 2 },
    tags: ['Cháo', 'Bổ dưỡng', 'Bữa sáng', 'Ấm bụng'],
    cuisine: 'Việt Nam',
    rating: 4.3,
    reviews: 98,
    cost: 40000
  }
];

async function importRecipes() {
  console.log('🚀 Bắt đầu import recipes vào Supabase...');
  
  try {
    for (const recipe of remainingRecipes) {
      console.log(`📝 Đang import: ${recipe.title}`);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          category: recipe.category,
          difficulty: recipe.difficulty,
          cooking_time: recipe.cooking_time,
          servings: recipe.servings,
          author: recipe.author,
          status: recipe.status,
          created_date: recipe.created_date,
          views: recipe.views,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          nutrition: recipe.nutrition,
          tags: recipe.tags,
          cuisine: recipe.cuisine,
          rating: recipe.rating,
          reviews: recipe.reviews,
          cost: recipe.cost,
          is_popular: recipe.is_popular || false,
          is_favorite: recipe.is_favorite || false,
          is_user_created: false
        });

      if (error) {
        console.error(`❌ Lỗi khi import ${recipe.title}:`, error);
      } else {
        console.log(`✅ Đã import thành công: ${recipe.title}`);
      }
      
      // Delay nhỏ để tránh rate limit
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Kiểm tra tổng số recipes
    const { count, error: countError } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Lỗi khi đếm recipes:', countError);
    } else {
      console.log(`🎉 Hoàn thành! Tổng cộng có ${count} recipes trong database.`);
    }
    
  } catch (error) {
    console.error('❌ Lỗi tổng quát:', error);
  }
}

// Chạy script
importRecipes();
