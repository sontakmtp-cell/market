import React from 'react';
import Header from '../../components/ui/Header';
import ProfileManagerSimple from './components/ProfileManagerSimple';

const SimpleProfileManage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Offset for fixed header height */}
      <div className="pt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Simple Profile Manage - With Header & Manager</h1>
        <ProfileManagerSimple />
      </div>
    </div>
  );
};

export default SimpleProfileManage;
