
import { toast } from '@/lib/toast';

export type NotificationPriority = 'low' | 'medium' | 'high';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationOptions {
  title?: string;
  description: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

// Default durations based on priority
const PRIORITY_DURATIONS = {
  low: 3000,
  medium: 5000,
  high: 8000
};

// Map notification types to toast variants
const getVariant = (type: NotificationType): 'default' | 'destructive' | 'success' => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'success':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * Display a notification to the user
 */
export const notify = ({
  title,
  description,
  type = 'info',
  priority = 'medium',
  duration,
  action,
  onDismiss
}: NotificationOptions): void => {
  // Determine duration based on priority if not explicitly set
  const finalDuration = duration || PRIORITY_DURATIONS[priority];
  
  // Use specialized methods for certain types
  if (type === 'warning' && toast.warning) {
    toast.warning(description, { title, duration: finalDuration });
    return;
  }
  
  if (type === 'success' && toast.success) {
    toast.success(description, { title, duration: finalDuration });
    return;
  }
  
  if (type === 'error' && toast.error) {
    toast.error(description, { title, duration: finalDuration });
    return;
  }
  
  if (type === 'info' && toast.info) {
    toast.info(description, { title, duration: finalDuration });
    return;
  }
  
  // Fallback to standard toast
  toast({
    title,
    description,
    variant: getVariant(type),
    duration: finalDuration,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
    onDismiss
  });
};

// Convenience methods for different notification types
export const notificationService = {
  info: (options: Omit<NotificationOptions, 'type'>) => 
    notify({ ...options, type: 'info' }),
    
  success: (options: Omit<NotificationOptions, 'type'>) => 
    notify({ ...options, type: 'success' }),
    
  warning: (options: Omit<NotificationOptions, 'type'>) => 
    notify({ ...options, type: 'warning' }),
    
  error: (options: Omit<NotificationOptions, 'type'>) => 
    notify({ ...options, type: 'error' }),
    
  // Specialized notification for sync events
  syncComplete: (itemCount: number) => {
    if (itemCount === 0) return;
    
    notify({
      title: 'Sincronización completada',
      description: `${itemCount} ${itemCount === 1 ? 'elemento sincronizado' : 'elementos sincronizados'} correctamente.`,
      type: 'success',
      priority: 'medium'
    });
  },
  
  // Specialized notification for offline mode
  offlineMode: () => {
    notify({
      title: 'Modo sin conexión activado',
      description: 'Estás trabajando sin conexión. Los cambios se sincronizarán cuando vuelvas a estar en línea.',
      type: 'warning',
      priority: 'high',
      duration: 10000
    });
  },
  
  // Specialized notification for connection restored
  connectionRestored: (pendingSyncCount: number) => {
    const description = pendingSyncCount > 0
      ? `Conexión restablecida. ${pendingSyncCount} ${pendingSyncCount === 1 ? 'elemento pendiente' : 'elementos pendientes'} de sincronización.`
      : 'Conexión a internet restablecida.';
      
    notify({
      title: 'Conexión restablecida',
      description,
      type: 'info',
      priority: 'medium',
      action: pendingSyncCount > 0 ? {
        label: 'Sincronizar ahora',
        onClick: () => {
          // This would trigger the sync process
          document.dispatchEvent(new CustomEvent('sync-data-request'));
        }
      } : undefined
    });
  }
};

// Event listener setup for sync events
// This can be called in the app initialization
export const setupNotificationEventListeners = () => {
  document.addEventListener('connection-status-changed', (event: any) => {
    const { isOnline, pendingSyncCount } = event.detail || {};
    
    if (isOnline) {
      notificationService.connectionRestored(pendingSyncCount || 0);
    } else {
      notificationService.offlineMode();
    }
  });
  
  document.addEventListener('sync-completed', (event: any) => {
    const { itemCount } = event.detail || { itemCount: 0 };
    notificationService.syncComplete(itemCount);
  });
};

// Use this in the ConnectionStatusProvider to dispatch events
export const dispatchConnectionStatusEvent = (isOnline: boolean, pendingSyncCount: number) => {
  document.dispatchEvent(
    new CustomEvent('connection-status-changed', {
      detail: { isOnline, pendingSyncCount }
    })
  );
};

export const dispatchSyncCompletedEvent = (itemCount: number) => {
  document.dispatchEvent(
    new CustomEvent('sync-completed', {
      detail: { itemCount }
    })
  );
};
