import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES, VISIBILITY_OPTIONS } from './constants';

const useProfileStore = create(
  persist(
    (set, get) => ({
      // Basic profile info
      basicInfo: {
        avatar: '',
        coverImage: '',
        displayName: 'John Developer',
        bio: 'Experienced full-stack developer with passion for creating innovative web applications.',
        location: 'Ho Chi Minh City, Vietnam',
        languages: ['Vietnamese', 'English'],
        email: 'john@example.com',
        phone: '+84 123 456 789',
        socialLinks: {
          github: 'https://github.com/johndev',
          linkedin: 'https://linkedin.com/in/johndev',
          portfolio: 'https://johndev.com',
        },
        visibility: {
          email: VISIBILITY_OPTIONS.PRIVATE,
          phone: VISIBILITY_OPTIONS.PRIVATE,
        },
      },

      // Role-specific profiles
      roleProfiles: {
        [ROLES.FREELANCER]: {
          isPublic: true, // Set to true for testing
          specialization: ['webdev'],
          skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
          yearsOfExperience: 3,
          interests: ['Web Development', 'Mobile Apps'],
          hourlyRate: 25,
          availability: 'fulltime', // fulltime, parttime, notAvailable
          portfolio: [],
        },
        [ROLES.CANDIDATE]: {
          isPublic: false,
          resume: '',
          specialization: [],
          skills: [],
          yearsOfExperience: 0,
          preferredJobs: [],
          expectedSalary: {
            min: 0,
            max: 0,
            currency: 'VND',
          },
        },
        [ROLES.EMPLOYER]: {
          isPublic: false,
          companyInfo: {
            name: '',
            logo: '',
            size: '',
            industry: '',
            website: '',
            description: '',
          },
          benefits: [],
          culture: '',
          recruitmentProcess: '',
        },
        [ROLES.CLIENT]: {
          isPublic: false,
          projectPreferences: {
            types: [],
            budgetRange: {
              min: 0,
              max: 0,
              currency: 'VND',
            },
            scope: '', // small, medium, large
          },
        },
      },

      // Experience & Education (shared across roles)
      experience: [],
      education: [],
      certifications: [],
      
      // Portfolio items
      portfolio: [],

      // Attachments
      attachments: {
        resume: '',
        coverLetter: '',
        certificates: [],
        portfolio: [],
      },

      // Methods
      updateBasicInfo: (info) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info },
        })),

      updateRoleProfile: (role, profile) =>
        set((state) => ({
          roleProfiles: {
            ...state.roleProfiles,
            [role]: { ...state.roleProfiles[role], ...profile },
          },
        })),

      toggleRolePublic: (role) =>
        set((state) => ({
          roleProfiles: {
            ...state.roleProfiles,
            [role]: {
              ...state.roleProfiles[role],
              isPublic: !state.roleProfiles[role].isPublic,
            },
          },
        })),

      addPortfolioItem: (item) =>
        set((state) => ({
          portfolio: [...state.portfolio, item],
        })),

      updatePortfolioItem: (id, item) =>
        set((state) => ({
          portfolio: state.portfolio.map((p) =>
            p.id === id ? { ...p, ...item } : p
          ),
        })),

      removePortfolioItem: (id) =>
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.id !== id),
        })),

      // Experience management
      addExperience: (experience) =>
        set((state) => ({
          experience: [...state.experience, { ...experience, id: Date.now() }],
        })),

      updateExperience: (id, experience) =>
        set((state) => ({
          experience: state.experience.map((exp) =>
            exp.id === id ? { ...exp, ...experience } : exp
          ),
        })),

      removeExperience: (id) =>
        set((state) => ({
          experience: state.experience.filter((exp) => exp.id !== id),
        })),

      // Education management
      addEducation: (education) =>
        set((state) => ({
          education: [...state.education, { ...education, id: Date.now() }],
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          education: state.education.map((edu) =>
            edu.id === id ? { ...edu, ...education } : edu
          ),
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((edu) => edu.id !== id),
        })),

      // Certifications management
      addCertification: (certification) =>
        set((state) => ({
          certifications: [...state.certifications, { ...certification, id: Date.now() }],
        })),

      updateCertification: (id, certification) =>
        set((state) => ({
          certifications: state.certifications.map((cert) =>
            cert.id === id ? { ...cert, ...certification } : cert
          ),
        })),

      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((cert) => cert.id !== id),
        })),

      // Get completed profile items for progress tracking
      getCompletedItems: (role) => {
        const state = get();
        const profile = state.roleProfiles[role];
        const completed = [];

        // Check basic info
        if (state.basicInfo.avatar) completed.push('avatar');
        if (state.basicInfo.displayName && state.basicInfo.bio) completed.push('basicInfo');

        // Check role-specific items
        switch (role) {
          case ROLES.FREELANCER:
            if (profile.skills.length > 0) completed.push('skills');
            if (state.portfolio.length > 0) completed.push('portfolio');
            if (state.experience.length > 0) completed.push('experience');
            if (profile.hourlyRate > 0) completed.push('hourlyRate');
            if (profile.availability) completed.push('availability');
            break;
          
          case ROLES.CANDIDATE:
            if (profile.resume) completed.push('resume');
            if (state.education.length > 0) completed.push('education');
            if (state.experience.length > 0) completed.push('experience');
            if (profile.skills.length > 0) completed.push('skills');
            if (profile.preferredJobs.length > 0) completed.push('preferredJobs');
            break;

          case ROLES.EMPLOYER:
            if (profile.companyInfo.logo) completed.push('companyLogo');
            if (profile.companyInfo.name && profile.companyInfo.description) completed.push('companyInfo');
            if (profile.companyInfo.location) completed.push('location');
            if (profile.companyInfo.industry) completed.push('industry');
            if (profile.companyInfo.size) completed.push('companySize');
            break;

          case ROLES.CLIENT:
            if (state.basicInfo.avatar) completed.push('avatar');
            if (profile.projectPreferences.types.length > 0) completed.push('projectPreferences');
            if (profile.projectPreferences.budgetRange.max > 0) completed.push('paymentMethod');
            if (state.basicInfo.bio) completed.push('description');
            break;
        }

        return completed;
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);

export default useProfileStore;
