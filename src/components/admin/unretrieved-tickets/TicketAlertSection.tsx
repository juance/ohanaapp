
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import { TicketTable } from './TicketTable';

interface TicketAlertSectionProps {
  tickets: any[];
  days: number;
  onOpenMessageDialog: (ticket: any, type: '45days' | '90days') => void;
}

export function TicketAlertSection({ tickets, days, onOpenMessageDialog }: TicketAlertSectionProps) {
  const icon = days >= 90 ? AlertTriangle : Clock;
  const alertColor = days >= 90 ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50";
  const iconColor = days >= 90 ? "text-red-500" : "text-yellow-500";
  const title = days >= 90 
    ? "Tickets sin retirar por más de 90 días (prendas a donar)"
    : "Tickets sin retirar por más de 45 días";
  
  return (
    <Alert className={alertColor}>
      <AlertTitle className="flex items-center gap-2">
        {React.createElement(icon, { className: `h-4 w-4 ${iconColor}` })}
        <span>{title}</span>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <TicketTable 
          tickets={tickets} 
          days={days} 
          onOpenMessageDialog={onOpenMessageDialog} 
        />
      </AlertDescription>
    </Alert>
  );
}
