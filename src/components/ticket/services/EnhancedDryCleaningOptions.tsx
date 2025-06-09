
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Shirt, Briefcase, ShoppingBag } from 'lucide-react';
import DryCleaningServiceCard, { DryCleaningService, SelectedService } from './DryCleaningServiceCard';
import ServicesSummary from './ServicesSummary';

// Servicios mejorados con categorías y descripciones
const enhancedDryCleaningServices: DryCleaningService[] = [
  { 
    id: 'shirt', 
    name: 'Camisa', 
    price: 2500, 
    category: 'Básico',
    description: 'Camisa de vestir o casual'
  },
  { 
    id: 'pants', 
    name: 'Pantalón', 
    price: 3000, 
    category: 'Básico',
    description: 'Pantalón de tela o vestir'
  },
  { 
    id: 'dress', 
    name: 'Vestido', 
    price: 4000, 
    category: 'Premium',
    description: 'Vestido casual o de gala'
  },
  { 
    id: 'suit', 
    name: 'Traje Completo', 
    price: 8000, 
    category: 'Premium',
    description: 'Traje de dos piezas'
  },
  { 
    id: 'coat', 
    name: 'Abrigo', 
    price: 5000, 
    category: 'Premium',
    description: 'Abrigo o sobretodo'
  },
  { 
    id: 'skirt', 
    name: 'Falda', 
    price: 2800, 
    category: 'Básico',
    description: 'Falda de cualquier largo'
  },
  { 
    id: 'blouse', 
    name: 'Blusa', 
    price: 2500, 
    category: 'Básico',
    description: 'Blusa de mujer'
  },
  { 
    id: 'jacket', 
    name: 'Chaqueta', 
    price: 4500, 
    category: 'Premium',
    description: 'Chaqueta o saco'
  },
  { 
    id: 'tie', 
    name: 'Corbata', 
    price: 1500, 
    category: 'Accesorios',
    description: 'Corbata o moño'
  },
  { 
    id: 'sweater', 
    name: 'Suéter', 
    price: 3500, 
    category: 'Básico',
    description: 'Suéter o pullover'
  }
];

const categories = ['Todos', 'Básico', 'Premium', 'Accesorios'];

const categoryIcons = {
  'Básico': Shirt,
  'Premium': Briefcase,
  'Accesorios': ShoppingBag
};

interface EnhancedDryCleaningOptionsProps {
  selectedItems: SelectedService[];
  onItemsChange: (items: SelectedService[]) => void;
}

const EnhancedDryCleaningOptions: React.FC<EnhancedDryCleaningOptionsProps> = ({
  selectedItems,
  onItemsChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredServices = useMemo(() => {
    return enhancedDryCleaningServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    const service = enhancedDryCleaningServices.find(s => s.id === serviceId);
    if (!service) return;

    if (quantity === 0) {
      // Remover el servicio si la cantidad es 0
      const updatedItems = selectedItems.filter(item => item.id !== serviceId);
      onItemsChange(updatedItems);
      return;
    }

    const existingItemIndex = selectedItems.findIndex(item => item.id === serviceId);
    
    if (existingItemIndex >= 0) {
      // Actualizar servicio existente
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...service,
        quantity
      };
      onItemsChange(updatedItems);
    } else {
      // Agregar nuevo servicio
      const newItem: SelectedService = {
        ...service,
        quantity
      };
      onItemsChange([...selectedItems, newItem]);
    }
  };

  const getServiceQuantity = (serviceId: string): number => {
    const item = selectedItems.find(item => item.id === serviceId);
    return item?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Servicios de Tintorería</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controles de filtro y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-1"
                >
                  {category !== 'Todos' && categoryIcons[category as keyof typeof categoryIcons] && 
                    React.createElement(categoryIcons[category as keyof typeof categoryIcons], { className: "h-4 w-4" })
                  }
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lista de servicios */}
          <div className={`gap-4 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'flex flex-col space-y-4'
          }`}>
            {filteredServices.map((service) => (
              <DryCleaningServiceCard
                key={service.id}
                service={service}
                quantity={getServiceQuantity(service.id)}
                onQuantityChange={handleQuantityChange}
                isSelected={getServiceQuantity(service.id) > 0}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron servicios que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de servicios seleccionados */}
      {selectedItems.length > 0 && (
        <ServicesSummary selectedServices={selectedItems} />
      )}
    </div>
  );
};

export default EnhancedDryCleaningOptions;
