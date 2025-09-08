// Role constants
export const ROLES = {
  FREELANCER: 'freelancer',
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
  CLIENT: 'client',
};

// Role configurations
export const ROLE_CONFIG = {
  [ROLES.FREELANCER]: {
    icon: 'Code',
    title: 'Freelancer',
    description: 'Nhận dự án và làm việc tự do',
    defaultPath: '/freelancer-dashboard',
  },
  [ROLES.CANDIDATE]: {
    icon: 'User',
    title: 'Ứng viên',
    description: 'Tìm kiếm cơ hội việc làm',
    defaultPath: '/cv-submission-portal',
  },
  [ROLES.EMPLOYER]: {
    icon: 'Building',
    title: 'Nhà tuyển dụng',
    description: 'Đăng tin và tuyển dụng nhân sự',
    defaultPath: '/recruitment-management-dashboard',
  },
  [ROLES.CLIENT]: {
    icon: 'Briefcase',
    title: 'Khách hàng',
    description: 'Đăng dự án và tìm freelancer',
    defaultPath: '/job-marketplace',
  },
};

// Profile field visibility options
export const VISIBILITY_OPTIONS = {
  PUBLIC: 'public',      // Mọi người
  LOGGED_IN: 'loggedIn', // Đăng nhập
  CONNECTED: 'connected',// Kết nối
  INVITED: 'invited',    // Mời
  PRIVATE: 'private',    // Chỉ mình tôi
};

// Profile completion checklist items by role
export const PROFILE_CHECKLIST = {
  [ROLES.FREELANCER]: [
    'avatar',
    'skills',
    'portfolio',
    'experience',
    'hourlyRate',
    'availability',
  ],
  [ROLES.CANDIDATE]: [
    'avatar',
    'resume',
    'education',
    'experience',
    'skills',
    'preferredJobs',
  ],
  [ROLES.EMPLOYER]: [
    'companyInfo',
    'companyLogo',
    'description',
    'location',
    'industry',
    'companySize',
  ],
  [ROLES.CLIENT]: [
    'avatar',
    'projectPreferences',
    'paymentMethod',
    'description',
  ],
};
