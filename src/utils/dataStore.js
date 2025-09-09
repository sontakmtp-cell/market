// Supabase-backed data store for Recruitment Portal & Job Marketplace
import { supabase } from '../lib/supabaseClient.js';

// Helper function to generate unique IDs (fallback if needed)
const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Jobs
export const getRecruitmentJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('recruitment_jobs')
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
      .from('recruitment_jobs')
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
      .from('marketplace_projects')
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
      .from('marketplace_projects')
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
    // Ensure we have current user for client_user_id
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication required. Please log in first.');
    }
    const clientUserId = sessionData?.session?.user?.id || null;
    if (!clientUserId) {
      console.error('No authenticated user. Cannot save project.');
      throw new Error('Authentication required. Please log in to save projects.');
    }

    const now = new Date().toISOString();
    const projectData = {
      // Only include columns that exist in marketplace_projects
      title: project?.title ?? '',
      shortDescription: project?.shortDescription ?? '',
      fullDescription: project?.fullDescription ?? '',
      category: project?.category ?? '',
      skills: Array.isArray(project?.skills) ? project.skills : [],
      budgetMin: typeof project?.budgetMin === 'number' ? project.budgetMin : 0,
      budgetMax: typeof project?.budgetMax === 'number' ? project.budgetMax : 0,
      currency: project?.currency ?? 'VND',
      duration: project?.duration ?? '',
      deadline: project?.deadline ?? '',
      isUrgent: !!project?.isUrgent,
      location: project?.location ?? '',
      attachments: Array.isArray(project?.attachments) ? project.attachments : [],
      objectives: Array.isArray(project?.objectives) ? project.objectives : [],
      technicalRequirements: Array.isArray(project?.technicalRequirements) ? project.technicalRequirements : [],
      deliverables: Array.isArray(project?.deliverables) ? project.deliverables : [],
      client: project?.client ?? {
        name: '',
        company: '',
        rating: 0,
        reviewCount: 0,
        location: ''
      },
      proposalCount: typeof project?.proposalCount === 'number' ? project.proposalCount : 0,
      status: project?.status ?? 'active',
      client_user_id: clientUserId,
      updated_at: now,
    };

    if (project.id) {
      // Update existing project
      const { data, error } = await supabase
        .from('marketplace_projects')
        .update(projectData)
        .eq('id', project.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating project:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Row Level Security violation. You can only update your own projects.');
        }
        throw new Error(`Failed to update project: ${error.message}`);
      }
      
      return data;
    } else {
      // Insert new project
      // created_at will default in DB; include for completeness
      projectData.created_at = now;
      
      const { data, error } = await supabase
        .from('marketplace_projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Row Level Security violation. Please check your authentication.');
        }
        if (error.code === '23503') {
          throw new Error('Database constraint violation. Please check your data.');
        }
        throw new Error(`Failed to create project: ${error.message}`);
      }
      
      return data;
    }
  } catch (e) {
    console.error('Unexpected error saving project:', e);
    if (e.message.includes('Authentication required') || e.message.includes('Row Level Security')) {
      throw e; // Re-throw auth errors with original message
    }
    throw new Error(`Failed to save project: ${e.message}`);
  }
};
