import React from 'react';
import RecruitmentJobCard from './RecruitmentJobCard';
import Icon from '../../../components/AppIcon';

const JobGrid = ({ jobs = [], loading = false, viewMode = 'grid' }) => {
  if (loading && jobs.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                  <div className="h-6 bg-muted rounded w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting filters or search keywords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
        {jobs.map((job) => (
          <RecruitmentJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobGrid;

