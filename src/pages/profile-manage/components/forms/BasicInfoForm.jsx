import React, { useState } from 'react';
import BaseProfileForm from './BaseProfileForm';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import useProfileStore from '../../../../utils/profileStore';
import { VISIBILITY_OPTIONS } from '../../../../utils/constants';

const BasicInfoForm = () => {
  const { basicInfo, updateBasicInfo } = useProfileStore();
  
  const [formData, setFormData] = useState({
    displayName: basicInfo?.displayName || '',
    bio: basicInfo?.bio || '',
    location: basicInfo?.location || '',
    email: basicInfo?.email || '',
    phone: basicInfo?.phone || '',
    languages: basicInfo?.languages?.join(', ') || '',
    socialLinks: {
      github: basicInfo?.socialLinks?.github || '',
      linkedin: basicInfo?.socialLinks?.linkedin || '',
      portfolio: basicInfo?.socialLinks?.portfolio || '',
    },
    visibility: {
      email: basicInfo?.visibility?.email || VISIBILITY_OPTIONS.PRIVATE,
      phone: basicInfo?.visibility?.phone || VISIBILITY_OPTIONS.PRIVATE,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify({
    displayName: basicInfo?.displayName || '',
    bio: basicInfo?.bio || '',
    location: basicInfo?.location || '',
    email: basicInfo?.email || '',
    phone: basicInfo?.phone || '',
    languages: basicInfo?.languages?.join(', ') || '',
    socialLinks: basicInfo?.socialLinks || { github: '', linkedin: '', portfolio: '' },
    visibility: basicInfo?.visibility || { email: VISIBILITY_OPTIONS.PRIVATE, phone: VISIBILITY_OPTIONS.PRIVATE },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }));
    } else if (name.startsWith('visibility.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        visibility: {
          ...prev.visibility,
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
      const updatedData = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
      };
      await updateBasicInfo(updatedData);
    } catch (error) {
      console.error('Error updating basic info:', error);
    }
    setIsSubmitting(false);
  };

  const visibilityOptions = [
    { value: VISIBILITY_OPTIONS.PUBLIC, label: 'Công khai' },
    { value: VISIBILITY_OPTIONS.PRIVATE, label: 'Riêng tư' },
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
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Nhập tên hiển thị của bạn"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giới thiệu bản thân
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Mô tả ngắn gọn về bản thân..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Địa điểm
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Thành phố, Quốc gia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ngôn ngữ
            </label>
            <Input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="Tiếng Việt, English, 日本語 (phân cách bằng dấu phẩy)"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              <Select
                name="visibility.email"
                value={formData.visibility.email}
                onChange={handleChange}
                options={visibilityOptions}
                placeholder="Chọn chế độ hiển thị"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <div className="space-y-2">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 123 456 789"
              />
              <Select
                name="visibility.phone"
                value={formData.visibility.phone}
                onChange={handleChange}
                options={visibilityOptions}
                placeholder="Chọn chế độ hiển thị"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Liên kết mạng xã hội</h4>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">GitHub</label>
              <Input
                type="url"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
              <Input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Portfolio</label>
              <Input
                type="url"
                name="socialLinks.portfolio"
                value={formData.socialLinks.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseProfileForm>
  );
};

export default BasicInfoForm;
