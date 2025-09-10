import { supabase } from '../lib/supabaseClient.js';

/**
 * Get saved job IDs for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<string[]>} Array of job IDs
 */
export const getSavedJobIds = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map(item => item.job_id) || [];
  } catch (error) {
    console.error('Error getting saved job IDs:', error);
    throw error;
  }
};

/**
 * Get job details by job IDs
 * @param {string[]} jobIds - Array of job IDs
 * @returns {Promise<Object[]>} Array of job objects
 */
export const getJobsByIds = async (jobIds) => {
  try {
    if (!jobIds || jobIds.length === 0) {
      return [];
    }

    // Assuming there's a 'jobs' table or 'marketplace_projects' table
    // Based on the workspace structure, it seems like jobs might be in marketplace_projects
    const { data, error } = await supabase
      .from('marketplace_projects')
      .select('*')
      .in('id', jobIds)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting jobs by IDs:', error);
    throw error;
  }
};

/**
 * Save a job for a user
 * @param {string} userId - The user's ID
 * @param {string} jobId - The job's ID
 * @returns {Promise<Object>} The saved job record
 */
export const saveJob = async (userId, jobId) => {
  try {
    if (!userId || !jobId) {
      throw new Error('User ID and Job ID are required');
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([
        {
          user_id: userId,
          job_id: jobId
        }
      ])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (job already saved)
      if (error.code === '23505') {
        throw new Error('Job is already saved');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

/**
 * Remove a saved job for a user
 * @param {string} userId - The user's ID
 * @param {string} jobId - The job's ID
 * @returns {Promise<boolean>} Success status
 */
export const unsaveJob = async (userId, jobId) => {
  try {
    if (!userId || !jobId) {
      throw new Error('User ID and Job ID are required');
    }

    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

/**
 * Check if a job is saved by a user
 * @param {string} userId - The user's ID
 * @param {string} jobId - The job's ID
 * @returns {Promise<boolean>} Whether the job is saved
 */
export const checkIfJobSaved = async (userId, jobId) => {
  try {
    if (!userId || !jobId) {
      return false;
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (error) {
      // If no record found, that's expected - job is not saved
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};

/**
 * Get saved jobs with full details for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object[]>} Array of saved jobs with details
 */
export const getSavedJobsWithDetails = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .select(`
        id,
        job_id,
        created_at,
        marketplace_projects (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to flatten the job details
    return data?.map(item => ({
      ...item.marketplace_projects,
      saved_at: item.created_at,
      saved_job_id: item.id
    })) || [];
  } catch (error) {
    console.error('Error getting saved jobs with details:', error);
    throw error;
  }
};
