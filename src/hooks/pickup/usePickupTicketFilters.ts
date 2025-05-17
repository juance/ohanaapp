
import { useState, useCallback } from 'react';
import { Ticket } from '@/lib/types';

type SearchFilterType = 'name' | 'phone';

/**
 * Hook for filtering tickets
 */
export const usePickupTicketFilters = () => {
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>('name');

  /**
   * Filters tickets based on the search query
   */
  const filterTickets = useCallback((tickets: Ticket[] | undefined): Ticket[] | undefined => {
    if (!searchQuery.trim()) {
      return tickets;
    }
    
    return tickets?.filter((ticket) => {
      if (searchFilter === 'name' && ticket.clientName) {
        return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchFilter === 'phone' && ticket.phoneNumber) {
        return ticket.phoneNumber.includes(searchQuery);
      }
      return false;
    });
  }, [searchQuery, searchFilter]);

  return {
    searchQuery,
    searchFilter,
    setSearchQuery,
    setSearchFilter,
    filterTickets
  };
};

export type { SearchFilterType };
