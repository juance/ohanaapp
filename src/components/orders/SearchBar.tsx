
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'name' | 'phone';
  setSearchFilter: (filter: 'name' | 'phone') => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  placeholder = 'Buscar...'
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs 
          value={searchFilter} 
          onValueChange={(value) => setSearchFilter(value as 'name' | 'phone')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="name">Nombre</TabsTrigger>
            <TabsTrigger value="phone">Teléfono</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchBar;
