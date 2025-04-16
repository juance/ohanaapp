
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface LaundryOptionsProps {
  separateByColor: boolean;
  setSeparateByColor: (value: boolean) => void;
  delicateDry: boolean;
  setDelicateDry: (value: boolean) => void;
  stainRemoval: boolean;
  setStainRemoval: (value: boolean) => void;
  bleach: boolean;
  setBleach: (value: boolean) => void;
  noFragrance: boolean;
  setNoFragrance: (value: boolean) => void;
  noDry: boolean;
  setNoDry: (value: boolean) => void;
}

export const LaundryOptions: React.FC<LaundryOptionsProps> = ({
  separateByColor,
  setSeparateByColor,
  delicateDry,
  setDelicateDry,
  stainRemoval,
  setStainRemoval,
  bleach,
  setBleach,
  noFragrance,
  setNoFragrance,
  noDry,
  setNoDry
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Opciones de Lavado</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-separate-by-color"
            checked={separateByColor}
            onCheckedChange={setSeparateByColor}
          />
          <Label htmlFor="laundry-option-separate-by-color">Separar por Color</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-delicate-dry"
            checked={delicateDry}
            onCheckedChange={setDelicateDry}
          />
          <Label htmlFor="laundry-option-delicate-dry">Secado Delicado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-stain-removal"
            checked={stainRemoval}
            onCheckedChange={setStainRemoval}
          />
          <Label htmlFor="laundry-option-stain-removal">Quitamanchas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-bleach"
            checked={bleach}
            onCheckedChange={setBleach}
          />
          <Label htmlFor="laundry-option-bleach">Blanquear</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-no-fragrance"
            checked={noFragrance}
            onCheckedChange={setNoFragrance}
          />
          <Label htmlFor="laundry-option-no-fragrance">Sin Perfume</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="laundry-option-no-dry"
            checked={noDry}
            onCheckedChange={setNoDry}
          />
          <Label htmlFor="laundry-option-no-dry">Sin Secar</Label>
        </div>
      </div>
    </div>
  );
};
