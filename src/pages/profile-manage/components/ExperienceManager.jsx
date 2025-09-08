import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useProfileStore from '../../../utils/profileStore';

const ExperienceManager = () => {
  const { experience, addExperience, updateExperience, removeExperience } = useProfileStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const experienceData = {
      ...formData,
      achievements: formData.achievements.filter(a => a.trim() !== ''),
    };

    if (editingId) {
      updateExperience(editingId, experienceData);
    } else {
      addExperience(experienceData);
    }
    resetForm();
  };

  const handleEdit = (exp) => {
    setFormData({
      ...exp,
      achievements: exp.achievements || [],
    });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này?')) {
      removeExperience(id);
    }
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => i === index ? value : ach)
    }));
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          size="sm"
        >
          Thêm kinh nghiệm
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                  {exp.type && ` • ${exp.type}`}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(exp)}
                  variant="ghost"
                  size="sm"
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(exp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-4">
          <h4 className="font-medium">
            {editingId ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Chức danh"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              label="Công ty"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              required
            />
            <Input
              label="Địa điểm"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
            <Input
              label="Loại hình"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              placeholder="VD: Toàn thời gian, Bán thời gian"
            />
            <Input
              label="Ngày bắt đầu"
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <Input
              label="Ngày kết thúc"
              type="month"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              disabled={formData.current}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="current" className="ml-2 text-sm">
              Tôi hiện đang làm việc tại đây
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả công việc</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thành tựu nổi bật</label>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder="Mô tả thành tựu..."
                />
                <Button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  variant="ghost"
                  size="sm"
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addAchievement}
              variant="outline"
              size="sm"
            >
              Thêm thành tựu
            </Button>
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

export default ExperienceManager;
