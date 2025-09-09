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
  // Removed mock data - now using Supabase data from marketplace_projects table

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      // Get user role from localStorage or URL params
      const role = localStorage.getItem('userRole') || 'freelancer';
      setUserRole(role);

      setLoading(true);
      try {
        // Fetch marketplace projects using the dataStore function
        const projectsData = await getProjects();
        
        // Map DB rows to UI shape if needed
        const mapped = (projectsData || []).map((p) => ({
          ...p,
          postedAt: p.created_at || p.postedAt,
          deadline: p.deadline ? new Date(p.deadline) : null,
          skills: Array.isArray(p.skills) ? p.skills : [],
          // Map budget fields
          budgetMin: p.budgetMin || 0,
          budgetMax: p.budgetMax || 0,
          // Ensure client data structure
          client: p.client || {
            name: 'Khách hàng',
            company: '',
            rating: 0,
            reviewCount: 0,
            location: ''
          },
          proposalCount: p.proposalCount || 0,
          applicationStatus: null // This would come from user's applications if implemented
        }));
        
        setJobs(mapped);
        setFilteredJobs(mapped);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        // Set empty array on error to prevent UI issues
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
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
