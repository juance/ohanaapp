
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface SearchBarProps {
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
  placeholder = "Buscar..."
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      
      <Select value={searchFilter} onValueChange={setSearchFilter}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filtrar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Nombre</SelectItem>
          <SelectItem value="phone">Teléfono</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBar;
