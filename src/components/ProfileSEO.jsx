import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  generateMetaDescription, 
  generateSharingImage, 
  generateStructuredData 
} from '../utils/profileUtils';

const ProfileSEO = ({ 
  profileData, 
  username, 
  activeRole,
  skills = [],
  location = '',
  description = ''
}) => {
  if (!profileData) return null;

  const { basicInfo } = profileData;
  
  // Generate title based on role and info
  const generateTitle = () => {
    const name = basicInfo.displayName || username;
    const roleTitle = activeRole ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1) : '';
    
    if (skills.length > 0) {
      return `${name} - ${roleTitle} | ${skills.slice(0, 3).join(', ')} | TechMarketplace`;
    }
    
    return `${name} - ${roleTitle} | TechMarketplace`;
  };

  // Generate keywords
  const generateKeywords = () => {
    const baseKeywords = ['techmarketplace', 'freelancer', 'việc làm', username];
    const roleKeywords = {
      freelancer: ['freelancer', 'dự án', 'thuê ngoài'],
      candidate: ['ứng viên', 'tìm việc', 'tuyển dụng'],
      employer: ['tuyển dụng', 'nhà tuyển dụng', 'việc làm'],
      client: ['khách hàng', 'dự án', 'thuê freelancer']
    }[activeRole] || [];
    
    return [...baseKeywords, ...roleKeywords, ...skills, location].filter(Boolean).join(', ');
  };
  
  // Generate SEO data using utility functions
  const title = generateTitle();
  const metaDescription = generateMetaDescription(basicInfo, activeRole, skills, location);
  const keywords = generateKeywords();
  const imageUrl = generateSharingImage(basicInfo, activeRole, skills);
  const profileUrl = `${window.location.origin}/profile/${username}`;
  const structuredData = generateStructuredData(profileData, username, activeRole);
  
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={profileUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={profileUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TechMarketplace" />
      <meta property="profile:username" content={username} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@techmarketplace" />

      {/* LinkedIn */}
      <meta property="article:author" content={basicInfo.displayName || username} />
      
      {/* Additional meta tags */}
      <meta name="author" content={basicInfo.displayName || username} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ProfileSEO;