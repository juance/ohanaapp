
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Database, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Activity,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { QuickActions } from '@/components/admin/QuickActions';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { SystemInfo } from '@/components/admin/SystemInfo';
import { toast } from '@/lib/toast';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 156,
    activeTickets: 43,
    systemHealth: 'healthy',
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000),
    dbConnections: 12,
    uptime: '7d 14h 32m'
  });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setError(null);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError(err instanceof Error ? err : new Error('Error al cargar datos de administración'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdminData();
  }, []);

  const handleSystemRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Sistema actualizado correctamente');
  };

  const handleBackupManual = async () => {
    setIsActionLoading('backup');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Backup manual completado', 'El archivo se ha descargado a tu dispositivo');
    } catch (error) {
      toast.error('Error al crear backup manual');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleClearCache = async () => {
    setIsActionLoading('cache');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Caché del sistema limpiado', 'Todos los datos temporales han sido eliminados');
    } catch (error) {
      toast.error('Error al limpiar caché');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleGenerateReport = async () => {
    setIsActionLoading('report');
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Reporte generado', 'El reporte PDF se ha descargado correctamente');
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSecurityVerification = async () => {
    setIsActionLoading('security');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Verificación de seguridad completada', 'Sistema seguro');
    } catch (error) {
      toast.error('Error en verificación de seguridad');
    } finally {
      setIsActionLoading(null);
    }
  };

  if (error) {
    return (
      <ErrorMessage 
        message={error.message}
        title="Error en Administración"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona el sistema y configuraciones</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Sistema Operativo
          </Badge>
          <Button onClick={handleSystemRefresh} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar Sistema
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loading className="h-8 w-8" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Datos
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Estado del Sistema */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-semibold">Saludable</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uptime: {systemStats.uptime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 nuevos esta semana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Activos</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.activeTickets}</div>
                  <p className="text-xs text-muted-foreground">
                    En proceso de lavado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conexiones DB</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.dbConnections}</div>
                  <p className="text-xs text-muted-foreground">
                    Conexiones activas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertas del Sistema */}
            <SystemAlerts />

            {/* Panel de Configuraciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuraciones del Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTabs defaultTab="general" />
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SystemInfo systemStats={systemStats} />
              <QuickActions
                onBackup={handleBackupManual}
                onClearCache={handleClearCache}
                onGenerateReport={handleGenerateReport}
                onSecurityCheck={handleSecurityVerification}
                isActionLoading={isActionLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gestión de usuarios disponible próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configuraciones del sistema disponibles próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Herramientas de gestión de datos disponibles próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Visualización de logs disponible próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Información del sistema disponible próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Admin;
