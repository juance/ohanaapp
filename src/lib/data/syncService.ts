
import { EXPENSES_STORAGE_KEY, FEEDBACK_STORAGE_KEY, TICKETS_STORAGE_KEY } from '@/lib/types/error.types';

/**
 * Resetea todos los datos locales almacenados
 * @returns Objeto con las claves de almacenamiento que fueron reseteadas
 */
export const resetLocalData = (): { [key: string]: boolean } => {
  const keysToReset = [
    EXPENSES_STORAGE_KEY,
    FEEDBACK_STORAGE_KEY,
    TICKETS_STORAGE_KEY,
    'clientData',
    'metricsData',
    'syncStatus'
  ];
  
  const result: { [key: string]: boolean } = {};
  
  for (const key of keysToReset) {
    try {
      localStorage.removeItem(key);
      result[key] = true;
    } catch (error) {
      console.error(`Error resetting ${key}:`, error);
      result[key] = false;
    }
  }
  
  return result;
};

export * from './sync/ticketsSync';
export * from './sync/expensesSync';
export * from './sync/feedbackSync';
export * from './sync/clientsSync';
export * from './sync/comprehensiveSync';
export * from './sync/syncStatusService';
