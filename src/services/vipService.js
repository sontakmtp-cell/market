// VIP Service Functions for JobCardVIP
// Add these functions to your existing jobService.js or create a new vipService.js

import { supabase } from '../lib/supabaseClient';

/**
 * Upgrade a project to VIP status
 * @param {number} projectId - The project ID
 * @param {number} feeAmount - VIP fee amount (default: 10000 VND)
 * @returns {Promise<Object>} Updated project data
 */
export const upgradeToVIP = async (projectId, feeAmount = 10000) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_projects')
      .update({
        displayType: 'vip',
        vipFeePaid: feeAmount,
        vipActivatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error upgrading project to VIP:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Downgrade a project from VIP to standard
 * @param {number} projectId - The project ID
 * @returns {Promise<Object>} Updated project data
 */
export const downgradeFromVIP = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_projects')
      .update({
        displayType: 'standard',
        vipFeePaid: 0,
        vipActivatedAt: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error downgrading project from VIP:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get VIP projects with sorting
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of VIP projects
 */
export const getVIPProjects = async (options = {}) => {
  try {
    let query = supabase
      .from('marketplace_projects')
      .select(`
        *,
        client:client_user_id (
          id,
          profiles (
            display_name,
            avatar_url
          )
        )
      `)
      .eq('displayType', 'vip')
      .eq('status', 'active');

    // Add sorting - VIP projects should appear first
    if (options.sortBy) {
      if (options.sortBy === 'newest') {
        query = query.order('vipActivatedAt', { ascending: false });
      } else if (options.sortBy === 'budget') {
        query = query.order('budgetMax', { ascending: false });
      }
    } else {
      // Default: sort by VIP activation time
      query = query.order('vipActivatedAt', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching VIP projects:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all projects with VIP projects sorted first
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of all projects with VIP first
 */
export const getAllProjectsWithVIPFirst = async (options = {}) => {
  try {
    let query = supabase
      .from('marketplace_projects')
      .select(`
        *,
        client:client_user_id (
          id,
          profiles (
            display_name,
            avatar_url
          )
        )
      `)
      .eq('status', 'active');

    // Sort VIP projects first, then by creation date
    query = query.order('displayType', { ascending: false }) // 'vip' comes before 'standard'
                 .order('vipActivatedAt', { ascending: false, nullsLast: true })
                 .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Check if user can upgrade project to VIP
 * @param {string} userId - User ID
 * @param {number} projectId - Project ID
 * @returns {Promise<boolean>} Whether user can upgrade
 */
export const canUpgradeToVIP = async (userId, projectId) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_projects')
      .select('client_user_id, displayType, status')
      .eq('id', projectId)
      .single();

    if (error) throw error;

    // User must be the project owner and project must be active and not already VIP
    return data.client_user_id === userId && 
           data.status === 'active' && 
           data.displayType !== 'vip';
  } catch (error) {
    console.error('Error checking VIP upgrade eligibility:', error);
    return false;
  }
};

/**
 * Get VIP statistics for admin/analytics
 * @returns {Promise<Object>} VIP statistics
 */
export const getVIPStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('marketplace_projects')
      .select('displayType, vipFeePaid, vipActivatedAt')
      .eq('displayType', 'vip');

    if (error) throw error;

    const stats = {
      totalVIPProjects: data.length,
      totalRevenue: data.reduce((sum, project) => sum + (project.vipFeePaid || 0), 0),
      thisMonth: data.filter(project => {
        const activatedDate = new Date(project.vipActivatedAt);
        const now = new Date();
        return activatedDate.getMonth() === now.getMonth() && 
               activatedDate.getFullYear() === now.getFullYear();
      }).length
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching VIP statistics:', error);
    return { success: false, error: error.message };
  }
};

// Export all functions
export const vipService = {
  upgradeToVIP,
  downgradeFromVIP,
  getVIPProjects,
  getAllProjectsWithVIPFirst,
  canUpgradeToVIP,
  getVIPStatistics
};
