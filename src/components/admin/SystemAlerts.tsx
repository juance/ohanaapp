
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  Clock,
  CheckCircle,
  Shield
} from 'lucide-react';

export const SystemAlerts: React.FC = () => {
  return (
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
  );
};
