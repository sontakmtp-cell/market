import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const ChatWindow = ({ conversation, messages, currentUserId, onBack, onShowProfile }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Here you would typically send the message via API
    // console.log('Sending message:', newMessage);
    setNewMessage('');
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) return 'Hôm nay';
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) return 'Hôm qua';
    
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="md:hidden"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
            )}
            
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                {conversation.user.avatar ? (
                  <img 
                    src={conversation.user.avatar} 
                    alt={conversation.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} className="text-primary" />
                )}
              </div>
              {conversation.user.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
              )}
            </div>
            
            <div>
              <h2 className="font-semibold text-foreground">{conversation.user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {conversation.user.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Icon name="Phone" size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Video" size={18} />
            </Button>
            {onShowProfile && (
              <Button variant="ghost" size="sm" onClick={onShowProfile}>
                <Icon name="Info" size={18} />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Icon name="MoreHorizontal" size={18} />
            </Button>
          </div>
        </div>

        {/* Project info */}
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Briefcase" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Dự án:</span>
            <span className="text-sm text-muted-foreground">{conversation.projectTitle}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatMessageDate(new Date(date))}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUserId;
              const showAvatar = !isOwnMessage && (
                index === 0 || 
                dayMessages[index - 1].senderId !== message.senderId
              );
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end space-x-2',
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isOwnMessage && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {conversation.user.avatar ? (
                            <img 
                              src={conversation.user.avatar} 
                              alt={conversation.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <Icon name="User" size={16} className="text-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={cn(
                    'max-w-[70%] group',
                    isOwnMessage && 'order-first'
                  )}>
                    <div className={cn(
                      'px-4 py-2 rounded-2xl relative',
                      isOwnMessage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    )}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    
                    <div className={cn(
                      'flex items-center mt-1 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity',
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    )}>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {isOwnMessage && (
                        <Icon 
                          name={message.isRead ? "CheckCheck" : "Check"} 
                          size={12} 
                          className={cn(
                            message.isRead ? 'text-blue-500' : 'text-muted-foreground'
                          )} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" />
            </div>
            <div className="bg-muted px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" type="button">
              <Icon name="Paperclip" size={18} />
            </Button>
            <Button variant="ghost" size="sm" type="button">
              <Icon name="Image" size={18} />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full p-3 pr-12 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-muted/30 min-h-[44px] max-h-[120px]"
              rows="1"
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!newMessage.trim()}
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  onShowProfile: PropTypes.func,
};

export default ChatWindow;
