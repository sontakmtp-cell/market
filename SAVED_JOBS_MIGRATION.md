# Saved Jobs Feature - Supabase Migration

## Tổng quan
Đã thành công chuyển đổi tính năng "Lưu công việc" từ sử dụng localStorage sang cơ sở dữ liệu Supabase.

## Các file đã tạo/cập nhật

### 1. SQL Script
- **File**: `sql/create_saved_jobs_table.sql`
- **Mục đích**: Tạo bảng `saved_jobs` trong Supabase
- **Chạy lệnh**: Thực thi script này trong SQL Editor của Supabase Dashboard

### 2. Service Layer
- **File**: `src/services/jobService.js`
- **Chức năng**: Cung cấp các API để tương tác với bảng `saved_jobs`
- **Các hàm**:
  - `getSavedJobIds(userId)` - Lấy danh sách job IDs đã lưu
  - `getJobsByIds(jobIds)` - Lấy chi tiết jobs theo IDs
  - `saveJob(userId, jobId)` - Lưu công việc
  - `unsaveJob(userId, jobId)` - Bỏ lưu công việc
  - `checkIfJobSaved(userId, jobId)` - Kiểm tra trạng thái đã lưu
  - `getSavedJobsWithDetails(userId)` - Lấy danh sách jobs đã lưu kèm chi tiết

### 3. UI Components
- **File**: `src/pages/freelancer-dashboard/components/SavedJobs.jsx`
- **Mục đích**: Thay thế `RecommendedJobs.jsx`
- **Tính năng**: Hiển thị danh sách công việc đã lưu, cho phép bỏ lưu

### 4. Cập nhật Logic Save/Unsave
- **JobCard.jsx**: Cập nhật logic lưu/bỏ lưu trong job marketplace
- **ProjectHeader.jsx**: Cập nhật logic lưu/bỏ lưu trong job details

### 5. Dashboard Update
- **freelancer-dashboard/index.jsx**: Thay thế `RecommendedJobs` bằng `SavedJobs`

## Cách sử dụng

### Bước 1: Thiết lập Database (ĐÃ HOÀN THÀNH ✅)
```bash
# Đăng nhập vào Supabase
npx supabase login

# Kết nối với project
npx supabase link --project-ref ioxhmpnspsnzjljvrejr

# Tạo migration
npx supabase migration new create_saved_jobs_table

# Chạy migration
npx supabase db push

# Tạo TypeScript types
npx supabase gen types typescript --linked > src/types/supabase.ts
```

**✅ Đã thực hiện:**
- Bảng `saved_jobs` đã được tạo thành công
- RLS policies đã được áp dụng
- Indexes đã được tối ưu
- TypeScript types đã được generate
- **🔧 Fix lỗi kiểu dữ liệu job_id (20250910070000)**

**📋 Kiểm tra thành công:**
- Migration `20250910065532_create_saved_jobs_table.sql` đã được áp dụng
- Migration `20250910070000_fix_saved_jobs_job_id_type.sql` đã được áp dụng ✅
- Bảng `saved_jobs` với cấu trúc đúng:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key to auth.users)
  - `job_id` (BIGINT, Foreign Key to marketplace_projects.id) ✅
  - `created_at`, `updated_at` (Timestamps)
  - Unique constraint trên (user_id, job_id)
- RLS policies đã được thiết lập đúng
- Trigger tự động cập nhật `updated_at`
- Foreign key relationship với marketplace_projects ✅

### Bước 2: Import Service
```javascript
import { saveJob, unsaveJob, checkIfJobSaved } from '../../../services/jobService';
```

### Bước 3: Sử dụng trong Components
```javascript
// Kiểm tra trạng thái đã lưu
const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
  const checkSaved = async () => {
    if (user?.id && job?.id) {
      const saved = await checkIfJobSaved(user.id, job.id);
      setIsSaved(saved);
    }
  };
  checkSaved();
}, [user?.id, job?.id]);

// Lưu/bỏ lưu job
const handleSaveJob = async () => {
  try {
    if (isSaved) {
      await unsaveJob(user.id, job.id);
      setIsSaved(false);
    } else {
      await saveJob(user.id, job.id);
      setIsSaved(true);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Tính năng chính

### 1. Bảo mật
- Sử dụng Row Level Security (RLS)
- Người dùng chỉ có thể xem/quản lý jobs của mình

### 2. Hiệu suất
- Indexes được tối ưu cho truy vấn
- Unique constraint ngăn duplicate saves

### 3. UI/UX
- Real-time update trạng thái save/unsave
- Loading states cho better UX
- Error handling với notifications

### 4. Data Integrity
- Foreign key constraints
- Cascade delete khi user bị xóa
- Auto-update timestamps

## Files đã xóa
- `src/pages/freelancer-dashboard/components/RecommendedJobs.jsx`

## Lưu ý
- Cần đảm bảo user đã đăng nhập trước khi sử dụng các tính năng save/unsave
- Service tự động handle error cases và authentication checks
- Component SavedJobs hiển thị empty state khi chưa có jobs được lưu

## Khắc phục lỗi (2025-09-10)

### ❌ Vấn đề phát sinh
Sau khi migration, gặp lỗi **"Invalid input syntax for type uuid"** khi:
- Kiểm tra trạng thái saved job (`checkIfJobSaved`)
- Lưu/bỏ lưu job (`saveJob`, `unsaveJob`)
- Lấy danh sách saved jobs (`getSavedJobsWithDetails`)

### 🔍 Nguyên nhân
**Type mismatch giữa các bảng:**
- Bảng `marketplace_projects` có `id` kiểu **bigint**
- Bảng `saved_jobs` có `job_id` kiểu **UUID**
- Không thể join hoặc so sánh giữa bigint và UUID

### ✅ Giải pháp
1. **Tạo migration mới** `20250910070000_fix_saved_jobs_job_id_type.sql`
2. **Sửa kiểu dữ liệu:** `job_id` từ UUID → BIGINT  
3. **Thêm foreign key constraint:** với `marketplace_projects(id)`
4. **Cập nhật TypeScript types**

### 🔧 Migration Script
```sql
-- Drop và recreate bảng với đúng kiểu dữ liệu
DROP TABLE IF EXISTS saved_jobs CASCADE;

CREATE TABLE saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES marketplace_projects(id) ON DELETE CASCADE,
    -- ... các field khác
);
```

### 📝 Kết quả
- ✅ Các lỗi console đã được sửa
- ✅ Join operation hoạt động bình thường  
- ✅ Tính năng save/unsave job hoạt động đúng
- ✅ Foreign key constraint đảm bảo data integrity
