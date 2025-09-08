import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useProfileStore from '../../../utils/profileStore';

const EducationManager = () => {
  const { education, addEducation, updateEducation, removeEducation } = useProfileStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    field: '',
    school: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    activities: [],
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      field: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      grade: '',
      activities: [],
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const educationData = {
      ...formData,
      activities: formData.activities.filter(a => a.trim() !== ''),
    };

    if (editingId) {
      updateEducation(editingId, educationData);
    } else {
      addEducation(educationData);
    }
    resetForm();
  };

  const handleEdit = (edu) => {
    setFormData({
      ...edu,
      activities: edu.activities || [],
    });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa học vấn này?')) {
      removeEducation(id);
    }
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  const updateActivity = (index, value) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((act, i) => i === index ? value : act)
    }));
  };

  const removeActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Học vấn</h3>
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          size="sm"
        >
          Thêm học vấn
        </Button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.startDate} - {edu.current ? 'Hiện tại' : edu.endDate}
                  {edu.grade && ` • GPA: ${edu.grade}`}
                </p>
                {edu.field && (
                  <p className="text-sm mt-1">Chuyên ngành: {edu.field}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(edu)}
                  variant="ghost"
                  size="sm"
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(edu.id)}
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
            {editingId ? 'Chỉnh sửa học vấn' : 'Thêm học vấn mới'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bằng cấp"
              value={formData.degree}
              onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
              placeholder="VD: Cử nhân, Thạc sĩ, Tiến sĩ"
              required
            />
            <Input
              label="Chuyên ngành"
              value={formData.field}
              onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
              placeholder="VD: Công nghệ thông tin"
            />
            <Input
              label="Trường học"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              required
            />
            <Input
              label="Địa điểm"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
            <Input
              label="Điểm GPA"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="VD: 3.5/4.0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current-education"
              checked={formData.current}
              onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="current-education" className="ml-2 text-sm">
              Tôi hiện đang học tại đây
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hoạt động & Thành tựu</label>
            {formData.activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={activity}
                  onChange={(e) => updateActivity(index, e.target.value)}
                  placeholder="Mô tả hoạt động hoặc thành tựu..."
                />
                <Button
                  type="button"
                  onClick={() => removeActivity(index)}
                  variant="ghost"
                  size="sm"
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addActivity}
              variant="outline"
              size="sm"
            >
              Thêm hoạt động
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

export default EducationManager;
