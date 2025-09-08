import React from 'react';

const EducationSection = ({ education }) => {
  if (!education?.length) return null;

  return (
    <section className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Học vấn</h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={index}
            className={`relative pl-8 ${
              index !== education.length - 1 ? 'pb-6' : ''
            }`}
          >
            {/* Timeline dot and line */}
            <div className="absolute left-0 top-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              {index !== education.length - 1 && (
                <div className="absolute top-3 left-1.5 w-px h-full -translate-x-1/2 bg-border" />
              )}
            </div>

            {/* Content */}
            <div>
              <h3 className="font-medium">{edu.degree}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                <span>{edu.school}</span>
                {edu.location && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{edu.location}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {edu.startDate} - {edu.endDate || 'Hiện tại'}
                {edu.grade && (
                  <>
                    <span className="mx-2">•</span>
                    <span>GPA: {edu.grade}</span>
                  </>
                )}
              </div>
              {edu.field && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Chuyên ngành: {edu.field}
                </p>
              )}
              {edu.activities?.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Hoạt động & Thành tựu</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {edu.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
