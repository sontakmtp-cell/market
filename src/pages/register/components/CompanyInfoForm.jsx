import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyInfoForm = ({ formData, onChange, errors }) => {
  const companySizeOptions = [
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-200', label: '51-200 nhân viên' },
    { value: '201-500', label: '201-500 nhân viên' },
    { value: '500+', label: 'Trên 500 nhân viên' }
  ];

  const industryOptions = [
    { value: 'construction', label: 'Xây dựng' },
    { value: 'manufacturing', label: 'Sản xuất' },
    { value: 'technology', label: 'Công nghệ' },
    { value: 'energy', label: 'Năng lượng' },
    { value: 'automotive', label: 'Ô tô' },
    { value: 'aerospace', label: 'Hàng không vũ trụ' },
    { value: 'consulting', label: 'Tư vấn kỹ thuật' },
    { value: 'other', label: 'Khác' }
  ];

  const handleInputChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Thông tin công ty</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Cung cấp thông tin về công ty để xây dựng hồ sơ nhà tuyển dụng
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Tên công ty"
          type="text"
          placeholder="Nhập tên công ty"
          value={formData?.companyName || ''}
          onChange={(e) => handleInputChange('companyName', e?.target?.value)}
          error={errors?.companyName}
          required
        />

        <Input
          label="Mã số thuế"
          type="text"
          placeholder="Nhập mã số thuế"
          value={formData?.taxCode || ''}
          onChange={(e) => handleInputChange('taxCode', e?.target?.value)}
          error={errors?.taxCode}
        />

        <div className="md:col-span-2">
          <Input
            label="Địa chỉ công ty"
            type="text"
            placeholder="Nhập địa chỉ công ty"
            value={formData?.companyAddress || ''}
            onChange={(e) => handleInputChange('companyAddress', e?.target?.value)}
            error={errors?.companyAddress}
            required
          />
        </div>

        <Select
          label="Quy mô công ty"
          placeholder="Chọn quy mô công ty"
          options={companySizeOptions}
          value={formData?.companySize || ''}
          onChange={(value) => handleInputChange('companySize', value)}
          error={errors?.companySize}
          required
        />

        <Select
          label="Lĩnh vực hoạt động"
          placeholder="Chọn lĩnh vực"
          options={industryOptions}
          value={formData?.industry || ''}
          onChange={(value) => handleInputChange('industry', value)}
          error={errors?.industry}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Website công ty"
            type="url"
            placeholder="https://example.com"
            value={formData?.website || ''}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            error={errors?.website}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Mô tả công ty"
            type="text"
            placeholder="Mô tả ngắn về công ty và hoạt động kinh doanh"
            value={formData?.companyDescription || ''}
            onChange={(e) => handleInputChange('companyDescription', e?.target?.value)}
            error={errors?.companyDescription}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoForm;