import React, { useState } from 'react';
import BaseProfileForm from './BaseProfileForm';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import useProfileStore from '../../../../utils/profileStore';

const EmployerProfileForm = () => {
  const { roleProfiles, updateRoleProfile } = useProfileStore();
  const employerProfile = roleProfiles.employer;
  
  const [formData, setFormData] = useState({
    companyInfo: employerProfile.companyInfo,
    benefits: employerProfile.benefits,
    culture: employerProfile.culture,
    recruitmentProcess: employerProfile.recruitmentProcess,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(employerProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('companyInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          [field]: value
        }
      }));
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
      await updateRoleProfile('employer', formData);
      // Add notification toast here
    } catch (error) {
      // Add error handling
    }
    setIsSubmitting(false);
  };

  const companySizeOptions = [
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-200', label: '51-200 nhân viên' },
    { value: '201-500', label: '201-500 nhân viên' },
    { value: '501+', label: '501+ nhân viên' },
  ];

  const industryOptions = [
    { value: 'technology', label: 'Công nghệ' },
    { value: 'finance', label: 'Tài chính - Ngân hàng' },
    { value: 'education', label: 'Giáo dục' },
    { value: 'healthcare', label: 'Y tế' },
    // Add more options
  ];

  return (
    <BaseProfileForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên công ty
              </label>
              <Input
                type="text"
                name="companyInfo.name"
                value={formData.companyInfo.name}
                onChange={handleChange}
                placeholder="Nhập tên công ty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Website
              </label>
              <Input
                type="url"
                name="companyInfo.website"
                value={formData.companyInfo.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Quy mô công ty
              </label>
              <Select
                name="companyInfo.size"
                value={formData.companyInfo.size}
                onChange={handleChange}
                options={companySizeOptions}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngành nghề
              </label>
              <Select
                name="companyInfo.industry"
                value={formData.companyInfo.industry}
                onChange={handleChange}
                options={industryOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mô tả công ty
              </label>
              <textarea
                name="companyInfo.description"
                value={formData.companyInfo.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Giới thiệu về công ty..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phúc lợi
            </label>
            {/* TODO: Add multi-select component for benefits */}
            <Input
              type="text"
              name="benefits"
              value={formData.benefits.join(', ')}
              onChange={(e) => handleChange({
                target: {
                  name: 'benefits',
                  value: e.target.value.split(',').map(s => s.trim())
                }
              })}
              placeholder="Nhập các phúc lợi, phân cách bằng dấu phẩy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Văn hóa công ty
            </label>
            <textarea
              name="culture"
              value={formData.culture}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Mô tả văn hóa công ty..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quy trình tuyển dụng
            </label>
            <textarea
              name="recruitmentProcess"
              value={formData.recruitmentProcess}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Mô tả quy trình tuyển dụng..."
            />
          </div>
        </div>
      </div>
    </BaseProfileForm>
  );
};

export default EmployerProfileForm;
