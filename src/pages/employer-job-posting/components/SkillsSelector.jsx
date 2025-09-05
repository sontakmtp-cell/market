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
    frontend: [
      'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3',
      'Sass/SCSS', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'Webpack', 'Vite'
    ],
    backend: [
      'Node.js', 'Python', 'Java', 'PHP', 'C#', '.NET', 'Ruby on Rails',
      'Express.js', 'Django', 'Spring Boot', 'Laravel', 'ASP.NET', 'FastAPI'
    ],
    database: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLServer', 'Oracle',
      'Elasticsearch', 'DynamoDB', 'Firebase', 'Supabase'
    ],
    cloud: [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
      'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible'
    ],
    mobile: [
      'React Native', 'Flutter', 'iOS Development', 'Android Development',
      'Swift', 'Kotlin', 'Xamarin', 'Ionic'
    ],
    tools: [
      'Git', 'Jira', 'Trello', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop',
      'Postman', 'VS Code', 'IntelliJ IDEA'
    ]
  };

  const certifications = [
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
          Chọn các kỹ năng kỹ thuật và chứng chỉ cần thiết cho vị trí này.
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
            placeholder="Nhập tên kỹ năng (ví dụ: React, Python, AWS...)"
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
            {Object.keys(skillCategories)?.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => addSkillCategory(category)}
                className="text-xs"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {data?.skills?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Kỹ năng đã chọn ({data?.skills?.length}):
            </p>
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
            <p className="text-sm font-medium text-foreground">
              Chứng chỉ đã chọn:
            </p>
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