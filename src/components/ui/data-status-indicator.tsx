
import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DataStatusIndicatorProps {
  status: 'synchronized' | 'offline' | 'syncing' | 'error';
  pendingCount?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function DataStatusIndicator({
  status,
  pendingCount = 0,
  showLabel = false,
  size = 'md',
  onClick,
  className
}: DataStatusIndicatorProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const containerClass = onClick ? 'cursor-pointer' : '';
  
  const renderIcon = () => {
    switch (status) {
      case 'synchronized':
        return <Wifi className={`${sizeClass[size]} text-green-500`} />;
      case 'offline':
        return <WifiOff className={`${sizeClass[size]} text-gray-500`} />;
      case 'syncing':
        return <RefreshCw className={`${sizeClass[size]} text-blue-500 animate-spin`} />;
      case 'error':
        return <AlertTriangle className={`${sizeClass[size]} text-red-500`} />;
    }
  };
  
  const getLabel = () => {
    switch (status) {
      case 'synchronized':
        return 'Datos sincronizados';
      case 'offline':
        return 'Sin conexión';
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Error de sincronización';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'synchronized': return 'text-green-700';
      case 'offline': return 'text-gray-600';
      case 'syncing': return 'text-blue-600';
      case 'error': return 'text-red-600';
    }
  };
  
  if (onClick) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={cn("p-1 h-auto flex items-center gap-1.5", className)}
      >
        {renderIcon()}
        {showLabel && (
          <span className={cn("text-sm font-medium", getColor())}>
            {getLabel()}
            {pendingCount > 0 && status !== 'syncing' && (
              <span className="ml-1 text-amber-500">({pendingCount})</span>
            )}
          </span>
        )}
      </Button>
    );
  }
  
  return (
    <div className={cn("flex items-center gap-1.5", containerClass, className)}>
      {renderIcon()}
      {showLabel && (
        <span className={cn("text-sm font-medium", getColor())}>
          {getLabel()}
          {pendingCount > 0 && status !== 'syncing' && (
            <span className="ml-1 text-amber-500">({pendingCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
