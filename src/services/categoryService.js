import { supabase } from '../lib/supabaseClient';

/**
 * Category Service - Quản lý các danh mục động
 */
export class CategoryService {
  /**
   * Lấy tất cả danh mục đang hoạt động
   * @param {Object} options - Tùy chọn truy vấn
   * @param {boolean} options.includeInactive - Bao gồm danh mục không hoạt động
   * @param {number} options.parentId - Lọc theo danh mục cha
   * @returns {Promise<Array>} Danh sách danh mục
   */
  static async getCategories(options = {}) {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      // Chỉ lấy danh mục đang hoạt động trừ khi được yêu cầu khác
      if (!options.includeInactive) {
        query = query.eq('is_active', true);
      }

      // Lọc theo danh mục cha nếu có
      if (options.parentId !== undefined) {
        if (options.parentId === null) {
          query = query.is('parent_id', null);
        } else {
          query = query.eq('parent_id', options.parentId);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('CategoryService.getCategories error:', error);
      // Fallback to hardcoded categories if database fails
      return this.getFallbackCategories();
    }
  }

  /**
   * Lấy danh mục theo ID
   * @param {number} id - ID của danh mục
   * @returns {Promise<Object|null>} Thông tin danh mục
   */
  static async getCategoryById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching category by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('CategoryService.getCategoryById error:', error);
      return null;
    }
  }

  /**
   * Lấy danh mục theo slug
   * @param {string} slug - Slug của danh mục
   * @returns {Promise<Object|null>} Thông tin danh mục
   */
  static async getCategoryBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('CategoryService.getCategoryBySlug error:', error);
      return null;
    }
  }

  /**
   * Lấy danh mục con của một danh mục cha
   * @param {number} parentId - ID của danh mục cha
   * @returns {Promise<Array>} Danh sách danh mục con
   */
  static async getSubCategories(parentId) {
    try {
      return await this.getCategories({ parentId });
    } catch (error) {
      console.error('CategoryService.getSubCategories error:', error);
      return [];
    }
  }

  /**
   * Lấy cây danh mục đầy đủ (cha và con)
   * @returns {Promise<Array>} Cây danh mục
   */
  static async getCategoryTree() {
    try {
      const allCategories = await this.getCategories({ includeInactive: false });
      
      // Tạo map để tra cứu nhanh
      const categoryMap = new Map();
      allCategories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      // Xây dựng cây
      const rootCategories = [];
      categoryMap.forEach(category => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      return rootCategories;
    } catch (error) {
      console.error('CategoryService.getCategoryTree error:', error);
      return [];
    }
  }

  /**
   * Tìm kiếm danh mục theo tên
   * @param {string} searchTerm - Từ khóa tìm kiếm
   * @returns {Promise<Array>} Danh sách danh mục phù hợp
   */
  static async searchCategories(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return await this.getCategories();
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error searching categories:', error);
        throw new Error(`Failed to search categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('CategoryService.searchCategories error:', error);
      return [];
    }
  }

  /**
   * Lấy danh mục của một dự án
   * @param {number} projectId - ID của dự án
   * @returns {Promise<Array>} Danh sách danh mục của dự án
   */
  static async getProjectCategories(projectId) {
    try {
      const { data, error } = await supabase
        .from('categories_projects')
        .select(`
          category_id,
          categories (
            id,
            name,
            slug,
            description,
            icon,
            color
          )
        `)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching project categories:', error);
        return [];
      }

      return data?.map(item => item.categories) || [];
    } catch (error) {
      console.error('CategoryService.getProjectCategories error:', error);
      return [];
    }
  }

  /**
   * Cập nhật danh mục cho dự án
   * @param {number} projectId - ID của dự án
   * @param {Array<number>} categoryIds - Danh sách ID danh mục
   * @returns {Promise<boolean>} Kết quả cập nhật
   */
  static async updateProjectCategories(projectId, categoryIds = []) {
    try {
      // Xóa tất cả danh mục cũ của dự án
      const { error: deleteError } = await supabase
        .from('categories_projects')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) {
        console.error('Error deleting old project categories:', deleteError);
        throw new Error(`Failed to delete old categories: ${deleteError.message}`);
      }

      // Thêm danh mục mới nếu có
      if (categoryIds.length > 0) {
        const categoriesData = categoryIds.map(categoryId => ({
          project_id: projectId,
          category_id: categoryId
        }));

        const { error: insertError } = await supabase
          .from('categories_projects')
          .insert(categoriesData);

        if (insertError) {
          console.error('Error inserting new project categories:', insertError);
          throw new Error(`Failed to insert new categories: ${insertError.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error('CategoryService.updateProjectCategories error:', error);
      return false;
    }
  }

  /**
   * Chuyển đổi danh mục từ format database sang format UI
   * @param {Array} categories - Danh sách danh mục từ database
   * @returns {Array} Danh sách danh mục cho UI
   */
  static formatCategoriesForUI(categories) {
    return categories.map(category => ({
      value: category.slug,
      label: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      id: category.id
    }));
  }

  /**
   * Danh mục dự phòng khi không thể kết nối database
   * @returns {Array} Danh sách danh mục hard-coded
   */
  static getFallbackCategories() {
    return [
      { id: 1, name: 'Kết cấu xây dựng', slug: 'structural', icon: '🏗️', color: '#3B82F6' },
      { id: 2, name: 'Cơ khí', slug: 'mechanical', icon: '⚙️', color: '#10B981' },
      { id: 3, name: 'Điện tử', slug: 'electronic', icon: '⚡', color: '#F59E0B' },
      { id: 4, name: 'Cần cẩu', slug: 'crane', icon: '🏗️', color: '#EF4444' },
      { id: 5, name: 'Kiến trúc', slug: 'architecture', icon: '🏛️', color: '#8B5CF6' },
      { id: 6, name: 'Phát triển phần mềm', slug: 'software_dev', icon: '💻', color: '#06B6D4' },
      { id: 7, name: 'Lập trình Web', slug: 'web_dev', icon: '🌐', color: '#14B8A6' },
      { id: 8, name: 'Ứng dụng di động', slug: 'mobile_app', icon: '📱', color: '#F97316' },
      { id: 9, name: 'Khoa học dữ liệu', slug: 'data_science', icon: '📊', color: '#6366F1' },
      { id: 10, name: 'Trí tuệ nhân tạo & Machine Learning', slug: 'ai_ml', icon: '🤖', color: '#EC4899' },
      { id: 11, name: 'Thiết kế UI/UX', slug: 'ui_ux', icon: '🎨', color: '#84CC16' },
      { id: 12, name: 'Thiết kế đồ họa', slug: 'graphic_design', icon: '🎭', color: '#F43F5E' },
      { id: 13, name: 'Viết nội dung', slug: 'content_writing', icon: '✍️', color: '#8B5CF6' },
      { id: 14, name: 'Biên dịch/Thông dịch', slug: 'translation', icon: '🌍', color: '#0EA5E9' },
      { id: 15, name: 'Tiếp thị số (Digital Marketing)', slug: 'digital_marketing', icon: '📈', color: '#F59E0B' },
      { id: 16, name: 'SEO/SEM', slug: 'seo_sem', icon: '🔍', color: '#10B981' },
      { id: 17, name: 'Kế toán/Tài chính', slug: 'accounting_finance', icon: '💰', color: '#059669' },
      { id: 18, name: 'Pháp lý', slug: 'legal', icon: '⚖️', color: '#374151' },
      { id: 19, name: 'Nhân sự/Tuyển dụng', slug: 'hr_recruitment', icon: '👥', color: '#7C3AED' },
      { id: 20, name: 'Kinh doanh/Phát triển thị trường', slug: 'sales_bd', icon: '📊', color: '#DC2626' },
      { id: 21, name: 'Giáo dục/Đào tạo', slug: 'education_training', icon: '🎓', color: '#2563EB' },
      { id: 22, name: 'Y tế/Chăm sóc sức khỏe', slug: 'healthcare_medical', icon: '🏥', color: '#059669' },
      { id: 23, name: 'Sản xuất/Cơ khí chế tạo', slug: 'manufacturing', icon: '🏭', color: '#6B7280' },
      { id: 24, name: 'Logistics/Chuỗi cung ứng', slug: 'logistics_supply', icon: '🚛', color: '#F97316' },
      { id: 25, name: 'Thương mại điện tử', slug: 'e_commerce', icon: '🛒', color: '#8B5CF6' },
      { id: 26, name: 'Khác', slug: 'other', icon: '📝', color: '#6B7280' }
    ];
  }

  /**
   * Tạo danh mục mới (admin only)
   * @param {Object} categoryData - Dữ liệu danh mục mới
   * @returns {Promise<Object|null>} Danh mục được tạo
   */
  static async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        throw new Error(`Failed to create category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('CategoryService.createCategory error:', error);
      return null;
    }
  }

  /**
   * Cập nhật danh mục (admin only)
   * @param {number} id - ID danh mục
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object|null>} Danh mục đã cập nhật
   */
  static async updateCategory(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        throw new Error(`Failed to update category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('CategoryService.updateCategory error:', error);
      return null;
    }
  }

  /**
   * Xóa danh mục (admin only)
   * @param {number} id - ID danh mục
   * @returns {Promise<boolean>} Kết quả xóa
   */
  static async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        throw new Error(`Failed to delete category: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('CategoryService.deleteCategory error:', error);
      return false;
    }
  }
}

// Export default cho compatibility
export default CategoryService;
