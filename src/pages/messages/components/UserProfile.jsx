import PropTypes from 'prop-types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserProfile = ({ user, projectTitle, onClose }) => {
  const formatLastSeen = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Thông tin</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="X" size={18} />
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 space-y-6">
        {/* Avatar and Basic Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} className="text-primary" />
            )}
          </div>
          <h4 className="font-semibold text-lg">{user.name}</h4>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-muted-foreground">
              {user.status === 'online' ? 'Đang hoạt động' : `Hoạt động ${formatLastSeen(user.lastSeen)}`}
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Dự án hiện tại</h5>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Briefcase" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">{projectTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Đang trong quá trình thực hiện
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>• Budget: 15-20M VND</span>
                  <span>• Timeline: 4-6 tuần</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Thống kê</h5>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-lg font-semibold text-primary">4.8</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-lg font-semibold text-primary">23</div>
              <div className="text-xs text-muted-foreground">Dự án</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Hành động</h5>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Icon name="User" size={16} className="mr-2" />
              Xem hồ sơ
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Icon name="Briefcase" size={16} className="mr-2" />
              Xem dự án
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Icon name="Phone" size={16} className="mr-2" />
              Gọi điện
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Icon name="Video" size={16} className="mr-2" />
              Video call
            </Button>
          </div>
        </div>

        {/* Shared Files */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Tệp đã chia sẻ</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Icon name="FileText" size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">project-requirements.pdf</p>
                <p className="text-xs text-muted-foreground">2.1 MB • Hôm qua</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <Icon name="Image" size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">design-mockup.png</p>
                <p className="text-xs text-muted-foreground">5.4 MB • 2 ngày trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <Icon name="Code" size={16} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">source-code.zip</p>
                <p className="text-xs text-muted-foreground">12.8 MB • 1 tuần trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <Icon name="PlayCircle" size={16} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">demo-video.mp4</p>
                <p className="text-xs text-muted-foreground">25.3 MB • 3 ngày trước</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-center" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Xem tất cả (12 files)
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Cài đặt</h5>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
              <Icon name="Bell" size={16} className="mr-2" />
              Tắt thông báo
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
              <Icon name="Search" size={16} className="mr-2" />
              Tìm trong cuộc trò chuyện
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive" size="sm">
              <Icon name="Trash2" size={16} className="mr-2" />
              Xóa cuộc trò chuyện
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  projectTitle: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfile;
