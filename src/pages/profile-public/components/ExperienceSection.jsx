import React from 'react';

const ExperienceSection = ({ experiences }) => {
  if (!experiences?.length) return null;

  return (
    <section className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Kinh nghiệm làm việc</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`relative pl-8 ${
              index !== experiences.length - 1 ? 'pb-6' : ''
            }`}
          >
            {/* Timeline dot and line */}
            <div className="absolute left-0 top-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              {index !== experiences.length - 1 && (
                <div className="absolute top-3 left-1.5 w-px h-full -translate-x-1/2 bg-border" />
              )}
            </div>

            {/* Content */}
            <div>
              <h3 className="font-medium">{exp.title}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                <span>{exp.company}</span>
                {exp.location && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{exp.location}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {exp.startDate} - {exp.endDate || 'Hiện tại'}
                {exp.type && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{exp.type}</span>
                  </>
                )}
              </div>
              {exp.description && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {exp.description}
                </p>
              )}
              {exp.achievements?.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
