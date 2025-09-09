import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import JobBasicsForm from './components/JobBasicsForm';
import JobDescriptionEditor from './components/JobDescriptionEditor';
import SkillsSelector from './components/SkillsSelector';
import CompensationForm from './components/CompensationForm';
import AdvancedSettings from './components/AdvancedSettings';
import FileUploadSection from './components/FileUploadSection';
import PreviewMode from './components/PreviewMode';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { saveRecruitmentJob } from '../../utils/dataStore';
import { uploadFile } from '../../lib/supabaseClient';

const EmployerJobPosting = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Job Basics
    title: '',
    department: '',
    location: '',
    locationType: 'remote',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    
    // Job Description
    description: '',
    responsibilities: '',
    requirements: '',
    templateType: '',
    
    // Skills
    skills: [],
    certifications: [],
    
    // Compensation
    salaryMin: '',
    salaryMax: '',
    currency: 'VND',
    showSalary: false,
    benefits: [],
    contractTerms: '',
    
    // Advanced Settings
    applicationDeadline: '',
    screeningQuestions: [],
    autoResponse: false,
    responseTemplate: '',
    
    // Files
    attachments: [],
    companyMaterials: []
  });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sections = [
    {
      id: 'basics',
      title: 'Thông tin cơ bản',
      icon: 'Briefcase',
      description: 'Tiêu đề, phòng ban, địa điểm làm việc'
    },
    {
      id: 'description',
      title: 'Mô tả công việc',
      icon: 'FileText',
      description: 'Chi tiết về vị trí và yêu cầu'
    },
    {
      id: 'skills',
      title: 'Kỹ năng & Chứng chỉ',
      icon: 'Award',
      description: 'Yêu cầu kỹ thuật và kinh nghiệm'
    },
    {
      id: 'compensation',
      title: 'Lương thưởng & Phúc lợi',
      icon: 'DollarSign',
      description: 'Mức lương và các khoản phúc lợi'
    },
    {
      id: 'advanced',
      title: 'Cài đặt nâng cao',
      icon: 'Settings',
      description: 'Thời hạn, câu hỏi sàng lọc, tự động hóa'
    },
    {
      id: 'files',
      title: 'Tài liệu đính kèm',
      icon: 'Upload',
      description: 'Mô tả chi tiết, tài liệu công ty'
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(formData)?.some(key => formData?.[key])) {
        localStorage.setItem('job-posting-draft', JSON.stringify({
          ...formData,
          lastSaved: new Date()?.toISOString()
        }));
        setIsDraft(true);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('job-posting-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...draftData }));
        setIsDraft(true);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  const handleFormChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    
    // Clear errors for updated fields
    if (errors?.[section]) {
      setErrors(prev => ({
        ...prev,
        [section]: {}
      }));
    }
  };

  const validateSection = (sectionIndex) => {
    const section = sections?.[sectionIndex];
    const sectionErrors = {};

    switch (section?.id) {
      case 'basics':
        if (!formData?.title?.trim()) sectionErrors.title = 'Tiêu đề công việc là bắt buộc';
        if (!formData?.department?.trim()) sectionErrors.department = 'Phòng ban là bắt buộc';
        if (!formData?.location?.trim()) sectionErrors.location = 'Địa điểm làm việc là bắt buộc';
        break;
      case 'description':
        if (!formData?.description?.trim()) sectionErrors.description = 'Mô tả công việc là bắt buộc';
        if (!formData?.requirements?.trim()) sectionErrors.requirements = 'Yêu cầu ứng viên là bắt buộc';
        break;
      case 'skills':
        if (formData?.skills?.length === 0) sectionErrors.skills = 'Vui lòng chọn ít nhất một kỹ năng';
        break;
      case 'compensation':
        if (formData?.showSalary) {
          if (!formData?.salaryMin) sectionErrors.salaryMin = 'Mức lương tối thiểu là bắt buộc';
          if (!formData?.salaryMax) sectionErrors.salaryMax = 'Mức lương tối đa là bắt buộc';
          if (parseFloat(formData?.salaryMin) > parseFloat(formData?.salaryMax)) {
            sectionErrors.salaryMax = 'Mức lương tối đa phải lớn hơn mức lương tối thiểu';
          }
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [section?.id]: sectionErrors
    }));

    return Object.keys(sectionErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, sections?.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const handleSectionSelect = (index) => {
    setCurrentSection(index);
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('job-posting-draft', JSON.stringify({
      ...formData,
      lastSaved: new Date()?.toISOString()
    }));
    setIsDraft(true);
  };

  // Helper: upload all selected files to Supabase Storage and return normalized arrays
  const uploadJobFiles = async (data) => {
    const attachments = Array.isArray(data.attachments) ? data.attachments : [];
    const companyMaterials = Array.isArray(data.companyMaterials) ? data.companyMaterials : [];

    const uploadAttachmentPromises = attachments.map(async (f) => {
      if (!f?.file) {
        return { name: f?.name, size: f?.size, type: f?.type, url: f?.url };
      }
      const { publicURL, error } = await uploadFile(f.file, 'job-attachments');
      if (error || !publicURL) {
        throw new Error(`Tải file thất bại: ${f?.name} (${error?.message || 'unknown error'})`);
      }
      return { name: f.name, size: f.size, type: f.type, url: publicURL };
    });

    const uploadCompanyPromises = companyMaterials.map(async (f) => {
      if (!f?.file) {
        return { name: f?.name, size: f?.size, type: f?.type, url: f?.url };
      }
      const { publicURL, error } = await uploadFile(f.file, 'job-attachments');
      if (error || !publicURL) {
        throw new Error(`Tải file thất bại: ${f?.name} (${error?.message || 'unknown error'})`);
      }
      return { name: f.name, size: f.size, type: f.type, url: publicURL };
    });

    const [newAttachments, newCompanyMaterials] = await Promise.all([
      Promise.all(uploadAttachmentPromises),
      Promise.all(uploadCompanyPromises)
    ]);

    return { newAttachments, newCompanyMaterials };
  };

  // Persist via Supabase dataStore and navigate to dashboard
  const handleSubmitRecruitment = async () => {
    // Validate all sections first using existing logic
    let hasErrors = false;
    for (let i = 0; i < sections?.length; i++) {
      if (!validateSection(i)) {
        hasErrors = true;
      }
    }
    if (hasErrors) {
      alert('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const { newAttachments, newCompanyMaterials } = await uploadJobFiles(formData);
      const { data, error } = await saveRecruitmentJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        locationType: formData.locationType,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        // templateType: formData.templateType, // Temporarily disabled - column doesn't exist
        skills: formData.skills,
        certifications: formData.certifications,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency,
        showSalary: formData.showSalary,
        benefits: formData.benefits,
        contractTerms: formData.contractTerms,
        applicationDeadline: formData.applicationDeadline,
        screeningQuestions: formData.screeningQuestions,
        autoResponse: formData.autoResponse,
        responseTemplate: formData.responseTemplate,
        attachments: newAttachments,
        companyMaterials: newCompanyMaterials,
        status: 'active',
      });

      if (error) {
        console.error('Error saving job:', error);
        alert('Có lỗi xảy ra khi đăng tin: ' + (error.message || 'Unknown error'));
        return;
      }

      if (data) {
        localStorage.removeItem('job-posting-draft');
        alert('Tin tuyển dụng đã được đăng thành công!');
        // Go to dashboard to manage applications
        navigate('/recruitment-management-dashboard');
      } else {
        alert('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Unexpected error saving job:', e);
      alert('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all sections
    let hasErrors = false;
    for (let i = 0; i < sections?.length; i++) {
      if (!validateSection(i)) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      alert('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      // Mock API call to create job posting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft after successful submission
      localStorage.removeItem('job-posting-draft');
      
      alert('Tin tuyển dụng đã được đăng thành công!');
      navigate('/job-marketplace');
    } catch (error) {
      console.error('Error creating job posting:', error);
      alert('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderSectionContent = () => {
    const section = sections?.[currentSection];
    
    switch (section?.id) {
      case 'basics':
        return (
          <JobBasicsForm
            data={formData}
            onChange={(data) => handleFormChange('basics', data)}
            errors={errors?.basics || {}}
          />
        );
      case 'description':
        return (
          <JobDescriptionEditor
            data={formData}
            onChange={(data) => handleFormChange('description', data)}
            errors={errors?.description || {}}
          />
        );
      case 'skills':
        return (
          <SkillsSelector
            data={formData}
            onChange={(data) => handleFormChange('skills', data)}
            errors={errors?.skills || {}}
          />
        );
      case 'compensation':
        return (
          <CompensationForm
            data={formData}
            onChange={(data) => handleFormChange('compensation', data)}
            errors={errors?.compensation || {}}
          />
        );
      case 'advanced':
        return (
          <AdvancedSettings
            data={formData}
            onChange={(data) => handleFormChange('advanced', data)}
            errors={errors?.advanced || {}}
          />
        );
      case 'files':
        return (
          <FileUploadSection
            data={formData}
            onChange={(data) => handleFormChange('files', data)}
            errors={errors?.files || {}}
          />
        );
      default:
        return null;
    }
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <PreviewMode
            formData={formData}
            onEdit={() => setIsPreviewMode(false)}
            onSubmit={handleSubmitRecruitment}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Đăng tin tuyển dụng
                </h1>
                <p className="text-muted-foreground mt-2">
                  Tạo tin tuyển dụng chi tiết để thu hút ứng viên phù hợp
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {isDraft && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Save" size={16} className="mr-1" />
                    Đã lưu nháp
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  iconName="Save"
                >
                  Lưu nháp
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  iconName="Eye"
                >
                  Xem trước
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {sections?.map((section, index) => (
                  <button
                    key={section?.id}
                    onClick={() => handleSectionSelect(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-smooth flex items-start space-x-3 ${
                      currentSection === index
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={section?.icon} 
                      size={20} 
                      className={`mt-0.5 ${
                        currentSection === index 
                          ? 'text-primary-foreground' 
                          : 'text-muted-foreground'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{section?.title}</div>
                      <div className={`text-sm ${
                        currentSection === index 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {section?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
              
              {/* Progress Indicator */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-foreground mb-2">
                  Tiến độ: {currentSection + 1}/{sections?.length}
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-smooth"
                    style={{
                      width: `${((currentSection + 1) / sections?.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {renderSectionContent()}
                
                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSection === 0}
                    iconName="ChevronLeft"
                  >
                    Quay lại
                  </Button>
                  
                  <div className="flex items-center space-x-3">
                    {currentSection === sections?.length - 1 ? (
                      <Button
                        onClick={handleSubmitRecruitment}
                        loading={loading}
                        iconName="Send"
                        className="bg-success hover:bg-success/90"
                      >
                        Đăng tin tuyển dụng
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        iconName="ChevronRight"
                        iconPosition="right"
                      >
                        Tiếp theo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobPosting;
