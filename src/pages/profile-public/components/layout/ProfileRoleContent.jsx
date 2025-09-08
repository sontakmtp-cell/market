import React from 'react';
import { ROLES } from '../../../../utils/constants';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import PortfolioSection from '../PortfolioSection';
import CertificationsSection from '../CertificationsSection';

const ProfileRoleContent = ({ activeRole, profile, roleProfiles }) => {
  if (!activeRole) return null;

  const renderSkills = (skills) => (
    <section className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Kỹ năng</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );

  switch (activeRole) {
    case ROLES.FREELANCER:
      return (
        <div className="space-y-6">
          {renderSkills(profile.skills)}
          <PortfolioSection portfolio={roleProfiles.portfolio} />
          <ExperienceSection experiences={roleProfiles.experience} />
          <CertificationsSection certifications={roleProfiles.certifications} />
        </div>
      );

    case ROLES.CANDIDATE:
      return (
        <div className="space-y-6">
          {renderSkills(profile.skills)}
          <ExperienceSection experiences={roleProfiles.experience} />
          <EducationSection education={roleProfiles.education} />
          <CertificationsSection certifications={roleProfiles.certifications} />
        </div>
      );

    case ROLES.EMPLOYER:
      return (
        <div className="space-y-6">
          {/* Company Info */}
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin công ty</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Quy mô</h3>
                <p className="text-muted-foreground">{profile.companyInfo.size}</p>
              </div>
              <div>
                <h3 className="font-medium">Ngành nghề</h3>
                <p className="text-muted-foreground">{profile.companyInfo.industry}</p>
              </div>
              <div>
                <h3 className="font-medium">Mô tả</h3>
                <p className="text-muted-foreground">{profile.companyInfo.description}</p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Phúc lợi</h2>
            <div className="flex flex-wrap gap-2">
              {profile.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </section>
        </div>
      );

    case ROLES.CLIENT:
      return (
        <div className="space-y-6">
          {/* Project Preferences */}
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Sở thích dự án</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Loại dự án</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.projectPreferences.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Quy mô dự án</h3>
                <p className="text-muted-foreground">{profile.projectPreferences.scope}</p>
              </div>
            </div>
          </section>
        </div>
      );

    default:
      return null;
  }
};

export default ProfileRoleContent;
