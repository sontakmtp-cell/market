# Proposals Integration - Hướng Dẫn Sử Dụng

## ✅ Đã Hoàn Thành

Tích hợp Supabase cho tính năng đề xuất (proposals) đã được hoàn thành thành công với các bước sau:

### Bước 1: Cập nhật `src/pages/job-details/index.jsx`

- ✅ **Import hooks và context**: Đã thêm `useSupabase` từ `SupabaseContext`
- ✅ **Lấy thông tin người dùng**: Sử dụng `const { supabase, user } = useSupabase()`
- ✅ **State quản lý proposals**: Thêm `const [proposals, setProposals] = useState([])`
- ✅ **Fetch proposals từ Supabase**: Tạo `useEffect` để load dữ liệu từ bảng `proposals`
- ✅ **Cập nhật hàm submit**: `handleSubmitProposal` bây giờ lưu vào Supabase và cập nhật UI
- ✅ **Truyền props**: Cập nhật `<ExistingProposals proposals={proposals} />` và `<ProposalForm onSubmitProposal={handleSubmitProposal} />`

### Bước 2: Cập nhật `src/pages/job-details/components/ExistingProposals.jsx`

- ✅ **Nhận props**: Component nhận `proposals` từ props thay vì dữ liệu mock
- ✅ **Xử lý empty state**: Thêm UI cho trường hợp chưa có đề xuất nào
- ✅ **Điều chỉnh cấu trúc dữ liệu**: Hoạt động với dữ liệu từ Supabase

### Bước 3: `src/pages/job-details/components/ProposalForm.jsx`

- ✅ **Component đã sẵn sàng**: Đã được thiết kế tốt để nhận `onSubmitProposal` từ props
- ✅ **Gọi hàm submit**: Sử dụng `await onSubmitProposal(formData)` trong `handleSubmit`

## 📊 Schema Database

Bảng `proposals` có cấu trúc:

```sql
create table public.proposals (
  id uuid not null default gen_random_uuid (),
  project_id text not null,
  freelancer_id uuid null,
  bid_amount numeric not null,
  timeline text null,
  cover_letter text null,
  status text not null default 'submitted'::text,
  created_at timestamp with time zone not null default now(),
  constraint proposals_pkey primary key (id),
  constraint proposals_freelancer_id_fkey foreign KEY (freelancer_id) references auth.users (id) on delete CASCADE
);
```

## 🚀 Cách Sử Dụng

1. **Đăng nhập**: Người dùng cần đăng nhập để gửi đề xuất
2. **Truy cập trang job details**: Vào trang chi tiết công việc `/job-details/:id`
3. **Xem đề xuất hiện tại**: Click tab "Đề xuất hiện tại" để xem proposals đã có
4. **Gửi đề xuất mới**: Click tab "Gửi đề xuất", điền form và submit
5. **Tự động cập nhật**: UI sẽ tự động hiển thị đề xuất mới sau khi gửi thành công

## 🔧 Tính Năng Đã Thực Hiện

- ✅ Lưu proposals vào Supabase
- ✅ Hiển thị danh sách proposals từ database
- ✅ Xử lý authentication (chỉ user đã đăng nhập mới gửi được)
- ✅ Real-time UI update sau khi gửi proposal
- ✅ Error handling và thông báo lỗi
- ✅ Empty state khi chưa có proposals

## 📝 Cần Phát Triển Thêm

1. **Portfolio Upload**: Upload file portfolio lên Supabase Storage
2. **Profiles Table**: Tạo bảng profiles để lưu thông tin freelancer đầy đủ
3. **Real-time Updates**: Sử dụng Supabase realtime cho proposals mới
4. **Proposal Status**: Quản lý trạng thái proposals (accepted, rejected, etc.)
5. **Notifications**: Thông báo cho client khi có proposal mới

## 🧪 Testing

Để test tính năng:

1. Chạy app: `npm run dev`
2. Đăng nhập với tài khoản có sẵn
3. Truy cập trang job details với project ID hợp lệ
4. Thử gửi đề xuất mới
5. Kiểm tra trong Supabase dashboard xem dữ liệu đã được lưu

## 🎯 Kết Luận

Tích hợp Supabase cho proposals đã hoàn thành thành công. Hệ thống bây giờ có thể:
- Lưu và đọc proposals từ database thật
- Hiển thị UI dynamic dựa trên dữ liệu thật
- Xử lý authentication và authorization
- Cập nhật real-time sau khi submit

Tất cả code đã được test và build thành công! 🎉
