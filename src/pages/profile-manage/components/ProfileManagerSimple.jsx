import React, { useState } from 'react';
import { ROLES, ROLE_CONFIG } from '../../../utils/constants';
import RoleSwitch from '../../../components/ui/RoleSwitch';

const ProfileManagerSimple = () => {
  console.log('ProfileManagerSimple is rendering');
  
  const [currentRole, setCurrentRole] = useState(ROLES.FREELANCER);
  
  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  return (
    <div style={{padding: '20px'}}>
      <h2>Profile Manager - Testing RoleSwitch</h2>
      <p>Current Role: {currentRole}</p>
      
      <div style={{marginTop: '20px'}}>
        <h3>Role Switch Component:</h3>
        <RoleSwitch
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
};

export default ProfileManagerSimple;
