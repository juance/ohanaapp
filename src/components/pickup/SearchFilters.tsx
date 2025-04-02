
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'name' | 'phone';
  setSearchFilter: (filter: 'name' | 'phone') => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
}) => {
  return (
    <>
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={searchFilter === 'name' ? "secondary" : "outline"} 
          className={searchFilter === 'name' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          onClick={() => setSearchFilter('name')}
        >
          Nombre
        </Button>
        <Button 
          variant={searchFilter === 'phone' ? "secondary" : "outline"} 
          className={searchFilter === 'phone' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          onClick={() => setSearchFilter('phone')}
        >
          Teléfono
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Buscar por ${searchFilter === 'name' ? 'nombre del cliente' : 'teléfono'}`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
