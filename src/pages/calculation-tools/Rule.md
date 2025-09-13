# Mục tiêu

Trang web cho phép kỹ sư nhập thông số, chọn biên dạng dầm chính tương ứng từng sheet trong file Excel nguồn, tính toán theo công thức cốt lõi, hiển thị kết quả và kiểm tra điều kiện (ứng suất, võng, ổn định) với trải nghiệm gọn, nhanh, rõ ràng.

# Người dùng mục tiêu

* Kỹ sư cơ khí/kết cấu, kỹ sư cầu trục, QC/QA kỹ thuật, sinh viên.
* Làm việc trên desktop là chính, hỗ trợ tablet.

# Nguyên tắc thiết kế

* **1 màn hình = 1 biên dạng dầm (1 sheet)**. Không ép người dùng chuyển đổi tư duy giữa các công thức.
* **Nhập bên trái, kết quả bên phải**. Thay đổi tức thời, có trạng thái **OK / Cảnh báo / Nguy hiểm**.
* **Đơn vị linh hoạt** (SI/Imperial) và **Dark/Light mode**.
* **Không bắt buộc đọc hiểu công thức**: có nút “Nguồn công thức” bung tooltip hiển thị tham chiếu đến sheet/cell Excel.

# Tích hợp nền tảng & ngăn xếp công nghệ

**Frontend:** React 18 + Vite + TypeScript, React Router v6, Tailwind CSS, React Hook Form, Recharts, Framer Motion.
**State:** Redux Toolkit cho state dùng chung đa màn hình (auth, dự án, thư viện vật liệu/tiêu chuẩn, cấu hình ứng dụng). Zustand cho state tạm thời theo màn hình (bộ nhập liệu, slider, toggle nâng cao, cục bộ biểu đồ).
**Backend‑as‑a‑Service:** Supabase JS (Auth, Postgres DB, Storage, Realtime).
**Tiện ích:** date‑fns (định dạng ngày trong báo cáo, lịch sử phiên), react‑pdf hoặc pipeline server để xuất PDF nếu cần.

## Cấu trúc thư mục (Vite)

```
src/
  app/            # cấu hình store Redux, providers
  routes/         # định tuyến cấp trang (RRv6)
  pages/          # trang: Home, Profiles, Sheets, Project, Compare, Report
  features/       # cụm tính năng: auth, projects, materials, standards, sheets
  components/     # UI tái sử dụng: Form, Inputs, ResultCard, ChartView, FormulaHint
  widgets/        # tổ hợp UI theo màn hình: SheetWorkbench, ResultSidebar, LoadCombiner
  lib/            # supabase client, utils (units, calc-engine bridge)
  calc/           # engine tính: công thức, kiểm tra, mô phỏng biểu đồ (TS thuần)
  styles/         # tailwind.css, layer components, utilities
  hooks/
  types/
```

## Định tuyến (React Router v6)

```
/
  ├─ /login, /signup
  ├─ /projects
  │    ├─ /projects/:id (Dashboard dự án)
  │    └─ /projects/:id/compare
  ├─ /sheets           (lưới biên dạng từ Excel)
  └─ /sheets/:sheetId  (Workbench: nhập liệu ↔ kết quả)
```

* Loader/Action (RRv6.4+) cho phép tiền tải project/sheet, commit form.
* Scroll restoration và lazy route cho khối nặng (Recharts).

## Tailwind CSS

* `tailwind.config.js`: mở rộng màu trạng thái: `ok`, `warn`, `danger`; font kỹ thuật; container 12‑col.
* Dùng `@layer components` tạo atomics cao cấp: `.card`, `.field`, `.toolbar`, `.badge-domain`.
* Dark mode theo class.

## Form & Validation (React Hook Form)

