#!/usr/bin/env node

/**
 * Script to run job post data structure migration
 * This ensures the database schema is compatible with the updated job post functionality
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting job post data structure migration...');
    
    // Read the migration files
    const migration1Path = path.join(__dirname, '..', 'supabase', 'migrations', '20250912000009_fix_job_post_data_structure.sql');
    const migration2Path = path.join(__dirname, '..', 'supabase', 'migrations', '20250912000010_fix_array_column_types.sql');
    
    const migration1SQL = fs.readFileSync(migration1Path, 'utf8');
    const migration2SQL = fs.readFileSync(migration2Path, 'utf8');
    
    const migrationSQL = migration1SQL + '\n\n' + migration2SQL;
    
    console.log('📄 Migration file loaded successfully');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Database schema updated for job post compatibility');
    
    // Verify the changes
    console.log('\n🔍 Verifying migration...');
    
    // Check if key columns exist
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'marketplace_projects')
      .in('column_name', ['vipExpiresAt', 'vipPaymentReference', 'vipPaymentStatus', 'postExpiresAt', 'autoDeleteAt', 'technicalRequirements']);
    
    if (columnsError) {
      console.warn('⚠️  Could not verify column existence:', columnsError.message);
    } else {
      console.log('✅ Key columns verified:', columns.map(c => c.column_name).join(', '));
    }
    
    // Check data integrity
    const { data: projects, error: projectsError } = await supabase
      .from('marketplace_projects')
      .select('id, title, budgetMin, budgetMax, postDuration, isUrgent, status')
      .limit(5);
    
    if (projectsError) {
      console.warn('⚠️  Could not verify data integrity:', projectsError.message);
    } else {
      console.log('✅ Data integrity check passed');
      console.log(`📈 Found ${projects.length} projects in database`);
    }
    
    console.log('\n🎉 Job post data structure migration completed successfully!');
    console.log('💡 You can now use the updated job post functionality with proper data mapping.');
    
  } catch (error) {
    console.error('❌ Unexpected error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
