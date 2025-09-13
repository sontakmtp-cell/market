-- Add support for large number of industries/categories

-- 1) Create categories lookup table (idempotent)
CREATE TABLE IF NOT EXISTS public.job_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name_vi text NOT NULL,
  name_en text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2) Seed common categories (safe UPSERT by slug)
INSERT INTO public.job_categories (slug, name_vi, name_en)
VALUES
  ('structural', 'Kết cấu xây dựng', 'Structural Engineering'),
  ('mechanical', 'Cơ khí', 'Mechanical'),
  ('electronic', 'Điện tử', 'Electronics'),
  ('crane', 'Cần cẩu', 'Cranes'),
  ('architecture', 'Kiến trúc', 'Architecture'),
  ('software_dev', 'Phát triển phần mềm', 'Software Development'),
  ('web_dev', 'Lập trình Web', 'Web Development'),
  ('mobile_app', 'Ứng dụng di động', 'Mobile Apps'),
  ('data_science', 'Khoa học dữ liệu', 'Data Science'),
  ('ai_ml', 'Trí tuệ nhân tạo & ML', 'AI & Machine Learning'),
  ('ui_ux', 'Thiết kế UI/UX', 'UI/UX Design'),
  ('graphic_design', 'Thiết kế đồ họa', 'Graphic Design'),
  ('content_writing', 'Viết nội dung', 'Content Writing'),
  ('translation', 'Biên dịch/Thông dịch', 'Translation/Interpreting'),
  ('digital_marketing', 'Tiếp thị số', 'Digital Marketing'),
  ('seo_sem', 'SEO/SEM', 'SEO/SEM'),
  ('accounting_finance', 'Kế toán/Tài chính', 'Accounting/Finance'),
  ('legal', 'Pháp lý', 'Legal'),
  ('hr_recruitment', 'Nhân sự/Tuyển dụng', 'HR/Recruitment'),
  ('sales_bd', 'Kinh doanh/Phát triển thị trường', 'Sales/Business Dev'),
  ('education_training', 'Giáo dục/Đào tạo', 'Education/Training'),
  ('healthcare_medical', 'Y tế/Chăm sóc sức khỏe', 'Healthcare/Medical'),
  ('manufacturing', 'Sản xuất/Cơ khí chế tạo', 'Manufacturing'),
  ('logistics_supply', 'Logistics/Chuỗi cung ứng', 'Logistics/Supply Chain'),
  ('e_commerce', 'Thương mại điện tử', 'E-commerce'),
  ('other', 'Khác', 'Other')
ON CONFLICT (slug) DO UPDATE SET name_vi = EXCLUDED.name_vi;

-- 3) Index for faster filtering on existing text column
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_category ON public.marketplace_projects (category);

-- Note:
-- The app currently stores a single text "category" in marketplace_projects.
-- For future multi-category support, consider a join table:
--   public.project_categories(project_id bigint REFERENCES marketplace_projects(id), category_slug text REFERENCES job_categories(slug), PRIMARY KEY(project_id, category_slug))
