
import React from 'react';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import PickupTicketList from '@/components/orders/PickupTicketList';
import TicketDetailPanel from '@/components/orders/TicketDetailPanel';
import { Ticket } from '@/lib/types';

interface PickupTabsContentProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  filteredTickets: Ticket[] | undefined;
  selectedTicket: string | null;
  setSelectedTicket: (id: string | null) => void;
  formatDate: (dateString: string) => string;
  ticketServices: {
    dryCleaningItems: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    laundryOptions: Array<{
      id: string;
      option_type: string;
    }>;
  };
  ticketDetailRef: React.RefObject<HTMLDivElement>;
  isLoadingServices?: boolean;
  onPriceUpdate?: (ticketId: string, newPrice: number) => Promise<void>;
}

const PickupTabsContent: React.FC<PickupTabsContentProps> = ({
  isLoading,
  isError,
  error,
  refetch,
  filteredTickets,
  selectedTicket,
  setSelectedTicket,
  formatDate,
  ticketServices,
  ticketDetailRef,
  isLoadingServices = false,
  onPriceUpdate
}) => {
  return (
    <>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorMessage 
          message={error?.message || 'Error al cargar los tickets'} 
          onRetry={refetch} 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-auto p-1">
            <PickupTicketList
              tickets={filteredTickets || []}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              formatDate={formatDate}
            />
          </div>
          
          <div className="lg:col-span-7">
            <div ref={ticketDetailRef} className="bg-gray-50 rounded-lg p-6 border">
              <TicketDetailPanel
                ticket={filteredTickets?.find(t => t.id === selectedTicket)}
                services={ticketServices}
                formatDate={formatDate}
                isLoadingServices={isLoadingServices}
                onPriceUpdate={onPriceUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PickupTabsContent;
