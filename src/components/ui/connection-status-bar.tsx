
import React from 'react';
import { useConnection } from '@/providers/ConnectionStatusProvider';
import { DataStatusIndicator } from './data-status-indicator';
import { Button } from './button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConnectionStatusBarProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ConnectionStatusBar({ 
  variant = 'full',
  className 
}: ConnectionStatusBarProps) {
  const { 
    connectionStatus, 
    syncStatus, 
    pendingSyncCount, 
    lastSyncedAt,
    syncData
  } = useConnection();

  // Map our app status to the DataStatusIndicator status
  let displayStatus: 'synchronized' | 'offline' | 'syncing' | 'error';
  
  if (connectionStatus === 'offline') {
    displayStatus = 'offline';
  } else if (syncStatus === 'syncing') {
    displayStatus = 'syncing';
  } else if (syncStatus === 'error') {
    displayStatus = 'error';
  } else {
    displayStatus = 'synchronized';
  }

  const handleSync = () => {
    syncData();
  };

  // For compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${className}`}>
        <DataStatusIndicator 
          status={displayStatus} 
          pendingCount={pendingSyncCount}
          onClick={handleSync}
          size="sm"
        />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`w-full border rounded-lg p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DataStatusIndicator 
            status={displayStatus} 
            pendingCount={pendingSyncCount}
            showLabel
          />
          
          {lastSyncedAt && (
            <span className="text-xs text-gray-500">
              Última sincronización: {formatDistanceToNow(lastSyncedAt, { addSuffix: true, locale: es })}
            </span>
          )}
        </div>
        
        <Button
          size="sm"
          variant={pendingSyncCount > 0 ? "default" : "outline"}
          onClick={handleSync}
          disabled={connectionStatus === 'offline' || syncStatus === 'syncing'}
        >
          {syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar ahora'}
        </Button>
      </div>
      
      {pendingSyncCount > 0 && (
        <div className="mt-2 text-sm text-amber-600">
          {pendingSyncCount} {pendingSyncCount === 1 ? 'item pendiente' : 'items pendientes'} de sincronización
        </div>
      )}
    </div>
  );
}
