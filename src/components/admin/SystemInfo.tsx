
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SystemInfoProps {
  systemStats: {
    totalUsers: number;
    activeTickets: number;
    systemHealth: string;
    lastBackup: Date;
    dbConnections: number;
    uptime: string;
  };
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ systemStats }) => {
  return (
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
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Uptime</span>
          <span className="text-sm font-medium">{systemStats.uptime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Conexiones DB</span>
          <span className="text-sm font-medium">{systemStats.dbConnections}</span>
        </div>
      </CardContent>
    </Card>
  );
};
