
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from '@/lib/toast';
import { syncAllData } from "@/lib/data/sync/comprehensiveSync";
import { SimpleSyncStatus } from '@/lib/types/sync.types';

export const SyncDataButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SimpleSyncStatus>({
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0,
    lastSync: null
  });

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    toast.info('Iniciando sincronización de datos...');
    
    try {
      // Call the synchronization function
      const result = await syncAllData();
      
      // Create a SyncStatus object from the result
      const mappedResult: SimpleSyncStatus = {
        tickets: result.tickets,
        expenses: result.expenses,
        clients: result.clients,
        feedback: result.feedback,
        lastSync: new Date()
      };
      
      setSyncStatus(mappedResult);
      
      const totalSynced = 
        mappedResult.tickets + 
        mappedResult.expenses + 
        mappedResult.clients + 
        mappedResult.feedback;
      
      if (totalSynced > 0) {
        toast({
          title: `Sincronización completa: ${totalSynced} elementos sincronizados`,
          description: `Tickets: ${mappedResult.tickets}, Clientes: ${mappedResult.clients}, Gastos: ${mappedResult.expenses}, Feedback: ${mappedResult.feedback}`
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
