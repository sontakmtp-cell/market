import React from 'react';
import Icon from '../../../components/AppIcon';

const JobSummaryCard = ({ jobData, applicationStrength, missingRequirements }) => {
  if (!jobData) return null;

  const getDeadlineStatus = () => {
    if (!jobData?.deadline) return null;
    
    const deadline = new Date(jobData?.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: 'expired', text: 'Đã hết hạn', color: 'text-destructive' };
    } else if (daysLeft === 0) {
      return { status: 'today', text: 'Hết hạn hôm nay', color: 'text-destructive' };
    } else if (daysLeft <= 3) {
      return { status: 'urgent', text: `Còn ${daysLeft} ngày`, color: 'text-warning' };
    } else if (daysLeft <= 7) {
      return { status: 'soon', text: `Còn ${daysLeft} ngày`, color: 'text-orange-600' };
    } else {
      return { status: 'normal', text: `Còn ${daysLeft} ngày`, color: 'text-muted-foreground' };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Thông tin vị trí ứng tuyển
        </h3>
        <p className="text-muted-foreground">
          Xem lại thông tin công việc và kiểm tra độ phù hợp của hồ sơ bạn.
        </p>
      </div>

      {/* Job Header */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-6 rounded-lg mb-6 border border-primary/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {jobData?.title}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <Icon name="Building" size={16} />
                <span>{jobData?.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={16} />
                <span>{jobData?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={16} />
                <span>Đăng {new Date(jobData?.posted)?.toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-primary mb-1">
              {jobData?.salary}
            </div>
            <div className="text-sm text-muted-foreground">
              {jobData?.type} • {jobData?.workType}
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {deadlineStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              deadlineStatus?.status === 'expired' || deadlineStatus?.status === 'today' ?'bg-destructive/10 text-destructive'
                : deadlineStatus?.status === 'urgent' ?'bg-warning/10 text-warning'
                : deadlineStatus?.status === 'soon' ?'bg-orange-100 text-orange-600' :'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Calendar" size={14} className="inline mr-1" />
              {deadlineStatus?.text}
            </div>
          )}
          
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Icon name="Users" size={14} className="inline mr-1" />
            15+ ứng viên quan tâm
          </div>
        </div>

        {/* Application Strength Indicator */}
        <div className="bg-background/80 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Độ phù hợp hồ sơ
            </span>
            <span className={`text-sm font-semibold ${
              applicationStrength >= 80 ? 'text-success' :
              applicationStrength >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              {applicationStrength}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-smooth ${
                applicationStrength >= 80 ? 'bg-success' :
                applicationStrength >= 60 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${applicationStrength}%` }}
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            {applicationStrength >= 80 ? 'Hồ sơ rất phù hợp với yêu cầu' :
             applicationStrength >= 60 ? 'Hồ sơ khá phù hợp, có thể cải thiện': 'Hồ sơ cần hoàn thiện thêm để tăng cơ hội'}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="FileText" size={18} className="mr-2" />
            Mô tả công việc
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {jobData?.description}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="CheckSquare" size={18} className="mr-2" />
            Yêu cầu ứng viên
          </h4>
          <ul className="space-y-2">
            {jobData?.requirements?.map((requirement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon name="ChevronRight" size={16} className="mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Skills */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Award" size={18} className="mr-2" />
            Kỹ năng yêu cầu
          </h4>
          <div className="flex flex-wrap gap-2">
            {jobData?.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Gift" size={18} className="mr-2" />
            Phúc lợi & Quyền lợi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {jobData?.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-muted-foreground text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Requirements Alert */}
        {missingRequirements?.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Icon name="AlertTriangle" size={16} className="mr-2 text-warning" />
              Để tăng cơ hội được tuyển
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {missingRequirements?.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Icon name="ArrowRight" size={12} />
                  <span>Hoàn thiện: {item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Screening Questions Preview */}
        {jobData?.screeningQuestions?.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Icon name="HelpCircle" size={16} className="mr-2 text-blue-600" />
              Câu hỏi sàng lọc ({jobData?.screeningQuestions?.length} câu hỏi)
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Nhà tuyển dụng sẽ yêu cầu bạn trả lời các câu hỏi sau trong quá trình ứng tuyển:
            </p>
            <ul className="space-y-1 text-sm">
              {jobData?.screeningQuestions?.map((question, index) => (
                <li key={index} className="text-muted-foreground">
                  {index + 1}. {question?.question}
                  {question?.required && <span className="text-destructive ml-1">*</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Apply CTA */}
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
          <h4 className="font-medium text-foreground mb-2">
            Sẵn sàng ứng tuyển?
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Hoàn thiện các bước tiếp theo để nộp hồ sơ ứng tuyển của bạn
          </p>
          <div className="text-xs text-muted-foreground">
            Bước tiếp theo: Điền thông tin cá nhân →
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSummaryCard;