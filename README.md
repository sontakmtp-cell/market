## TechMarketplace Pro — Tài liệu dự án

Nền tảng kết nối khách hàng và freelancer cho các dự án kỹ thuật, kèm các mô-đun mở rộng: tuyển dụng & CV, gian hàng sản phẩm số, và công cụ tính toán kỹ thuật.

**Công Nghệ**
- React 18: giao diện hiện đại, component-based
- Vite: dev server nhanh, build tối ưu
- React Router v6: định tuyến client-side
- Tailwind CSS: utility-first CSS, cấu hình mở rộng trong `tailwind.config.js`
- State: Redux Toolkit và/hoặc Zustand tùy màn hình
- Supabase JS: xác thực, database, storage
- Thư viện: date-fns, Recharts, Framer Motion, React Hook Form

**Yêu Cầu Môi Trường**
- Node.js 18+ và npm
- Tạo file `/.env.local` với các biến bắt buộc:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Các biến trong `/.env` (OpenAI, Stripe...) là tùy chọn; có thể để trống nếu không dùng.

**Cài Đặt & Chạy**
- Cài dependencies: `npm install`
- Chạy dev: `npm start` → http://localhost:5173
- Build: `npm run build`
- Xem bản build: `npm run serve`

**Cấu Trúc Thư Mục**
- `public/`: static assets
- `src/`
  - `components/`: UI components dùng lại
  - `pages/`: các trang tính năng (job, profile, messages...)
  - `services/`: gọi Supabase/API, xử lý nghiệp vụ
  - `lib/supabaseClient.js`: khởi tạo Supabase client
  - `Routes.jsx`: định nghĩa route chính
  - `index.jsx`, `App.jsx`: bootstrap ứng dụng
- `supabase/migrations/`: các file SQL migration

**Định Tuyến Chính**
- `/homepage`
- `/job-marketplace`
- `/job-details` và `/job-details/:id`
- `/job-post` và `/job-post/edit/:id` (yêu cầu đăng nhập)
- `/freelancer-dashboard` (yêu cầu đăng nhập)
- `/recruitment-job-board`
- `/employer-job-posting`, `/cv-submission-portal`, `/recruitment-management-dashboard` (yêu cầu đăng nhập)
- `/profile/manage`, `/profile/:username`
- `/messages`, `/messages/:conversationId` (yêu cầu đăng nhập)

**Cơ Sở Dữ Liệu (Supabase)**
- Migrations: `supabase/migrations/*.sql`
- Áp dụng migrations (chọn 1 cách):
  - Supabase Dashboard → SQL Editor → chạy từng file theo thứ tự thời gian
  - Supabase CLI (nếu đã cài) để apply migrations vào project của bạn
