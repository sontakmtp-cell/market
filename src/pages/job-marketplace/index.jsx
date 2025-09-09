import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FilterSidebar from './components/FilterSidebar';
import SearchHeader from './components/SearchHeader';
import JobGrid from './components/JobGrid';
import { getProjects } from '../../utils/dataStore';
import { useAuth } from '../../hooks/useAuth';
import LoginPrompt from '../../components/LoginPrompt';

const JobMarketplace = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState('freelancer');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    categories: [],
    budgetRanges: [],
    durations: [],
    experienceLevels: [],
    locations: [],
    skills: '',
    isUrgent: false,
    hasProposals: false
  });

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Thiết kế kết cấu thép cho nhà xưởng 2000m²",
      category: "structural",
      description: `Cần thiết kế kết cấu thép cho nhà xưởng sản xuất với diện tích 2000m². Yêu cầu có kinh nghiệm thiết kế kết cấu thép, sử dụng phần mềm SAP2000 hoặc ETABS.\n\nCông việc bao gồm:\n- Tính toán và thiết kế kết cấu thép\n- Vẽ bản vẽ thi công chi tiết\n- Lập thuyết minh tính toán`,
      budgetMin: 15000000,
      budgetMax: 25000000,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      skills: ["SAP2000", "ETABS", "AutoCAD", "Kết cấu thép"],
      isUrgent: false,
      client: {
        name: "Công ty TNHH Xây dựng Minh Phát",
        rating: 4.8,
        reviewCount: 23,
        hireCount: 15
      },
      proposalCount: 8,
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      applicationStatus: null
    },
    {
      id: 2,
      title: "Thiết kế mạch điện tử cho hệ thống IoT",
      category: "electronic",
      description: `Thiết kế mạch điện tử cho hệ thống giám sát nhiệt độ, độ ẩm IoT. Yêu cầu có kinh nghiệm với ESP32, cảm biến DHT22, và giao tiếp WiFi.\n\nYêu cầu cụ thể:\n- Thiết kế sơ đồ mạch\n- Lập trình firmware\n- Test và tối ưu hóa`,
      budgetMin: 8000000,
      budgetMax: 12000000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      skills: ["ESP32", "Arduino", "IoT", "C++", "Altium Designer"],
      isUrgent: true,
      client: {
        name: "Nguyễn Văn Hùng",
        rating: 4.5,
        reviewCount: 12,
        hireCount: 8
      },
      proposalCount: 5,
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      applicationStatus: "applied"
    },
    {
      id: 3,
      title: "Thiết kế hệ thống cần cẩu tháp 8 tấn",
      category: "crane",
      description: `Thiết kế hệ thống cần cẩu tháp tải trọng 8 tấn cho công trình xây dựng cao tầng. Cần có chứng chỉ thiết kế cần cẩu và kinh nghiệm tối thiểu 5 năm.\n\nPhạm vi công việc:\n- Tính toán kết cấu cần cẩu\n- Thiết kế hệ thống an toàn\n- Lập hồ sơ thẩm định`,
      budgetMin: 30000000,
      budgetMax: 45000000,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      skills: ["Thiết kế cần cẩu", "SAP2000", "Kết cấu thép", "An toàn lao động"],
      isUrgent: false,
      client: {
        name: "Tổng công ty Xây dựng Hà Nội",
        rating: 4.9,
        reviewCount: 45,
        hireCount: 32
      },
      proposalCount: 12,
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      applicationStatus: null
    },
    {
      id: 4,
      title: "Thiết kế hệ thống truyền động băng tải",
      category: "mechanical",
      description: `Thiết kế hệ thống truyền động cho băng tải công nghiệp, tải trọng 500kg, chiều dài 50m. Yêu cầu tính toán động cơ, hộp giảm tốc và hệ thống điều khiển.\n\nCông việc bao gồm:\n- Tính toán động học\n- Chọn động cơ và hộp giảm tốc\n- Thiết kế hệ thống điều khiển`,
      budgetMin: 12000000,
      budgetMax: 18000000,
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      skills: ["SolidWorks", "Cơ học máy", "Truyền động", "PLC"],
      isUrgent: false,
      client: {
        name: "Công ty CP Cơ khí Thành Đạt",
        rating: 4.6,
        reviewCount: 18,
        hireCount: 11
      },
      proposalCount: 6,
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      applicationStatus: "shortlisted"
    },
    {
      id: 5,
      title: "Thiết kế kiến trúc biệt thự 3 tầng",
      category: "architecture",
      description: `Thiết kế kiến trúc biệt thự 3 tầng, diện tích 200m² mỗi tầng. Phong cách hiện đại, tối ưu ánh sáng tự nhiên và thông gió.\n\nYêu cầu:\n- Bản vẽ kiến trúc chi tiết\n- Phối cảnh 3D\n- Hồ sơ xin phép xây dựng`,
      budgetMin: 20000000,
      budgetMax: 35000000,
      deadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      skills: ["AutoCAD", "SketchUp", "3ds Max", "Revit"],
      isUrgent: false,
      client: {
        name: "Gia đình Trần Minh Tuấn",
        rating: 4.7,
        reviewCount: 8,
        hireCount: 3
      },
      proposalCount: 15,
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      applicationStatus: null
    },
    {
      id: 6,
      title: "Tính toán kết cấu bê tông cốt thép cho cầu",
      category: "structural",
      description: `Tính toán kết cấu bê tông cốt thép cho cầu nhịp 30m. Yêu cầu có chứng chỉ thiết kế cầu và kinh nghiệm tối thiểu 7 năm trong lĩnh vực này.\n\nPhạm vi công việc:\n- Tính toán tĩnh và động\n- Kiểm tra ổn định\n- Lập bản vẽ thi công`,
      budgetMin: 40000000,
      budgetMax: 60000000,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      skills: ["Midas Civil", "SAP2000", "Thiết kế cầu", "Bê tông cốt thép"],
      isUrgent: true,
      client: {
        name: "Sở Giao thông Vận tải Hà Nội",
        rating: 4.9,
        reviewCount: 67,
        hireCount: 45
      },
      proposalCount: 3,
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      applicationStatus: null
    }
  ];

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      // Get user role from localStorage or URL params
      const role = localStorage.getItem('userRole') || 'freelancer';
      setUserRole(role);

      setLoading(true);
      try {
        // Get projects from Supabase and convert to job format
        const storedProjects = await getProjects();
        const convertedProjects = storedProjects.map(project => ({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.fullDescription || project.shortDescription,
          shortDescription: project.shortDescription,
          budgetMin: project.budgetMin,
          budgetMax: project.budgetMax,
          deadline: new Date(project.deadline),
          skills: project.skills || [],
          isUrgent: project.isUrgent,
          client: {
            name: project.client?.name || 'Khách hàng',
            rating: project.client?.rating || 5,
            reviewCount: project.client?.reviewCount || 0,
            hireCount: Math.floor(Math.random() * 20) + 1
          },
          proposalCount: project.proposalCount || 0,
          postedAt: new Date(project.postedAt),
          applicationStatus: null,
          location: project.location,
          duration: project.duration
        }));

        // Merge stored projects with mock jobs (stored projects first)
        const allJobs = [...convertedProjects, ...mockJobs];
        setJobs(allJobs);
        setFilteredJobs(allJobs);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock jobs only if fetching fails
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(job =>
        job?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        job?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        job?.skills?.some(skill => skill?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    // Category filter
    if (filters?.categories?.length > 0) {
      filtered = filtered?.filter(job => filters?.categories?.includes(job?.category));
    }

    // Budget filter
    if (filters?.budgetRanges?.length > 0) {
      filtered = filtered?.filter(job => {
        return filters?.budgetRanges?.some(rangeId => {
          switch (rangeId) {
            case 'under-5m':
              return job?.budgetMax <= 5000000;
            case '5m-15m':
              return job?.budgetMin >= 5000000 && job?.budgetMax <= 15000000;
            case '15m-30m':
              return job?.budgetMin >= 15000000 && job?.budgetMax <= 30000000;
            case '30m-50m':
              return job?.budgetMin >= 30000000 && job?.budgetMax <= 50000000;
            case 'over-50m':
              return job?.budgetMin >= 50000000;
            default:
              return true;
          }
        });
      });
    }

    // Urgent filter
    if (filters?.isUrgent) {
      filtered = filtered?.filter(job => job?.isUrgent);
    }

    // Skills filter
    if (filters?.skills) {
      filtered = filtered?.filter(job =>
        job?.skills?.some(skill => 
          skill?.toLowerCase()?.includes(filters?.skills?.toLowerCase())
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        break;
      case 'budget-high':
        filtered?.sort((a, b) => b?.budgetMax - a?.budgetMax);
        break;
      case 'budget-low':
        filtered?.sort((a, b) => a?.budgetMin - b?.budgetMin);
        break;
      case 'deadline':
        filtered?.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters, sortBy]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleLoadMore = () => {
    // Simulate loading more jobs
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          jobCount={filteredJobs?.length}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Login Prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="p-4 bg-primary/5 border-b border-primary/20">
              <LoginPrompt 
                title="Tham gia TechMarketplace để trải nghiệm đầy đủ"
                message="Đăng nhập để ứng tuyển công việc, lưu dự án yêu thích và quản lý hồ sơ của bạn"
                size="sm"
                className="max-w-none bg-transparent border-0 p-0"
              />
            </div>
          )}

          {/* Search Header */}
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onFilterToggle={handleFilterToggle}
            jobCount={filteredJobs?.length}
            userRole={userRole}
            filters={filters}
          />

          {/* Job Grid */}
          <JobGrid
            jobs={filteredJobs}
            loading={loading}
            viewMode={viewMode}
            userRole={userRole}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
};

export default JobMarketplace;