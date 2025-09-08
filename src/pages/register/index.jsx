import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import RoleSelectionCard from './components/RoleSelectionCard';
import SpecializationSelector from './components/SpecializationSelector';
import CompanyInfoForm from './components/CompanyInfoForm';
import ProjectPreferencesForm from './components/ProjectPreferencesForm';
import FileUploadSection from './components/FileUploadSection';
import ProgressIndicator from './components/ProgressIndicator';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Role & Preferences
    selectedRole: '',
    selectedSpecializations: [],
    
    // Company Info (for employers)
    companyName: '',
    taxCode: '',
    companyAddress: '',
    companySize: '',
    industry: '',
    website: '',
    companyDescription: '',
    
    // Project Preferences (for clients)
    preferredProjectTypes: [],
    preferredBudget: '',
    preferredProjectSize: '',
    
    // Files
    profileImage: null,
    portfolio: null,
    resume: null,
    
    // Agreements
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 'basic',
      title: 'Thông tin cơ bản',
      description: 'Tài khoản & liên hệ'
    },
    {
      id: 'role',
      title: 'Vai trò',
      description: 'Chọn loại tài khoản'
    },
    {
      id: 'details',
      title: 'Chi tiết',
      description: 'Thông tin chuyên môn'
    },
    {
      id: 'files',
      title: 'Tài liệu',
      description: 'Upload hồ sơ'
    },
    {
      id: 'confirm',
      title: 'Xác nhận',
      description: 'Hoàn tất đăng ký'
    }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.firstName?.trim()) newErrors.firstName = 'Vui lòng nhập họ';
        if (!formData?.lastName?.trim()) newErrors.lastName = 'Vui lòng nhập tên';
        if (!formData?.email?.trim()) {
          newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
          newErrors.email = 'Email không hợp lệ';
        }
        if (!formData?.password) {
          newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData?.password?.length < 8) {
          newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        if (formData?.password !== formData?.confirmPassword) {
          newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        if (!formData?.phone?.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        break;

      case 2:
        if (!formData?.selectedRole) newErrors.selectedRole = 'Vui lòng chọn vai trò';
        break;

      case 3:
        if (formData?.selectedRole === 'freelancer') {
          if (formData?.selectedSpecializations?.length === 0) {
            newErrors.selectedSpecializations = 'Vui lòng chọn ít nhất một chuyên môn';
          }
        } else if (formData?.selectedRole === 'employer') {
          if (!formData?.companyName?.trim()) newErrors.companyName = 'Vui lòng nhập tên công ty';
          if (!formData?.companyAddress?.trim()) newErrors.companyAddress = 'Vui lòng nhập địa chỉ công ty';
          if (!formData?.companySize) newErrors.companySize = 'Vui lòng chọn quy mô công ty';
          if (!formData?.industry) newErrors.industry = 'Vui lòng chọn lĩnh vực hoạt động';
        }
        break;

      case 5:
        if (!formData?.agreeToTerms) newErrors.agreeToTerms = 'Vui lòng đồng ý với điều khoản sử dụng';
        if (!formData?.agreeToPrivacy) newErrors.agreeToPrivacy = 'Vui lòng đồng ý với chính sách bảo mật';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
      localStorage.setItem('userRole', formData?.selectedRole);
      localStorage.setItem('userEmail', formData?.email);
      
      // Navigate based on role
      if (formData?.selectedRole === 'freelancer') {
        navigate('/freelancer-dashboard');
      } else {
        navigate('/homepage');
      }
    } catch (error) {
      setErrors({ submit: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Thông tin cơ bản</h2>
              <p className="text-muted-foreground">Tạo tài khoản TechMarketplace Pro của bạn</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Họ"
                type="text"
                placeholder="Nhập họ của bạn"
                value={formData?.firstName}
                onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                error={errors?.firstName}
                required
              />

              <Input
                label="Tên"
                type="text"
                placeholder="Nhập tên của bạn"
                value={formData?.lastName}
                onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                error={errors?.lastName}
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />
              </div>

              <Input
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                required
              />

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData?.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                error={errors?.confirmPassword}
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Số điện thoại"
                  type="tel"
                  placeholder="0123 456 789"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Chọn vai trò</h2>
              <p className="text-muted-foreground">Bạn muốn sử dụng TechMarketplace Pro như thế nào?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['client', 'freelancer', 'employer', 'candidate']?.map((role) => (
                <RoleSelectionCard
                  key={role}
                  role={role}
                  isSelected={formData?.selectedRole === role}
                  onSelect={(selectedRole) => handleInputChange('selectedRole', selectedRole)}
                />
              ))}
            </div>
            {errors?.selectedRole && (
              <p className="text-sm text-error text-center">{errors?.selectedRole}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Thông tin chi tiết</h2>
              <p className="text-muted-foreground">
                {formData?.selectedRole === 'freelancer' && 'Cho chúng tôi biết về chuyên môn của bạn'}
                {formData?.selectedRole === 'employer' && 'Thông tin về công ty của bạn'}
                {formData?.selectedRole === 'client' && 'Sở thích dự án của bạn'}
                {formData?.selectedRole === 'candidate' && 'Cho chúng tôi biết về chuyên môn và kinh nghiệm của bạn'}
              </p>
            </div>
            {(formData?.selectedRole === 'freelancer' || formData?.selectedRole === 'candidate') && (
              <SpecializationSelector
                selectedSpecializations={formData?.selectedSpecializations}
                onChange={(specializations) => handleInputChange('selectedSpecializations', specializations)}
              />
            )}
            {formData?.selectedRole === 'employer' && (
              <CompanyInfoForm
                formData={formData}
                onChange={setFormData}
                errors={errors}
              />
            )}
            {formData?.selectedRole === 'client' && (
              <ProjectPreferencesForm
                formData={formData}
                onChange={setFormData}
                errors={errors}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tải lên tài liệu</h2>
              <p className="text-muted-foreground">Thêm hình ảnh và tài liệu để hoàn thiện hồ sơ</p>
            </div>
            <div className="space-y-8">
              <FileUploadSection
                title="Ảnh đại diện"
                description="Tải lên ảnh đại diện cho hồ sơ của bạn"
                acceptedTypes={['jpg', 'jpeg', 'png']}
                maxSize={5}
                onFileSelect={(file) => handleInputChange('profileImage', file)}
                selectedFile={formData?.profileImage}
                error={errors?.profileImage}
              />

              {formData?.selectedRole === 'freelancer' && (
                <>
                  <FileUploadSection
                    title="Portfolio"
                    description="Tải lên tài liệu portfolio thể hiện năng lực của bạn"
                    acceptedTypes={['pdf', 'doc', 'docx']}
                    maxSize={10}
                    onFileSelect={(file) => handleInputChange('portfolio', file)}
                    selectedFile={formData?.portfolio}
                    error={errors?.portfolio}
                  />

                  <FileUploadSection
                    title="CV/Resume"
                    description="Tải lên CV chi tiết về kinh nghiệm làm việc"
                    acceptedTypes={['pdf', 'doc', 'docx']}
                    maxSize={5}
                    onFileSelect={(file) => handleInputChange('resume', file)}
                    selectedFile={formData?.resume}
                    error={errors?.resume}
                  />
                </>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Xác nhận đăng ký</h2>
              <p className="text-muted-foreground">Xem lại thông tin và hoàn tất đăng ký</p>
            </div>
            {/* Registration Summary */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Tóm tắt thông tin</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Họ tên:</span>
                  <span className="ml-2 text-foreground">{formData?.firstName} {formData?.lastName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 text-foreground">{formData?.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vai trò:</span>
                  <span className="ml-2 text-foreground capitalize">
                    {formData?.selectedRole === 'client' && 'Khách hàng'}
                    {formData?.selectedRole === 'freelancer' && 'Freelancer'}
                    {formData?.selectedRole === 'employer' && 'Nhà tuyển dụng'}
                    {formData?.selectedRole === 'candidate' && 'Ứng viên'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Điện thoại:</span>
                  <span className="ml-2 text-foreground">{formData?.phone}</span>
                </div>
              </div>
            </div>
            {/* Terms and Agreements */}
            <div className="space-y-4">
              <Checkbox
                label="Tôi đồng ý với Điều khoản sử dụng"
                description="Đọc và chấp nhận các điều khoản dịch vụ của TechMarketplace Pro"
                checked={formData?.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                error={errors?.agreeToTerms}
                required
              />

              <Checkbox
                label="Tôi đồng ý với Chính sách bảo mật"
                description="Chấp nhận cách thức xử lý dữ liệu cá nhân"
                checked={formData?.agreeToPrivacy}
                onChange={(e) => handleInputChange('agreeToPrivacy', e?.target?.checked)}
                error={errors?.agreeToPrivacy}
                required
              />

              <Checkbox
                label="Đăng ký nhận bản tin"
                description="Nhận thông tin về cơ hội việc làm và cập nhật sản phẩm mới"
                checked={formData?.subscribeNewsletter}
                onChange={(e) => handleInputChange('subscribeNewsletter', e?.target?.checked)}
              />
            </div>
            {errors?.submit && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <p className="text-sm text-error">{errors?.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Đăng ký - TechMarketplace Pro</title>
        <meta name="description" content="Tạo tài khoản TechMarketplace Pro để kết nối với các cơ hội kỹ thuật chuyên nghiệp" />
      </Helmet>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/homepage" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground leading-none">TechMarketplace</span>
                <span className="text-xs text-muted-foreground leading-none">Pro</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Đã có tài khoản?</span>
              <Link to="/login">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps?.length}
          steps={steps}
        />

        <div className="bg-card rounded-xl shadow-elevation-1 p-6 md:p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Quay lại
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {currentStep < steps?.length ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  loading={isLoading}
                  iconName="Check"
                  iconPosition="left"
                >
                  Hoàn tất đăng ký
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cần hỗ trợ? Liên hệ{' '}
            <a href="mailto:support@techmarketplace.vn" className="text-primary hover:underline">
              support@techmarketplace.vn
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;