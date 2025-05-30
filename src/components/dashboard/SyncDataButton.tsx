
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from '@/lib/toast';
import { syncAllData } from "@/lib/data/sync/comprehensiveSync";
import { SimpleSyncStatus } from '@/lib/types/sync.types';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';

export const SyncDataButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SimpleSyncStatus>(getSyncStatus());

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    toast.info('Iniciando sincronización de datos...');
    
    try {
      const result = await syncAllData();
      
      const mappedResult: SimpleSyncStatus = {
        timestamp: new Date().toISOString(),
        status: 'success',
        tickets: result.tickets.added + result.tickets.updated,
        expenses: result.expenses.added + result.expenses.updated,
        clients: result.clients.added + result.clients.updated,
        feedback: result.feedback.added + result.feedback.updated,
        lastSync: new Date().toISOString(),
        syncError: null
      };
      
      setSyncStatus(mappedResult);
      
      const totalSynced = 
        (mappedResult.tickets || 0) + 
        (mappedResult.expenses || 0) + 
        (mappedResult.clients || 0) + 
        (mappedResult.feedback || 0);
      
      if (totalSynced > 0) {
        toast.success(
          `Sincronización completa: ${totalSynced} elementos sincronizados`
        );
      } else {
        toast.info('No hay datos nuevos para sincronizar');
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast.error("Error durante la sincronización");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className="text-xs h-8 gap-1"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Sincronizando...' : 'Sincronizar Datos'}
    </Button>
  );
};
