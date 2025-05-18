
import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useConnection } from '@/providers/ConnectionStatusProvider';
import { cn } from '@/lib/utils';

type ConnectionStatusBarProps = {
  /** Renders a more compact version of the connection status bar */
  variant?: 'default' | 'compact';
  className?: string;
};

/**
 * Connection Status Bar component that shows the current online/offline status
 * and provides a button to manually check the connection.
 */
export const ConnectionStatusBar: React.FC<ConnectionStatusBarProps> = ({
  variant = 'default',
  className
}) => {
  const { isOnline, lastChecked, checkConnection } = useConnection();
  const [isChecking, setIsChecking] = React.useState(false);
  
  const handleCheckConnection = async () => {
    setIsChecking(true);
    await checkConnection();
    setIsChecking(false);
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center text-xs rounded-md border px-2 py-1",
        isOnline ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700",
        className
      )}>
        <span className="mr-1">
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        </span>
        <span>{isOnline ? "En línea" : "Fuera de línea"}</span>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center justify-between rounded-md border p-2.5",
      isOnline ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200",
      className
    )}>
      <div className="flex items-center gap-2">
        <div className={cn(
          "rounded-full p-1.5",
          isOnline ? "bg-green-100" : "bg-amber-100"
        )}>
          {isOnline ? (
            <Wifi className={cn("h-4 w-4", "text-green-600")} />
          ) : (
            <WifiOff className={cn("h-4 w-4", "text-amber-600")} />
          )}
        </div>
        
        <div>
          <div className={cn(
            "text-sm font-medium",
            isOnline ? "text-green-700" : "text-amber-700"
          )}>
            {isOnline ? "Conectado" : "Sin conexión"}
          </div>
          {lastChecked && (
            <div className="text-xs text-gray-500">
              Última comprobación: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={handleCheckConnection}
        disabled={isChecking}
        className={cn(
          "flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors",
          isOnline 
            ? "border-green-300 bg-green-100 text-green-700 hover:bg-green-200" 
            : "border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200"
        )}
      >
        <RefreshCw className={cn("h-3 w-3", isChecking && "animate-spin")} />
        Verificar
      </button>
    </div>
  );
};
