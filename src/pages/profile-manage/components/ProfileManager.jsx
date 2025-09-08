import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_CONFIG } from '../../../utils/constants';
import useProfileStore from '../../../utils/profileStore';
import RoleSwitch from '../../../components/ui/RoleSwitch';
import ProfileProgress from './ProfileProgress';
import ProfileFileSection from './ProfileFileSection';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import PrivacySettings from './PrivacySettings';
import PortfolioManager from './PortfolioManager';
import FreelancerProfileForm from './forms/FreelancerProfileForm';
import CandidateProfileForm from './forms/CandidateProfileForm';
import EmployerProfileForm from './forms/EmployerProfileForm';
import ClientProfileForm from './forms/ClientProfileForm';
import BasicInfoForm from './forms/BasicInfoForm';
import { useSupabase } from '../../../contexts/SupabaseContext';

const ProfileManager = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [currentRole, setCurrentRole] = useState(ROLES.FREELANCER);
  const { getCompletedItems, roleProfiles } = useProfileStore();
  const currentUsername = useMemo(() => (
    (user?.user_metadata?.username || user?.email?.split('@')[0] || 'user')?.toString()
  ), [user]);

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const renderProfileForm = () => {
    switch (currentRole) {
      case ROLES.FREELANCER:
        return <FreelancerProfileForm />;
      case ROLES.CANDIDATE:
        return <CandidateProfileForm />;
      case ROLES.EMPLOYER:
        return <EmployerProfileForm />;
      case ROLES.CLIENT:
        return <ClientProfileForm />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Quản lý hồ sơ</h1>
          <button
            onClick={() => navigate(`/profile/${currentUsername}`)}
            className="text-primary hover:text-primary/80"
          >
            Xem hồ sơ công khai
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Vai trò</h2>
              <RoleSwitch
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
              />
              
              {/* Public visibility toggle */}
              <div className="mt-4 pt-4 border-t border-border">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hiển thị công khai</span>
                  <input
                    type="checkbox"
                    checked={roleProfiles[currentRole]?.isPublic || false}
                    onChange={(e) => {
                      const { toggleRolePublic } = useProfileStore.getState();
                      toggleRolePublic(currentRole);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Cho phép người khác xem vai trò này trong hồ sơ công khai
                </p>
              </div>
            </div>

            <ProfileProgress
              role={currentRole}
              completedItems={getCompletedItems(currentRole)}
            />
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">
                Thông tin cơ bản
              </h2>
              <BasicInfoForm />
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">
                Hình ảnh & Tệp đính kèm
              </h2>
              <ProfileFileSection />
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">
                {ROLE_CONFIG[currentRole].title}
              </h2>
              {renderProfileForm()}
            </div>

            <div className="bg-card rounded-lg p-6">
              <PortfolioManager />
            </div>

            <div className="bg-card rounded-lg p-6">
              <ExperienceManager />
            </div>

            <div className="bg-card rounded-lg p-6">
              <EducationManager />
            </div>

            <div className="bg-card rounded-lg p-6">
              <PrivacySettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
