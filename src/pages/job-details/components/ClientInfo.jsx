import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ClientInfo = ({ client }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin khách hàng</h3>
      <div className="flex items-start gap-4 mb-4">
        <Image
          src={client?.avatar}
          alt={client?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{client?.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{client?.company}</p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={14}
                className={i < Math.floor(client?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              {client?.rating} ({client?.reviewCount} đánh giá)
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span>{client?.location}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-foreground">{client?.totalJobs}</div>
          <div className="text-xs text-muted-foreground">Dự án đã đăng</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-foreground">{client?.hireRate}%</div>
          <div className="text-xs text-muted-foreground">Tỷ lệ thuê</div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Thành viên từ:</span>
          <span className="text-foreground">{client?.memberSince}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lần cuối online:</span>
          <span className="text-foreground">{client?.lastSeen}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Thời gian phản hồi:</span>
          <span className="text-foreground">{client?.responseTime}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Button variant="outline" fullWidth iconName="MessageSquare" iconPosition="left">
          Liên hệ khách hàng
        </Button>
        <Button variant="ghost" fullWidth iconName="Eye" iconPosition="left">
          Xem hồ sơ đầy đủ
        </Button>
      </div>
    </div>
  );
};

export default ClientInfo;