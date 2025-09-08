import React, { useState } from 'react';
import BaseProfileForm from './BaseProfileForm';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import useProfileStore from '../../../../utils/profileStore';

const ClientProfileForm = () => {
  const { roleProfiles, updateRoleProfile } = useProfileStore();
  const clientProfile = roleProfiles.client;
  
  const [formData, setFormData] = useState({
    projectPreferences: clientProfile.projectPreferences,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(clientProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('projectPreferences.')) {
      const [, field, subfield] = name.split('.');
      if (subfield) {
        setFormData(prev => ({
          ...prev,
          projectPreferences: {
            ...prev.projectPreferences,
            [field]: {
              ...prev.projectPreferences[field],
              [subfield]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          projectPreferences: {
            ...prev.projectPreferences,
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRoleProfile('client', formData);
      // Add notification toast here
    } catch (error) {
      // Add error handling
    }
    setIsSubmitting(false);
  };

  const projectScopeOptions = [
    { value: 'small', label: 'Dự án nhỏ (< 1 tháng)' },
    { value: 'medium', label: 'Dự án vừa (1-3 tháng)' },
    { value: 'large', label: 'Dự án lớn (> 3 tháng)' },
  ];

  return (
    <BaseProfileForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Loại dự án quan tâm
          </label>
          {/* TODO: Add multi-select component for project types */}
          <Input
            type="text"
            name="projectPreferences.types"
            value={formData.projectPreferences.types.join(', ')}
            onChange={(e) => handleChange({
              target: {
                name: 'projectPreferences.types',
                value: e.target.value.split(',').map(s => s.trim())
              }
            })}
            placeholder="Nhập các loại dự án, phân cách bằng dấu phẩy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ngân sách dự kiến (VNĐ)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              name="projectPreferences.budgetRange.min"
              value={formData.projectPreferences.budgetRange.min}
              onChange={handleChange}
              min="0"
              step="1000000"
              placeholder="Tối thiểu"
            />
            <Input
              type="number"
              name="projectPreferences.budgetRange.max"
              value={formData.projectPreferences.budgetRange.max}
              onChange={handleChange}
              min="0"
              step="1000000"
              placeholder="Tối đa"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quy mô dự án thường xuyên
          </label>
          <Select
            name="projectPreferences.scope"
            value={formData.projectPreferences.scope}
            onChange={handleChange}
            options={projectScopeOptions}
          />
        </div>
      </div>
    </BaseProfileForm>
  );
};

export default ClientProfileForm;
