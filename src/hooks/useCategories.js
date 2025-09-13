import { useState, useEffect, useMemo } from 'react';
import { CategoryService } from '../services/categoryService';

/**
 * Hook để quản lý categories
 * @param {Object} options - Tùy chọn
 * @param {boolean} options.autoFetch - Tự động fetch khi mount
 * @param {boolean} options.includeInactive - Bao gồm danh mục không hoạt động
 * @param {number} options.parentId - Lọc theo danh mục cha
 * @returns {Object} Các state và method để quản lý categories
 */
export const useCategories = (options = {}) => {
  const {
    autoFetch = true,
    includeInactive = false,
    parentId = undefined
  } = options;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  /**
   * Fetch categories từ database
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.getCategories({
        includeInactive,
        parentId
      });
      
      setCategories(data);
    } catch (err) {
      console.error('Error in useCategories:', err);
      setError(err.message);
      
      // Fallback to hardcoded categories
      const fallbackData = CategoryService.getFallbackCategories();
      setCategories(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh categories
   */
  const refreshCategories = () => {
    fetchCategories();
  };

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, includeInactive, parentId]);

  /**
   * Categories formatted cho Select component
   */
  const categoriesForSelect = useMemo(() => {
    return CategoryService.formatCategoriesForUI(categories);
  }, [categories]);

  /**
   * Categories grouped by parent (nếu có cấu trúc cha-con)
   */
  const categoriesByParent = useMemo(() => {
    const grouped = {};
    categories.forEach(category => {
      const parentKey = category.parent_id || 'root';
      if (!grouped[parentKey]) {
        grouped[parentKey] = [];
      }
      grouped[parentKey].push(category);
    });
    return grouped;
  }, [categories]);

  /**
   * Search categories
   */
  const searchCategories = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.searchCategories(searchTerm);
      setCategories(data);
    } catch (err) {
      console.error('Error searching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get category by slug
   */
  const getCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  /**
   * Get category by ID
   */
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  return {
    // State
    categories,
    categoriesForSelect,
    categoriesByParent,
    loading,
    error,
    
    // Methods
    fetchCategories,
    refreshCategories,
    searchCategories,
    getCategoryBySlug,
    getCategoryById
  };
};

/**
 * Hook để quản lý categories của một project
 * @param {number} projectId - ID của project
 * @returns {Object} State và methods để quản lý project categories
 */
export const useProjectCategories = (projectId) => {
  const [projectCategories, setProjectCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch categories của project
   */
  const fetchProjectCategories = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.getProjectCategories(projectId);
      setProjectCategories(data);
    } catch (err) {
      console.error('Error fetching project categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update categories cho project
   */
  const updateProjectCategories = async (categoryIds) => {
    if (!projectId) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await CategoryService.updateProjectCategories(projectId, categoryIds);
      
      if (success) {
        // Refresh project categories
        await fetchProjectCategories();
      }
      
      return success;
    } catch (err) {
      console.error('Error updating project categories:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch when projectId changes
  useEffect(() => {
    fetchProjectCategories();
  }, [projectId]);

  return {
    // State
    projectCategories,
    loading,
    error,
    
    // Methods
    fetchProjectCategories,
    updateProjectCategories
  };
};

/**
 * Hook để quản lý category tree (cha-con)
 * @returns {Object} Category tree state và methods
 */
export const useCategoryTree = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch category tree
   */
  const fetchCategoryTree = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.getCategoryTree();
      setCategoryTree(data);
    } catch (err) {
      console.error('Error fetching category tree:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchCategoryTree();
  }, []);

  return {
    // State
    categoryTree,
    loading,
    error,
    
    // Methods
    fetchCategoryTree,
    refreshTree: fetchCategoryTree
  };
};

// Export default
export default useCategories;
