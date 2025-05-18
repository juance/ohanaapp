
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupabaseConnectionTest } from '@/components/admin/SupabaseConnectionTest';
import { supabase } from '@/integrations/supabase/client';

const SupabaseTest = () => {
  const navigate = useNavigate();
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({});
  const [isCheckingTables, setIsCheckingTables] = useState(false);

  // Lista expandida de tablas requeridas, incluyendo las nuevas
  const requiredTables = [
    'customers', 
    'tickets', 
    'ticket_sequence', 
    'dry_cleaning_items', 
    'ticket_laundry_options',
    'expenses',
    'inventory_items',
    'analytics_data',
    'customer_feedback',
    'dashboard_stats'
  ];

  useEffect(() => {
    checkTablesExistence();
  }, []);

  const checkTablesExistence = async () => {
    setIsCheckingTables(true);
    const tableStatus: Record<string, boolean> = {};
    
    for (const tableName of requiredTables) {
      try {
        // Use a type assertion to tell TypeScript that tableName is a valid table name
        // This is safe because we know these are valid table names in our schema
        const { count, error } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true });
        
        tableStatus[tableName] = !error;
      } catch (error) {
        console.error(`Error checking table ${tableName}:`, error);
        tableStatus[tableName] = false;
      }
    }
    
    setTablesStatus(tableStatus);
    setIsCheckingTables(false);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
            <h1 className="text-2xl font-bold">Diagnóstico de Supabase (Ohana)</h1>
            <div className="w-24"></div> {/* Spacer para mantener el título centrado */}
          </div>

          <div className="space-y-6">
            <SupabaseConnectionTest />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Estado de las Tablas
              </h2>
              {isCheckingTables ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Verificando tablas...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {requiredTables.map(tableName => (
                      <div key={tableName} className="flex items-center p-2 border rounded-md">
                        <div className={`w-3 h-3 rounded-full mr-2 ${tablesStatus[tableName] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium">{tableName}</span>
                        <span className="ml-auto text-sm text-gray-500">
                          {tablesStatus[tableName] ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button onClick={checkTablesExistence} size="sm">
                      Actualizar estado de tablas
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h2 className="text-xl font-semibold text-amber-700 mb-2">Información sobre la migración a Ohana</h2>
              <p className="text-amber-800 mb-3">
                Se han creado las siguientes tablas en el nuevo proyecto de Supabase "Ohana":
              </p>
              <ul className="list-disc pl-5 space-y-2 text-amber-800">
                <li>customers: Para almacenar información de clientes</li>
                <li>tickets: Para los tickets de servicio</li>
                <li>ticket_sequence: Para la secuencia de números de ticket</li>
                <li>dry_cleaning_items: Para los artículos de tintorería</li>
                <li>ticket_laundry_options: Para las opciones de lavandería</li>
                <li>expenses: Para registrar gastos</li>
                <li>inventory_items: Para gestionar el inventario</li>
                <li>analytics_data: Para métricas y análisis de datos</li>
                <li>customer_feedback: Para comentarios de clientes</li>
                <li>dashboard_stats: Para estadísticas del dashboard</li>
              </ul>
              <p className="mt-3 text-amber-800">
                También se han creado las funciones necesarias y los índices para mejorar el rendimiento de las consultas.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Enlaces útiles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a 
                  href="https://app.supabase.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <span className="mr-1">Panel de Supabase</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://app.supabase.com/project/ebbarmqwvxkxqbzmkiby/editor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <span className="mr-1">Editor SQL</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://app.supabase.com/project/ebbarmqwvxkxqbzmkiby/database/tables" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <span className="mr-1">Tablas de la base de datos</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
