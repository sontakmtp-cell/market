import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const formatSalary = (min, max, currency = 'VND') => {
  if (!min && !max) return 'Negotiable';
  if (min && max) return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} ${currency}`;
  if (max) return `Up to ${max.toLocaleString('vi-VN')} ${currency}`;
  return `From ${min.toLocaleString('vi-VN')} ${currency}`;
};

const daysLeft = (deadline) => {
  if (!deadline) return null;
  const dl = new Date(deadline);
  const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

const RecruitmentJobCard = ({ job }) => {
  const left = daysLeft(job.deadline);
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Building2" size={14} />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span className="capitalize">{job.experienceLevel}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Briefcase" size={14} />
              <span className="capitalize">{job.employmentType}</span>
            </div>
          </div>
        </div>
        {job.showSalary && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Salary</div>
            <div className="font-semibold text-foreground">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</div>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {(job.skills || []).slice(0, 5).map((s, i) => (
          <span key={i} className="px-2 py-1 bg-muted text-xs rounded text-muted-foreground">{s}</span>
        ))}
        {job.skills && job.skills.length > 5 && (
          <span className="px-2 py-1 bg-muted text-xs rounded text-muted-foreground">+{job.skills.length - 5} more</span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {left !== null ? (
            <span className={left <= 3 ? 'text-destructive' : left <= 7 ? 'text-warning' : ''}>
              {left > 0 ? `Deadline in ${left} days` : 'Deadline passed'}
            </span>
          ) : (
            <span>Open</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/cv-submission-portal?jobId=${job.id}`}>
            <Button variant="default" size="sm" iconName="Send" iconPosition="left">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentJobCard;

