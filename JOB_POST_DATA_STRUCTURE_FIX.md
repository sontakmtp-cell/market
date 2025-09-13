# Job Post Data Structure Fix

## Tổng quan
Tài liệu này mô tả các thay đổi đã thực hiện để sửa lại cấu trúc dữ liệu của trang `/job-post/edit/` để đảm bảo lưu và trích xuất đúng dữ liệu trên Supabase.

## Vấn đề đã được giải quyết

### 1. Mapping dữ liệu không nhất quán
- **Vấn đề**: Dữ liệu từ form không được map đúng với cấu trúc database
- **Giải pháp**: Cập nhật mapping trong `handleSubmit` và `useEffect` load data

### 2. Xử lý kiểu dữ liệu không đúng
- **Vấn đề**: String/number conversion không nhất quán
- **Giải pháp**: Thêm proper type conversion trong `dataStore.js`

### 3. Cấu trúc database thiếu trường
- **Vấn đề**: Một số trường VIP và metadata không có trong database
- **Giải pháp**: Tạo migration script để thêm các trường cần thiết

## Các thay đổi chi tiết

### 1. File `src/pages/job-post/index.jsx`

#### Cập nhật data mapping khi load project:
```javascript
// Map database fields to form data structure with proper data type conversion
setFormData({
  // ... existing fields
  budgetMin: projectData.budgetMin ? projectData.budgetMin.toString() : '',
  budgetMax: projectData.budgetMax ? projectData.budgetMax.toString() : '',
  isUrgent: Boolean(projectData.isUrgent),
  objectives: Array.isArray(projectData.objectives) && projectData.objectives.length > 0 
    ? projectData.objectives 
    : [''],
  deliverables: Array.isArray(projectData.deliverables) && projectData.deliverables.length > 0 
    ? projectData.deliverables 
    : [{ title: '', description: '', deadline: '' }],
  client: {
    name: projectData.client?.name || 'Khách hàng',
    company: projectData.client?.company || '',
    rating: Number(projectData.client?.rating) || 5,
    reviewCount: Number(projectData.client?.reviewCount) || 0,
    location: projectData.client?.location || ''
  }
});
```

#### Cập nhật data cleaning khi save:
```javascript
const cleanData = {
  // ... existing fields
  budgetMin: parseFloat(formData.budgetMin) || 0,
  budgetMax: parseFloat(formData.budgetMax) || 0,
  postDuration: parseInt(formData.postDuration) || 30,
  objectives: formData.objectives.filter(obj => obj && obj.trim()),
  deliverables: formData.deliverables.filter(del => del && del.title && del.title.trim()),
  isUrgent: Boolean(formData.isUrgent),
  skills: Array.isArray(formData.skills) ? formData.skills : [],
  client: {
    name: formData.client?.name || 'Khách hàng',
    company: formData.client?.company || '',
    rating: Number(formData.client?.rating) || 5,
    reviewCount: Number(formData.client?.reviewCount) || 0,
    location: formData.client?.location || ''
  }
};
```

### 2. File `src/utils/dataStore.js`

#### Cập nhật hàm `saveProject`:
```javascript
const projectData = {
  // ... existing fields
  budgetMin: typeof project?.budgetMin === 'number' ? project.budgetMin : 
    (typeof project?.budgetMin === 'string' ? parseFloat(project.budgetMin) || 0 : 0),
  budgetMax: typeof project?.budgetMax === 'number' ? project.budgetMax : 
    (typeof project?.budgetMax === 'string' ? parseFloat(project.budgetMax) || 0 : 0),
  postDuration: typeof project?.postDuration === 'number' ? project.postDuration : 
    (typeof project?.postDuration === 'string' ? parseInt(project.postDuration) || 30 : 30),
  isUrgent: Boolean(project?.isUrgent),
  // ... VIP fields
  ...(typeof project?.vipExpiresAt !== 'undefined' ? { vipExpiresAt: project.vipExpiresAt } : {}),
  ...(typeof project?.vipPaymentReference !== 'undefined' ? { vipPaymentReference: project.vipPaymentReference } : {}),
  ...(typeof project?.vipPaymentStatus !== 'undefined' ? { vipPaymentStatus: project.vipPaymentStatus } : {}),
  ...(typeof project?.postExpiresAt !== 'undefined' ? { postExpiresAt: project.postExpiresAt } : {}),
  ...(typeof project?.autoDeleteAt !== 'undefined' ? { autoDeleteAt: project.autoDeleteAt } : {}),
};
```

