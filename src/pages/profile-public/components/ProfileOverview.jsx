import React from 'react';
import { Clock, DollarSign, MapPin, Calendar, Globe } from 'lucide-react';
import { ROLES } from '../../../utils/constants';

const ProfileOverview = ({ basicInfo, roleProfile, activeRole }) => {
  if (!roleProfile) return null;

  const getOverviewItems = () => {
    const items = [];

    switch (activeRole) {
      case ROLES.FREELANCER:
        if (roleProfile?.hourlyRate) {
          items.push({
            icon: DollarSign,
            label: 'Giá theo giờ',
            value: `$${roleProfile.hourlyRate}/giờ`,
            color: 'text-green-600'
          });
        }
        if (roleProfile?.availability?.hoursPerWeek) {
          items.push({
            icon: Clock,
            label: 'Giờ/tuần',
            value: `${roleProfile.availability.hoursPerWeek} giờ`,
            color: 'text-blue-600'
          });
        }
        if (roleProfile?.timezone) {
          items.push({
            icon: Globe,
            label: 'Múi giờ',
            value: roleProfile.timezone,
            color: 'text-purple-600'
          });
        }
        break;

      case ROLES.CANDIDATE:
        if (roleProfile?.salaryExpectation) {
          items.push({
            icon: DollarSign,
            label: 'Lương mong muốn',
            value: roleProfile.salaryExpectation,
            color: 'text-green-600'
          });
        }
        if (roleProfile?.jobType) {
          items.push({
            icon: Clock,
            label: 'Loại công việc',
            value: roleProfile.jobType,
            color: 'text-blue-600'
          });
        }
        if (roleProfile?.availability?.startDate) {
          items.push({
            icon: Calendar,
            label: 'Có thể bắt đầu',
            value: roleProfile.availability.startDate,
            color: 'text-purple-600'
          });
        }
        break;

      case ROLES.EMPLOYER:
        if (roleProfile?.companyInfo?.founded) {
          items.push({
            icon: Calendar,
            label: 'Thành lập',
            value: roleProfile.companyInfo.founded,
            color: 'text-blue-600'
          });
        }
        if (roleProfile?.companyInfo?.website) {
          items.push({
            icon: Globe,
            label: 'Website',
            value: roleProfile.companyInfo.website,
            color: 'text-purple-600'
          });
        }
        break;

      case ROLES.CLIENT:
        if (roleProfile?.preferredBudget) {
          items.push({
            icon: DollarSign,
            label: 'Ngân sách dự án',
            value: roleProfile.preferredBudget,
            color: 'text-green-600'
          });
        }
        if (roleProfile?.projectPreferences?.timeline) {
          items.push({
            icon: Clock,
            label: 'Thời gian dự án',
            value: roleProfile.projectPreferences.timeline,
            color: 'text-blue-600'
          });
        }
        break;
    }

    // Common location
    if (basicInfo.location) {
      items.push({
        icon: MapPin,
        label: 'Địa điểm',
        value: basicInfo.location,
        color: 'text-gray-600'
      });
    }

    return items;
  };

  const overviewItems = getOverviewItems();

  return (
    <section className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Tổng quan</h2>
      
      {/* Bio */}
      {basicInfo.bio && (
        <div className="mb-6">
          <p className="text-muted-foreground leading-relaxed">
            {basicInfo.bio}
          </p>
        </div>
      )}

      {/* Key Information */}
      {overviewItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {overviewItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
                <div className="font-medium">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills for Freelancer/Candidate */}
      {(activeRole === ROLES.FREELANCER || activeRole === ROLES.CANDIDATE) && roleProfile?.skills && roleProfile.skills.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Kỹ năng nổi bật</h3>
          <div className="flex flex-wrap gap-2">
            {roleProfile.skills.slice(0, 8).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
            {roleProfile.skills.length > 8 && (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                +{roleProfile.skills.length - 8} khác
              </span>
            )}
          </div>
        </div>
      )}

      {/* Company Culture for Employer */}
      {activeRole === ROLES.EMPLOYER && roleProfile?.companyCulture && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Văn hóa công ty</h3>
          <p className="text-muted-foreground">
            {roleProfile.companyCulture}
          </p>
        </div>
      )}

      {/* Project Types for Client */}
      {activeRole === ROLES.CLIENT && roleProfile?.projectPreferences?.types && roleProfile.projectPreferences.types.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Loại dự án quan tâm</h3>
          <div className="flex flex-wrap gap-2">
            {roleProfile.projectPreferences.types.map((type) => (
              <span
                key={type}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileOverview;
