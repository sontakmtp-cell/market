import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

const ProjectHeader = ({ project, onSaveJob, isSaved }) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Briefcase" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project?.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {project?.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  Đăng {project?.postedTime}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
              {project?.budget}
            </div>
            <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
              {project?.duration}
            </div>
            <div className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
              {project?.proposals} đề xuất
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            {project?.shortDescription}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <Button
            variant="outline"
            onClick={onSaveJob}
            iconName={isAuthenticated && isSaved ? "Heart" : "Heart"}
            iconPosition="left"
            className={isAuthenticated && isSaved ? "text-error border-error" : ""}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Đăng nhập để lưu công việc" : ""}
          >
            {isAuthenticated ? (isSaved ? "Đã lưu" : "Lưu công việc") : "Đăng nhập để lưu"}
          </Button>
          <Button
            variant="ghost"
            iconName="Share2"
            iconPosition="left"
          >
            Chia sẻ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;