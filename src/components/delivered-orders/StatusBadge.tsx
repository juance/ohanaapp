
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'ready' | 'delivered';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Configure the badge based on ticket status
  const getBadgeConfig = () => {
    switch (status) {
      case 'delivered':
        return {
          icon: <Check className="h-3 w-3" />,
          text: 'Entregado',
          className: 'bg-green-50 text-green-600'
        };
      case 'ready':
        return {
          icon: <Check className="h-3 w-3" />,
          text: 'Listo',
          className: 'bg-blue-50 text-blue-600'
        };
      case 'processing':
        return {
          icon: null,
          text: 'En proceso',
          className: 'bg-yellow-50 text-yellow-600'
        };
      case 'pending':
      default:
        return {
          icon: null,
          text: 'Pendiente',
          className: 'bg-gray-50 text-gray-600'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${config.className} px-2 py-1 rounded-full`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
