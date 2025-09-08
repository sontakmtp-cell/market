import React from 'react';
import Icon from '../AppIcon';
import { ROLES, ROLE_CONFIG } from '../../utils/constants';

const RoleSwitch = ({ currentRole, onRoleChange, hideRoles }) => {
  const roles = Object.keys(ROLE_CONFIG).filter(
    (roleKey) => !(hideRoles || []).includes(roleKey)
  );

  return (
    <div className="flex items-center bg-muted rounded-md p-1">
      {roles.map((roleKey) => {
        const role = ROLE_CONFIG[roleKey];
        return (
          <button
            key={roleKey}
            onClick={() => onRoleChange(roleKey)}
            className={`px-3 py-1.5 rounded flex items-center space-x-2 text-sm font-medium transition-colors ${
              currentRole === roleKey 
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={role.icon} size={16} />
            <span>{role.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitch;
