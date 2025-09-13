# Job Post Structure Update

## Tóm tắt thay đổi

Đã thực hiện các thay đổi theo yêu cầu trong form `/job-post`:

### ✅ Hoàn thành

1. **Loại bỏ section "Yêu cầu kỹ thuật"** - Đã xóa hoàn toàn
2. **Loại bỏ field "Thời gian thực hiện"** - Đã xóa khỏi form
3. **Thay đổi "Hạn chót" thành "Thời gian duy trì bài đăng"** - Với 3 tùy chọn: 7, 15, 30 ngày
4. **Tạo migration script cho database** - File: `20250912000008_update_job_post_structure.sql`
5. **Cập nhật UI components** - JobCard và JobCardVIP hiển thị thời gian duy trì thay vì deadline

### 🔄 Thay đổi Database

#### Columns mới:
- `postDuration` (integer): Thời gian duy trì bài đăng (7, 15, hoặc 30 ngày)
- `postExpiresAt` (timestamp): Thời điểm bài đăng hết hạn
- `autoDeleteAt` (timestamp): Thời điểm tự động xóa nếu không có đề xuất được chấp nhận

#### Columns deprecated (vẫn giữ để tương thích):
- `duration` - Không còn sử dụng trong form mới
- `deadline` - Không còn sử dụng trong form mới  
- `technicalRequirements` - Không còn sử dụng trong form mới

### 🛠 Logic mới

1. **Tự động tính toán thời gian hết hạn**: Database trigger tự động tính `postExpiresAt` và `autoDeleteAt`
2. **Tự động xóa bài đăng hết hạn**: Function `auto_delete_expired_posts()` để xóa bài đăng hết hạn không có đề xuất được chấp nhận
3. **Gia hạn bài đăng**: Function `extend_post_duration()` cho phép gia hạn bài đăng

## 📋 Cách chạy Migration

### Bước 1: Thiết lập biến môi trường
```bash
# Trong PowerShell
$env:VITE_SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
```

### Bước 2: Chạy migration
```bash
node scripts/run-migration.js 20250912000008_update_job_post_structure.sql
```

### Hoặc chạy trực tiếp trong Supabase Dashboard
Copy nội dung file `supabase/migrations/20250912000008_update_job_post_structure.sql` và paste vào SQL Editor trong Supabase Dashboard.

## 🎯 Tính năng mới

### Form Job Post
- Dropdown "Thời gian duy trì bài đăng" với 3 tùy chọn: 7, 15, 30 ngày
- Ghi chú: "Bài đăng sẽ tự động bị xóa sau thời gian này nếu không có đề xuất nào được chấp nhận"
- Đã loại bỏ hoàn toàn section "Yêu cầu kỹ thuật"
- Đã loại bỏ field "Thời gian thực hiện"

### Job Cards
- Hiển thị "Còn X ngày" thay vì deadline cố định
- Màu sắc cảnh báo: đỏ (≤3 ngày), vàng (≤7 ngày), xanh (>7 ngày)

### Functions hỗ trợ
- `extend_post_duration(project_id, additional_days)`: Gia hạn bài đăng
- `auto_delete_expired_posts()`: Tự động xóa bài đăng hết hạn
- `cleanup_expired_posts_job()`: Scheduled job để cleanup

## 🔍 Testing

1. Tạo bài đăng mới với thời gian duy trì 7 ngày
2. Kiểm tra hiển thị "Còn X ngày" trong job cards
3. Verify database có các columns mới
4. Test gia hạn bài đăng (nếu cần)

## ⚠️ Lưu ý

- Các bài đăng cũ sẽ được set mặc định 30 ngày từ thời điểm tạo
- Các columns cũ vẫn được giữ để tương thích ngược
- Cần thiết lập cron job để chạy `cleanup_expired_posts_job()` định kỳ
- Form validation đã được cập nhật cho `postDuration`
