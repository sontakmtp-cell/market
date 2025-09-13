# Hướng dẫn cài đặt và sử dụng hệ thống Categories động

## 🎯 Tổng quan

Hệ thống Categories mới cho phép:
- ✅ Quản lý danh mục động từ database
- ✅ Thêm/sửa/xóa danh mục không cần code
- ✅ Hỗ trợ cấu trúc cha-con (subcategories)
- ✅ Tìm kiếm và lọc danh mục
- ✅ Fallback tự động khi database lỗi
- ✅ Tương thích ngược với code cũ

## 🔧 Cài đặt Supabase

### Bước 1: Chạy Migration
```bash
# Trong thư mục project
cd supabase
npx supabase migration up
```

Hoặc chạy trực tiếp SQL trong Supabase Dashboard:
```sql
-- Copy nội dung từ file 20250912000007_create_categories_table.sql
-- Paste vào SQL Editor trong Supabase Dashboard và Run
```

### Bước 2: Kiểm tra Tables
Sau khi chạy migration, bạn sẽ có 2 table mới:
- `categories` - Chứa thông tin danh mục
- `categories_projects` - Bảng liên kết project và categories

### Bước 3: Cấp quyền RLS (Row Level Security)
Migration đã tự động tạo policies, nhưng nếu cần kiểm tra:

```sql
-- Kiểm tra policies cho categories
SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Kiểm tra policies cho categories_projects  
SELECT * FROM pg_policies WHERE tablename = 'categories_projects';
```

## 🎨 Sử dụng trong Components

### 1. Sử dụng Hook useCategories

```jsx
import { useCategories } from '../hooks/useCategories';

function MyComponent() {
  const { 
    categories,           // Raw categories từ DB
    categoriesForSelect,  // Formatted cho Select component  
    loading,
    error,
    refreshCategories 
  } = useCategories();

  return (
    <Select 
      options={categoriesForSelect}
      loading={loading}
      // ...other props
    />
  );
}
```

### 2. Sử dụng CategoryService trực tiếp

```jsx
import { CategoryService } from '../services/categoryService';

// Lấy tất cả categories
const categories = await CategoryService.getCategories();

// Tìm kiếm categories
const results = await CategoryService.searchCategories('lập trình');

// Lấy categories của project
const projectCats = await CategoryService.getProjectCategories(projectId);

// Cập nhật categories cho project
await CategoryService.updateProjectCategories(projectId, ['web_dev', 'ui_ux']);
```

### 3. Component CategoryManager (Admin)

```jsx
import CategoryManager from '../components/CategoryManager';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <CategoryManager />
    </div>
  );
}
```

## 📊 Cấu trúc Database

### Table: categories
```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,              -- Tên hiển thị
  slug TEXT UNIQUE NOT NULL,       -- URL-friendly identifier
  description TEXT,                -- Mô tả danh mục
  parent_id BIGINT REFERENCES categories(id), -- Danh mục cha
  is_active BOOLEAN DEFAULT true,  -- Có hiển thị không
  sort_order INTEGER DEFAULT 0,    -- Thứ tự sắp xếp
  icon TEXT,                       -- Emoji/icon
  color TEXT,                      -- Màu hiển thị
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Table: categories_projects  
```sql
CREATE TABLE categories_projects (
  id BIGINT PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id),
  project_id BIGINT REFERENCES marketplace_projects(id), 
  created_at TIMESTAMP DEFAULT now()
);
```

## 🔄 Migration từ hệ thống cũ

### Automatic Fallback
Hệ thống tự động fallback về danh mục hard-coded nếu:
- Database không kết nối được
- Table categories chưa tồn tại
- Có lỗi khi query

### Manual Migration
Nếu có dữ liệu cũ cần migrate:

```sql
-- Migrate từ trường category sang categories_projects
INSERT INTO categories_projects (category_id, project_id)
SELECT c.id, mp.id
FROM marketplace_projects mp
JOIN categories c ON c.slug = mp.category
WHERE mp.category IS NOT NULL;
```

## 🎛️ Quản lý Categories

### 1. Thêm danh mục mới qua UI
- Sử dụng component `CategoryManager`
- Admin có thể thêm/sửa/xóa categories
- Tự động generate slug từ tên

### 2. Thêm danh mục qua SQL
```sql
INSERT INTO categories (name, slug, description, icon, color, sort_order)
VALUES (
  'Blockchain Development',
  'blockchain_dev', 
  'Phát triển ứng dụng blockchain và smart contracts',
  '⛓️',
  '#F59E0B',
  50
);
```

### 3. Tạo subcategories
```sql
-- Tạo danh mục cha
INSERT INTO categories (name, slug, description, sort_order)
VALUES ('Programming', 'programming', 'Lập trình', 1);

