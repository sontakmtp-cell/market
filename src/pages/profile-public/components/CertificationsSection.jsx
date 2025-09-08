import React from 'react';

const CertificationsSection = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <section className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Chứng chỉ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <div key={index} className="flex space-x-4">
            {/* Certificate Icon/Logo */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {cert.logo ? (
                <img
                  src={cert.logo}
                  alt={`${cert.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              )}
            </div>

            {/* Certificate Details */}
            <div className="flex-1">
              <h3 className="font-medium">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">
                {cert.issuer}
                {cert.issueDate && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      {cert.issueDate}
                      {cert.expiryDate && ` - ${cert.expiryDate}`}
                    </span>
                  </>
                )}
              </p>
              {cert.credentialId && (
                <p className="text-sm text-muted-foreground mt-1">
                  ID: {cert.credentialId}
                </p>
              )}
              {cert.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {cert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                >
                  Xem chứng chỉ
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection;