- Cấu hình kết nối qua `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong `.env.local`.

**Kiểm Thử & Chất Lượng Mã**
- Test: `npm run test`, `npm run test:ui`, `npm run test:coverage`
- Lint: `npm run lint` · Sửa: `npm run lint:fix`
- Format: `npm run format`

**Ghi Chú Bảo Trì**
- Dọn rác: đã loại bỏ module trùng lặp `src/pages/messages-new` và các file placeholder rỗng không còn được import.
- `test-connection.js` là tiện ích nội bộ để kiểm tra kết nối Supabase trong môi trường Vite; không bắt buộc dùng trong CI/CD.

**Mô‑đun & Cách Hoạt Động**

1) Job Marketplace (đấu thầu dự án)
- Mục tiêu: Kết nối khách hàng đăng dự án với freelancer gửi đề xuất (proposal).
- Thực thể chính: project, proposal, saved_job, profile (client/freelancer).
- Màn hình chính:
  - `src/pages/job-marketplace/index.jsx:1`: danh sách việc + lọc.
  - `src/pages/job-details/index.jsx:1`: chi tiết dự án, nộp proposal, xem đề xuất hiện có.
    - Thành phần: `src/pages/job-details/components/ProjectHeader.jsx:1`, `src/pages/job-details/components/ExistingProposals.jsx:1`.
  - `src/pages/job-post/index.jsx:1`: tạo/sửa job (yêu cầu đăng nhập).
  - `src/pages/freelancer-dashboard/index.jsx:1`: tổng quan freelancer, hợp đồng đang hoạt động.
    - Thành phần: `src/pages/freelancer-dashboard/components/ActiveContracts.jsx:1`.
- Luồng điển hình:
  - Client tạo job → hiển thị ở Job Marketplace → Freelancer lọc và nộp proposal → Client xem và chấp nhận đề xuất phù hợp → Tạo hợp đồng và theo dõi ở dashboard.

2) Tuyển dụng & CV
- Mục tiêu: Nhà tuyển dụng đăng JD; ứng viên nộp CV và theo dõi trạng thái.
- Màn hình chính:
  - `src/pages/recruitment-job-board/index.jsx:1`: bảng việc tuyển dụng, lọc theo tiêu chí.
  - `src/pages/cv-submission-portal/index.jsx:1`: cổng nộp CV, theo dõi hồ sơ.
  - `src/pages/recruitment-management-dashboard/index.jsx:1`: dashboard quản trị quy trình tuyển dụng.
- Luồng điển hình: Nhà tuyển dụng đăng JD → Ứng viên nộp CV → Hệ thống cập nhật trạng thái (nhận, sàng lọc, phỏng vấn, offer...).

3) Quản lý Hợp đồng (Contracts)
- Mục tiêu: Chuẩn hóa quá trình từ chấp nhận proposal → tạo hợp đồng → theo dõi tiến độ/thanh toán.
- Dữ liệu & Migration:
  - `supabase/migrations/20250910000000_create_base_tables.sql:1`
  - `supabase/migrations/20250910000001_create_contracts_table.sql:1`
- Mã nguồn liên quan:
  - `src/services/contractService.js:1`
  - `src/pages/freelancer-dashboard/components/ActiveContracts.jsx:1`
  - Tài liệu: `CONTRACT_MANAGEMENT.md:1`, `CONTRACT_IMPLEMENTATION_REPORT.md:1`
- Luồng điển hình: Client chấp nhận đề xuất → Tạo bản ghi hợp đồng trên Supabase → Hai bên theo dõi trạng thái và cập nhật tiến độ.

4) Nhắn tin (Chat & Messages)
- Mục tiêu: Trao đổi giữa client/freelancer theo từng cuộc trò chuyện, gắn với dự án khi cần.
- Màn hình chính:
  - `src/pages/messages/index.jsx:1` với các thành phần:
    - `src/pages/messages/components/ChatSidebar.jsx:1`
    - `src/pages/messages/components/ChatWindow.jsx:1`
    - `src/pages/messages/components/UserProfile.jsx:1`
- Dịch vụ: `src/services/chatService.js:1`
- Trạng thái hiện tại: UI đã có và đang dùng dữ liệu mẫu (mock). Khi kết nối backend, bổ sung các bảng `conversations`/`messages` và cập nhật `chatService` để đọc/ghi từ Supabase.

5) Hồ sơ cá nhân (Profile)
- Màn hình công khai: `src/pages/profile-public/index.jsx:1` (kèm các component con hiển thị kinh nghiệm, học vấn, portfolio...).
- Quản trị hồ sơ: `src/pages/profile-manage/index.jsx:1` và `src/pages/profile-manage/simple.jsx:1`.
- Luồng: Người dùng cập nhật hồ sơ → Hiển thị trên trang công khai theo vai trò (client/freelancer/employer).

6) Các mô‑đun dự kiến (Planned)
- Gian hàng sản phẩm số: bán ebook/phần mềm/khóa học; sẽ có danh mục, đánh giá, checkout (Stripe/VNPAY). Chưa kích hoạt UI trong code hiện tại.
- Công cụ tính toán kỹ thuật: bộ tính kết cấu, dung sai… xuất kết quả PDF/CSV. Sẽ tích hợp dần theo lộ trình.

**Hạ tầng & Tiện ích**
- Supabase Client: `src/lib/supabaseClient.js:1` — lấy biến từ `.env.local`, bật `persistSession`.
- Kiểm thử kết nối: `test-connection.js:1` — script tiện ích để thử truy vấn Supabase trong môi trường Vite (không bắt buộc).

