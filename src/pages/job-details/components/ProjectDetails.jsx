import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

const ProjectDetails = ({ project }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Mô tả dự án', icon: 'FileText' },
    { id: 'requirements', label: 'Yêu cầu kỹ thuật', icon: 'Settings' },
    { id: 'deliverables', label: 'Sản phẩm bàn giao', icon: 'Package' },
    { id: 'files', label: 'Tài liệu tham khảo', icon: 'Paperclip' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tổng quan dự án</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project?.fullDescription}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Mục tiêu</h3>
              <ul className="space-y-2">
                {project?.objectives?.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'requirements':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Yêu cầu kỹ thuật</h3>
              <div className="grid gap-4">
                {project?.technicalRequirements?.map((req, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">{req?.category}</h4>
                    <ul className="space-y-1">
                      {req?.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'deliverables':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Sản phẩm bàn giao</h3>
              <div className="space-y-3">
                {project?.deliverables?.map((deliverable, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="FileCheck" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{deliverable?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{deliverable?.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Icon name="Calendar" size={12} />
                        <span>Hạn: {deliverable?.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'files':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Tài liệu tham khảo</h3>
              {!project?.referenceFiles || project.referenceFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Không có tài liệu tham khảo</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {project.referenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name={file?.type === 'pdf' ? 'FileText' : file?.type === 'dwg' ? 'FileImage' : 'File'} size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{file?.name}</h4>
                          <p className="text-sm text-muted-foreground">{file?.size} · {file?.type?.toUpperCase()}</p>
                        </div>
                      </div>
                      {file?.url ? (
                        <Button 
                          asChild={isAuthenticated} 
                          variant="ghost" 
                          size="sm" 
                          iconName="Download" 
                          iconPosition="left"
                          disabled={!isAuthenticated}
                          title={!isAuthenticated ? "Đăng nhập để tải xuống tài liệu" : "Tải xuống"}
                        >
                          {isAuthenticated ? (
                            <a 
                              href={file.url} 
                              download={file.name}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              Tải xuống
                            </a>
                          ) : (
                            <span className="flex items-center gap-2">
                              Tải xuống
                            </span>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          iconName="Download" 
                          iconPosition="left" 
                          disabled 
                          title="Không có file để tải"
                        >
                          Tải xuống
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectDetails;