* `FormProvider` bao quanh **SheetWorkbench**.
* Input số có: suffix đơn vị, min/max, step, quick‑select series.
* Custom resolver: kiểm tra domain áp dụng công thức (ví dụ h/bf), giới hạn võng L/δ, giá trị bắt buộc theo chế độ.
* Debounce 250 ms để chạy tính toán; nút **Tính lại** cho batch edit.

## Chiến lược State

* **Redux Toolkit**: `auth`, `projects`, `materials`, `standards`, `uiPrefs` (theme, unit), `calcCache` (cache kết quả theo hash input).
* **Zustand**: `sheetUIStore` cho một workbench: focus input, bật/tắt nâng cao, range x của biểu đồ, highlight điểm cực trị.
* Memo hóa selector, tránh render lại Recharts không cần thiết.

## Supabase tích hợp

* **Auth**: email/password + OAuth. Bắt buộc RLS mọi bảng theo `user_id` hoặc quyền chia sẻ theo `project_id`.
* **DB (đề xuất)**

  * `profiles(id, display_name, role)`
  * `projects(id, owner_id, name, meta, created_at)`
  * `variants(id, project_id, sheet_key, name, inputs_json, outputs_json, checks_json, created_at)`
  * `materials(id, owner_id|null, code, E, fy, fu, gamma, meta)`
  * `standards(id, code, name, limits_json)`
  * `excel_sheets(key, title, description, mapping_json)`   # ánh xạ sheet→inputs/outputs/checks
  * `activity_logs(project_id, variant_id, actor_id, action, payload, created_at)`
* **Storage**: `reports/` PDF, `exports/` CSV/JSON, `attachments/` DXF; tạo signed URL ngắn hạn khi tải xuống.
* **Realtime**: đồng bộ list projects/variants khi cộng tác.
* **Policies (RLS)**: `projects.owner_id = auth.uid()`; chia sẻ qua bảng `project_members(project_id, user_id, role)`.

## Engine tính toán

* Đặt trong `src/calc/` (TS), không phụ thuộc UI.
* Mỗi **sheet** có module: `schema.ts` (inputs, units, ranges), `compute.ts` (outputs, checks), `charts.ts` (M(x), V(x), f(x)).
* Cho phép nạp **mapping\_json** từ `excel_sheets` để truy vết cell nguồn trong tooltip **FormulaHint**.

## Biểu đồ & Animation

* **Recharts**: LineChart cho M/V/f; Tooltip tùy biến, brush vùng x, export PNG.
* **Framer Motion**: chuyển tab, popover công thức, highlight thẻ kết quả **OK/Warn/Danger**.

## Báo cáo & Xuất bản

* **PDF**: render client bằng `react-pdf` hoặc gửi payload lên endpoint edge function của Supabase để xuất server‑side.
* **CSV/JSON**: gói input/output/metadata; lưu Storage và ghi log vào `activity_logs`.

## date‑fns

* Chuẩn hóa timezone báo cáo; tem nhãn phiên tính và so sánh phương án.

## Env & khởi tạo

