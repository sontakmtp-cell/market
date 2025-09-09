// Debug script for proposals issues
import { supabase } from './src/lib/supabaseClient.js';

async function debugProposals() {
  console.log('🔍 Debugging Proposals Issues...\n');

  try {
    // Test 1: Check Supabase connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('proposals')
      .select('count(*)')
      .limit(1);

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      console.error('Full error:', connectionError);
      return;
    }
    console.log('✅ Supabase connection successful');

    // Test 2: Check table structure
    console.log('\n2️⃣ Checking proposals table structure...');
    const { data: tableData, error: tableError } = await supabase
      .from('proposals')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table access failed:', tableError.message);
      console.error('Full error:', tableError);
      return;
    }
    console.log('✅ Proposals table accessible');
    console.log('Sample data structure:', tableData?.[0] || 'No data yet');

    // Test 3: Check auth state
    console.log('\n3️⃣ Checking authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth check failed:', authError.message);
      return;
    }
    
    if (authData.session) {
      console.log('✅ User authenticated:', authData.session.user.email);
    } else {
      console.log('⚠️ No authenticated user');
    }

    // Test 4: Test insert (with mock data)
    console.log('\n4️⃣ Testing proposal insertion...');
    const mockProposal = {
      project_id: 'test-project-123',
      freelancer_id: authData.session?.user?.id || 'test-user-id',
      bid_amount: 100000,
      timeline: '1 month',
      cover_letter: 'Test proposal for debugging',
      status: 'submitted'
    };

    console.log('Mock proposal:', mockProposal);
    console.log('✅ Insert test prepared (not executing to avoid test data)');

    console.log('\n🎉 Debug completed! Check the logs above for issues.');

  } catch (error) {
    console.error('❌ Unexpected error during debug:', error);
  }
}

debugProposals();
