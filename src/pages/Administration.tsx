
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResetTicketNumbers } from '@/components/admin/ResetTicketNumbers';
import { ErrorLogList } from '@/components/admin/ErrorLogList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setupGlobalErrorHandling } from '@/lib/errorService';

const Administration = () => {
  useEffect(() => {
    // Inicializar el sistema de captura de errores
    setupGlobalErrorHandling();
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Administración</h1>
            <p className="text-gray-500">Gestión y configuración del sistema</p>
          </header>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="errors">Errores</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ajustes Generales</CardTitle>
                  <CardDescription>Configuración básica del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    Esta sección está en desarrollo. Próximamente podrá configurar aspectos generales del sistema.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tickets" className="space-y-6">
              <ResetTicketNumbers />
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-6">
              <ErrorLogList />
            </TabsContent>
            
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>Detalles técnicos y versión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-sm font-medium">Versión</h3>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-sm font-medium">Base de Datos</h3>
                    <p className="text-sm text-muted-foreground">Supabase PostgreSQL</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Administration;