#### Cập nhật hàm `getProjectById`:
```javascript
// Ensure proper data type conversion for form compatibility
if (data) {
  return {
    ...data,
    budgetMin: data.budgetMin || 0,
    budgetMax: data.budgetMax || 0,
    postDuration: data.postDuration || 30,
    isUrgent: Boolean(data.isUrgent),
    skills: Array.isArray(data.skills) ? data.skills : [],
    objectives: Array.isArray(data.objectives) ? data.objectives : [],
    deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    client: data.client || {
      name: 'Khách hàng',
      company: '',
      rating: 5,
      reviewCount: 0,
      location: ''
    }
  };
}
```

### 3. Database Migration

#### File `supabase/migrations/20250912000009_fix_job_post_data_structure.sql`:
- Thêm các trường VIP còn thiếu: `vipExpiresAt`, `vipPaymentReference`, `vipPaymentStatus`
- Thêm các trường metadata: `postExpiresAt`, `autoDeleteAt`, `technicalRequirements`
- Cập nhật dữ liệu hiện có để đảm bảo tính nhất quán
- Thêm indexes để cải thiện performance
- Thêm comments để documentation

### 4. Migration Script

#### File `scripts/run-job-post-migration.js`:
- Script để chạy migration một cách an toàn
- Kiểm tra environment variables
- Verify migration results
- Error handling và logging

## Cách sử dụng

### 1. Chạy migration:
```bash
node scripts/run-job-post-migration.js
```

### 2. Debug nếu có lỗi:
```bash
node scripts/debug-job-post-edit.js
```

### 3. Kiểm tra kết quả:
- Truy cập trang `/job-post/edit/{id}` để test chức năng edit
- Kiểm tra dữ liệu được load và save đúng
- Verify VIP features hoạt động đúng

### 4. Kiểm tra console logs:
- Mở Developer Tools (F12)
- Xem tab Console để thấy lỗi cụ thể
- Kiểm tra Network tab để xem request/response

## Lợi ích

1. **Tính nhất quán**: Dữ liệu được map đúng giữa form và database
2. **Type Safety**: Đảm bảo kiểu dữ liệu đúng khi save/load
3. **Tương thích**: Hỗ trợ đầy đủ các tính năng VIP và metadata
4. **Performance**: Thêm indexes để cải thiện query performance
5. **Maintainability**: Code dễ maintain và debug hơn

## Lưu ý

- Migration script cần quyền Service Role để thực hiện
- Backup database trước khi chạy migration
- Test kỹ chức năng edit sau khi migration
- Kiểm tra logs để đảm bảo migration thành công

## Troubleshooting

### Lỗi thường gặp:
1. **Environment variables missing**: Kiểm tra `.env` file
2. **Permission denied**: Đảm bảo có Service Role key
3. **Migration failed**: Kiểm tra database connection và SQL syntax
4. **Data not loading**: Kiểm tra RLS policies và user permissions
5. **Array column type errors**: Chạy migration `20250912000010_fix_array_column_types.sql`
6. **Update project fails**: Chạy debug script để xác định lỗi cụ thể

### Debug steps:
1. **Chạy debug script**: `node scripts/debug-job-post-edit.js`
2. **Check browser console**: Mở F12 và xem Console tab
3. **Verify database schema**: Kiểm tra các cột ARRAY có đúng kiểu dữ liệu
4. **Test with sample data**: Sử dụng debug script để test từng phần
5. **Check Supabase logs**: Xem logs trong Supabase dashboard

### Lỗi cụ thể và cách sửa:

#### Lỗi "syntax error at or near ARRAY":
```sql
-- Chạy migration này để sửa
ALTER TABLE marketplace_projects 
ALTER COLUMN skills TYPE text[] USING COALESCE(skills, ARRAY[]::text[]);
```

#### Lỗi "column does not exist":
- Kiểm tra tên cột có đúng không
- Chạy migration để thêm cột còn thiếu

#### Lỗi "permission denied":
- Kiểm tra RLS policies
- Đảm bảo user có quyền update
- Kiểm tra authentication
