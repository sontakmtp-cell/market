// Supabase-backed data store for Recruitment Portal & Job Marketplace
import { supabase } from '../lib/supabaseClient.js';

// Helper function to generate unique IDs (fallback if needed)
const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Jobs
export const getRecruitmentJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching recruitment jobs:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching recruitment jobs:', e);
    return [];
  }
};

export const getRecruitmentJobById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching recruitment job by ID:', error);
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Unexpected error fetching recruitment job by ID:', e);
    return null;
  }
};

export const saveRecruitmentJob = async (job) => {
  try {
    // 1) Lấy user hiện tại từ session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return null;
    }

    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      console.error('No authenticated user found. Cannot save recruitment job.');
      return null;
    }

    // 2) Chuẩn bị dữ liệu cần lưu (kèm user_id và updated_at)
    const now = new Date().toISOString();
    const dataToSave = {
      ...(job?.id ? { id: job.id } : {}),
      ...job,
      user_id: userId,
      updated_at: now,
    };

    // 3) Lưu bằng upsert vào bảng recruitment_jobs
    const { data, error } = await supabase
      .from('recruitment_jobs')
      .upsert(dataToSave)
      .select()
      .single();

    if (error) {
      console.error('Error upserting recruitment job:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Unexpected error saving recruitment job:', e);
    return null;
  }
};

// Applications
export const getApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching applications:', e);
    return [];
  }
};

export const getApplicationsByJobId = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('jobId', jobId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications by job ID:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching applications by job ID:', e);
    return [];
  }
};

export const saveApplication = async (application) => {
  try {
    const now = new Date().toISOString();
    const applicationData = {
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
      ...application,
      updated_at: now,
    };

    if (application.id) {
      // Update existing application
      const { data, error } = await supabase
        .from('applications')
        .update(applicationData)
        .eq('id', application.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating application:', error);
        return null;
      }
      
      return data;
    } else {
      // Insert new application
      applicationData.created_at = now;
      
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating application:', error);
        return null;
      }
      
      return data;
    }
  } catch (e) {
    console.error('Unexpected error saving application:', e);
    return null;
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating application status:', error);
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Unexpected error updating application status:', e);
    return null;
  }
};

// Marketplace Projects
export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching projects:', e);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project by ID:', error);
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Unexpected error fetching project by ID:', e);
    return null;
  }
};

export const saveProject = async (project) => {
  try {
    const now = new Date().toISOString();
    const projectData = {
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
      ...project,
      updated_at: now,
    };

    if (project.id) {
      // Update existing project
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', project.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating project:', error);
        return null;
      }
      
      return data;
    } else {
      // Insert new project
      projectData.created_at = now;
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      
      return data;
    }
  } catch (e) {
    console.error('Unexpected error saving project:', e);
    return null;
  }
};
