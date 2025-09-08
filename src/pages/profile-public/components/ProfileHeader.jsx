import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, UserPlus, Star, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import useProfileStore from '../../../utils/profileStore';
import { VISIBILITY_OPTIONS, ROLES, ROLE_CONFIG } from '../../../utils/constants';
import Button from '../../../components/ui/Button';
import ShareProfile from './ShareProfile';
import ProfileStats from './ProfileStats';
import VerificationBadges from './VerificationBadges';

const ProfileHeader = ({ basicInfo, activeRole, profileData, username, roleProfile }) => {
  const canShowEmail = basicInfo.visibility?.email === VISIBILITY_OPTIONS.PUBLIC;
  const canShowPhone = basicInfo.visibility?.phone === VISIBILITY_OPTIONS.PUBLIC;

  // Get availability status
  const getAvailabilityStatus = () => {
    if (!roleProfile) return null;
    
    switch (activeRole) {
      case ROLES.FREELANCER:
        const availability = roleProfile.availability || 'fulltime';
        return {
          status: availability,
          text: availability === 'fulltime' ? 'Đang mở nhận việc' : 
                availability === 'parttime' ? 'Bán thời gian' : 'Không nhận việc',
          color: availability === 'fulltime' ? 'text-green-600 bg-green-50' : 
                 availability === 'parttime' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
        };
      case ROLES.CANDIDATE:
        return {
          status: 'seeking',
          text: 'Đang tìm việc',
          color: 'text-green-600 bg-green-50'
        };
      case ROLES.EMPLOYER:
        return {
          status: 'hiring',
          text: 'Đang tuyển dụng',
          color: 'text-blue-600 bg-blue-50'
        };
      case ROLES.CLIENT:
        return {
          status: 'active',
          text: 'Hoạt động',
          color: 'text-green-600 bg-green-50'
        };
      default:
        return null;
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  // Get action buttons based on active role
  const getActionButtons = () => {
    const buttons = [];
    
    // Common actions
    buttons.push(
      <Button key="message" variant="outline" size="sm" className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        Nhắn tin
      </Button>
    );

    // Role-specific actions
    switch (activeRole) {
      case ROLES.FREELANCER:
        buttons.push(
          <Button key="hire" size="sm" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Mời hợp tác
          </Button>
        );
        break;
      case ROLES.CANDIDATE:
        buttons.push(
          <Button key="recruit" size="sm" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Mời ứng tuyển
          </Button>
        );
        break;
      case ROLES.EMPLOYER:
        buttons.push(
          <Button key="connect" variant="outline" size="sm" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Kết nối
          </Button>
        );
        break;
      case ROLES.CLIENT:
        buttons.push(
          <Button key="partner" variant="outline" size="sm" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Đánh dấu
          </Button>
        );
        break;
    }

    return buttons;
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-muted rounded-lg overflow-hidden">
        {basicInfo.coverImage ? (
          <img
            src={basicInfo.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/5 to-primary/10" />
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-end sm:space-x-5 pb-4 -mt-12 relative">
          {/* Avatar */}
          <div className="relative flex">
            <div className="h-24 w-24 ring-4 ring-background rounded-full overflow-hidden">
              {basicInfo.avatar ? (
                <img
                  src={basicInfo.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-6 sm:mt-0 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold truncate">
                  {basicInfo.displayName || 'Chưa cập nhật tên'}
                </h1>
                {activeRole && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {ROLE_CONFIG[activeRole]?.title || activeRole}
                  </span>
                )}
                {availabilityStatus && (
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${availabilityStatus.color}`}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {availabilityStatus.text}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="hidden sm:flex items-center space-x-3">
                {getActionButtons()}
                <ShareProfile 
                  username={username}
                  profileData={profileData}
                  activeRole={activeRole}
                />
              </div>
            </div>
            
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              {basicInfo.location && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <svg
                    className="mr-1.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {basicInfo.location}
                </div>
              )}

              {canShowEmail && basicInfo.email && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <svg
                    className="mr-1.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {basicInfo.email}
                </div>
              )}

              {canShowPhone && basicInfo.phone && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <svg
                    className="mr-1.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {basicInfo.phone}
                </div>
              )}
            </div>

            {/* Verification Badges */}
            <VerificationBadges
              basicInfo={basicInfo}
              roleProfile={roleProfile}
              className="mt-3"
            />
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="sm:hidden mt-4 flex flex-wrap gap-2">
          {getActionButtons()}
          <ShareProfile 
            username={username}
            profileData={profileData}
            activeRole={activeRole}
          />
        </div>

        {/* Bio */}
        {basicInfo.bio && (
          <div className="mt-4 text-sm text-muted-foreground">
            {basicInfo.bio}
          </div>
        )}

        {/* Social Links */}
        {basicInfo.socialLinks && (
          <div className="mt-4 flex space-x-4">
            {basicInfo.socialLinks.github && (
              <a
                href={basicInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {basicInfo.socialLinks.linkedin && (
              <a
                href={basicInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            {basicInfo.socialLinks.portfolio && (
              <a
                href={basicInfo.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Profile Stats */}
        <ProfileStats 
          activeRole={activeRole}
          roleProfile={roleProfile}
          basicInfo={basicInfo}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
