import React, { useState } from 'react';
import BaseProfileForm from './BaseProfileForm';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import useProfileStore from '../../../../utils/profileStore';

const CandidateProfileForm = () => {
  const { roleProfiles, updateRoleProfile } = useProfileStore();
  const candidateProfile = roleProfiles.candidate;
  
  const [formData, setFormData] = useState({
    specialization: candidateProfile.specialization,
    skills: candidateProfile.skills,
    yearsOfExperience: candidateProfile.yearsOfExperience,
    preferredJobs: candidateProfile.preferredJobs,
    expectedSalary: candidateProfile.expectedSalary,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(candidateProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('expectedSalary.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        expectedSalary: {
          ...prev.expectedSalary,
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
      await updateRoleProfile('candidate', formData);
      // Add notification toast here
    } catch (error) {
      // Add error handling
    }
    setIsSubmitting(false);
  };

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
              Chuyên ngành
            </label>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              options={[
                { value: 'it', label: 'Công nghệ thông tin' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'design', label: 'Thiết kế' },
                // Add more options
              ]}
              placeholder="Chọn chuyên ngành"
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
              Mức lương mong muốn (VNĐ)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                name="expectedSalary.min"
                value={formData.expectedSalary.min}
                onChange={handleChange}
                min="0"
                step="1000000"
                placeholder="Tối thiểu"
              />
              <Input
                type="number"
                name="expectedSalary.max"
                value={formData.expectedSalary.max}
                onChange={handleChange}
                min="0"
                step="1000000"
                placeholder="Tối đa"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Kỹ năng
            </label>
            {/* TODO: Add multi-select component for skills */}
            <Input
              type="text"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={(e) => handleChange({
                target: {
                  name: 'skills',
                  value: e.target.value.split(',').map(s => s.trim())
                }
              })}
              placeholder="Nhập các kỹ năng, phân cách bằng dấu phẩy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Vị trí mong muốn
            </label>
            {/* TODO: Add multi-select component for preferred jobs */}
            <Input
              type="text"
              name="preferredJobs"
              value={formData.preferredJobs.join(', ')}
              onChange={(e) => handleChange({
                target: {
                  name: 'preferredJobs',
                  value: e.target.value.split(',').map(s => s.trim())
                }
              })}
              placeholder="Nhập các vị trí mong muốn, phân cách bằng dấu phẩy"
            />
          </div>
        </div>
      </div>
    </BaseProfileForm>
  );
};

export default CandidateProfileForm;
