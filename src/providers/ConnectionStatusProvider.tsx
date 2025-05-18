
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConnectionContextType {
  isOnline: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<boolean>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionStatusProvider');
  }
  return context;
};

export const ConnectionStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check if the browser is online or offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to manually check connection by pinging a resource
  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify actual internet connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/ping.txt', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      setIsOnline(response.ok);
      setLastChecked(new Date());
      return response.ok;
    } catch (error) {
      console.log('Connection check failed:', error);
      setIsOnline(false);
      setLastChecked(new Date());
      return false;
    }
  };

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, []);

  // Check connection periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const value: ConnectionContextType = {
    isOnline,
    lastChecked,
    checkConnection
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};
