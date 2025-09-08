import React from 'react';
import { Star, Clock, CheckCircle, Users } from 'lucide-react';
import { ROLES } from '../../../utils/constants';

const ProfileStats = ({ activeRole, roleProfile, basicInfo }) => {
  if (!roleProfile) return null;

  const getStatsForRole = () => {
    switch (activeRole) {
      case ROLES.FREELANCER:
        return [
          {
            icon: Star,
            label: 'Đánh giá',
            value: roleProfile.rating || '5.0',
            suffix: '/5',
            color: 'text-yellow-500'
          },
          {
            icon: CheckCircle,
            label: 'Dự án hoàn thành',
            value: roleProfile.completedProjects || '0',
            color: 'text-green-500'
          },
          {
            icon: Clock,
            label: 'Phản hồi',
            value: roleProfile.responseTime || '< 1h',
            color: 'text-blue-500'
          },
          {
            icon: Users,
            label: 'Khách hàng',
            value: roleProfile.totalClients || '0',
            color: 'text-purple-500'
          }
        ];

      case ROLES.CANDIDATE:
        return [
          {
            icon: Star,
            label: 'Đánh giá',
            value: roleProfile.rating || 'Chưa có',
            suffix: roleProfile.rating ? '/5' : '',
            color: 'text-yellow-500'
          },
          {
            icon: CheckCircle,
            label: 'Tỷ lệ phỏng vấn',
            value: roleProfile.interviewRate || '0%',
            color: 'text-green-500'
          },
          {
            icon: Clock,
            label: 'Kinh nghiệm',
            value: roleProfile.experience || '0 năm',
            color: 'text-blue-500'
          },
          {
            icon: Users,
            label: 'Đánh giá',
            value: roleProfile.recommendations || '0',
            color: 'text-purple-500'
          }
        ];

      case ROLES.EMPLOYER:
        return [
          {
            icon: Star,
            label: 'Đánh giá công ty',
            value: roleProfile.companyRating || '5.0',
            suffix: '/5',
            color: 'text-yellow-500'
          },
          {
            icon: Users,
            label: 'Nhân viên',
            value: roleProfile.companyInfo?.size || '1-10',
            color: 'text-blue-500'
          },
          {
            icon: CheckCircle,
            label: 'Tin đã đăng',
            value: roleProfile.jobsPosted || '0',
            color: 'text-green-500'
          },
          {
            icon: Clock,
            label: 'Hoạt động',
            value: roleProfile.lastActive || 'Hôm nay',
            color: 'text-purple-500'
          }
        ];

      case ROLES.CLIENT:
        return [
          {
            icon: Star,
            label: 'Đánh giá',
            value: roleProfile.rating || '5.0',
            suffix: '/5',
            color: 'text-yellow-500'
          },
          {
            icon: CheckCircle,
            label: 'Dự án đã tạo',
            value: roleProfile.projectsCreated || '0',
            color: 'text-green-500'
          },
          {
            icon: Users,
            label: 'Freelancer thuê',
            value: roleProfile.freelancersHired || '0',
            color: 'text-blue-500'
          },
          {
            icon: Clock,
            label: 'Thanh toán',
            value: roleProfile.paymentRating || '100%',
            color: 'text-purple-500'
          }
        ];

      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  if (stats.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="flex items-center justify-center">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="mt-2">
            <div className="text-lg font-semibold text-foreground">
              {stat.value}
              {stat.suffix && (
                <span className="text-sm text-muted-foreground ml-1">
                  {stat.suffix}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
