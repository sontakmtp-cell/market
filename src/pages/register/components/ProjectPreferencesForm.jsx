import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ProjectPreferencesForm = ({ formData, onChange, errors }) => {
  const projectTypes = [
    {
      id: 'structural_design',
      label: 'Thiết kế kết cấu',
      description: 'Tính toán và thiết kế kết cấu công trình'
    },
    {
      id: 'mechanical_design',
      label: 'Thiết kế cơ khí',
      description: 'Thiết kế máy móc và hệ thống cơ khí'
    },
    {
      id: 'electrical_design',
      label: 'Thiết kế điện',
      description: 'Thiết kế hệ thống điện và tự động hóa'
    },
    {
      id: 'architecture',
      label: 'Thiết kế kiến trúc',
      description: 'Thiết kế kiến trúc và nội thất'
    },
    {
      id: 'software_development',
      label: 'Phát triển phần mềm',
      description: 'Phần mềm kỹ thuật và ứng dụng chuyên ngành'
    },
    {
      id: 'consulting',
      label: 'Tư vấn kỹ thuật',
      description: 'Tư vấn giải pháp và tối ưu hóa'
    }
  ];

  const budgetRanges = [
    { value: 'under_5m', label: 'Dưới 5 triệu VND' },
    { value: '5m_20m', label: '5 - 20 triệu VND' },
    { value: '20m_50m', label: '20 - 50 triệu VND' },
    { value: '50m_100m', label: '50 - 100 triệu VND' },
    { value: 'over_100m', label: 'Trên 100 triệu VND' },
    { value: 'flexible', label: 'Linh hoạt theo dự án' }
  ];

  const projectSizes = [
    { value: 'small', label: 'Dự án nhỏ (1-4 tuần)' },
    { value: 'medium', label: 'Dự án vừa (1-3 tháng)' },
    { value: 'large', label: 'Dự án lớn (3-12 tháng)' },
    { value: 'ongoing', label: 'Hợp tác dài hạn' }
  ];

  const handleProjectTypeChange = (typeId, checked) => {
    const currentTypes = formData?.preferredProjectTypes || [];
    if (checked) {
      onChange({
        ...formData,
        preferredProjectTypes: [...currentTypes, typeId]
      });
    } else {
      onChange({
        ...formData,
        preferredProjectTypes: currentTypes?.filter(id => id !== typeId)
      });
    }
  };

  const handleSelectChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sở thích dự án</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Cho chúng tôi biết loại dự án bạn quan tâm để gợi ý phù hợp
        </p>
      </div>
      <CheckboxGroup 
        label="Loại dự án quan tâm" 
        error={errors?.preferredProjectTypes}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectTypes?.map((type) => (
            <div key={type?.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <Checkbox
                label={type?.label}
                description={type?.description}
                checked={(formData?.preferredProjectTypes || [])?.includes(type?.id)}
                onChange={(e) => handleProjectTypeChange(type?.id, e?.target?.checked)}
              />
            </div>
          ))}
        </div>
      </CheckboxGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Ngân sách dự kiến"
          placeholder="Chọn mức ngân sách"
          options={budgetRanges}
          value={formData?.preferredBudget || ''}
          onChange={(value) => handleSelectChange('preferredBudget', value)}
          error={errors?.preferredBudget}
        />

        <Select
          label="Quy mô dự án"
          placeholder="Chọn quy mô dự án"
          options={projectSizes}
          value={formData?.preferredProjectSize || ''}
          onChange={(value) => handleSelectChange('preferredProjectSize', value)}
          error={errors?.preferredProjectSize}
        />
      </div>
    </div>
  );
};

export default ProjectPreferencesForm;