* `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
* `lib/supabase.ts`: singleton client; intercept lỗi auth; refresh token nền.

## Build & hiệu năng

* Vite code‑splitting, `react` plugin, `@` alias.
* Web Worker cho tác vụ nặng trong `calc/` nếu cần.
* Kiểm soát kích thước bundle: lazy load Recharts, react‑pdf.
* Sentry hoặc tương đương cho lỗi runtime.

# Kiến trúc điều hướng

1. **Header**: Logo, chọn dự án, chuyển đơn vị, Dark/Light, ngôn ngữ.
2. **Sidebar trái (Biên dạng)**: Danh sách biên dạng tương ứng các sheet trong Excel nguồn. Ví dụ: *Dầm I tổ hợp, Dầm hộp hàn, Dầm H cán nóng, Dầm đôi, Dầm chữ U/C, Dầm V…* (tên lấy theo sheet thực tế). Có ô tìm kiếm.
3. **Khu vực chính (Main)**: Tabs cho một biên dạng:

   * **Nhập liệu** (kích thước, bố trí, điều kiện biên)
   * **Tải trọng** (tĩnh, động, bánh xe, hệ số va đập, tổ hợp)
   * **Vật liệu & Tiêu chuẩn** (E, fy, fu, γ, tiêu chuẩn kiểm tra, giới hạn võng)
   * **Kết quả & Kiểm tra** (tóm tắt, biểu đồ, các tỷ số sử dụng)
   * **Chi tiết liên kết** (hàn/bu lông nếu sheet có)
   * **Xuất báo cáo** (PDF/CSV/DXF/JSON)
4. **Footer**: Phiên bản, liên hệ, ghi chú tiêu chuẩn.

# Trang Chủ

* Thẻ “Bắt đầu nhanh”: Chọn biên dạng + nhập 3 tham số tối thiểu → Tính ngay.
* Thẻ “Mở dự án gần đây” và “Tạo dự án mới”.

# Màn hình “Biên dạng (sheet)”

* Lưới card: mỗi card = 1 sheet, hiển thị: tên biên dạng, mô tả ngắn, icon dạng tiết diện, nút *Bắt đầu*.
* Filter theo nhóm: *Dầm I/H*, *Dầm hộp*, *Dầm tổ hợp*, *Khung đặc thù*…

# Tab: Nhập liệu

Bố cục 2 cột, nhóm trường có mô tả ngắn và ký hiệu tiêu chuẩn:

* **Hình học**: L (nhịp), h (chiều cao dầm), bf (bề rộng cánh), tf (dày bản cánh), tw (dày bản bụng), s (khoảng cách sườn), a (khoảng cách bánh xe), e (lệch tâm),…
* **Điều kiện biên**: kê hai đầu, ngàm một đầu, liên tục trên nhiều gối, có sườn đầu/giữa.
* **Cấu hình cầu trục**: đơn/dôi dầm, vị trí ray, cẩu treo, chiều cao nâng, tốc độ di chuyển.
* **Chế độ**: *Đơn giản/Nâng cao*. Ở chế độ Đơn giản ẩn các tham số ít ảnh hưởng (ví dụ khoảng cách sườn phụ, bản tăng cứng mép…).
* **Tiện ích nhập**:

  * Chọn đơn vị từng trường (mm, cm; kN, N; MPa).
  * Bộ nhập nhanh theo *Series* tiêu chuẩn (ví dụ H/I cán nóng thông dụng).
  * Nút **Khóa tỉ lệ** để tự động suy ra kích thước phụ khi đổi h hoặc bf.

# Tab: Tải trọng

* **Trọng lượng bản thân**: tự động từ hình học + vật liệu.
* **Tải bánh xe cầu trục**: Pmax, vị trí bánh, tổ hợp vị trí xấu nhất.
* **Tải phụ**: đường chạy, sàn thao tác, bệ động cơ.
* **Hệ số động/va đập**: φ, ψ tùy theo chế độ làm việc.
* **Tổ hợp**: combo Tĩnh + Động + Gió (nếu áp dụng) + Tổ hợp di chuyển.
* **Tiện ích**: trình tối ưu vị trí bánh xe gây Mmax/Vmax, hiển thị vị trí nguy hiểm trên dầm.

# Tab: Vật liệu & Tiêu chuẩn

* **Vật liệu**: E, fy, fu, γM; thư viện vật liệu (Q235/Q345, S235/S355, CT3, thép hợp kim…).
* **Tiêu chuẩn**: chọn bộ kiểm tra (TCVN/EN/AISC tương đương), quy định **giới hạn võng** mặc định (ví dụ L/700, L/800, tùy sheet).
* **Nhiệt độ/làm việc**: hệ số giảm (nếu áp dụng).

# Tab: Kết quả & Kiểm tra

Hiển thị theo 3 cấp độ: **Tóm tắt**, **Chi tiết**, **Biểu đồ**.

**Tóm tắt nhanh (cards)**

* **Momen uốn Mmax**
* **Lực cắt Vmax**
* **Ứng suất uốn σ = M/W**
* **Ứng suất cắt τ ≈ V/Aw**
* **Võng f**
* **Tỷ số sử dụng**: ησ, ητ, ηf; trạng thái: **OK / Cảnh báo / Nguy hiểm**.
* **Khuyến nghị**: tăng bf, tăng tf, thêm sườn, đổi vật liệu, rút ngắn nhịp.

**Chi tiết kiểm tra**

* Ổn định bản bụng/cánh, mảnh dẻ, ổn định tổng thể (nếu có); liên kết hàn/bu lông; ổn định cục bộ tại gối và điểm treo.
* Hiển thị công thức, giá trị thay thế, tham chiếu “Nguồn công thức: Sheet X, ô YZ”.

**Biểu đồ**

* Đường ảnh hưởng M(x), V(x); vị trí cực trị.
* Đồ thị f(x) võng; check f ≤ L/δ.
* Tooltip đọc giá trị tại con trỏ.

# Tab: Chi tiết liên kết (nếu sheet có)

* Kiểm tra mối **hàn góc/đối đầu**, bản mã, bulông.
* Bảng kê kích thước liên kết và tỷ số sử dụng.

# Tab: Xuất báo cáo

* **PDF**: bìa, thông tin dự án, hình học, tải, vật liệu, công thức, kết quả, biểu đồ.
* **CSV/JSON**: toàn bộ input/output cho post‑process.
* **DXF**: phác tiết diện để đưa sang CAD.

# Lược đồ bố cục màn hình tính toán (wireframe chữ)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header: Logo | Dự án ▼ | Đơn vị: SI ▼ | Dark/Light | Ngôn ngữ ▼             │
├───────────────Sidebar (Biên dạng/Sheet)──────────┬─────────────Main──────────┤
│ [Tìm sheet...]                                   │  Tabs: Nhập liệu | Tải…   │
│ • Dầm I tổ hợp                                   │  ┌───────────────────────┐ │
│ • Dầm hộp hàn                                    │  │  Nhập liệu            │ │
│ • Dầm H cán nóng                                 │  │  [L] [h] [bf] [tf]... │ │
│ • ...                                            │  │  Hints & đơn vị       │ │
│                                                  │  └───────────────────────┘ │
│                                                  │  Sidebar phải (Kết quả)   │
│                                                  │  [Mmax][Vmax][σ][τ][f]    │
│                                                  │  [ησ][ητ][ηf]  Trạng thái │
│                                                  │  [Biểu đồ M/V/f]          │
└──────────────────────────────────────────────────┴────────────────────────────┘
```

