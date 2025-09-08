// Utility functions for profile URL and SEO

/**
 * Generate profile URL slug from user data
 */
export const generateProfileSlug = (basicInfo, username) => {
  if (basicInfo.displayName) {
    // Convert display name to URL-friendly slug
    return basicInfo.displayName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  return username;
};

/**
 * Generate sharing image URL for profile
 */
export const generateSharingImage = (basicInfo, activeRole, skills = []) => {
  // If user has cover image, use it
  if (basicInfo.coverImage) {
    return basicInfo.coverImage;
  }

  // If user has avatar, use it
  if (basicInfo.avatar) {
    return basicInfo.avatar;
  }

  // Generate dynamic sharing image URL (could be an API endpoint)
  const params = new URLSearchParams({
    name: basicInfo.displayName || 'TechMarketplace User',
    role: activeRole || 'Professional',
    skills: skills.slice(0, 3).join(', ') || '',
    location: basicInfo.location || ''
  });

  // This could be a service like og-image.vercel.app or your own image generation API
  return `/api/og-image?${params.toString()}`;
};

/**
 * Generate meta description for profile
 */
export const generateMetaDescription = (basicInfo, activeRole, skills, location) => {
  const name = basicInfo.displayName || 'Professional';
  const roleText = {
    'FREELANCER': 'Freelancer chuyên nghiệp',
    'CANDIDATE': 'Ứng viên tài năng',
    'EMPLOYER': 'Nhà tuyển dụng',
    'CLIENT': 'Khách hàng dự án'
  }[activeRole] || 'Chuyên gia';

  let description = `${name} - ${roleText} tại TechMarketplace.`;
  
  if (location) {
    description += ` Đến từ ${location}.`;
  }
  
  if (skills.length > 0) {
    description += ` Chuyên về ${skills.slice(0, 3).join(', ')}.`;
  }

  if (basicInfo.bio) {
    const bioExcerpt = basicInfo.bio.substring(0, 100);
    description += ` ${bioExcerpt}${basicInfo.bio.length > 100 ? '...' : ''}`;
  }

  return description.substring(0, 160); // Meta description should be under 160 chars
};

/**
 * Generate structured data for profile
 */
export const generateStructuredData = (profileData, username, activeRole) => {
  const { basicInfo, roleProfiles } = profileData;
  const currentRoleProfile = roleProfiles[activeRole] || {};
  const profileUrl = `${window.location.origin}/profile/${username}`;

  const baseData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": basicInfo.displayName || username,
    "url": profileUrl,
    "image": basicInfo.avatar,
    "description": basicInfo.bio,
    "knowsAbout": currentRoleProfile.skills || [],
    "jobTitle": {
      'FREELANCER': "Freelancer",
      'CANDIDATE': "Job Seeker",
      'EMPLOYER': "Recruiter",
      'CLIENT': "Project Client"
    }[activeRole],
    "sameAs": [
      basicInfo.socialLinks?.linkedin,
      basicInfo.socialLinks?.github,
      basicInfo.socialLinks?.portfolio
    ].filter(Boolean)
  };

  // Add role-specific data
  if (activeRole === 'EMPLOYER' && currentRoleProfile.companyInfo) {
    baseData.worksFor = {
      "@type": "Organization",
      "name": currentRoleProfile.companyInfo.name,
      "description": currentRoleProfile.companyInfo.description,
      "url": currentRoleProfile.companyInfo.website
    };
  }

  if (activeRole === 'FREELANCER' && currentRoleProfile.hourlyRate) {
    baseData.priceRange = `$${currentRoleProfile.hourlyRate}/hour`;
  }

  if (basicInfo.location) {
    baseData.address = {
      "@type": "PostalAddress",
      "addressLocality": basicInfo.location
    };
  }

  if (roleProfiles.education) {
    baseData.alumniOf = roleProfiles.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.school
    }));
  }

  return baseData;
};

/**
 * Track profile view for analytics
 */
export const trackProfileView = (username, activeRole, viewerData = {}) => {
  // Send analytics event
  if (window.gtag) {
    window.gtag('event', 'profile_view', {
      'profile_username': username,
      'profile_role': activeRole,
      'viewer_type': viewerData.type || 'anonymous'
    });
  }

  // Could also send to your own analytics service
  // Note: This endpoint doesn't exist yet, so we'll just log for now
  console.log('Profile view tracked:', {
    username,
    activeRole,
    timestamp: new Date().toISOString(),
    viewer: viewerData,
    userAgent: navigator.userAgent,
    referrer: document.referrer
  });
  
  // TODO: Implement actual analytics endpoint
  // fetch('/api/analytics/profile-view', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     username,
  //     activeRole,
  //     timestamp: new Date().toISOString(),
  //     viewer: viewerData,
  //     userAgent: navigator.userAgent,
  //     referrer: document.referrer
  //   }),
  // }).catch(() => {
  //   // Silently fail analytics
  // });
};
