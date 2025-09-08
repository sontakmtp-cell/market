import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectSidebar = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Project Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trạng thái dự án</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
              {project?.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hạn nộp đề xuất:</span>
            <span className="text-sm font-medium text-foreground">{project?.deadline}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Số đề xuất:</span>
            <span className="text-sm font-medium text-foreground">{project?.proposals}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mức độ cạnh tranh:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)]?.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < project?.competitionLevel ? 'bg-warning' : 'bg-muted'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">Cao</span>
            </div>
          </div>
        </div>
      </div>
      {/* Required Skills */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Kỹ năng yêu cầu</h3>
        
        <div className="flex flex-wrap gap-2">
          {project?.requiredSkills?.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      {/* Similar Jobs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Công việc tương tự</h3>
        
        <div className="space-y-4">
          {project?.similarJobs?.map((job, index) => (
            <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
              <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                {job?.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="bg-success/10 text-success px-2 py-0.5 rounded">
                  {job?.budget}
                </span>
                <span>{job?.proposals} đề xuất</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {job?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Project Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thống kê</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Icon name="Eye" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Lượt xem:</span>
            <span className="text-sm font-medium text-foreground ml-auto">{project?.views}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Thời gian còn lại:</span>
            <span className="text-sm font-medium text-foreground ml-auto">{project?.timeLeft}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Mức giá trung bình:</span>
            <span className="text-sm font-medium text-foreground ml-auto">{project?.averageBid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;