import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import JobSummaryCard from './components/JobSummaryCard';
import ApplicationForm from './components/ApplicationForm';
import SkillsAssessment from './components/SkillsAssessment';
import DocumentUpload from './components/DocumentUpload';
import ApplicationTracking from './components/ApplicationTracking';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getRecruitmentJobById, saveApplication } from '../../utils/dataStore';

const CvSubmissionPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    
    // Skills Assessment
    technicalSkills: {},
    certifications: [],
    experienceLevel: '',
    
    // Documents
    cv: null,
    coverLetter: null,
    portfolioFiles: null,
    certificates: [],
    
    // Application specific
    jobId: null,
    customAnswers: {},
    applicationDate: new Date()?.toISOString()
  });
  
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [applicationStrength, setApplicationStrength] = useState(0);
  const [missingRequirements, setMissingRequirements] = useState([]);

  const steps = [
    {
      id: 'job-info',
      title: 'Thông tin công việc',
      icon: 'Briefcase',
      description: 'Xem chi tiết vị trí ứng tuyển'
    },
    {
      id: 'personal',
      title: 'Thông tin cá nhân',
      icon: 'User',
      description: 'Điền thông tin liên hệ và hồ sơ'
    },
    {
      id: 'skills',
      title: 'Đánh giá kỹ năng',
      icon: 'Award',
      description: 'Tự đánh giá kỹ năng và kinh nghiệm'
    },
    {
      id: 'documents',
      title: 'Tài liệu hồ sơ',
      icon: 'Upload',
      description: 'Tải lên CV và tài liệu đính kèm'
    },
    {
      id: 'review',
      title: 'Xem lại & Nộp',
      icon: 'CheckSquare',
      description: 'Kiểm tra và hoàn tất đơn ứng tuyển'
    }
  ];

  // Mock job data - in real app, fetch from URL params or API
  const mockJobData = {
    id: 1,
    title: "Senior React Developer",
    company: "TechViet Solutions",
    location: "Hà Nội",
    salary: "25,000,000 - 35,000,000 VND",
    type: "Toàn thời gian",
    workType: "Hybrid",
    description: "Chúng tôi đang tìm kiếm một Senior React Developer có kinh nghiệm để tham gia đội ngũ phát triển sản phẩm...",
    requirements: [
      "5+ năm kinh nghiệm phát triển web với React",
      "Thành thạo JavaScript, TypeScript, HTML/CSS",
      "Hiểu biết về state management (Redux, Context API)",
      "Kinh nghiệm với REST APIs và GraphQL",
      "Kỹ năng làm việc nhóm và giao tiếp tốt"
    ],
    skills: ["React", "TypeScript", "Redux", "GraphQL", "Node.js", "AWS"],
    benefits: ["Bảo hiểm y tế", "Làm việc từ xa", "Đào tạo và phát triển", "Bonus theo hiệu suất"],
    deadline: "2024-02-15",
    posted: "2024-01-05",
    screeningQuestions: [
      {
        id: 1,
        question: "Bạn có bao nhiêu năm kinh nghiệm với React?",
        type: "number",
        required: true
      },
      {
        id: 2,
        question: "Mô tả dự án React phức tạp nhất bạn đã tham gia",
        type: "textarea",
        required: true
      },
      {
        id: 3,
        question: "Bạn có thể làm việc tại Hà Nội không?",
        type: "choice",
        required: true,
        options: ["Có", "Không", "Có thể thương lượng"]
      }
    ]
  };

  useEffect(() => {
    // Try to load job via ?jobId= from Recruitment Portal
    const params = new URLSearchParams(location.search);
    const jobId = params.get('jobId');
    if (jobId) {
      const storedJob = getRecruitmentJobById(jobId);
      if (storedJob) {
        setJobData({
          id: storedJob.id,
          title: storedJob.title,
          company: storedJob.department || 'Company',
          location: storedJob.location,
          salary: storedJob.showSalary && storedJob.salaryMin && storedJob.salaryMax
            ? `${storedJob.salaryMin} - ${storedJob.salaryMax} ${storedJob.currency || 'VND'}`
            : undefined,
          type: storedJob.employmentType,
          workType: storedJob.locationType,
          description: storedJob.description,
          requirements: storedJob.requirements ? storedJob.requirements.split('\n') : [],
          skills: storedJob.skills || [],
          benefits: storedJob.benefits || [],
          deadline: storedJob.applicationDeadline,
          posted: storedJob.createdAt,
          screeningQuestions: storedJob.screeningQuestions || [],
        });
        setFormData(prev => ({ ...prev, jobId: storedJob.id }));
      } else {
        // Fallback to mock if not found
        setJobData(mockJobData);
        setFormData(prev => ({ ...prev, jobId: mockJobData?.id }));
      }
    } else {
      // No jobId provided; use mock
      setJobData(mockJobData);
      setFormData(prev => ({ ...prev, jobId: mockJobData?.id }));
    }

    // Load existing application draft if any
    const draft = localStorage.getItem('cv-application-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...draftData }));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Calculate application strength
  useEffect(() => {
    if (!jobData) return;

    let score = 0;
    const missing = [];

    // Check basic info (20%)
    if (formData?.fullName && formData?.email && formData?.phone) {
      score += 20;
    } else {
      if (!formData?.fullName) missing?.push('Họ và tên');
      if (!formData?.email) missing?.push('Email');
      if (!formData?.phone) missing?.push('Số điện thoại');
    }

    // Check skills match (40%)
    const matchedSkills = jobData?.skills?.filter(skill => 
      formData?.technicalSkills?.[skill] > 0
    );
    const skillMatchRate = matchedSkills?.length / jobData?.skills?.length;
    score += Math.round(skillMatchRate * 40);

    if (skillMatchRate < 0.6) {
      missing?.push('Kỹ năng phù hợp với yêu cầu công việc');
    }

    // Check documents (30%)
    if (formData?.cv) score += 25;
    else missing?.push('CV/Resume');
    
    if (formData?.coverLetter) score += 5;

    // Check additional info (10%)
    if (formData?.summary) score += 5;
    if (formData?.linkedin || formData?.github || formData?.portfolio) score += 5;

    setApplicationStrength(Math.min(score, 100));
    setMissingRequirements(missing);
  }, [formData, jobData]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.values(formData)?.some(value => 
        value && (typeof value === 'string' ? value?.trim() : true)
      )) {
        localStorage.setItem('cv-application-draft', JSON.stringify({
          ...formData,
          lastSaved: new Date()?.toISOString()
        }));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  const handleFormChange = (step, data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    
    // Clear errors for updated fields
    if (errors?.[step]) {
      setErrors(prev => ({
        ...prev,
        [step]: {}
      }));
    }
  };

  const validateStep = (stepIndex) => {
    const step = steps?.[stepIndex];
    const stepErrors = {};

    switch (step?.id) {
      case 'personal':
        if (!formData?.fullName?.trim()) stepErrors.fullName = 'Họ và tên là bắt buộc';
        if (!formData?.email?.trim()) stepErrors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/?.test(formData?.email)) stepErrors.email = 'Email không hợp lệ';
        if (!formData?.phone?.trim()) stepErrors.phone = 'Số điện thoại là bắt buộc';
        break;
      case 'skills':
        const hasSkills = Object.values(formData?.technicalSkills || {})?.some(level => level > 0);
        if (!hasSkills) stepErrors.skills = 'Vui lòng đánh giá ít nhất một kỹ năng';
        break;
      case 'documents':
        if (!formData?.cv) stepErrors.cv = 'CV/Resume là bắt buộc';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [step?.id]: stepErrors
    }));

    return Object.keys(stepErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepSelect = (index) => {
    setCurrentStep(index);
  };

  const toFileMeta = (f) => {
    if (!f) return null;
    if (typeof f === 'object' && f && 'name' in f) {
      return { name: f.name, size: f.size, type: f.type };
    }
    return f;
  };

  const handleSubmit = async () => {
    // Validate all steps
    let hasErrors = false;
    for (let i = 1; i < steps?.length - 1; i++) { // Skip job info and review steps
      if (!validateStep(i)) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      alert('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      // Persist application to localStorage
      const payload = {
        ...formData,
        cv: toFileMeta(formData.cv),
        coverLetter: toFileMeta(formData.coverLetter),
        portfolioFile: toFileMeta(formData.portfolio),
        certificates: Array.isArray(formData.certificates)
          ? formData.certificates.map(toFileMeta)
          : [],
      };
      saveApplication(payload);
      
      // Clear draft after successful submission
      localStorage.removeItem('cv-application-draft');
      
      alert('Đơn ứng tuyển đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
      navigate('/recruitment-management-dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps?.[currentStep];
    
    switch (step?.id) {
      case 'job-info':
        return (
          <JobSummaryCard 
            jobData={jobData} 
            applicationStrength={applicationStrength}
            missingRequirements={missingRequirements}
          />
        );
      case 'personal':
        return (
          <ApplicationForm
            data={formData}
            onChange={(data) => handleFormChange('personal', data)}
            errors={errors?.personal || {}}
          />
        );
      case 'skills':
        return (
          <SkillsAssessment
            jobData={jobData}
            data={formData}
            onChange={(data) => handleFormChange('skills', data)}
            errors={errors?.skills || {}}
          />
        );
      case 'documents':
        return (
          <DocumentUpload
            data={formData}
            onChange={(data) => handleFormChange('documents', data)}
            errors={errors?.documents || {}}
          />
        );
      case 'review':
        return (
          <ApplicationTracking
            formData={formData}
            jobData={jobData}
            applicationStrength={applicationStrength}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (!jobData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin công việc...</p>
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
            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/recruitment-management-dashboard')}
                className="hover:text-foreground transition-smooth"
              >
                Thị trường việc làm
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Ứng tuyển</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Ứng tuyển: {jobData?.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              Hoàn thiện hồ sơ ứng tuyển để tăng cơ hội được tuyển dụng
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {steps?.map((step, index) => (
                  <button
                    key={step?.id}
                    onClick={() => handleStepSelect(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-smooth flex items-start space-x-3 ${
                      currentStep === index
                        ? 'bg-primary text-primary-foreground'
                        : currentStep > index
                        ? 'bg-success/10 text-success border border-success/20' :'hover:bg-muted'
                    }`}
                  >
                    <div className={`mt-0.5 ${
                      currentStep === index 
                        ? 'text-primary-foreground' 
                        : currentStep > index
                        ? 'text-success' :'text-muted-foreground'
                    }`}>
                      {currentStep > index ? (
                        <Icon name="CheckCircle" size={20} />
                      ) : (
                        <Icon name={step?.icon} size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{step?.title}</div>
                      <div className={`text-sm ${
                        currentStep === index 
                          ? 'text-primary-foreground/70' 
                          : currentStep > index
                          ? 'text-success/70' :'text-muted-foreground'
                      }`}>
                        {step?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Application Strength Indicator */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-foreground mb-2">
                  Độ mạnh hồ sơ: {applicationStrength}%
                </div>
                <div className="w-full bg-background rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-smooth ${
                      applicationStrength >= 80 ? 'bg-success' :
                      applicationStrength >= 60 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${applicationStrength}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {applicationStrength >= 80 ? '🎉 Hồ sơ xuất sắc!' :
                   applicationStrength >= 60 ? '👍 Hồ sơ tốt' :
                   applicationStrength >= 40 ? '🔧 Cần cải thiện': '⚠️ Cần hoàn thiện thêm'}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                {currentStep > 0 && (
                  <div className="flex items-center justify-between p-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      iconName="ChevronLeft"
                    >
                      Quay lại
                    </Button>
                    
                    <div className="flex items-center space-x-3">
                      {currentStep === steps?.length - 1 ? (
                        <Button
                          onClick={handleSubmit}
                          loading={loading}
                          iconName="Send"
                          className="bg-success hover:bg-success/90"
                          disabled={applicationStrength < 60}
                        >
                          Gửi đơn ứng tuyển
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvSubmissionPortal;
