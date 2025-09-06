import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ApplicationTracking = ({ formData, jobData, applicationStrength, onSubmit, loading }) => {
  const [customAnswers, setCustomAnswers] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);

  const handleCustomAnswerChange = (questionId, value) => {
    setCustomAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getSkillLevel = (skill, level) => {
    const levels = ['Không biết', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'];
    return levels?.[level] || 'Không biết';
  };

  const canSubmit = () => {
    // Check required fields
    const hasBasicInfo = formData?.fullName && formData?.email && formData?.phone;
    const hasCV = formData?.cv;
    const hasSkills = Object.values(formData?.technicalSkills || {})?.some(level => level > 0);
    
    // Check screening questions
    const hasAnsweredQuestions = jobData?.screeningQuestions?.every(question => {
      if (question?.required) {
        return customAnswers?.[question?.id] && customAnswers?.[question?.id]?.toString()?.trim();
      }
      return true;
    });
    
    return hasBasicInfo && hasCV && hasSkills && hasAnsweredQuestions && agreedToTerms;
  };

  const handleSubmitWithAnswers = () => {
    const submissionData = {
      ...formData,
      screeningAnswers: customAnswers,
      agreedToTerms,
      allowNotifications,
      submittedAt: new Date()?.toISOString()
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Xem lại & Hoàn tất đơn ứng tuyển
        </h3>
        <p className="text-muted-foreground">
          Kiểm tra lại thông tin và hoàn tất đơn ứng tuyển cho vị trí {jobData?.title}.
        </p>
      </div>
      <div className="space-y-6">
        {/* Application Strength Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-6 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Tổng quan hồ sơ ứng tuyển</h4>
            <div className={`text-2xl font-bold ${
              applicationStrength >= 80 ? 'text-success' :
              applicationStrength >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              {applicationStrength}%
            </div>
          </div>
          
          <div className="w-full bg-background rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-smooth ${
                applicationStrength >= 80 ? 'bg-success' :
                applicationStrength >= 60 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${applicationStrength}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            {applicationStrength >= 80 ? '🎉 Hồ sơ xuất sắc! Bạn có cơ hội cao được mời phỏng vấn.' :
             applicationStrength >= 60 ? '👍 Hồ sơ tốt. Có thể cải thiện thêm để tăng cơ hội.': '🔧 Hồ sơ cần hoàn thiện thêm để có cơ hội tốt hơn.'}
          </p>
        </div>

        {/* Personal Information Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="User" size={18} className="mr-2" />
            Thông tin cá nhân
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Họ tên:</span>
              <div className="font-medium">{formData?.fullName || 'Chưa điền'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <div className="font-medium">{formData?.email || 'Chưa điền'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Điện thoại:</span>
              <div className="font-medium">{formData?.phone || 'Chưa điền'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Địa chỉ:</span>
              <div className="font-medium">{formData?.address || 'Chưa điền'}</div>
            </div>
          </div>

          {formData?.summary && (
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-muted-foreground">Tóm tắt bản thân:</span>
              <div className="mt-1 text-sm text-muted-foreground">{formData?.summary}</div>
            </div>
          )}

          {(formData?.linkedin || formData?.github || formData?.portfolio) && (
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-muted-foreground">Liên kết chuyên môn:</span>
              <div className="mt-2 space-y-1 text-sm">
                {formData?.linkedin && (
                  <div>LinkedIn: <a href={formData?.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{formData?.linkedin}</a></div>
                )}
                {formData?.github && (
                  <div>GitHub: <a href={formData?.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{formData?.github}</a></div>
                )}
                {formData?.portfolio && (
                  <div>Portfolio: <a href={formData?.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{formData?.portfolio}</a></div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Skills Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Award" size={18} className="mr-2" />
            Kỹ năng & Kinh nghiệm
          </h4>
          
          <div className="space-y-4">
            <div>
              <span className="text-muted-foreground">Cấp độ kinh nghiệm:</span>
              <div className="font-medium">{formData?.experienceLevel || 'Chưa chọn'}</div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Đánh giá kỹ năng:</span>
              <div className="mt-2 space-y-2">
                {jobData?.skills?.map((skill) => {
                  const level = formData?.technicalSkills?.[skill] || 0;
                  return (
                    <div key={skill} className="flex items-center justify-between text-sm">
                      <span>{skill}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        level >= 4 ? 'bg-green-100 text-green-700' :
                        level >= 3 ? 'bg-yellow-100 text-yellow-700' :
                        level >= 1 ? 'bg-orange-100 text-orange-700': 'bg-muted text-muted-foreground'
                      }`}>
                        {getSkillLevel(skill, level)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {formData?.certifications?.length > 0 && (
              <div>
                <span className="text-muted-foreground">Chứng chỉ:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData?.certifications?.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="FileText" size={18} className="mr-2" />
            Tài liệu đính kèm
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CV/Resume:</span>
              <div className="flex items-center space-x-2">
                {formData?.cv ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium">{formData?.cv?.name}</span>
                    <span className="text-xs text-muted-foreground">({formatFileSize(formData?.cv?.size)})</span>
                  </>
                ) : (
                  <span className="text-sm text-destructive">Chưa tải lên</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Thư giới thiệu:</span>
              <div className="flex items-center space-x-2">
                {formData?.coverLetter ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium">{formData?.coverLetter?.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Không có</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Portfolio:</span>
              <div className="flex items-center space-x-2">
                {formData?.portfolioFile ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium">{formData?.portfolioFile ?.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Không có</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chứng chỉ:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {formData?.certificates?.length || 0} file
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Screening Questions */}
        {jobData?.screeningQuestions?.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center">
              <Icon name="HelpCircle" size={18} className="mr-2" />
              Câu hỏi từ nhà tuyển dụng
            </h4>
            
            <div className="space-y-4">
              {jobData?.screeningQuestions?.map((question, index) => (
                <div key={question?.id} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {index + 1}. {question?.question}
                    {question?.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  
                  {question?.type === 'textarea' ? (
                    <textarea
                      placeholder="Nhập câu trả lời của bạn..."
                      value={customAnswers?.[question?.id] || ''}
                      onChange={(e) => handleCustomAnswerChange(question?.id, e?.target?.value)}
                      rows={4}
                      className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : question?.type === 'choice' && question?.options ? (
                    <select
                      value={customAnswers?.[question?.id] || ''}
                      onChange={(e) => handleCustomAnswerChange(question?.id, e?.target?.value)}
                      className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Chọn câu trả lời...</option>
                      {question?.options?.map((option, optIndex) => (
                        <option key={optIndex} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : question?.type === 'number' ? (
                    <Input
                      type="number"
                      placeholder="Nhập số..."
                      value={customAnswers?.[question?.id] || ''}
                      onChange={(e) => handleCustomAnswerChange(question?.id, e?.target?.value)}
                    />
                  ) : (
                    <Input
                      placeholder="Nhập câu trả lời của bạn..."
                      value={customAnswers?.[question?.id] || ''}
                      onChange={(e) => handleCustomAnswerChange(question?.id, e?.target?.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms and Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Settings" size={18} className="mr-2" />
            Điều khoản & Thông báo
          </h4>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e?.target?.checked)}
                className="mt-1 rounded"
              />
              <div className="text-sm">
                <span className="text-foreground">
                  Tôi đồng ý với <a href="#" className="text-primary hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
                </span>
                <span className="text-destructive ml-1">*</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={allowNotifications}
                onChange={(e) => setAllowNotifications(e?.target?.checked)}
                className="mt-1 rounded"
              />
              <div className="text-sm text-muted-foreground">
                Nhận thông báo qua email về trạng thái đơn ứng tuyển và cơ hội việc làm phù hợp
              </div>
            </label>
          </div>
        </div>

        {/* Submit Section */}
        <div className={`bg-card border rounded-lg p-6 ${
          applicationStrength < 60 ? 'border-warning' : 'border-border'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Sẵn sàng nộp hồ sơ?</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Hồ sơ sẽ được gửi đến nhà tuyển dụng ngay lập tức</p>
                <p>• Bạn sẽ nhận được email xác nhận khi nộp thành công</p>
                <p>• Có thể theo dõi tiến trình qua dashboard của bạn</p>
              </div>
              
              {applicationStrength < 60 && (
                <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-2" />
                    Hồ sơ có điểm số thấp ({applicationStrength}%). Bạn có muốn cải thiện trước khi nộp?
                  </p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleSubmitWithAnswers}
              loading={loading}
              disabled={!canSubmit()}
              iconName="Send"
              className="bg-success hover:bg-success/90"
              size="lg"
            >
              {loading ? 'Đang gửi...' : 'Nộp hồ sơ ứng tuyển'}
            </Button>
          </div>
          
          {!canSubmit() && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Vui lòng hoàn thành:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                {!formData?.fullName && <li>Điền họ tên</li>}
                {!formData?.email && <li>Điền email</li>}
                {!formData?.phone && <li>Điền số điện thoại</li>}
                {!formData?.cv && <li>Tải lên CV</li>}
                {!Object.values(formData?.technicalSkills || {})?.some(level => level > 0) && <li>Đánh giá kỹ năng</li>}
                {!agreedToTerms && <li>Đồng ý với điều khoản</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;

