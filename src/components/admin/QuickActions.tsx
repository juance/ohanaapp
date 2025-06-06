
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw,
  Download,
  Upload,
  FileText,
  Database,
  Shield
} from 'lucide-react';

interface QuickActionsProps {
  onBackup: () => void;
  onClearCache: () => void;
  onGenerateReport: () => void;
  onSecurityCheck: () => void;
  isActionLoading: string | null;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onBackup,
  onClearCache,
  onGenerateReport,
  onSecurityCheck,
  isActionLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onBackup}
          disabled={isActionLoading === 'backup'}
        >
          <Database className={`h-4 w-4 mr-2 ${isActionLoading === 'backup' ? 'animate-spin' : ''}`} />
          {isActionLoading === 'backup' ? 'Creando Backup...' : 'Realizar Backup Manual'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onClearCache}
          disabled={isActionLoading === 'cache'}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isActionLoading === 'cache' ? 'animate-spin' : ''}`} />
          {isActionLoading === 'cache' ? 'Limpiando Cache...' : 'Limpiar Cache del Sistema'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onGenerateReport}
          disabled={isActionLoading === 'report'}
        >
          <FileText className={`h-4 w-4 mr-2 ${isActionLoading === 'report' ? 'animate-spin' : ''}`} />
          {isActionLoading === 'report' ? 'Generando Reporte...' : 'Generar Reporte de Sistema'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onSecurityCheck}
          disabled={isActionLoading === 'security'}
        >
          <Shield className={`h-4 w-4 mr-2 ${isActionLoading === 'security' ? 'animate-spin' : ''}`} />
          {isActionLoading === 'security' ? 'Verificando...' : 'Verificar Seguridad'}
        </Button>
      </CardContent>
    </Card>
  );
};
