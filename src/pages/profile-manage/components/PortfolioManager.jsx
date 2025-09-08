import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useProfileStore from '../../../utils/profileStore';

const PortfolioManager = () => {
  const { portfolio, addPortfolioItem, updatePortfolioItem, removePortfolioItem } = useProfileStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    technologies: [],
    role: '',
    results: '',
    demoUrl: '',
    codeUrl: '',
    category: '',
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      images: [],
      technologies: [],
      role: '',
      results: '',
      demoUrl: '',
      codeUrl: '',
      category: '',
      featured: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const portfolioData = {
      ...formData,
      technologies: formData.technologies.filter(t => t.trim() !== ''),
    };

    if (editingId) {
      updatePortfolioItem(editingId, portfolioData);
    } else {
      addPortfolioItem({ ...portfolioData, id: Date.now() });
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      technologies: item.technologies || [],
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      removePortfolioItem(id);
    }
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const updateTechnology = (index, value) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const categoryOptions = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'data', label: 'Data Analysis' },
    { value: 'other', label: 'Khác' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portfolio</h3>
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          size="sm"
        >
          Thêm dự án
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{item.title}</h4>
                  {item.featured && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Nổi bật
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(item)}
                  variant="ghost"
                  size="sm"
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  Xóa
                </Button>
              </div>
            </div>

            <p className="text-sm mb-3">{item.description}</p>

            {item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs bg-background px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Demo
                </a>
              )}
              {item.codeUrl && (
                <a
                  href={item.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-4">
          <h4 className="font-medium">
            {editingId ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên dự án"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Chọn danh mục</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Vai trò của bạn"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="VD: Frontend Developer, UI Designer"
            />
            <Input
              label="Demo URL"
              type="url"
              value={formData.demoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
              placeholder="https://..."
            />
            <Input
              label="Code URL"
              type="url"
              value={formData.codeUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, codeUrl: e.target.value }))}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả dự án</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kết quả đạt được</label>
            <textarea
              value={formData.results}
              onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="VD: Tăng hiệu suất 30%, Giảm thời gian tải trang..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Công nghệ sử dụng</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={tech}
                  onChange={(e) => updateTechnology(index, e.target.value)}
                  placeholder="VD: React, Node.js, MongoDB..."
                />
                <Button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  variant="ghost"
                  size="sm"
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addTechnology}
              variant="outline"
              size="sm"
            >
              Thêm công nghệ
            </Button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="ml-2 text-sm">
              Đánh dấu là dự án nổi bật
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={resetForm} variant="outline">
              Hủy
            </Button>
            <Button type="submit">
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PortfolioManager;
