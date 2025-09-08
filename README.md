## 🎯 Mục tiêu website

Xây dựng một hệ thống TMĐT kỹ thuật gồm 4 mô-đun riêng biệt không liên quan đến nhau:

1. **Mô-đun A – Job Marketplace**:

   - Kết nối Client với Freelancer.
   - Người dùng (client) đăng yêu cầu thiết kế kỹ thuật (kết cấu, cơ khí, điện tử, cầu trục, kiến trúc...).
   - Freelancer lọc bài viết phù hợp, gửi proposal + báo giá.
   - Hai bên tạo hợp đồng, bàn giao file, đánh giá.
   - Quản lý công việc đã hoàn thành, có trạng thái rõ ràng.
2. **Mô-đun B – Tuyển dụng & CV**:

   - Kết nối Nhà tuyển dụng với Ứng viên nộp CV.
   - Nhà tuyển dụng đăng JD, yêu cầu kỹ năng, mức lương, vị trí.
   - Ứng viên nộp CV (PDF/DOC), xem trạng thái đơn, được mời phỏng vấn.
   - Hệ thống quản lý tin tuyển dụng và ứng viên.
3. **Mô-đun C – Gian hàng sản phẩm kỹ thuật**:

   - Các danh mục: Sách kỹ thuật, phần mềm, khóa học online, vật tư.
   - Có bộ lọc theo danh mục, giá, đánh giá, từ khóa.
   - Hỗ trợ giỏ hàng, thanh toán (Stripe/VNPAY), quản lý đơn hàng.
   - Cho phép tải sản phẩm số (ebook, phần mềm).
4. **Mô-đun D – Công cụ tính toán kỹ thuật**:

   - Gồm các công cụ tính cầu trục, chọn ổ bi, chọn dung sai.
   - Giao diện nhập liệu đơn giản, kết quả dưới dạng bảng + nhận xét + cảnh báo.
   - Cho phép export kết quả ra PDF/CSV.
   - Có thể mở rộng sang các công cụ khác (băng tải, động cơ...).

---

## 🖼️ Giao diện người dùng

- **Trang chủ** hiển thị 4 mô-đun chính như 4 thẻ card.
- **Giao diện Next.js + Tailwind CSS + shadcn/ui**.
- Có chế độ **Dark/Light mode**.
- Bộ lọc sidebar sticky.
- Dashboard riêng cho từng loại người dùng: `client`, `freelancer`, `employer`.
- Trang quản lý đơn hàng, job, project cá nhân.
- Trang tính toán có kết quả dạng **card: OK / Cảnh báo / Nguy hiểm**.
- Tối ưu cho mobile + desktop.
- Upload file bằng drag/drop + preview (CV, ảnh, CAD…).
- Chat inline theo đơn hàng / job (option).

# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
2. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```