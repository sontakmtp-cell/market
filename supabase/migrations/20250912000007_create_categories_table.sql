-- Create categories table for dynamic category management
CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id bigint REFERENCES public.categories(id),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  icon text,
  color text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Create index for performance
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_active ON public.categories(is_active);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, sort_order, icon, color) VALUES
('Kết cấu xây dựng', 'structural', 'Thiết kế và tính toán kết cấu công trình', 1, '🏗️', '#3B82F6'),
('Cơ khí', 'mechanical', 'Thiết kế và chế tạo cơ khí', 2, '⚙️', '#10B981'),
('Điện tử', 'electronic', 'Thiết kế mạch điện tử và hệ thống điện', 3, '⚡', '#F59E0B'),
('Cần cẩu', 'crane', 'Thiết kế và thi công hệ thống cần cẩu', 4, '🏗️', '#EF4444'),
('Kiến trúc', 'architecture', 'Thiết kế kiến trúc và quy hoạch', 5, '🏛️', '#8B5CF6'),
('Phát triển phần mềm', 'software_dev', 'Lập trình ứng dụng và hệ thống', 6, '💻', '#06B6D4'),
('Lập trình Web', 'web_dev', 'Phát triển website và ứng dụng web', 7, '🌐', '#14B8A6'),
('Ứng dụng di động', 'mobile_app', 'Phát triển app iOS và Android', 8, '📱', '#F97316'),
('Khoa học dữ liệu', 'data_science', 'Phân tích dữ liệu và machine learning', 9, '📊', '#6366F1'),
('Trí tuệ nhân tạo & Machine Learning', 'ai_ml', 'AI, ML và deep learning', 10, '🤖', '#EC4899'),
('Thiết kế UI/UX', 'ui_ux', 'Thiết kế giao diện người dùng', 11, '🎨', '#84CC16'),
('Thiết kế đồ họa', 'graphic_design', 'Thiết kế logo, poster, branding', 12, '🎭', '#F43F5E'),
('Viết nội dung', 'content_writing', 'Copywriting và content marketing', 13, '✍️', '#8B5CF6'),
('Biên dịch/Thông dịch', 'translation', 'Dịch thuật đa ngôn ngữ', 14, '🌍', '#0EA5E9'),
('Tiếp thị số (Digital Marketing)', 'digital_marketing', 'Marketing online và quảng cáo số', 15, '📈', '#F59E0B'),
('SEO/SEM', 'seo_sem', 'Tối ưu hóa công cụ tìm kiếm', 16, '🔍', '#10B981'),
('Kế toán/Tài chính', 'accounting_finance', 'Kế toán và quản lý tài chính', 17, '💰', '#059669'),
('Pháp lý', 'legal', 'Tư vấn pháp luật và hợp đồng', 18, '⚖️', '#374151'),
('Nhân sự/Tuyển dụng', 'hr_recruitment', 'Quản lý nhân sự và tuyển dụng', 19, '👥', '#7C3AED'),
('Kinh doanh/Phát triển thị trường', 'sales_bd', 'Bán hàng và phát triển kinh doanh', 20, '📊', '#DC2626'),
('Giáo dục/Đào tạo', 'education_training', 'Giảng dạy và phát triển khóa học', 21, '🎓', '#2563EB'),
('Y tế/Chăm sóc sức khỏe', 'healthcare_medical', 'Dịch vụ y tế và chăm sóc sức khỏe', 22, '🏥', '#059669'),
('Sản xuất/Cơ khí chế tạo', 'manufacturing', 'Sản xuất và gia công cơ khí', 23, '🏭', '#6B7280'),
('Logistics/Chuỗi cung ứng', 'logistics_supply', 'Vận chuyển và quản lý chuỗi cung ứng', 24, '🚛', '#F97316'),
('Thương mại điện tử', 'e_commerce', 'Kinh doanh online và marketplace', 25, '🛒', '#8B5CF6'),
('Khác', 'other', 'Các lĩnh vực khác', 999, '📝', '#6B7280');

-- Create categories_projects junction table for many-to-many relationship
CREATE TABLE public.categories_projects (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  project_id bigint NOT NULL REFERENCES public.marketplace_projects(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_projects_pkey PRIMARY KEY (id),
  CONSTRAINT categories_projects_unique UNIQUE (category_id, project_id)
);

-- Create indexes for junction table
CREATE INDEX idx_categories_projects_category_id ON public.categories_projects(category_id);
CREATE INDEX idx_categories_projects_project_id ON public.categories_projects(project_id);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (read-only for all users)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Create policies for categories_projects
CREATE POLICY "Categories_projects are viewable by everyone" ON public.categories_projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own categories_projects" ON public.categories_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.marketplace_projects 
      WHERE id = project_id AND client_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own categories_projects" ON public.categories_projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_projects 
      WHERE id = project_id AND client_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own categories_projects" ON public.categories_projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_projects 
      WHERE id = project_id AND client_user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for categories
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
