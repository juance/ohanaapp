// Script para añadir la relación de clave foránea entre tickets y customers
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

async function addForeignKey() {
  try {
    console.log('Añadiendo relación de clave foránea entre tickets y customers...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../supabase/migrations/20250416_add_foreign_key_constraint.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error añadiendo relación de clave foránea:', error);
      process.exit(1);
    }
    
    console.log('Relación de clave foránea añadida correctamente');
    console.log('Resultado:', data);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addForeignKey();
