
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Package,
  Ticket,
  Users,
  CheckSquare,
  BarChart3,
  DollarSign,
  Trash2
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Lavandería Ohana</h1>
        <p className="text-gray-500">Sistema de Gestión</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <MenuCard
          title="Crear Ticket"
          icon={<Ticket />}
          href="/tickets"
          description="Registrar nuevo servicio"
        />
        
        <MenuCard
          title="Pendientes de Entrega"
          icon={<CheckSquare />}
          href="/orders/pickup"
          description="Gestionar órdenes listas"
        />
        
        <MenuCard
          title="Órdenes Entregadas"
          icon={<CheckSquare />}
          href="/orders/delivered"
          description="Ver historial de entregas"
        />
        
        <MenuCard
          title="Inventario"
          icon={<Package />}
          href="/inventory"
          description="Gestionar productos"
        />
        
        <MenuCard
          title="Clientes"
          icon={<Users />}
          href="/clients"
          description="Ver directorio de clientes"
        />
        
        <MenuCard
          title="Dashboard"
          icon={<BarChart3 />}
          href="/dashboard"
          description="Estadísticas y reportes"
        />
        
        <MenuCard
          title="Gastos"
          icon={<DollarSign />}
          href="/expenses"
          description="Registro de gastos"
        />
        
        <MenuCard
          title="Reiniciar Datos"
          icon={<Trash2 />}
          href="/reset"
          description="Eliminar todos los datos"
          className="border-red-200 hover:border-red-300"
          iconClass="text-red-500"
        />
      </div>
    </div>
  );
};

interface MenuCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  description: string;
  className?: string;
  iconClass?: string;
}

const MenuCard = ({ title, icon, href, description, className, iconClass }: MenuCardProps) => (
  <Link to={href}>
    <Card className={`hover:shadow-md transition-all duration-200 ${className || ''}`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`mb-4 p-3 rounded-full bg-blue-100 ${iconClass || 'text-blue-600'}`}>
          {icon}
        </div>
        <h3 className="font-medium text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default Index;
