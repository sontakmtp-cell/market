import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreviewMode = ({ formData, onEdit, onSubmit, loading }) => {
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN')?.format(value);
  };

  const getSalaryDisplay = () => {
    if (!formData?.showSalary) return 'Thương lượng';
    
    const min = formData?.salaryMin ? parseInt(formData?.salaryMin) : 0;
    const max = formData?.salaryMax ? parseInt(formData?.salaryMax) : 0;
    
    if (min && max) {
      return `${formatCurrency(min)} - ${formatCurrency(max)} ${formData?.currency || 'VND'}`;
    }
    return 'Thương lượng';
  };

  const getLocationTypeDisplay = (type) => {
    const types = {
      'remote': 'Làm việc từ xa',
      'onsite': 'Tại văn phòng',
      'hybrid': 'Linh hoạt (Hybrid)'
    };
    return types?.[type] || type;
  };

  const getEmploymentTypeDisplay = (type) => {
    const types = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'freelance': 'Freelance',
      'internship': 'Thực tập sinh'
    };
    return types?.[type] || type;
  };

  const getExperienceLevelDisplay = (level) => {
    const levels = {
      'entry': 'Mới tốt nghiệp (0-1 năm)',
      'junior': 'Junior (1-3 năm)',
      'mid': 'Middle (3-5 năm)',
      'senior': 'Senior (5-8 năm)',
      'lead': 'Lead/Principal (8+ năm)'
    };
    return levels?.[level] || level;
  };

  const getBenefitDisplay = (benefitId) => {
    const benefits = {
      'health': 'Bảo hiểm y tế',
      'dental': 'Bảo hiểm nha khoa',
      'life': 'Bảo hiểm nhân thọ',
      'remote': 'Làm việc từ xa',
      'flexible': 'Giờ làm việc linh hoạt',
      'vacation': 'Nghỉ phép có lương',
      'training': 'Đào tạo và phát triển',
      'gym': 'Hỗ trợ tập gym/thể thao',
      'meal': 'Hỗ trợ ăn uống',
      'transport': 'Hỗ trợ đi lại',
      'phone': 'Hỗ trợ điện thoại/Internet',
      'laptop': 'Cung cấp laptop/thiết bị'
    };
    return benefits?.[benefitId] || benefitId;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} className="text-blue-600" />
          <div>
            <h2 className="font-semibold text-foreground">Xem trước tin tuyển dụng</h2>
            <p className="text-sm text-muted-foreground">
              Đây là cách ứng viên sẽ nhìn thấy tin đăng của bạn
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onEdit} iconName="Edit">
            Chỉnh sửa
          </Button>
          <Button 
            onClick={onSubmit} 
            loading={loading}
            iconName="Send"
            className="bg-success hover:bg-success/90"
          >
            Đăng tin ngay
          </Button>
        </div>
      </div>

      {/* Job Card Preview */}
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {formData?.title || 'Tiêu đề công việc'}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Building" size={16} />
                  <span>Công ty ABC</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span>{formData?.location || 'Vị trí'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span>Vừa đăng</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">
                {getSalaryDisplay()}
              </div>
              <div className="text-sm text-muted-foreground">
                {getEmploymentTypeDisplay(formData?.employmentType)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {getLocationTypeDisplay(formData?.locationType)}
            </div>
            <div className="px-3 py-1 bg-secondary/10 text-secondary-foreground text-sm rounded-full">
              {getExperienceLevelDisplay(formData?.experienceLevel)}
            </div>
            {formData?.isUrgent && (
              <div className="px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full">
                🔥 Urgent
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Description */}
          {formData?.description && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Mô tả công việc
              </h3>
              <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                {formData?.description}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {formData?.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Trách nhiệm công việc
              </h3>
              <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                {formData?.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {formData?.requirements && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Yêu cầu ứng viên
              </h3>
              <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                {formData?.requirements}
              </div>
            </div>
          )}

          {/* Skills */}
          {formData?.skills?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Kỹ năng yêu cầu
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {formData?.benefits?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Phúc lợi & Quyền lợi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData?.benefits?.map((benefitId, index) => (
                  <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span className="text-sm">{getBenefitDisplay(benefitId)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contract Terms */}
          {formData?.contractTerms && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Điều khoản hợp đồng
              </h3>
              <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                {formData?.contractTerms}
              </div>
            </div>
          )}

          {/* Screening Questions */}
          {formData?.screeningQuestions?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Câu hỏi ứng tuyển
              </h3>
              <div className="space-y-3">
                {formData?.screeningQuestions?.map((question, index) => (
                  <div key={question?.id} className="bg-muted p-3 rounded-lg">
                    <p className="font-medium text-foreground">
                      {index + 1}. {question?.question}
                      {question?.required && <span className="text-destructive ml-1">*</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Loại câu trả lời: {question?.type === 'text' ? 'Câu trả lời ngắn' : 
                        question?.type === 'textarea' ? 'Câu trả lời dài' : 
                        question?.type === 'choice' ? 'Lựa chọn' :
                        question?.type === 'number' ? 'Số' : 'Tải file'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {(formData?.attachments?.length > 0 || formData?.companyMaterials?.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Tài liệu đính kèm
              </h3>
              <div className="space-y-3">
                {formData?.attachments?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Job Specifications:</h4>
                    <div className="space-y-1">
                      {formData?.attachments?.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Icon name="FileText" size={16} />
                          <span>{file?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData?.companyMaterials?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Company Materials:</h4>
                    <div className="space-y-1">
                      {formData?.companyMaterials?.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Icon name={file?.type?.startsWith('image/') ? 'Image' : 'FileText'} size={16} />
                          <span>{file?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Apply Section */}
        <div className="p-6 bg-muted border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Hạn nộp: {formData?.applicationDeadline ? 
                  new Date(formData?.applicationDeadline)?.toLocaleDateString('vi-VN') : 
                  'Không giới hạn'
                }
              </p>
              {formData?.autoResponse && (
                <p className="text-xs text-muted-foreground mt-1">
                  * Sẽ có email xác nhận tự động khi nộp hồ sơ
                </p>
              )}
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90" disabled>
              Ứng tuyển ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMode;