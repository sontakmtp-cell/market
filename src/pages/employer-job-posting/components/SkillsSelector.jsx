import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SkillsSelector = ({ data, onChange, errors }) => {
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Predefined skills by category
  const skillCategories = {
    'cad-software': [
      'AutoCAD', 'SolidWorks', 'CATIA', 'NX (Unigraphics)', 'Inventor', 'Fusion 360',
      'Pro/ENGINEER (Creo)', 'Mastercam', 'PowerMill', 'EdgeCAM', 'ANSYS', 'KeyShot'
    ],
    'machining': [
      'Vận hành máy tiện', 'Vận hành máy phay', 'Vận hành máy bào', 'Vận hành máy mài',
      'Gia công CNC', 'Lập trình CNC', 'Máy cắt plasma', 'Máy cắt laser', 'Máy EDM',
      'Đo lường CMM', 'Sử dụng thước cặp', 'Sử dụng panme', 'Đồng hồ so'
    ],
    'welding': [
      'Hàn que (SMAW)', 'Hàn MIG/MAG (GMAW)', 'Hàn TIG (GTAW)', 'Hàn hồ quang',
      'Hàn 2G (nằm ngang)', 'Hàn 3G (đứng)', 'Hàn 3F (đứng góc)', 'Hàn 4G (trần)',
      'Hàn 5G (ống nằm ngang)', 'Hàn 6G (ống nghiêng)', 'Hàn đường ống', 'Hàn kết cấu thép'
    ],
    'construction': [
      'Đọc bản vẽ xây dựng', 'Quản lý dự án xây dựng', 'Giám sát thi công',
      'Kiểm định chất lượng', 'An toàn lao động', 'Kết cấu bê tông', 'Kết cấu thép',
      'Khảo sát địa chất', 'Thiết kế móng', 'Cọc khoan nhồi', 'Coffa', 'Ván khuôn'
    ],
    'materials': [
      'Thép carbon', 'Thép không gỉ', 'Nhôm hợp kim', 'Gang xám', 'Đồng thau',
      'Vật liệu composite', 'Bê tông cốt thép', 'Thép cường độ cao', 'Vật liệu chịu nhiệt',
      'Kiểm tra phá hỏng', 'Kiểm tra không phá hỏng', 'Phân tích kim loại học'
    ],
    'quality-control': [
      'ISO 9001', 'Six Sigma', 'Lean Manufacturing', 'SPC (Statistical Process Control)',
      'FMEA', 'MSA (Measurement System Analysis)', '5S', 'Kaizen', 'TPM',
      'Kiểm tra chất lượng', 'Quản lý chất lượng', 'Audit nội bộ'
    ]
  };

  const certifications = [
    // Chứng chỉ hàn
    'Chứng chỉ thợ hàn AWS D1.1',
    'Chứng chỉ thợ hàn ASME IX',
    'Chứng chỉ thợ hàn EN ISO 9606',
    'Chứng chỉ thợ hàn JIS Z 3801',
    'Chứng chỉ thợ hàn đường ống API 1104',
    
    // Chứng chỉ kỹ thuật
    'Chứng chỉ vận hành CNC',
    'Chứng chỉ lập trình CNC',
    'Chứng chỉ AutoCAD Professional',
    'Chứng chỉ SolidWorks Professional',
    'Chứng chỉ CATIA Specialist',
    
    // Chứng chỉ an toàn
    'Chứng chỉ An toàn lao động',
    'Chứng chỉ Phòng cháy chữa cháy',
    'Chứng chỉ Làm việc trên cao',
    'Chứng chỉ Vận hành cầu trục',
    'Chứng chỉ Vận hành xe nâng',
    
    // Chứng chỉ quản lý
    'Chứng chỉ ISO 9001 Lead Auditor',
    'Chứng chỉ Six Sigma Green Belt',
    'Chứng chỉ Six Sigma Black Belt',
    'Chứng chỉ Lean Manufacturing',
    'Chứng chỉ PMP (Project Management)',
    
    // Chứng chỉ kỹ thuật xây dựng
    'Chứng chỉ Kỹ sư xây dựng',
    'Chứng chỉ Giám sát thi công',
    'Chứng chỉ Quản lý dự án xây dựng',
    'Chứng chỉ Kiểm định chất lượng công trình'
  ];

  const allSkills = Object.values(skillCategories)?.flat();

  const handleSkillInputChange = (value) => {
    setSkillInput(value);
    if (value?.length > 0) {
      const suggestions = allSkills?.filter(skill =>
        skill?.toLowerCase()?.includes(value?.toLowerCase()) &&
        !data?.skills?.includes(skill)
      )?.slice(0, 10);
      setSkillSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addSkill = (skill) => {
    if (skill && !data?.skills?.includes(skill)) {
      onChange({
        skills: [...(data?.skills || []), skill]
      });
      setSkillInput('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange({
      skills: data?.skills?.filter(skill => skill !== skillToRemove)
    });
  };

  const clearAllSkills = () => {
    onChange({
      skills: []
    });
  };

  const addCertification = (cert) => {
    if (cert && !data?.certifications?.includes(cert)) {
      onChange({
        certifications: [...(data?.certifications || []), cert]
      });
      setCertInput('');
    }
  };

  const removeCertification = (certToRemove) => {
    onChange({
      certifications: data?.certifications?.filter(cert => cert !== certToRemove)
    });
  };

  const clearAllCertifications = () => {
    onChange({
      certifications: []
    });
  };

  const addSkillCategory = (category) => {
    const categorySkills = skillCategories?.[category]?.filter(skill =>
      !data?.skills?.includes(skill)
    );
    
    if (categorySkills?.length > 0) {
      onChange({
        skills: [...(data?.skills || []), ...categorySkills]
      });
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Kỹ năng & Chứng chỉ yêu cầu
        </h3>
        <p className="text-muted-foreground mb-6">
          Chọn các kỹ năng kỹ thuật, phần mềm và chứng chỉ cần thiết cho vị trí kỹ thuật cơ khí, xây dựng này.
        </p>
      </div>
      {/* Technical Skills Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="Code" size={20} className="mr-2" />
          Kỹ năng kỹ thuật
          {errors?.skills && <span className="text-destructive ml-1">*</span>}
        </h4>

        {/* Skill Input */}
        <div className="relative">
          <Input
            placeholder="Nhập tên kỹ năng (ví dụ: AutoCAD, SolidWorks, Hàn TIG, Vận hành máy tiện...)"
            value={skillInput}
            onChange={(e) => handleSkillInputChange(e?.target?.value)}
            onKeyPress={handleSkillKeyPress}
            error={errors?.skills}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && skillSuggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-elevation-2 z-10 mt-1 max-h-60 overflow-y-auto">
              {skillSuggestions?.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-smooth text-sm"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Categories */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Thêm nhanh theo danh mục:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(skillCategories)?.map((category) => {
              const categoryLabels = {
                'cad-software': 'Phần mềm CAD',
                'machining': 'Gia công cơ khí',
                'welding': 'Kỹ thuật hàn',
                'construction': 'Xây dựng',
                'materials': 'Vật liệu',
                'quality-control': 'Kiểm soát chất lượng'
              };
              
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => addSkillCategory(category)}
                  className="text-xs"
                >
                  <Icon name="Plus" size={14} className="mr-1" />
                  {categoryLabels[category] || category}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Selected Skills */}
        {data?.skills?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Kỹ năng đã chọn ({data?.skills?.length}):
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSkills}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Xóa tất cả
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive transition-smooth"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Certifications Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="Award" size={20} className="mr-2" />
          Chứng chỉ (không bắt buộc)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certifications?.map((cert, index) => (
            <label
              key={index}
              className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth"
            >
              <input
                type="checkbox"
                checked={data?.certifications?.includes(cert)}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    addCertification(cert);
                  } else {
                    removeCertification(cert);
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{cert}</span>
            </label>
          ))}
        </div>

        {/* Custom Certification Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Hoặc nhập chứng chỉ khác..."
            value={certInput}
            onChange={(e) => setCertInput(e?.target?.value)}
            onKeyPress={(e) => {
              if (e?.key === 'Enter') {
                e?.preventDefault();
                addCertification(certInput);
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => addCertification(certInput)}
            disabled={!certInput}
          >
            Thêm
          </Button>
        </div>

        {/* Selected Certifications */}
        {data?.certifications?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Chứng chỉ đã chọn:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllCertifications}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Xóa tất cả
              </Button>
            </div>
            <div className="space-y-1">
              {data?.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-accent/50 px-3 py-2 rounded-md"
                >
                  <span className="text-sm">{cert}</span>
                  <button
                    onClick={() => removeCertification(cert)}
                    className="text-muted-foreground hover:text-destructive transition-smooth"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Skills Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Tóm tắt yêu cầu:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Kỹ năng bắt buộc:</strong> {data?.skills?.length || 0} kỹ năng
          </div>
          <div>
            <strong>Chứng chỉ ưu tiên:</strong> {data?.certifications?.length || 0} chứng chỉ
          </div>
        </div>
        {data?.skills?.length === 0 && (
          <p className="text-destructive text-sm mt-2">
            ⚠️ Vui lòng chọn ít nhất một kỹ năng để tiếp tục
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsSelector;