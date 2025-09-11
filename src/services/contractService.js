// Service for handling contract operations
import { supabase } from '../lib/supabaseClient';

export const contractService = {
  // Get active contracts for a user based on their current role
  async getActiveContractsByRole(userId, role) {
    try {
      if (!userId || !role) {
        throw new Error('User ID and role are required');
      }

      // Build base query
      const baseQuery = supabase
        .from('contracts')
        .select(`
          *,
          marketplace_projects (
            id,
            title,
            shortDescription,
            fullDescription,
            category,
            skills,
            deadline,
            client,
            attachments,
            isUrgent,
            client_user_id,
            freelancer_id,
            budgetMin,
            budgetMax,
            currency,
            status
          ),
          proposals (
            id,
            bid_amount,
            timeline,
            cover_letter,
            created_at
          )
        `)
        .eq('status', 'active');

      // Apply role-based filtering
      let query;
      if (role === 'client') {
        query = baseQuery.eq('client_id', userId);
      } else if (role === 'freelancer') {
        query = baseQuery.eq('freelancer_id', userId);
      } else {
        throw new Error('Invalid role. Must be "client" or "freelancer"');
      }

      // Execute query
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching contracts:', error);
        return { data: [], error: error.message };
      }

      // Additional validation
      const validContracts = (data || []).filter(contract => {
        return contract && 
          contract.status === 'active' && 
          ((role === 'client' && contract.client_id === userId) ||
           (role === 'freelancer' && contract.freelancer_id === userId));
      });

      return { data: validContracts, error: null };
    } catch (error) {
      console.error('Unexpected error in getActiveContractsByRole:', error);
      return { data: [], error: error.message };
    }
  },
  // Get active contracts for a freelancer
  async getFreelancerActiveContracts(freelancerId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          marketplace_projects (
            id,
            title,
            shortDescription,
            fullDescription,
            category,
            skills,
            deadline,
            client,
            attachments,
            isUrgent
          )
        `)
        .eq('freelancer_id', freelancerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching freelancer contracts:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error fetching freelancer contracts:', error);
      return { data: [], error };
    }
  },

  // Get active contracts for a client
  async getClientActiveContracts(clientId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          marketplace_projects (
            id,
            title,
            shortDescription,
            fullDescription,
            category,
            skills,
            deadline,
            client,
            attachments,
            isUrgent
          ),
          profiles (
            id,
            display_name,
            avatar_url,
            bio,
            role_profiles
          )
        `)
        .eq('client_id', clientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client contracts:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error fetching client contracts:', error);
      return { data: [], error };
    }
  },

  // Update contract progress
  async updateContractProgress(contractId, progress, userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating contract progress:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating contract progress:', error);
      return { data: null, error };
    }
  },

  // Complete contract
  async completeContract(contractId, userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          status: 'completed',
          progress: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
        .select('*')
        .single();

      if (error) {
        console.error('Error completing contract:', error);
        return { data: null, error };
      }

      // Also update the project status
      if (data && data.project_id) {
        await supabase
          .from('marketplace_projects')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', data.project_id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error completing contract:', error);
      return { data: null, error };
    }
  },

  // Cancel contract
  async cancelContract(contractId, userId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          status: 'cancelled',
          contract_terms: `${reason ? `Lý do hủy: ${reason}. ` : ''}Hợp đồng đã được hủy bỏ.`,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
        .select('*')
        .single();

      if (error) {
        console.error('Error cancelling contract:', error);
        return { data: null, error };
      }

      // Also update the project status
      if (data && data.project_id) {
        await supabase
          .from('marketplace_projects')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', data.project_id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error cancelling contract:', error);
      return { data: null, error };
    }
  },

  // Get contract details
  async getContractDetails(contractId, userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          marketplace_projects (
            id,
            title,
            shortDescription,
            fullDescription,
            category,
            skills,
            deadline,
            client,
            attachments,
            isUrgent,
            deliverables,
            objectives,
            technicalRequirements
          )
        `)
        .eq('id', contractId)
        .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
        .single();

      if (error) {
        console.error('Error fetching contract details:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching contract details:', error);
      return { data: null, error };
    }
  },

  // Accept a proposal and create a contract
  async acceptProposalAndCreateContract(projectId, proposalId, clientId) {
    try {
      if (!projectId || !proposalId || !clientId) {
        throw new Error('Project ID, Proposal ID, and Client ID are required');
      }

      // 1. Get the proposal details
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .eq('project_id', projectId)
        .single();

      if (proposalError) {
        console.error('Error fetching proposal:', proposalError);
        return { data: null, error: 'Proposal not found or does not belong to this project' };
      }

      // 2. Get project details for contract creation
      const { data: project, error: projectError } = await supabase
        .from('marketplace_projects')
        .select('deadline, currency, title, deliverables')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        return { data: null, error: 'Project not found' };
      }

      // 3. Create the contract
      const contractData = {
        project_id: projectId,
        proposal_id: proposalId,
        client_id: clientId,
        freelancer_id: proposal.freelancer_id,
        budget_amount: proposal.bid_amount,
        currency: project.currency || 'VND',
        deadline: project.deadline,
        contract_terms: `Hợp đồng cho dự án: ${project.title}`,
        milestones: project.deliverables?.map(d => ({
          name: d,
          completed: false,
          due_date: null
        })) || [],
        deliverables: project.deliverables || [],
        payment_terms: {
          method: 'milestone',
          currency: project.currency || 'VND'
        }
      };

      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();

      if (contractError) {
        console.error('Error creating contract:', contractError);
        return { data: null, error: 'Failed to create contract' };
      }

      // 4. Update the accepted proposal status
      const { error: updateProposalError } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', proposalId);

      if (updateProposalError) {
        console.error('Error updating proposal status:', updateProposalError);
        // Continue even if this fails, but log the error
      }

      // 5. Update the project status and assign freelancer
      const { error: updateProjectError } = await supabase
        .from('marketplace_projects')
        .update({ 
          status: 'in_progress',
          freelancer_id: proposal.freelancer_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateProjectError) {
        console.error('Error updating project status:', updateProjectError);
        // Continue even if this fails, but log the error
      }

      // 6. Reject all other proposals for this project
      const { error: rejectOthersError } = await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .eq('project_id', projectId)
        .neq('id', proposalId);

      if (rejectOthersError) {
        console.error('Error rejecting other proposals:', rejectOthersError);
        // Continue even if this fails, but log the error
      }

      return {
        data: {
          contract,
          message: 'Proposal accepted and contract created successfully'
        },
        error: null
      };
    } catch (error) {
      console.error('Unexpected error accepting proposal and creating contract:', error);
      return { data: null, error: error.message || 'Unexpected error occurred' };
    }
  },

  // Create a new contract manually (if needed)
  async createContract(projectId, proposalId, clientId, freelancerId, contractData = {}) {
    try {
      if (!projectId || !proposalId || !clientId || !freelancerId) {
        throw new Error('Project ID, Proposal ID, Client ID, and Freelancer ID are required');
      }

      // Get proposal details for budget amount
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select('bid_amount, timeline')
        .eq('id', proposalId)
        .single();

      if (proposalError) {
        console.error('Error fetching proposal:', proposalError);
        return { data: null, error: 'Proposal not found' };
      }

      // Get project details for deadline and other info
      const { data: project, error: projectError } = await supabase
        .from('marketplace_projects')
        .select('deadline, currency, title, deliverables')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        return { data: null, error: 'Project not found' };
      }

      // Prepare contract data
      const newContractData = {
        project_id: projectId,
        proposal_id: proposalId,
        client_id: clientId,
        freelancer_id: freelancerId,
        budget_amount: proposal.bid_amount,
        currency: project.currency || 'VND',
        deadline: project.deadline,
        contract_terms: contractData.contract_terms || `Hợp đồng cho dự án: ${project.title}`,
        milestones: contractData.milestones || (project.deliverables?.map(d => ({
          name: d,
          completed: false,
          due_date: null
        })) || []),
        deliverables: contractData.deliverables || project.deliverables || [],
        payment_terms: contractData.payment_terms || {
          method: 'milestone',
          currency: project.currency || 'VND'
        },
        ...contractData
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert([newContractData])
        .select()
        .single();

      if (error) {
        console.error('Error creating contract:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error creating contract:', error);
      return { data: null, error };
    }
  }
};
