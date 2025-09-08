import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FreelancerManagement = () => {
  const freelancers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      expertise: 'Thiết kế cơ khí',
      rating: 4.9,
      projectsCount: 2,
      status: 'active',
      avatar: null
    },
    {
      id: 2,
      name: 'Trần Thị B',
      expertise: 'Kết cấu thép',
      rating: 4.8,
      projectsCount: 1,
      status: 'active',
      avatar: null
    },
    {
      id: 3,
      name: 'Lê Văn C',
      expertise: 'Hệ thống băng tải',
      rating: 4.7,
      projectsCount: 1,
      status: 'active',
      avatar: null
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Freelancer đang hợp tác</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="UserPlus">
          Tìm thêm
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{freelancer.name}</p>
                <p className="text-xs text-muted-foreground">{freelancer.expertise}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-warning" />
                    <span className="text-xs text-muted-foreground">{freelancer.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{freelancer.projectsCount} dự án</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" iconName="MessageSquare" />
              <Button variant="ghost" size="sm" iconName="Star" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerManagement;
