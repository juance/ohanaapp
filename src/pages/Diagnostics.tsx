import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { runDatabaseDiagnostics } from '@/scripts/dbDiagnostic';
import { supabase } from '@/integrations/supabase/client';

const Diagnostics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [networkInfo, setNetworkInfo] = useState<{ ip: string; hostname: string } | null>(null);

  // Check Supabase connection
  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('ticket_sequence').select('*').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        setSupabaseStatus('error');
      } else {
        console.log('Supabase connection successful:', data);
        setSupabaseStatus('connected');
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
      setSupabaseStatus('error');
    }
  };

  // Get network information
  const getNetworkInfo = async () => {
    try {
      // This is a simple way to get the client's IP address
      // In a real application, you might want to use a more reliable method
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      setNetworkInfo({
        ip: data.ip,
        hostname: window.location.hostname
      });
    } catch (error) {
      console.error('Error getting network info:', error);
      setNetworkInfo({
        ip: 'Unknown',
        hostname: window.location.hostname
      });
    }
  };

  useEffect(() => {
    checkSupabaseConnection();
    getNetworkInfo();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const results = await runDatabaseDiagnostics();
      setDiagnosticResults(results);
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setDiagnosticResults({
        error: true,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestTicket = async () => {
    setIsLoading(true);
    try {
      // First, check if we have a customer
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);

      if (customerError) throw customerError;

      let customerId;
      if (customers && customers.length > 0) {
        customerId = customers[0].id;
      } else {
        // Create a test customer
        const { data: newCustomer, error: newCustomerError } = await supabase
          .from('customers')
          .insert({
            name: 'Test Customer',
            phone: '1234567890',
            loyalty_points: 0,
            valets_count: 0,
            free_valets: 0
          })
          .select('id')
          .single();

        if (newCustomerError) throw newCustomerError;
        customerId = newCustomer.id;
      }

      // Get the next ticket number
      const { data: sequenceData, error: sequenceError } = await supabase
        .from('ticket_sequence')
        .select('last_number')
        .eq('id', 1)
        .single();

      if (sequenceError) throw sequenceError;

      const nextNumber = (sequenceData.last_number || 0) + 1;
      const ticketNumber = nextNumber.toString().padStart(8, '0');

      // Update the sequence
      const { error: updateError } = await supabase
        .from('ticket_sequence')
        .update({ last_number: nextNumber })
        .eq('id', 1);

      if (updateError) throw updateError;

      // Create a test ticket
      const now = new Date().toISOString();
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ticket_number: ticketNumber,
          customer_id: customerId,
          total: 100,
          payment_method: 'cash',
          status: 'ready', // Set to ready so it appears in Pedidos Listos para Retirar
          date: now,
          created_at: now,
          updated_at: now,
          is_paid: false,
          is_canceled: false,
          valet_quantity: 1
        })
        .select('id')
        .single();

      if (ticketError) throw ticketError;

      // Add a test service
      const { error: serviceError } = await supabase
        .from('dry_cleaning_items')
        .insert({
          ticket_id: ticket.id,
          name: 'Test Service',
          price: 100,
          quantity: 1
        });

      if (serviceError) throw serviceError;

      alert('Test ticket created successfully!');
      runDiagnostics(); // Refresh diagnostics
    } catch (error) {
      console.error('Error creating test ticket:', error);
      alert(`Error creating test ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <h1 className="text-2xl font-bold mb-6">Diagnóstico del Sistema</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Conexión a Supabase</CardTitle>
                <CardDescription>Estado de la conexión a la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                {supabaseStatus === 'checking' && (
                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin text-blue-500" />
                    <span>Verificando conexión...</span>
                  </div>
                )}
                {supabaseStatus === 'connected' && (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Conectado correctamente</span>
                  </div>
                )}
                {supabaseStatus === 'error' && (
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    <span>Error de conexión</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={checkSupabaseConnection} disabled={isLoading}>
                  Verificar conexión
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Red</CardTitle>
                <CardDescription>Detalles de la conexión de red</CardDescription>
              </CardHeader>
              <CardContent>
                {networkInfo ? (
                  <div className="space-y-2">
                    <div>
                      <strong>IP:</strong> {networkInfo.ip}
                    </div>
                    <div>
                      <strong>Hostname:</strong> {networkInfo.hostname}
                    </div>
                    <div>
                      <strong>URL:</strong> {window.location.href}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin text-blue-500" />
                    <span>Obteniendo información de red...</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={getNetworkInfo} disabled={isLoading}>
                  Actualizar información
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Diagnóstico de Base de Datos</CardTitle>
              <CardDescription>Verifica la estructura de la base de datos y la existencia de tickets</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                  <span>Ejecutando diagnóstico...</span>
                </div>
              ) : diagnosticResults ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <strong className="mr-2">Estructura de la base de datos:</strong>
                    {diagnosticResults.structureOk ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center">
                    <strong className="mr-2">Tickets existentes:</strong>
                    {diagnosticResults.ticketsExist ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>

                  {!diagnosticResults.structureOk && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTitle>Problemas en la estructura de la base de datos</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2">
                          {diagnosticResults.missingTables.length > 0 && (
                            <div>
                              <strong>Tablas faltantes:</strong>
                              <ul className="list-disc pl-5">
                                {diagnosticResults.missingTables.map((table: string) => (
                                  <li key={table}>{table}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {diagnosticResults.missingColumns.length > 0 && (
                            <div className="mt-2">
                              <strong>Columnas faltantes:</strong>
                              <ul className="list-disc pl-5">
                                {diagnosticResults.missingColumns.map((col: any) => (
                                  <li key={`${col.table}-${col.column}`}>
                                    {col.table}.{col.column}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {!diagnosticResults.ticketsExist && (
                    <Alert className="mt-4">
                      <AlertTitle>No hay tickets en la base de datos</AlertTitle>
                      <AlertDescription>
                        No se encontraron tickets en la base de datos. Puedes crear un ticket de prueba para verificar que todo funciona correctamente.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center p-6">
                  <p>Haz clic en "Ejecutar diagnóstico" para verificar la base de datos.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={runDiagnostics} disabled={isLoading}>
                Ejecutar diagnóstico
              </Button>
              <Button onClick={createTestTicket} disabled={isLoading} variant="outline">
                Crear ticket de prueba
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solución de problemas</CardTitle>
              <CardDescription>Recomendaciones para solucionar problemas comunes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Si los tickets no aparecen en "Pedidos Listos para Retirar":</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Verifica que los tickets tengan el estado "ready" en la base de datos.</li>
                    <li>Asegúrate de que la conexión a Supabase funcione correctamente.</li>
                    <li>Comprueba que la estructura de la base de datos sea correcta.</li>
                    <li>Intenta crear un ticket de prueba desde esta página.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Si la aplicación no funciona en la red local:</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Asegúrate de que el servidor esté configurado para escuchar en todas las interfaces (0.0.0.0).</li>
                    <li>Verifica que no haya restricciones de CORS en Supabase.</li>
                    <li>Comprueba que el firewall no esté bloqueando las conexiones.</li>
                    <li>Intenta acceder usando la IP del servidor en lugar del nombre de host.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
