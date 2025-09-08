import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getRecruitmentJobById } from '../../../utils/dataStore';

const CandidateList = ({ filterStatus, selectedJobId, applications = null }) => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [sortBy, setSortBy] = useState('application_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fallbackCandidates = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      email: 'nguyen.van.minh@email.com',
      phone: '0901234567',
      position: 'Kỹ sư Cơ khí Senior',
      experience: '5 năm',
      education: 'Đại học Bách Khoa Hà Nội',
      skills: ['AutoCAD', 'SolidWorks', 'Thiết kế máy móc', 'Quản lý dự án'],
      salary_expectation: '28-35 triệu VNĐ',
      location: 'Hà Nội',
      application_date: '2025-01-05',
      status: 'new',
      score: 85,
      cv_url: '/cv/candidate-1.pdf',
      avatar: null,
      notes: 'Kinh nghiệm tốt trong thiết kế máy móc công nghiệp'
    },
    {
      id: 2,
      name: 'Trần Thị Hương',
      email: 'tran.thi.huong@email.com', 
      phone: '0912345678',
      position: 'Chuyên viên Tính toán Kết cấu',
      experience: '3 năm',
      education: 'Đại học Xây dựng Hà Nội',
      skills: ['SAP2000', 'ETABS', 'AutoCAD', 'Tính toán kết cấu'],
      salary_expectation: '22-28 triệu VNĐ',
      location: 'Hà Nội',
      application_date: '2025-01-04',
      status: 'screening',
      score: 78,
      cv_url: '/cv/candidate-2.pdf',
      avatar: null,
      notes: 'Có chứng chỉ kỹ sư kết cấu chuyên nghiệp'
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      email: 'le.hoang.nam@email.com',
      phone: '0923456789',
      position: 'Kỹ sư Điện - Tự động hóa',
      experience: '4 năm',
      education: 'Đại học Bách Khoa TP.HCM',
      skills: ['PLC Siemens', 'SCADA', 'WinCC', 'Tự động hóa'],
      salary_expectation: '32-40 triệu VNĐ',
      location: 'Hồ Chí Minh',
      application_date: '2025-01-03',
      status: 'interview',
      score: 92,
      cv_url: '/cv/candidate-3.pdf',
      avatar: null,
      notes: 'Kinh nghiệm mạnh về hệ thống tự động hóa nhà máy'
    },
    {
      id: 4,
      name: 'Phạm Minh Tuấn',
      email: 'pham.minh.tuan@email.com',
      phone: '0934567890',
      position: 'Kỹ sư Cơ khí Senior',
      experience: '6 năm',
      education: 'Đại học Công nghệ Hà Nội',
      skills: ['Inventor', 'Mastercam', 'CNC Programming', 'Gia công cơ khí'],
      salary_expectation: '35-45 triệu VNĐ',
      location: 'Hà Nội',
      application_date: '2025-01-02',
      status: 'offer',
      score: 88,
      cv_url: '/cv/candidate-4.pdf',
      avatar: null,
      notes: 'Chuyên gia về gia công CNC và lập trình máy'
    }
  ];

  const appCandidates = useMemo(() => {
    if (!applications || applications.length === 0) return [];
    const mapStatus = (s) => {
      switch (s) {
        case 'submitted': return 'new';
        case 'screening': return 'screening';
        case 'interview': return 'interview';
        case 'offer': return 'offer';
        case 'rejected': return 'rejected';
        default: return 'new';
      }
    };
    return applications.map((app) => {
      const job = app.jobId ? getRecruitmentJobById(app.jobId) : null;
      const skills = Object.entries(app.technicalSkills || {})
        .filter(([, level]) => Number(level) > 0)
        .map(([k]) => k);
      const score = Math.min(100, (skills.length || 0) * 15 + (app.cv ? 30 : 0) + (app.coverLetter ? 10 : 0));
      return {
        id: app.id,
        name: app.fullName || 'Ứng viên',
        email: app.email || '',
        phone: app.phone || '',
        position: job?.title || '—',
        experience: app.experienceLevel || '—',
        education: '—',
        skills,
        salary_expectation: '—',
        location: app.address || '—',
        application_date: app.applicationDate || new Date().toISOString(),
        status: mapStatus(app.status),
        score,
        cv_url: null,
        avatar: null,
        notes: app.summary || '',
      };
    });
  }, [applications]);

  const baseCandidates = appCandidates.length > 0 ? appCandidates : fallbackCandidates;

  const filteredCandidates = baseCandidates?.filter(candidate => {
    if (filterStatus === 'all') return true;
    return candidate?.status === filterStatus;
  });

  const sortedCandidates = [...filteredCandidates]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];
    
    if (sortBy === 'application_date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      new: 'text-primary bg-primary/10',
      screening: 'text-warning bg-warning/10', 
      interview: 'text-accent bg-accent/10',
      offer: 'text-success bg-success/10',
      rejected: 'text-error bg-error/10'
    };
    return colors?.[status] || colors?.new;
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Mới',
      screening: 'Sàng lọc',
      interview: 'Phỏng vấn', 
      offer: 'Đã offer',
      rejected: 'Từ chối'
    };
    return labels?.[status] || 'Không xác định';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => 
      prev?.includes(candidateId) 
        ? prev?.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates?.length === sortedCandidates?.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(sortedCandidates?.map(c => c?.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on candidates:`, selectedCandidates);
    setSelectedCandidates([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header with Filters and Actions */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">
              Danh sách ứng viên ({sortedCandidates?.length})
            </h3>
            {selectedCandidates?.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Đã chọn {selectedCandidates?.length}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('move_to_interview')}>
                  Chuyển sang PV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('reject')}>
                  Từ chối
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="application_date">Ngày ứng tuyển</option>
              <option value="score">Điểm đánh giá</option>
              <option value="name">Tên ứng viên</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-border rounded-md hover:bg-muted transition-smooth"
            >
              <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Candidates List */}
      <div className="p-6">
        {/* Select All */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-border">
          <input
            type="checkbox"
            checked={selectedCandidates?.length === sortedCandidates?.length && sortedCandidates?.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border"
          />
          <label className="text-sm font-medium text-foreground">
            Chọn tất cả ứng viên
          </label>
        </div>

        {/* Candidates */}
        <div className="space-y-4">
          {sortedCandidates?.map((candidate) => (
            <div 
              key={candidate?.id}
              className={`border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-smooth ${
                selectedCandidates?.includes(candidate?.id) ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedCandidates?.includes(candidate?.id)}
                  onChange={() => handleSelectCandidate(candidate?.id)}
                  className="mt-1 rounded border-border"
                />

                {/* Avatar */}
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-muted-foreground" />
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-semibold text-foreground">
                          {candidate?.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate?.status)}`}>
                          {getStatusLabel(candidate?.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {candidate?.position} • {candidate?.experience}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {candidate?.education}
                      </p>
                    </div>

                    <div className="text-right mt-2 lg:mt-0">
                      <div className="text-lg font-bold text-foreground mb-1">
                        {candidate?.score}/100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Điểm đánh giá
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} />
                      <span className="truncate">{candidate?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} />
                      <span>{candidate?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} />
                      <span>{candidate?.location}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {candidate?.skills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-muted-foreground mb-3 lg:mb-0">
                      <div className="flex items-center space-x-1">
                        <Icon name="DollarSign" size={14} />
                        <span>Mong muốn: {candidate?.salary_expectation}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>Ứng tuyển: {formatDate(candidate?.application_date)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
                        Xem CV
                      </Button>
                      <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                        Nhắn tin
                      </Button>
                      <Button variant="default" size="sm" iconName="Calendar" iconPosition="left">
                        Lên lịch PV
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  {candidate?.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <Icon name="MessageSquare" size={14} className="inline mr-1" />
                        {candidate?.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedCandidates?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Không có ứng viên nào
            </h3>
            <p className="text-muted-foreground">
              {filterStatus === 'all' ?'Chưa có ứng viên nào ứng tuyển cho vị trí này.'
                : `Không có ứng viên nào ở trạng thái "${getStatusLabel(filterStatus)}".`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
