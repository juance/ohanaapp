
import React from 'react';
import { Ticket } from '@/lib/types';
import PickupHeader from './PickupHeader';
import ActionButtons from './ActionButtons';
import SearchFilters from './SearchFilters';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PickupContainerProps {
  tickets: Ticket[];
  onOpenCancelDialog: () => void;
  onPrintTicket: () => void;
  onShareWhatsApp: () => void;
  onMarkAsDelivered: (ticketId: string) => void;
  onNotifyClient: () => void;
  setCancelReason: (reason: string) => void;
  selectedTicket: string | null;
  setSelectedTicket: (ticketId: string | null) => void;
  ticketServices: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'name' | 'phone';
  setSearchFilter: (filter: 'name' | 'phone') => void;
  isLoading?: boolean;
  isLoadingServices?: boolean;
  error?: Error | null;
  serviceError?: Error | null;
}

const PickupContainer: React.FC<PickupContainerProps> = ({
  tickets,
  onOpenCancelDialog,
  onPrintTicket,
  onShareWhatsApp,
  onMarkAsDelivered,
  onNotifyClient,
  setCancelReason,
  selectedTicket,
  setSelectedTicket,
  ticketServices,
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  isLoading = false,
  isLoadingServices = false,
  error = null,
  serviceError = null
}) => {
  // Find the selected ticket object
  const selectedTicketObj = tickets.find(t => t.id === selectedTicket);

  // Handler for API operation errors
  const renderErrorAlert = (errorMessage: string) => (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto pt-6">
      <PickupHeader />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
        
        {error && renderErrorAlert("Error al cargar los tickets. Por favor, intente de nuevo.")}
        
        <ActionButtons 
          selectedTicket={selectedTicket}
          ticket={selectedTicketObj}
          onNotifyClient={onNotifyClient}
          onPrintTicket={onPrintTicket}
          onShareWhatsApp={onShareWhatsApp}
          onOpenCancelDialog={onOpenCancelDialog}
          onMarkAsDelivered={onMarkAsDelivered}
        />
        
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                  ))}
                </div>
              </div>
            ) : (
              <TicketList 
                tickets={tickets}
                selectedTicket={selectedTicket}
                onSelectTicket={setSelectedTicket}
                searchQuery={searchQuery}
              />
            )}
          </div>
          
          <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50">
            {selectedTicket ? (
              serviceError ? (
                renderErrorAlert("Error al cargar los detalles del ticket.")
              ) : isLoadingServices ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </div>
              ) : (
                <TicketDetail 
                  ticket={selectedTicketObj}
                  ticketServices={ticketServices}
                />
              )
            ) : (
              <p className="text-center text-gray-500">Seleccione un ticket para ver los detalles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupContainer;
