import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';

const SpecializationSelector = ({ selectedSpecializations, onChange }) => {
  const specializations = [
    {
      id: 'structural',
      label: 'Kỹ thuật Kết cấu',
      description: 'Thiết kế và tính toán kết cấu công trình'
    },
    {
      id: 'mechanical',
      label: 'Kỹ thuật Cơ khí',
      description: 'Thiết kế máy móc và hệ thống cơ khí'
    },
    {
      id: 'electrical',
      label: 'Kỹ thuật Điện',
      description: 'Thiết kế hệ thống điện và tự động hóa'
    },
    {
      id: 'electronic',
      label: 'Kỹ thuật Điện tử',
      description: 'Thiết kế mạch điện tử và embedded systems'
    },
    {
      id: 'architecture',
      label: 'Kiến trúc',
      description: 'Thiết kế kiến trúc và quy hoạch'
    },
    {
      id: 'civil',
      label: 'Kỹ thuật Xây dựng',
      description: 'Thiết kế và thi công công trình xây dựng'
    },
    {
      id: 'software',
      label: 'Phần mềm Kỹ thuật',
      description: 'Phát triển phần mềm chuyên ngành kỹ thuật'
    },
    {
      id: 'industrial',
      label: 'Kỹ thuật Công nghiệp',
      description: 'Tối ưu hóa quy trình sản xuất'
    }
  ];

  const handleSpecializationChange = (specializationId, checked) => {
    if (checked) {
      onChange([...selectedSpecializations, specializationId]);
    } else {
      onChange(selectedSpecializations?.filter(id => id !== specializationId));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Chuyên môn kỹ thuật</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Chọn các lĩnh vực bạn có kinh nghiệm và muốn nhận dự án
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specializations?.map((spec) => (
          <div key={spec?.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
            <Checkbox
              label={spec?.label}
              description={spec?.description}
              checked={selectedSpecializations?.includes(spec?.id)}
              onChange={(e) => handleSpecializationChange(spec?.id, e?.target?.checked)}
            />
          </div>
        ))}
      </div>
      {selectedSpecializations?.length === 0 && (
        <p className="text-sm text-warning">Vui lòng chọn ít nhất một chuyên môn</p>
      )}
    </div>
  );
};

export default SpecializationSelector;