-- Tạo danh mục con
INSERT INTO categories (name, slug, description, parent_id, sort_order)
VALUES (
  'Frontend Development',
  'frontend_dev',
  'Phát triển giao diện người dùng', 
  (SELECT id FROM categories WHERE slug = 'programming'),
  11
);
```

## 🔍 Search và Filter

### 1. Tìm kiếm categories
```jsx
const { searchCategories } = useCategories({ autoFetch: false });

// Tìm kiếm theo tên
await searchCategories('lập trình');

// Tìm kiếm theo mô tả  
await searchCategories('web development');
```

### 2. Lọc theo parent category
```jsx
const { categories } = useCategories({ 
  parentId: null  // Chỉ lấy categories gốc
});

const subcategories = useCategories({
  parentId: 1     // Lấy categories con của category có id = 1
});
```

## 🚨 Troubleshooting

### 1. Categories không load được
```jsx
// Kiểm tra lỗi trong console
const { categories, error } = useCategories();
if (error) {
  console.log('Categories error:', error);
}

// Kiểm tra fallback
import { CategoryService } from '../services/categoryService';
const fallback = CategoryService.getFallbackCategories();
```

### 2. Migration thất bại
```sql
-- Kiểm tra table đã tồn tại chưa
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'categories';

-- Kiểm tra RLS policies
SELECT * FROM pg_policies WHERE tablename = 'categories';
```

### 3. Không thể thêm categories cho project
```sql
-- Kiểm tra quyền của user hiện tại
SELECT auth.uid();

-- Kiểm tra project có thuộc về user không
SELECT * FROM marketplace_projects WHERE id = PROJECT_ID AND client_user_id = auth.uid();
```

## 📈 Performance Tips

### 1. Caching Categories
```jsx
// Categories ít thay đổi nên có thể cache
const { categories } = useCategories({ autoFetch: true });

// Refresh khi cần
const handleRefresh = () => {
  refreshCategories();
};
```

### 2. Lazy Loading
```jsx
// Chỉ load khi cần
const { categories, fetchCategories } = useCategories({ autoFetch: false });

useEffect(() => {
  if (showCategorySelector) {
    fetchCategories();
  }
}, [showCategorySelector]);
```

### 3. Indexes
Migration đã tạo các index cần thiết:
- `idx_categories_slug` - Tìm kiếm theo slug
- `idx_categories_parent_id` - Lọc theo parent
- `idx_categories_active` - Lọc categories active

## 🎉 Tính năng mở rộng

### 1. Category Analytics
```sql
-- Thống kê project theo category
SELECT c.name, COUNT(cp.project_id) as project_count
FROM categories c
LEFT JOIN categories_projects cp ON c.id = cp.category_id
GROUP BY c.id, c.name
ORDER BY project_count DESC;
```

### 2. Trending Categories
```sql
-- Categories hot trong 30 ngày
SELECT c.name, COUNT(cp.project_id) as recent_projects
FROM categories c
JOIN categories_projects cp ON c.id = cp.category_id
JOIN marketplace_projects mp ON cp.project_id = mp.id
WHERE mp.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name
ORDER BY recent_projects DESC
LIMIT 10;
```

### 3. Category Recommendations
```jsx
// Gợi ý categories dựa trên skills
const suggestCategories = (skills) => {
  // Logic gợi ý categories phù hợp
  return categories.filter(cat => 
    skills.some(skill => 
      cat.name.toLowerCase().includes(skill.toLowerCase()) ||
      cat.description?.toLowerCase().includes(skill.toLowerCase())
    )
  );
};
```

## 📝 Changelog

### Version 1.0.0 (2025-09-12)
- ✅ Tạo tables categories và categories_projects
- ✅ CategoryService với đầy đủ CRUD operations
- ✅ useCategories hook với caching và error handling
- ✅ CategoryManager component cho admin
- ✅ Tích hợp vào JobPost component
- ✅ Fallback system khi database lỗi
- ✅ RLS policies và security
- ✅ Performance indexes

### Roadmap
- 🔄 Category icons upload
- 🔄 Bulk category operations
- 🔄 Category import/export
- 🔄 Category usage analytics
- 🔄 Multi-language category names
