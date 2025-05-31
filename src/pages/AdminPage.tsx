
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { backupService } from '@/lib/services/backupService';
import { reportService } from '@/lib/services/reportService';
import { securityService, SecurityReport } from '@/lib/services/securityService';
import { cacheService } from '@/lib/cacheService';
import { toast } from '@/lib/toast';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeTickets: 0,
    systemHealth: 'healthy',
    lastBackup: new Date(),
    dbConnections: 12,
    uptime: '7d 14h 32m'
  });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        
        // Simular carga de datos del sistema
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular datos del sistema
        setSystemStats({
          totalUsers: 156,
          activeTickets: 43,
          systemHealth: 'healthy',
          lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          dbConnections: 12,
          uptime: '7d 14h 32m'
        });
        
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
      await backupService.downloadBackup();
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
      cacheService.clear();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular tiempo de limpieza
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
      const report = await reportService.generateSystemReport();
      if (report) {
        await reportService.downloadReportAsPDF(report);
        toast.success('Reporte generado', 'El reporte PDF se ha descargado correctamente');
      }
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSecurityVerification = async () => {
    setIsActionLoading('security');
    try {
      const report = await securityService.runSecurityVerification();
      if (report) {
        setSecurityReport(report);
        const statusText = report.overallStatus === 'secure' ? 'Sistema seguro' 
          : report.overallStatus === 'warning' ? 'Advertencias encontradas'
          : 'Problemas críticos detectados';
        
        toast.success('Verificación de seguridad completada', statusText);
      }
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestión completa del sistema y configuraciones avanzadas
          </p>
        </div>
        <Button onClick={handleSystemRefresh} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar Sistema
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loading className="h-8 w-8" />
        </div>
      ) : (
        <>
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

          {/* Reporte de Seguridad */}
          {securityReport && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Reporte de Seguridad</span>
                  <Badge variant={securityReport.overallStatus === 'secure' ? 'outline' : 'destructive'}>
                    {securityReport.overallStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{securityReport.summary.passed}</div>
                    <div className="text-sm text-muted-foreground">Verificaciones Pasadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{securityReport.summary.warnings}</div>
                    <div className="text-sm text-muted-foreground">Advertencias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{securityReport.summary.failed}</div>
                    <div className="text-sm text-muted-foreground">Fallos</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {securityReport.checks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{securityService.getCheckStatusIcon(check.status)} {check.name}</span>
                      <span className="text-sm text-muted-foreground">{check.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alertas y Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Alertas del Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Backup programado para esta noche</span>
                  </div>
                  <Badge variant="outline">Programado</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Última actualización de seguridad aplicada</span>
                  </div>
                  <Badge variant="outline">Completado</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Todas las políticas de seguridad activas</span>
                  </div>
                  <Badge variant="outline">Activo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

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
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Versión del Sistema</span>
                  <span className="text-sm font-medium">v2.1.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Último Backup</span>
                  <span className="text-sm font-medium">
                    {systemStats.lastBackup.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Espacio Usado</span>
                  <span className="text-sm font-medium">2.3 GB / 10 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rendimiento</span>
                  <Badge variant="outline" className="text-green-600">Excelente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleBackupManual}
                  disabled={isActionLoading === 'backup'}
                >
                  <Database className={`h-4 w-4 mr-2 ${isActionLoading === 'backup' ? 'animate-spin' : ''}`} />
                  {isActionLoading === 'backup' ? 'Creando Backup...' : 'Realizar Backup Manual'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleClearCache}
                  disabled={isActionLoading === 'cache'}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isActionLoading === 'cache' ? 'animate-spin' : ''}`} />
                  {isActionLoading === 'cache' ? 'Limpiando Cache...' : 'Limpiar Cache del Sistema'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleGenerateReport}
                  disabled={isActionLoading === 'report'}
                >
                  <BarChart3 className={`h-4 w-4 mr-2 ${isActionLoading === 'report' ? 'animate-spin' : ''}`} />
                  {isActionLoading === 'report' ? 'Generando Reporte...' : 'Generar Reporte de Sistema'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleSecurityVerification}
                  disabled={isActionLoading === 'security'}
                >
                  <Shield className={`h-4 w-4 mr-2 ${isActionLoading === 'security' ? 'animate-spin' : ''}`} />
                  {isActionLoading === 'security' ? 'Verificando...' : 'Verificar Seguridad'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
