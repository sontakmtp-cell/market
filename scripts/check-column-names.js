#!/usr/bin/env node

/**
 * Script to check actual column names in marketplace_projects table
 * This helps identify naming inconsistencies
 */

const { createClient } = require('@supabase/supabase-js');

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

async function checkColumnNames() {
  try {
    console.log('🔍 Checking column names in marketplace_projects table...\n');
    
    // Query information_schema to get actual column names
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'marketplace_projects')
      .eq('table_schema', 'public')
      .order('ordinal_position');
    
    if (error) {
      console.error('❌ Failed to fetch column information:', error.message);
      return;
    }
    
    console.log('📋 Column names in marketplace_projects table:');
    console.log('=' .repeat(60));
    
    const camelCaseColumns = [];
    const snakeCaseColumns = [];
    const otherColumns = [];
    
    columns.forEach(col => {
      const name = col.column_name;
      const type = col.data_type;
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultValue = col.column_default ? `DEFAULT ${col.column_default}` : '';
      
      console.log(`${name.padEnd(25)} | ${type.padEnd(15)} | ${nullable.padEnd(8)} | ${defaultValue}`);
      
      // Categorize column names
      if (name.includes('_')) {
        snakeCaseColumns.push(name);
      } else if (name.match(/[a-z][A-Z]/)) {
        camelCaseColumns.push(name);
      } else {
        otherColumns.push(name);
      }
    });
    
    console.log('\n📊 Column naming analysis:');
    console.log('=' .repeat(40));
    console.log(`🐪 camelCase columns (${camelCaseColumns.length}):`, camelCaseColumns.join(', '));
    console.log(`🐍 snake_case columns (${snakeCaseColumns.length}):`, snakeCaseColumns.join(', '));
    console.log(`❓ other columns (${otherColumns.length}):`, otherColumns.join(', '));
    
    // Check for potential issues
    console.log('\n⚠️  Potential naming issues:');
    console.log('=' .repeat(40));
    
    const problematicColumns = [];
    
    // Check for mixed naming conventions
    if (camelCaseColumns.length > 0 && snakeCaseColumns.length > 0) {
      console.log('❌ Mixed naming conventions detected!');
      console.log('   Consider standardizing to either camelCase or snake_case');
      problematicColumns.push('mixed_naming');
    }
    
    // Check for specific problematic columns
    const knownIssues = [
      'displayType', 'vipPaymentStatus', 'postDuration', 
      'vipActivatedAt', 'vipExpiresAt', 'postExpiresAt', 'autoDeleteAt'
    ];
    
    knownIssues.forEach(col => {
      if (columns.find(c => c.column_name === col)) {
        console.log(`✅ ${col} exists`);
      } else {
        console.log(`❌ ${col} missing`);
        problematicColumns.push(`missing_${col}`);
      }
    });
    
    // Test actual queries
    console.log('\n🧪 Testing actual queries:');
    console.log('=' .repeat(40));
    
    try {
      // Test camelCase query
      const { data: camelData, error: camelError } = await supabase
        .from('marketplace_projects')
        .select('displayType, vipPaymentStatus, postDuration')
        .limit(1);
      
      if (camelError) {
        console.log('❌ camelCase query failed:', camelError.message);
      } else {
        console.log('✅ camelCase query successful');
      }
    } catch (e) {
      console.log('❌ camelCase query exception:', e.message);
    }
    
    try {
      // Test quoted query
      const { data: quotedData, error: quotedError } = await supabase
        .from('marketplace_projects')
        .select('"displayType", "vipPaymentStatus", "postDuration"')
        .limit(1);
      
      if (quotedError) {
        console.log('❌ quoted query failed:', quotedError.message);
      } else {
        console.log('✅ quoted query successful');
      }
    } catch (e) {
      console.log('❌ quoted query exception:', e.message);
    }
    
    console.log('\n💡 Recommendations:');
    console.log('=' .repeat(40));
    
    if (problematicColumns.length === 0) {
      console.log('✅ No major naming issues detected');
    } else {
      console.log('🔧 Issues to fix:');
      problematicColumns.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    console.log('\n🎯 Next steps:');
    console.log('1. Review the column names above');
    console.log('2. Update migration files to use consistent naming');
    console.log('3. Update application code to match database schema');
    console.log('4. Test all queries after changes');
    
  } catch (error) {
    console.error('❌ Script failed with error:', error);
    process.exit(1);
  }
}

// Run the check
checkColumnNames();
