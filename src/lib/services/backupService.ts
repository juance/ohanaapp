
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export interface BackupData {
  tickets: any[];
  customers: any[];
  inventory: any[];
  expenses: any[];
  feedback: any[];
  timestamp: string;
  version: string;
}

export const backupService = {
  async createBackup(): Promise<BackupData | null> {
    try {
      console.log('Iniciando backup del sistema...');
      
      // Obtener datos de todas las tablas principales
      const [ticketsData, customersData, inventoryData, expensesData, feedbackData] = await Promise.all([
        supabase.from('tickets').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('inventory_items').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('customer_feedback').select('*')
      ]);

      const backupData: BackupData = {
        tickets: ticketsData.data || [],
        customers: customersData.data || [],
        inventory: inventoryData.data || [],
        expenses: expensesData.data || [],
        feedback: feedbackData.data || [],
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      console.log('Backup creado exitosamente');
      return backupData;
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Error al crear el backup');
      return null;
    }
  },

  async downloadBackup(): Promise<void> {
    try {
      const backupData = await this.createBackup();
      if (!backupData) return;

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lavanderia-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      toast.success('Backup descargado exitosamente');
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast.error('Error al descargar el backup');
    }
  },

  getBackupStats(backupData: BackupData) {
    return {
      totalTickets: backupData.tickets.length,
      totalCustomers: backupData.customers.length,
      totalInventoryItems: backupData.inventory.length,
      totalExpenses: backupData.expenses.length,
      totalFeedback: backupData.feedback.length,
      backupSize: JSON.stringify(backupData).length
    };
  }
};
