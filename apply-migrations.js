
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to apply migrations to Supabase
function applyMigrations() {
  try {
    console.log('Applying migrations to Supabase...');
    
    // Check if Supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'inherit' });
    } catch (error) {
      console.error('Supabase CLI is not installed. Please install it first.');
      console.log('You can install it with: npm install -g supabase');
      process.exit(1);
    }
    
    // Apply migrations
    execSync('supabase db push', { stdio: 'inherit' });
    
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error.message);
    process.exit(1);
  }
}

// Run the function
applyMigrations();
