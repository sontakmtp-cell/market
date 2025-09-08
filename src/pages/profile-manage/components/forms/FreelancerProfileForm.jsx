import React, { useState } from 'react';
import BaseProfileForm from './BaseProfileForm';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import useProfileStore from '../../../../utils/profileStore';

const FreelancerProfileForm = () => {
  const { roleProfiles, updateRoleProfile } = useProfileStore();
  const freelancerProfile = roleProfiles.freelancer;
  
  const [formData, setFormData] = useState({
    specialization: freelancerProfile?.specialization || [],
    skills: freelancerProfile?.skills || [],
    yearsOfExperience: freelancerProfile?.yearsOfExperience || 0,
    interests: freelancerProfile?.interests || [],
    hourlyRate: freelancerProfile?.hourlyRate || 0,
    availability: freelancerProfile?.availability || 'fulltime',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(freelancerProfile || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRoleProfile('freelancer', formData);
      // Add notification toast here
    } catch (error) {
      // Add error handling
    }
    setIsSubmitting(false);
  };

  const availabilityOptions = [
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'notAvailable', label: 'Không nhận thêm dự án' },
  ];

  return (
    <BaseProfileForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Chuyên môn chính
            </label>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              options={[
                { value: 'webdev', label: 'Web Development' },
                { value: 'mobiledev', label: 'Mobile Development' },
                { value: 'uiux', label: 'UI/UX Design' },
                // Add more options
              ]}
              placeholder="Chọn chuyên môn chính"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số năm kinh nghiệm
            </label>
            <Input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giá theo giờ (USD)
            </label>
            <Input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Trạng thái nhận việc
            </label>
            <Select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              options={availabilityOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Kỹ năng
            </label>
            {/* TODO: Add multi-select component for skills */}
            <Input
              type="text"
              name="skills"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => handleChange({
                target: {
                  name: 'skills',
                  value: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                }
              })}
              placeholder="Nhập các kỹ năng, phân cách bằng dấu phẩy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Lĩnh vực quan tâm
            </label>
            {/* TODO: Add multi-select component for interests */}
            <Input
              type="text"
              name="interests"
              value={formData.interests?.join(', ') || ''}
              onChange={(e) => handleChange({
                target: {
                  name: 'interests',
                  value: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                }
              })}
              placeholder="Nhập các lĩnh vực quan tâm, phân cách bằng dấu phẩy"
            />
          </div>
        </div>
      </div>
    </BaseProfileForm>
  );
};

export default FreelancerProfileForm;
