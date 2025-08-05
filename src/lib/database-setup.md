# Kitchen Command Center - Database Setup Guide

## 🎯 Lựa chọn Backend cho Low-Tech Users

### Option 1: Supabase (Đề xuất nhất) ⭐⭐⭐⭐⭐

**Ưu điểm:**
- ✅ Setup cực kỳ dễ dàng (5 phút)
- ✅ Có Auth, Database, Storage, Real-time built-in
- ✅ Free tier rộng rãi (500MB database, 50MB file storage)
- ✅ Dashboard trực quan
- ✅ Auto-generated API
- ✅ TypeScript support tốt

**Setup:**
```bash
npm install @supabase/supabase-js
```

```sql
-- SQL Tables cho Supabase
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time INTEGER DEFAULT 0,
  cook_time INTEGER DEFAULT 0,
  servings INTEGER DEFAULT 1,
  difficulty VARCHAR CHECK (difficulty IN ('easy', 'medium', 'hard')),
  nutrition JSONB DEFAULT '{}',
  image_url TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type VARCHAR CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  notes JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_name VARCHAR NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit VARCHAR DEFAULT 'piece',
  expiry_date DATE,
  category VARCHAR DEFAULT 'other',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own meal plans" ON meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meals" ON meals FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)
);
```

### Option 2: Firebase Firestore ⭐⭐⭐⭐

**Ưu điểm:**
- ✅ Tích hợp tốt với Google services
- ✅ Real-time updates
- ✅ Offline support
- ✅ Free tier tốt

**Setup:**
```bash
npm install firebase
```

```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Option 3: PocketBase (Self-hosted) ⭐⭐⭐

**Ưu điểm:**
- ✅ Chỉ cần 1 file executable
- ✅ Admin UI built-in
- ✅ Real-time subscriptions
- ✅ File storage included

**Setup:**
```bash
# Download PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_darwin_amd64.zip

# Run
./pocketbase serve
```

### Option 4: JSON Server (Prototype nhanh) ⭐⭐

**Chỉ dùng cho demo/prototype:**
```bash
npm install -g json-server
```

```json
{
  "users": [],
  "mealPlans": [],
  "recipes": [],
  "meals": [],
  "shoppingLists": [],
  "inventory": []
}
```

## 🚀 Triển khai Production

### Vercel + Supabase (Đề xuất)
```bash
# Deploy frontend
vercel --prod

# Database đã có sẵn trên Supabase cloud
```

### Netlify + Firebase
```bash
# Deploy frontend
netlify deploy --prod

# Database đã có sẵn trên Firebase
```

## 📱 Mobile App (Tương lai)

### React Native + Expo
```bash
npx create-expo-app KitchenCommandCenter
```

### PWA (Progressive Web App)
- Thêm service worker
- Offline support
- Install prompt

## 🔧 Development Workflow

1. **Local Development:**
   - Supabase local development
   - Hot reload với Vite

2. **Testing:**
   - Unit tests với Vitest
   - E2E tests với Playwright

3. **Deployment:**
   - Auto deploy từ GitHub
   - Environment variables
   - Database migrations

## 💡 Tips cho Low-Tech Users

1. **Bắt đầu với Supabase:**
   - Tạo account miễn phí
   - Tạo project mới
   - Copy connection string
   - Paste vào .env file

2. **Backup dữ liệu:**
   - Supabase có auto backup
   - Export CSV từ dashboard

3. **Monitoring:**
   - Supabase dashboard
   - Usage metrics
   - Error logs

4. **Scaling:**
   - Upgrade plan khi cần
   - Add more storage
   - Enable CDN
