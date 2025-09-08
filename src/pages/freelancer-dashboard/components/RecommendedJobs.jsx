import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendedJobs = () => {
  const recommendedJobs = [
    {
      id: 1,
      title: 'Thiết kế hệ thống cầu trục 10 tấn',
      company: 'Công ty TNHH Cơ khí Việt Nam',
      budget: '25000000-35000000',
      duration: '6 tuần',
      skills: ['Thiết kế cơ khí', 'AutoCAD', 'SolidWorks'],
      description: 'Cần thiết kế hệ thống cầu trục 10 tấn cho nhà máy sản xuất. Yêu cầu có kinh nghiệm thiết kế cầu trục công nghiệp.',
      postedTime: '2 giờ trước',
      applicants: 5,
      matchScore: 95
    },
    {
      id: 2,
      title: 'Tính toán kết cấu thép nhà xưởng',
      company: 'Công ty Xây dựng Đại Phát',
      budget: '15000000-20000000',
      duration: '4 tuần',
      skills: ['Kết cấu thép', 'SAP2000', 'ETABS'],
      description: 'Tính toán và thiết kế kết cấu thép cho nhà xưởng diện tích 2000m2. Yêu cầu có chứng chỉ hành nghề.',
      postedTime: '4 giờ trước',
      applicants: 8,
      matchScore: 88
    },
    {
      id: 3,
      title: 'Thiết kế hệ thống điện tự động hóa',
      company: 'Tập đoàn Công nghiệp ABC',
      budget: '30000000-40000000',
      duration: '8 tuần',
      skills: ['PLC', 'SCADA', 'Tự động hóa'],
      description: 'Thiết kế hệ thống điện và tự động hóa cho dây chuyền sản xuất. Yêu cầu kinh nghiệm với PLC Siemens.',
      postedTime: '6 giờ trước',
      applicants: 3,
      matchScore: 82
    }
  ];

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Công việc đề xuất</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="ExternalLink" iconPosition="right">
          Xem thêm
        </Button>
      </div>
      <div className="divide-y divide-border">
        {recommendedJobs?.map((job) => (
          <div key={job?.id} className="p-4 hover:bg-muted transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-foreground mb-1">{job?.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{job?.company}</p>
              </div>
              <div className={`text-sm font-medium ${getMatchScoreColor(job?.matchScore)}`}>
                {job?.matchScore}% phù hợp
              </div>
            </div>

            <p className="text-sm text-foreground mb-3 line-clamp-2">{job?.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {job?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="DollarSign" size={14} />
                  <span>{parseInt(job?.budget?.split('-')?.[0])?.toLocaleString('vi-VN')} - {parseInt(job?.budget?.split('-')?.[1])?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{job?.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{job?.postedTime}</span>
                <span>{job?.applicants} ứng viên</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="Heart" iconPosition="left">
                  Lưu
                </Button>
                <Button variant="default" size="sm" iconName="Send" iconPosition="left">
                  Ứng tuyển
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;