Mục Tiêu: Tái cấu trúc thẻ Khách hàng trong /freelancer-dashboard

Quản lý dự án: Theo dõi toàn bộ công việc đã thuê theo trạng thái/mốc/chi phí.
Ra quyết định nhanh: Nổi bật “việc cần làm” (duyệt mốc, giải ngân, thanh toán).
Minh bạch tài chính: Escrow, hóa đơn, lịch sử chi trả, ngân sách.
Giảm rủi ro: Nhắc hạn, gia hạn, yêu cầu sửa, tranh chấp.
Kiến Trúc Thẻ “Khách hàng”

Tổng quan: KPI nhanh + danh sách việc cần xử lý.
Dự án: Bảng/kanban lọc-sắp xếp + Drawer chi tiết.
Mốc & Bàn giao: Duyệt/đề nghị chỉnh sửa/ghi chú/tiêu chí chấp nhận.
Thanh toán: Escrow, hóa đơn, lịch sử thanh toán, tải chứng từ.
Trao đổi & Tệp: Threads, đính kèm, versioning, nhãn “Cần duyệt”.
Báo cáo: Ngân sách vs chi tiêu, tiến độ mốc, sắp quá hạn.
Cài đặt dự án: Thành viên phía khách, quyền, SLA, nhắc hạn.
Tính Năng Cốt Lõi

Danh sách dự án: Trạng thái (Mới/Đang làm/Chờ duyệt/Hoàn tất/Tạm dừng/Tranh chấp), freelancer, deadline, mốc kế tiếp, ngân sách đã dùng, escrow, tin nhắn chưa đọc.
Bộ lọc & Lưu view: Lọc theo trạng thái, freelancer, deadline, ngân sách; lưu “Saved views”.
Kanban: Pipeline Mới → Thương thảo → Đang làm → Chờ duyệt → Hoàn tất → Tranh chấp.
Drawer chi tiết: Timeline, mốc, deliverables, chỉ số rủi ro (sắp quá hạn, vượt ngân sách).
Duyệt mốc: Approve/Request changes, số lần revision, ghi chú bắt buộc khi từ chối.
Escrow/Thanh toán: Tạo escrow, giải ngân từng mốc, thanh toán hóa đơn, hoàn tiền.
Giờ công (nếu có): Giờ đã log, hạn mức/tuần, phê duyệt timesheet.
Yêu cầu thay đổi: Tạo CR với ước lượng và tác động chi phí-thời gian; chấp nhận/từ chối.
Gia hạn hạn chót: Đề nghị/duyệt gia hạn bởi 2 phía.
Tranh chấp: Mở tranh chấp, tải bằng chứng, mốc phạm vi, cập nhật trạng thái.
Thông báo & Nhắc việc: Sắp đến hạn, quá hạn, mốc gửi duyệt, hóa đơn đến hạn.
Đánh giá: Gửi feedback/rating sau khi hoàn tất; nhắc chia sẻ testimonial.
Giao Diện & UX

KPI Bar (Top): Việc đang làm | Chờ duyệt | Cần thanh toán | Sắp quá hạn | Tranh chấp.
ProjectCard (client-first): Nút nhanh “Duyệt mốc”, “Giải ngân”, “Yêu cầu sửa”, “Tải hóa đơn”, “Gia hạn”, “Mở tranh chấp”.
Bảng/Thẻ: Cột trạng thái, mốc kế tiếp (chip ngày), badge rủi ro, số tin nhắn chưa đọc.
Bulk actions: Duyệt/giải ngân/nhắc hạn hàng loạt.
Empty state: Gợi ý “Đăng công việc”, “Mời Freelancer”.
Trạng thái hệ thống: Loading skeleton, optimistic update, toast rõ ràng.
A11y: Focus trap cho modal, aria-label cho nút icon, thông báo Live Region.
Thành Phần UI Đề Xuất

src/pages/freelancer-dashboard/components/ClientProjectList.jsx: Bảng/kanban + filters.
src/pages/freelancer-dashboard/components/ClientProjectCard.jsx: Biến thể từ ProjectCard.jsx tối ưu cho khách.
src/pages/freelancer-dashboard/components/KPIBar.jsx: Chỉ số đầu trang.
src/components/ui/ChangeRequestModal.jsx, ReleaseEscrowModal.jsx, ExtendDeadlineModal.jsx, DisputeModal.jsx: Dùng Modal.jsx và EnhancedButton.jsx.
src/pages/freelancer-dashboard/components/MilestoneList.jsx, InvoiceList.jsx: Danh sách mốc/hóa đơn có hành động.
Tích Hợp Với Mã Hiện Có

Tái sử dụng: EnhancedButton.jsx, Modal.jsx, EnhancedInput.jsx cho form và hành động.
Điều hướng: Bổ sung route/tab trong src/pages/freelancer-dashboard/index.jsx cho “Khách hàng”.
I18n: Thêm key mới vào src/locales/vi.json và src/locales/en.json.
Guard: Áp dụng mẫu ProfileGuard.jsx/ProfileManageGuard.jsx để kiểm tra vai trò client; có thể thêm ClientGuard.jsx.
Accessibility: Tận dụng src/utils/accessibility.js cho focus/keyboard.
Mô Hình Dữ Liệu & API (hợp đồng giao tiếp)

Thực thể: Project, Contract, Milestone, Deliverable, ChangeRequest, Invoice/Payment, Escrow, TimeLog, Message, FileAttachment, Dispute.
Endpoint đề xuất:
GET /client/projects?status=...&q=...
GET /client/projects/:id (tổng hợp mốc/hóa đơn/tin nhắn chưa đọc)
POST /milestones/:id/approve, POST /milestones/:id/request-change
POST /escrow/:id/release, POST /invoices/:id/pay
POST /projects/:id/extend-deadline
POST /disputes (đính kèm)
GET /client/reports/summary
Realtime: WebSocket cho unread, gửi mốc, thay đổi trạng thái.
Webhooks: Payment succeeded/failed, milestone submitted.
Quyền Truy Cập & Bảo Mật

RBAC: Chủ dự án, cộng tác viên phía khách, chỉ đọc.
Audit log: Ai duyệt mốc/giải ngân/đổi hạn.
Giới hạn: Kích thước tệp, rate limit thao tác thanh toán/tải tệp.
QA & Kiểm Thử

Unit tests: Cho hành động mốc/escrow/modal trong src/pages/freelancer-dashboard/components/__tests__/....
Integration: Luồng duyệt mốc → giải ngân → xuất hóa đơn.
A11y tests: Keyboard nav, aria, focus.
Lộ Trình Triển Khai

MVP: Danh sách dự án + Drawer chi tiết, duyệt mốc, giải ngân, hóa đơn, thông báo hạn.
Phase 2: Change Requests, gia hạn, tranh chấp, bulk actions, saved views.
Phase 3: Kanban, analytics nâng cao, team phía khách, template/cloning.
Nếu bạn muốn, tôi có thể:

Tạo skeleton “Khách hàng” tab, ClientProjectList.jsx, và biến thể ClientProjectCard.jsx.
Bổ sung i18n keys và các modal khung sườn, nối với state giả lập để bạn trải nghiệm luồng.