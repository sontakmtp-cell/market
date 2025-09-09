import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProjectHeader from './components/ProjectHeader';
import ProjectDetails from './components/ProjectDetails';
import ClientInfo from './components/ClientInfo';
import ProjectSidebar from './components/ProjectSidebar';
import ProposalForm from './components/ProposalForm';
import ExistingProposals from './components/ExistingProposals';
import { getProjectById } from '../../utils/dataStore';
import { useAuth } from '../../hooks/useAuth';
import LoginPrompt from '../../components/LoginPrompt';

const JobDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, redirectToLogin } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  // Mock project data
  const mockProject = {
    id: "proj-001",
    title: "Thiết kế hệ thống cấu trúc thép cho nhà máy sản xuất",
    location: "Hồ Chí Minh, Việt Nam",
    postedTime: "2 ngày trước",
    budget: "80,000,000 - 120,000,000 VNĐ",
    duration: "3-4 tháng",
    proposals: 12,
    status: "Đang mở",
    deadline: "15/01/2025",
    competitionLevel: 4,
    views: 156,
    timeLeft: "12 ngày",
    averageBid: "95,000,000 VNĐ",
    shortDescription: "Cần thiết kế hệ thống cấu trúc thép cho nhà máy sản xuất với diện tích 2000m². Yêu cầu có kinh nghiệm thiết kế công nghiệp và am hiểu các tiêu chuẩn Việt Nam.",
    fullDescription: `Chúng tôi đang tìm kiếm một kỹ sư cấu trúc có kinh nghiệm để thiết kế hệ thống khung thép cho nhà máy sản xuất mới.\n\nDự án bao gồm:\n- Thiết kế khung thép chính với nhịp 30m\n- Hệ thống mái và tường bao che\n- Móng và hệ thống nền\n- Tính toán chịu lực theo TCVN\n- Bản vẽ thi công chi tiết\n\nĐây là dự án quan trọng với tiến độ chặt chẽ, cần freelancer có thể cam kết thời gian và chất lượng.`,
    objectives: [
      "Thiết kế khung thép chịu lực an toàn theo tiêu chuẩn TCVN 5575:2018",
      "Tối ưu hóa chi phí vật liệu và thi công",
      "Đảm bảo tiến độ bàn giao đúng hạn",
      "Hỗ trợ kỹ thuật trong quá trình thi công"
    ],
    technicalRequirements: [
      {
        category: "Thiết kế cấu trúc",
        items: [
          "Sử dụng phần mềm SAP2000 hoặc ETABS",
          "Tính toán theo TCVN 5575:2018 và TCVN 2737:1995",
          "Thiết kế chống động đất theo TCVN 9386:2012",
          "Kiểm tra ổn định tổng thể"
        ]
      },
      {
        category: "Bản vẽ kỹ thuật",
        items: [
          "Bản vẽ tổng thể 1:200",
          "Bản vẽ chi tiết nút 1:20",
          "Bản vẽ móng và neo 1:50",
          "Định mức vật liệu chi tiết"
        ]
      },
      {
        category: "Tiêu chuẩn áp dụng",
        items: [
          "TCVN 5575:2018 - Kết cấu thép",
          "TCVN 2737:1995 - Tải trọng và tác động",
          "TCVN 9386:2012 - Thiết kế chống động đất",
          "TCVN 4453:1995 - Móng cọc"
        ]
      }
    ],
    deliverables: [
      {
        title: "Báo cáo tính toán kết cấu",
        description: "File tính toán chi tiết với SAP2000, kiểm tra ổn định",
        deadline: "Tuần 4"
      },
      {
        title: "Bản vẽ thiết kế kỹ thuật",
        description: "Bộ bản vẽ hoàn chỉnh định dạng DWG và PDF",
        deadline: "Tuần 8"
      },
      {
        title: "Thuyết minh thiết kế",
        description: "Thuyết minh kỹ thuật và hướng dẫn thi công",
        deadline: "Tuần 10"
      },
      {
        title: "Định mức vật liệu",
        description: "Bảng thống kê vật liệu chi tiết theo từng hạng mục",
        deadline: "Tuần 12"
      }
    ],
    referenceFiles: [
      {
        name: "Bản vẽ mặt bằng tổng thể.pdf",
        size: "2.4 MB",
        type: "pdf"
      },
      {
        name: "Yêu cầu kỹ thuật chi tiết.docx",
        size: "856 KB",
        type: "doc"
      },
      {
        name: "Khảo sát địa chất.pdf",
        size: "3.1 MB",
        type: "pdf"
      },
      {
        name: "Bản vẽ kiến trúc tham khảo.dwg",
        size: "1.8 MB",
        type: "dwg"
      }
    ],
    requiredSkills: [
      "SAP2000/ETABS",
      "AutoCAD",
      "Thiết kế kết cấu thép",
      "TCVN 5575:2018",
      "Tính toán chống động đất",
      "Thiết kế công nghiệp"
    ],
    similarJobs: [
      {
        title: "Thiết kế khung thép nhà xưởng 1500m²",
        budget: "60,000,000 - 80,000,000 VNĐ",
        proposals: 8,
        description: "Thiết kế hệ thống khung thép cho nhà xưởng sản xuất với yêu cầu chịu tải trọng cần trục 10 tấn."
      },
      {
        title: "Tính toán cấu trúc thép nhà cao tầng",
        budget: "150,000,000 - 200,000,000 VNĐ",
        proposals: 15,
        description: "Thiết kế và tính toán hệ thống cấu trúc thép cho tòa nhà văn phòng 12 tầng."
      },
      {
        title: "Thiết kế cầu trục dầm đơn 20 tấn",
        budget: "40,000,000 - 60,000,000 VNĐ",
        proposals: 6,
        description: "Thiết kế hệ thống cầu trục dầm đơn cho nhà máy với tải trọng nâng 20 tấn."
      }
    ],
    client: {
      name: "Nguyễn Văn Minh",
      company: "Công ty TNHH Xây dựng Minh Phát",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.8,
      reviewCount: 23,
      location: "Hồ Chí Minh, Việt Nam",
      totalJobs: 15,
      hireRate: 87,
      memberSince: "Tháng 3, 2022",
      lastSeen: "2 giờ trước",
      responseTime: "Trong vòng 4 giờ"
    }
  };

  const mockProposals = [
    {
      id: "prop-001",
      bidAmount: 95000000,
      timeline: "3 tháng",
      submittedAt: "2025-01-03T10:30:00Z",
      coverLetter: "Xin chào, tôi có 8 năm kinh nghiệm thiết kế cấu trúc thép công nghiệp. Đã thực hiện thành công 25+ dự án tương tự với quy mô từ 1000-5000m². Thành thạo SAP2000, ETABS và các tiêu chuẩn TCVN. Cam kết bàn giao đúng tiến độ với chất lượng cao nhất.",
      portfolioSamples: [
        { name: "Portfolio_Steel_Design.pdf", size: "4.2 MB" },
        { name: "Previous_Factory_Project.dwg", size: "2.8 MB" }
      ],
      freelancer: {
        name: "Trần Minh Đức",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.9,
        reviewCount: 47,
        completedJobs: 28,
        isVerified: true,
        skills: ["SAP2000", "ETABS", "AutoCAD", "Thiết kế thép", "TCVN", "Revit"]
      }
    },
    {
      id: "prop-002",
      bidAmount: 88000000,
      timeline: "3.5 tháng",
      submittedAt: "2025-01-03T14:15:00Z",
      coverLetter: "Chào anh/chị, tôi là kỹ sư cấu trúc với 6 năm kinh nghiệm chuyên về thiết kế công nghiệp. Đã tham gia thiết kế nhiều nhà máy, kho xưởng lớn. Sử dụng thành thạo các phần mềm chuyên dụng và nắm vững các quy chuẩn Việt Nam.",
      portfolioSamples: [
        { name: "Industrial_Projects_2024.pdf", size: "6.1 MB" }
      ],
      freelancer: {
        name: "Lê Thị Hương",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        rating: 4.7,
        reviewCount: 31,
        completedJobs: 19,
        isVerified: true,
        skills: ["SAP2000", "AutoCAD", "Thiết kế kết cấu", "TCVN 5575", "Tekla"]
      }
    },
    {
      id: "prop-003",
      bidAmount: 110000000,
      timeline: "2.5 tháng",
      submittedAt: "2025-01-02T16:45:00Z",
      coverLetter: "Kính chào Quý khách hàng, với 12 năm kinh nghiệm trong lĩnh vực thiết kế cấu trúc thép, tôi đã thực hiện thành công hơn 50 dự án công nghiệp. Đặc biệt có kinh nghiệm với các dự án có quy mô lớn và yêu cầu kỹ thuật cao.",
      portfolioSamples: [
        { name: "Senior_Engineer_Portfolio.pdf", size: "8.5 MB" },
        { name: "Factory_Design_Samples.zip", size: "12.3 MB" }
      ],
      freelancer: {
        name: "Phạm Văn Thành",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        rating: 5.0,
        reviewCount: 68,
        completedJobs: 52,
        isVerified: true,
        skills: ["SAP2000", "ETABS", "STAAD Pro", "AutoCAD", "Revit", "Tekla", "TCVN", "Thiết kế chống động đất"]
      }
    }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      // Get project ID from query params or URL params
      const projectId = searchParams.get('id') || id;

      setIsLoading(true);
      
      try {
        let fetchedProject = null;
        
        // Try to get project from Supabase first
        if (projectId) {
          fetchedProject = await getProjectById(projectId);
        }
        
        if (fetchedProject) {
          // Map stored project to the format expected by the UI
          const mappedProject = {
            ...fetchedProject,
            budget: `${fetchedProject.budgetMin?.toLocaleString('vi-VN')} - ${fetchedProject.budgetMax?.toLocaleString('vi-VN')} ${fetchedProject.currency}`,
            proposals: fetchedProject.proposalCount || 0,
            status: fetchedProject.status === 'active' ? 'Đang mở' : 'Đã đóng',
            postedTime: fetchedProject.postedAt ? getTimeAgo(fetchedProject.postedAt) : 'Vừa đăng',
            averageBid: `${Math.floor((fetchedProject.budgetMin + fetchedProject.budgetMax) / 2)?.toLocaleString('vi-VN')} ${fetchedProject.currency}`,
            competitionLevel: Math.min(5, Math.max(1, fetchedProject.proposalCount ? Math.ceil(fetchedProject.proposalCount / 3) : 1)),
            views: Math.floor(Math.random() * 200) + 50, // Random views for now
            timeLeft: fetchedProject.deadline ? getTimeLeft(fetchedProject.deadline) : 'Không giới hạn',
            referenceFiles: fetchedProject.attachments || []
          };
          setProject(mappedProject);
        } else {
          // If project not found in Supabase, set to null to show "not found" page
          setProject(null);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        // On error, also set to null to show "not found" page
        setProject(null);
      } finally {
        setIsLoading(false);
      }

      // Check if job is saved (only if authenticated)
      if (isAuthenticated) {
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs?.includes(projectId || 'proj-001'));
      }
    };

    fetchProject();
  }, [id, searchParams, isAuthenticated]);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa đăng';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Helper function to calculate time left
  const getTimeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInDays = Math.floor((end - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Đã hết hạn';
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Ngày mai';
    return `${diffInDays} ngày`;
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (isSaved) {
      const updatedJobs = savedJobs?.filter(jobId => jobId !== id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setIsSaved(false);
    } else {
      savedJobs?.push(id);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    }
  };

  const handleSubmitProposal = async (proposalData) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    // Simulate proposal submission
    console.log('Submitting proposal:', proposalData);
    
    // Show success message (in real app, would show toast/notification)
    alert('Đề xuất đã được gửi thành công!');
    
    // Scroll to proposals section
    setActiveSection('proposals');
  };

  const handleBackToMarketplace = () => {
    navigate('/job-marketplace');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy công việc</h1>
              <p className="text-muted-foreground mb-6">
                Công việc này có thể đã bị xóa hoặc không tồn tại.
              </p>
              <Button onClick={handleBackToMarketplace} iconName="ArrowLeft" iconPosition="left">
                Quay lại thị trường việc làm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button
              onClick={handleBackToMarketplace}
              className="hover:text-foreground transition-colors"
            >
              Thị trường việc làm
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Chi tiết công việc</span>
          </nav>

          {/* Project Header */}
          <ProjectHeader
            project={project}
            onSaveJob={handleSaveJob}
            isSaved={isSaved}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section Navigation */}
              <div className="bg-card border border-border rounded-lg p-1">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'details', label: 'Chi tiết dự án', icon: 'FileText' },
                    { id: 'proposals', label: 'Đề xuất hiện tại', icon: 'Users', requiresAuth: false },
                    { id: 'submit', label: 'Gửi đề xuất', icon: 'Send', requiresAuth: true }
                  ]?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => {
                        if (section.requiresAuth && !isAuthenticated) {
                          redirectToLogin();
                          return;
                        }
                        setActiveSection(section?.id);
                      }}
                      disabled={section.requiresAuth && !isAuthenticated}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                        activeSection === section?.id
                          ? 'bg-primary text-primary-foreground'
                          : section.requiresAuth && !isAuthenticated
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      title={section.requiresAuth && !isAuthenticated ? 'Đăng nhập để sử dụng tính năng này' : ''}
                    >
                      <Icon name={section.requiresAuth && !isAuthenticated ? 'Lock' : section?.icon} size={16} />
                      <span>{section?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Content */}
              {activeSection === 'details' && (
                <ProjectDetails project={project} />
              )}

              {activeSection === 'proposals' && (
                <ExistingProposals proposals={mockProposals} />
              )}

              {activeSection === 'submit' && (
                isAuthenticated ? (
                  <ProposalForm onSubmitProposal={handleSubmitProposal} />
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <LoginPrompt 
                      title="Đăng nhập để gửi đề xuất"
                      message="Bạn cần có tài khoản để gửi đề xuất cho dự án này"
                      size="lg"
                    />
                  </div>
                )
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <ProjectSidebar project={project} />
              <ClientInfo client={project?.client} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;