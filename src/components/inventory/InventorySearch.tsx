
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, PlusIcon } from 'lucide-react';

interface InventorySearchProps {
  onSearch: (query: string) => void;
  onCreateNew: () => void;
}

const InventorySearch: React.FC<InventorySearchProps> = ({ onSearch, onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar..."
          className="pl-8 text-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <Button size="sm" onClick={onCreateNew}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Crear Ítem
      </Button>
    </div>
  );
};

export default InventorySearch;
