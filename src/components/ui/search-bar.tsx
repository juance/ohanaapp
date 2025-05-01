
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'name' | 'phone';
  setSearchFilter: (filter: 'name' | 'phone') => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  placeholder = "Buscar por nombre o teléfono..."
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-4">
        <Label className="text-sm text-gray-500">Filtrar por:</Label>
        <RadioGroup
          value={searchFilter}
          onValueChange={(value) => setSearchFilter(value as 'name' | 'phone')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="filter-name" />
            <Label htmlFor="filter-name" className="cursor-pointer">Nombre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="filter-phone" />
            <Label htmlFor="filter-phone" className="cursor-pointer">Teléfono</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default SearchBar;
