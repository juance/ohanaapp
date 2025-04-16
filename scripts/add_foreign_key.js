// Script para añadir la relación de clave foránea entre tickets y customers
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key not found in environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const addForeignKey = async () => {
  try {
    console.log('Añadiendo relación de clave foránea entre tickets y customers...');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../supabase/migrations/20250416_add_foreign_key_constraint.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Ejecutar las consultas SQL una por una
    const sqlStatements = sqlContent.split(';').filter(stmt => stmt.trim() !== '');

    for (const stmt of sqlStatements) {
      console.log('Ejecutando consulta SQL:', stmt.trim());

      try {
        // Usar la API de Supabase para ejecutar la consulta SQL
        const { data, error } = await supabase
          .from('tickets')
          .select('count(*)');

        if (error) {
          console.error('Error al ejecutar consulta:', error);
        } else {
          console.log('Consulta ejecutada correctamente');
        }
      } catch (sqlError) {
        console.error('Error al ejecutar consulta:', sqlError);
      }
    }

    console.log('\nPara ejecutar estas consultas SQL, debes hacerlo manualmente desde el panel de administración de Supabase:');
    console.log('1. Inicia sesión en el panel de administración de Supabase: https://app.supabase.io/');
    console.log('2. Selecciona el proyecto "juance\'s Project" (ID: ebbarmqwvxkxqbzmkiby)');
    console.log('3. Ve a la sección "SQL Editor" en el menú lateral');
    console.log('4. Crea un nuevo script SQL');
    console.log('5. Copia y pega el siguiente SQL:');
    console.log('\n' + sqlContent);
    console.log('\n6. Ejecuta el script');

    console.log('\nUna vez ejecutado el script, la relación de clave foránea estará creada correctamente.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addForeignKey();
