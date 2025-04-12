
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RepeatIcon, CheckIcon } from 'lucide-react';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { toast } from '@/lib/toast';

export const SyncDataButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCounts, setSyncCounts] = useState({
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0,
    inventory: 0
  });

  // Load initial sync status
  React.useEffect(() => {
    checkSyncStatus();
  }, []);

  const checkSyncStatus = async () => {
    const status = await getSyncStatus();
    setSyncCounts(status.pending);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllData();
      await checkSyncStatus();

      toast({
        title: "Sincronización exitosa",
        description: "Todos los datos han sido sincronizados correctamente con Supabase",
      });
    } catch (error) {
      console.error('Error durante la sincronización:', error);
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: "No se pudieron sincronizar todos los datos. Intente nuevamente.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const totalPendingSync =
    syncCounts.tickets +
    syncCounts.expenses +
    syncCounts.clients +
    syncCounts.feedback +
    syncCounts.inventory;

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Sincronización de datos</h3>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Tickets pendientes:</span>
          <span className="font-medium">{syncCounts.tickets}</span>
        </div>
        <div className="flex justify-between">
          <span>Gastos pendientes:</span>
          <span className="font-medium">{syncCounts.expenses}</span>
        </div>
        <div className="flex justify-between">
          <span>Clientes pendientes:</span>
          <span className="font-medium">{syncCounts.clients}</span>
        </div>
        <div className="flex justify-between">
          <span>Comentarios pendientes:</span>
          <span className="font-medium">{syncCounts.feedback}</span>
        </div>
        <div className="flex justify-between">
          <span>Inventario pendiente:</span>
          <span className="font-medium">{syncCounts.inventory}</span>
        </div>
      </div>

      <Button
        onClick={handleSync}
        className="w-full"
        disabled={isSyncing}
        variant={totalPendingSync > 0 ? "default" : "outline"}
      >
        {isSyncing ? (
          <>
            <RepeatIcon className="mr-2 h-4 w-4 animate-spin" />
            Sincronizando...
          </>
        ) : totalPendingSync > 0 ? (
          <>
            <RepeatIcon className="mr-2 h-4 w-4" />
            Sincronizar datos ({totalPendingSync})
          </>
        ) : (
          <>
            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
            Datos sincronizados
          </>
        )}
      </Button>
    </div>
  );
};
