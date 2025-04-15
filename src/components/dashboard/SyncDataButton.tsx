
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from '@/lib/toast';
import { syncAllData } from "@/lib/data/sync/comprehensiveSync";
import { SyncStatus } from '@/lib/types';

export const SyncDataButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    ticketsSync: 0,
    expensesSync: 0,
    clientsSync: 0,
    feedbackSync: 0
  });

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    toast.info('Iniciando sincronización de datos...');
    
    try {
      // Call the synchronization function
      const result = await syncAllData();
      
      // Create a SyncStatus object from the result
      const mappedResult: SyncStatus = {
        ticketsSync: result.tickets,
        expensesSync: result.expenses,
        clientsSync: result.clients,
        feedbackSync: result.feedback
      };
      
      setSyncStatus(mappedResult);
      
      const totalSynced = 
        mappedResult.ticketsSync + 
        mappedResult.expensesSync + 
        mappedResult.clientsSync + 
        mappedResult.feedbackSync;
      
      if (totalSynced > 0) {
        toast.success(`Sincronización completa: ${totalSynced} elementos sincronizados`, {
          description: `Tickets: ${mappedResult.ticketsSync}, Clientes: ${mappedResult.clientsSync}, Gastos: ${mappedResult.expensesSync}, Feedback: ${mappedResult.feedbackSync}`
        });
      } else {
        toast.info('No hay datos nuevos para sincronizar');
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast.error('Error durante la sincronización', {
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
