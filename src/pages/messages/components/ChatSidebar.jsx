import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';

const ChatSidebar = ({ conversations, selectedChatId, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const formatMessageTime = (date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Hôm qua';
    }
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Tin nhắn</h1>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon name="Edit" size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="MessageSquare" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có tin nhắn nào'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectChat(conversation)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectChat(conversation);
                  }
                }}
                className={cn(
                  'w-full p-4 hover:bg-muted/50 cursor-pointer transition-colors text-left',
                  selectedChatId === conversation.id && 'bg-muted'
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {conversation.user.avatar ? (
                        <img 
                          src={conversation.user.avatar} 
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={24} className="text-primary" />
                      )}
                    </div>
                    {/* Online status */}
                    {conversation.user.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {conversation.projectTitle}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        'text-sm truncate',
                        conversation.lastMessage.isRead 
                          ? 'text-muted-foreground' 
                          : 'text-foreground font-medium'
                      )}>
                        {conversation.lastMessage.text}
                      </p>
                      {!conversation.lastMessage.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>

                    {/* User status */}
                    {conversation.user.status === 'offline' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Hoạt động {formatLastSeen(conversation.user.lastSeen)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ChatSidebar.propTypes = {
  conversations: PropTypes.array.isRequired,
  selectedChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatSidebar;
