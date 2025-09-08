import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageCenter = ({ detailed = false }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      candidateName: 'Nguyễn Văn Minh',
      position: 'Kỹ sư Cơ khí Senior',
      lastMessage: 'Cảm ơn anh đã phỏng vấn em hôm qua. Em rất mong được làm việc tại công ty.',
      timestamp: '10 phút trước',
      unread: true,
      avatar: null,
      status: 'online',
      messages: [
        {
          id: 1,
          sender: 'candidate',
          message: 'Xin chào anh, em đã gửi CV ứng tuyển vị trí Kỹ sư Cơ khí. Em có thể biết thêm thông tin về công việc không ạ?',
          timestamp: '2025-01-08 09:00',
          read: true
        },
        {
          id: 2,
          sender: 'employer',
          message: 'Chào em! Cảm ơn em đã quan tâm đến vị trí này. Công việc sẽ tập trung vào thiết kế máy móc công nghiệp và quản lý dự án. Em có kinh nghiệm với AutoCAD và SolidWorks không?',
          timestamp: '2025-01-08 09:15',
          read: true
        },
        {
          id: 3,
          sender: 'candidate',
          message: 'Dạ, em có 5 năm kinh nghiệm với cả AutoCAD và SolidWorks. Em cũng đã làm nhiều dự án thiết kế máy móc cho ngành sản xuất.',
          timestamp: '2025-01-08 09:18',
          read: true
        }
      ]
    },
    {
      id: 2,
      candidateName: 'Trần Thị Hương',
      position: 'Chuyên viên Tính toán',
      lastMessage: 'Anh có thể cho em biết lịch phỏng vấn vòng 2 không ạ?',
      timestamp: '2 giờ trước',
      unread: false,
      avatar: null,
      status: 'offline',
      messages: [
        {
          id: 1,
          sender: 'candidate',
          message: 'Em vừa hoàn thành phỏng vấn vòng 1. Anh có thể cho em biết lịch phỏng vấn vòng 2 không ạ?',
          timestamp: '2025-01-08 14:00',
          read: true
        }
      ]
    },
    {
      id: 3,
      candidateName: 'Lê Hoàng Nam',
      position: 'Kỹ sư Điện - Tự động hóa',
      lastMessage: 'Em đồng ý với mức lương được đề xuất. Khi nào em có thể bắt đầu làm việc?',
      timestamp: '1 ngày trước',
      unread: true,
      avatar: null,
      status: 'online',
      messages: []
    }
  ];

  const filteredConversations = conversations?.filter(conv =>
    conv?.candidateName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    conv?.position?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    if (timestamp?.includes('phút')) return timestamp;
    if (timestamp?.includes('giờ')) return timestamp;
    if (timestamp?.includes('ngày')) return timestamp;
    
    const date = new Date(timestamp);
    return date?.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (!newMessage?.trim() || !selectedConversation) return;
    
    // Add message logic here
    console.log('Sending message:', newMessage, 'to:', selectedConversation?.candidateName);
    setNewMessage('');
  };

  const quickReplies = [
    'Cảm ơn bạn đã ứng tuyển!',
    'Chúng tôi sẽ xem xét CV của bạn và phản hồi sớm.',
    'Bạn có thể tham gia phỏng vấn vào lúc nào thuận tiện?',
    'Chúc mừng! Bạn đã vượt qua vòng phỏng vấn này.',
    'Chúng tôi cần thêm thời gian để đánh giá. Xin lỗi vì sự chờ đợi.'
  ];

  if (detailed) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Tin nhắn</h3>
                <Button variant="ghost" size="sm" iconName="Settings" />
              </div>
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-full">
              {filteredConversations?.map((conversation) => (
                <div
                  key={conversation?.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`flex items-center space-x-3 p-4 hover:bg-muted cursor-pointer border-b border-border transition-smooth ${
                    selectedConversation?.id === conversation?.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    {conversation?.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground truncate">
                        {conversation?.candidateName}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {conversation?.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {conversation?.position}
                    </p>
                    <p className={`text-sm truncate ${conversation?.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {conversation?.lastMessage}
                    </p>
                  </div>
                  
                  {conversation?.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      {selectedConversation?.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {selectedConversation?.candidateName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation?.position}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Phone" />
                    <Button variant="ghost" size="sm" iconName="Video" />
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation?.messages?.map((message) => (
                    <div
                      key={message?.id}
                      className={`flex ${message?.sender === 'employer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message?.sender === 'employer' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message?.message}</p>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {formatTimestamp(message?.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 border-t border-border">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickReplies?.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => setNewMessage(reply)}
                        className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full hover:bg-muted/80 transition-smooth"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Paperclip" />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e?.target?.value)}
                        onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                        className="w-full px-4 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <Button 
                      variant="default" 
                      size="sm" 
                      iconName="Send" 
                      onClick={handleSendMessage}
                      disabled={!newMessage?.trim()}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chọn cuộc trò chuyện để bắt đầu nhắn tin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact view for dashboard
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Tin nhắn gần đây</h2>
        </div>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {conversations?.slice(0, 4)?.map((conversation) => (
            <div key={conversation?.id} className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                {conversation?.status === 'online' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {conversation?.candidateName}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {conversation?.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {conversation?.position}
                </p>
                <p className={`text-sm truncate ${conversation?.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {conversation?.lastMessage}
                </p>
              </div>
              
              {conversation?.unread && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="outline" fullWidth iconName="MessageCircle" iconPosition="left">
            Xem tất cả tin nhắn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;