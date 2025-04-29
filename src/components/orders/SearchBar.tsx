
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchFilter?: 'name' | 'phone';
  setSearchFilter?: React.Dispatch<React.SetStateAction<'name' | 'phone'>>;
}

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery,
  searchFilter = 'name',
  setSearchFilter
}: SearchBarProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Buscar por nombre o teléfono..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
