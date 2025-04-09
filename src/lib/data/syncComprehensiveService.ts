
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { syncOfflineData } from './syncService';
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY, EXPENSES_STORAGE_KEY } from './coreUtils';

/**
 * Synchronize all application data between local storage and Supabase
 */
export const syncAllData = async (): Promise<boolean> => {
  try {
    // Display toast to inform the user
    toast({
      title: "Sincronización",
      description: "Iniciando sincronización completa de datos...",
    });

    // 1. First sync any pending offline data (tickets, expenses)
    const offlineDataSynced = await syncOfflineData();
    
    // 2. Sync dashboard metrics
    await syncDashboardMetrics();
    
    // 3. Sync clients and loyalty data
    await syncClientsData();
    
    // 4. Sync ticket analysis data
    await syncTicketAnalysis();
    
    // 5. Sync feedback data
    await syncFeedbackData();
    
    // Show success message
    toast({
      title: "Sincronización completada",
      description: "Todos los datos han sido sincronizados correctamente",
    });
    
    return true;
  } catch (error) {
    console.error('Error en la sincronización completa de datos:', error);
    
    toast({
      variant: "destructive",
      title: "Error de sincronización",
      description: "Ocurrió un error durante la sincronización de datos",
    });
    
    return false;
  }
};

/**
 * Sync dashboard metrics data with Supabase
 */
const syncDashboardMetrics = async (): Promise<boolean> => {
  try {
    // Get current date for the metrics record
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Get existing metrics from dashboard_stats
    const { data: existingStats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('stats_date', formattedDate)
      .maybeSingle();
    
    if (statsError) throw statsError;
    
    // Get local data to sync
    const localMetrics = getFromLocalStorage('dashboard_metrics') || {
      daily: {
        salesByHour: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {},
        totalSales: 0,
        valetCount: 0
      },
      weekly: {
        salesByDay: {},
        valetsByDay: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      },
      monthly: {
        salesByWeek: {},
        valetsByWeek: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      }
    };
    
    // Prepare the stats data
    const statsData = {
      daily_sales_by_hour: localMetrics.daily?.salesByHour || {},
      daily_payment_methods: localMetrics.daily?.paymentMethods || {},
      daily_dry_cleaning_items: localMetrics.daily?.dryCleaningItems || {},
      daily_total_sales: localMetrics.daily?.totalSales || 0,
      daily_valet_count: localMetrics.daily?.valetCount || 0,
      weekly_sales_by_day: localMetrics.weekly?.salesByDay || {},
      weekly_valets_by_day: localMetrics.weekly?.valetsByDay || {},
      weekly_payment_methods: localMetrics.weekly?.paymentMethods || {},
      weekly_dry_cleaning_items: localMetrics.weekly?.dryCleaningItems || {},
      monthly_sales_by_week: localMetrics.monthly?.salesByWeek || {},
      monthly_valets_by_week: localMetrics.monthly?.valetsByWeek || {},
      monthly_payment_methods: localMetrics.monthly?.paymentMethods || {},
      monthly_dry_cleaning_items: localMetrics.monthly?.dryCleaningItems || {}
    };
    
    // Upsert dashboard stats
    if (existingStats) {
      const { error: updateError } = await supabase
        .from('dashboard_stats')
        .update({
          stats_data: statsData
        })
        .eq('id', existingStats.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('dashboard_stats')
        .insert({
          stats_date: formattedDate,
          stats_data: statsData
        });
      
      if (insertError) throw insertError;
    }
    
    console.log('Dashboard metrics synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing dashboard metrics:', error);
    return false;
  }
};

/**
 * Sync clients data and loyalty information
 */
const syncClientsData = async (): Promise<boolean> => {
  try {
    // Get local clients data (if any)
    const localClients = getFromLocalStorage('clients_data') || [];
    
    // If there are local clients that need to be synced, process them
    if (localClients.length > 0) {
      for (const client of localClients) {
        if (client.pendingSync) {
          // Check if client exists in Supabase
          const { data: existingClient, error: clientError } = await supabase
            .from('customers')
            .select('*')
            .eq('phone', client.phoneNumber)
            .maybeSingle();
          
          if (clientError) throw clientError;
          
          // Update or insert client
          if (existingClient) {
            const { error: updateError } = await supabase
              .from('customers')
              .update({
                name: client.clientName,
                loyalty_points: client.loyaltyPoints || 0,
                free_valets: client.freeValets || 0,
                valets_count: client.valetsCount || 0
              })
              .eq('id', existingClient.id);
            
            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from('customers')
              .insert({
                name: client.clientName,
                phone: client.phoneNumber,
                loyalty_points: client.loyaltyPoints || 0,
                free_valets: client.freeValets || 0,
                valets_count: client.valetsCount || 0
              });
            
            if (insertError) throw insertError;
          }
          
          // Mark client as synced
          client.pendingSync = false;
        }
      }
      
      // Update local storage with synced clients
      saveToLocalStorage('clients_data', localClients);
    }
    
    console.log('Clients data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing clients data:', error);
    return false;
  }
};

/**
 * Sync ticket analysis data
 */
const syncTicketAnalysis = async (): Promise<boolean> => {
  try {
    // Since ticket analysis is primarily read-only and calculated on-the-fly,
    // we don't need to sync any specific data, but we can invalidate any local cache
    localStorage.removeItem('ticket_analysis_cache');
    
    console.log('Ticket analysis cache cleared');
    return true;
  } catch (error) {
    console.error('Error syncing ticket analysis:', error);
    return false;
  }
};

/**
 * Sync feedback data
 */
const syncFeedbackData = async (): Promise<boolean> => {
  try {
    // Get local feedback data
    const localFeedback = getFromLocalStorage('customer_feedback') || [];
    
    // Process any unsynced feedback
    for (const feedback of localFeedback) {
      if (feedback.pendingSync) {
        const { error: feedbackError } = await supabase
          .from('customer_feedback')
          .insert({
            customer_name: feedback.customerName,
            rating: feedback.rating,
            comment: feedback.comment
          });
        
        if (feedbackError) throw feedbackError;
        
        // Mark as synced
        feedback.pendingSync = false;
      }
    }
    
    // Update local storage
    saveToLocalStorage('customer_feedback', localFeedback);
    
    console.log('Feedback data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing feedback data:', error);
    return false;
  }
};

/**
 * Get synchronization status for all data types
 */
export const getSyncStatus = async (): Promise<{
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}> => {
  try {
    // Get counts of data that needs to be synced
    const localTickets = getFromLocalStorage(TICKETS_STORAGE_KEY) || [];
    const ticketsSync = localTickets.filter((t: any) => t.pendingSync).length;
    
    const localExpenses = getFromLocalStorage(EXPENSES_STORAGE_KEY) || [];
    const expensesSync = localExpenses.filter((e: any) => e.pendingSync).length;
    
    const localClients = getFromLocalStorage('clients_data') || [];
    const clientsSync = localClients.filter((c: any) => c.pendingSync).length;
    
    const localFeedback = getFromLocalStorage('customer_feedback') || [];
    const feedbackSync = localFeedback.filter((f: any) => f.pendingSync).length;
    
    return {
      ticketsSync,
      expensesSync,
      clientsSync,
      feedbackSync
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0
    };
  }
};
