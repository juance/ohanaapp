// Script para monitorear el rendimiento de las consultas
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

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

// Función para medir el tiempo de ejecución de una consulta
const measureQueryTime = async (queryFn, name) => {
  console.log(`Ejecutando consulta: ${name}`);
  const start = performance.now();
  try {
    const result = await queryFn();
    const end = performance.now();
    const duration = end - start;
    console.log(`Consulta "${name}" completada en ${duration.toFixed(2)}ms`);
    console.log(`Resultados: ${result.count || (result.data ? result.data.length : 0)} registros`);
    return { name, duration, success: true, count: result.count || (result.data ? result.data.length : 0) };
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    console.error(`Error en consulta "${name}": ${error.message}`);
    return { name, duration, success: false, error: error.message };
  }
};

// Consultas a medir
const runPerformanceTests = async () => {
  const results = [];

  // 1. Consulta de tickets listos para recoger usando la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*, customers(id, name, phone)', { count: 'exact' })
      .eq('status', 'ready')
      .eq('is_canceled', false);
  }, 'Tickets listos para recoger (con relación)'));

  // 2. Consulta de tickets listos para recoger sin usar la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('status', 'ready')
      .eq('is_canceled', false);
  }, 'Tickets listos para recoger (sin relación)'));

  // 3. Consulta de tickets pendientes usando la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*, customers(id, name, phone)', { count: 'exact' })
      .in('status', ['pending', 'processing'])
      .eq('is_canceled', false);
  }, 'Tickets pendientes (con relación)'));

  // 4. Consulta de tickets pendientes sin usar la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .in('status', ['pending', 'processing'])
      .eq('is_canceled', false);
  }, 'Tickets pendientes (sin relación)'));

  // 5. Consulta de tickets entregados usando la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*, customers(id, name, phone)', { count: 'exact' })
      .eq('status', 'delivered')
      .eq('is_canceled', false);
  }, 'Tickets entregados (con relación)'));

  // 6. Consulta de tickets entregados sin usar la relación
  results.push(await measureQueryTime(async () => {
    return await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('status', 'delivered')
      .eq('is_canceled', false);
  }, 'Tickets entregados (sin relación)'));

  // 7. Consulta de tickets por cliente usando la relación
  results.push(await measureQueryTime(async () => {
    // Primero obtener un cliente aleatorio
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
      .single();

    if (!customer) {
      throw new Error('No se encontró ningún cliente');
    }

    return await supabase
      .from('tickets')
      .select('*, customers(id, name, phone)', { count: 'exact' })
      .eq('customer_id', customer.id)
      .eq('is_canceled', false);
  }, 'Tickets por cliente (con relación)'));

  // 8. Consulta de tickets por cliente sin usar la relación
  results.push(await measureQueryTime(async () => {
    // Primero obtener un cliente aleatorio
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
      .single();

    if (!customer) {
      throw new Error('No se encontró ningún cliente');
    }

    return await supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('customer_id', customer.id)
      .eq('is_canceled', false);
  }, 'Tickets por cliente (sin relación)'));

  // Guardar resultados en un archivo
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const resultsPath = path.join(__dirname, `../performance_results_${timestamp}.json`);
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log('\nResumen de resultados:');
  console.log('=====================');
  
  // Mostrar resultados ordenados por tiempo de ejecución
  results.sort((a, b) => a.duration - b.duration);
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}: ${result.duration.toFixed(2)}ms (${result.success ? 'Éxito' : 'Error'})`);
  });
  
  console.log(`\nResultados guardados en: ${resultsPath}`);
};

// Ejecutar las pruebas de rendimiento
runPerformanceTests().catch(error => {
  console.error('Error ejecutando pruebas de rendimiento:', error);
  process.exit(1);
});
