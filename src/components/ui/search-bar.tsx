
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: any) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  placeholder = 'Buscar...',
  onSearch
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9 w-full"
          onKeyDown={handleKeyPress}
        />
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

      {onSearch && (
        <Button onClick={onSearch} type="button">
          Buscar
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
