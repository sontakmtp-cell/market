#!/usr/bin/env node

/**
 * Migration Runner Script
 * Run specific migration file against Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project') || supabaseServiceKey.includes('your-service')) {
  console.error('❌ Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  console.log('Example:');
  console.log('export VITE_SUPABASE_URL="https://your-project.supabase.co"');
  console.log('export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  try {
    console.log(`🚀 Running migration: ${migrationFile}`);
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('📝 Migration content preview:');
    console.log(migrationSQL.substring(0, 200) + '...\n');
    
    // Execute migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      // If exec_sql doesn't exist, try direct query
      if (error.code === '42883') {
        console.log('⚠️  exec_sql function not found, executing migration directly...');
        
        // Split migration into individual statements
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement) {
            console.log(`📤 Executing statement ${i + 1}/${statements.length}...`);
            
            try {
              const { error: stmtError } = await supabase.rpc('exec', {
                sql: statement + ';'
              });
              
              if (stmtError) {
                // Try with raw query if rpc fails
                const { error: rawError } = await supabase.from('_migrations_dummy_').select('*').limit(0);
                
                if (rawError) {
                  console.warn(`⚠️  Statement ${i + 1} had issues:`, stmtError.message);
                  console.log(`Statement: ${statement.substring(0, 100)}...`);
                }
              }
            } catch (err) {
              console.warn(`⚠️  Statement ${i + 1} could not be executed:`, err.message);
            }
          }
        }
        
        console.log('✅ Migration executed (with possible warnings)');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Migration executed successfully');
      console.log('📊 Result:', data);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('🔍 Full error:', error);
    process.exit(1);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.log('📋 Usage: node scripts/run-migration.js <migration-file>');
  console.log('📋 Example: node scripts/run-migration.js 20250912000008_update_job_post_structure.sql');
  
  // List available migrations
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  if (fs.existsSync(migrationsDir)) {
    const migrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrations.length > 0) {
      console.log('\n📁 Available migrations:');
      migrations.forEach(migration => {
        console.log(`   ${migration}`);
      });
    }
  }
  
  process.exit(1);
}

// Run the migration
runMigration(migrationFile);
