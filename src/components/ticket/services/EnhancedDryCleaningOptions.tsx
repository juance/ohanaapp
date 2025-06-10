
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, Shirt, Briefcase, ShoppingBag, Home, Zap, Users } from 'lucide-react';
import DryCleaningServiceCard, { DryCleaningService, SelectedService } from './DryCleaningServiceCard';
import ServicesSummary from './ServicesSummary';

// Updated services with new pricing structure
const enhancedDryCleaningServices: DryCleaningService[] = [
  // Servicios básicos
  { id: 'lavado_valet', name: 'Lavado (valet)', price: 6000, category: 'Básico', description: 'Servicio de lavado completo' },
  { id: 'secado', name: 'Secado', price: 5000, category: 'Básico', description: 'Servicio de secado profesional' },
  { id: 'tratamiento_mano', name: 'Tratamiento a mano (por 3 prendas)', price: 6000, category: 'Básico', description: 'Cuidado especial manual' },
  { id: 'lavado_zapatillas', name: 'Lavado de zapatillas (por par)', price: 12000, category: 'Básico', description: 'Limpieza especializada de calzado' },
  { id: 'lavado_mantas', name: 'Lavado de mantas, cortinas y colchas', price: 10000, priceMax: 12000, category: 'Hogar', description: 'Con doble secado' },

  // Ropa de trabajo
  { id: 'ambo_comun', name: 'Ambo común', price: 22000, category: 'Trabajo', description: 'Uniforme médico estándar' },
  { id: 'ambo_lino', name: 'Ambo lino', price: 25000, category: 'Trabajo', description: 'Uniforme médico de lino' },

  // Ropa casual
  { id: 'blusa', name: 'Blusa', price: 9600, priceMax: 11000, category: 'Casual', description: 'Blusa de mujer' },
  { id: 'buzo', name: 'Buzo', price: 9600, priceMax: 11000, category: 'Casual', description: 'Sudadera o buzo casual' },
  { id: 'camisa', name: 'Camisa', price: 9000, priceMax: 10400, category: 'Casual', description: 'Camisa de vestir o casual' },
  { id: 'remera', name: 'Remera', price: 9000, priceMax: 10400, category: 'Casual', description: 'Camiseta o remera' },
  { id: 'pullover', name: 'Pullover', price: 11000, priceMax: 15000, category: 'Casual', description: 'Suéter o pullover' },

  // Ropa formal
  { id: 'traje', name: 'Traje', price: 34000, priceMax: 39000, category: 'Formal', description: 'Traje completo de dos piezas' },
  { id: 'saco', name: 'Saco', price: 14000, priceMax: 16000, category: 'Formal', description: 'Saco de vestir' },
  { id: 'sacon', name: 'Sacón', price: 15000, category: 'Formal', description: 'Saco largo elegante' },
  { id: 'saco_lana', name: 'Saco de lana', price: 13000, priceMax: 18000, category: 'Formal', description: 'Saco de material lanoso' },
  { id: 'chaleco', name: 'Chaleco', price: 12000, priceMax: 15000, category: 'Formal', description: 'Chaleco de vestir' },
  { id: 'chaqueta', name: 'Chaqueta', price: 12000, priceMax: 15000, category: 'Formal', description: 'Chaqueta elegante' },
  { id: 'corbata', name: 'Corbata', price: 8000, category: 'Formal', description: 'Corbata de seda o tela' },

  // Pantalones
  { id: 'pantalon_vestir', name: 'Pantalón vestir', price: 9000, priceMax: 10400, category: 'Pantalones', description: 'Pantalón de vestir formal' },
  { id: 'pantalon_lino', name: 'Pantalón lino', price: 9000, priceMax: 10400, category: 'Pantalones', description: 'Pantalón de lino fresco' },
  { id: 'pantalon_sky', name: 'Pantalón Sky', price: 16000, category: 'Pantalones', description: 'Pantalón deportivo de esquí' },

  // Polleras
  { id: 'pollera', name: 'Pollera', price: 11000, priceMax: 17000, category: 'Polleras', description: 'Falda de cualquier largo' },
  { id: 'pollera_tableada', name: 'Pollera tableada', price: 13000, priceMax: 18000, category: 'Polleras', description: 'Falda con pliegues' },

  // Camperas y abrigos
  { id: 'campera', name: 'Campera', price: 15000, category: 'Abrigo', description: 'Campera casual' },
  { id: 'campera_sky', name: 'Campera Sky', price: 22000, category: 'Abrigo', description: 'Campera de esquí técnica' },
  { id: 'camperon', name: 'Camperón', price: 17000, category: 'Abrigo', description: 'Abrigo largo estilo camperón' },
  { id: 'campera_desmontable', name: 'Campera desmontable', price: 18000, priceMax: 22000, category: 'Abrigo', description: 'Con capucha o forro removible' },
  { id: 'campera_inflable', name: 'Campera inflable/plumas', price: 17000, category: 'Abrigo', description: 'Campera acolchada con plumas' },
  { id: 'camperon_inflable', name: 'Camperón inflable o plumas', price: 19000, priceMax: 22000, category: 'Abrigo', description: 'Abrigo largo con relleno' },
  { id: 'tapado', name: 'Tapado/Sobretodo', price: 17000, priceMax: 19000, category: 'Abrigo', description: 'Abrigo elegante largo' },
  { id: 'tapado_plumas', name: 'Tapado de plumas', price: 19000, priceMax: 22000, category: 'Abrigo', description: 'Abrigo premium con plumas' },

  // Pilotos
  { id: 'piloto_simple', name: 'Piloto simple', price: 16000, priceMax: 20000, category: 'Abrigo', description: 'Piloto básico resistente' },
  { id: 'piloto_desmontable', name: 'Piloto desmontable', price: 22000, category: 'Abrigo', description: 'Piloto con partes removibles' },

  // Vestidos
  { id: 'vestido_comun', name: 'Vestido común', price: 16000, priceMax: 22000, category: 'Vestidos', description: 'Vestido casual o de día' },
  { id: 'vestido_fiesta', name: 'Vestido de fiesta', price: 24000, category: 'Vestidos', description: 'Vestido para eventos especiales' },
  { id: 'vestido_15', name: 'Vestido de 15 años', price: 36000, category: 'Vestidos', description: 'Vestido de quinceañera' },
  { id: 'vestido_novia', name: 'Vestido de novia', price: 44000, category: 'Vestidos', description: 'Vestido de boda' },

  // Ropa de cama y hogar
  { id: 'frazada', name: 'Frazada', price: 14000, priceMax: 20000, category: 'Hogar', description: 'Manta o frazada de cama' },
  { id: 'acolchado', name: 'Acolchado', price: 17000, priceMax: 22000, category: 'Hogar', description: 'Edredón acolchado' },
  { id: 'acolchado_plumas', name: 'Acolchado de plumas', price: 18000, priceMax: 24000, category: 'Hogar', description: 'Edredón premium con plumas' },
  { id: 'funda_colchon', name: 'Funda de colchón', price: 22000, priceMax: 32000, category: 'Hogar', description: 'Protector de colchón' },
  { id: 'funda_acolchado', name: 'Funda de acolchado', price: 16000, priceMax: 22000, category: 'Hogar', description: 'Funda para edredón' },
  { id: 'almohada', name: 'Almohada', price: 14000, priceMax: 16000, category: 'Hogar', description: 'Almohada estándar' },
  { id: 'almohada_plumas', name: 'Almohada plumas', price: 14000, priceMax: 16000, category: 'Hogar', description: 'Almohada con relleno de plumas' },

  // Cortinas y alfombras (por m²)
  { id: 'cortina_liviana', name: 'Cortina liviana (por m²)', price: 8400, category: 'Hogar', description: 'Cortina de tela ligera' },
  { id: 'cortina_pesada', name: 'Cortina pesada (por m²)', price: 9400, category: 'Hogar', description: 'Cortina de tela gruesa' },
  { id: 'cortina_forrada', name: 'Cortina forrada (por m²)', price: 10400, category: 'Hogar', description: 'Cortina con forro interior' },
  { id: 'alfombra', name: 'Alfombra (por m²)', price: 20000, category: 'Hogar', description: 'Limpieza de alfombra' }
];

const categories = ['Todos', 'Básico', 'Formal', 'Casual', 'Abrigo', 'Vestidos', 'Hogar', 'Trabajo', 'Pantalones', 'Polleras'];

const categoryIcons = {
  'Básico': Shirt,
  'Formal': Briefcase,
  'Casual': Users,
  'Abrigo': ShoppingBag,
  'Vestidos': Zap,
  'Hogar': Home,
  'Trabajo': Briefcase,
  'Pantalones': Shirt,
  'Polleras': Zap
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
      const updatedItems = selectedItems.filter(item => item.id !== serviceId);
      onItemsChange(updatedItems);
      return;
    }

    const existingItemIndex = selectedItems.findIndex(item => item.id === serviceId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...service,
        quantity
      };
      onItemsChange(updatedItems);
    } else {
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
          <CardTitle>Servicios de Tintorería - Precios Actualizados 2024</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
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
            
            <div className="flex gap-2 flex-wrap">
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

          {/* Services grid/list */}
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

      {selectedItems.length > 0 && (
        <ServicesSummary selectedServices={selectedItems} />
      )}
    </div>
  );
};

export default EnhancedDryCleaningOptions;
