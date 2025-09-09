import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import { getRecruitmentJobs } from '../../utils/dataStore';
import FilterSidebar from './components/FilterSidebar';
import SearchHeader from './components/SearchHeader';
import JobGrid from './components/JobGrid';

const RecruitmentJobBoard = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'salary-high' | 'salary-low' | 'deadline'
  const [filters, setFilters] = useState({
    locationTypes: [], // remote | hybrid | onsite
    employmentTypes: [], // full-time | part-time | contract | internship
    experienceLevels: [], // junior | mid | senior | lead
    skills: '',
    showSalaryOnly: false,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const list = await getRecruitmentJobs();
        setJobs(list);
      } catch (error) {
        console.error('Error fetching recruitment jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const normalizedJobs = useMemo(() => {
    return (jobs || []).map((j) => ({
      id: j.id,
      title: j.title || 'Untitled Position',
      department: j.department || 'Company',
      location: j.location || '—',
      locationType: j.locationType || 'remote',
      employmentType: j.employmentType || 'full-time',
      experienceLevel: j.experienceLevel || 'mid',
      description: j.description || '',
      skills: Array.isArray(j.skills) ? j.skills : [],
      showSalary: !!j.showSalary,
      salaryMin: Number(j.salaryMin) || null,
      salaryMax: Number(j.salaryMax) || null,
      currency: j.currency || 'VND',
      deadline: j.applicationDeadline || j.deadline || null,
      createdAt: j.created_at || new Date().toISOString(),
    }));
  }, [jobs]);

  useEffect(() => {
    let list = [...normalizedJobs];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((job) =>
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(q)) ||
        (job.department || '').toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.locationTypes?.length) {
      list = list.filter((job) => filters.locationTypes.includes(job.locationType));
    }
    if (filters.employmentTypes?.length) {
      list = list.filter((job) => filters.employmentTypes.includes(job.employmentType));
    }
    if (filters.experienceLevels?.length) {
      list = list.filter((job) => filters.experienceLevels.includes(job.experienceLevel));
    }
    if (filters.skills) {
      const q = filters.skills.toLowerCase();
      list = list.filter((job) => (job.skills || []).some((s) => s.toLowerCase().includes(q)));
    }
    if (filters.showSalaryOnly) {
      list = list.filter((job) => job.showSalary && job.salaryMax);
    }

    // Sort
    switch (sortBy) {
      case 'salary-high':
        list.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;
      case 'salary-low':
        list.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;
      case 'deadline':
        list.sort((a, b) => new Date(a.deadline || '2100-01-01') - new Date(b.deadline || '2100-01-01'));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFiltered(list);
  }, [normalizedJobs, searchQuery, sortBy, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 flex">
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          jobCount={filtered.length}
        />

        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFilterToggle={() => setIsFilterOpen(true)}
            jobCount={filtered.length}
          />

          <JobGrid jobs={filtered} loading={loading} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
};

export default RecruitmentJobBoard;

