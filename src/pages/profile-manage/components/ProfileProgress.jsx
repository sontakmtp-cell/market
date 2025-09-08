import React from 'react';
import { PROFILE_CHECKLIST } from '../../../utils/constants';

const ProfileProgress = ({ role, completedItems }) => {
  const checklistItems = PROFILE_CHECKLIST[role] || [];
  const progress = Math.round((completedItems.length / checklistItems.length) * 100);

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tiến độ hoàn thiện hồ sơ</h3>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {checklistItems.map((item) => (
          <div key={item} className="flex items-center">
            <input
              type="checkbox"
              checked={completedItems.includes(item)}
              readOnly
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileProgress;
