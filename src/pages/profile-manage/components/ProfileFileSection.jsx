import React, { useState } from 'react';
import FileUpload from '../../../components/ui/FileUpload';
import useProfileStore from '../../../utils/profileStore';

const ProfileFileSection = () => {
  const { basicInfo, updateBasicInfo } = useProfileStore();
  const [errors, setErrors] = useState({});

  const handleAvatarUpload = async (file) => {
    try {
      setErrors((prev) => ({ ...prev, avatar: null }));
      
      // TODO: Implement actual file upload to server
      // For now, we'll use FileReader to create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBasicInfo({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Có lỗi xảy ra khi tải lên avatar',
      }));
    }
  };

  const handleCoverUpload = async (file) => {
    try {
      setErrors((prev) => ({ ...prev, cover: null }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBasicInfo({ coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        cover: 'Có lỗi xảy ra khi tải lên ảnh bìa',
      }));
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      setErrors((prev) => ({ ...prev, resume: null }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you'd upload the file to a server and store the URL
        // For now, we'll store the file name
        updateBasicInfo({ resume: file.name });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Có lỗi xảy ra khi tải lên CV',
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Avatar</h3>
        <FileUpload
          type="avatar"
          accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] }}
          maxSize={2 * 1024 * 1024} // 2MB
          onUpload={handleAvatarUpload}
          preview={basicInfo?.avatar}
          error={errors.avatar}
          placeholder="Tải lên ảnh đại diện"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Ảnh bìa</h3>
        <FileUpload
          type="cover"
          accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
          maxSize={5 * 1024 * 1024} // 5MB
          onUpload={handleCoverUpload}
          preview={basicInfo?.coverImage}
          error={errors.cover}
          placeholder="Tải lên ảnh bìa"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">CV / Resume</h3>
        <FileUpload
          accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          }}
          maxSize={10 * 1024 * 1024} // 10MB
          onUpload={handleResumeUpload}
          preview={basicInfo?.resume}
          error={errors.resume}
          placeholder="Tải lên CV của bạn (PDF, DOC, DOCX)"
        />
        {basicInfo?.resume && (
          <p className="mt-2 text-sm text-muted-foreground">
            CV hiện tại: {basicInfo.resume}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileFileSection;
