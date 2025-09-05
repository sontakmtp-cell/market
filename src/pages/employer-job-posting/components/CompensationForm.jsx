import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import Icon from '../../../components/AppIcon';

const CompensationForm = ({ data, onChange, errors }) => {
  const currencies = [
    { value: 'VND', label: 'VND (Việt Nam Đồng)' },
    { value: 'USD', label: 'USD (US Dollar)' }
  ];

  const benefitOptions = [
    { id: 'health', label: 'Bảo hiểm y tế', icon: 'Heart' },
    { id: 'dental', label: 'Bảo hiểm nha khoa', icon: 'Smile' },
    { id: 'life', label: 'Bảo hiểm nhân thọ', icon: 'Shield' },
    { id: 'remote', label: 'Làm việc từ xa', icon: 'Home' },
    { id: 'flexible', label: 'Giờ làm việc linh hoạt', icon: 'Clock' },
    { id: 'vacation', label: 'Nghỉ phép có lương', icon: 'Calendar' },
    { id: 'training', label: 'Đào tạo và phát triển', icon: 'BookOpen' },
    { id: 'gym', label: 'Hỗ trợ tập gym/thể thao', icon: 'Dumbbell' },
    { id: 'meal', label: 'Hỗ trợ ăn uống', icon: 'Coffee' },
    { id: 'transport', label: 'Hỗ trợ đi lại', icon: 'Car' },
    { id: 'phone', label: 'Hỗ trợ điện thoại/Internet', icon: 'Smartphone' },
    { id: 'laptop', label: 'Cung cấp laptop/thiết bị', icon: 'Laptop' }
  ];

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const toggleBenefit = (benefitId) => {
    const currentBenefits = data?.benefits || [];
    const isSelected = currentBenefits?.includes(benefitId);
    
    if (isSelected) {
      onChange({
        benefits: currentBenefits?.filter(id => id !== benefitId)
      });
    } else {
      onChange({
        benefits: [...currentBenefits, benefitId]
      });
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN')?.format(value);
  };

  const handleSalaryChange = (field, value) => {
    // Remove any non-digit characters except for decimals
    const numericValue = value?.replace(/[^\d]/g, '');
    handleChange(field, numericValue);
  };

  const getSalaryRange = () => {
    const min = data?.salaryMin ? parseInt(data?.salaryMin) : 0;
    const max = data?.salaryMax ? parseInt(data?.salaryMax) : 0;
    
    if (min && max && data?.currency === 'VND') {
      const minFormatted = formatCurrency(min);
      const maxFormatted = formatCurrency(max);
      return `${minFormatted} - ${maxFormatted} VND`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Lương thưởng & Phúc lợi
        </h3>
        <p className="text-muted-foreground mb-6">
          Thiết lập mức lương cạnh tranh và các phúc lợi hấp dẫn để thu hút ứng viên tốt nhất.
        </p>
      </div>

      {/* Salary Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showSalary"
            checked={data?.showSalary || false}
            onChange={(e) => handleChange('showSalary', e?.target?.checked)}
            className="rounded"
          />
          <label htmlFor="showSalary" className="font-medium text-foreground">
            Hiển thị mức lương công khai
          </label>
        </div>

        {data?.showSalary && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Lương tối thiểu"
                  placeholder="15000000"
                  value={data?.salaryMin ? formatCurrency(data?.salaryMin) : ''}
                  onChange={(e) => handleSalaryChange('salaryMin', e?.target?.value)}
                  error={errors?.salaryMin}
                  required={data?.showSalary}
                />
              </div>
              <div>
                <Input
                  label="Lương tối đa"
                  placeholder="25000000"
                  value={data?.salaryMax ? formatCurrency(data?.salaryMax) : ''}
                  onChange={(e) => handleSalaryChange('salaryMax', e?.target?.value)}
                  error={errors?.salaryMax}
                  required={data?.showSalary}
                />
              </div>
              <div>
                <Select
                  label="Đơn vị tiền tệ"
                  options={currencies}
                  value={data?.currency || 'VND'}
                  onChange={(value) => handleChange('currency', value)}
                />
              </div>
            </div>

            {getSalaryRange() && (
              <div className="bg-accent/20 p-3 rounded-md">
                <p className="text-sm font-medium text-foreground">
                  Mức lương hiển thị: {getSalaryRange()}
                </p>
              </div>
            )}
          </div>
        )}

        {!data?.showSalary && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Mức lương sẽ được thương lượng và thảo luận trong quá trình phỏng vấn.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="Gift" size={20} className="mr-2" />
          Phúc lợi và quyền lợi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefitOptions?.map((benefit) => (
            <label
              key={benefit?.id}
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-smooth ${
                data?.benefits?.includes(benefit?.id)
                  ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
              }`}
            >
              <input
                type="checkbox"
                checked={data?.benefits?.includes(benefit?.id)}
                onChange={() => toggleBenefit(benefit?.id)}
                className="rounded"
              />
              <Icon 
                name={benefit?.icon} 
                size={16} 
                className={data?.benefits?.includes(benefit?.id) ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="text-sm">{benefit?.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contract Terms */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="FileText" size={20} className="mr-2" />
          Điều khoản hợp đồng
        </h4>
        
        <textarea
          placeholder="Mô tả các điều khoản hợp đồng đặc biệt, thời gian thử việc, chế độ tăng lương, bonus..."
          value={data?.contractTerms || ''}
          onChange={(e) => handleChange('contractTerms', e?.target?.value)}
          rows={4}
          className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Privacy Controls */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="Lock" size={16} className="mr-2 text-blue-600" />
          Quyền riêng tư và hiển thị
        </h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data?.hideFromCompetitors || false}
              onChange={(e) => handleChange('hideFromCompetitors', e?.target?.checked)}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">
              Ẩn tin đăng khỏi các công ty cạnh tranh
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data?.confidentialMode || false}
              onChange={(e) => handleChange('confidentialMode', e?.target?.checked)}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">
              Chế độ bảo mật (ẩn tên công ty)
            </span>
          </label>
        </div>
      </div>

      {/* Compensation Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Tóm tắt package:</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>
            <strong>Mức lương:</strong> {data?.showSalary ? getSalaryRange() || 'Chưa thiết lập' : 'Thương lượng'}
          </div>
          <div>
            <strong>Phúc lợi:</strong> {data?.benefits?.length || 0} quyền lợi đã chọn
          </div>
          <div>
            <strong>Điều khoản:</strong> {data?.contractTerms ? 'Có mô tả chi tiết' : 'Chưa có'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationForm;