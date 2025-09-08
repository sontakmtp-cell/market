import React from 'react';
import { ROLE_CONFIG } from '../../../../utils/constants';
import ShareProfile from '../ShareProfile';

const ProfileMainContent = ({ 
  username, 
  availableRoles, 
  activeRole, 
  setActiveRole,
  children,
}) => {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        {/* Role Selector */}
        <div>
          {availableRoles.length > 1 && (
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
          )}
        </div>

        {/* Share Profile */}
        <ShareProfile
          username={username}
          onShare={(platform) => {
            // TODO: Add analytics tracking
            console.log(`Profile shared on ${platform}`);
          }}
        />
      </div>

      {/* Role Content */}
      {children}
    </main>
  );
};

export default ProfileMainContent;
