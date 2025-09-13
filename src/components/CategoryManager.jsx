import React, { useState, useEffect } from 'react';
import { CategoryService } from '../../services/categoryService';
// Use absolute import based on jsconfig baseUrl (./src)
import { useCategories } from 'hooks/useCategories';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

/**
 * CategoryManager - Component quản lý danh mục (dành cho admin)
 */
const CategoryManager = ({ onClose }) => {
  const { categories, loading, error, refreshCategories } = useCategories({ autoFetch: true });
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    parent_id: null,
    sort_order: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Tạo slug từ tên danh mục
   */
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim();
  };

  /**
   * Handle thay đổi input
   */
  const handleInputChange = (field, value, isEditing = false) => {
    const updateFunc = isEditing ? setEditingCategory : setNewCategory;
    updateFunc(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name' && value) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  /**
   * Lưu danh mục mới
   */
  const handleSaveNew = async () => {
    if (!newCategory.name.trim()) {
      alert('Tên danh mục không được để trống');
      return;
    }

    try {
      setSaving(true);
      
      const categoryData = {
        ...newCategory,
        name: newCategory.name.trim(),
        slug: newCategory.slug || generateSlug(newCategory.name),
        sort_order: newCategory.sort_order || categories.length + 1
      };

      const result = await CategoryService.createCategory(categoryData);
      
      if (result) {
        alert('Tạo danh mục thành công!');
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          icon: '',
          color: '#3B82F6',
          parent_id: null,
          sort_order: 0
        });
        setShowAddForm(false);
        refreshCategories();
      } else {
        alert('Có lỗi xảy ra khi tạo danh mục');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cập nhật danh mục
   */
  const handleUpdate = async (id) => {
    if (!editingCategory?.name?.trim()) {
      alert('Tên danh mục không được để trống');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        name: editingCategory.name.trim(),
        slug: editingCategory.slug || generateSlug(editingCategory.name),
        description: editingCategory.description,
        icon: editingCategory.icon,
        color: editingCategory.color,
        sort_order: editingCategory.sort_order,
        is_active: editingCategory.is_active
      };

      const result = await CategoryService.updateCategory(id, updateData);
      
      if (result) {
        alert('Cập nhật danh mục thành công!');
        setEditingCategory(null);
        refreshCategories();
      } else {
        alert('Có lỗi xảy ra khi cập nhật danh mục');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Xóa danh mục
   */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?\n\nLưu ý: Thao tác này không thể hoàn tác!`)) {
      return;
    }

    try {
      setSaving(true);
      
      const success = await CategoryService.deleteCategory(id);
      
      if (success) {
        alert('Xóa danh mục thành công!');
        refreshCategories();
      } else {
        alert('Có lỗi xảy ra khi xóa danh mục');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle trạng thái active
   */
  const toggleActive = async (category) => {
    try {
      setSaving(true);
      
      const result = await CategoryService.updateCategory(category.id, {
        is_active: !category.is_active
      });
      
      if (result) {
        refreshCategories();
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"></div>
        <p className="mt-2 text-gray-600">Đang tải danh mục...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
            <p className="text-gray-600 mt-1">Thêm, sửa, xóa danh mục công việc trong hệ thống</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm danh mục</span>
            </Button>
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Đóng</span>
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* Add New Category Form */}
        {showAddForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm danh mục mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Tên danh mục *"
                value={newCategory.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ví dụ: Lập trình Python"
              />
              <Input
                label="Slug (tự động tạo)"
                value={newCategory.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="lap_trinh_python"
              />
              <Input
                label="Icon (emoji)"
                value={newCategory.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                placeholder="🐍"
              />
              <Input
                label="Màu sắc"
                type="color"
                value={newCategory.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              />
              <Input
                label="Thứ tự sắp xếp"
                type="number"
                value={newCategory.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về danh mục..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveNew}
                disabled={saving || !newCategory.name.trim()}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="p-6">
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 border rounded-lg ${
                  category.is_active ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {editingCategory?.id === category.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Input
                        label="Tên danh mục"
                        value={editingCategory.name}
                        onChange={(e) => handleInputChange('name', e.target.value, true)}
                      />
                      <Input
                        label="Slug"
                        value={editingCategory.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value, true)}
                      />
                      <Input
                        label="Icon"
                        value={editingCategory.icon}
                        onChange={(e) => handleInputChange('icon', e.target.value, true)}
                      />
                      <Input
                        label="Màu sắc"
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) => handleInputChange('color', e.target.value, true)}
                      />
                      <Input
                        label="Thứ tự"
                        type="number"
                        value={editingCategory.sort_order}
                        onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0, true)}
                      />
                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          checked={editingCategory.is_active}
                          onChange={(e) => handleInputChange('is_active', e.target.checked, true)}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm text-gray-700">Kích hoạt</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        value={editingCategory.description}
                        onChange={(e) => handleInputChange('description', e.target.value, true)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setEditingCategory(null)}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={() => handleUpdate(category.id)}
                        disabled={saving}
                        className="flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon || '#'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <span className="text-xs text-gray-500">({category.slug})</span>
                          {!category.is_active && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Không kích hoạt
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Thứ tự: {category.sort_order} | ID: {category.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(category)}
                        disabled={saving}
                        className="flex items-center space-x-1"
                      >
                        {category.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Ẩn</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Hiện</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                        className="flex items-center space-x-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Sửa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={saving}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
