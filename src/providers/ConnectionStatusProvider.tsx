
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSupabaseConnection } from '@/lib/supabaseAuthService';

interface ConnectionStatus {
  isOnline: boolean;
  supabaseConnected: boolean;
  lastChecked: Date | null;
}

interface ConnectionStatusContextType {
  status: ConnectionStatus;
  checkConnection: () => Promise<void>;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextType | undefined>(undefined);

export const ConnectionStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    supabaseConnected: false,
    lastChecked: null
  });

  const checkConnection = async () => {
    try {
      const supabaseConnected = await checkSupabaseConnection();
      setStatus({
        isOnline: navigator.onLine,
        supabaseConnected,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Error checking connections:', error);
      setStatus(prev => ({
        ...prev,
        supabaseConnected: false,
        lastChecked: new Date()
      }));
    }
  };

  useEffect(() => {
    // Check initial connection
    checkConnection();

    // Listen for online/offline events
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      checkConnection();
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        supabaseConnected: false 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connection check (every 5 minutes)
    const interval = setInterval(checkConnection, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <ConnectionStatusContext.Provider value={{ status, checkConnection }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};

export const useConnectionStatus = (): ConnectionStatusContextType => {
  const context = useContext(ConnectionStatusContext);
  
  if (context === undefined) {
    throw new Error('useConnectionStatus debe usarse dentro de un ConnectionStatusProvider');
  }
  
  return context;
};

// Alias for backward compatibility
export const useConnection = useConnectionStatus;
