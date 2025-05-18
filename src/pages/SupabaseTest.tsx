
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, ExternalLink, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupabaseConnectionTest } from '@/components/admin/SupabaseConnectionTest';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Tooltip } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const SupabaseTest = () => {
  const navigate = useNavigate();
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({});
  const [isCheckingTables, setIsCheckingTables] = useState(false);
  const [overallHealth, setOverallHealth] = useState<number>(0);

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
    let healthScore = 0;
    
    for (const tableName of requiredTables) {
      try {
        // Use a type assertion to tell TypeScript that tableName is a valid table name
        // This is safe because we know these are valid table names in our schema
        const { count, error } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true });
        
        tableStatus[tableName] = !error;
        if (!error) healthScore += 1;
      } catch (error) {
        console.error(`Error checking table ${tableName}:`, error);
        tableStatus[tableName] = false;
      }
    }
    
    setTablesStatus(tableStatus);
    setOverallHealth((healthScore / requiredTables.length) * 100);
    setIsCheckingTables(false);
    
    // Show a toast message with the database health status
    if (healthScore === requiredTables.length) {
      toast.success("Todas las tablas requeridas están disponibles");
    } else {
      toast.warning(`Faltan ${requiredTables.length - healthScore} tablas requeridas`);
    }
  };

  const runDiagnostic = async () => {
    try {
      toast.info("Ejecutando diagnóstico completo...");
      
      // Verificar la conexión básica antes de continuar
      const { data: connectionTest, error: connectionError } = await supabase
        .from('ticket_sequence')
        .select('last_number')
        .limit(1);
        
      if (connectionError) {
        toast.error("Error de conexión con la base de datos");
        return;
      }
      
      // Ejecutar verificación de tablas
      await checkTablesExistence();
      
      // Verificar las funciones SQL esenciales
      try {
        const { data: funcTest, error: funcError } = await supabase
          .rpc('get_column_exists', {
            table_name: 'tickets',
            column_name: 'id'
          });
          
        if (funcError) {
          toast.error("Error verificando funciones RPC");
        } else {
          toast.success("Funciones RPC verificadas correctamente");
        }
      } catch (error) {
        console.error("Error verificando RPC:", error);
        toast.error("Error verificando funciones RPC");
      }
    } catch (error) {
      console.error("Error en diagnóstico:", error);
      toast.error("Error ejecutando diagnóstico");
    }
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Salud General de la Base de Datos
              </h2>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado de las tablas:</span>
                  <span className="text-sm font-medium">{Math.round(overallHealth)}%</span>
                </div>
                <Progress value={overallHealth} className="h-2" />
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={checkTablesExistence}
                    disabled={isCheckingTables}
                    className="flex items-center gap-1"
                  >
                    {isCheckingTables && <RefreshCw className="h-3 w-3 animate-spin" />}
                    <RefreshCw className={`h-3 w-3 ${isCheckingTables ? 'hidden' : ''}`} />
                    Verificar tablas
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={runDiagnostic}
                    disabled={isCheckingTables}
                    className="flex items-center gap-1"
                  >
                    {isCheckingTables && <RefreshCw className="h-3 w-3 animate-spin" />}
                    Diagnóstico completo
                  </Button>
                </div>
              </div>
            </div>
            
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
                      <div 
                        key={tableName} 
                        className={`flex items-center p-2 border rounded-md ${
                          tablesStatus[tableName] 
                            ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                            : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        {tablesStatus[tableName] ? (
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span className="font-medium">{tableName}</span>
                        <span className={`ml-auto text-sm ${
                          tablesStatus[tableName] 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {tablesStatus[tableName] ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={checkTablesExistence} 
                      size="sm" 
                      disabled={isCheckingTables}
                      className="flex items-center gap-1"
                    >
                      {isCheckingTables && <RefreshCw className="h-3 w-3 animate-spin" />}
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
