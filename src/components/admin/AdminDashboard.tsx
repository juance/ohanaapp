
import React, { useState } from 'react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Users, 
  ClipboardList, 
  Settings, 
  TrendingUp, 
  BarChart4, 
  Bell, 
  Award, 
  Languages,
  Upload
} from 'lucide-react';
import { cacheService } from '@/lib/cacheService';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { FileUploader } from './FileUploader';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [cacheStats, setCacheStats] = useState(cacheService.getStats());

  const handleClearCache = () => {
    cacheService.clear();
    setCacheStats(cacheService.getStats());
    toast.success('Caché limpiado correctamente');
  };

  const handleRefreshCacheStats = () => {
    setCacheStats(cacheService.getStats());
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="files">Archivos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                    Caché del Sistema
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cacheStats.size} entradas</div>
                <p className="text-xs text-muted-foreground">
                  Elementos en caché para mejorar rendimiento
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleClearCache}>
                    Limpiar Caché
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleRefreshCacheStats}>
                    Actualizar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    Gestión de Usuarios
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Usuarios</div>
                <p className="text-xs text-muted-foreground">
                  Administra usuarios y roles
                </p>
                <div className="mt-4">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("users")}>
                    Gestionar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center">
                    <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                    Tickets y Servicios
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Configuración</div>
                <p className="text-xs text-muted-foreground">
                  Configura tickets y servicios
                </p>
                <div className="mt-4">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("tickets")}>
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Funciones del Sistema</CardTitle>
              <CardDescription>
                Administra todos los aspectos de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium">Análisis de ventas</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Visualiza tendencias y evolución de ventas a lo largo del tiempo
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <BarChart4 className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium">Métricas avanzadas</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Accede a métricas detalladas del negocio
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-amber-100 p-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-sm font-medium">Notificaciones</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Configura notificaciones push para los clientes
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-medium">Sistema de lealtad</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Configura programas de fidelización y descuentos
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-indigo-100 p-2">
                      <Languages className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-medium">Idiomas</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Configura soporte para múltiples idiomas
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-slate-100 p-2">
                      <Settings className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-medium">Configuración avanzada</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Ajustes avanzados del sistema
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <section className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Archivos</CardTitle>
                  <CardDescription>
                    Sube y administra archivos e imágenes del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm font-medium">
                      Arrastra y suelta archivos o haz clic para explorar
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Soporta imágenes JPG, PNG y documentos PDF
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Explorar archivos
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <FileUploader />
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="settings">
          <AdminTabs defaultTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
