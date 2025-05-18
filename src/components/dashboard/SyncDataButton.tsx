
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
      // Call the synchronization function
      const result = await syncAllData();
      
      // Create a SyncStatus object from the result
      const mappedResult: SimpleSyncStatus = {
        lastSync: new Date().toISOString(),
        syncError: null,
        tickets: result.tickets,
        expenses: result.expenses,
        clients: result.clients,
        feedback: result.feedback
      };
      
      setSyncStatus(mappedResult);
      
      const totalSynced = 
        (mappedResult.tickets || 0) + 
        (mappedResult.expenses || 0) + 
        (mappedResult.clients || 0) + 
        (mappedResult.feedback || 0);
      
      if (totalSynced > 0) {
        toast({
          title: `Sincronización completa: ${totalSynced} elementos sincronizados`,
          description: `Tickets: ${mappedResult.tickets || 0}, Clientes: ${mappedResult.clients || 0}, Gastos: ${mappedResult.expenses || 0}, Feedback: ${mappedResult.feedback || 0}`
        });
      } else {
        toast({
          title: 'No hay datos nuevos para sincronizar'
        });
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: "Error durante la sincronización",
        description: 'Por favor intente nuevamente'
      });
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
