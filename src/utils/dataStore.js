// Simple localStorage-backed data store for Recruitment Portal & Job Marketplace
// Keys
const JOBS_KEY = 'recruitment_jobs';
const APPLICATIONS_KEY = 'recruitment_applications';
const MARKETPLACE_PROJECTS_KEY = 'marketplace_projects';

// Helpers
const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('dataStore read error', key, e);
    return [];
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('dataStore write error', key, e);
    return false;
  }
};

const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Jobs
export const getRecruitmentJobs = () => read(JOBS_KEY);

export const getRecruitmentJobById = (id) => {
  return getRecruitmentJobs().find((j) => String(j.id) === String(id));
};

export const saveRecruitmentJob = (job) => {
  const jobs = getRecruitmentJobs();
  const id = job.id || genId('job');
  const now = new Date().toISOString();
  const newJob = {
    id,
    title: '',
    department: '',
    location: '',
    locationType: 'remote',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    description: '',
    responsibilities: '',
    requirements: '',
    templateType: '',
    skills: [],
    certifications: [],
    salaryMin: '',
    salaryMax: '',
    currency: 'VND',
    showSalary: false,
    benefits: [],
    contractTerms: '',
    applicationDeadline: '',
    screeningQuestions: [],
    autoResponse: false,
    responseTemplate: '',
    attachments: [],
    companyMaterials: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...job,
  };
  const idx = jobs.findIndex((j) => String(j.id) === String(id));
  if (idx >= 0) jobs[idx] = { ...jobs[idx], ...newJob, updatedAt: now };
  else jobs.unshift(newJob);
  write(JOBS_KEY, jobs);
  return newJob;
};

// Applications
export const getApplications = () => read(APPLICATIONS_KEY);

export const getApplicationsByJobId = (jobId) => {
  return getApplications().filter((a) => String(a.jobId) === String(jobId));
};

export const saveApplication = (application) => {
  const apps = getApplications();
  const id = application.id || genId('app');
  const now = new Date().toISOString();
  const newApp = {
    id,
    jobId: null,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    technicalSkills: {},
    certifications: [],
    experienceLevel: '',
    cv: null,
    coverLetter: null,
    portfolioFile: null,
    certificates: [],
    customAnswers: {},
    applicationDate: now,
    status: 'submitted', // submitted -> screening -> interview -> offer -> hired/rejected
    createdAt: now,
    updatedAt: now,
    ...application,
  };
  const idx = apps.findIndex((a) => String(a.id) === String(id));
  if (idx >= 0) apps[idx] = { ...apps[idx], ...newApp, updatedAt: now };
  else apps.unshift(newApp);
  write(APPLICATIONS_KEY, apps);
  return newApp;
};

export const updateApplicationStatus = (id, status) => {
  const apps = getApplications();
  const idx = apps.findIndex((a) => String(a.id) === String(id));
  if (idx < 0) return null;
  apps[idx] = { ...apps[idx], status, updatedAt: new Date().toISOString() };
  write(APPLICATIONS_KEY, apps);
  return apps[idx];
};

// Marketplace Projects
export const getProjects = () => read(MARKETPLACE_PROJECTS_KEY);

export const getProjectById = (id) => {
  return getProjects().find((p) => String(p.id) === String(id));
};

export const saveProject = (project) => {
  const projects = getProjects();
  const id = project.id || genId('project');
  const now = new Date().toISOString();
  const newProject = {
    id,
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    skills: [],
    budgetMin: 0,
    budgetMax: 0,
    currency: 'VND',
    duration: '',
    deadline: '',
    isUrgent: false,
    location: '',
    attachments: [],
    objectives: [],
    technicalRequirements: [],
    deliverables: [],
    client: {
      name: '',
      company: '',
      rating: 0,
      reviewCount: 0,
      location: ''
    },
    postedAt: now,
    proposalCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...project,
  };
  const idx = projects.findIndex((p) => String(p.id) === String(id));
  if (idx >= 0) projects[idx] = { ...projects[idx], ...newProject, updatedAt: now };
  else projects.unshift(newProject);
  write(MARKETPLACE_PROJECTS_KEY, projects);
  return newProject;
};

