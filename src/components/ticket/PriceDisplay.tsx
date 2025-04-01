
import React from 'react';
import { Label } from '@/components/ui/label';

interface PriceDisplayProps {
  totalPrice: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ totalPrice }) => (
  <div>
    <Label>Precio Total</Label>
    <div className="text-2xl font-bold mt-1">${totalPrice.toLocaleString()}</div>
  </div>
);
