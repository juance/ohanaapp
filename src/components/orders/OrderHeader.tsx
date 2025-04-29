
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderHeaderProps {
  title: string;
  description?: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ title, description }) => {
  return (
    <header className="mb-8">
      <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Volver al Inicio</span>
      </Link>
      <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
      {description && <p className="text-gray-500">{description}</p>}
    </header>
  );
};

export default OrderHeader;
