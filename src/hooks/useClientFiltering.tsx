
import { useState, useEffect } from 'react';
import { ClientVisit } from '@/lib/types/customer.types';

export const useClientFiltering = (clients: ClientVisit[]) => {
  const [filteredClients, setFilteredClients] = useState<ClientVisit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof ClientVisit>('clientName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = clients.filter(client => {
      return (
        client.clientName.toLowerCase().includes(lowercaseQuery) ||
        client.phoneNumber.toLowerCase().includes(lowercaseQuery)
      );
    });

    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  // Sort clients when sort field or direction changes
  useEffect(() => {
    const sorted = [...filteredClients].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });

    setFilteredClients(sorted);
  }, [sortField, sortDirection, filteredClients]);

  const handleSortChange = (field: keyof ClientVisit) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    filteredClients,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSortChange
  };
};
