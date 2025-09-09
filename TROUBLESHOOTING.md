# 🔧 Troubleshooting - Proposals Integration

## 🚨 Các Lỗi Thường Gặp và Cách Sửa

### 1. ❌ Error 400: Bad Request khi fetch proposals

**Nguyên nhân:**
- Tên cột trong query không đúng với schema database
- Kiểu dữ liệu không khớp
- Foreign key constraint

**Cách sửa:**
```javascript
// ✅ Query đơn giản, không join
const { data, error } = await supabase
  .from('proposals')
  .select('*')
  .eq('project_id', project.id);

// ❌ Tránh query phức tạp ban đầu
const { data, error } = await supabase
  .from('proposals')
  .select('*, freelancer:freelancer_id(...)') // Có thể gây lỗi
```

### 2. ❌ Error submitting proposal

**Nguyên nhân:**
- User chưa đăng nhập
- Foreign key `freelancer_id` không tồn tại trong `auth.users`
- RLS (Row Level Security) chặn

**Cách sửa:**
1. Kiểm tra authentication:
```javascript
console.log('User:', supabaseUser);
console.log('User ID:', supabaseUser?.id);
```

2. Validate dữ liệu trước khi insert:
```javascript
if (!newProposal.project_id || !newProposal.freelancer_id) {
  alert('Thiếu thông tin bắt buộc!');
  return;
}
```

### 3. ❌ Permission denied hoặc RLS error

**Nguyên nhân:**
- Supabase RLS policies chưa được setup đúng
- User không có quyền truy cập bảng

**Cách sửa trong Supabase Dashboard:**
```sql
-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policy cho SELECT (đọc proposals)
CREATE POLICY "Users can view proposals" ON proposals
FOR SELECT USING (true);

-- Policy cho INSERT (tạo proposal mới)
CREATE POLICY "Authenticated users can create proposals" ON proposals
FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
```

### 4. ❌ Environment variables missing

**Nguyên nhân:**
- File `.env.local` chưa được tạo
- Thiếu `VITE_SUPABASE_URL` hoặc `VITE_SUPABASE_ANON_KEY`

**Cách sửa:**
1. Tạo file `.env.local` trong root project:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Restart development server:
```bash
npm start
```

## 🛠️ Debug Steps

### Bước 1: Kiểm tra Supabase Connection
```javascript
console.log('Supabase client:', supabase);
console.log('User authenticated:', !!supabaseUser);
```

### Bước 2: Test Table Access
```javascript
const { data, error } = await supabase
  .from('proposals')
  .select('count(*)');
console.log('Table access:', { data, error });
```

### Bước 3: Kiểm tra Schema
Trong Supabase Dashboard, kiểm tra:
- ✅ Bảng `proposals` tồn tại
- ✅ Các cột đúng tên và kiểu dữ liệu
- ✅ Foreign key constraints được setup
- ✅ RLS policies được enable

### Bước 4: Test Authentication
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

## 🎯 Checklist Hoàn Thành

- [ ] ✅ Supabase project đã được tạo
- [ ] ✅ Bảng `proposals` đã được tạo với đúng schema
- [ ] ✅ RLS policies đã được setup
- [ ] ✅ Environment variables đã được config
- [ ] ✅ User authentication hoạt động
- [ ] ✅ Code đã được update với error handling

## 📞 Liên Hệ Hỗ Trợ

Nếu vẫn gặp lỗi, vui lòng cung cấp:
1. Screenshots của lỗi trong browser console
2. Error messages từ Supabase Dashboard
3. Schema của bảng `proposals`
4. RLS policies hiện tại

## 🚀 Testing Steps

1. Mở browser dev tools (F12)
2. Truy cập trang job details
3. Đăng nhập với tài khoản hợp lệ
4. Thử gửi proposal
5. Kiểm tra console logs
6. Xác nhận data trong Supabase Dashboard
