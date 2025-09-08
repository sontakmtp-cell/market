import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PipelineStages = ({ jobId }) => {
  const [selectedStage, setSelectedStage] = useState('screening');

  const pipelineData = {
    screening: {
      title: 'Sàng lọc CV',
      count: 18,
      candidates: [
        { id: 1, name: 'Nguyễn Văn A', score: 85, time: '2 giờ trước' },
        { id: 2, name: 'Trần Thị B', score: 78, time: '4 giờ trước' },
        { id: 3, name: 'Lê Văn C', score: 92, time: '6 giờ trước' }
      ]
    },
    interview_1: {
      title: 'Phỏng vấn vòng 1',
      count: 8,
      candidates: [
        { id: 4, name: 'Phạm Minh D', score: 88, time: 'Hôm qua', scheduled: '10:00 - 09/01' },
        { id: 5, name: 'Hoàng Thị E', score: 82, time: 'Hôm qua', scheduled: '14:00 - 09/01' }
      ]
    },
    interview_2: {
      title: 'Phỏng vấn vòng 2', 
      count: 4,
      candidates: [
        { id: 6, name: 'Võ Văn F', score: 91, time: '2 ngày trước', scheduled: '09:00 - 10/01' }
      ]
    },
    offer: {
      title: 'Gửi offer',
      count: 2,
      candidates: [
        { id: 7, name: 'Đặng Thị G', score: 95, time: '3 ngày trước', offer_sent: '08/01/2025' }
      ]
    },
    hired: {
      title: 'Đã tuyển',
      count: 1,
      candidates: [
        { id: 8, name: 'Bùi Văn H', score: 96, time: '1 tuần trước', hired_date: '02/01/2025' }
      ]
    }
  };

  const stages = [
    { key: 'screening', label: 'Sàng lọc', icon: 'Filter', color: 'bg-blue-500' },
    { key: 'interview_1', label: 'PV vòng 1', icon: 'Users', color: 'bg-purple-500' },
    { key: 'interview_2', label: 'PV vòng 2', icon: 'UserCheck', color: 'bg-indigo-500' },
    { key: 'offer', label: 'Offer', icon: 'Mail', color: 'bg-green-500' },
    { key: 'hired', label: 'Đã tuyển', icon: 'CheckCircle', color: 'bg-emerald-500' }
  ];

  const totalCandidates = Object.values(pipelineData)?.reduce((sum, stage) => sum + stage?.count, 0);
  
  const getConversionRate = (currentStage, previousStage) => {
    if (!previousStage) return 100;
    const current = pipelineData?.[currentStage]?.count || 0;
    const previous = pipelineData?.[previousStage]?.count || 0;
    return previous > 0 ? Math.round((current / previous) * 100) : 0;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Pipeline tuyển dụng
          </h2>
          <span className="text-sm text-muted-foreground">
            ({totalCandidates} ứng viên)
          </span>
        </div>
        <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
          Xem báo cáo chi tiết
        </Button>
      </div>
      <div className="p-6">
        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {stages?.map((stage, index) => {
            const stageData = pipelineData?.[stage?.key];
            const previousStageKey = index > 0 ? stages?.[index - 1]?.key : null;
            const conversionRate = getConversionRate(stage?.key, previousStageKey);
            
            return (
              <div
                key={stage?.key}
                className={`relative cursor-pointer transition-smooth ${
                  selectedStage === stage?.key 
                    ? 'ring-2 ring-primary ring-opacity-50' :''
                }`}
                onClick={() => setSelectedStage(stage?.key)}
              >
                {/* Connection Line */}
                {index < stages?.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-2 w-4 h-0.5 bg-border z-10" />
                )}
                <div className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-smooth">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${stage?.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={stage?.icon} size={20} className="text-white" />
                    </div>
                    {index > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {conversionRate}%
                      </div>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stageData?.count}
                  </div>
                  
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {stage?.label}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div 
                      className={`${stage?.color} h-1.5 rounded-full transition-smooth`}
                      style={{ 
                        width: `${totalCandidates > 0 ? (stageData?.count / totalCandidates) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Details */}
        <div className="bg-muted rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {pipelineData?.[selectedStage]?.title}
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">
                Lọc
              </Button>
              <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="left">
                Chuyển giai đoạn
              </Button>
            </div>
          </div>

          {/* Candidates in Selected Stage */}
          <div className="space-y-3">
            {pipelineData?.[selectedStage]?.candidates?.map((candidate) => (
              <div 
                key={candidate?.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-elevation-1 transition-smooth"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-foreground">
                      {candidate?.name}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Điểm: {candidate?.score}/100</span>
                      <span>{candidate?.time}</span>
                      {candidate?.scheduled && (
                        <span className="text-warning">
                          Lịch PV: {candidate?.scheduled}
                        </span>
                      )}
                      {candidate?.offer_sent && (
                        <span className="text-success">
                          Offer gửi: {candidate?.offer_sent}
                        </span>
                      )}
                      {candidate?.hired_date && (
                        <span className="text-accent">
                          Ngày nhận việc: {candidate?.hired_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Eye">
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" iconName="MessageCircle">
                    Chat
                  </Button>
                  {selectedStage === 'screening' && (
                    <Button variant="default" size="sm" iconName="ArrowRight">
                      Chuyển PV
                    </Button>
                  )}
                  {selectedStage === 'interview_1' && (
                    <Button variant="default" size="sm" iconName="Calendar">
                      Lên lịch
                    </Button>
                  )}
                  {selectedStage === 'offer' && (
                    <Button variant="success" size="sm" iconName="Check">
                      Xác nhận
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {pipelineData?.[selectedStage]?.candidates?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Chưa có ứng viên nào ở giai đoạn này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PipelineStages;