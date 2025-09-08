import React from 'react';
import Select from '../../../components/ui/Select';
import { VISIBILITY_OPTIONS } from '../../../utils/constants';
import useProfileStore from '../../../utils/profileStore';

const VisibilityControl = ({ field, label }) => {
  const { basicInfo, updateBasicInfo } = useProfileStore();
  const visibility = basicInfo.visibility || {};

  const visibilityOptions = [
    { value: VISIBILITY_OPTIONS.PUBLIC, label: 'Công khai' },
    { value: VISIBILITY_OPTIONS.LOGGED_IN, label: 'Thành viên đã đăng nhập' },
    { value: VISIBILITY_OPTIONS.CONNECTED, label: 'Kết nối' },
    { value: VISIBILITY_OPTIONS.INVITED, label: 'Được mời' },
    { value: VISIBILITY_OPTIONS.PRIVATE, label: 'Riêng tư' },
  ];

  const handleVisibilityChange = (e) => {
    updateBasicInfo({
      visibility: {
        ...visibility,
        [field]: e.target.value,
      },
    });
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <Select
        value={visibility[field] || VISIBILITY_OPTIONS.PRIVATE}
        onChange={handleVisibilityChange}
        options={visibilityOptions}
        className="w-48"
      />
    </div>
  );
};

const PrivacySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cài đặt quyền riêng tư</h3>
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <VisibilityControl field="email" label="Email" />
          <VisibilityControl field="phone" label="Số điện thoại" />
          <VisibilityControl field="location" label="Địa chỉ" />
          <VisibilityControl field="socialLinks" label="Mạng xã hội" />
        </div>
      </div>

      <div className="bg-card rounded-lg p-4">
        <h4 className="font-medium mb-2">Hướng dẫn quyền riêng tư</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Công khai:</strong> Ai cũng có thể xem thông tin này</p>
          <p><strong>Thành viên đã đăng nhập:</strong> Chỉ thành viên đã đăng nhập mới xem được</p>
          <p><strong>Kết nối:</strong> Chỉ những người trong mạng kết nối của bạn</p>
          <p><strong>Được mời:</strong> Chỉ những người được bạn mời hoặc mời bạn</p>
          <p><strong>Riêng tư:</strong> Chỉ bạn mới xem được</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
