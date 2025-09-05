import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecruitmentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, quarter, year
  const [selectedMetric, setSelectedMetric] = useState('applications'); // applications, hires, time_to_fill

  // Mock data for different analytics
  const applicationTrendsData = [
    { name: 'T1', applications: 45, hires: 12, interviews: 28 },
    { name: 'T2', applications: 52, hires: 15, interviews: 32 },
    { name: 'T3', applications: 38, hires: 8, interviews: 22 },
    { name: 'T4', applications: 67, hires: 18, interviews: 41 },
    { name: 'T5', applications: 73, hires: 20, interviews: 45 },
    { name: 'T6', applications: 59, hires: 16, interviews: 36 }
  ];

  const sourceEffectivenessData = [
    { name: 'Job portals', value: 45, color: '#0ea5e9' },
    { name: 'Company website', value: 25, color: '#10b981' },
    { name: 'Social media', value: 15, color: '#f59e0b' },
    { name: 'Referrals', value: 10, color: '#8b5cf6' },
    { name: 'Recruiters', value: 5, color: '#ef4444' }
  ];

  const timeToFillData = [
    { position: 'Kỹ sư Cơ khí', days: 25, target: 30 },
    { position: 'Chuyên viên IT', days: 18, target: 25 },
    { position: 'Kế toán', days: 32, target: 28 },
    { position: 'Nhân viên Sale', days: 15, target: 20 },
    { position: 'Quản lý dự án', days: 42, target: 35 }
  ];

  const conversionRatesData = [
    { stage: 'CV nộp', rate: 100, count: 247 },
    { stage: 'Sàng lọc', rate: 65, count: 160 },
    { stage: 'PV vòng 1', rate: 45, count: 111 },
    { stage: 'PV vòng 2', rate: 25, count: 62 },
    { stage: 'Offer', rate: 15, count: 37 },
    { stage: 'Nhận việc', rate: 12, count: 30 }
  ];

  const performanceMetrics = [
    {
      title: 'Thời gian tuyển dụng trung bình',
      value: '28 ngày',
      target: '≤ 30 ngày',
      change: '-5%',
      changeType: 'decrease',
      icon: 'Clock',
      color: 'success'
    },
    {
      title: 'Tỷ lệ chấp nhận offer',
      value: '81%',
      target: '≥ 75%',
      change: '+6%', 
      changeType: 'increase',
      icon: 'Target',
      color: 'success'
    },
    {
      title: 'Chi phí tuyển dụng/vị trí',
      value: '15.2M VNĐ',
      target: '≤ 18M VNĐ',
      change: '-12%',
      changeType: 'decrease', 
      icon: 'DollarSign',
      color: 'success'
    },
    {
      title: 'Chất lượng ứng viên',
      value: '4.2/5',
      target: '≥ 4.0/5',
      change: '+0.3',
      changeType: 'increase',
      icon: 'Star',
      color: 'success'
    }
  ];

  const topPerformingJobs = [
    {
      title: 'Kỹ sư Phần mềm Senior',
      applications: 89,
      hires: 3,
      timeToFill: 22,
      cost: '12.5M VNĐ',
      rating: 4.6
    },
    {
      title: 'Chuyên viên Marketing Digital',
      applications: 124,
      hires: 2, 
      timeToFill: 18,
      cost: '8.2M VNĐ',
      rating: 4.8
    },
    {
      title: 'Kỹ sư Cơ khí Thiết kế',
      applications: 67,
      hires: 2,
      timeToFill: 31,
      cost: '15.8M VNĐ',
      rating: 4.1
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-success' : changeType === 'decrease' ? 'text-success' : 'text-muted-foreground';
  };

  const getMetricColor = (color) => {
    const colors = {
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      primary: 'bg-primary text-primary-foreground',
      accent: 'bg-accent text-accent-foreground'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CalendarRange" size={16} className="text-muted-foreground" />
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Download" iconPosition="left">
            Xuất báo cáo
          </Button>
          <Button variant="default" iconName="FileBarChart" iconPosition="left">
            Tạo báo cáo tùy chỉnh
          </Button>
        </div>
      </div>
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColor(metric?.color)}`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(metric?.changeType)}`}>
                <Icon name={metric?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} size={16} />
                <span className="text-sm font-medium">{metric?.change}</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-foreground mb-1">{metric?.value}</h3>
              <p className="text-sm text-muted-foreground">{metric?.title}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Mục tiêu: {metric?.target}
            </div>
          </div>
        ))}
      </div>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <span>Xu hướng ứng tuyển</span>
            </h3>
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button className="px-2 py-1 text-xs bg-card rounded text-foreground">Ứng tuyển</button>
              <button className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground">Tuyển dụng</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(100 116 139)' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(100 116 139)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hires" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0ea5e9] rounded-full" />
              <span className="text-muted-foreground">Ứng tuyển</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#10b981] rounded-full" />
              <span className="text-muted-foreground">Tuyển dụng</span>
            </div>
          </div>
        </div>

        {/* Source Effectiveness */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Icon name="PieChart" size={20} className="text-primary" />
            <span>Hiệu quả nguồn tuyển dụng</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceEffectivenessData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourceEffectivenessData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Tỷ lệ']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {sourceEffectivenessData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item?.color }} />
                  <span className="text-sm text-muted-foreground">{item?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Fill */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <span>Thời gian tuyển dụng theo vị trí</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToFillData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(100 116 139)' }}
                />
                <YAxis 
                  type="category"
                  dataKey="position"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(100 116 139)' }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ngày`, 'Thời gian']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="days" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0ea5e9] rounded-sm" />
              <span className="text-muted-foreground">Thực tế</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#e2e8f0] rounded-sm" />
              <span className="text-muted-foreground">Mục tiêu</span>
            </div>
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Icon name="TrendingDown" size={20} className="text-primary" />
            <span>Tỷ lệ chuyển đổi pipeline</span>
          </h3>
          <div className="space-y-4">
            {conversionRatesData?.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{stage?.stage}</span>
                      <span className="text-sm text-muted-foreground">{stage?.count}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${stage?.rate}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-foreground min-w-[3rem] text-right">
                    {stage?.rate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Performing Jobs */}
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Trophy" size={20} className="text-primary" />
            <span>Tin tuyển dụng hiệu quả nhất</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPerformingJobs?.map((job, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{job?.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-warning" />
                    <span className="text-sm font-medium">{job?.rating}/5</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{job?.applications}</div>
                    <div className="text-xs text-muted-foreground">Ứng tuyển</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">{job?.hires}</div>
                    <div className="text-xs text-muted-foreground">Đã tuyển</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning">{job?.timeToFill}</div>
                    <div className="text-xs text-muted-foreground">Ngày tuyển</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{job?.cost}</div>
                    <div className="text-xs text-muted-foreground">Chi phí</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;