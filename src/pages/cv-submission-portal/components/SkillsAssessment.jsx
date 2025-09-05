import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SkillsAssessment = ({ jobData, data, onChange, errors }) => {
  const [certInput, setCertInput] = useState('');

  const skillLevels = [
    { value: 0, label: 'Không biết', color: 'bg-muted text-muted-foreground' },
    { value: 1, label: 'Cơ bản', color: 'bg-red-100 text-red-700' },
    { value: 2, label: 'Trung bình', color: 'bg-orange-100 text-orange-700' },
    { value: 3, label: 'Khá', color: 'bg-yellow-100 text-yellow-700' },
    { value: 4, label: 'Tốt', color: 'bg-green-100 text-green-700' },
    { value: 5, label: 'Xuất sắc', color: 'bg-blue-100 text-blue-700' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Mới tốt nghiệp (0-1 năm)', description: 'Chưa có hoặc có ít kinh nghiệm làm việc' },
    { value: 'junior', label: 'Junior (1-3 năm)', description: 'Có kinh nghiệm cơ bản, cần hướng dẫn' },
    { value: 'mid', label: 'Middle (3-5 năm)', description: 'Có thể làm việc độc lập, hiểu rõ nghiệp vụ' },
    { value: 'senior', label: 'Senior (5-8 năm)', description: 'Có thể dẫn dắt team, đưa ra quyết định kỹ thuật' },
    { value: 'lead', label: 'Lead/Principal (8+ năm)', description: 'Expert, có thể thiết kế hệ thống phức tạp' }
  ];

  const commonCertifications = [
    'AWS Certified Developer',
    'Google Cloud Professional',
    'Microsoft Azure Fundamentals',
    'Certified Kubernetes Administrator',
    'Oracle Certified Professional',
    'MongoDB Certified Developer',
    'Scrum Master Certified',
    'PMP Certification',
    'CISSP',
    'CompTIA Security+'
  ];

  const handleSkillChange = (skill, level) => {
    const updatedSkills = {
      ...(data?.technicalSkills || {}),
      [skill]: level
    };
    onChange({ technicalSkills: updatedSkills });
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

  const getSkillMatchScore = () => {
    const jobSkills = jobData?.skills || [];
    const userSkills = data?.technicalSkills || {};
    
    const matchedSkills = jobSkills?.filter(skill => userSkills?.[skill] >= 3);
    return jobSkills?.length > 0 ? Math.round((matchedSkills?.length / jobSkills?.length) * 100) : 0;
  };

  const getSkillLevel = (skill) => {
    return data?.technicalSkills?.[skill] || 0;
  };

  const getSkillLevelInfo = (level) => {
    return skillLevels?.find(l => l?.value === level) || skillLevels?.[0];
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Đánh giá kỹ năng & Kinh nghiệm
        </h3>
        <p className="text-muted-foreground">
          Tự đánh giá kỹ năng của bạn để nhà tuyển dụng hiểu rõ năng lực và kinh nghiệm của bạn.
        </p>
      </div>

      <div className="space-y-8">
        {/* Skill Match Overview */}
        <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Độ phù hợp kỹ năng</h4>
            <span className={`text-lg font-bold ${
              getSkillMatchScore() >= 70 ? 'text-success' : 
              getSkillMatchScore() >= 50 ? 'text-warning' : 'text-destructive'
            }`}>
              {getSkillMatchScore()}%
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-smooth ${
                getSkillMatchScore() >= 70 ? 'bg-success' : 
                getSkillMatchScore() >= 50 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${getSkillMatchScore()}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {getSkillMatchScore() >= 70 ? 'Kỹ năng rất phù hợp với yêu cầu công việc' :
             getSkillMatchScore() >= 50 ? 'Kỹ năng tương đối phù hợp, có thể học thêm': 'Nên nâng cao kỹ năng để phù hợp hơn với vị trí'}
          </p>
        </div>

        {/* Technical Skills Assessment */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Code" size={20} className="mr-2" />
            Kỹ năng kỹ thuật
            {errors?.skills && <span className="text-destructive ml-2">* Vui lòng đánh giá ít nhất một kỹ năng</span>}
          </h4>

          <div className="space-y-4">
            {jobData?.skills?.map((skill) => {
              const currentLevel = getSkillLevel(skill);
              const levelInfo = getSkillLevelInfo(currentLevel);
              
              return (
                <div key={skill} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-foreground">{skill}</h5>
                      <p className="text-sm text-muted-foreground">Yêu cầu cho công việc này</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo?.color}`}>
                      {levelInfo?.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    {skillLevels?.map((level) => (
                      <button
                        key={level?.value}
                        onClick={() => handleSkillChange(skill, level?.value)}
                        className={`p-2 rounded-md text-xs font-medium transition-smooth ${
                          currentLevel === level?.value
                            ? level?.color
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {level?.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Assessment Guide */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h5 className="font-medium text-foreground mb-2">Hướng dẫn đánh giá kỹ năng:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div><strong>Cơ bản:</strong> Biết khái niệm, cần hướng dẫn</div>
              <div><strong>Trung bình:</strong> Làm được task đơn giản</div>
              <div><strong>Khá:</strong> Tự tin với hầu hết task</div>
              <div><strong>Tốt:</strong> Có thể hướng dẫn người khác</div>
              <div><strong>Xuất sắc:</strong> Expert, đóng góp vào cộng đồng</div>
            </div>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Briefcase" size={20} className="mr-2" />
            Cấp độ kinh nghiệm tổng thể
          </h4>
          
          <div className="space-y-3">
            {experienceLevels?.map((level) => (
              <label
                key={level?.value}
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-smooth ${
                  data?.experienceLevel === level?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level?.value}
                  checked={data?.experienceLevel === level?.value}
                  onChange={(e) => onChange({ experienceLevel: e?.target?.value })}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-foreground">{level?.label}</div>
                  <div className="text-sm text-muted-foreground">{level?.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Award" size={20} className="mr-2" />
            Chứng chỉ chuyên môn
            <span className="text-sm text-muted-foreground ml-2 font-normal">(Tùy chọn)</span>
          </h4>

          {/* Common Certifications */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3">Chọn các chứng chỉ bạn đã có:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonCertifications?.map((cert) => (
                <label
                  key={cert}
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
          </div>

          {/* Custom Certification */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Hoặc nhập chứng chỉ khác..."
              value={certInput}
              onChange={(e) => setCertInput(e?.target?.value)}
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  e?.preventDefault();
                  addCertification(certInput);
                }
              }}
              className="flex-1 h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              <p className="text-sm font-medium text-foreground">Chứng chỉ đã chọn:</p>
              <div className="space-y-1">
                {data?.certifications?.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-accent/20 px-3 py-2 rounded-md"
                  >
                    <span className="text-sm flex items-center">
                      <Icon name="Award" size={14} className="mr-2 text-primary" />
                      {cert}
                    </span>
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
          <h4 className="font-medium text-foreground mb-3">Tóm tắt đánh giá:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Kỹ năng đã đánh giá:</div>
              <div className="font-medium">
                {Object.values(data?.technicalSkills || {})?.filter(level => level > 0)?.length} / {jobData?.skills?.length || 0} kỹ năng
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Chứng chỉ:</div>
              <div className="font-medium">{data?.certifications?.length || 0} chứng chỉ</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Độ phù hợp:</div>
              <div className={`font-medium ${
                getSkillMatchScore() >= 70 ? 'text-success' : 
                getSkillMatchScore() >= 50 ? 'text-warning' : 'text-destructive'
              }`}>
                {getSkillMatchScore()}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Kinh nghiệm:</div>
              <div className="font-medium">
                {data?.experienceLevel ? 
                  experienceLevels?.find(l => l?.value === data?.experienceLevel)?.label :
                  'Chưa chọn'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessment;