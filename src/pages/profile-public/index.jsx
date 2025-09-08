import React from 'react';
import Header from '../../components/ui/Header';
import PublicProfile from './components/PublicProfile';

const ProfilePublicPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PublicProfile />
    </div>
  );
};

export default ProfilePublicPage;

