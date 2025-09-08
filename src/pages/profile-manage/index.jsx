import React from 'react';
import Header from '../../components/ui/Header';
import ProfileManager from './components/ProfileManager';

const ProfileManage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Offset content below fixed header */}
      <div className="pt-16">
        <ProfileManager />
      </div>
    </div>
  );
};

export default ProfileManage;
