// Script to apply RLS policies to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key not found in environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyRLSPolicies() {
  try {
    console.log('Applying RLS policies to Supabase...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../supabase/migrations/20250415_enable_public_access.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error applying RLS policies:', error);
      process.exit(1);
    }
    
    console.log('RLS policies applied successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyRLSPolicies();
