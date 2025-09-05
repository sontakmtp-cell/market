import React, { useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import DashboardSidebar from '../../components/ui/DashboardSidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { Link, useNavigate } from 'react-router-dom';

const sampleJobs = [
  { id: 101, title: 'Kỹ sư Cơ khí thiết kế', company: 'MechPro VN', location: 'Hà Nội', type: 'Toàn thời gian', tags: ['AutoCAD', 'SolidWorks'], path: '/employer-job-posting' },
  { id: 102, title: 'Electrical Engineer - PLC/SCADA', company: 'FactoryX', location: 'Hồ Chí Minh', type: 'Toàn thời gian', tags: ['PLC', 'SCADA'], path: '/employer-job-posting' },
  { id: 103, title: 'Kết cấu sư cầu đường', company: 'InfraBuild', location: 'Đà Nẵng', type: 'Hợp đồng', tags: ['SAP2000', 'ETABS'], path: '/employer-job-posting' },
];

const sampleCandidates = [
  { id: 'c1', name: 'Nguyễn Văn A', role: 'Kỹ sư Cơ khí', skills: ['SolidWorks', 'CAM', 'GD&T'], exp: '5 năm', location: 'Hà Nội' },
  { id: 'c2', name: 'Trần Thị B', role: 'Kỹ sư Điện', skills: ['PLC', 'SCADA', 'AutoCAD'], exp: '3 năm', location: 'HCM' },
  { id: 'c3', name: 'Lê Văn C', role: 'Kỹ sư Kết cấu', skills: ['ETABS', 'SAP2000', 'Revit'], exp: '4 năm', location: 'Hà Nội' },
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-card border border-border rounded-xl shadow-elevation-1 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon, title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
      <Icon name={icon} size={18} />
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    {action}
  </div>
);

const RecruitmentPortal = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('employer'); // employer | candidate
  const [filterLoc, setFilterLoc] = useState('all');

  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleCandidates.filter(c =>
      (filterLoc === 'all' || c.location.toLowerCase().includes(filterLoc)) &&
      (!q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.skills.join(' ').toLowerCase().includes(q))
    );
  }, [query, filterLoc]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleJobs.filter(j =>
      (filterLoc === 'all' || j.location.toLowerCase().includes(filterLoc)) &&
      (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.join(' ').toLowerCase().includes(q))
    );
  }, [query, filterLoc]);

  const quickLinksEmployer = [
    { icon: 'FilePlus2', label: 'Tạo tin tuyển dụng', description: 'Đăng JD, câu hỏi sàng lọc, quyền hạn', to: '/employer-job-posting' },
    { icon: 'LayoutDashboard', label: 'Quản trị tuyển dụng', description: 'Pipeline, phỏng vấn, phân tích', to: '/recruitment-management-dashboard' },
    { icon: 'Users', label: 'Tìm hồ sơ', description: 'Lọc theo kỹ năng, vị trí', to: '/recruitment-management-dashboard' },
  ];

  const quickLinksCandidate = [
    { icon: 'Search', label: 'Tìm việc nhanh', description: 'Lọc theo ngành/kỹ năng', to: '/job-marketplace' },
    { icon: 'FileText', label: 'Nộp CV', description: 'Tải CV, cover letter, theo dõi', to: '/cv-submission-portal' },
    { icon: 'UserCircle', label: 'Hồ sơ cá nhân', description: 'Kỹ năng, dự án, liên kết', to: '/freelancer-dashboard' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <DashboardSidebar onToggleCollapse={() => {}} />

          <main className="flex-1 pb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Recruitment Portal</h1>
                <p className="text-muted-foreground">Tuyển dụng & CV cho kỹ sư, tích hợp quản trị và nộp hồ sơ.</p>
              </div>
              <div className="flex gap-2">
                <Button variant={mode === 'employer' ? 'default' : 'outline'} onClick={() => setMode('employer')}>
                  <Icon name="Building2" size={16} className="mr-2" />Nhà tuyển dụng
                </Button>
                <Button variant={mode === 'candidate' ? 'default' : 'outline'} onClick={() => setMode('candidate')}>
                  <Icon name="User" size={16} className="mr-2" />Ứng viên
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                <div className="flex-1">
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={mode === 'employer' ? 'Tìm ứng viên, kỹ năng…' : 'Tìm việc, công ty, kỹ năng…'} />
                </div>
                <div className="w-full md:w-56">
                  <Select
                    value={filterLoc}
                    onChange={(e) => setFilterLoc(e.target.value)}
                    options={[
                      { label: 'Tất cả địa điểm', value: 'all' },
                      { label: 'Hà Nội', value: 'hà nội' },
                      { label: 'Hồ Chí Minh', value: 'hồ chí minh' },
                      { label: 'Đà Nẵng', value: 'đà nẵng' },
                    ]}
                  />
                </div>
                <Button onClick={() => navigate(mode === 'employer' ? '/recruitment-management-dashboard' : '/job-marketplace')}>
                  <Icon name="Search" size={16} className="mr-2" />Tìm kiếm
                </Button>
              </div>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(mode === 'employer' ? quickLinksEmployer : quickLinksCandidate).map(link => (
                <Card key={link.label} className="p-4 hover:shadow-elevation-2 transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon name={link.icon} size={18} />
                        <h3 className="font-medium">{link.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <Link to={link.to} className="text-primary text-sm hover:underline">Mở</Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Lists */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-4">
                  <SectionTitle icon={mode === 'employer' ? 'Users' : 'Briefcase'} title={mode === 'employer' ? 'Ứng viên nổi bật' : 'Việc làm gợi ý'} action={<Link to={mode === 'employer' ? '/recruitment-management-dashboard' : '/job-marketplace'} className="text-sm text-primary hover:underline">Xem tất cả</Link>} />
                  <div className="divide-y divide-border">
                    {(mode === 'employer' ? filteredCandidates : filteredJobs).slice(0, 6).map(item => (
                      <div key={item.id} className="py-3 flex items-start justify-between">
                        {mode === 'employer' ? (
                          <div>
                            <div className="font-medium">{item.name} · <span className="text-muted-foreground font-normal">{item.role}</span></div>
                            <div className="text-sm text-muted-foreground">{item.location} • {item.exp}</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {item.skills.map(s => (
                                <span key={s} className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{item.title} · <span className="text-muted-foreground font-normal">{item.company}</span></div>
                            <div className="text-sm text-muted-foreground">{item.location} • {item.type}</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {item.tags.map(t => (
                                <span key={t} className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {mode === 'employer' ? (
                            <Button variant="outline" onClick={() => navigate('/recruitment-management-dashboard')}>
                              <Icon name="Plus" size={14} className="mr-1" />Thêm vào pipeline
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => navigate('/cv-submission-portal')}>
                              <Icon name="Send" size={14} className="mr-1" />Nộp hồ sơ
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <SectionTitle icon="BookOpenCheck" title="Quy trình làm việc" />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { icon: 'FileSearch', t: 'Định nghĩa nhu cầu', d: 'Kỹ năng, mức lương, hình thức' },
                      { icon: 'FilePlus', t: 'Đăng JD', d: 'Câu hỏi sàng lọc, quyền truy cập' },
                      { icon: 'Workflow', t: 'Quản trị pipeline', d: 'Sàng lọc → PV → Offer' },
                      { icon: 'FileCheck2', t: 'Nộp & Theo dõi', d: 'Ứng viên nộp CV, tra cứu tình trạng' },
                    ].map(s => (
                      <div key={s.t} className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 mb-1"><Icon name={s.icon} size={16} /><div className="font-medium">{s.t}</div></div>
                        <div className="text-xs text-muted-foreground">{s.d}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right: Actions */}
              <div className="space-y-6">
                <Card className="p-4">
                  <SectionTitle icon="Zap" title="Hành động nhanh" />
                  <div className="grid grid-cols-1 gap-3">
                    {mode === 'employer' ? (
                      <>
                        <Button onClick={() => navigate('/employer-job-posting')}>
                          <Icon name="FilePlus2" size={16} className="mr-2" />Đăng tin tuyển dụng
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/recruitment-management-dashboard')}>
                          <Icon name="LayoutDashboard" size={16} className="mr-2" />Mở bảng điều khiển
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => navigate('/job-marketplace')}>
                          <Icon name="Search" size={16} className="mr-2" />Khám phá việc làm
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/cv-submission-portal')}>
                          <Icon name="Upload" size={16} className="mr-2" />Nộp CV ngay
                        </Button>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <SectionTitle icon="Info" title="Gợi ý" />
                  <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                    <li>Dùng chức năng lọc để tìm đúng kỹ năng.</li>
                    <li>Nhà tuyển dụng có thể tải CSV ứng viên từ dashboard.</li>
                    <li>Ứng viên nên cập nhật LinkedIn/GitHub trong hồ sơ.</li>
                  </ul>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPortal;

