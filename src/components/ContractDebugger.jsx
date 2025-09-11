import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const ContractDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const { user } = useAuth();

  const checkData = async () => {
    try {
      console.log('Current user:', user);
      
      // Check users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .limit(5);
      
      // Check projects
      const { data: projects, error: projectsError } = await supabase
        .from('marketplace_projects')
        .select('id, title, client_user_id, freelancer_id, status')
        .limit(5);
      
      // Check proposals
      const { data: proposals, error: proposalsError } = await supabase
        .from('proposals')
        .select('id, project_id, freelancer_id, status')
        .limit(5);
      
      // Check contracts
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .limit(5);
      
      setDebugInfo({
        user,
        users: { data: users, error: usersError },
        projects: { data: projects, error: projectsError },
        proposals: { data: proposals, error: proposalsError },
        contracts: { data: contracts, error: contractsError }
      });
      
      console.log('Debug info:', {
        users: { data: users, error: usersError },
        projects: { data: projects, error: projectsError },
        proposals: { data: proposals, error: proposalsError },
        contracts: { data: contracts, error: contractsError }
      });
      
    } catch (error) {
      console.error('Error checking data:', error);
      setDebugInfo({ error: error.message });
    }
  };

  useEffect(() => {
    if (user) {
      checkData();
    }
  }, [user]);

  const createTestData = async () => {
    try {
      // Create test project
      const { data: project, error: projectError } = await supabase
        .from('marketplace_projects')
        .insert([{
          title: 'Test Project for Contract Debug',
          shortDescription: 'Test project to verify contract functionality',
          client_user_id: user.id,
          status: 'active',
          budgetMin: 1000000,
          budgetMax: 2000000,
          currency: 'VND'
        }])
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        return;
      }

      console.log('Created project:', project);

      // Create test proposal
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert([{
          project_id: project.id,
          freelancer_id: user.id, // Using same user as both client and freelancer for testing
          bid_amount: 1500000,
          timeline: '2 weeks',
          cover_letter: 'Test proposal for debugging',
          status: 'submitted'
        }])
        .select()
        .single();

      if (proposalError) {
        console.error('Error creating proposal:', proposalError);
        return;
      }

      console.log('Created proposal:', proposal);

      // Create test contract
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert([{
          project_id: project.id,
          proposal_id: proposal.id,
          client_id: user.id,
          freelancer_id: user.id, // Using same user for testing
          budget_amount: 1500000,
          currency: 'VND',
          status: 'active',
          contract_terms: 'Test contract for debugging'
        }])
        .select()
        .single();

      if (contractError) {
        console.error('Error creating contract:', contractError);
        return;
      }

      console.log('Created contract:', contract);
      
      // Refresh data
      checkData();
      
    } catch (error) {
      console.error('Error creating test data:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Contract Debugger</h2>
      
      <div className="mb-4">
        <button 
          onClick={checkData}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Refresh Data
        </button>
        <button 
          onClick={createTestData}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Test Data
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Current User:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.user, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Users ({debugInfo.users?.data?.length || 0}):</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.users, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Projects ({debugInfo.projects?.data?.length || 0}):</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.projects, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Proposals ({debugInfo.proposals?.data?.length || 0}):</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.proposals, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Contracts ({debugInfo.contracts?.data?.length || 0}):</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.contracts, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ContractDebugger;
