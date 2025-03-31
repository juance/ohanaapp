
import { useState } from 'react';
import { ClientVisit } from '@/lib/types';

/**
 * Hook for client search and pagination functionality
 */
export const useClientSearch = (clients: ClientVisit[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination settings
  const itemsPerPage = 10;

  // Filter clients based on search query
  const filteredClients = searchQuery.trim() === '' 
    ? clients 
    : clients.filter(client => {
        const query = searchQuery.toLowerCase().trim();
        return (
          client.clientName.toLowerCase().includes(query) || 
          client.phoneNumber.includes(query)
        );
      });

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  
  // Get current page clients
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredClients,
    currentClients,
    handleSearchChange,
    handlePageChange
  };
};
