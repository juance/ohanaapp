
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, CloudOff, RotateCw, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type SyncStatus = 'synchronized' | 'offline' | 'syncing' | 'error';

interface DataStatusIndicatorProps {
  status: SyncStatus;
  pendingCount?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function DataStatusIndicator({
  status,
  pendingCount = 0,
  className,
  showLabel = false,
  size = 'md',
  onClick
}: DataStatusIndicatorProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const containerClasses = cn(
    'flex items-center gap-2',
    onClick && 'cursor-pointer hover:opacity-80',
    className
  );

  const statusConfig = {
    synchronized: {
      icon: <CheckCircle size={iconSize} className="text-green-500" />,
      label: 'Datos sincronizados',
      description: 'Todos los datos están actualizados'
    },
    offline: {
      icon: <CloudOff size={iconSize} className="text-amber-500" />,
      label: 'Modo sin conexión',
      description: pendingCount > 0 
        ? `${pendingCount} cambios pendientes de sincronizar` 
        : 'Trabajando sin conexión'
    },
    syncing: {
      icon: <RotateCw size={iconSize} className="text-blue-500 animate-spin" />,
      label: 'Sincronizando',
      description: 'Actualizando datos...'
    },
    error: {
      icon: <AlertTriangle size={iconSize} className="text-red-500" />,
      label: 'Error de sincronización',
      description: 'No se pudieron sincronizar los datos'
    }
  };

  const config = statusConfig[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={containerClasses}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
        >
          {config.icon}
          {showLabel && (
            <span className={cn(
              'text-sm font-medium',
              status === 'synchronized' && 'text-green-700',
              status === 'offline' && 'text-amber-700',
              status === 'syncing' && 'text-blue-700',
              status === 'error' && 'text-red-700'
            )}>
              {config.label}
            </span>
          )}
          {pendingCount > 0 && status === 'offline' && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-500 rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
