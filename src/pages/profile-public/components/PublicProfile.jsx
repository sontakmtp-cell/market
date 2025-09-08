import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROLES, ROLE_CONFIG } from '../../../utils/constants';
import useProfileStore from '../../../utils/profileStore';
import { trackProfileView } from '../../../utils/profileUtils';
import ProfileSEO from '../../../components/ProfileSEO';
import ProfileHeader from './ProfileHeader';
import ProfileOverview from './ProfileOverview';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import PortfolioSection from './PortfolioSection';
import CertificationsSection from './CertificationsSection';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { basicInfo, roleProfiles } = useProfileStore();
  const [activeRole, setActiveRole] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Handle case where no username in URL (e.g., /profile/user)
  const currentUsername = username || 'current-user';

  // In a real app, you would fetch the profile data here
  useEffect(() => {
    // If no username, show current user's profile (if logged in)
    if (!username) {
      // Check if user is logged in
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Redirect to login if not authenticated and no username
        navigate('/login');
        return;
      }
    }

    // Simulate profile data fetch
    // If no username (current user), show all roles regardless of isPublic
    // If username provided, only show public roles
    const publicRoles = username 
      ? Object.entries(roleProfiles)
          .filter(([, profile]) => profile.isPublic)
          .map(([role]) => role)
      : Object.keys(roleProfiles); // Show all roles for current user

    setAvailableRoles(publicRoles);
    if (publicRoles.length > 0) {
      setActiveRole(publicRoles[0]);
    }
  }, [roleProfiles, username, navigate]);

  // Track profile view for analytics
  useEffect(() => {
    if (currentUsername && activeRole) {
      trackProfileView(currentUsername, activeRole, {
        type: 'anonymous', // In real app, determine if user is logged in
        source: 'direct'
      });
    }
  }, [currentUsername, activeRole]);

  // Show loading or not found state
  if (!currentUsername) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile not found</h1>
          <p className="text-muted-foreground">The requested profile does not exist.</p>
        </div>
      </div>
    );
  }

  // Generate SEO data
  const currentProfile = roleProfiles[activeRole] || {};
  const skills = currentProfile.skills || [];
  const description = basicInfo.bio || '';
  const profileData = { basicInfo, roleProfiles };

  // Tab configuration based on role
  const getTabsForRole = () => {
    const commonTabs = [
      { id: 'overview', label: 'Tổng quan' },
      { id: 'experience', label: 'Kinh nghiệm' }
    ];

    switch (activeRole) {
      case ROLES.FREELANCER:
        return [
          ...commonTabs,
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'reviews', label: 'Đánh giá' },
          { id: 'attachments', label: 'Tệp đính kèm' }
        ];
      case ROLES.CANDIDATE:
        return [
          ...commonTabs,
          { id: 'education', label: 'Học vấn' },
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'attachments', label: 'CV & Tệp' }
        ];
      case ROLES.EMPLOYER:
        return [
          ...commonTabs,
          { id: 'jobs', label: 'Tin tuyển dụng' },
          { id: 'company', label: 'Công ty' }
        ];
      case ROLES.CLIENT:
        return [
          ...commonTabs,
          { id: 'projects', label: 'Dự án' },
          { id: 'reviews', label: 'Đánh giá' }
        ];
      default:
        return commonTabs;
    }
  };

  const tabs = getTabsForRole();

  const renderRoleContent = () => {
    if (!activeRole) return null;

    const profile = roleProfiles[activeRole];
    
    switch (activeTab) {
      case 'overview':
        return (
          <ProfileOverview
            basicInfo={basicInfo}
            roleProfile={profile}
            activeRole={activeRole}
          />
        );

      case 'experience':
        return <ExperienceSection experiences={roleProfiles.experience || []} />;

      case 'education':
        return <EducationSection education={roleProfiles.education || []} />;

      case 'portfolio':
        return <PortfolioSection portfolio={roleProfiles.portfolio || []} />;

      case 'reviews':
        return (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Đánh giá</h2>
            <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
          </section>
        );

      case 'attachments':
        return <CertificationsSection certifications={roleProfiles.certifications || []} />;

      case 'jobs':
        return (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Tin tuyển dụng</h2>
            <p className="text-muted-foreground">Chưa có tin tuyển dụng nào.</p>
          </section>
        );

      case 'company':
        return (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin công ty</h2>
            {profile?.companyInfo ? (
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
            ) : (
              <p className="text-muted-foreground">Chưa cập nhật thông tin công ty.</p>
            )}
          </section>
        );

      case 'projects':
        return (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Dự án</h2>
            <p className="text-muted-foreground">Chưa có dự án nào.</p>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <ProfileSEO
        profileData={profileData}
        username={username}
        activeRole={activeRole}
        skills={skills}
        location={basicInfo.location}
        description={description}
      />

      <ProfileHeader
        basicInfo={basicInfo}
        activeRole={ROLE_CONFIG[activeRole]?.title}
        profileData={profileData}
        username={currentUsername}
        roleProfile={currentProfile}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Selector */}
        {availableRoles.length > 1 && (
          <div className="mb-8">
            <div className="flex space-x-2">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeRole === role
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {ROLE_CONFIG[role].title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Role Content */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderRoleContent()}
        </div>
      </main>
    </div>
  );
};

export default PublicProfile;