# Tìm kiếm & lưu/so sánh phương án

* **Lưu phương án** (project/session) kèm tên, mô tả, ngày.
* **Sao chép phương án** để so sánh A/B (bảng so sánh chỉ số và khuyến nghị).
* **Lịch sử thay đổi**: undo/redo, nhật ký input.

# Trạng thái tính toán & lỗi

* Tính thời gian thực; có **nút Tính lại** khi nhập số lượng lớn.
* Cảnh báo nhập sai đơn vị, giới hạn phạm vi hợp lý (ví dụ tf ≥ 6 mm).
* Badge “Ngoài phạm vi áp dụng công thức” khi vượt domain của sheet.

# Bản đồ dữ liệu từ Excel → Ứng dụng (ý tưởng kỹ thuật)

* Mỗi **sheet** ánh xạ thành một **Mẫu biên dạng** gồm:

  * `inputs[]`: danh sách trường, nhãn, ký hiệu, đơn vị, min/max, gợi ý.
  * `derived[]`: công thức phụ thuộc input.
  * `checks[]`: danh sách điều kiện đạt/không đạt, thông điệp.
  * `outputs[]`: giá trị, định dạng, đơn vị, nhóm hiển thị.
  * `charts[]`: cấu hình biểu đồ (M/V/f theo x).
