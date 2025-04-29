
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  placeholder = 'Buscar por nombre, teléfono o número de ticket...'
}) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex space-x-1">
        <Button
          variant={searchFilter === 'name' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setSearchFilter('name')}
          className="flex-1 sm:flex-none"
        >
          Nombre
        </Button>
        
        <Button
          variant={searchFilter === 'phone' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setSearchFilter('phone')}
          className="flex-1 sm:flex-none"
        >
          Teléfono
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
