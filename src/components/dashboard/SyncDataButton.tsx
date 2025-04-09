
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RepeatIcon, CheckIcon } from 'lucide-react';
import { syncAllData, getSyncStatus } from '@/lib/data/sync/comprehensiveSync';
import { toast } from '@/lib/toast';

export const SyncDataButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCounts, setSyncCounts] = useState({
    ticketsSync: 0,
    expensesSync: 0,
    clientsSync: 0,
    feedbackSync: 0
  });

  // Load initial sync status
  React.useEffect(() => {
    checkSyncStatus();
  }, []);

  const checkSyncStatus = async () => {
    const status = await getSyncStatus();
    setSyncCounts(status);
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
    syncCounts.ticketsSync + 
    syncCounts.expensesSync + 
    syncCounts.clientsSync + 
    syncCounts.feedbackSync;

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Sincronización de datos</h3>
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Tickets pendientes:</span>
          <span className="font-medium">{syncCounts.ticketsSync}</span>
        </div>
        <div className="flex justify-between">
          <span>Gastos pendientes:</span>
          <span className="font-medium">{syncCounts.expensesSync}</span>
        </div>
        <div className="flex justify-between">
          <span>Clientes pendientes:</span>
          <span className="font-medium">{syncCounts.clientsSync}</span>
        </div>
        <div className="flex justify-between">
          <span>Comentarios pendientes:</span>
          <span className="font-medium">{syncCounts.feedbackSync}</span>
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