* Lưu tham chiếu `excel_ref` để truy vết về cell/khối công thức.

**Ví dụ JSON mẫu (giản lược):**

```json
{
  "sheet": "Dam_I_ToHop",
  "inputs": [
    {"key": "L", "label": "Nhịp", "unit": "m", "min": 1, "max": 60, "excel_ref": "B5"},
    {"key": "h", "label": "Chiều cao dầm", "unit": "mm", "min": 200, "max": 3000, "excel_ref": "B6"},
    {"key": "bf", "label": "Bề rộng cánh", "unit": "mm", "min": 80, "max": 1200, "excel_ref": "B7"}
  ],
  "outputs": [
    {"key": "Mmax", "label": "Momen uốn lớn nhất", "unit": "kNm", "excel_ref": "F10"},
    {"key": "Vmax", "label": "Lực cắt lớn nhất", "unit": "kN", "excel_ref": "F11"}
  ],
  "checks": [
    {"key": "deflection", "expr": "f <= L/700", "message": "Kiểm tra võng", "excel_ref": "H20"}
  ]
}
```

# Thành phần UI chi tiết

* **Form controls (Tailwind + RHF)**: `<NumberField/>` hỗ trợ đổi đơn vị inline, min/max, step; `<UnitSelect/>`, `<SeriesQuickPick/>`; tooltip ký hiệu (h, bf, tf, tw…).
* **Preset tiêu chuẩn**: `<StandardSelect/>` kéo theo giới hạn võng, γ; đồng bộ với `standards` trong Supabase.
* **ResultCard**: số lớn, đơn vị nhỏ, thanh trạng thái màu `ok/warn/danger`.
* **ChartView (Recharts)**: zoom/pan, brush, export PNG; highlight điểm cực trị; đọc giá trị dưới con trỏ.
* **FormulaHint**: công thức rút gọn + tham chiếu sheet/cell từ `excel_sheets.mapping_json`.
* **Badge domain**: hiển thị điều kiện áp dụng (ví dụ h/bf trong \[1.2; 2.5]).

# Bảo mật & quyền

* RLS tất cả bảng; mọi truy cập `variants` ràng theo project và membership.
* Signed URL Storage thời hạn ngắn; không để lộ key trong client logs.
* Nhật ký `activity_logs` để truy vết thay đổi.

# Tương thích & hiệu năng

* **React 18 + Vite**: SPA; lazy routes; Suspense cho nạp dữ liệu.
* **State tối ưu**: RTK cho dữ liệu chia sẻ, Zustand cho UI cục bộ; selector memo.
* **Hiệu năng tính**: debounce bản địa 250 ms; Web Worker cho `compute.ts` khi input lớn; cache theo hash input.
* **Tailwind JIT**: purge lớp không dùng; tách chunk libs nặng (Recharts, react‑pdf).
* **Khả dụng**: form luôn giữ giá trị, cảnh báo tức thì; offline cache cơ bản qua IndexedDB cho draft.

# Xuất bản & báo cáo

* Mẫu PDF có chữ ký điện tử, QR truy xuất phiên tính.
* Trình tạo thuyết minh tự động: diễn giải từng kiểm tra pass/fail.

# Mở rộng tương lai

* Trình **tối ưu hóa** kích thước (GA) theo ràng buộc ứng suất/võng.
* **Thư viện biên dạng tuỳ biến**: người dùng tạo sheet mới từ mẫu.
* **3D preview** tiết diện + tỷ lệ biến dạng phóng đại.

---

**Ghi chú**: Tên tab, trường và biên dạng sẽ lấy trực tiếp từ tên sheet và nhãn ô trong file Excel nguồn để giảm công edit và đảm bảo nhất quán logic tính toán.
