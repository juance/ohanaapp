
import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchFilter?: string;
  setSearchFilter?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery,
  searchFilter,
  setSearchFilter
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative mb-4 w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar por nombre o teléfono..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9"
      />
    </div>
  );
};

export default SearchBar;
