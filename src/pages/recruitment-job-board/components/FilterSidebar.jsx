import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterSidebar = ({ isOpen = false, onClose, filters, onFiltersChange, jobCount = 0 }) => {
  const toggleArray = (key, value) => {
    const arr = new Set(filters[key] || []);
    if (arr.has(value)) arr.delete(value);
    else arr.add(value);
    onFiltersChange({ ...filters, [key]: Array.from(arr) });
  };

  const setField = (key, value) => onFiltersChange({ ...filters, [key]: value });

  const Content = (
    <div className="w-80 bg-card border-r border-border min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="font-medium text-foreground">Filters</div>
        <button onClick={onClose} className="lg:hidden p-2 rounded hover:bg-muted">
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div>
          <div className="text-sm font-medium mb-2">Location Type</div>
          {['remote','hybrid','onsite'].map((lt) => (
            <label key={lt} className="flex items-center space-x-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={filters.locationTypes?.includes(lt)}
                onChange={() => toggleArray('locationTypes', lt)}
              />
              <span className="capitalize">{lt}</span>
            </label>
          ))}
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Employment Type</div>
          {['full-time','part-time','contract','internship'].map((et) => (
            <label key={et} className="flex items-center space-x-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={filters.employmentTypes?.includes(et)}
                onChange={() => toggleArray('employmentTypes', et)}
              />
              <span className="capitalize">{et}</span>
            </label>
          ))}
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Experience Level</div>
          {['junior','mid','senior','lead'].map((el) => (
            <label key={el} className="flex items-center space-x-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={filters.experienceLevels?.includes(el)}
                onChange={() => toggleArray('experienceLevels', el)}
              />
              <span className="capitalize">{el}</span>
            </label>
          ))}
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Skills</div>
          <input
            value={filters.skills || ''}
            onChange={(e) => setField('skills', e.target.value)}
            placeholder="e.g. React, Node.js"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.showSalaryOnly}
            onChange={(e) => setField('showSalaryOnly', e.target.checked)}
          />
          <span>Show salary only</span>
        </label>

        <button
          onClick={() => onFiltersChange({ locationTypes: [], employmentTypes: [], experienceLevels: [], skills: '', showSalaryOnly: false })}
          className="w-full mt-2 text-sm px-3 py-2 border border-border rounded-md hover:bg-muted"
        >
          Clear all filters
        </button>

        <div className="text-xs text-muted-foreground">{jobCount} jobs</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{Content}</div>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-10">{Content}</div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;

