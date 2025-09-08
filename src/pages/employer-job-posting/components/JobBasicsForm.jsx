import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const JobBasicsForm = ({ data, onChange, errors }) => {
  const locationTypes = [
    { value: 'remote', label: 'Làm việc từ xa' },
    { value: 'onsite', label: 'Tại văn phòng' },
    { value: 'hybrid', label: 'Linh hoạt (Hybrid)' }
  ];

  const employmentTypes = [
    { value: 'full-time', label: 'Toàn thời gian' },
    { value: 'part-time', label: 'Bán thời gian' },
    { value: 'contract', label: 'Hợp đồng' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Thực tập sinh' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Mới tốt nghiệp (0-1 năm)' },
    { value: 'junior', label: 'Junior (1-3 năm)' },
    { value: 'mid', label: 'Middle (3-5 năm)' },
    { value: 'senior', label: 'Senior (5-8 năm)' },
    { value: 'lead', label: 'Lead/Principal (8+ năm)' }
  ];

  const departments = [
    { value: 'engineering', label: 'Kỹ thuật' },
    { value: 'design', label: 'Thiết kế' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Kinh doanh' },
    { value: 'hr', label: 'Nhân sự' },
    { value: 'finance', label: 'Tài chính' },
    { value: 'operations', label: 'Vận hành' },
    { value: 'product', label: 'Sản phẩm' },
    { value: 'other', label: 'Khác' }
  ];

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Thông tin cơ bản về công việc
        </h3>
        <p className="text-muted-foreground mb-6">
          Điền các thông tin cơ bản về vị trí tuyển dụng để ứng viên có thể tìm thấy dễ dàng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <Input
            label="Tiêu đề công việc"
            placeholder="Ví dụ: Senior React Developer, Kỹ sư Phần mềm..."
            value={data?.title || ''}
            onChange={(e) => handleChange('title', e?.target?.value)}
            error={errors?.title}
            required
            description="Tên vị trí cụ thể và thu hút để ứng viên chú ý"
          />
        </div>

        <div>
          <Select
            label="Phòng ban"
            placeholder="Chọn phòng ban"
            options={departments}
            value={data?.department || ''}
            onChange={(value) => handleChange('department', value)}
            error={errors?.department}
            required
          />
        </div>

        <div>
          <Input
            label="Địa điểm làm việc"
            placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
            value={data?.location || ''}
            onChange={(e) => handleChange('location', e?.target?.value)}
            error={errors?.location}
            required
            description="Thành phố hoặc khu vực làm việc chính"
          />
        </div>

        <div>
          <Select
            label="Hình thức làm việc"
            placeholder="Chọn hình thức"
            options={locationTypes}
            value={data?.locationType || 'remote'}
            onChange={(value) => handleChange('locationType', value)}
          />
        </div>

        <div>
          <Select
            label="Loại hình tuyển dụng"
            placeholder="Chọn loại hình"
            options={employmentTypes}
            value={data?.employmentType || 'full-time'}
            onChange={(value) => handleChange('employmentType', value)}
          />
        </div>

        <div>
          <Select
            label="Cấp độ kinh nghiệm"
            placeholder="Chọn cấp độ"
            options={experienceLevels}
            value={data?.experienceLevel || 'mid'}
            onChange={(value) => handleChange('experienceLevel', value)}
            description="Mức kinh nghiệm yêu cầu cho vị trí này"
          />
        </div>
      </div>

      {/* Real-time validation feedback */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Gợi ý tối ưu hóa:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {!data?.title && (
            <li>• Thêm tiêu đề công việc cụ thể và hấp dẫn</li>
          )}
          {data?.title && data?.title?.length < 10 && (
            <li>• Tiêu đề nên chi tiết hơn để thu hút ứng viên</li>
          )}
          {data?.title && data?.title?.length > 60 && (
            <li>• Tiêu đề nên ngắn gọn và dễ đọc hơn</li>
          )}
          {data?.title && data?.department && data?.location && (
            <li className="text-success">✓ Thông tin cơ bản đã đầy đủ</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default JobBasicsForm;