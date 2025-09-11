import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import UserProfile from './components/UserProfile';

const MessagesPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mock data for demo
  const [conversations] = useState([
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Nguyễn Văn Minh',
        avatar: null,
        status: 'online',
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Chào anh, em có thể bắt đầu dự án vào tuần tới được không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isRead: false
      },
      projectTitle: 'Thiết kế website bán hàng'
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Trần Thị Lan',
        avatar: null,
        status: 'offline',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      lastMessage: {
        text: 'Cảm ơn anh đã tin tương và thuê em làm dự án này.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true
      },
      projectTitle: 'Phát triển ứng dụng mobile'
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Lê Hoàng Nam',
        avatar: null,
        status: 'online',
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Dự án đã hoàn thành, anh kiểm tra giúp em nhé!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false
      },
      projectTitle: 'Tối ưu SEO website'
    },
    {
      id: '4',
      user: {
        id: 'user4',
        name: 'Phạm Thu Hương',
        avatar: null,
        status: 'online',
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Em vừa gửi bản demo đầu tiên, anh xem và góp ý giúp em.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        isRead: true
      },
      projectTitle: 'Thiết kế logo và branding'
    },
    {
      id: '5',
      user: {
        id: 'user5',
        name: 'Võ Đức Thắng',
        avatar: null,
        status: 'offline',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      },
      lastMessage: {
        text: 'Anh có thể chia sẻ thêm về yêu cầu kỹ thuật không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        isRead: true
      },
      projectTitle: 'Phát triển API backend'
    },
    {
      id: '6',
      user: {
        id: 'user6',
        name: 'Ngô Minh Châu',
        avatar: null,
        status: 'offline',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
      },
      lastMessage: {
        text: 'Chào anh! Em quan tâm đến dự án này và muốn trao đổi thêm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        isRead: false
      },
      projectTitle: 'Viết content marketing'
    },
    {
      id: '7',
      user: {
        id: 'user7',
        name: 'Đặng Quốc Tuấn',
        avatar: null,
        status: 'online',
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Timeline dự án có thể linh hoạt được không anh?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false
      },
      projectTitle: 'Phát triển ứng dụng React Native'
    },
    {
      id: '8',
      user: {
        id: 'user8',
        name: 'Lý Thanh Mai',
        avatar: null,
        status: 'offline',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
      },
      lastMessage: {
        text: 'Budget cho dự án này như thế nào ạ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        isRead: true
      },
      projectTitle: 'Thiết kế UI/UX cho app'
    }
  ]);

  const [messages] = useState({
    '1': [
      {
        id: 'm1',
        senderId: 'user1',
        text: 'Chào anh! Em đã xem qua requirements của dự án website bán hàng.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true
      },
      {
        id: 'm2',
        senderId: user?.id,
        text: 'Chào em! Em có thắc mắc gì về dự án không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'user1',
        text: 'Em muốn hỏi về timeline và công nghệ sử dụng ạ. Dự án này em thấy khá thú vị.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true
      },
      {
        id: 'm4',
        senderId: user?.id,
        text: 'Dự án này sẽ sử dụng React + Node.js + MongoDB. Timeline dự kiến 4-6 tuần. Em có kinh nghiệm với stack này chưa?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        isRead: true
      },
      {
        id: 'm5',
        senderId: 'user1',
        text: 'Vâng, em đã làm nhiều dự án với stack này rồi ạ. Em có thể share một vài portfolio để anh tham khảo.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true
      },
      {
        id: 'm6',
        senderId: user?.id,
        text: 'Tuyệt vời! Em gửi portfolio qua email nhé. Và budget của dự án này là 15-20 triệu.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true
      },
      {
        id: 'm7',
        senderId: 'user1',
        text: 'Budget ok với em ạ! Em sẽ gửi portfolio và proposal chi tiết trong hôm nay.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true
      },
      {
        id: 'm8',
        senderId: 'user1',
        text: 'Chào anh, em có thể bắt đầu dự án vào tuần tới được không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isRead: false
      }
    ],
    '2': [
      {
        id: 'm21',
        senderId: user?.id,
        text: 'Chào em! Anh đã review proposal của em và thấy rất phù hợp với dự án mobile app.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true
      },
      {
        id: 'm22',
        senderId: 'user2',
        text: 'Cảm ơn anh! Em rất hào hứng được tham gia dự án này. Khi nào em có thể bắt đầu ạ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
        isRead: true
      },
      {
        id: 'm23',
        senderId: user?.id,
        text: 'Em có thể bắt đầu từ tuần sau. Anh sẽ gửi tài liệu chi tiết và contract.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
        isRead: true
      },
      {
        id: 'm24',
        senderId: 'user2',
        text: 'Vâng ạ! Em đã nhận được contract và đã ký. Em sẽ bắt đầu từ thứ 2 tuần sau.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        isRead: true
      },
      {
        id: 'm25',
        senderId: user?.id,
        text: 'Perfect! Anh đã tạo group chat cho team và add em vào. Welcome aboard! 🎉',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        isRead: true
      },
      {
        id: 'm26',
        senderId: 'user2',
        text: 'Cảm ơn anh đã tin tương và thuê em làm dự án này.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true
      }
    ],
    '3': [
      {
        id: 'm31',
        senderId: 'user3',
        text: 'Chào anh! Em đã hoàn thành phase 1 của dự án SEO. Anh có thể check giúp em không ạ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true
      },
      {
        id: 'm32',
        senderId: user?.id,
        text: 'Chào em! Anh sẽ check ngay và feedback trong hôm nay nhé.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        isRead: true
      },
      {
        id: 'm33',
        senderId: user?.id,
        text: 'Anh đã check xong. Overall rất tốt! Có một vài điểm nhỏ cần adjust, anh gửi chi tiết qua email.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true
      },
      {
        id: 'm34',
        senderId: 'user3',
        text: 'Cảm ơn anh! Em đã nhận được feedback và sẽ adjust ngay hôm nay.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true
      },
      {
        id: 'm35',
        senderId: 'user3',
        text: 'Dự án đã hoàn thành, anh kiểm tra giúp em nhé!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false
      }
    ],
    '4': [
      {
        id: 'm41',
        senderId: user?.id,
        text: 'Hi Hương! Anh cần thiết kế logo và brand identity cho startup mới. Em có kinh nghiệm với branding không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        isRead: true
      },
      {
        id: 'm42',
        senderId: 'user4',
        text: 'Chào anh! Vâng, em chuyên về branding và đã làm cho nhiều startup rồi ạ. Em có thể gửi portfolio để anh tham khảo.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
        isRead: true
      },
      {
        id: 'm43',
        senderId: user?.id,
        text: 'Tuyệt! Anh đã xem portfolio của em rất ấn tượng. Brief của dự án: tech startup, target gen Z, tone hiện đại và năng động.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40),
        isRead: true
      },
      {
        id: 'm44',
        senderId: 'user4',
        text: 'Sounds exciting! Em sẽ research thêm về thị trường và competitor. Timeline như thế nào ạ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
        isRead: true
      },
      {
        id: 'm45',
        senderId: user?.id,
        text: 'Timeline 3 tuần cho toàn bộ brand identity package. Phase 1: logo (1 tuần), Phase 2: brand guideline (2 tuần).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true
      },
      {
        id: 'm46',
        senderId: 'user4',
        text: 'Perfect! Em đã bắt đầu làm moodboard và concept. Sẽ có initial ideas trong 2-3 ngày tới.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        isRead: true
      },
      {
        id: 'm47',
        senderId: 'user4',
        text: 'Em vừa gửi bản demo đầu tiên, anh xem và góp ý giúp em.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true
      }
    ],
    '7': [
      {
        id: 'm71',
        senderId: 'user7',
        text: 'Chào anh! Em thấy dự án React Native app rất thú vị. Em có 3 năm kinh nghiệm với React Native.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true
      },
      {
        id: 'm72',
        senderId: user?.id,
        text: 'Hi Tuấn! App này sẽ có features: authentication, real-time chat, payment integration, và offline mode.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true
      },
      {
        id: 'm73',
        senderId: 'user7',
        text: 'Em đã làm tất cả features này rồi ạ! Có thể anh share thêm về requirements không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true
      },
      {
        id: 'm74',
        senderId: user?.id,
        text: 'Sure! Timeline ban đầu dự kiến 8-10 tuần. Em có thể commit timeline này không?',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        isRead: true
      },
      {
        id: 'm75',
        senderId: 'user7',
        text: 'Timeline dự án có thể linh hoạt được không anh?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false
      }
    ]
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      setSelectedChat(conversation);
    }
  }, [conversationId, conversations]);

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    navigate(`/messages/${conversation.id}`);
    if (isMobile) {
      // On mobile, hide sidebar when chat is selected
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-var(--header-height))]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-var(--header-height))]">
          <div className="text-center max-w-md mx-auto p-6">
            <Icon name="MessageSquare" size={64} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Bạn cần đăng nhập</h2>
            <p className="text-muted-foreground mb-6">Vui lòng đăng nhập để sử dụng tính năng nhắn tin.</p>
            <Button 
              onClick={() => navigate('/login')}
              className="px-6"
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-[calc(100vh-var(--header-height))] flex">
        {/* Sidebar */}
        <div className={`${isMobile && selectedChat ? 'hidden' : 'block'} w-full md:w-80 border-r border-border bg-card`}>
          <ChatSidebar 
            conversations={conversations}
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Main Chat Area */}
        <div className={`${isMobile && !selectedChat ? 'hidden' : 'block'} flex-1 flex flex-col`}>
          {selectedChat ? (
            <ChatWindow 
              conversation={selectedChat}
              messages={messages[selectedChat.id] || []}
              currentUserId={user?.id}
              onBack={isMobile ? handleBackToList : null}
              onShowProfile={() => setShowUserProfile(true)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center max-w-md mx-auto p-6">
                <Icon name="MessageSquare" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
                <p className="text-muted-foreground">
                  Bắt đầu nhắn tin với khách hàng hoặc freelancer từ danh sách bên trái.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Sidebar (Desktop only) */}
        {showUserProfile && selectedChat && !isMobile && (
          <div className="w-80 border-l border-border bg-card">
            <UserProfile 
              user={selectedChat.user}
              projectTitle={selectedChat.projectTitle}
              onClose={() => setShowUserProfile(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
